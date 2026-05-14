import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import{prisma} from './lib/prisma.js';
import jwt from 'jsonwebtoken';
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
    const token=jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:'7d'});
    res.status(200).json({token,
      user:{id:user.id,email:user.email,
        name:user.name,createdAt:user.createdAt,
        dateOfBirth:user.dateOfBirth,height:user.height,
        activityLevel:user.activityLevel,sex:user.sex,
        bio:user.bio,avatar:user.avatar
      }});
  }catch(error){
    res.status(500).json({message:"Internal server error"});
  }
});
function authMiddleware(req,res,next){
  const authHeader =req.headers.authorization;
  if(!authHeader){
    return res.status(401).json({message:"Authorization header missing"});
  }
  const token=authHeader.split(" ")[1];
  if(!token){
    return res.status(401).json({message:"Token missing"});
  }
  try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    req.user={
      id:decoded.id,
    };
    next();
  }catch(error){
    return res.status(401).json({message:"Invalid token"});
  }
}
app.post('/api/body-records',authMiddleware,async(req,res)=>{
  try{
    const{date,weight,bodyFat,waist,chest,notes}=req.body;
    const record=await prisma.bodyRecords.create({
      data:{
        userId:req.user.id,
        date: new Date(date),
        weight,
        bodyFat,
        waist,
        chest, 
        notes
      }
  });  res.status(201).json(record);
}catch(error){
  res.status(500).json({message:"Internal server error"});
}});


app.get('/api/body-records',authMiddleware,async(req,res)=>{
  try{
    const records=await prisma.bodyRecords.findMany({
      where:{userId:req.user.id},
      orderBy:{date:'desc'},
    });
    res.status(200).json(records);
  }catch(error){
    res.status(500).json({message:"Internal server error"});
  }
});    
app.post('/api/diet-plans',authMiddleware,async(req,res)=>{
  try{
    const{calories,protein,carbs,fat,notes}=req.body;
    const plan=await prisma.dietRecords.create({
      data:{
        userId:req.user.id,
        calories,
        protein,
        carbs,
        fat,
        notes
       }
    });
    res.status(201).json(plan);
  }catch(error){
    res.status(500).json({message:"Internal server error"});
  }
});
app.post('/api/user',authMiddleware,async(req,res)=>{
  try{
    const{height,activityLevel,sex,dateOfBirth}=req.body;
    const updatedUser=await prisma.user.update({
      where:{id:req.user.id},
      data:{height,activityLevel,sex,dateOfBirth:new Date(dateOfBirth)},
      select:{
        id:true,
        email:true,
        name:true,
        height:true,
        activityLevel:true,
        createdAt:true,
        dateOfBirth:true,
      }
    });
    res.status(200).json(updatedUser);
  }catch(error){
    res.status(500).json({message:"Internal server error"});
  }
});
app.put('/api/user',authMiddleware,async(req,res)=>{
  try{
    const{name,avatarUrl,bio}=req.body;
    const updatedUser=await prisma.user.update({
      where:{id:req.user.id},
      data:{name,avatar:avatarUrl,bio},
      select:{
        id:true,
        email:true,
        name:true,
        height:true,
        activityLevel:true,
        createdAt:true,
        dateOfBirth:true,
        bio:true,
        avatar:true,
      }
    });
    res.status(200).json(updatedUser);
  }catch(error){
    res.status(500).json({message:"Internal server error"});
  }
});

app.get('/api/program',authMiddleware,async(req,res)=>{
  try{
    const program=await prisma.program.findUnique({
      where:{userId:req.user.id},
      include:{versions:true}
    });
    if(!program){
      res.status(404).json({message:"Program not found"});
      return;
    }
    res.status(200).json(program);
  }catch(error){
    res.status(500).json({message:"Internal server error"});
  }
});
app.post('/api/programs',authMiddleware,async(req,res)=>{
  try{
    const{snapshot}=req.body;
    let program=await prisma.program.findUnique({
      where:{userId:req.user.id}
    });
    if(!program){
      program=await prisma.program.create({
        data:{
          userId:req.user.id,
          name:"My Training Program",
        }
      });
    }

    const latestVersion = await prisma.programVersion.findFirst({
      where:{programId:program.id},
      orderBy:{versionNumber:'desc'}
    });
    const nextVersionNumber = (latestVersion?.versionNumber ?? 0) + 1;

    const updatedProgram=await prisma.program.update({
      where:{userId:req.user.id},
      data:{
        versions:{
          create:{
            versionNumber:nextVersionNumber,
            changeSummary:snapshot.changeSummary,
            categories:{
              create:snapshot.categories.map((category)=>({
                name:category.name,
                order:category.order || 0,
                notes:category.notes || "",
                exercises:{
                  create:category.exercises.map((exercise)=>({
                    name:exercise.name,
                    order:exercise.order || 0,
                    notes:exercise.notes || "",
                    sets:{
                      create:exercise.sets.map((set)=>({
                        reps:set.reps,
                        weight:set.weight,
                        order:set.order || 0
                      }))
                    }
                  }))
                }
              }))
            }
          }
        }
      },
      include:{versions:true}
    });
    res.status(200).json(updatedProgram);
  }catch(error){
    console.error('Error creating program version:', error);
    res.status(500).json({message:"Internal server error"});
  }
});
app.listen(port,()=>{
  console.log(`server is running at ${port}`)
});
