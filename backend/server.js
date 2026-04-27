import express from 'express';
import cors from 'cors';
const app=express();
const port=3000;
app.use(cors());
const users=[];
app.get('/api/users',(req,res)=>{
  res.json(users);
})
app.listen(port,()=>{
  console.log(`server is running at ${port}`)
});