import BrandLoader from '@/components/BrandLoader';

// Shown in the dashboard content area (sidebar persists) while any dashboard
// page's data loads — including switching widgets and date ranges.
export default function DashboardLoading() {
  return <BrandLoader />;
}
