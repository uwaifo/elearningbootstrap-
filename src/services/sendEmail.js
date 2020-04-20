//const sg_key = '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';

// https://github.com/sendgrid/sendgrid-nodejs

//import sgMail from '@sendgrid/mail';
const sendgrid = require("sendgrid-v3-node");
export function sendEmail(recipient, subject, html_body) {
  try {
    const sendgrid = require("sendgrid-v3-node");

    const mailOptions = {
      sendgrid_key:
        "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",
      from_email: "hello@motionwares.com",
      from_name: "elearning Academy",
      to: recipient // REQUIRED: array of `string` email
    };

    mailOptions.subject = subject;
    mailOptions.content = html_body;
    sendgrid.send_via_sendgrid(mailOptions).then(response => {
      console.log(response);
    });
  } catch (error) {
    throw error;
  }
  // sgMail.setApiKey(sg_key);
  // const msg = {
  //     to: recipient,
  //     from: 'hello@motionwares.com',
  //     subject: subject,
  //     html: html_body,
  // };
  // sgMail.send(msg);
}
