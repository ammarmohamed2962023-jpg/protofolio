import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters long').max(150).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters long').max(2000),
});

const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timeframe = 60 * 1000;
  const limit = 3;

  const userRequests = rateLimitMap.get(ip) || [];
  const validRequests = userRequests.filter((timestamp) => now - timestamp < timeframe);

  if (validRequests.length >= limit) {
    return true;
  }

  validRequests.push(now);
  rateLimitMap.set(ip, validRequests);
  return false;
}

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validation.data;
    const recipientEmail = process.env.CONTACT_EMAIL || 'ammar.mohamed.cs@gmail.com';
    const resendApiKey = process.env.RESEND_API_KEY;
    const gmailUser = process.env.GMAIL_USER || 'ammar.mohamed.cs@gmail.com';
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    const emailPromises = [];

    // Send via Gmail SMTP (Nodemailer) if App Password is configured
    if (gmailUser && gmailPass) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

      emailPromises.push(
        transporter.sendMail({
          from: `"Portfolio Contact" <${gmailUser}>`,
          to: recipientEmail,
          replyTo: email,
          subject: `[Portfolio Contact] ${subject || 'New Message from ' + name}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
              <h2 style="color: #00e5ff; border-bottom: 2px solid #00e5ff; padding-bottom: 10px;">New Contact Message (Gmail)</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Sender Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
              <div style="margin-top: 20px; padding: 15px; background: #f4f6f8; border-radius: 8px; border-left: 4px solid #00e5ff;">
                <h4 style="margin-top: 0;">Message:</h4>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
            </div>
          `,
        })
      );
    }

    // Send via Resend API if API Key is configured
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';

      emailPromises.push(
        resend.emails.send({
          from: fromEmail,
          to: recipientEmail,
          replyTo: email,
          subject: `[Portfolio Contact] ${subject || 'New Message from ' + name}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
              <h2 style="color: #00e5ff; border-bottom: 2px solid #00e5ff; padding-bottom: 10px;">New Contact Message (Resend)</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Sender Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
              <div style="margin-top: 20px; padding: 15px; background: #f4f6f8; border-radius: 8px; border-left: 4px solid #00e5ff;">
                <h4 style="margin-top: 0;">Message:</h4>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
            </div>
          `,
        })
      );
    }

    if (emailPromises.length > 0) {
      const results = await Promise.allSettled(emailPromises);
      results.forEach((res, i) => {
        if (res.status === 'rejected') {
          console.error(`Email Service ${i + 1} Error:`, res.reason);
        }
      });
    } else {
      console.log(`[Contact Submission (Dev Fallback)] From: ${name} (${email}) | Subject: ${subject || 'N/A'}`);
      console.log(`Message: ${message}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been received successfully. I will get back to you soon!',
        data: { name, email },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing message.' },
      { status: 500 }
    );
  }
}
