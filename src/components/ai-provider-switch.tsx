import { AIProvider } from '@/lib/ai-service';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Brain } from 'lucide-react';

interface AIProviderSwitchProps {
  currentProvider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
}

export function AIProviderSwitch({ currentProvider, onProviderChange }: AIProviderSwitchProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Brain className="h-4 w-4" />
          {currentProvider === 'openai' ? 'OpenAI (Premium)' : 'HuggingFace (Free)'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => onProviderChange('openai')}
          className="gap-2"
        >
          <Brain className="h-4 w-4" />
          OpenAI (Premium)
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onProviderChange('huggingface')}
          className="gap-2"
        >
          <Brain className="h-4 w-4" />
          HuggingFace (Free)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 