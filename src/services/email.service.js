const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send email to doctor about verification status
 */
const sendDoctorVerificationEmail = async (doctor, status, rejectionReason = null) => {
  let subject = "";
  let html = "";

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  if (status === "verified") {
    subject = "Congratulations! Your Doctor Account Has Been Verified";
    html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Doctor Verification Approved</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; }
          .header { background: #F33B7D; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 30px; background: #f9f9f9; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #F33B7D; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          .button:hover { background: #d92b6b; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888; font-size: 12px; }
          .highlight { color: #F33B7D; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Account Verified!</h1>
          </div>
          <div class="content">
            <h2>Dear Dr. ${doctor.fullName},</h2>
            <p>We are delighted to inform you that your doctor account has been <span class="highlight">verified</span> successfully!</p>
            <p>You now have full access to all doctor features including:</p>
            <ul>
              <li>Accept and manage patient appointments</li>
              <li>Access your doctor dashboard</li>
              <li>Update your availability and schedule</li>
              <li>Connect with patients through the platform</li>
            </ul>
            <p>Start helping patients by logging into your dashboard:</p>
            <a href="${frontendUrl}/doctor/dashboard" class="button">Go to Dashboard</a>
            <p style="margin-top: 20px;">If you have any questions, please don't hesitate to contact our support team.</p>
            <p>Welcome to Flora Family! 🌸</p>
          </div>
          <div class="footer">
            <p>© 2026 Flora. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  } else if (status === "rejected") {
    subject = "Update on Your Doctor Account Application";
    html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Doctor Verification Rejected</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; }
          .header { background: #e74c3c; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 30px; background: #f9f9f9; border-radius: 0 0 8px 8px; }
          .reason-box { background: #fef2f2; border-left: 4px solid #e74c3c; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .button { display: inline-block; background: #F33B7D; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          .button:hover { background: #d92b6b; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Status Update</h1>
          </div>
          <div class="content">
            <h2>Dear ${doctor.fullName},</h2>
            <p>Thank you for applying to become a verified doctor on Flora.</p>
            <p>After careful review, we regret to inform you that your application has been <strong style="color: #e74c3c;">rejected</strong>.</p>
            ${rejectionReason ? `
              <div class="reason-box">
                <p style="margin: 0; color: #991b1b;"><strong>Reason for rejection:</strong></p>
                <p style="margin: 5px 0 0 0; color: #7f1d1d;">${rejectionReason}</p>
              </div>
            ` : ''}
            <p>You can address the issues mentioned above and re-apply by uploading the correct documents.</p>
            <p>If you believe this is a mistake or need clarification, please contact our support team.</p>
            <a href="${frontendUrl}/doctor/verification" class="button">Re-apply Now</a>
            <p style="margin-top: 20px;">We wish you all the best in your medical career!</p>
          </div>
          <div class="footer">
            <p>© 2026 Flora. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  } else if (status === "suspended") {
    subject = "Important: Your Doctor Account Has Been Suspended";
    html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Suspended</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; }
          .header { background: #f39c12; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 30px; background: #f9f9f9; border-radius: 0 0 8px 8px; }
          .reason-box { background: #fef2f2; border-left: 4px solid #e74c3c; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .button { display: inline-block; background: #F33B7D; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          .button:hover { background: #d92b6b; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Account Suspension Notice</h1>
          </div>
          <div class="content">
            <h2>Dear ${doctor.fullName},</h2>
            <p>We are writing to inform you that your doctor account has been <strong style="color: #e67e22;">suspended</strong>.</p>
            ${rejectionReason ? `
              <div class="reason-box">
                <p style="margin: 0; color: #991b1b;"><strong>Reason for suspension:</strong></p>
                <p style="margin: 5px 0 0 0; color: #7f1d1d;">${rejectionReason}</p>
              </div>
            ` : ''}
            <p>During this time, you will not be able to access your doctor features or accept new appointments.</p>
            <p>If you believe this suspension was made in error or would like to appeal, please contact our support team.</p>
            <a href="${frontendUrl}/contact" class="button">Contact Support</a>
            <p style="margin-top: 20px;">We are here to help resolve any issues.</p>
          </div>
          <div class="footer">
            <p>© 2026 Flora. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Flora" <${process.env.SMTP_FROM || "noreply@flora.com"}>`,
      to: doctor.email,
      subject: subject,
      html: html,
    });

    console.log(`Email sent to ${doctor.email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Failed to send email:", error);
    // Don't throw error, just log it so the operation continues
    return null;
  }
};

module.exports = {
  sendDoctorVerificationEmail,
};