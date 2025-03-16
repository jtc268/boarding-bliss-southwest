import { NextResponse } from 'next/server';

// This is a simple API route that forwards requests to our Express server
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { confirmationNumber, firstName, lastName } = body;
    
    // Validate input
    if (!confirmationNumber || !firstName || !lastName) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields' 
      }, { status: 400 });
    }

    // Forward the request to our Express server
    const apiUrl = process.env.NODE_ENV === 'production'
      ? 'https://boardingbliss-api.your-domain.com/api/schedule-checkin'
      : 'http://localhost:3001/api/schedule-checkin';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ confirmationNumber, firstName, lastName }),
    });

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Server error'
    }, { status: 500 });
  }
} 