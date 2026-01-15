import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import axios from "axios";

export const mailTransporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: Number(process.env.BREVO_SMTP_PORT),
  secure: false, // TLS
  auth: {
    user: process.env.BREVO_SMTP_USER, // always "apikey"
    pass: process.env.BREVO_SMTP_PASS,
  },
});

export const paymentSuccessTemplate = (credits, totalCredits) => {
  return `
  <div style="background:#f6f7fb;padding:24px 0;">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:14px;overflow:hidden;font-family:Arial,sans-serif;color:#111;">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#2563eb,#1e40af);padding:24px;">
        <h1 style="margin:0;color:#ffffff;font-size:22px;">Payment Successful 🎉</h1>
        <p style="margin:6px 0 0;color:#dbeafe;font-size:14px;">
          Credits added to your account
        </p>
      </div>

      <!-- Body -->
      <div style="padding:28px;">
        <p style="font-size:15px;line-height:1.6;">
          Your payment was successful, and your credits are now ready to use.
        </p>

        <!-- Credit Box -->
        <div style="margin:20px 0;padding:18px;border-radius:12px;background:#eff6ff;">
          <p style="margin:0;font-size:14px;">
            <strong>Credits added:</strong> ${credits}
          </p>
          <p style="margin:6px 0 0;font-size:14px;">
            <strong>Total balance:</strong> ${totalCredits}
          </p>
        </div>

        <p style="font-size:14px;">
          You can use your credits for:
        </p>

        <ul style="padding-left:18px;font-size:14px;line-height:1.7;">
          <li>Resume optimization</li>
          <li>LinkedIn profile improvement</li>
          <li>Interview preparation (DSA, OOPS, DBMS & more)</li>
        </ul>

        <!-- CTA -->
        <div style="text-align:center;margin:28px 0;">
          <a href="https://copolish.com/editor/resume"
             style="display:inline-block;padding:14px 26px;border-radius:999px;
             background:#2563eb;color:#fff;text-decoration:none;font-weight:600;font-size:14px;">
            Use credits now →
          </a>
        </div>

        <p style="font-size:13px;color:#555;">
          Credits never expire — use them whenever you’re ready.
        </p>

        <p style="margin-top:32px;font-size:14px;">
          Thanks for trusting CoPolish,<br/>
          <strong>Team CoPolish</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#fafafa;padding:14px;text-align:center;font-size:12px;color:#777;">
        This is a payment confirmation email. No action is required.
      </div>
    </div>
  </div>
  `;
};

export const welcomeTemplate = (email, name) => {
  return `
  <div style="background:#f6f7fb;padding:24px 0;">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:14px;overflow:hidden;font-family:Arial,sans-serif;color:#111;">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#111,#2f2f2f);padding:24px;">
        <h1 style="margin:0;color:#ffffff;font-size:22px;">Welcome to CoPolish 🚀</h1>
        <p style="margin:6px 0 0;color:#cfcfcf;font-size:14px;">
          Your interview preparation companion
        </p>
      </div>

      <!-- Body -->
      <div style="padding:28px;">
        <p style="font-size:15px;">Hi <strong>${name}</strong>,</p>

        <p style="font-size:15px;line-height:1.6;">
          Welcome aboard! 👋  
          CoPolish is built to help you <strong>prepare smarter for interviews</strong> —  
          not by teaching theory, but by helping you practice <strong>what actually gets asked</strong>.
        </p>

        <div style="margin:24px 0;padding:16px;border-radius:10px;background:#f4f6ff;">
          <h3 style="margin:0 0 10px;font-size:16px;">What you can do on CoPolish</h3>
          <ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.7;">
            <li><strong>Resume Optimization</strong> – Clear, ATS-friendly resumes</li>
            <li><strong>LinkedIn Optimization</strong> – Profiles recruiters notice</li>
            <li><strong>Interview Prep</strong> – Curated questions for:
              <ul>
                <li>DSA</li>
                <li>OOPS</li>
                <li>DBMS</li>
                <li>Core CS topics</li>
              </ul>
            </li>
          </ul>
        </div>

        <p style="font-size:14px;line-height:1.6;">
          Each section is designed to help you <strong>prepare answers, revise fast,</strong>  
          and walk into interviews with confidence.
        </p>

        <!-- CTA -->
        <div style="text-align:center;margin:28px 0;">
          <a href="https://copolish.com/dashboard"
             style="display:inline-block;padding:14px 26px;border-radius:999px;
             background:#111;color:#fff;text-decoration:none;font-weight:600;font-size:14px;">
            Go to Dashboard →
          </a>
        </div>

        <p style="font-size:13px;color:#555;">
          Pro tip: start with your resume — it’s the fastest way to see real improvement.
        </p>

        <p style="margin-top:32px;font-size:14px;">
          All the best,<br/>
          <strong>Team CoPolish</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#fafafa;padding:14px;text-align:center;font-size:12px;color:#777;">
        You’re receiving this email because you signed up on CoPolish.
      </div>
    </div>
  </div>
  `;
};

export const sendBrevoMail = async ({ to, subject, html }) => {
  try {
    const res = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: "madangsnaik@gmail.com", // valid sender
          name: "CoPolish",
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.log("brevo mail error:", error);

    throw error;
  }
};
