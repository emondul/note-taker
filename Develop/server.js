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