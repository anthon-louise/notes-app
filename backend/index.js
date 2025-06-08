
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors());

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
];

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
});

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const note = notes.find((note) => note.id === id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  notes = notes.filter((note) => note.id !== id);
  res.status(204).end();
});

app.post('/api/notes', (req, res) => {
  const body = req.body;

  // Validate request body
  if (!body.content) {
    return res.status(400).json({ error: 'content missing' });
  }

  const note = {
    id: String(notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) + 1 : 1),
    content: body.content,
    important: body.important || false,
    date: body.date || new Date().toISOString()
  };

  notes = notes.concat(note);
  res.json(note);
});

app.put('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const body = req.body;

  const note = notes.find((note) => note.id === id);
  if (!note) {
    return res.status(404).json({ error: 'note not found' });
  }

  // Validate request body for content if provided
  if (body.content && !body.content.trim()) {
    return res.status(400).json({ error: 'content cannot be empty' });
  }

  const updatedNote = {
    id: note.id,
    content: body.content || note.content,
    important: body.hasOwnProperty('important') ? !!body.important : note.important,
    date: body.date || note.date
  };

  notes = notes.map(n => n.id === id ? updatedNote : n);
  res.json(updatedNote);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});