# bulk-mailer

Steps:

- npm install
- create .env file and add resend api key
- create emailList.js file and add name and email in below format:
  ` module.exports = [
{ name: "Viljo", email: "viljo@gmail.com" },
{ name: "Anthony", email: "anthony@gmail.com" },
];`

To Run:

- do node server.js in root directory and it will the server
- then post request via postman or thunderclient to `http://localhost:{PORT}/send-emails` and it will send email to each email
