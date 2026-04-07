const { Resend } = require("resend");
const { env } = require("../config");
const { ApiError } = require("./api-error");

let resend = null;

const getResend = () => {
  if (!resend && env.RESEND_API_KEY) {
    resend = new Resend(env.RESEND_API_KEY);
  }
  return resend;
};

const sendMail = async (mailOptions) => {
  const client = getResend();
  if (!client) {
    console.warn("Email service not configured - skipping email send");
    return;
  }
  const { error } = await client.emails.send(mailOptions);
  if (error) {
    throw new ApiError(500, "Unable to send email");
  }
};

module.exports = {
  sendMail,
};
