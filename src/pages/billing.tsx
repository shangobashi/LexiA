import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, CheckCircle, Calendar, Loader2, Download } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

// Mock invoice type
interface Invoice {
  id: string;
  amount: number;
  status: 'paid' | 'pending';
  date: string;
  items: { name: string; amount: number }[];
}

// Mock subscription plan type
interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  isCurrent: boolean;
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data fetching
    const fetchBillingData = async () => {
      try {
        // Mock invoices data
        setInvoices([
          {
            id: 'INV-2025-001',
            amount: 29.99,
            status: 'paid',
            date: '2025-05-01',
            items: [
              { name: 'Premium Plan - May 2025', amount: 29.99 }
            ]
          },
          {
            id: 'INV-2025-002',
            amount: 29.99,
            status: 'paid',
            date: '2025-04-01',
            items: [
              { name: 'Premium Plan - April 2025', amount: 29.99 }
            ]
          },
          {
            id: 'INV-2025-003',
            amount: 29.99,
            status: 'paid',
            date: '2025-03-01',
            items: [
              { name: 'Premium Plan - March 2025', amount: 29.99 }
            ]
          }
        ]);
        
        // Mock plans data
        setPlans([
          {
            id: 'plan-free',
            name: 'Free Trial',
            description: 'For individuals who want to try Dominus',
            price: 0,
            features: [
              '5 legal consultations',
              '2 document generations',
              'Access to basic Belgian law resources',
              'Limited document storage (25MB)'
            ],
            isCurrent: false
          },
          {
            id: 'plan-basic',
            name: 'Basic',
            description: 'For individuals with occasional legal needs',
            price: 14.99,
            features: [
              '25 legal consultations per month',
              '10 document generations',
              'Access to comprehensive Belgian law resources',
              'Document storage (100MB)',
              'Email support'
            ],
            isCurrent: false
          },
          {
            id: 'plan-premium',
            name: 'Premium',
            description: 'For individuals with regular legal requirements',
            price: 29.99,
            features: [
              'Unlimited legal consultations',
              'Unlimited document generations',
              'Priority access to latest legal updates',
              'Document storage (1GB)',
              'Priority email & phone support',
              'Custom system prompt configurations'
            ],
            isCurrent: true
          }
        ]);
      } catch (error) {
        console.error('Error fetching billing data', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBillingData();
  }, []);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and payment methods
        </p>
      </div>
      
      {/* Subscription Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Current Subscription</CardTitle>
          <CardDescription>Your subscription renews on June 1, 2025</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Premium Plan</p>
                <p className="text-sm text-muted-foreground">Unlimited consultations and document generation</p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center">
              <div className="text-right mr-6">
                <p className="font-semibold text-lg">{formatCurrency(29.99)}</p>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>
              <div className="px-3 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
                Active
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-0">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">Next billing date: </span>
            <span className="font-medium ml-1">June 1, 2025</span>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">Change Plan</Button>
            <Button variant="outline" size="sm">Update Payment</Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Billing Information Tabs */}
      <Tabs defaultValue="plans" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
        </TabsList>
        
        {/* Subscription Plans Tab */}
        <TabsContent value="plans" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id} className={`${plan.isCurrent ? 'border-primary' : ''}`}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-success mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={plan.isCurrent ? 'outline' : 'default'} 
                    disabled={plan.isCurrent}
                  >
                    {plan.isCurrent ? 'Current Plan' : 'Switch Plan'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View and download your past invoices</CardDescription>
            </CardHeader>
            <CardContent>
              {invoices.length > 0 ? (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="py-3 px-4 text-left text-sm font-medium">Invoice</th>
                        <th className="py-3 px-4 text-left text-sm font-medium">Date</th>
                        <th className="py-3 px-4 text-left text-sm font-medium">Amount</th>
                        <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
                        <th className="py-3 px-4 text-right text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-t border-border">
                          <td className="py-3 px-4 text-sm">{invoice.id}</td>
                          <td className="py-3 px-4 text-sm">{new Date(invoice.date).toLocaleDateString()}</td>
                          <td className="py-3 px-4 text-sm">{formatCurrency(invoice.amount)}</td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              invoice.status === 'paid' 
                                ? 'bg-success/20 text-success' 
                                : 'bg-warning/20 text-warning'
                            }`}>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-sm">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              PDF
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No invoices found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Payment Methods Tab */}
        <TabsContent value="payment-methods">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-background rounded-md mr-3">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Remove</Button>
                  </div>
                </div>
              </div>
              
              <Button className="mt-4">
                <CreditCard className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}