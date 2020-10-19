var nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail')


module.exports = {
  newemailservice: async (link, email, subject) => {
    console.log("entereddddddddddd in emailsender");

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: email, // Change to your recipient
      from: process.env.EMAIL, // Change to your verified sender
      subject: subject,
      text: "click here to verify- " + link,
      // html: '<strong>${link}</strong>',
    }
    console.log("messageeeeeeeeee");
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
        console.error(error);
      })
  }
}

