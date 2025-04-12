const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'maryvillegrocerygdpteam4@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'bujwrwhvlyqpuddh ',
  },
});

const sendResetPasswordEmail = async (email, resetLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'maryvillegrocerygdpteam4@gmail.com',
    to: email,
    subject: 'Password Reset',
    text: `Click the link to reset your password: ${resetLink}`,
  };

  await transporter.sendMail(mailOptions);
};

const sendOrderUpdate = async (email, msg) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'maryvillegrocerygdpteam4@gmail.com',
    to: email,
    subject: 'Order Update',
    text: msg,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetPasswordEmail, sendOrderUpdate };