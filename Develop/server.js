const express = require('express');
const path = require('path');
const db = require('./db/db.json');
const { v4: uuid4 } = require('uuid');
const fs = require('fs');
const util = require('util');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
})

app.get('/api/notes', async (req,res) => {
    let dbData = [];
    const readFileAsync = util.promisify(fs.readFile);
    const freshDB = await readFileAsync('./db/db.json', 'utf8');
    dbData = [].concat(JSON.parse(freshDB));
    console.log(dbData);
    res.json(dbData);
  })

  app.post('/api/notes', (req,res) => {
    const {title, text} = req.body;
    
    if (title && text) {
        const newNote = {
          title,
          text,
          id: uuid4(),
        };
  
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
          if (err) {
            console.error(err);
          } else {
            const parsedNotes = JSON.parse(data);
  
            parsedNotes.push(newNote);
  
            fs.writeFile(
              './db/db.json',
              JSON.stringify(parsedNotes, null, 3),
              (writeErr) =>
                writeErr
                  ? console.error(writeErr)
                  : console.info('Successfully updated notes!')
            );
          }
        });
  
        const response = {
          status: 'success',
          body: newNote,
        };
  
        console.log(response);
        res.status(201).json(response);
      } else {
        res.status(500).json('Error in posting note');
      }
  
  });