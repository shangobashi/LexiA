import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Copy, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PromptEditorProps {
  initialValue: string;
  onSave: (value: string) => void;
}

export default function PromptEditor({ initialValue, onSave }: PromptEditorProps) {
  const [prompt, setPrompt] = useState(initialValue);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (prompt !== initialValue) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [prompt, initialValue]);
  
  const handleSave = () => {
    onSave(prompt);
    setHasChanges(false);
    toast({
      title: "Prompt saved",
      description: "Your changes have been applied to the system",
      variant: "success",
    });
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Copied to clipboard",
      description: "The system prompt has been copied to your clipboard",
    });
  };
  
  const handleReset = () => {
    setPrompt(initialValue);
    setHasChanges(false);
    toast({
      title: "Prompt reset",
      description: "Changes have been discarded",
    });
  };
  
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <Tabs defaultValue="edit">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold">System Prompt</h3>
          <div className="flex space-x-2">
            <TabsList>
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <TabsContent value="edit" className="p-0">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-[400px] p-4 bg-background resize-none font-mono text-sm focus:outline-none"
              spellCheck="false"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="p-0">
          <div className="w-full h-[400px] overflow-auto p-4 bg-background">
            <pre className="font-mono text-sm whitespace-pre-wrap break-words">{prompt}</pre>
          </div>
        </TabsContent>
        
        <div className="flex items-center justify-between p-4 border-t border-border">
          <div>
            {hasChanges && (
              <span className="text-xs text-accent">
                You have unsaved changes
              </span>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              disabled={!hasChanges}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            
            <Button 
              size="sm" 
              onClick={handleSave}
              disabled={!hasChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </Tabs>
    </div>
  );
}