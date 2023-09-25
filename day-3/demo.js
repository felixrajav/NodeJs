const express = require("express");
const bodyParser =require("body-parser")
const app = express();

const port =3000;

app.use(bodyParser.json);

let items = [
    {id : 1, name :"item1"},
    {id : 2, name :"item2"},
    {id : 3, name :"item3"}
]

app.post("./items",(req,res)=>{
    const newItems = req.body;
    if(! newItems.id || !newItems.name){
        return res.status(500).send("item must have id and Name")
    }
    items.push(newItems);
    res.status(201).send(`item added with id : ${newItems.id}`)
});

app.get("./getItems",(req,res)=>{
    req.json(items)
})

app.listen(port,()=>{
    console.log("server is running on port:",port);
})