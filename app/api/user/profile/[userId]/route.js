// app/api/user/profile/[userId]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import User from '@/models/User';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}