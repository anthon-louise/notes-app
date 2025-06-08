import { useState, useEffect } from 'react';
import Note from './components/Note';
import noteService from './services/notes';
import Notification from './components/Notification'
import Footer from './components/Footer';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState('')

  // Fetch notes on component mount
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes);
      })
      .catch(error => {
        console.error('Error fetching notes:', error);
        setError('Failed to load notes from server');
      });
  }, []);

  // Handle input change
  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };


  // Handle form submission to add a new note
  const addNote = (event) => {
    event.preventDefault();
    if (newNote.trim() === '') return;

    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
    };

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote));
        setNewNote('');
      })
      .catch(error => {
        console.error('Error adding note:', error);
        setError('Failed to add note to server');
      });
  };

  // Toggle importance of a note
  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(n => n.id !== id ? n : returnedNote));
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from the server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id));
      });
  };

  // Toggle between showing all or important notes
  const handleToggleShow = () => {
    setShowAll(!showAll);
  };

  // Filter notes based on showAll state
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <button onClick={handleToggleShow}>
          Show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => (
          <Note
            key={note.id}
            content={note.content}
            important={note.important}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
          placeholder="Type a new note"
        />
        <button type="submit">Save</button>
      </form>

      <Footer/>
    </div>
  );
};

export default App;