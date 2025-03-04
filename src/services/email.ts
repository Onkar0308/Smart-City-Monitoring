interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

export const emailService = {
  async sendEmail({ to, subject, body }: EmailOptions): Promise<void> {
    // In a real application, this would use an email service provider
    // For now, we'll just log the email (you would replace this with actual email sending logic)
    console.log('Sending email:', {
      to,
      subject,
      body
    });
  },

  async sendWelcomeEmail(email: string): Promise<void> {
    const subject = 'Welcome to SmartCity AI!';
    const body = `
Dear User,

Welcome to SmartCity AI! We're excited to have you join our platform.

You can now log in to your account and start exploring our features:
- AI-Powered Analytics
- Environmental Monitoring
- Smart Security
- And much more!

If you have any questions, feel free to reach out to our support team.

Best regards,
The SmartCity AI Team
    `.trim();

    await this.sendEmail({
      to: email,
      subject,
      body
    });
  }
};