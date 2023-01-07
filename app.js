const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
const apiKey = "0cccb06dbd08fbc0ee94c60cf4aa8916-us21";
const listId = "efad2353c4";


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {FNAME: firstName, LNAME: lastName}
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/efad2353c4";

  const options = {
    method: "POST",
    auth: "MichiruMizuhara:0cccb06dbd08fbc0ee94c60cf4aa8916-us21"
  };

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {res.sendFile(__dirname + "/failure.html");}

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  });

  request.write(jsonData);
  request.end();

  console.log("First name: " + firstName + ". Last name: " + lastName + ". Email: " + email + ".");
});

app.post("/failure", function(req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("The server is running.");
});
