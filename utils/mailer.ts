import nodemailer from 'nodemailer';

export const sendMail = async (to: string, subject: string, htmlContent: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "alakmishra170101@gmail.com",
        pass: "wpwhpzxkplsgyomm",
      },
    });

    const mailOptions = {
      from: "alakmishra170101@gmail.com",
      to,
      subject,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
