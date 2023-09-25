const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");+
require("dotenv").config();

const Mentor = require('./models/mentor');
const Student = require('./models/student')

const app = express();
const PORT = process.env.PORT;

const DB_URL = "mongodb+srv://felixvictorraj:felix123@cluster0.kbftikb.mongodb.net/?retryWrites=true&w=majority";
app.use(bodyparser.json())

// connection to mongoDB

mongoose.connect(DB_URL, {})
.then(()=>console.log("connected to mongoDB"))
.catch((err)=>console.log("server could not be connected",err))

app.get('/', function (req, res) {
    res.send('Hello World');
 });

//  1. API to create Mentor

app.post('/mentor',async(req,res)=>{
    try {
        const mentor = new Mentor(req.body);
        await mentor.save()
        res.status(201).send(mentor);
    } catch (error) {
        res.status(401).send(error)
    }
});

//2. API to create Student

app.post('/student',async(req,res)=>{
    try {
        const student = new Student(req.body);
        await student.save()
        res.status(201).send(student);
    } catch (error) {
        res.status(401).send(error)
    }
});

// 3. API to Assign a student to Mentor

app.post('/mentor/:mentorId/assign',async(req,res)=>{
    try {
        const mentor = await Mentor.findById(req.params.mentorId);
        const students = await Student.find({ _id: { $in: req.body.students } });
    
        students.forEach((student) => {
          student.cMentor = mentor._id;
          student.save();
        });
    
        mentor.students = [
          ...mentor.students,
          ...students.map((student) => student._id),
        ];
        await mentor.save();
        res.send(mentor);
      } catch (error) {
        res.status(400).send(error);
      }
});

// 4. API to Assign or Change Mentor for particular Student

app.put("/student/:studentId/assignMentor/:mentorId", async (req, res) => {
    try {
      const mentor = await Mentor.findById(req.params.mentorId);
      const student = await Student.findById(req.params.studentId);
  
      if (student.cMentor) {
        student.pMentor.push(student.cMentor);
      }
  
      student.cMentor = mentor._id;
      await student.save();
      res.send(student);
    } catch (error) {
      res.status(400).send(error);
    }
  });

//  5. API to show all students for a particular mentor

  app.get("/mentor/:mentorId/students", async (req, res) => {
    try {
      const mentor = await Mentor.findById(req.params.mentorId).populate(
        "students"
      );
      res.send(mentor);
    } catch (error) {
      res.status(400).send(error);
    }
  });

// 6. API to show the previously assigned mentor for a particular student.

app.get('/student/:studentId/pMentor', async (req, res) => {
    try {
      const studentId = req.params.studentId;
      const student = await Student.findById(studentId).populate('pMentor');
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      const previousMentor = student.pMentor;
      res.status(200).json(previousMentor);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving previous mentor' });
    }
  });
  
app.listen(PORT,function(error){
    if(error){
        console.log("somthing wants wrong:",error)
    }else{
        console.log("The Server is listening on port :",PORT)
    }
});