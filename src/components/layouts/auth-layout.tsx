import { Outlet } from 'react-router-dom';
import { Scale } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-card flex-col items-center justify-center p-8">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8 inline-flex p-4 bg-primary/10 rounded-full">
            <Scale className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">LexiA</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Your AI-powered legal assistant specialized in Belgian law
          </p>
          <div className="space-y-4 text-left">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-0.5">✓</div>
              <div>
                <h3 className="font-medium">Expert Legal Guidance</h3>
                <p className="text-sm text-muted-foreground">Get professional advice on Belgian law matters at a fraction of the cost</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-0.5">✓</div>
              <div>
                <h3 className="font-medium">Document Generation</h3>
                <p className="text-sm text-muted-foreground">Create legal documents instantly based on your specific needs</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-0.5">✓</div>
              <div>
                <h3 className="font-medium">Secure Case Management</h3>
                <p className="text-sm text-muted-foreground">Keep all your legal matters organized in one secure platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}