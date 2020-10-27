var nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail')


module.exports = {
  newemailservice: async (link, email, subject) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: email, 
      from: process.env.EMAIL, 
      subject: subject,
      text: "click here to verify- " + link,
      // html: '<strong>${link}</strong>',
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error);
      })
  },

  reminderservice: async (text, email, subject) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: email, 
      from: process.env.EMAIL, 
      subject: subject,
      text: text
      // html: '<strong>${link}</strong>',
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error);
      })
  }
}

