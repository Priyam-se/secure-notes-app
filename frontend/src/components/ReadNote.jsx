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
      const response = await axios.get(`/api/notes/${id}`);
      setNote(response.data.content);
      setDestroyed(true);
    } catch (err) {
      setError('Note not found. It may have expired or already been read.');
    }
    setLoading(false);
  };

  return (
    <div className="cyber-card">
      {!note && !error && (
        <div style={{ textAlign: 'center' }}>
          <ShieldAlert size={48} color="var(--accent-danger)" style={{ margin: '0 auto 1rem' }} />
          <h1 className="cyber-title" style={{ justifyContent: 'center' }}>Top Secret Note</h1>
          <p className="cyber-subtitle">
            You have been sent a secure message. 
            <br/>
            <strong>WARNING:</strong> Reading this message will permanently destroy it from our servers.
          </p>
          <button onClick={fetchNote} className="cyber-btn danger" disabled={loading}>
            <Flame size={20} />
            {loading ? 'Decrypting...' : 'Read & Destroy Note'}
          </button>
        </div>
      )}

      {note && (
        <div>
          <h1 className="cyber-title">
            <CheckCircle size={32} color="var(--accent-neon)" />
            Message Decrypted
          </h1>
          <p className="cyber-subtitle" style={{ color: 'var(--accent-danger)' }}>
            This note has been permanently deleted from the database. It exists only on your screen right now.
          </p>
          
          <div className="cyber-textarea" style={{ backgroundColor: 'rgba(0,0,0,0.6)', cursor: 'text', userSelect: 'all' }}>
            {note}
          </div>

          <button onClick={() => navigate('/')} className="cyber-btn" style={{ marginTop: '2rem' }}>
            Create Your Own Secret
          </button>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center' }}>
          <Flame size={48} color="var(--accent-danger)" style={{ margin: '0 auto 1rem' }} />
          <h1 className="cyber-title" style={{ justifyContent: 'center', color: 'var(--accent-danger)' }}>404 Not Found</h1>
          <p className="cyber-subtitle" style={{ color: 'var(--text-muted)' }}>
            {error}
          </p>
          <button onClick={() => navigate('/')} className="cyber-btn" style={{ background: 'transparent', borderStyle: 'dashed' }}>
            Go Home
          </button>
        </div>
      )}
    </div>
  );
};

export default ReadNote;
