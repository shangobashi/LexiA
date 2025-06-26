import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUploader } from '@/components/uploads/file-uploader';
import { useToast } from '@/hooks/use-toast';
import { Document } from '@/types/document';
import { Search, FileText, Filter, Plus, File, Trash2, Download, ExternalLink, FileCog, FolderPlus } from 'lucide-react';

export default function UploadsPage() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  useEffect(() => {
    // Simulate fetching documents
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        // Mock data - in real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockDocuments: Document[] = [
          {
            id: 'doc-1',
            name: 'Rental_Agreement_2025.pdf',
            size: 1450000,
            type: 'application/pdf',
            url: 'https://example.com/files/rental_agreement.pdf',
            uploadedAt: '2025-05-10T10:23:00Z',
            caseId: 'case-1'
          },
          {
            id: 'doc-2',
            name: 'Employment_Contract.docx',
            size: 285000,
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            url: 'https://example.com/files/contract.docx',
            uploadedAt: '2025-05-09T14:15:00Z',
            caseId: 'case-2'
          },
          {
            id: 'doc-3',
            name: 'Court_Decision_2025-05.pdf',
            size: 3250000,
            type: 'application/pdf',
            url: 'https://example.com/files/court_decision.pdf',
            uploadedAt: '2025-05-08T09:30:00Z',
            caseId: 'case-1'
          },
          {
            id: 'doc-4',
            name: 'Property_Photos.jpg',
            size: 4800000,
            type: 'image/jpeg',
            url: 'https://example.com/files/property.jpg',
            uploadedAt: '2025-05-07T16:42:00Z',
            caseId: 'case-3'
          },
          {
            id: 'doc-5',
            name: 'Witness_Statement.txt',
            size: 15000,
            type: 'text/plain',
            url: 'https://example.com/files/statement.txt',
            uploadedAt: '2025-05-06T11:20:00Z',
            caseId: 'case-2'
          }
        ];
        
        setDocuments(mockDocuments);
      } catch (error) {
        console.error('Error fetching documents', error);
        toast({
          title: 'Error',
          description: 'Failed to load documents',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDocuments();
  }, []);
  
  const handleFilesAdded = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    
    // Simulate file upload success
    toast({
      title: 'Files uploaded successfully',
      description: `${files.length} files have been uploaded`,
      variant: 'success',
    });
  };
  
  const handleFileRemove = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <div className="w-10 h-10 rounded bg-red-500/20 text-red-500 flex items-center justify-center">PDF</div>;
    } else if (fileType.includes('word') || fileType.includes('docx')) {
      return <div className="w-10 h-10 rounded bg-blue-500/20 text-blue-500 flex items-center justify-center">DOC</div>;
    } else if (fileType.includes('image')) {
      return <div className="w-10 h-10 rounded bg-green-500/20 text-green-500 flex items-center justify-center">IMG</div>;
    } else if (fileType.includes('text')) {
      return <div className="w-10 h-10 rounded bg-gray-500/20 text-gray-500 flex items-center justify-center">TXT</div>;
    } else {
      return <File className="w-10 h-10 text-muted-foreground" />;
    }
  };
  
  const filteredDocuments = searchTerm
    ? documents.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.caseId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : documents;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Manage and organize your legal documents
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Upload Files
        </Button>
      </div>
      
      {/* Document Management Tabs */}
      <Tabs defaultValue="all-documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all-documents">All Documents</TabsTrigger>
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="organize">Organize</TabsTrigger>
        </TabsList>
        
        {/* All Documents Tab */}
        <TabsContent value="all-documents" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search documents by name or case ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 py-2 rounded-md border border-input bg-background"
              />
            </div>
            
            <Button variant="outline" className="sm:w-auto">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>
          
          {/* Document List */}
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-lg h-28 animate-pulse" />
              ))}
            </div>
          ) : filteredDocuments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      {getFileIcon(doc.type)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{doc.name}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span>Case: {doc.caseId}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span>{formatFileSize(doc.size)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-3 pt-3 border-t border-border">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileCog className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border border-border rounded-lg bg-card p-8 text-center">
              {searchTerm ? (
                <>
                  <h3 className="font-medium text-lg mb-2">No documents match your search</h3>
                  <p className="text-muted-foreground mb-4">Try a different search term or clear your filters</p>
                  <Button variant="outline" onClick={() => setSearchTerm('')}>Clear search</Button>
                </>
              ) : (
                <>
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">No documents yet</h3>
                  <p className="text-muted-foreground mb-4">Upload your first document to get started</p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Upload Files
                  </Button>
                </>
              )}
            </div>
          )}
        </TabsContent>
        
        {/* Upload Files Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Upload Documents</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Upload documents such as contracts, court documents, photographs, or any other evidence relevant to your legal cases.
              </p>
              
              <FileUploader
                onFilesAdded={handleFilesAdded}
                onFileRemove={handleFileRemove}
                files={uploadedFiles}
                maxFiles={10}
                acceptedFileTypes={{
                  'application/pdf': ['.pdf'],
                  'application/msword': ['.doc'],
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                  'text/plain': ['.txt'],
                  'image/jpeg': ['.jpg', '.jpeg'],
                  'image/png': ['.png']
                }}
                maxSizeInBytes={20 * 1024 * 1024} // 20MB
              />
              
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    <p><span className="font-medium">Storage:</span> 124.5 MB used of 1 GB</p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button variant="outline">
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Add to Case
                    </Button>
                    <Button disabled={uploadedFiles.length === 0}>
                      Process Documents
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Organize Tab */}
        <TabsContent value="organize">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Organize Documents</h3>
              <p className="text-muted-foreground mb-4">Group documents into folders and assign them to cases</p>
              
              {/* This would be a drag-and-drop interface in the full implementation */}
              <div className="border border-border rounded-md p-8 text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 inline-block">
                  <FileCog className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Document organization coming soon</h3>
                <p className="text-sm text-muted-foreground mb-4">This feature is currently under development</p>
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Learn more
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}