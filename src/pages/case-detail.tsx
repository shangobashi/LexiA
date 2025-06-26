import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getMockCaseById } from '@/lib/mock-data';
import { Case } from '@/types/case';
import { ChevronLeft, FileText, Settings, MessageSquare, Edit, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import ChatInterface from '@/components/chat/chat-interface';
import { Message } from '@/types/message';
import { v4 as uuidv4 } from 'uuid';
import { AIProvider, AIMessage, generateAIResponse } from '@/lib/ai-service';
import { config } from '@/lib/config';
import { analyzeCaseDocuments } from '@/lib/ai-service';
import { AIProviderSwitch } from '@/components/ai-provider-switch';

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [aiProvider, setAIProvider] = useState<AIProvider>(config.ai.defaultProvider);
  
  useEffect(() => {
    const fetchCase = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from API
        const fetchedCase = getMockCaseById(id || '');
        if (fetchedCase) {
          setCaseData(fetchedCase);
        } else {
          toast({
            title: 'Case not found',
            description: 'The requested case could not be found',
            variant: 'destructive',
          });
          navigate('/cases');
        }
      } catch (error) {
        console.error('Error fetching case', error);
        toast({
          title: 'Error',
          description: 'Failed to load case details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchCase();
    }
  }, [id, navigate, toast]);
  
  const handleSendMessage = async (content: string) => {
    if (!caseData) return;
    
    // Create new user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      caseId: caseData.id,
    };
    
    // Update state with user message immediately
    setCaseData({
      ...caseData,
      messages: [...caseData.messages, userMessage],
    });

    try {
      // Convert previous messages to AI format
      const messageHistory: AIMessage[] = caseData.messages.map(msg => ({
        role: msg.sender as 'user' | 'assistant',
        content: msg.content
      }));

      // Add the new message
      messageHistory.push({
        role: 'user',
        content
      });

      // Get AI response with current provider
      const response = await generateAIResponse(
        messageHistory, 
        caseData.systemPrompt,
        {
          provider: aiProvider,
          apiKey: aiProvider === 'openai' ? config.ai.openai.apiKey : config.ai.huggingface.apiKey
        }
      );

      if (response.error) {
        throw new Error(response.error);
      }

      // Create assistant message
      const assistantMessage: Message = {
        id: uuidv4(),
        content: response.message,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        caseId: caseData.id,
      };

      // Update state with assistant message
      setCaseData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, assistantMessage],
        };
      });
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: 'Error',
        description: 'Failed to get AI response. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleClearChat = () => {
    if (!caseData) return;
    setCaseData({
      ...caseData,
      messages: [],
    });
    
    toast({
      title: 'Conversation cleared',
      description: 'All messages have been removed from this case',
    });
  };
  
  const handleFileUpload = async (files: File[]) => {
    if (!caseData) return;
    
    try {
      const response = await analyzeCaseDocuments(
        files.map(f => f.name), 
        caseData.systemPrompt,
        {
          provider: aiProvider,
          apiKey: aiProvider === 'openai' ? config.ai.openai.apiKey : config.ai.huggingface.apiKey
        }
      );

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: 'Files analyzed',
        description: `${files.length} files have been processed`,
        variant: 'success',
      });
    } catch (error) {
      console.error('Error analyzing files:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze files. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handlePromptSave = (value: string) => {
    if (!caseData) return;
    setCaseData({
      ...caseData,
      systemPrompt: value,
    });
  };
  
  const handleProviderChange = (provider: AIProvider) => {
    setAIProvider(provider);
    toast({
      title: 'AI Provider Changed',
      description: `Switched to ${provider === 'openai' ? 'OpenAI (Premium)' : 'HuggingFace (Free)'}`,
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Case Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested case could not be found</p>
        <Button onClick={() => navigate('/cases')}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Back to Cases
        </Button>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Case Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/cases')}>
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to Cases
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{caseData.title}</h1>
            <p className="text-sm text-muted-foreground">Case ID: {caseData.caseId}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <AIProviderSwitch
            currentProvider={aiProvider}
            onProviderChange={handleProviderChange}
          />
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" /> Edit Case
          </Button>
          <Button size="sm">
            <ArrowRight className="h-4 w-4 mr-2" /> Actions
          </Button>
        </div>
      </div>
      
      {/* Case Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="border-b border-border">
            <TabsList className="bg-transparent px-0 h-12">
              <TabsTrigger value="chat" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-12 px-4">
                <MessageSquare className="h-4 w-4 mr-2" /> Chat
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-12 px-4">
                <FileText className="h-4 w-4 mr-2" /> Documents ({caseData.documents.length})
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-12 px-4">
                <Settings className="h-4 w-4 mr-2" /> Settings
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <TabsContent value="chat" className="h-full m-0 data-[state=active]:flex-1 data-[state=active]:flex data-[state=active]:flex-col">
              <ChatInterface
                messages={caseData.messages}
                onSend={handleSendMessage}
                onClearChat={handleClearChat}
                onFileUpload={handleFileUpload}
              />
            </TabsContent>
            
            <TabsContent value="documents" className="m-0 p-4 h-full overflow-auto">
              {caseData.documents.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Case Documents</h3>
                    <Button size="sm">
                      <FileText className="h-4 w-4 mr-2" /> Upload New
                    </Button>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {caseData.documents.map((doc) => (
                      <div 
                        key={doc.id}
                        className="border border-border rounded-lg p-4 bg-card hover:border-primary transition-colors"
                      >
                        <div className="flex items-start">
                          <div className="mr-3 p-2 rounded-md bg-background">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{doc.name}</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                              <span className="mx-2">•</span>
                              <span>{(doc.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-3 pt-3 border-t border-border">
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No documents yet</h3>
                  <p className="text-muted-foreground mb-4">Upload documents relevant to this case</p>
                  <Button>
                    <FileText className="h-4 w-4 mr-2" /> Upload Documents
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="settings" className="m-0 p-4 h-full overflow-auto">
              <div className="max-w-3xl">
                <h3 className="text-lg font-semibold mb-4">Case Settings</h3>
                
                <div className="space-y-6">
                  {/* Case Details Section */}
                  <div>
                    <h4 className="font-medium mb-3">Case Information</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm text-muted-foreground">Case Title</label>
                        <Input value={caseData.title} className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Case ID</label>
                        <Input value={caseData.caseId} disabled className="mt-1 bg-muted" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-sm text-muted-foreground">Description</label>
                        <textarea 
                          value={caseData.description}
                          className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Case Status Section */}
                  <div>
                    <h4 className="font-medium mb-3">Case Status</h4>
                    <div className="flex items-center space-x-4">
                      <Button 
                        variant={caseData.status === 'active' ? 'success' : 'outline'}
                        className="w-32"
                      >
                        Active
                      </Button>
                      <Button 
                        variant={caseData.status === 'pending' ? 'warning' : 'outline'}
                        className="w-32"
                      >
                        Pending
                      </Button>
                      <Button 
                        variant={caseData.status === 'closed' ? 'secondary' : 'outline'}
                        className="w-32"
                      >
                        Closed
                      </Button>
                    </div>
                  </div>
                  
                  {/* Save Button */}
                  <div className="pt-4 border-t border-border">
                    <Button className="w-32">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}