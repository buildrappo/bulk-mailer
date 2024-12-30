# bulk-mailer

Steps:

- npm install
- create .env file and add resend api key
- create emailList.js file and add name and email in below format:
  ` module.exports = [
{ name: "Viljo", email: "viljo@gmail.com" },
{ name: "Anthony", email: "anthony@gmail.com" },
];`

- to search for linkedin urls using image, create file named avatarUrlList.js and add linkedin profile image address in below format:

`module.exports = [
  { url: "https://media.licdn.com/dms/image/v2/D4D03AQEQJ3sDHLncKg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1718261818043?e=1741219200&v=beta&t=gbT37Vhpq-TdVguzEBPHe8h_I8x0uuM0NwtIq2xbQ3Y" },
  { url: "https://media.licdn.com/dms/image/v2/D5603AQFPi6prxvqIaQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1731137766252?e=1741219200&v=beta&t=nLdrFBt74MybXIiYn5BQ_m8ztcPd6dUn9Ps4ENDHyuc" }
];`

To Run:

- run `node server.js` in terminal and it will run the server
- then (for sending mails) do post request via postman or thunderclient to `http://localhost:{PORT}/send-emails` and it will send email to each email
- (for searching urls) do get request to `http://localhost:3002/search-avatars` and it will get the linkedin url and username of the particular user
