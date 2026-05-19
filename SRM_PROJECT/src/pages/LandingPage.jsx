import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, FileCheck2, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { Card } from '../components/Card.jsx';
import { procurementSpend, rfqActivity } from '../data/mockData.js';
import { RfqPieChart, SpendChart } from '../components/Charts.jsx';

const capabilities = [
  { icon: FileCheck2, title: 'Source-to-award', text: 'Manage RFQs, supplier bids, evaluations, and award decisions from one operating surface.' },
  { icon: Truck, title: 'Order visibility', text: 'Track purchase orders, goods receipts, delivery variance, and supplier exceptions.' },
  { icon: ShieldCheck, title: 'Supplier governance', text: 'Keep supplier status, risk, performance, and compliance decisions visible.' },
];

export function LandingPage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">Enterprise procurement SaaS</span>
            <h1 className="max-w-2xl text-4xl font-bold text-slate-950 sm:text-5xl">SRM Portal</h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              A production-style supplier relationship platform for procurement teams and strategic suppliers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/admin">
                <Button>
                  Admin workspace <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/supplier">
                <Button variant="secondary">Supplier workspace</Button>
              </Link>
            </div>
          </div>
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-950">Procurement Spend</p>
                <p className="text-xs text-slate-500">Direct, indirect, and services categories</p>
              </div>
              <BarChart3 className="h-5 w-5 text-brand-600" />
            </div>
            <SpendChart data={procurementSpend} />
          </Card>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
        {capabilities.map((item) => (
          <Card key={item.title} className="p-5">
            <item.icon className="h-6 w-6 text-brand-600" />
            <h2 className="mt-4 text-base font-semibold text-slate-950">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>
          </Card>
        ))}
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <Card className="p-5">
          <RfqPieChart data={rfqActivity} />
        </Card>
      </section>
    </main>
  );
}
