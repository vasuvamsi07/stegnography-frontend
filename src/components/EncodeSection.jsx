import React, { useState } from 'react';

const API_URL = 'https://steagnography-tool.onrender.com';

function EncodeSection() {
  const [file, setFile] = useState(null);
  const [maxChars, setMaxChars] = useState(null);
  const [message, setMessage] = useState('');
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const f = e.target.files[0];
    setFile(f);
    setResultUrl(null);
    setMessage('');
    setError('');
    setMaxChars(null);
    if (!f) return;
    if (f.size < 2 * 1024 * 1024 || f.size > 10 * 1024 * 1024) {
      setError('Image size must be between 2MB and 10MB.');
      return;
    }
    if (!f.name.toLowerCase().endsWith('.png')) {
      setError('Only PNG files are allowed.');
      return;
    }
    // Get max chars from backend
    const form = new FormData();
    form.append('file', f);
    try {
      const res = await fetch(`${API_URL}/max_chars`, { method: 'POST', body: form });
      const data = await res.json();
      if (res.ok) {
        setMaxChars(data.max_chars);
      } else {
        setError(data.detail || 'Failed to get max characters.');
      }
    } catch (err) {
      setError('Server error.');
    }
  };

  const handleEncode = async (e) => {
    e.preventDefault();
    setResultUrl(null);
    setError('');
    setLoading(true);
    const form = new FormData();
    form.append('file', file);
    form.append('message', message);
    try {
      const res = await fetch(`${API_URL}/encode`, { method: 'POST', body: form });
      if (res.ok) {
        const blob = await res.blob();
        setResultUrl(URL.createObjectURL(blob));
      } else {
        const data = await res.json();
        setError(data.detail || 'Encoding failed.');
      }
    } catch (err) {
      setError('Server error.');
    }
    setLoading(false);
  };

  return (
    <div className="section">
      <h2>Encode Message</h2>
      <input
        type="file"
        accept=".png"
        onChange={handleFileChange}
        style={{ marginBottom: '16px' }}
      />
      {maxChars !== null && (
        <div style={{ fontSize: 14, color: '#555', marginBottom: 8 }}>
          Max message length: <b>{maxChars}</b> characters
        </div>
      )}
      <form onSubmit={handleEncode} style={{ width: '100%' }}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your secret message..."
          maxLength={maxChars || 100000}
          rows={5}
          style={{ width: '100%', marginBottom: 12 }}
          disabled={!file || !maxChars}
        />
        <button
          type="submit"
          disabled={!file || !message || loading || message.length > maxChars}
          style={{
            padding: '10px 20px',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            marginBottom: 12,
          }}
        >
          {loading ? 'Encoding...' : 'Encode & Download'}
        </button>
      </form>
      {resultUrl && (
        <a
          href={resultUrl}
          download="encoded_image.png"
          style={{
            padding: '8px 16px',
            background: '#10b981',
            color: '#fff',
            borderRadius: 4,
            textDecoration: 'none',
            marginBottom: 8,
          }}
        >
          Download Encoded Image
        </a>
      )}
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </div>
  );
}

export default EncodeSection;