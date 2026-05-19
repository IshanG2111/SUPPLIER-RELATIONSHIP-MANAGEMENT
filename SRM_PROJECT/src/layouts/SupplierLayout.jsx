import { FileText, LayoutDashboard, Package, ShoppingCart, Star, UserRound, WalletCards } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout.jsx';

const supplierItems = [
  { label: 'Dashboard', to: '/supplier', icon: LayoutDashboard, end: true },
  { label: 'Products', to: '/supplier/products', icon: Package },
  { label: 'RFQs', to: '/supplier/rfqs', icon: FileText },
  { label: 'My Bids', to: '/supplier/bids', icon: WalletCards },
  { label: 'Orders', to: '/supplier/orders', icon: ShoppingCart },
  { label: 'Reviews', to: '/supplier/reviews', icon: Star },
  { label: 'Profile', to: '/supplier/profile', icon: UserRound },
];

export function SupplierLayout() {
  return (
    <DashboardLayout items={supplierItems} title="Supplier Portal" subtitle="Partner Workspace">
      <Outlet />
    </DashboardLayout>
  );
}
