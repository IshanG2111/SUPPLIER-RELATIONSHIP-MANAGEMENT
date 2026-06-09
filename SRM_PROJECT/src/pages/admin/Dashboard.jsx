import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, GitCompare, ShoppingCart, PackageOpen, ReceiptText, 
  Users, AlertTriangle, Star, Clock, ArrowRight, Activity, Bell
} from 'lucide-react';
import { Card, CardHeader } from '../../components/Card.jsx';
import { PageHeader } from '../../components/PageHeader.jsx';
import { currency } from '../../utils/formatters.js';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    activeRfqs: 3,
    openBids: 8,
    awardedContracts: 4,
    pendingGrns: 2,
    receiptsToday: 3,
    varianceCount: 1,
    pendingInvoices: 2,
    processingPayments: 1,
    overduePayments: 0,
    avgRating: 4.5,
    topSupplier: 'Apex Industrial Components',
    riskSuppliers: 1,
    pendingReceiptsCount: 3
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, text: 'RFQ-2026-0012 published under Mechanical category', time: '10 mins ago', type: 'rfq' },
    { id: 2, text: 'New bid proposal received from Delta Precision Parts', time: '45 mins ago', type: 'bid' },
    { id: 3, text: 'PO-2026-0011 issued to Apex Industrial Components', time: '2 hrs ago', type: 'po' },
    { id: 4, text: 'Warehouse logged GRN REC-5840 for PO-88021', time: '3 hrs ago', type: 'grn' },
    { id: 5, text: 'Supplier commercial invoice INV-2026-0001 submitted', time: '5 hrs ago', type: 'invoice' },
    { id: 6, text: 'Outbound payment completed for Invoice INV-5398', time: 'Yesterday', type: 'payment' }
  ]);

  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1/SUPPLIER-RELATIONSHIP-MANAGEMENT/SRM_PROJECT/backend/api').replace(/\/$/, '');

  useEffect(() => {
    // Attempt dynamic stats count if server is active
    Promise.all([
      fetch(`${apiBaseUrl}/rfqs.php`).then(res => res.json()).catch(() => null),
      fetch(`${apiBaseUrl}/bids.php`).then(res => res.json()).catch(() => null),
      fetch(`${apiBaseUrl}/purchase_orders.php`).then(res => res.json()).catch(() => null),
      fetch(`${apiBaseUrl}/invoices.php`).then(res => res.json()).catch(() => null),
      fetch(`${apiBaseUrl}/ratings.php`).then(res => res.json()).catch(() => null),
      fetch(`${apiBaseUrl}/receipts.php`).then(res => res.json()).catch(() => null)
    ]).then(([rfqsData, bidsData, posData, invsData, ratsData, recsData]) => {
      let updated = { ...stats };
      if (rfqsData && Array.isArray(rfqsData.rfqs)) {
        updated.activeRfqs = rfqsData.rfqs.filter(r => r.status === 'Active' || r.status === 'Under Evaluation').length;
      }
      if (bidsData && Array.isArray(bidsData.bids)) {
        updated.openBids = bidsData.bids.length;
      }
      if (posData && Array.isArray(posData.purchase_orders)) {
        updated.awardedContracts = posData.purchase_orders.filter(p => p.status === 'fulfilled' || p.status === 'delivered').length;
        updated.pendingGrns = posData.purchase_orders.filter(p => p.status === 'shipped').length;
        updated.pendingReceiptsCount = posData.purchase_orders.filter(p => p.status === 'awaiting_receipt').length;
      }
      if (invsData && Array.isArray(invsData.invoices)) {
        updated.pendingInvoices = invsData.invoices.filter(i => i.status === 'Submitted' || i.status === 'Under Review').length;
        updated.processingPayments = invsData.invoices.filter(i => i.status === 'Approved' || i.status === 'Payment Processing').length;
      }
      if (ratsData && Array.isArray(ratsData.suppliers)) {
        const sum = ratsData.suppliers.reduce((s, x) => s + x.rating, 0);
        updated.avgRating = ratsData.suppliers.length > 0 ? Number((sum / ratsData.suppliers.length).toFixed(1)) : 4.5;
        updated.topSupplier = ratsData.suppliers[0]?.name || 'Apex Industrial Components';
        updated.riskSuppliers = ratsData.suppliers.filter(x => x.feasibility_score < 80).length;
      }
      if (recsData && Array.isArray(recsData.receipts)) {
        updated.receiptsToday = recsData.receipts.length;
        updated.varianceCount = recsData.receipts.filter(r => r.received > r.accepted).length;
      }
      setStats(updated);
    }).catch(err => console.warn('Offline mode for dashboard KPIs:', err));
  }, [apiBaseUrl]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'rfq': return <FileText className="h-4 w-4 text-violet-600" />;
      case 'bid': return <GitCompare className="h-4 w-4 text-sky-600" />;
      case 'po': return <ShoppingCart className="h-4 w-4 text-emerald-600" />;
      case 'grn': return <PackageOpen className="h-4 w-4 text-blue-600" />;
      case 'invoice': return <ReceiptText className="h-4 w-4 text-amber-600" />;
      default: return <Activity className="h-4 w-4 text-slate-600" />;
    }
  };

  const getActivityBg = (type) => {
    switch (type) {
      case 'rfq': return 'bg-violet-50 dark:bg-violet-950/20';
      case 'bid': return 'bg-sky-50 dark:bg-sky-950/20';
      case 'po': return 'bg-emerald-50 dark:bg-emerald-950/20';
      case 'grn': return 'bg-blue-50 dark:bg-blue-950/20';
      case 'invoice': return 'bg-amber-50 dark:bg-amber-950/20';
      default: return 'bg-slate-100 dark:bg-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Admin Command Center" 
        description="Comprehensive operation views spanning procurement sourcing, logistics cargo receiving, and finance audit logging."
      />

      {/* KPI Section Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        
        {/* Sourcing KPIs */}
        <Card className="p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-black uppercase text-violet-600 tracking-wider">Sourcing</span>
            <FileText className="h-4 w-4 text-violet-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Active RFQs</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{stats.activeRfqs}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Open Bids</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{stats.openBids}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Awarded contracts</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{stats.awardedContracts}</span>
            </div>
          </div>
        </Card>

        {/* Warehouse / Logistics KPIs */}
        <Card className="p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-black uppercase text-blue-600 tracking-wider">Warehouse</span>
            <PackageOpen className="h-4 w-4 text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Pending GRNs</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{stats.pendingGrns}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Receipts Today</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{stats.receiptsToday}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Quantity Variances</span>
              <span className="font-bold text-rose-600">{stats.varianceCount} variance</span>
            </div>
          </div>
        </Card>

        {/* Pending Receipts Card */}
        <Link 
          to="/admin/receipts-reviews" 
          state={{ activeTab: 'pending_receipts' }}
          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-500/50 dark:hover:border-brand-500/50 transition duration-150 flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2 w-full">
            <span className="text-xs font-black uppercase text-amber-600 tracking-wider">Logistics</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="space-y-1 mt-2">
            <p className="text-xs text-slate-500 font-medium">Pending Receipts</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.pendingReceiptsCount}</span>
              <span className="text-xs text-amber-600 font-semibold bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded">Awaiting GRN</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:text-brand-500 mt-3 border-t border-slate-50 dark:border-slate-800/50 pt-2 w-full">
            <span>Verify shipments</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Finance KPIs */}
        <Card className="p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-black uppercase text-amber-600 tracking-wider">Finance</span>
            <ReceiptText className="h-4 w-4 text-amber-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Invoices Review</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{stats.pendingInvoices}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Payment Processing</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{stats.processingPayments}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Overdue Payments</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{stats.overduePayments}</span>
            </div>
          </div>
        </Card>

        {/* Supplier Rankings */}
        <Card className="p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-black uppercase text-emerald-600 tracking-wider">Suppliers</span>
            <Users className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Average Rating</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{stats.avgRating} / 5.0 ⭐</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Top Supplier</span>
              <span className="font-bold text-emerald-600 truncate max-w-[120px] block text-right">{stats.topSupplier}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">At-Risk Suppliers</span>
              <span className="font-bold text-rose-600">{stats.riskSuppliers} flagged</span>
            </div>
          </div>
        </Card>

      </div>

      {/* Main Panel grid */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Activity Feed Widget */}
        <Card className="md:col-span-2">
          <CardHeader title="Command Activity Log" subtitle="Real-time timeline actions generated by procurement workflows" />
          <div className="p-5 pt-0 space-y-4">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex gap-4 items-start hover:bg-slate-50/50 dark:hover:bg-slate-900/30 p-2 rounded-lg transition">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${getActivityBg(act.type)}`}>
                  {getActivityIcon(act.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{act.text}</p>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {act.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Sourcing Operations Console & Top Suppliers Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Sourcing Operations" subtitle="Quick shortcuts to standard procurement stages" />
            <div className="p-5 pt-0 space-y-3">
              <Link to="/admin/rfqs" className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-900/50 dark:hover:bg-slate-900 rounded-xl text-xs font-bold transition group">
                <span className="text-slate-800 dark:text-slate-200">1. Sourcing RFQ Board</span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/admin/bids" className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-900/50 dark:hover:bg-slate-900 rounded-xl text-xs font-bold transition group">
                <span className="text-slate-800 dark:text-slate-200">2. Sourcing Bid Matrix</span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/admin/orders" className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-900/50 dark:hover:bg-slate-900 rounded-xl text-xs font-bold transition group">
                <span className="text-slate-800 dark:text-slate-200">3. Purchase Orders</span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/admin/receipts-reviews" className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-900/50 dark:hover:bg-slate-900 rounded-xl text-xs font-bold transition group">
                <span className="text-slate-800 dark:text-slate-200">4. Receipts & Reviews</span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/admin/invoices" className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-900/50 dark:hover:bg-slate-900 rounded-xl text-xs font-bold transition group">
                <span className="text-slate-800 dark:text-slate-200">5. Invoices & Billing</span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Card>

          <Card>
            <CardHeader title="Top Suppliers" subtitle="Performance Score Rankings" />
            <div className="p-5 pt-0 space-y-3">
              {[
                { name: 'Apex Industrial Components', score: 96, category: 'Mechanical' },
                { name: 'Vector Packaging Co.', score: 92, category: 'Packaging' },
                { name: 'Global Components', score: 89, category: 'Electrical' }
              ].map((supp, index) => (
                <Link
                  to="/admin/suppliers"
                  key={supp.name}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-brand-300 dark:border-slate-800 dark:hover:border-brand-500/50 bg-slate-50/50 hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-900 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-black text-slate-700 dark:text-slate-300">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-50">{supp.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{supp.category} Components</p>
                    </div>
                  </div>
                  <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700 dark:bg-slate-800 dark:text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition duration-150 shadow-sm">
                    {supp.score}% Score
                  </span>
                </Link>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
