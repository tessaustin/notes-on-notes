const express = require('express');
const { noteData } = require('./db/db.json')

const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 3001;
const app = express();

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

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

