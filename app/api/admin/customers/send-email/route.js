import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import User from '@/models/User';
import { verifyAdminToken } from '@/lib/serverAuth';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
  const authHeader = request.headers.get('authorization');
const userId = authHeader?.replace('Bearer ', '');
const adminUser = await verifyAdminToken(userId);
    
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { customerIds, subject, message, sendToAll } = body;

    let customers;
    if (sendToAll) {
      customers = await User.find({ isActive: true }).select('email firstName lastName');
    } else {
      customers = await User.find({ _id: { $in: customerIds } }).select('email firstName lastName');
    }

    // Configure email transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Send emails
    const emailPromises = customers.map(customer => {
      return transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: customer.email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Hello ${customer.firstName},</h2>
            <p>${message}</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              This email was sent from your e-commerce admin panel.
            </p>
          </div>
        `
      });
    });

    await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      message: `Email sent to ${customers.length} customer(s)`
    });

  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 }
    );
  }
}