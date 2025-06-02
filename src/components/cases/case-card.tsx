import { Link } from 'react-router-dom';
import { cn, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Case } from '@/types/case';
import { FileText, MessageSquare, Calendar, ArrowRight } from 'lucide-react';

interface CaseCardProps {
  caseData: Case;
  index: number;
}

export default function CaseCard({ caseData, index }: CaseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link to={`/cases/${caseData.id}`}>
        <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-colors duration-200">
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium truncate">{caseData.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {caseData.description && caseData.description.length > 100 
                    ? `${caseData.description.slice(0, 100)}...` 
                    : caseData.description}
                </p>
              </div>
              
              <div className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                caseData.status === 'active' && "bg-success/20 text-success",
                caseData.status === 'closed' && "bg-muted text-muted-foreground",
                caseData.status === 'pending' && "bg-warning/20 text-warning"
              )}>
                {caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1)}
              </div>
            </div>
            
            <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                <span>{caseData.documents.length} documents</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>{caseData.messages.length} messages</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(new Date(caseData.createdAt))}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <div className="text-sm">
                <span className="text-muted-foreground">Case ID: </span>
                <span className="font-medium">{caseData.caseId}</span>
              </div>
              
              <button className="text-primary flex items-center text-sm font-medium hover:underline">
                View case <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}