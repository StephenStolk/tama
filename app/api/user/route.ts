import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongoose'
import User from '@/models/user.model'
import jwt from 'jsonwebtoken'

export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
    await connectToDatabase()

    const user = await User.findById(decoded.userId)
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const { password, ...userDetails } = user.toObject()

    return NextResponse.json({ user: userDetails }, { status: 200 })
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json({ message: 'Error fetching user data' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const token = request.headers.get('Authorization')?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
    await connectToDatabase()

    const { username, bio } = await request.json()

    // Update the user details in the database
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { username, bio },
      { new: true } // Return the updated document
    )

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const { password, ...userDetails } = user.toObject()

    return NextResponse.json({ user: userDetails }, { status: 200 })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ message: 'Error updating user' }, { status: 500 })
  }
}
