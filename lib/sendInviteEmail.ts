import { Resend } from 'resend';

// Initialize Resend with your API key from .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a professionally formatted invitation email to a freelancer
 * containing their unique invite code to join a specific project.
 */
export async function sendInviteEmail(toEmail: string, inviteCode: string, projectName: string, inviterName: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Interior Design Portal <invites@yourdomain.com>', // Must be a verified domain in Resend
            to: [toEmail],
            subject: `You've been invited to collaborate on ${projectName}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0f172a; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Project Invitation</h1>
          </div>
          <div style="padding: 32px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #334155;">Hello,</p>
            <p style="font-size: 16px; color: #334155;">
              <strong>${inviterName}</strong> has invited you to collaborate on the interior design project: <strong>${projectName}</strong>.
            </p>
            <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; padding: 24px; text-align: center; margin: 32px 0; border-radius: 6px;">
              <p style="font-size: 14px; color: #64748b; margin-top: 0; margin-bottom: 8px;">Your Unique Invite Code</p>
              <h2 style="font-family: monospace; font-size: 32px; letter-spacing: 4px; color: #0f172a; margin: 0;">
                ${inviteCode}
              </h2>
            </div>
            <p style="font-size: 16px; color: #334155;">
              To join, log in to your dashboard, click "Join Project", and enter the code above.
            </p>
            <div style="text-align: center; margin-top: 32px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                Go to Dashboard
              </a>
            </div>
          </div>
          <div style="background-color: #f1f5f9; padding: 16px; text-align: center;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">If you were not expecting this invitation, you can safely ignore this email.</p>
          </div>
        </div>
      `,
        });

        if (error) {
            console.error('Resend API Error:', error);
            return { success: false, message: error.message };
        }

        return { success: true, data };
    } catch (err: any) {
        console.error('Failed to send email:', err);
        return { success: false, message: 'Internal error while sending invite email.' };
    }
}
