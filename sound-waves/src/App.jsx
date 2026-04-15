import { useState, useCallback, useMemo, useRef } from 'react';
import EducationalContent from './components/EducationalContent';
import WaveVisualizer from './components/WaveVisualizer';
import IntervalTable from './components/IntervalTable';
import ChordBuilder from './components/ChordBuilder';
import { getIntervalByName, getFrequencyForInterval, frequencyToNoteName, calculateConsonanceScore } from './services/musicTheory';
import { playMultipleTones, stopAllTones, playChordForDuration, playTone, stopTone, WAVEFORMS, setWaveform, getWaveform } from './services/audioEngine';
import './App.css';

function WaveformIcon({ type }) {
  const w = 24, h = 16;
  const paths = {
    sine: 'M0,8 C3,0 6,0 8,8 C10,16 13,16 16,8 C18,0 21,0 24,8',
    triangle: 'M0,8 L6,1 L12,15 L18,1 L24,8',
    sawtooth: 'M0,8 L10,1 L10,15 L20,1 L20,15 L24,8',
    square: 'M0,12 L0,3 L6,3 L6,13 L12,13 L12,3 L18,3 L18,13 L24,13 L24,8',
  };
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <path d={paths[type]} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const COMMON_FREQUENCIES = [
  { label: 'C2 (65.4 Hz)', value: 65.41 },
  { label: 'C3 (130.8 Hz)', value: 130.81 },
  { label: 'A3 (220 Hz)', value: 220 },
  { label: 'C4 / Middle C (261.6 Hz)', value: 261.63 },
  { label: 'A4 / Concert Pitch (440 Hz)', value: 440 },
  { label: 'C5 (523.3 Hz)', value: 523.25 },
];

export default function App() {
  const [rootFrequency, setRootFrequency] = useState(261.63);
  const [freqInput, setFreqInput] = useState('261.63');
  const [selectedIntervals, setSelectedIntervals] = useState(['P1', 'M3', 'P5']);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCombined, setShowCombined] = useState(false);
  const [waveform, setWaveformState] = useState(getWaveform());
  const [cycles, setCycles] = useState(16);
  const [volumes, setVolumes] = useState({});
  const vizRef = useRef(null);

  const handleWaveformChange = useCallback((type) => {
    setWaveform(type);
    setWaveformState(type);
  }, []);

  const handleFreqChange = useCallback((e) => {
    setFreqInput(e.target.value);
    const val = parseFloat(e.target.value);
    if (val >= 20 && val <= 4000) {
      setRootFrequency(val);
    }
  }, []);

  const handlePreset = useCallback((value) => {
    setRootFrequency(value);
    setFreqInput(value.toString());
  }, []);

  const handleToggleInterval = useCallback((shortName) => {
    setSelectedIntervals(prev => {
      if (prev.includes(shortName)) {
        return prev.filter(s => s !== shortName);
      }
      return [...prev, shortName];
    });
  }, []);

  const handleVolumeChange = useCallback((shortName, value) => {
    setVolumes(prev => ({ ...prev, [shortName]: value }));
  }, []);

  const handleSelectChord = useCallback((intervals) => {
    setSelectedIntervals(intervals);
    setTimeout(() => {
      vizRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, []);

  const selectedFrequencies = useMemo(() => {
    return selectedIntervals.map(name => {
      const interval = getIntervalByName(name);
      return getFrequencyForInterval(rootFrequency, interval);
    });
  }, [rootFrequency, selectedIntervals]);

  const selectedVolumes = useMemo(() => {
    return selectedIntervals.map(name => volumes[name] ?? 1);
  }, [selectedIntervals, volumes]);

  const consonanceScore = useMemo(() => {
    return calculateConsonanceScore(selectedFrequencies);
  }, [selectedFrequencies]);

  const handlePlaySelected = () => {
    if (isPlaying) {
      stopAllTones();
      setIsPlaying(false);
    } else {
      playMultipleTones(selectedFrequencies, selectedVolumes);
      setIsPlaying(true);
    }
  };

  const handlePlayForDuration = () => {
    playChordForDuration(selectedFrequencies, 3000, selectedVolumes);
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 3000);
  };

  const consonanceLabel = consonanceScore > 0.1 ? 'Highly Consonant' :
    consonanceScore > 0.06 ? 'Consonant' :
    consonanceScore > 0.03 ? 'Mildly Dissonant' : 'Dissonant';

  const consonanceColor = consonanceScore > 0.1 ? '#66bb6a' :
    consonanceScore > 0.06 ? '#a5d6a7' :
    consonanceScore > 0.03 ? '#ffa726' : '#ef5350';

  return (
    <div className="app">
      <header className="app-header">
        <a href="/" className="back-link">&larr; Back to Apps</a>
        <h1>Sound Waves & Harmony</h1>
        <p className="subtitle">Explore how frequency ratios create musical harmony</p>
      </header>

      <EducationalContent />

      <section className="controls-section">
        <h2>Frequency Explorer</h2>
        <div className="frequency-input-group">
          <label>
            Root Frequency (Hz):
            <input
              type="number"
              min="20"
              max="4000"
              step="0.01"
              value={freqInput}
              onChange={handleFreqChange}
              className="freq-input"
            />
          </label>
          <span className="note-label">{frequencyToNoteName(rootFrequency)}</span>

          <div className="frequency-slider">
            <input
              type="range"
              min="20"
              max="2000"
              step="1"
              value={rootFrequency}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setRootFrequency(val);
                setFreqInput(e.target.value);
                playTone(val, 'slider');
              }}
              onMouseUp={() => stopTone('slider')}
              onTouchEnd={() => stopTone('slider')}
            />
          </div>

          <div className="presets">
            {COMMON_FREQUENCIES.map(p => (
              <button
                key={p.value}
                className={`preset-btn ${Math.abs(rootFrequency - p.value) < 0.1 ? 'active' : ''}`}
                onClick={() => handlePreset(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="waveform-picker">
            <span className="waveform-label">Waveform:</span>
            {WAVEFORMS.map(w => (
              <button
                key={w.type}
                className={`waveform-btn ${waveform === w.type ? 'active' : ''}`}
                onClick={() => handleWaveformChange(w.type)}
                title={w.description}
              >
                <WaveformIcon type={w.type} />
                {w.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Interval Table</h2>
        <p className="section-desc">
          Select intervals to visualize and hear. Each row shows the just intonation ratio, resulting frequency,
          and nearest note name. Click checkboxes to add/remove from visualization.
        </p>
        <IntervalTable
          rootFrequency={rootFrequency}
          selectedIntervals={selectedIntervals}
          onToggleInterval={handleToggleInterval}
          volumes={volumes}
          onVolumeChange={handleVolumeChange}
        />
      </section>

      <section className="section visualization-section" ref={vizRef}>
        <h2>Wave Visualization</h2>

        <div className="viz-controls">
          <div className="selected-info">
            <strong>Selected:</strong>{' '}
            {selectedIntervals.map(name => {
              const interval = getIntervalByName(name);
              const freq = getFrequencyForInterval(rootFrequency, interval);
              const vol = volumes[name] ?? 1;
              return (
                <span key={name} className="selected-tag">
                  {name} ({freq.toFixed(1)} Hz{vol < 1 ? ` @ ${Math.round(vol * 100)}%` : ''})
                </span>
              );
            })}
          </div>
          <div className="consonance-meter">
            <span>Harmony: </span>
            <span className="consonance-label" style={{ color: consonanceColor }}>
              {consonanceLabel}
            </span>
            <div className="consonance-bar">
              <div
                className="consonance-fill"
                style={{
                  width: `${Math.min(consonanceScore * 500, 100)}%`,
                  backgroundColor: consonanceColor
                }}
              />
            </div>
          </div>
          <div className="play-controls">
            <button className={`play-btn ${isPlaying ? 'playing' : ''}`} onClick={handlePlaySelected}>
              {isPlaying ? '\u25A0 Stop' : '\u25B6 Play (Hold)'}
            </button>
            <button className="play-btn" onClick={handlePlayForDuration}>
              {'\u25B6'} Play 3s
            </button>
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showCombined}
                onChange={(e) => setShowCombined(e.target.checked)}
              />
              Show combined wave
            </label>
          </div>
          <div className="cycles-control">
            <label>
              Cycles: <strong>{cycles}</strong>
              <span className="info-tooltip">
                <span className="info-icon">?</span>
                <span className="info-popup">
                  A <strong>cycle</strong> is one complete repetition of the root frequency's wave — from peak to peak.
                  More cycles let you see longer patterns of how waves align (consonance) or drift apart (dissonance).
                  At low cycle counts you see individual wave shapes clearly; at high counts you can observe large-scale
                  interference patterns.
                </span>
              </span>
              <input
                type="range"
                min="1"
                max="200"
                step="1"
                value={cycles}
                onChange={(e) => setCycles(parseInt(e.target.value, 10))}
                className="cycles-slider"
              />
            </label>
          </div>
        </div>

        <p className="viz-hint">Each color represents one frequency. Notice how simpler ratios create waves whose crests overlap regularly.</p>
        <WaveVisualizer
          frequencies={selectedFrequencies}
          rootFrequency={rootFrequency}
          showCombined={showCombined}
          waveform={waveform}
          height={280}
          width={Math.max(800, cycles * 200)}
          cycles={cycles}
          volumes={selectedVolumes}
        />
      </section>

      <section className="section">
        <h2>Chord Explorer</h2>
        <p className="section-desc">
          Click any chord to hear it or visualize its wave pattern. Chords are built by stacking specific
          intervals — each one has a unique character determined by its frequency ratios.
        </p>
        <ChordBuilder
          rootFrequency={rootFrequency}
          onSelectChord={handleSelectChord}
        />
      </section>

      <footer className="app-footer">
        <p>
          Sound Waves & Harmony Explorer | Ratios shown are <strong>just intonation</strong> (pure mathematical ratios
          from the harmonic series). Modern pianos use <strong>equal temperament</strong>, which slightly adjusts
          these ratios so all keys sound equally in tune.
        </p>
      </footer>
    </div>
  );
}
