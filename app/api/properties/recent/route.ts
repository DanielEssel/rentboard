import { NextRequest, NextResponse } from 'next/server'

// This is an example API route for fetching recent properties
// Place this file at: app/api/properties/recent/route.ts

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get('limit') || '4'

    // Replace this with your actual backend API call
    // Example: const response = await fetch(`${process.env.BACKEND_URL}/api/properties/recent?limit=${limit}`)
    
    // Example using your backend endpoint:
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
    const response = await fetch(`${backendUrl}/api/properties/recent?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any authentication headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
      // Add cache settings if needed
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    })

    if (!response.ok) {
      throw new Error('Failed to fetch from backend')
    }

    const data = await response.json()

    // Return the data to the frontend
    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    console.error('Error fetching recent properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent properties' },
      { status: 500 }
    )
  }
}