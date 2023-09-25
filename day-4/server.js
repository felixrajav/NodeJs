const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const PORT =8080

const DB_URL = "mongodb://0.0.0.0:27017/admin";

app.use(bodyparser.json())

// connection to mongoDB

mongoose.connect(DB_URL, {})
.then(()=>console.log("connected to mongoDB"))
.catch((err)=>console.log("server could not be connected",err))

//create schema 
const bookschema = new mongoose.Schema({
    title:String,
    author:String,
    publisheDate: String
});

// create a mondel on the bookschema

const Book = mongoose.model("Book",bookschema)

// create Add a new Books

app.post('/book',async(req,res)=>{
    const book = new Book (req.body);
    try {
        const savedBook = await book.save();
        res.status(201).send(savedBook);
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// read - A list of Books

app.get('/books',async(req,res)=>{
    
    try {
        const books = await Book.find();
        res.status(201).send(books);
    } catch (error) {
        res.status(400).send(error.message)
    }
})

app.get('/book/:id',async(req,res)=>{
    
    try {
        const books = await Book.findById(req.params.id);
        res.status(201).send(books);
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// uopdate a list of book
app.put('/book/:id',async(req,res)=>{
    
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, 
            {new:true});
        res.status(201).send(book);
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// delete a list of book
app.delete('/book/:id',async(req,res)=>{
    
    try {
        const result = await Book.findByIdAndDelete(req.params.id);
        if(result)res.status(201).send({message:"book is deleted successfully"});  
        res.status(404).send("book not found")
    } catch (error) {
        res.status(400).send(error.message)
    }
})


app.listen(PORT,function(error){
    if(error){
        console.log("somthing wants wrong:",error)
    }else{
        console.log("The Server is listening on port :",PORT)
    }
})