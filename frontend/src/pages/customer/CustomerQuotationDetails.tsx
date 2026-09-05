import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchApi } from '../../services/api';
import { ArrowLeft, CheckCircle2, Clock, FileText, Check } from 'lucide-react';

export function CustomerQuotationDetails() {
  const { id } = useParams();

  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    fetchApi(`/customer/quotations/${id}`)
      .then(data => {
        setQuote(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAccept = async () => {
    if (!confirm('Are you sure you want to accept this quotation? This action cannot be undone.')) return;
    
    setAccepting(true);
    try {
      const updated = await fetchApi(`/customer/quotations/${id}/accept`, { method: 'POST' });
      setQuote((prev: any) => ({ ...prev, status: updated.status }));
    } catch (err: any) {
      alert(err.message || 'Failed to accept quotation.');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading quotation details...</div>;
  }

  if (error || !quote) {
    return (
      <div className="space-y-4">
        <Link to="/customer/quotations" className="inline-flex items-center text-sm text-primary hover:underline">
          <ArrowLeft size={16} className="mr-1" /> Back to Quotations
        </Link>
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg border border-destructive/20">
          {error || 'Quotation not found'}
        </div>
      </div>
    );
  }

  const isAcceptable = quote.status === 'SENT_TO_CUSTOMER' || quote.status === 'IN_NEGOTIATION';
  const isAccepted = quote.status === 'ACCEPTED' || quote.status === 'ORDER_CREATED';

  const oneTimeLines = quote.lines.filter((l: any) => l.line_type === 'ONE_TIME');
  const recurringLines = quote.lines.filter((l: any) => l.line_type === 'SUBSCRIPTION');

  return (
    <div className="space-y-6 pb-24">
      <Link to="/customer/quotations" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={16} className="mr-1" /> Back to Quotations
      </Link>

      {/* Header */}
      <div className="bg-card border rounded-xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">{quote.quote_number}</h1>
            </div>
            <p className="text-muted-foreground text-lg">{quote.customer.company_name}</p>
          </div>
          
          <div className="flex flex-col md:items-end space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-sm font-medium border bg-muted">
              {isAccepted ? <CheckCircle2 size={16} className="text-green-600" /> : <Clock size={16} className="text-blue-600" />}
              <span className="capitalize">{quote.status.replace(/_/g, ' ').toLowerCase()}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Created: {new Date(quote.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b bg-muted/30">
          <h2 className="text-lg font-semibold">Quotation Items</h2>
        </div>
        
        {oneTimeLines.length > 0 && (
          <div className="p-0">
            <div className="px-6 py-3 bg-muted/10 font-medium text-sm text-muted-foreground border-b">
              One-Time Charges
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-card border-b">
                  <tr>
                    <th className="px-6 py-3 font-medium">Product</th>
                    <th className="px-6 py-3 font-medium text-right">Qty</th>
                    <th className="px-6 py-3 font-medium text-right">Unit Price</th>
                    <th className="px-6 py-3 font-medium text-right">Discount</th>
                    <th className="px-6 py-3 font-medium text-right">Final Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {oneTimeLines.map((line: any) => (
                    <tr key={line.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <p className="font-medium">{line.product_name}</p>
                        <p className="text-xs text-muted-foreground">{line.sku}</p>
                      </td>
                      <td className="px-6 py-4 text-right">{line.quantity}</td>
                      <td className="px-6 py-4 text-right">₹{Number(line.unit_price).toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-green-600">{Number(line.discount_pct) > 0 ? `${line.discount_pct}%` : '-'}</td>
                      <td className="px-6 py-4 text-right font-medium">₹{Number(line.final_unit_price).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {recurringLines.length > 0 && (
          <div className="p-0 border-t">
            <div className="px-6 py-3 bg-muted/10 font-medium text-sm text-muted-foreground border-b">
              Recurring Charges
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-card border-b">
                  <tr>
                    <th className="px-6 py-3 font-medium">Product</th>
                    <th className="px-6 py-3 font-medium">Interval</th>
                    <th className="px-6 py-3 font-medium text-right">Qty</th>
                    <th className="px-6 py-3 font-medium text-right">Unit Price</th>
                    <th className="px-6 py-3 font-medium text-right">Discount</th>
                    <th className="px-6 py-3 font-medium text-right">Final Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recurringLines.map((line: any) => (
                    <tr key={line.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <p className="font-medium">{line.product_name}</p>
                        <p className="text-xs text-muted-foreground">{line.sku}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium"><span className="bg-primary/10 text-primary px-2 py-1 rounded">{line.billing_interval}</span></td>
                      <td className="px-6 py-4 text-right">{line.quantity}</td>
                      <td className="px-6 py-4 text-right">₹{Number(line.unit_price).toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-green-600">{Number(line.discount_pct) > 0 ? `${line.discount_pct}%` : '-'}</td>
                      <td className="px-6 py-4 text-right font-medium">₹{Number(line.final_unit_price).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Totals & Action */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1"></div>
        <div className="w-full md:w-96 bg-card border rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Quotation Summary</h3>
          
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">One-Time Total:</span>
              <span className="font-medium">₹{Number(quote.total_one_time).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Recurring Total (MRR):</span>
              <span className="font-medium">₹{Number(quote.total_mrr).toLocaleString()}/mo</span>
            </div>
            
            {Number(quote.overall_discount_pct) > 0 && (
              <div className="flex justify-between items-center text-sm pt-2 border-t text-green-600">
                <span>Overall Discount:</span>
                <span>{quote.overall_discount_pct}%</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t mt-4">
            {isAcceptable ? (
              <button
                onClick={handleAccept}
                disabled={accepting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-3 px-4 rounded-md transition-colors flex justify-center items-center disabled:opacity-50"
              >
                {accepting ? 'Processing...' : (
                  <>
                    <Check className="mr-2" size={18} />
                    Accept Quotation
                  </>
                )}
              </button>
            ) : isAccepted ? (
              <div className="w-full bg-green-100 text-green-800 border border-green-200 font-medium py-3 px-4 rounded-md flex justify-center items-center">
                <CheckCircle2 className="mr-2" size={18} />
                Quotation Accepted
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-2">
                This quotation is not currently open for acceptance.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
