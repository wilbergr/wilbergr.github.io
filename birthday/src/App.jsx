
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import './App.css';
import memesData from './memes.json';

function App() {
  // Load images and meme text from memes.json
  const [images, setImages] = useState(memesData);
  const [current, setCurrent] = useState(0);
  const [topText, setTopText] = useState(memesData[0]?.topText || '');
  const [bottomText, setBottomText] = useState(memesData[0]?.bottomText || '');
  const canvasRef = useRef(null);

  // Handle image upload (still allow user uploads)
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const imgObjs = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      topText: '',
      bottomText: ''
    }));
    setImages(prev => [...prev, ...imgObjs]);
    setCurrent(images.length);
    setTopText('');
    setBottomText('');
  };

  // Draw meme on canvas
  // Helper to wrap text to fit width
  function wrapText(ctx, text, x, y, maxWidth, lineHeight, fontSize) {
    if (!text) return;
    const words = text.split(' ');
    let line = '';
    let lines = [];
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);
    for (let i = 0; i < lines.length; i++) {
      ctx.strokeText(lines[i].trim(), x, y + i * lineHeight);
      ctx.fillText(lines[i].trim(), x, y + i * lineHeight);
    }
  }

  const drawMeme = () => {
    if (!images[current]) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = images[current].url;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Fit font size to width
      function getFontSize(text, maxWidth, baseSize) {
        let size = baseSize;
        ctx.font = `bold ${size}px Impact, Arial, sans-serif`;
        while (ctx.measureText(text).width > maxWidth && size > 10) {
          size -= 2;
          ctx.font = `bold ${size}px Impact, Arial, sans-serif`;
        }
        return size;
      }

      // Top text
      let topFontSize = getFontSize(topText, canvas.width * 0.95, Math.floor(canvas.width/10));
      ctx.font = `bold ${topFontSize}px Impact, Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = Math.max(4, Math.floor(topFontSize/6));
      ctx.fillStyle = 'white';
      wrapText(ctx, topText, canvas.width/2, topFontSize + 10, canvas.width * 0.95, topFontSize + 4, topFontSize);

      // Bottom text
      let bottomFontSize = getFontSize(bottomText, canvas.width * 0.95, Math.floor(canvas.width/10));
      ctx.font = `bold ${bottomFontSize}px Impact, Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = Math.max(4, Math.floor(bottomFontSize/6));
      ctx.fillStyle = 'white';
      // Calculate how many lines for bottom text
      const tempLines = [];
      if (bottomText) {
        let words = bottomText.split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > canvas.width * 0.95 && n > 0) {
            tempLines.push(line);
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        tempLines.push(line);
      }
      const totalBottomHeight = tempLines.length * (bottomFontSize + 4);
      const startY = canvas.height - totalBottomHeight + bottomFontSize/2 - 10;
      wrapText(ctx, bottomText, canvas.width/2, startY, canvas.width * 0.95, bottomFontSize + 4, bottomFontSize);
    };
  };



  // Redraw meme when image or text changes
  useEffect(() => {
    if (images.length > 0) drawMeme();
    // eslint-disable-next-line
    // react-hooks/exhaustive-deps
  }, [images, current, topText, bottomText]);

  // Download meme
  const handleDownload = () => {
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'birthday-meme.png';
    a.click();
  };

  return (
    <div className="birthday-app">
      {/* Balloons left */}
      <svg className="balloon-decor" width="80" height="140" viewBox="0 0 80 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="40" cy="50" rx="30" ry="40" fill="#6ec6f7" stroke="#1e90ff" strokeWidth="3"/>
        <ellipse cx="25" cy="60" rx="15" ry="20" fill="#42a5f5" stroke="#1e90ff" strokeWidth="2"/>
        <ellipse cx="55" cy="65" rx="12" ry="18" fill="#b6e0fe" stroke="#1e90ff" strokeWidth="2"/>
        <path d="M40 90 Q40 120 30 130" stroke="#1e90ff" strokeWidth="2" fill="none"/>
        <path d="M40 90 Q50 120 60 130" stroke="#1e90ff" strokeWidth="2" fill="none"/>
      </svg>
      {/* Balloons right */}
      <svg className="balloon-decor-right" width="80" height="140" viewBox="0 0 80 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="40" cy="50" rx="30" ry="40" fill="#42a5f5" stroke="#1e90ff" strokeWidth="3"/>
        <ellipse cx="25" cy="60" rx="15" ry="20" fill="#6ec6f7" stroke="#1e90ff" strokeWidth="2"/>
        <ellipse cx="55" cy="65" rx="12" ry="18" fill="#b6e0fe" stroke="#1e90ff" strokeWidth="2"/>
        <path d="M40 90 Q40 120 30 130" stroke="#1e90ff" strokeWidth="2" fill="none"/>
        <path d="M40 90 Q50 120 60 130" stroke="#1e90ff" strokeWidth="2" fill="none"/>
      </svg>
      {/* Cake bottom center */}
      <svg className="cake-decor" width="100" height="70" viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="30" width="60" height="30" rx="10" fill="#fffde7" stroke="#1e90ff" strokeWidth="2"/>
        <rect x="30" y="20" width="40" height="20" rx="8" fill="#b6e0fe" stroke="#1e90ff" strokeWidth="2"/>
        <rect x="40" y="10" width="20" height="15" rx="5" fill="#6ec6f7" stroke="#1e90ff" strokeWidth="2"/>
        <rect x="48" y="2" width="4" height="10" rx="2" fill="#ffd54f"/>
        <ellipse cx="50" cy="2" rx="4" ry="2" fill="#ffd54f"/>
      </svg>
      <h1>Birthday Meme Generator 🎉</h1>
      <input type="file" accept="image/*" multiple onChange={handleUpload} />
      {images.length > 0 && (
        <>
          <div className="carousel-controls">
            <button onClick={() => {
              const newIdx = (current-1+images.length)%images.length;
              setCurrent(newIdx);
              setTopText(images[newIdx]?.topText || '');
              setBottomText(images[newIdx]?.bottomText || '');
            }}>&lt;</button>
            <span>{current+1} / {images.length}</span>
            <button onClick={() => {
              const newIdx = (current+1)%images.length;
              setCurrent(newIdx);
              setTopText(images[newIdx]?.topText || '');
              setBottomText(images[newIdx]?.bottomText || '');
            }}>&gt;</button>
          </div>
          <div className="meme-editor">
            <canvas ref={canvasRef} style={{maxWidth:'100%', maxHeight:400, border:'2px solid #ccc', marginBottom:16}} />
            <div style={{
              marginBottom: 8,
              color: '#b23a8e',
              fontSize: '1.05em',
              fontWeight: 500,
              letterSpacing: '0.5px',
              background: 'rgba(245, 222, 255, 0.5)',
              borderRadius: 8,
              padding: '4px 14px',
              display: 'inline-block',
              boxShadow: '0 1px 6px #e14ca522'
            }}>
              <span>
                {images[current].name ? `📷 ${images[current].name}` : '📷 Image'}
              </span>
            </div>
            <div className="text-inputs">
              <input type="text" placeholder="Top text" value={topText} onChange={e=>setTopText(e.target.value)} />
              <input type="text" placeholder="Bottom text" value={bottomText} onChange={e=>setBottomText(e.target.value)} />
            </div>
            <button onClick={handleDownload}>Download Meme</button>
          </div>
        </>
      )}
      {images.length === 0 && <p>No images found. Add images to the images folder or upload your own!</p>}
    </div>
  );
}

export default App;
