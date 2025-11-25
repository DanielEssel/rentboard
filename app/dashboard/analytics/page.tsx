"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Eye, Heart, Home, TrendingDown, Activity } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface Property {
  id: string
  title: string
  views: number | null
  favorites: number | null
  created_at: string
  property_type: string
  price: number
  available: boolean
}

const COLORS = ["#006D77", "#83C5BE", "#FFDDD2", "#EDF6F9", "#FFB703"]

export default function AdvancedAnalytics() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    checkAuthAndFetch()
  }, [])

  const checkAuthAndFetch = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
        return
      }
      await fetchAnalytics(session.user.id)
    } catch (error) {
      console.error("Auth error:", error)
      router.push('/auth/login')
    }
  }

  const fetchAnalytics = async (userId: string) => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("properties")
        .select("id, title, views, favorites, created_at, property_type, price, available")
        .eq("user_id", userId)
        .order("created_at", { ascending: true })

      if (!error && data) {
        setProperties(data as Property[])
      }
    } catch (err) {
      console.error("Error fetching analytics:", err)
    } finally {
      setLoading(false)
    }
  }

  // Stats Calculations
  const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0)
  const totalFavorites = properties.reduce((sum, p) => sum + (p.favorites || 0), 0)
  const totalProperties = properties.length
  const availableProperties = properties.filter(p => p.available).length
  const engagementRate = totalViews === 0 ? 0 : Math.round((totalFavorites / totalViews) * 100)
  const avgViewsPerProperty = totalProperties === 0 ? 0 : Math.round(totalViews / totalProperties)

  // Views Over Time Data
  const viewsOverTimeData = properties.map((p) => ({
    date: new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    views: p.views || 0,
    favorites: p.favorites || 0,
  }))

  // Property Type Distribution
  const propertyTypeData = properties.reduce((acc, p) => {
    const existing = acc.find(item => item.name === p.property_type)
    if (existing) {
      existing.value += 1
    } else {
      acc.push({ name: p.property_type, value: 1 })
    }
    return acc
  }, [] as { name: string; value: number }[])

  // Top Performing Properties
  const topProperties = [...properties]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)

  // Performance by Price Range
  const priceRanges = [
    { range: "< 500", min: 0, max: 500 },
    { range: "500-1000", min: 500, max: 1000 },
    { range: "1000-2000", min: 1000, max: 2000 },
    { range: "2000+", min: 2000, max: Infinity },
  ]

  const performanceByPrice = priceRanges.map(({ range, min, max }) => {
    const filtered = properties.filter(p => p.price >= min && p.price < max)
    const avgViews = filtered.length > 0
      ? Math.round(filtered.reduce((sum, p) => sum + (p.views || 0), 0) / filtered.length)
      : 0
    return { range, views: avgViews }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006D77] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-xl">
          <CardContent className="p-12 text-center">
            <div className="mb-6 inline-block p-6 bg-gradient-to-br from-[#006D77]/10 to-[#83C5BE]/10 rounded-full">
              <Activity className="w-16 h-16 text-[#006D77]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Analytics Yet</h3>
            <p className="text-gray-600 mb-6">Add properties to see your analytics dashboard</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#006D77] to-[#83C5BE] bg-clip-text text-transparent mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Track performance and engagement across your properties
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatCard
          icon={<Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
          label="Total Views"
          value={totalViews.toLocaleString()}
          change={`${avgViewsPerProperty} avg/property`}
          positive={true}
        />
        <StatCard
          icon={<Heart className="w-4 h-4 sm:w-5 sm:h-5" />}
          label="Favorites"
          value={totalFavorites.toLocaleString()}
          change={`${engagementRate}% rate`}
          positive={true}
        />
        <StatCard
          icon={<Home className="w-4 h-4 sm:w-5 sm:h-5" />}
          label="Properties"
          value={totalProperties.toString()}
          change={`${availableProperties} available`}
          positive={true}
        />
        <StatCard
          icon={<Activity className="w-4 h-4 sm:w-5 sm:h-5" />}
          label="Engagement"
          value={`${engagementRate}%`}
          change="Fav/View ratio"
          positive={engagementRate > 5}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Views & Favorites Over Time */}
        <Card className="col-span-1 xl:col-span-2 border-0 shadow-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Performance Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-64 sm:h-80 w-full p-4">
            <div style={{ width: '100%', height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
              <LineChart data={viewsOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  angle={-45} 
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #ccc',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#006D77" 
                  strokeWidth={2}
                  name="Views"
                  dot={{ fill: '#006D77' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="favorites" 
                  stroke="#FFB703" 
                  strokeWidth={2}
                  name="Favorites"
                  dot={{ fill: '#FFB703' }}
                />
              </LineChart>
            </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Property Type Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Property Types</CardTitle>
          </CardHeader>
          <CardContent className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={window.innerWidth < 640 ? 60 : 80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Performance by Price Range */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Views by Price Range (GHS)</CardTitle>
          </CardHeader>
          <CardContent className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceByPrice}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #ccc',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="views" fill="#006D77" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performing Properties */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Top Performing Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {topProperties.map((property, index) => (
                <div 
                  key={property.id} 
                  className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#006D77] to-[#83C5BE] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {property.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {property.property_type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-[#006D77]">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="font-bold text-sm sm:text-base">{property.views || 0}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-[#FFB703]">
                        <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="font-bold text-sm sm:text-base">{property.favorites || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>  

  )
} 

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  change: string
  positive: boolean
}

function StatCard({ icon, label, value, change, positive }: StatCardProps) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-gray-600 text-xs sm:text-sm mb-1 truncate">{label}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">{value}</p>
            <div className="flex items-center gap-1 text-xs">
              {positive ? (
                <TrendingUp className="w-3 h-3 text-emerald-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-gray-500" />
              )}
              <span className={positive ? "text-emerald-600" : "text-gray-500"}>
                {change}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 bg-gradient-to-br from-[#006D77]/10 to-[#83C5BE]/10 p-2 sm:p-3 rounded-xl text-[#006D77]">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}