import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CaseCard from '@/components/cases/case-card';
import { Plus, Search, Filter } from 'lucide-react';
import { Case } from '@/types/case';
import { getMockCases } from '@/lib/mock-data';

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data fetching
    const fetchCases = async () => {
      setIsLoading(true);
      try {
        // In a real app, we would fetch from an API
        const allCases = getMockCases();
        setCases(allCases);
      } catch (error) {
        console.error('Error fetching cases', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCases();
  }, []);
  
  // Filter cases based on search term
  const filteredCases = searchTerm
    ? cases.filter(
        (c) =>
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.caseId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : cases;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cases</h1>
          <p className="text-muted-foreground">
            Manage and organize all your legal cases
          </p>
        </div>
        <Button asChild>
          <Link to="/new-case">
            <Plus className="mr-2 h-4 w-4" /> New Case
          </Link>
        </Button>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search cases by title, description or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 py-2 rounded-md border border-input bg-background"
          />
        </div>
        
        <Button variant="outline" className="sm:w-auto">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>
      
      {/* Case List */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg h-52 animate-pulse" />
          ))}
        </div>
      ) : filteredCases.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCases.map((caseItem, index) => (
            <CaseCard key={caseItem.id} caseData={caseItem} index={index} />
          ))}
        </div>
      ) : (
        <div className="border border-border rounded-lg bg-card p-8 text-center">
          {searchTerm ? (
            <>
              <h3 className="font-medium text-lg mb-2">No cases match your search</h3>
              <p className="text-muted-foreground mb-4">Try a different search term or clear your filters</p>
              <Button variant="outline" onClick={() => setSearchTerm('')}>Clear search</Button>
            </>
          ) : (
            <>
              <h3 className="font-medium text-lg mb-2">No cases yet</h3>
              <p className="text-muted-foreground mb-4">Create your first case to get started with Dominus</p>
              <Button asChild>
                <Link to="/new-case">
                  <Plus className="mr-2 h-4 w-4" /> Create a case
                </Link>
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}