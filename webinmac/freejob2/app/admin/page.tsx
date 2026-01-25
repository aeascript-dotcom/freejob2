import { requireAdmin } from '@/lib/admin-mock'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getMockCategories } from '@/lib/mock-categories'
import { dummyFreelancers } from '@/lib/dummy-freelancers'

export default async function AdminDashboard() {
  requireAdmin() // Mock: Always allow

  // Mock statistics
  const categories = getMockCategories()
  const categoriesCount = categories.length
  const usersCount = dummyFreelancers.length + 1 // +1 for admin
  const freelancersCount = dummyFreelancers.length

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your Freejob platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>All registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{usersCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Freelancers</CardTitle>
            <CardDescription>Active freelancers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{freelancersCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Categories</CardTitle>
            <CardDescription>Total categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{categoriesCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              • Manage job categories and tags
            </p>
            <p className="text-sm text-gray-600">
              • Oversee freelancer profiles
            </p>
            <p className="text-sm text-gray-600">
              • Review and moderate content
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
