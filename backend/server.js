import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import{prisma} from './lib/prisma.js';
import jwt from 'jsonwebtoken';
import{s3Client} from './lib/s3Client.js';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { get } from 'node:http';
const app=express();
const port=3000;
app.use(cors());
app.use(express.json());

//前端向后端发送请求api
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


app.post('/api/programs',authMiddleware,async(req,res)=>{
  try{
    const{snapshot,changeSummary}=req.body;
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
            changeSummary:changeSummary,
            categories:{
              create:(snapshot.categories||[]).map((category)=>({
                name:category.name,
                order:category.order || 0,
                notes:category.notes || "",
                exercises:{
                  create:(category.exercises||[]).map((exercise)=>({
                    name:exercise.name,
                    order:exercise.order || 0,
                    notes:exercise.notes || "",
                    sets:{
                      create:(exercise.sets||[]).map((set)=>({
                        reps:Number(set.reps),
                        weight:Number(set.weight),
                        order:Number(set.order) || 0
                      }))
                    }
                  }))
                }
              }))
            }
          }
        }
      },
      include:{versions :{
        include:{categories:{
          include:{
            exercises:{
              include:{
                sets:true
              }
            }
          }
        }       
      }

      }
    }});
    res.status(200).json(updatedProgram);
  }catch(error){
    console.error('Error creating program version:', error);
    res.status(500).json({message:"Internal server error"});
  }
});
//backend send data to frontend
app.get('/api/fitness-data',authMiddleware,async(req,res)=>{
  try{
    const BodyRecords=await prisma.BodyRecords.findMany({
      where:{userId:req.user.id},
      orderBy:{date:'desc'}
    });
    const DietRecords=await prisma.DietRecords.findMany({
      where:{userId:req.user.id},
      orderBy:{createdAt:'desc'}
    });
    const Posts=await prisma.Posts.findMany({
      include:{user:{select:{name:true,avatar:true}}},
      orderBy:{createdAt:'desc'}
    });
    res.status(200).json({ BodyRecords, DietRecords, Posts });
  }catch(error){
    console.error('Error fetching fitness data:', error);
    res.status(500).json({message:"Internal server error"});
  }
});
app.get('/api/program',authMiddleware,async(req,res)=>{
  try{
    const program=await prisma.program.findUnique({
      where:{userId:req.user.id},
      include:{
        versions:{
          orderBy:{versionNumber:'desc'},
          include:{
            categories:{
              orderBy:{order:'asc'},
              include:{
                exercises:{
                  orderBy:{order:'asc'},
                  include:{
                    sets:{orderBy:{order:'asc'}}
                  }
                }
              }
            }
          }
        }
      }
    });
    if(!program){
      res.status(200).json({
        id:`program-${req.user.id}`,
        userId:req.user.id,
        name:"My Training Program",
        versions:[]
      });
      return;
    }
    res.status(200).json(program);
  }catch(error){
    console.error('Error fetching program:', error);
    res.status(500).json({message:"Internal server error"});
  }
});
//token验证接口
app.get('/api/validate-token',authMiddleware,async(req,res)=>{
    try{
      const user= await prisma.user.findUnique({
        where:{id:req.user.id},
        select:{
          id:true,
          email:true,
          name:true,
          createdAt:true,
          dateOfBirth:true,
          height:true,
          activityLevel:true, 
          sex:true,
          bio:true,
          avatar:true,} 
    
    });
    if(!user){
      return res.status(401).json({message:"User not found"});    
    }
    res.status(200).json({user});
  }catch(error){
    console.error('Token validation error:', error);
    res.status(500).json({message:"Internal server error"});
  }
});
//头像上传接口
app.post('/api/uploads/avatar-url',authMiddleware,async(req,res)=>{
  try{
    const{fileName,fileType}=req.body;
    const allowedTypes=['image/jpeg','image/png','image/gif'];
    if(!allowedTypes.includes(fileType)){
      return res.status(400).json({message:"Invalid file type"});
    }
    // Further processing for avatar upload
    const fileExt=fileType.split('/')[1];
    const key=`avatars/${req.user.id}/${Date.now()}.${fileExt}`;
    const commond=new PutObjectCommand({
    Bucket:process.env.AWS_S3_BUCKET_NAME,
    Key:key,
    ContentType:fileType,
    
    });
    const uploadUrl=await getSignedUrl(s3Client,commond,{expiresIn:60});
    const avatarUrl=`${process.env.AWS_S3_PUBLIC_URL}/${key}`;
    await prisma.user.update({
      where:{id:req.user.id},
      data:{avatar:avatarUrl}
    });
    res.status(200).json({uploadUrl, avatarUrl});
  }
  catch(error){
    console.error('Error uploading avatar:', error);
    res.status(500).json({message:"Internal server error"});
  }
});
//posts endpoint
app.post('/api/posts',authMiddleware,async(req,res)=>{
  try{
    const{caption,visibility,imageUrl}=req.body;
    const post=await prisma.Posts.create({
      data:{
        userId:req.user.id,
        caption,
        visibility,
        photos:imageUrl
      }
    });
    res.status(201).json(post);
  }catch(error){
    console.error('Error creating post:', error);
    res.status(500).json({message:"Internal server error"});
  }
});
//get posts endpoint
app.get('/api/posts',authMiddleware,async(req,res)=>{
  try{
    const posts=await prisma.Posts.findMany({
      include:{user:{select:{name:true,avatar:true}}},
      orderBy:{createdAt:'desc'}
    });
    res.status(200).json({Posts:posts});
  }catch(error){
    console.error('Error fetching posts:', error);
    res.status(500).json({message:"Internal server error"});
  }
});
app.listen(port,()=>{
  console.log(`server is running at ${port}`)
});
