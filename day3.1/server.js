const express = require("express");
const bodyparser =require("body-parser");
const app = express()

app.use(bodyparser.json())
const port = 8080

const items=[
    {id : 1, name:"item1"},
    {id : 2, name:"item2"},
    {id : 3, name:"item3"}
]

app.get('/', function (req, res) {
    res.send('Hello World');
 });

 app.get("/getItems", (req, res) => {
    res.json(items);
  });
  
  app.post("/items", (req, res) => {
    const newItem = req.body;
    if (!newItem.id || !newItem.name) {
      return res.status(500).send("Item must have an id and name!");
    }
  
    items.push(newItem);
    res.status(201).send(`Item added with ID: ${newItem.id}!`);
  });

  app.put("/items/:id", (req, res) => {
    const itemId = parseInt(req.params.id);
    const updatedItem = req.body;
  
    const index = items.findIndex((item) => item.id === itemId);
    if (index === -1) {
      return res.status(404).send("Item not found!");
    }
  
    if (!updatedItem.name) {
      return res.status(500).send("Item must have a name!");
    }
  
    items[index].name = updatedItem.name;
    res.status(201).send(`Item updated with ID: ${itemId}!`);
  });

  app.delete("/items/:id", (req, res) => {
    const itemId = parseInt(req.params.id);
    
  
    const index = items.findIndex((item) => item.id === itemId);
    if (index === -1) {
      return res.status(404).send("Item not found!");
    }
  
  
    items.splice(index ,1  )
    res.status(201).send(`Item updated with ID: ${itemId}!`);
  });

 app.listen(port, function (error) {
  
    // Checking any error occur while listening on port
    if (error) {
        console.log('Something went wrong', error);
    }
    // Else sent message of listening
    else {
        console.log('Server is listening on port' + port);
    }
})