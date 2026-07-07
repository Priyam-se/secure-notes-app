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
      const response = await axios.post(`/api/notes`, { content });
      
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
            {loading ? 'Encrypting...' : 'Generate Secret Link'}
          </button>
        </form>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-neon)' }}>
            <AlertTriangle size={20} />
            <strong>Success! Your note is encrypted.</strong>
          </div>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Anyone with this link can read the note ONCE. After that, it is gone forever.
          </p>
          
          <div className="url-box">
            <span>{url}</span>
            <button 
              onClick={copyToClipboard}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent-neon)', cursor: 'pointer' }}
              title="Copy to clipboard"
            >
              <Copy size={20} />
            </button>
          </div>
          
          {copied && <p style={{ color: 'var(--accent-neon)', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'right' }}>Copied to clipboard!</p>}

          <button onClick={() => setUrl('')} className="cyber-btn" style={{ marginTop: '2rem', background: 'transparent', borderStyle: 'dashed' }}>
            Create Another Note
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateNote;
