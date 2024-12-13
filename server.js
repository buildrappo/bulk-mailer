const express = require("express");
const axios = require("axios");
require("dotenv").config();

// Import email list and template
const emailList = require("./emailList");
const emailTemplate = require("./emailTemplate");

const app = express();
app.use(express.json());

const RESEND_API_KEY = process.env.RESEND_API_KEY;

app.post("/send-emails", async (req, res) => {
  try {
    for (const recipient of emailList) {
      // Replace placeholder in the template
      const personalizedBody = emailTemplate.body.replace(
        "[First Name]",
        recipient.name
      );

      // Send email via Resend API
      await axios.post(
        "https://api.resend.com/emails",
        {
          to: recipient.email,
          subject: emailTemplate.subject,
          html: `<p>${personalizedBody.replace(/\n/g, "<br>")}</p>`,
          from: "Vignesh from Rappo <admin@buildrappo.com>",
        },
        {
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`Email sent to ${recipient.email}`);
    }

    res.status(200).send({ message: "Emails sent successfully!" });
  } catch (error) {
    console.error(
      "Error sending emails:",
      error.response?.data || error.message
    );
    res.status(500).send({ error: "Failed to send emails" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
