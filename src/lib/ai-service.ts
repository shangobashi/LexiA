import OpenAI from 'openai';

// Initialize OpenAI client
let openai: OpenAI;

export type AIProvider = 'openai' | 'huggingface';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  message: string;
  error?: string;
}

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
}

export const initializeAI = (config: AIConfig) => {
  if (config.provider === 'openai') {
    openai = new OpenAI({
      apiKey: config.apiKey,
      dangerouslyAllowBrowser: true // Note: In production, API calls should be made from the backend
    });
  }
};

const generateHuggingFaceResponse = async (
  messages: AIMessage[],
  systemPrompt: string,
  apiKey: string
): Promise<AIResponse> => {
  try {
    // Using Mistral-7B-Instruct model through HuggingFace
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          inputs: `<system>${systemPrompt}</system>\n${messages.map(m => 
            `<${m.role}>${m.content}</${m.role}>`).join('\n')}`
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get response from HuggingFace');
    }

    const data = await response.json();
    return {
      message: data[0].generated_text
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    return {
      message: '',
      error: 'Failed to generate AI response. Please try again.'
    };
  }
};

export const generateAIResponse = async (
  messages: AIMessage[],
  systemPrompt: string,
  config: AIConfig
): Promise<AIResponse> => {
  if (config.provider === 'huggingface') {
    return generateHuggingFaceResponse(messages, systemPrompt, config.apiKey);
  }

  // OpenAI implementation
  if (!openai) {
    return {
      message: '',
      error: 'AI service not initialized. Please provide an API key.'
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview', // or 'gpt-3.5-turbo' for a more cost-effective option
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return {
      message: completion.choices[0]?.message?.content || ''
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    return {
      message: '',
      error: 'Failed to generate AI response. Please try again.'
    };
  }
};

export const analyzeCaseDocuments = async (
  documents: string[],
  systemPrompt: string,
  config: AIConfig
): Promise<AIResponse> => {
  if (config.provider === 'huggingface') {
    return generateHuggingFaceResponse([{
      role: 'user',
      content: `Please analyze the following documents and provide a summary:\n\n${documents.join('\n\n')}`
    }], systemPrompt, config.apiKey);
  }

  // OpenAI implementation
  if (!openai) {
    return {
      message: '',
      error: 'AI service not initialized. Please provide an API key.'
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Please analyze the following documents and provide a summary:\n\n${documents.join('\n\n')}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    return {
      message: completion.choices[0]?.message?.content || ''
    };
  } catch (error) {
    console.error('Error analyzing documents:', error);
    return {
      message: '',
      error: 'Failed to analyze documents. Please try again.'
    };
  }
};

interface AIServiceConfig {
  provider: AIProvider;
  openaiApiKey?: string;
  huggingfaceApiKey?: string;
}

class AIService {
  private config: AIServiceConfig = {
    provider: 'openai',
    openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    huggingfaceApiKey: import.meta.env.VITE_HUGGINGFACE_API_KEY,
  };

  setProvider(provider: AIProvider) {
    this.config.provider = provider;
  }

  async chat(messages: any[]) {
    if (this.config.provider === 'openai') {
      return this.chatWithOpenAI(messages);
    } else {
      return this.chatWithHuggingFace(messages);
    }
  }

  private async chatWithOpenAI(messages: any[]) {
    if (!this.config.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async chatWithHuggingFace(messages: any[]) {
    if (!this.config.huggingfaceApiKey) {
      throw new Error('HuggingFace API key not configured');
    }

    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.huggingfaceApiKey}`,
      },
      body: JSON.stringify({
        inputs: messages.map(m => m.content).join('\n'),
        parameters: {
          temperature: 0.7,
          max_new_tokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('HuggingFace API request failed');
    }

    const data = await response.json();
    return data[0].generated_text;
  }
}

export const aiService = new AIService(); 