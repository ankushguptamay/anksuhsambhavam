const sgMail = require('../Services/sendGridMailer');

module.exports = class MailObject {
  constructor(toMail, subject = 'Sambhavam Email Subject', html = '<b>Mail Text</b>', fromMail = process.env.ADMIN_EMAIL_ID) {
    this.toMail = toMail;
    this.fromMail = fromMail;
    this.subject = subject;
    this.html = html;
  }

  async sendMail() {
    try {
      return await sgMail.send({
        to: this.toMail,
        from: this.fromMail || process.env.ADMIN_EMAIL_ID,
        subject: this.subject,
        html: this.html,
      });
    } catch (e) {
      throw e;
    }
  }
};