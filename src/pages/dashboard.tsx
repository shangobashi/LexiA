import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, MessageSquare, CreditCard, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import CaseCard from '@/components/cases/case-card';
import { useAuth } from '@/hooks/use-auth';
import { Case } from '@/types/case';
import { getMockCases } from '@/lib/mock-data';

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentCases, setRecentCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating data fetching
    const fetchCases = async () => {
      setIsLoading(true);
      try {
        // In a real app, we would fetch from an API
        const cases = getMockCases();
        setRecentCases(cases.slice(0, 3)); // Get 3 most recent cases
      } catch (error) {
        console.error('Error fetching cases', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCases();
  }, []);
  
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.displayName || 'User'}</h1>
          <p className="text-muted-foreground">
            Here's an overview of your legal activities and resources
          </p>
        </div>
        <Button asChild>
          <Link to="/new-case">
            <Plus className="mr-2 h-4 w-4" /> New Case
          </Link>
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +6 this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Credits Remaining</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="text-xs text-muted-foreground">
              Premium plan active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Next Renewal</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))}</div>
            <p className="text-xs text-muted-foreground">
              Auto-renew enabled
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Cases */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Cases</h2>
          <Button variant="outline" asChild>
            <Link to="/cases">View all</Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg h-52 animate-pulse" />
            ))}
          </div>
        ) : recentCases.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentCases.map((caseItem, index) => (
              <CaseCard key={caseItem.id} caseData={caseItem} index={index} />
            ))}
          </div>
        ) : (
          <div className="border border-border rounded-lg bg-card p-8 text-center">
            <h3 className="font-medium text-lg mb-2">No cases yet</h3>
            <p className="text-muted-foreground mb-4">Create your first case to get started with Dominus</p>
            <Button asChild>
              <Link to="/new-case">
                <Plus className="mr-2 h-4 w-4" /> Create a case
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}