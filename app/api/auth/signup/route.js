import dbConnect from '@/lib/connectDb';
import User from '@/models/User';
import { NextResponse } from 'next/server';


// Named export for POST method
export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { firstName, lastName, email, password, phone } = body;
    
    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      phone
    });
    
    // Generate verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();
    
    // TODO: Send verification email
    // await sendVerificationEmail(email, verificationToken);
    
    // Remove sensitive data from response
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt
    };
    
    return NextResponse.json(
      {
        success: true,
        data: userResponse,
        message: 'User registered successfully. Please verify your email.'
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: messages.join(', ') },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}