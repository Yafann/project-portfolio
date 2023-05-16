const express = require("express");
const cors = require("cors");
const mysql = require('mysql2');

var jwt = require("jsonwebtoken");
var secrat = "sadasdasd";

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

app.get("/api/:id", (req, res) => {
  const id = req.params.id;
  const q = "SELECT * FROM contact WHERE id = ?"
  connection.query(q,id,(err,data)=>{
      if(err) return res.json(err)
      return res.json(data)
  })
})

app.post("/login", (req, res) => {
  const q = "SELECT * FROM admin WHERE username = ? AND password = ?"
  connection.query(q,[req.body.username,req.body.password],(err,data)=>{
      if(err) {
        return res.json(err)
      }else{
        if(data.length > 0){
          var token = jwt.sign({ username: data[0].username }, secrat, {
            expiresIn: "1h",
          });
          return res.json({
            status: "success",
            message: "เข้าสู่ระบบสำเร็จ",
            token,
          })
        }else{
          return res.json({
            status: "error",
            message: "ผิดพลาด",
          })
        }
      }
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


app.post("/update", (req, res) => {
  const id = req.body.id;
  const fname = req.body.firstName;
  const lname = req.body.lastName;
  const email = req.body.email;
  const phone = req.body.phone;
  const message = req.body.message;
  connection.query("UPDATE contact SET fname = ?, lname = ?, email = ?, phone = ?, message = ? WHERE id = ?",[fname,lname,email,phone,message,id],(err,data)=>{
      if(err) {
        return res.json(err)
      }
      return res.json({ status: "success", message: "update success" })
  })
})


app.delete("/del/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM  contact WHERE id = ?",id,(err,data)=>{
      if(err) {
        return res.json(err)
      }
      return res.json({ status: "success", message: "delete success" })
  })
})

app.listen(PORT, () => {
  console.log(`Server is online on port: ${PORT}`)
})



