import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { userAPI, courtsAPI, paymentsAPI, bookingsAPI } from '@/utils/api'
import { ScaleLoader } from 'react-spinners'
import { useAuth } from '@/contexts/AuthContext'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart as ReBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

const Overview = () => {
  const { userRole } = useAuth()

  // Admin-only global user stats
  const { data: userStats, isLoading: loadingUsers } = useQuery({
    queryKey: ['overview', 'users', userRole === 'admin' ? 'admin' : 'self'],
    queryFn: async () => (await userAPI.getUserStats()).data,
    enabled: userRole === 'admin',
    staleTime: 5 * 60 * 1000,
  })

  // Admin-only courts snapshot
  const { data: courtsData, isLoading: loadingCourts } = useQuery({
    queryKey: ['overview', 'courts', userRole === 'admin' ? 'admin' : 'self'],
    queryFn: async () => (await courtsAPI.getAllCourts()).data,
    enabled: userRole === 'admin',
    staleTime: 5 * 60 * 1000,
  })

  const { data: paymentsData, isLoading: loadingPayments } = useQuery({
    queryKey: ['overview', 'payments', userRole === 'admin' ? 'admin' : 'user'],
    queryFn: async () => {
      if (userRole === 'admin') {
        return (await paymentsAPI.getAdminPayments({ limit: 50 })).data
      }
      return (await paymentsAPI.getPaymentHistory({ limit: 50 })).data
    },
    enabled: !!userRole,
    staleTime: 2 * 60 * 1000,
  })

  const totalCourts = userRole === 'admin' ? (courtsData?.pagination?.total || courtsData?.data?.length || 0) : 0
  const totalUsers = userRole === 'admin' ? (userStats?.totalUsers || 0) : 0
  const totalMembers = userRole === 'admin' ? (userStats?.totalMembers || 0) : 0

  // User/member specific stats
  const { user } = useAuth()
  const { data: pendingBookings } = useQuery({
    queryKey: ['overview', 'pending', user?.uid],
    queryFn: async () => (await bookingsAPI.getPendingByUid(user.uid)).data,
    enabled: !!user && userRole !== 'admin',
    staleTime: 60 * 1000,
  })
  const { data: approvedBookings } = useQuery({
    queryKey: ['overview', 'approved', user?.uid],
    queryFn: async () => (await bookingsAPI.getApprovedByUid(user.uid)).data,
    enabled: !!user && userRole !== 'admin',
    staleTime: 60 * 1000,
  })
  const { data: confirmedBookings } = useQuery({
    queryKey: ['overview', 'confirmed', user?.uid],
    queryFn: async () => (await bookingsAPI.getConfirmedByUid(user.uid)).data,
    enabled: !!user && userRole !== 'admin',
    staleTime: 60 * 1000,
  })

  // Revenue line data (uses recent payments of current user/admin)
  const revenueLineData = useMemo(() => {
    const payments = paymentsData?.payments || []
    const lastTen = payments.slice(0, 10).reverse()
    return lastTen.map((p, i) => ({
      name: `#${i + 1}`,
      revenue: Number(p.finalPrice || 0)
    }))
  }, [paymentsData])

  // Courts by type bar data
  const courtsByType = useMemo(() => {
    const items = courtsData?.data || []
    const map = new Map()
    items.forEach(c => {
      const key = (c.type || 'Other').toString()
      map.set(key, (map.get(key) || 0) + 1)
    })
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }))
  }, [courtsData])

  // Members vs Others pie data
  const membersPieData = useMemo(() => {
    if (userRole === 'admin') {
      const members = totalMembers
      const others = Math.max(0, totalUsers - totalMembers)
      return [
        { name: 'Members', value: members },
        { name: 'Others', value: others },
      ]
    }
    const pending = (pendingBookings?.bookings || []).length
    const approved = (approvedBookings || []).length
    const confirmed = (confirmedBookings || []).length
    return [
      { name: 'Pending', value: pending },
      { name: 'Approved', value: approved },
      { name: 'Confirmed', value: confirmed },
    ]
  }, [userRole, totalUsers, totalMembers, pendingBookings, approvedBookings, confirmedBookings])

  const loading = loadingUsers || loadingCourts || loadingPayments

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Overview</h1>

      {/* KPI cards */}
      {userRole === 'admin' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-5">
            <p className="text-sm text-gray-500">Total Users</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-3xl font-semibold text-gray-900">{loading ? <ScaleLoader color="#10b981" height={18} /> : totalUsers}</p>
              <div className="h-12 w-28">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[{ n: 1, v: totalUsers * 0.6 }, { n: 2, v: totalUsers * 0.8 }, { n: 3, v: totalUsers }] }>
                    <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-5">
            <p className="text-sm text-gray-500">Members</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-3xl font-semibold text-gray-900">{loading ? <ScaleLoader color="#10b981" height={18} /> : totalMembers}</p>
              <div className="h-12 w-28">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[{ n: 1, v: totalMembers * 0.5 }, { n: 2, v: totalMembers * 0.7 }, { n: 3, v: totalMembers }]}>
                    <Line type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-5">
            <p className="text-sm text-gray-500">Courts</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-3xl font-semibold text-gray-900">{loading ? <ScaleLoader color="#10b981" height={18} /> : totalCourts}</p>
              <div className="h-12 w-28">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[{ n: 1, v: totalCourts * 0.7 }, { n: 2, v: totalCourts * 0.85 }, { n: 3, v: totalCourts }]}>
                    <Line type="monotone" dataKey="v" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-5">
            <p className="text-sm text-gray-500">Pending Bookings</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-3xl font-semibold text-gray-900">{(pendingBookings?.bookings || []).length}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-5">
            <p className="text-sm text-gray-500">Approved Bookings</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-3xl font-semibold text-gray-900">{(approvedBookings || []).length}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-5">
            <p className="text-sm text-gray-500">Confirmed Bookings</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-3xl font-semibold text-gray-900">{(confirmedBookings || []).length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{userRole === 'admin' ? 'Recent Revenue' : 'My Last Payments'}</h2>
            <span className="text-xs text-gray-500">last 10</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueLineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {userRole === 'admin' ? (
        <div className="bg-white rounded-lg border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Courts by Type</h2>
            <span className="text-xs text-gray-500">current distribution</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={courtsByType} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>
        ) : (
        <div className="bg-white rounded-lg border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">My Bookings Status</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={[
                { name: 'Pending', count: (pendingBookings?.bookings || []).length },
                { name: 'Approved', count: (approvedBookings || []).length },
                { name: 'Confirmed', count: (confirmedBookings || []).length },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{userRole === 'admin' ? 'Members vs Others' : 'My Bookings Breakdown'}</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={membersPieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={2}
                >
                  {membersPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={userRole === 'admin' ? (index === 0 ? '#6366f1' : '#94a3b8') : ['#f59e0b', '#10b981', '#6366f1'][index % 3]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview


