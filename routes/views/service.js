var nodemailer = require('nodemailer');


module.exports = {
    emailservice: async (link, email) => {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'rajat_raj@excellencetechnologies.in',
              pass: 'rydrcqxcwuqeueko'
            }
          });
          
          var mailOptions = {
            from: 'rajat_raj@excellencetechnologies.in',
            to: email,
            subject: 'Generate New Password.',
            text: link
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          return("email sent successfully");
    }
}

