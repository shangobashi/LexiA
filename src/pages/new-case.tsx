import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUploader } from '@/components/uploads/file-uploader';
import { useToast } from '@/hooks/use-toast';
import { DEFAULT_SYSTEM_PROMPT } from '@/lib/mock-data';
import { v4 as uuidv4 } from 'uuid';
import { generateCaseId } from '@/lib/utils';
import { Document } from '@/types/document';

export default function NewCasePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const caseId = generateCaseId();
      const newCaseId = uuidv4();
      
      // In a real app, this would be a real API call to create the case
      toast({
        title: 'Case created successfully',
        description: `New case "${title}" has been created`,
        variant: 'success',
      });
      
      navigate(`/cases/${newCaseId}`);
    } catch (error) {
      toast({
        title: 'Failed to create case',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFilesAdded = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };
  
  const handleFileRemove = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create a New Case</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Case Details Section */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Case Details</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Case Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Rental Dispute with XYZ Property"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Case Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your legal issue in detail..."
                className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Document Upload Section */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Document Upload</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Upload relevant documents such as contracts, letters, photos, or any other evidence that may help with your case.
          </p>
          
          <FileUploader 
            onFilesAdded={handleFilesAdded}
            onFileRemove={handleFileRemove}
            files={files}
            maxFiles={10}
            acceptedFileTypes={{
              'application/pdf': ['.pdf'],
              'application/msword': ['.doc'],
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
              'text/plain': ['.txt'],
              'image/jpeg': ['.jpg', '.jpeg'],
              'image/png': ['.png']
            }}
            maxSizeInBytes={10 * 1024 * 1024} // 10MB
          />
        </div>
        
        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/cases')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !title.trim() || !description.trim()}
          >
            {isSubmitting ? 'Creating...' : 'Create Case'}
          </Button>
        </div>
      </form>
    </div>
  );
}