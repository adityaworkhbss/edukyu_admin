import DashboardLayout from '@/components/Layout/DashboardLayout';
import UserManagement from '@/components/Admin/UserManagement';

export default function UsersPage() {
  return (
    <DashboardLayout>
      <UserManagement />
    </DashboardLayout>
  );
}