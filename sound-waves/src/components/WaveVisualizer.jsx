import { useRef, useEffect } from 'react';

const COLORS = [
  '#4fc3f7', // light blue
  '#ef5350', // red
  '#66bb6a', // green
  '#ffa726', // orange
  '#ab47bc', // purple
  '#26c6da', // cyan
  '#ec407a', // pink
  '#8d6e63', // brown
];

const COMBINED_COLOR = '#ffffff';

// Attempt to match the oscillator waveform shapes
// All use cosine-phase so crests align at t=0
function waveformValue(type, phase) {
  // phase is in radians (0 to 2*PI per cycle)
  // Normalize to [0, 1) cycle position
  const p = ((phase % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

  switch (type) {
    case 'sine':
      return Math.cos(phase);

    case 'triangle': {
      // Cosine-phase triangle: peak at 0, trough at PI
      const t = p / (2 * Math.PI);
      if (t < 0.25) return 1 - 4 * t;
      if (t < 0.75) return -1 + 4 * (t - 0.25);
      return 1 - 4 * (1 - t);
    }

    case 'sawtooth': {
      // Cosine-phase sawtooth: peak at 0, ramp down
      const t = p / (2 * Math.PI);
      if (t < 0.5) return 1 - 4 * t;
      return -3 + 4 * t;
    }

    case 'square': {
      // Cosine-phase square: high at 0, low at PI
      return p < Math.PI ? 1 : -1;
    }

    default:
      return Math.cos(phase);
  }
}

function drawWave(ctx, width, height, frequency, baseFreq, color, alpha, waveType) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 2.5;

  const cyclesOfRoot = 16;
  const totalTime = cyclesOfRoot / baseFreq;

  const centerY = height / 2;
  const amplitude = height * 0.38;

  for (let x = 0; x < width; x++) {
    const t = (x / width) * totalTime;
    const phase = 2 * Math.PI * frequency * t;
    const y = centerY - amplitude * waveformValue(waveType, phase);
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawCombinedWave(ctx, width, height, frequencies, baseFreq, waveType) {
  if (frequencies.length === 0) return;

  ctx.beginPath();
  ctx.strokeStyle = COMBINED_COLOR;
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.9;

  const cyclesOfRoot = 16;
  const totalTime = cyclesOfRoot / baseFreq;
  const centerY = height / 2;
  const amplitude = height * 0.38 / frequencies.length;

  for (let x = 0; x < width; x++) {
    const t = (x / width) * totalTime;
    let sum = 0;
    for (const freq of frequencies) {
      const phase = 2 * Math.PI * freq * t;
      sum += waveformValue(waveType, phase);
    }
    const y = centerY - amplitude * sum;
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawAlignmentMarkers(ctx, width, height, frequencies, baseFreq, waveType) {
  if (frequencies.length < 2) return;

  const cyclesOfRoot = 16;
  const totalTime = cyclesOfRoot / baseFreq;
  const amplitude = height * 0.38;
  const centerY = height / 2;

  for (let x = 0; x < width; x++) {
    const t = (x / width) * totalTime;
    let allNearPeak = true;
    for (const freq of frequencies) {
      const phase = 2 * Math.PI * freq * t;
      const val = waveformValue(waveType, phase);
      if (val < 0.95) {
        allNearPeak = false;
        break;
      }
    }
    if (allNearPeak) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(102, 187, 106, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.moveTo(x, centerY - amplitude - 10);
      ctx.lineTo(x, centerY + amplitude + 10);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}

function drawGrid(ctx, width, height) {
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, width, height);

  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  for (let i = 1; i < 4; i++) {
    const x = (i / 4) * width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
}

export default function WaveVisualizer({ frequencies, rootFrequency, showCombined = false, waveform = 'sine', height = 280, width = 3200 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const drawWidth = Math.max(width, canvas.parentElement.clientWidth);
    canvas.width = drawWidth * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const w = drawWidth;
    const h = height;

    drawGrid(ctx, w, h);
    drawAlignmentMarkers(ctx, w, h, frequencies, rootFrequency, waveform);

    const individualAlpha = showCombined ? 0.4 : 0.85;
    frequencies.forEach((freq, i) => {
      drawWave(ctx, w, h, freq, rootFrequency, COLORS[i % COLORS.length], individualAlpha, waveform);
    });

    if (showCombined) {
      drawCombinedWave(ctx, w, h, frequencies, rootFrequency, waveform);
    }
  }, [frequencies, rootFrequency, showCombined, waveform, height, width]);

  return (
    <div style={{ overflowX: 'auto', borderRadius: '8px' }}>
      <canvas
        ref={canvasRef}
        style={{ width: `${width}px`, minWidth: '100%', height: `${height}px`, borderRadius: '8px', display: 'block' }}
      />
    </div>
  );
}

export { COLORS };
