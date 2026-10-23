import nodemailer from "nodemailer";

// Lazy transporter initialization with support for Gmail or any SMTP provider
const getTransporter = () => {
  const isGmail = process.env.SMTP_SERVICE?.toLowerCase() === "gmail" || 
                  process.env.SMTP_HOST?.toLowerCase().includes("gmail");

  if (isGmail) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // 16-character Gmail App Password
      },
    });
  }

  const port = Number(process.env.SMTP_PORT) || 587;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: port,
    secure: port === 465, // true for 465, false for 587 or others
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async (to, subject, html) => {
  const fromUser = process.env.SMTP_FROM_USER || "SnapURL";
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || "noreply@snapurl.com";

  // If SMTP credentials are missing, log clearly to terminal so developers aren't blocked!
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("\n⚠️  [EMAIL CONFIG WARNING]: SMTP_USER or SMTP_PASS is missing in Backend/.env.");
    console.warn("Emails cannot be delivered to real inboxes without SMTP credentials.");
    console.log(`📨 [SIMULATED EMAIL TO]: ${to}`);
    console.log(`📌 [SUBJECT]: ${subject}`);
    return;
  }

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: `"${fromUser}" <${fromEmail}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ [EMAIL SENT] Message delivered to ${to} (ID: ${info.messageId})`);
  } catch (error) {
    console.error(`❌ [EMAIL ERROR] Failed to send email to ${to}:`, error.message);
    throw error;
  }
};

const verificationEmail = async (email, token) => {
  const appUrl = (process.env.APP_URL || "http://localhost:3000").replace(/\/+$/, "");
  const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/+$/, "");

  // Verification URL
  const verifyUrl = `${appUrl}/api/auth/verify-email/${token}`;

  // Always log the verification link in the console for instant testing
  console.log(`\n======================================================`);
  console.log(`📧 [VERIFICATION EMAIL FOR: ${email}]`);
  console.log(`🔗 Click or open to verify your account:`);
  console.log(`👉 ${verifyUrl}`);
  console.log(`======================================================\n`);

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 580px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <h2 style="color: #4f46e5; margin-top: 0;">Welcome to SnapURL!</h2>
      <p style="color: #475569; font-size: 15px; line-height: 1.6;">
        Thank you for joining SnapURL. Please confirm your email address by clicking the button below:
      </p>
      <div style="margin: 28px 0;">
        <a href="${verifyUrl}" 
           style="background: #4f46e5; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
        Or paste this link into your browser:<br/>
        <a href="${verifyUrl}" style="color: #6366f1; word-break: break-all;">${verifyUrl}</a>
      </p>
      <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
      <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">
        This link expires in 15 minutes. If you did not sign up for SnapURL, please disregard this email.
      </p>
    </div>
  `;

  await sendEmail(email, "Verify your SnapURL email", html);
};

const sendResetPasswordEmail = async (email, token) => {
  const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/+$/, "");
  const url = `${clientUrl}/reset-password/${token}`;

  console.log(`\n======================================================`);
  console.log(`🔑 [PASSWORD RESET FOR: ${email}]`);
  console.log(`👉 ${url}`);
  console.log(`======================================================\n`);

  await sendEmail(
    email,
    "Reset your SnapURL password",
    `<h2>Password Reset</h2><p>Click <a href="${url}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
  );
};

export {
  verificationEmail,
  sendEmail,
  sendResetPasswordEmail,
};