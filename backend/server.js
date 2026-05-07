import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import{prisma} from './lib/prisma.js';

const app=express();
const port=3000;
app.use(cors());
app.use(express.json());


app.post('/api/register',async (req,res)=>{
  const {name,email,password}=req.body;
  const existingUser= await prisma.user.findUnique({where:{email:email}});
  if(existingUser){
    res.status(400).json({message:"User already exists"});
    return;
  }
 
  const passwordHash= await bcrypt.hash(password,10);
  const user= await prisma.user.create({
    data:{
      email,
      name,
      password:passwordHash
    },select:{
      id:true,
      email:true,
      name:true,
      createdAt:true,
    }
  });
  res.status(201).json(user);
});
app.listen(port,()=>{
  console.log(`server is running at ${port}`)
});