const nodemailer = require("nodemailer");
class MailService {
  transporter;
  static init() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
  }
  static async sendMail(from, to, subject, html) {
    const info = this.transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
    return info;
  }
}
module.exports = MailService;
