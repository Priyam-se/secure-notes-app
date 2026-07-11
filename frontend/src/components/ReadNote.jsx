import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Flame, ShieldAlert, CheckCircle } from 'lucide-react';

const ReadNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [destroyed, setDestroyed] = useState(false);

  const fetchNote = async () => {
    setLoading(true);
    try {
      // The moment this GET request hits the backend, the note is deleted forever
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${API_URL}/api/notes/${id}`);
      setNote(response.data.content);
      setDestroyed(true);
    } catch (err) {
      setError('Note not found. It may have expired or already been read.');
    }
    setLoading(false);
  };

  return (
    <div className={`cyber-card ${!note ? 'danger-card' : ''}`}>
      {!note && !error && (
        <div style={{ textAlign: 'center' }}>
          <ShieldAlert size={56} color="var(--accent-danger)" style={{ margin: '0 auto 1.5rem', filter: 'drop-shadow(0 0 10px rgba(255, 42, 42, 0.5))' }} />
          <h1 className="cyber-title" style={{ justifyContent: 'center', color: 'var(--accent-danger)' }}>ENCRYPTED PAYLOAD</h1>
          <p className="cyber-subtitle" style={{ color: 'var(--text-main)' }}>
            You have been sent a secure message. 
            <br/><br/>
            <strong style={{ color: 'var(--accent-danger)' }}>WARNING:</strong> Reading this message will permanently destroy it from our servers.
          </p>
          <button onClick={fetchNote} className="cyber-btn danger" disabled={loading}>
            <Flame size={20} />
            {loading ? 'DECRYPTING...' : 'READ & DESTROY NOTE'}
          </button>
        </div>
      )}

      {note && (
        <div>
          <h1 className="cyber-title">
            <CheckCircle size={32} color="var(--accent-neon)" />
            PAYLOAD DECRYPTED
          </h1>
          <p className="cyber-subtitle" style={{ color: 'var(--accent-danger)' }}>
            This note has been permanently deleted from the database. It exists only on your screen right now.
          </p>
          
          <div className="cyber-textarea" style={{ backgroundColor: 'rgba(0,0,0,0.8)', cursor: 'text', userSelect: 'all', whiteSpace: 'pre-wrap' }}>
            {note}
          </div>

          <button onClick={() => navigate('/')} className="cyber-btn" style={{ marginTop: '2.5rem' }}>
            CREATE YOUR OWN SECRET
          </button>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center' }}>
          <Flame size={56} color="var(--accent-danger)" style={{ margin: '0 auto 1.5rem', filter: 'drop-shadow(0 0 10px rgba(255, 42, 42, 0.5))' }} />
          <h1 className="cyber-title" style={{ justifyContent: 'center', color: 'var(--accent-danger)' }}>404 NOT FOUND</h1>
          <p className="cyber-subtitle" style={{ color: 'var(--text-muted)' }}>
            {error}
          </p>
          <button onClick={() => navigate('/')} className="cyber-btn" style={{ background: 'transparent', borderStyle: 'dashed' }}>
            RETURN TO BASE
          </button>
        </div>
      )}
    </div>
  );
};

export default ReadNote;
