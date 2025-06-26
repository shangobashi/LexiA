import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SendHorizontal, PaperclipIcon, MicIcon, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/types/message';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInterfaceProps {
  messages: Message[];
  onSend: (message: string) => void;
  onClearChat: () => void;
  onFileUpload: (files: File[]) => void;
}

export default function ChatInterface({
  messages,
  onSend,
  onClearChat,
  onFileUpload,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      onFileUpload(files);
      
      // Reset the input
      e.target.value = '';
      
      toast({
        title: `${files.length} file(s) uploaded`,
        description: `${files.map(f => f.name).join(', ')}`,
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Start a new conversation</h3>
              <p className="text-sm text-muted-foreground">Ask LexiA about Belgian law questions</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex",
                    message.sender === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-4",
                      message.sender === 'user'
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border"
                    )}
                  >
                    {message.content}
                    
                    {message.files && message.files.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border/50">
                        <p className="text-xs font-semibold mb-1">Attachments:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.files.map((file, index) => (
                            <div 
                              key={index} 
                              className="flex items-center bg-background/20 rounded px-2 py-1 text-xs"
                            >
                              <PaperclipIcon className="h-3 w-3 mr-1" />
                              {file.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs mt-2 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-card border border-border max-w-[80%] rounded-lg p-4">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-accent animate-bounce" />
                      <div className="h-2 w-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="h-2 w-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <div className="border-t border-border p-4">
        {messages.length > 0 && (
          <div className="flex justify-end mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-muted-foreground"
              onClick={onClearChat}
            >
              <Trash2 className="h-3 w-3 mr-1" /> Clear conversation
            </Button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          
          <Button 
            type="button" 
            size="icon" 
            variant="outline"
            onClick={handleFileClick}
          >
            <PaperclipIcon className="h-5 w-5" />
          </Button>
          
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask LexiA a question..."
              className="w-full rounded-full pl-4 pr-10 py-2 bg-card border border-border focus:border-primary focus:ring-0 focus:outline-none"
            />
          </div>
          
          <Button type="submit" size="icon" disabled={!input.trim()}>
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}