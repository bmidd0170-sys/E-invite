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
      subject: 'Patricia\'s Birthday Celebration Kimpton Resort',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C41E3A;">Thank You for Your RSVP!</h2>
          <p style="color: #666; line-height: 1.6;">
            We've received your RSVP confirmation, ${name}. 
            We look forward to seeing you at our event!
          </p>
          <p style="color: #333; line-height: 1.6; margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #C41E3A;">
            <strong>Important Reminder:</strong> You need to RSVP to the resort directly. 
            <br><br>
            <a href="https://www.ihg.com/kimptonhotels/hotels/us/en/find-hotels/select-roomrate?fromRedirect=true&qSrt=sBR&qIta=99801505&icdv=99801505&qDest=West%20Bay,%20Bay%20Islands,%20Honduras&qErm=false&qSlH=RTBGR&qRms=1&qAdlt=1&qChld=0&qCiD=12&qCiMy=052026&qCoD=16&qCoMy=052026&qGrpCd=MP1&qAAR=&qRtP=6CBARC&setPMCookies=true&qSHBrC=KI&qpMbw=0&qpMn=1&srb_u=1&qRmFltr=" style="color: #C41E3A; text-decoration: none; font-weight: bold;">Click here to book your room at Kimpton Resort</a>
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
