const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
const mysql = require('mysql2');
require('dotenv').config()

// server used to send send emails
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);
app.listen(3001, () => console.log("Server Running"));
console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);

const connection = mysql.createConnection(process.env.DATABASE_URL)


app.get('/', (req, res) => {
  console.log('Hello World')
  res.send('Hello World!!')
})



app.get("/contact", (req,res)=>{
  const q = "SELECT * FROM contact"
  connection.query(q,(err,data)=>{
      if(err) return res.json(err)
      return res.json(data)
  })
})



const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "********@gmail.com",
    pass: ""
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

router.post("/contact", (req, res) => {
  const name = req.body.firstName + req.body.lastName;
  const email = req.body.email;
  const message = req.body.message;
  const phone = req.body.phone;
  const mail = {
    from: name,
    to: "********@gmail.com",
    subject: "Contact Form Submission - Portfolio",
    html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Phone: ${phone}</p>
           <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ code: 200, status: "Message Sent" });
    }
  });
});

