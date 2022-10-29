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
let note_data = require("./db/db.json")


//middle ware to serve static assets
app.use(express.static("public"));

//data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//goes to the homepage
app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, './public/index.html'));
})

//goes to the notes page
app.get('/notes', (req, res)=>{
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

//goes to the api/notes
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
            //sets a random id to each note created
            req.body.id = uuid.v4();
            notesArr.push(req.body);
            console.log(notesArr);
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

//delete notes from /api/notes/:id
app.delete('/api/notes/:id', (req,res)=>{
    console.log(req.params);
    console.log(note_data);
    let filteredData = note_data.filter(note=>{
        return note.id !== req.params.id;
    })
    console.log(filteredData);
    fs.writeFile('./db/db.json',
    JSON.stringify(filteredData,null,4),
    (err, data)=>{
        if(err) {
            throw err;
        }
        res.json(filteredData)
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
  