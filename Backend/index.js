import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import videoRoutes from './routes/videoRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import channelRoutes from './routes/channelRoutes.js';

const app = express();
app.use(express.json())
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/channels', channelRoutes);

//DB connection
mongoose.connect('mongodb+srv://lavanya95manda:vu2SVFgRHcIA23Ej@cluster0.nhh6jze.mongodb.net/youtubeclone')

.then(()=>
{
    console.log(`DB Connected`);
})
.catch((err)=>{
    console.log(`DB Failed to connect`,err);
})



app.get("/", (req,res)=>
{
    res.send("Welcome to youtube backend");
});

app.use((req,res,next)=>
{
    return res.status(404).json({error:"Route not found"});
})

const PORT = 8080;
app.listen(PORT,()=>{
    console.log(`Server connected at port: ${PORT}`);
})


