const nodemailer = require('nodemailer');
const MyConstants = require('./MyConstants');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MyConstants.EMAIL_USER,
    pass: MyConstants.EMAIL_PASS
  }
});

const EmailUtil = {
  async send(email, id, token) {
    try {
      const text =
        'Thanks for signing up, please input these informations to activate your account:\n' +
        '\t id: ' + id +
        '\n\t token: ' + token;

      const mailOptions = {
        from: MyConstants.EMAIL_USER,
        to: email,
        subject: 'Signup | Verification',
        text: text
      };

      await transporter.sendMail(mailOptions);

      console.log('✅ Email sent successfully');
      return true;

    } catch (err) {
      console.error('❌ Send mail error:', err);
      return false;
    }
  }
};

module.exports = EmailUtil;