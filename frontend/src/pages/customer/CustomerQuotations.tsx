import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../../services/api';
import { FileText, ChevronRight, Clock, CheckCircle2, XCircle, FileClock } from 'lucide-react';
import { cn } from '../../lib/utils';

export function CustomerQuotations() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApi('/customer/quotations')
      .then(data => {
        setQuotations(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'SENT_TO_CUSTOMER':
      case 'IN_NEGOTIATION':
        return { icon: FileClock, color: 'text-blue-600 bg-blue-100 border-blue-200', label: 'Action Required' };
      case 'ACCEPTED':
      case 'ORDER_CREATED':
        return { icon: CheckCircle2, color: 'text-green-600 bg-green-100 border-green-200', label: 'Accepted' };
      case 'REJECTED':
        return { icon: XCircle, color: 'text-red-600 bg-red-100 border-red-200', label: 'Rejected' };
      default:
        return { icon: Clock, color: 'text-gray-600 bg-gray-100 border-gray-200', label: status.replace(/_/g, ' ') };
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading your quotations...</div>;
  }

  if (error) {
    return <div className="bg-destructive/10 text-destructive p-4 rounded-lg border border-destructive/20">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Your Quotations</h2>
        <p className="text-muted-foreground">Review and manage your company's active deals.</p>
      </div>

      {quotations.length === 0 ? (
        <div className="text-center py-16 bg-card border rounded-xl border-dashed">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">No quotations found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mt-2">
            You don't have any active quotations associated with your account at this time.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {quotations.map(quote => {
            const statusConfig = getStatusConfig(quote.status);
            const StatusIcon = statusConfig.icon;
            // Only show statuses that make sense for a customer to see.
            // If they are DRAFT or PENDING_APPROVAL internally, we probably shouldn't even return them in the API, 
            // but if they are returned, we display them gracefully.
            return (
              <Link 
                key={quote.id} 
                to={`/customer/quotations/${quote.id}`}
                className="group block bg-card hover:bg-accent/5 transition-colors border rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/5 p-3 rounded-lg">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-lg">{quote.quote_number}</h3>
                        <span className={cn("inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border", statusConfig.color)}>
                          <StatusIcon size={12} />
                          <span className="capitalize">{statusConfig.label.toLowerCase()}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                        <span>Updated: {new Date(quote.updated_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="font-medium text-foreground">
                          {Number(quote.total_one_time) > 0 && `₹${Number(quote.total_one_time).toLocaleString()} One-time`}
                          {Number(quote.total_one_time) > 0 && Number(quote.total_mrr) > 0 && ' + '}
                          {Number(quote.total_mrr) > 0 && `₹${Number(quote.total_mrr).toLocaleString()}/mo`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-muted-foreground group-hover:text-primary transition-colors">
                    <ChevronRight />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
