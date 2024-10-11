// pages/api/contact.js
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    // Parse the incoming request
    const data = await request.json();
    const { email, subject, message } = data;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME, // Your Gmail username
        pass: process.env.EMAIL_PASSWORD, // Your Gmail password
      },
    });

    // Setup email data with enhanced HTML
    const mailOptions = {
      from: email, // The email entered by the user
      to: process.env.EMAIL_USERNAME, // Your email address
      subject: `Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9; color: #333;">
          <h2 style="text-align: center; color: #4a4a4a; font-size: 24px;">New Contact Form Submission</h2>
          
          <p style="font-size: 16px; line-height: 1.5;">
            <strong style="color: #555;">From:</strong> ${email}
          </p>
          <p style="font-size: 16px; line-height: 1.5;">
            <strong style="color: #555;">Subject:</strong> ${subject}
          </p>
          <div style="padding: 15px; margin-top: 10px; border-left: 3px solid #4a90e2; background-color: #fff;">
            <p style="font-size: 16px; color: #333; line-height: 1.7;">
              <strong style="color: #555;">Message:</strong><br>
              ${message}
            </p>
          </div>

          <hr style="border: 1px solid #e0e0e0; margin: 30px 0;">

          <p style="font-size: 12px; color: #999; text-align: center;">
            © ${new Date().getFullYear()} CouponRI. All rights reserved.
          </p>
        </div>
      `,
    };

    // Send email using Nodemailer
    await transporter.sendMail(mailOptions);

    // Return a success response
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);

    // Return an error response
    return new Response(JSON.stringify({ success: false, message: 'Failed to send email' }), { status: 500 });
  }
}
