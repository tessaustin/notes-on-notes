const fs = require('fs')
const path = require('path')
const express = require('express');
const { noteData } = require('./db/db.json')

const PORT = process.env.PORT || 3001;
const app = express();


//////MIDDLEWARE//////

app.use(express.static('public'));
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());


//////FUNCTIONS//////

function filterByQuery(query, notesArray) {
    let filteredResults = notesArray;
    if (query.title) {
        filteredResults = filteredResults.filter(noteData => noteData.title === query.title);
    }
    if (query.text) {
        filteredResults = filteredResults.filter(noteData => noteData.text === query.text);
    }
    return filteredResults;
}

function findById(id, notesArray) {
    const result = notesArray.filter(noteData => noteData.id === id)[0];
    return result;
}

function createNewNote(body, notesArray) {
    const newNote = body;
    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ noteData: notesArray }, null, 2)
    );
    return newNote;
}

function validateNoteData(data) {
    if (!data.title || typeof data.title !== 'string') {
        return false;
    }
    if (!data.text || typeof data.text !== 'string') {
        return false;
    }
    return true;
}


//////ROUTES//////

app.get('/api/notes', (req, res) => {
    let results = noteData;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, noteData);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

app.post('/api/notes', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = noteData.length.toString();
    if(!validateNoteData(req.body)) {
        res.status(400).send('Your note is not properly formatted.')
    } else {
        const newNote = createNewNote(req.body, noteData);
        res.json(newNote);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

