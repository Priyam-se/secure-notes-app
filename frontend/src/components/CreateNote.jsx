import React, { useState } from 'react';
import axios from 'axios';
import { Shield, Copy, Lock, AlertTriangle } from 'lucide-react';

const CreateNote = () => {
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      // Send the raw text to our secure backend
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${API_URL}/api/notes`, { content });
      
      // Generate the shareable link based on the returned ID
      const shareableLink = `${window.location.origin}/note/${response.data.id}`;
      setUrl(shareableLink);
      setContent(''); // Clear the text area for security
    } catch (error) {
      console.error('Failed to create note', error);
      alert('Failed to encrypt and save the note. Please try again.');
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="cyber-card">
      <h1 className="cyber-title">
        <Shield size={32} color="var(--accent-neon)" /> 
        Burn After Reading
      </h1>
      <p className="cyber-subtitle">
        Write a secret message. It will be encrypted with AES-256 and stored securely. 
        Once the link is opened, the note self-destructs forever.
      </p>

      {!url ? (
        <form onSubmit={handleSubmit}>
          <textarea
            className="cyber-textarea"
            placeholder="Type your top-secret message here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="cyber-btn" disabled={loading || !content.trim()}>
            <Lock size={20} />
            {loading ? 'ENCRYPTING...' : 'ENCRYPT & GENERATE LINK'}
          </button>
        </form>
      ) : (
        <div style={{ marginTop: '2.5rem' }}>
          <div className="success-text">
            <AlertTriangle size={24} />
            <span>ENCRYPTION SUCCESSFUL</span>
          </div>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
            The note is secured. Anyone with this link can read the note <strong>ONCE</strong>. After that, it self-destructs.
          </p>
          
          <div className="url-box">
            <span style={{ opacity: 0.9 }}>{url}</span>
            <button 
              className="copy-btn"
              onClick={copyToClipboard}
              title="Copy to clipboard"
            >
              <Copy size={20} />
            </button>
          </div>
          
          {copied && <p style={{ color: 'var(--accent-neon)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginTop: '0.75rem', textAlign: 'right', animation: 'slideUp 0.3s ease' }}>[Link Copied to Clipboard]</p>}

          <button onClick={() => setUrl('')} className="cyber-btn" style={{ marginTop: '2.5rem', background: 'transparent', borderStyle: 'dashed' }}>
            INITIALIZE NEW SECURE NOTE
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateNote;
