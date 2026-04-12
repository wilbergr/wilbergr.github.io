// Web Audio API engine for generating tones with selectable waveform

let audioContext = null;
let currentWaveform = 'sine';
const activeOscillators = new Map();

export const WAVEFORMS = [
  { type: 'sine', label: 'Sine', description: 'Pure, smooth tone' },
  { type: 'triangle', label: 'Triangle', description: 'Warm, flute-like' },
  { type: 'sawtooth', label: 'Sawtooth', description: 'Rich, buzzy' },
  { type: 'square', label: 'Square', description: 'Hollow, retro' },
];

export function getWaveform() {
  return currentWaveform;
}

export function setWaveform(type) {
  currentWaveform = type;
  // Update any currently playing oscillators
  for (const entry of activeOscillators.values()) {
    entry.oscillator.type = type;
  }
}

export function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

export function playTone(frequency, id = null) {
  const ctx = getAudioContext();
  const key = id || frequency.toString();

  // Stop existing tone with same id
  stopTone(key);

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = currentWaveform;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  // Lower gain for harmonically rich waveforms to prevent clipping
  const gainLevels = { sine: 0.15, triangle: 0.12, sawtooth: 0.07, square: 0.06 };
  const gain = gainLevels[currentWaveform] || 0.15;

  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.05);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start();

  activeOscillators.set(key, { oscillator, gainNode });
  return key;
}

export function stopTone(key) {
  const entry = activeOscillators.get(key);
  if (entry) {
    const ctx = getAudioContext();
    entry.gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05);
    entry.oscillator.stop(ctx.currentTime + 0.1);
    activeOscillators.delete(key);
  }
}

export function stopAllTones() {
  for (const key of activeOscillators.keys()) {
    stopTone(key);
  }
}

export function playMultipleTones(frequencies) {
  stopAllTones();
  frequencies.forEach((freq, i) => {
    playTone(freq, `chord-${i}`);
  });
}

export function playToneForDuration(frequency, durationMs = 2000, id = null) {
  const key = playTone(frequency, id);
  setTimeout(() => stopTone(key), durationMs);
  return key;
}

export function playChordForDuration(frequencies, durationMs = 2000) {
  playMultipleTones(frequencies);
  setTimeout(() => stopAllTones(), durationMs);
}
