import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import{prisma} from './lib/prisma.js';

const app=express();
const port=3000;
app.use(cors());
app.use(express.json());


app.post('/api/register',async (req,res)=>{
  try{
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
  }catch(error){
    res.status(500).json({message:"Internal server error"});
  }
  
 });

app.post('/api/login',async(req,res)=>{
  try{
    const[email,password]=[req.body.email,req.body.password];
    const user= await prisma.user.findUnique({where:{email:email}});
    if(!user){
      res.status(400).json({message:"Invalid email"});
      return;
    }
    const passwordMatch= await bcrypt.compare(password,user.password);
    if(!passwordMatch){
      res.status(400).json({message:"Invalid password"});
      return;
    }
    res.status(200).json({id:user.id,email:user.email,name:user.name,createdAt:user.createdAt});//starsing here
  }catch(error){
    res.status(500).json({message:"Internal server error"});
  }
});
app.get('/api/user',async(req,res)=>{
  try{
    const user=await prisma.user.findMany(
      {select:{
        id:true,
        email:true,
        name:true,
        createdAt:true,
      },}
    );
    res.status(200).json(user);
  }catch(error){
    res.status(500).json({message:"Internal server error"});
  }
})


app.listen(port,()=>{
  console.log(`server is running at ${port}`)
});