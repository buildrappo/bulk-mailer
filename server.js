const express = require("express");
const axios = require("axios");
require("dotenv").config();

// Import email list and template
const emailList = require("./emailList2");
const emailTemplate = require("./emailTemplate2");

// Import avatar URL list
const avatarUrlList = require('./avatarUrlList');

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
        "https://api.resend.com/emails",
        {
          to: recipient.email,
          subject: emailTemplate.subject,
          html: `<p>${personalizedBody.replace(/\n/g, "<br>")}</p>`,
          from: "Vignesh from Rappo <vignesh@rappo.pro>",
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

app.get("/search-avatars", async (req, res) => {
  try {
    const results = [];
    
    for (const avatar of avatarUrlList) {
      // Call RapidAPI endpoint for each avatar URL
      const response = await axios.get(`https://${process.env.RAPIDAPI_HOST}/reverse-image-search`, {
        params: {
          url: avatar.url,
          limit: 10,
          safe_search: 'off'
        },
        headers: {
          'x-rapidapi-host': process.env.RAPIDAPI_HOST,
          'x-rapidapi-key': process.env.RAPIDAPI_KEY
        }
      });

      // Check if response data has the expected structure
      if (response.data && response.data.data) {
        // Filter LinkedIn URLs and domains from the response
        const linkedInResults = response.data.data.filter(result => {
          return result.link.includes('linkedin.com') || result.domain.includes('linkedin.com');
        }).map(result => {
          // Extract username from LinkedIn URL
          const urlParts = result.link.split('/');
          const username = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
          
          return {
            linkedInUrl: result.link,
            username: username
          };
        });

        results.push({
          avatarUrl: avatar.url,
          matches: linkedInResults
        });
      } else {
        console.warn('Unexpected response data format:', response.data);
      }

      // Add a small delay to avoid hitting API rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    res.status(200).json({
      success: true,
      results: results
    });
    
  } catch (error) {
    console.error(
      "Error searching avatars:",
      error.response?.data || error.message
    );
    res.status(500).json({ 
      success: false,
      error: "Failed to search avatars" 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
