const nodemailer = require('nodemailer');

//initializing variables for mail sending authentication
const GMAIL_USER = process.env.GMAIL_USERNAME;
const GMAIL_PASS = process.env.GMAIL_PASSWORD;
const EMAIL = process.env.EMAIL;

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth : {
		user: GMAIL_USER,
		pass: GMAIL_PASS
	}
})

class Mailer {
    static sendMail(to, subject, content) {
      const message = {
        from: EMAIL,
        to,
        html: content,
        subject
      }
  
      return transporter.sendMail(message, function(err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }
      })
    }  
  }

module.exports = Mailer;