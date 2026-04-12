import { useState } from 'react';
import { CHORD_TYPES, getIntervalByName, getFrequencyForInterval, frequencyToNoteName } from '../services/musicTheory';
import { playChordForDuration, playTone, stopTone } from '../services/audioEngine';

export default function ChordBuilder({ rootFrequency, onSelectChord }) {
  const [activeNote, setActiveNote] = useState(null);

  function handlePlayChord(chord) {
    stopNote();
    const frequencies = chord.intervals.map(name => {
      const interval = getIntervalByName(name);
      return getFrequencyForInterval(rootFrequency, interval);
    });
    playChordForDuration(frequencies, 2500);
  }

  function handleSelectChord(chord) {
    onSelectChord(chord.intervals);
  }

  function handlePlayNote(freq, noteKey) {
    // If same note is already playing, stop it
    if (activeNote === noteKey) {
      stopNote();
      return;
    }
    // Stop previous note, play new one
    stopTone('chord-single');
    playTone(freq, 'chord-single');
    setActiveNote(noteKey);
  }

  function stopNote() {
    stopTone('chord-single');
    setActiveNote(null);
  }

  return (
    <div className="chord-builder">
      <div className="chord-grid">
        {CHORD_TYPES.map(chord => {
          return (
            <div key={chord.name} className="chord-card">
              <h4>{chord.name}</h4>
              <p className="chord-description">{chord.description}</p>
              <div className="chord-notes">
                {chord.intervals.map((name) => {
                  const interval = getIntervalByName(name);
                  const freq = getFrequencyForInterval(rootFrequency, interval);
                  const noteKey = `${chord.name}-${name}`;
                  const isActive = activeNote === noteKey;
                  return (
                    <span
                      key={name}
                      className={`chord-note clickable ${isActive ? 'active' : ''}`}
                      onClick={() => handlePlayNote(freq, noteKey)}
                      title="Click to play this note"
                    >
                      {frequencyToNoteName(freq)}
                      <small>{freq.toFixed(1)} Hz</small>
                    </span>
                  );
                })}
              </div>
              <div className="chord-ratios">
                {chord.intervals.map(name => {
                  const interval = getIntervalByName(name);
                  return <span key={name} className="ratio-tag">{interval.ratio[0]}:{interval.ratio[1]}</span>;
                })}
              </div>
              <div className="chord-actions">
                <button className="play-btn" onClick={() => { stopNote(); handlePlayChord(chord); }}>
                  &#9654; Play
                </button>
                <button className="play-btn outline" onClick={() => handleSelectChord(chord)}>
                  Visualize
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
