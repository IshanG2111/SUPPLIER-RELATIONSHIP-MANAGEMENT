import { Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout.jsx';
import { AdminLayout } from '../layouts/AdminLayout.jsx';
import { SupplierLayout } from '../layouts/SupplierLayout.jsx';
import { LandingPage } from '../pages/LandingPage.jsx';
import { LoginPage } from '../pages/auth/LoginPage.jsx';
import { RegisterPage } from '../pages/auth/RegisterPage.jsx';
import { ForgotPassword } from '../pages/auth/ForgotPassword.jsx';
import { AdminDashboard } from '../pages/admin/Dashboard.jsx';
import { SupplierManagement } from '../pages/admin/SupplierManagement.jsx';
import { ProductManagement } from '../pages/admin/ProductManagement.jsx';
import { RFQManagement } from '../pages/admin/RFQManagement.jsx';
import { RFQDetail } from '../pages/admin/RFQDetail.jsx';
import { BidComparison } from '../pages/admin/BidComparison.jsx';
import { PurchaseOrders } from '../pages/admin/PurchaseOrders.jsx';
import { GoodsReceiving } from '../pages/admin/GoodsReceiving.jsx';
import { Reviews } from '../pages/admin/Reviews.jsx';
import { Analytics } from '../pages/admin/Analytics.jsx';
import { Settings } from '../pages/admin/Settings.jsx';
import { SupplierDashboard } from '../pages/supplier/Dashboard.jsx';
import { SupplierProducts } from '../pages/supplier/Products.jsx';
import { SupplierRFQs } from '../pages/supplier/RFQs.jsx';
import { MyBids } from '../pages/supplier/MyBids.jsx';
import { SupplierOrders } from '../pages/supplier/Orders.jsx';
import { SupplierReviews } from '../pages/supplier/Reviews.jsx';
import { SupplierProfile } from '../pages/supplier/Profile.jsx';
import { NotFound } from '../pages/NotFound.jsx';

export const appRoutes = [
  // Default route → Login/Role Selection
  { path: '/', element: <LoginPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  {
    element: <PublicLayout />,
    children: [
      { path: '/home', element: <LandingPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'suppliers', element: <SupplierManagement /> },
      { path: 'products', element: <ProductManagement /> },
      { path: 'rfqs', element: <RFQManagement /> },
      { path: 'rfqs/:id', element: <RFQDetail /> },
      { path: 'bids', element: <BidComparison /> },
      { path: 'orders', element: <PurchaseOrders /> },
      { path: 'receiving', element: <GoodsReceiving /> },
      { path: 'reviews', element: <Reviews /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'settings', element: <Settings /> },
      { path: 'compliance', element: <Navigate to="/admin/reviews" replace /> },
      { path: 'logistics', element: <Navigate to="/admin/orders" replace /> },
    ],
  },
  {
    path: '/supplier',
    element: <SupplierLayout />,
    children: [
      { index: true, element: <SupplierDashboard /> },
      { path: 'products', element: <SupplierProducts /> },
      { path: 'rfqs', element: <SupplierRFQs /> },
      { path: 'bids', element: <MyBids /> },
      { path: 'orders', element: <SupplierOrders /> },
      { path: 'reviews', element: <SupplierReviews /> },
      { path: 'profile', element: <SupplierProfile /> },
    ],
  },
  { path: '*', element: <NotFound /> },
];
