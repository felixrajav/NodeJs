const express = require("express");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

const port =5000;  
const DB_URL = "mongodb+srv://felixvictorraj:felix123@filesystem.10xly07.mongodb.net/FileSystem?retryWrites=true&w=majority"
const Createfolder = './CreateFolder';

mongoose
  .connect(DB_URL, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Could not connect to MongoDB", err));

if (!fs.existsSync(Createfolder)){
    fs.mkdirSync(Createfolder);
}

app.get("/createFile",(req,res)=>{
    const currentTime =new Date();
    const year = currentTime.getFullYear().toString();
    const month = (currentTime.getMonth() + 1).toString();
    const date = currentTime.getDate().toString();
    const hours = currentTime.getHours().toString();
    const mins = currentTime.getMinutes().toString();
    const secs = currentTime.getSeconds().toString();

    const dateTimeForFileName = `${year}-${month}-${date}-${hours}-${mins}-${secs}.txt`;

    const filePath = path.join(Createfolder, dateTimeForFileName);
  
    console.log("filePath:", filePath);
  
    fs.writeFile(filePath, currentTime.toISOString(), (err) => {
      if (err) {
        res.status(500).send(`Error creating file: ${err}`);
        return;
      }
  
      res.send(`File created successfully at: ${filePath}`);
    });
})


app.get('/getfiles',(req,res)=>{
    fs.readdir(Createfolder, (err,files)=>{
        if (err){
            req.status(500).send("Error reading Directory :",err);
            return;
        }

        const textFile = files.filter((files)=>path.extname(files)===".txt");

        res.json(textFile)
    })
})

app.listen(port,()=>{
    console.log("server is running on port:",port)
})