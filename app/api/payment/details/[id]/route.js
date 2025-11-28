// app/api/payment/details/[paymentId]/route.js
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function GET(request, { params }) {
  try {
    const { paymentId } = params;

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(paymentId);

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        email: payment.email,
        contact: payment.contact,
        bank: payment.bank,
        wallet: payment.wallet,
        vpa: payment.vpa,
        card: payment.card,
        created_at: payment.created_at,
      },
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}