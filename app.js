const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const client = require("@mailchimp/mailchimp_marketing");
const { response } = require('express');
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

client.setConfig({
    apiKey: "a83b5c037c09b27a51542c59cc7ed3cc0-us11",
    server: "us11",
});

app.post("/", function (req, res) {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.inputEmail;

    const run = async () => {
        try {
            const response = await client.lists.batchListMembers("d1fbda9ee4", {
                members: [{
                    email_address: email,
                    status: "subscribed",
                    merge_fields: {
                        FNAME: fname,
                        LNAME: lname
                    }
                }],
                update_existing: true
            });
            var arrLength = response.errors;

            if (arrLength.length == 0) {
                res.sendFile(__dirname + "/success.html");
            }
            else {
                res.sendFile(__dirname + "/failure.html");
            }
        }
        catch (err) {
            //res.status(400).send(err)
            res.sendFile(__dirname + "/failure.html");
        }
    };

    run();

})


app.post("/failure", function (req, res) {
    res.redirect("/");
})


app.listen(process.env.PORT || 5500, function () {
    console.log("listening");
})


//API key
//83b5c037c09b27a51542c59cc7ed3cc0-us11

//list id
//d1fbda9ee4.