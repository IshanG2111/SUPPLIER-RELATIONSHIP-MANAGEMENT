import {
  BarChart3,
  Boxes,
  ClipboardCheck,
  FileText,
  GitCompare,
  LayoutDashboard,
  PackageOpen,
  Settings,
  ShoppingCart,
  Star,
  Truck,
  Users,
} from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout.jsx';

const adminItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Suppliers', to: '/admin/suppliers', icon: Users },
  { label: 'Products', to: '/admin/products', icon: Boxes },
  { label: 'RFQ Management', to: '/admin/rfqs', icon: FileText },
  { label: 'Bid Comparison', to: '/admin/bids', icon: GitCompare },
  { label: 'Purchase Orders', to: '/admin/orders', icon: ShoppingCart },
  { label: 'Goods Receiving', to: '/admin/receiving', icon: PackageOpen },
  { label: 'Reviews', to: '/admin/reviews', icon: Star },
  { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
  { label: 'Compliance', to: '/admin/compliance', icon: ClipboardCheck },
  { label: 'Logistics', to: '/admin/logistics', icon: Truck },
];

export function AdminLayout() {
  return (
    <DashboardLayout items={adminItems} title="SRM Portal" subtitle="Admin Console">
      <Outlet />
    </DashboardLayout>
  );
}
