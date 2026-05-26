import { Card, CardHeader } from '../../components/Card.jsx';
import { DataTable } from '../../components/DataTable.jsx';
import { PageHeader } from '../../components/PageHeader.jsx';
import { StatusBadge } from '../../components/StatusBadge.jsx';
import { Button } from '../../components/Button.jsx';
import { Modal } from '../../components/Modal.jsx';
import { FormField, inputClass } from '../../components/FormField.jsx';
import { useDisclosure } from '../../hooks/useDisclosure.js';
import { bids as mockBids } from '../../data/mockData.js';
import { currency } from '../../utils/formatters.js';
import { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';

const initialForm = {
  rfqPackage: 'RFQ-24061',
  price: '',
  delivery: '',
  warranty: '',
};

export function MyBids() {
  const submitBidModal = useDisclosure(false);
  const [bidsList, setBidsList] = useState(() => {
    const saved = localStorage.getItem('srm_bids');
    if (saved) return JSON.parse(saved);
    return mockBids.slice(0, 3).map((b, i) => ({
      id: `BID-${i + 1}`,
      rfqPackage: `RFQ-2406${i + 1}`,
      price: b.price,
      delivery: b.delivery,
      warranty: b.warranty,
      score: b.score,
      best: b.best,
    }));
  });
  
  const [form, setForm] = useState(initialForm);
  const [isParsing, setIsParsing] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1/SUPPLIER-RELATIONSHIP-MANAGEMENT/SRM_PROJECT/backend/api').replace(/\/$/, '');

  useEffect(() => {
    fetch(`${apiBaseUrl}/bids.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.bids)) {
          setBidsList(data.bids);
          localStorage.setItem('srm_bids', JSON.stringify(data.bids));
        }
      })
      .catch((err) => {
        console.error('Failed to fetch Bids from API, using localStorage:', err);
      });
  }, [apiBaseUrl]);

  const updateForm = (field, value) => {
    setForm(curr => ({ ...curr, [field]: value }));
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsParsing(true);
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
    }
    setPdfBlobUrl(URL.createObjectURL(file));
    try {
      const { extractTextFromPdf, parseBidPdf } = await import('../../utils/pdfParser.js');
      const text = await extractTextFromPdf(file);
      const parsed = parseBidPdf(text, file.name);
      setForm({
        rfqPackage: parsed.rfqPackage,
        price: parsed.price,
        delivery: parsed.delivery,
        warranty: parsed.warranty,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsParsing(false);
    }
  };

  const resetAndClose = () => {
    setForm(initialForm);
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    }
    submitBidModal.close();
  };

  const handleSave = () => {
    const newBid = {
      id: `BID-${bidsList.length + 1}`,
      rfqPackage: form.rfqPackage,
      price: Number(form.price) || 120000,
      delivery: form.delivery || '15 Days',
      warranty: form.warranty || '2 Years',
      score: 85,
      best: false,
    };
    const updated = [newBid, ...bidsList];
    setBidsList(updated);
    localStorage.setItem('srm_bids', JSON.stringify(updated));

    fetch(`${apiBaseUrl}/bids.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBid),
    })
      .then((res) => res.json())
      .catch((err) => console.error('Failed to sync Bid to database:', err));

    resetAndClose();
  };

  return (
    <>
      <PageHeader 
        title="My Bids" 
        description="Track submitted quotations and commercial evaluation status." 
        action={
          <Button onClick={submitBidModal.open}>
            <Plus className="h-4 w-4" /> Submit Bid
          </Button>
        }
      />
      <Card>
        <CardHeader title="Submitted Bids" subtitle="Supplier quotation history" />
        <DataTable
          data={bidsList}
          columns={[
            { key: 'rfqPackage', header: 'Bid Package' },
            { key: 'price', header: 'Quoted Price', render: (row) => currency(row.price) },
            { key: 'delivery', header: 'Delivery' },
            { key: 'warranty', header: 'Warranty' },
            { key: 'score', header: 'Evaluation Score' },
            { key: 'best', header: 'Status', render: (row) => <StatusBadge status={row.best ? 'Approved' : 'Evaluating'} /> },
          ]}
        />
      </Card>

      <Modal title="Submit Bid Quotation" isOpen={submitBidModal.isOpen} onClose={resetAndClose} size={pdfBlobUrl ? 'xxl' : 'lg'}>
        <div className={`grid gap-6 ${pdfBlobUrl ? 'md:grid-cols-2' : ''}`}>
          <div>
            <div className="mb-4 rounded-lg border border-dashed border-slate-300 p-4 text-center dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Upload Quotation PDF to Auto-Fill Bid Form</p>
              <input
                type="file"
                accept=".pdf"
                className="text-xs text-slate-600 dark:text-slate-400 block mx-auto cursor-pointer"
                onChange={handlePdfUpload}
                disabled={isParsing}
              />
              <div className="mt-2">
                <a href={`${import.meta.env.BASE_URL}samples/bid-quotation.pdf`} download className="text-xs text-brand-600 hover:text-brand-500 underline font-semibold">
                  Download Sample Bid Quotation
                </a>
              </div>
              {isParsing && <p className="mt-1.5 text-[11px] text-blue-500 animate-pulse">Extracting quotation details...</p>}
            </div>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Target RFQ Package">
                  <input 
                    className={inputClass} 
                    value={form.rfqPackage} 
                    onChange={e => updateForm('rfqPackage', e.target.value)} 
                    placeholder="e.g. RFQ-24061"
                  />
                </FormField>
                <FormField label="Quoted Price ($)">
                  <input 
                    className={inputClass} 
                    type="number"
                    value={form.price} 
                    onChange={e => updateForm('price', e.target.value)} 
                    placeholder="120000"
                  />
                </FormField>
                <FormField label="Delivery Lead Time">
                  <input 
                    className={inputClass} 
                    value={form.delivery} 
                    onChange={e => updateForm('delivery', e.target.value)} 
                    placeholder="e.g. 15 Days"
                  />
                </FormField>
                <FormField label="Warranty Period">
                  <input 
                    className={inputClass} 
                    value={form.warranty} 
                    onChange={e => updateForm('warranty', e.target.value)} 
                    placeholder="e.g. 2 Years"
                  />
                </FormField>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={resetAndClose}>Cancel</Button>
                <Button onClick={handleSave}><Check className="h-4 w-4" /> Submit Proposal</Button>
              </div>
            </form>
          </div>

          {pdfBlobUrl && (
            <div className="flex flex-col h-[520px] rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 p-2">
              <div className="mb-2 flex items-center justify-between px-2 text-xs font-semibold text-slate-500">
                <span>Verification Quotation Document View</span>
                <button
                  type="button"
                  onClick={() => {
                    URL.revokeObjectURL(pdfBlobUrl);
                    setPdfBlobUrl(null);
                  }}
                  className="text-rose-600 hover:underline"
                >
                  Hide PDF
                </button>
              </div>
              <iframe
                src={pdfBlobUrl}
                title="PDF Verification"
                className="w-full flex-1 rounded border border-slate-200 dark:border-slate-800 bg-white"
              />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
