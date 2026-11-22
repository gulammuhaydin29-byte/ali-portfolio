const nodemailer=require('nodemailer');
module.exports=async(req,res)=>{
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const{name,email,subject,message}=req.body||{};
  if(!name||!email||!subject||!message) return res.status(400).json({error:'All fields required'});
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({error:'Invalid email'});
  if(message.length>5000) return res.status(400).json({error:'Message too long'});
  const transporter=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:process.env.SMTP_SECURE==='true',auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});
  try{
    await transporter.sendMail({from:process.env.SMTP_USER,to:process.env.CONTACT_EMAIL||process.env.SMTP_USER,subject:`Portfolio: ${subject}`,text:`Name: ${name}\nEmail: ${email}\n\n${message}`,replyTo:email});
    res.json({success:true});
  }catch(e){res.status(500).json({error:'Failed to send'});}
};
