require('dotenv').config();
const express=require('express');
const { Resend }=require('resend');
const app=express();
app.use(express.json());
app.use(express.static('.'));
app.post('/api/contact',async(req,res)=>{
  const{name,email,message}=req.body||{};
  if(!name||!email||!message) return res.status(400).json({error:'All fields required'});
  const resend=new Resend(process.env.RESEND_API_KEY);
  try{
    await resend.emails.send({from:'onboarding@resend.dev',to:'gulammuhaydin29@gmail.com',subject:`Portfolio contact from ${name}`,html:`<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${message}</p>`});
    res.json({success:true});
  }catch(e){res.status(500).json({error:'Failed to send'});}
});
app.listen(process.env.PORT||3000,()=>console.log('Server running'));
