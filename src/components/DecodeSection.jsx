import React, { useState } from 'react';

const API_URL = 'https://steagnography-tool.onrender.com';

function DecodeSection() {
  const [file, setFile] = useState(null);
  const [decoded, setDecoded] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDecoded('');
    setError('');
  };

  const handleDecode = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setDecoded('');
    setError('');
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch(`${API_URL}/decode`, { method: 'POST', body: form });
      const data = await res.json();
      if (res.ok) {
        setDecoded(data.message);
      } else {
        setError(data.detail || 'Decoding failed.');
      }
    } catch (err) {
      setError('Server error.');
    }
    setLoading(false);
  };

  return (
    <div className="section">
      <h2>Decode Message</h2>
      <input
        type="file"
        accept="image/png,image/jpeg,image/bmp,image/webp"
        onChange={handleFileChange}
        style={{ marginBottom: '16px' }}
      />
      <form onSubmit={handleDecode} style={{ width: '100%' }}>
        <button
          type="submit"
          disabled={!file || loading}
          style={{
            padding: '10px 20px',
            background: '#6d28d9',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            marginBottom: 12,
          }}
        >
          {loading ? 'Decoding...' : 'Decode'}
        </button>
      </form>
      {decoded && (
        <div
          style={{
            marginTop: 20,
            padding: 12,
            background: '#fef9c3',
            borderRadius: 6,
            color: '#b45309',
            wordBreak: 'break-word',
          }}
        >
          <strong>Decoded Message:</strong>
          <div>{decoded}</div>
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </div>
  );
}

export default DecodeSection;