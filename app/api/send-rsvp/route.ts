import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    // Validate input
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Create transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Email 1: Notification to organizer (hardcoded email)
    const organizerEmail = {
      from: process.env.GMAIL_USER,
      to: 'Braydenmiddlebrooks@gmail.com',
      subject: 'New RSVP Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C41E3A;">RSVP Notification</h2>
          <p style="color: #333; line-height: 1.6; font-size: 18px;">
            <strong>${name}</strong> has RSVP for this event!
          </p>
          <p style="color: #666; font-size: 14px;">
            Guest Email: ${email}
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            This is an automated notification. Please do not reply to this message.
          </p>
        </div>
      `,
    };

    // Email 2: Confirmation to guest
    const guestEmail = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'RSVP Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C41E3A;">Thank You for Your RSVP!</h2>
          <p style="color: #666; line-height: 1.6;">
            We've received your RSVP confirmation, ${name}. 
            We look forward to seeing you at our event!
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      `,
    };

    // Send both emails
    await transporter.sendMail(organizerEmail);
    await transporter.sendMail(guestEmail);

    return NextResponse.json(
      { message: 'RSVP confirmation sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send RSVP confirmation' },
      { status: 500 }
    );
  }
}
