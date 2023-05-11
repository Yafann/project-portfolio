const path = require('path');
const express = require("express");
const cors = require("cors");
const mysql = require('mysql2');
require('dotenv').config()

const connection = mysql.createConnection(process.env.DATABASE_URL)

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors())
app.use(express.json());

app.get("/api", (req, res) => {
  const q = "SELECT * FROM contact"
  connection.query(q,(err,data)=>{
      if(err) return res.json(err)
      return res.json(data)
  })
})

app.post("/sendapi", (req, res) => {
  const fname = req.body.firstName;
  const lname = req.body.lastName;
  const email = req.body.email;
  const phone = req.body.phone;
  const message = req.body.message;
  connection.query("INSERT INTO contact (fname, lname, email, phone, message) VALUES (?, ?, ?, ?, ?)",[fname,lname,email,phone,message],(err,data)=>{
      if(err) {
        return res.json(err)
      }
      return res.json({ status: "success", message: "insert success" })
  })
})

app.listen(PORT, () => {
  console.log(`Server is online on port: ${PORT}`)
})



