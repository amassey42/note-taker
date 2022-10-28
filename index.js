//importing express packages
const express = require("express");
//import uuid package
const uuid= require('uuid');
console.log(uuid.v4())
// instantianting a new express server
const app = express();
// selecting network port
const PORT = process.env.PORT || 3000;
// importing path package from standard library
const path = require("path");
const fs = require("fs");
const { join } = require("path");

//middle ware to serve static assets
app.use(express.static("public"));

//data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, './public/index.html'));
})

app.get('/notes', (req, res)=>{
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.get('/api/notes', (req,res)=>{
    fs.readFile('./db/db.json', 'utf-8', (err, data)=>{
        if(err){
            throw err
        }else {
          res.json(JSON.parse(data))
        }
    })
})

//Post notes to db/json
app.post('/api/notes', (req,res)=>{
    fs.readFile('./db/db.json', 'utf-8', (err, data)=>{
        if (err){
            throw err;
        } else {
            const notesArr = JSON.parse(data);
            req.body.id = uuid.v4();
            notesArr.push(req.body);
            fs.writeFile('./db/db.json',
            JSON.stringify(notesArr,null,4),
            (err, data)=>{
                if(err) {
                    throw err;
                }
                res.send("Note Added")
            })
        }
    })
})

// catch all for all unhandled routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });
  
  //tells my server where to looks for requests
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}!`);
  });
  