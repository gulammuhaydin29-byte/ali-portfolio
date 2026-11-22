require('dotenv').config();
const express=require('express');
const nodemailer=require('nodemailer');
const rateLimit=require('express-rate-limit');
const app=express();
app.use(express.json());
app.use(express.static('.'));
const limiter=rateLimit({windowMs:15*60*1000,max:5});
app.post('/api/contact',limiter,async(req,res)=>{
  const{name,email,message}=req.body||{};
  if(!name||!email||!message) return res.status(400).json({error:'All fields are required.'});
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({error:'Invalid email.'});
  const transporter=nodemailer.createTransport({service:'gmail',auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS}});
  try{
    await transporter.sendMail({from:process.env.EMAIL_USER,to:process.env.EMAIL_TO||process.env.EMAIL_USER,subject:`Portfolio contact from ${name}`,text:`Name: ${name}\nEmail: ${email}\n\n${message}`,replyTo:email});
    res.json({success:true});
  }catch(e){res.status(500).json({error:'Failed to send email.'});}
});
const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log('Server on '+PORT));
