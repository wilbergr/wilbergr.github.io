import { useState } from 'react';

export default function EducationalContent() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="educational-content">
      <section className="edu-section edu-intro">
        <h2>Harmony & Frequency Ratios</h2>
        <p>
          Sound is a vibration — its <strong>frequency</strong> (Hz) determines the pitch we hear.
          When two notes have a <strong>simple mathematical ratio</strong> between their frequencies,
          they sound pleasing together (<strong>consonance</strong>). Complex ratios create <strong>dissonance</strong>.
        </p>
        <div className="ratio-examples">
          <div className="ratio-example">
            <div className="ratio-big">2:1</div>
            <div className="ratio-label">Octave</div>
            <div className="ratio-desc">Maximum consonance</div>
          </div>
          <div className="ratio-example">
            <div className="ratio-big">3:2</div>
            <div className="ratio-label">Perfect Fifth</div>
            <div className="ratio-desc">Very consonant</div>
          </div>
          <div className="ratio-example">
            <div className="ratio-big">5:4</div>
            <div className="ratio-label">Major Third</div>
            <div className="ratio-desc">The "happy" interval</div>
          </div>
          <div className="ratio-example">
            <div className="ratio-big">45:32</div>
            <div className="ratio-label">Tritone</div>
            <div className="ratio-desc">Maximum dissonance</div>
          </div>
        </div>

        {!expanded && (
          <button className="learn-more-btn" onClick={() => setExpanded(true)}>
            Learn more about sound waves and harmony
          </button>
        )}
      </section>

      {expanded && (
        <>
          <section className="edu-section">
            <h2>Sound Waves & Frequency</h2>
            <p>
              Sound is a vibration that travels through air as a <strong>wave</strong>. The <strong>frequency</strong> of
              this wave — how many times it oscillates per second — determines the <strong>pitch</strong> we hear.
              Frequency is measured in <strong>Hertz (Hz)</strong>. A higher frequency means a higher pitch.
            </p>
            <p>
              For example, the note A4 (the A above middle C) vibrates at <strong>440 Hz</strong> — the air pressure
              oscillates 440 times every second.
            </p>
          </section>

          <section className="edu-section">
            <h2>Why Simple Ratios Sound Good</h2>
            <p>
              When two frequencies have a simple ratio like 3:2, their wave peaks <strong>regularly coincide</strong>.
              This creates a smooth, periodic combined waveform that our ears perceive as harmonious.
            </p>
            <p>
              When the ratio is complex (like 45:32), the peaks rarely align, creating an <strong>irregular
              combined wave</strong> with rapid fluctuations in amplitude called <strong>beating</strong> — perceived
              as roughness or dissonance.
            </p>
            <p>
              This is why the <strong>major triad</strong> (ratios 4:5:6) sounds so satisfying — three frequencies
              whose waves regularly reinforce each other, creating a rich, stable sound.
            </p>
          </section>

          <section className="edu-section">
            <h2>From Intervals to Chords</h2>
            <p>
              A <strong>chord</strong> is built by stacking intervals on top of a root note. A <strong>triad</strong> uses
              three notes; a <strong>tetrad</strong> (7th chord) uses four. The character of the chord — major, minor,
              diminished, augmented — comes entirely from which frequency ratios are combined.
            </p>
            <p>
              Use the tools below to explore these relationships. Enter any root frequency, see all the intervals it
              generates, visualize how the waves interact, and <strong>hear</strong> the difference between consonance
              and dissonance.
            </p>
          </section>

          <button className="learn-more-btn" onClick={() => setExpanded(false)}>
            Show less
          </button>
        </>
      )}
    </div>
  );
}
