import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateNote from './components/CreateNote';
import ReadNote from './components/ReadNote';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateNote />} />
        <Route path="/note/:id" element={<ReadNote />} />
      </Routes>
    </Router>
  );
}

export default App;
