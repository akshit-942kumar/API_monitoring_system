import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendNotification = async (req, res) => {
  try {
    const { email, monitorName, status } = req.body;

    await resend.emails.send({
      from: "API Monitoring <onboarding@resend.dev>",
      to: email,
      subject: `Alert: ${monitorName} is ${status}`,
      html: `
        <h2>API Alert</h2>
        <p>Your monitored API <b>${monitorName}</b> is currently <b>${status}</b>.</p>
      `
    });

    res.status(200).json({
      message: "Notification sent successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
export const sendOtp = async (req, res) => { try { const { email, otp } = req.body; await resend.emails.send({ from: "API Monitoring <onboarding@resend.dev>", to: email, subject: "Verify your API Monitor Account", html: ` <div style="font-family:Arial,sans-serif;padding:20px"> <h2>API Monitor Verification</h2> <p>Your verification OTP is:</p> <div style=" font-size:32px; font-weight:bold; letter-spacing:8px; color:#2563eb; margin:20px 0; "> ${otp} </div> <p>This OTP will expire in <b>5 minutes</b>.</p> <p>If you did not request this, please ignore this email.</p> </div> ` }); res.status(200).json({ message: "OTP email sent successfully" }); } catch (error) { res.status(500).json({ message: error.message }); } };