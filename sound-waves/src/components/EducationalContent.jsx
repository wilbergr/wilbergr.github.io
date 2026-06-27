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
            <h2>Amplitude & Volume</h2>
            <p>
              While frequency determines <strong>pitch</strong>, a wave's <strong>amplitude</strong> determines
              its <strong>loudness</strong>. Amplitude is the height of the wave — how far the air pressure swings
              above and below its resting point. A taller wave pushes your eardrum harder, so you hear a louder sound.
            </p>
            <p>
              Amplitude is measured in different ways depending on context. In physics, it's often expressed
              as <strong>pressure</strong> (pascals). In audio, we use <strong>decibels (dB)</strong> — a logarithmic
              scale where every +10 dB sounds roughly <em>twice as loud</em> to our ears.
            </p>
            <p>
              When multiple notes play together, their amplitudes <strong>add up</strong>. If two waves peak at the same
              moment, they reinforce each other (<strong>constructive interference</strong>), creating a louder combined
              wave. If one peaks while the other dips, they cancel out (<strong>destructive interference</strong>),
              making the combined wave quieter.
            </p>
            <p>
              <strong>Try it:</strong> Use the <strong>Volume</strong> sliders in the Interval Table to adjust individual
              note amplitudes. Watch how the wave height changes in the visualization — a note at 50% volume draws a wave
              at half the height. Turn on "Show combined wave" to see how different amplitude balances change the combined
              waveform shape.
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
            <h2>Types of Consonance & Dissonance</h2>
            <p>
              In music theory, intervals are classified by how stable or tense they sound. These categories come from
              centuries of Western music tradition and are rooted in the simplicity of their frequency ratios.
            </p>
            <div className="consonance-definitions">
              <div className="consonance-def">
                <h3>Perfect Consonance</h3>
                <p>
                  The most stable, "pure" sounding intervals. These have the simplest frequency ratios and their
                  wave peaks align very frequently. They sound so stable that they can feel "hollow" or "open."
                </p>
                <ul>
                  <li><strong>Unison (P1)</strong> — ratio 1:1 — identical frequencies</li>
                  <li><strong>Octave (P8)</strong> — ratio 2:1 — one note vibrates exactly twice as fast</li>
                  <li><strong>Perfect Fifth (P5)</strong> — ratio 3:2 — the backbone of most chords</li>
                  <li><strong>Perfect Fourth (P4)</strong> — ratio 4:3 — the fifth's "mirror"</li>
                </ul>
              </div>
              <div className="consonance-def">
                <h3>Imperfect Consonance</h3>
                <p>
                  Pleasant and harmonious, but with more warmth and color than perfect consonances. These are the
                  intervals that give chords their major or minor character.
                </p>
                <ul>
                  <li><strong>Major Third (M3)</strong> — ratio 5:4 — bright, happy sound</li>
                  <li><strong>Minor Third (m3)</strong> — ratio 6:5 — dark, sad sound</li>
                  <li><strong>Major Sixth (M6)</strong> — ratio 5:3 — warm, sweet</li>
                  <li><strong>Minor Sixth (m6)</strong> — ratio 8:5 — bittersweet, emotional</li>
                </ul>
              </div>
              <div className="consonance-def">
                <h3>Dissonance</h3>
                <p>
                  Intervals that create tension and instability. Their complex ratios mean wave peaks rarely align,
                  producing "beating" — rapid fluctuations that sound rough. Dissonance isn't bad — it creates
                  musical tension that makes resolution to consonance satisfying.
                </p>
                <ul>
                  <li><strong>Major Second (M2)</strong> — ratio 9:8 — mild tension</li>
                  <li><strong>Minor Second (m2)</strong> — ratio 16:15 — sharp, clashing</li>
                  <li><strong>Tritone (TT)</strong> — ratio 45:32 — maximum dissonance, the "devil's interval"</li>
                  <li><strong>Major Seventh (M7)</strong> — ratio 15:8 — bright tension, wants to resolve up</li>
                  <li><strong>Minor Seventh (m7)</strong> — ratio 9:5 — bluesy, jazzy tension</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="edu-section">
            <h2>Calculating Frequencies from Ratios</h2>
            <p>
              To find the frequency of any interval, simply multiply the <strong>root frequency</strong> by the
              interval's <strong>ratio</strong>. These are <em>just intonation</em> ratios — pure mathematical
              relationships from the harmonic series.
            </p>
            <div className="math-examples">
              <p className="math-heading">Using Middle C (261.63 Hz) as the root:</p>
              <div className="math-example">
                <div className="math-formula">
                  <span className="math-interval">Perfect Fifth (P5)</span>
                  <span className="math-calc">261.63 Hz &times; 3/2 = <strong>392.45 Hz</strong></span>
                  <span className="math-note">&#8776; G4</span>
                </div>
              </div>
              <div className="math-example">
                <div className="math-formula">
                  <span className="math-interval">Major Third (M3)</span>
                  <span className="math-calc">261.63 Hz &times; 5/4 = <strong>327.04 Hz</strong></span>
                  <span className="math-note">&#8776; E4</span>
                </div>
              </div>
              <div className="math-example">
                <div className="math-formula">
                  <span className="math-interval">Octave (P8)</span>
                  <span className="math-calc">261.63 Hz &times; 2/1 = <strong>523.25 Hz</strong></span>
                  <span className="math-note">&#8776; C5</span>
                </div>
              </div>
              <div className="math-example">
                <div className="math-formula">
                  <span className="math-interval">Minor Third (m3)</span>
                  <span className="math-calc">261.63 Hz &times; 6/5 = <strong>313.96 Hz</strong></span>
                  <span className="math-note">&#8776; Eb4</span>
                </div>
              </div>
              <div className="math-example">
                <div className="math-formula">
                  <span className="math-interval">Perfect Fourth (P4)</span>
                  <span className="math-calc">261.63 Hz &times; 4/3 = <strong>348.83 Hz</strong></span>
                  <span className="math-note">&#8776; F4</span>
                </div>
              </div>
            </div>
            <p>
              <strong>Key insight:</strong> The simpler the fraction, the more consonant the interval.
              A fifth (3/2) sounds more stable than a tritone (45/32) because small whole numbers
              produce wave patterns that repeat more frequently.
            </p>
          </section>

          <section className="edu-section">
            <h2>Waveform Shapes</h2>
            <p>
              The <strong>waveform</strong> describes the <em>shape</em> of a sound wave — how the air pressure changes
              over each cycle. Different shapes produce different timbres (tone colors), even at the same pitch and
              volume. This is why a flute and a violin playing the same note sound different.
            </p>
            <div className="waveform-definitions">
              <div className="waveform-def">
                <h3>Sine Wave</h3>
                <p>
                  The purest, simplest sound — a single frequency with no overtones. It sounds smooth, clean, and
                  "electronic." Think of a tuning fork or a whistle. Sine waves are the building blocks of all other
                  waveforms — any complex sound can be broken down into a combination of sine waves
                  (this is called <strong>Fourier analysis</strong>).
                </p>
              </div>
              <div className="waveform-def">
                <h3>Triangle Wave</h3>
                <p>
                  A softer, mellower sound. Contains only <strong>odd harmonics</strong> (3rd, 5th, 7th...) that
                  fall off quickly in volume, giving it a gentler tone than a square wave. Sounds like a muted
                  woodwind or a soft flute. Often used in retro video game music for bass and melody lines.
                </p>
              </div>
              <div className="waveform-def">
                <h3>Sawtooth Wave</h3>
                <p>
                  The richest, most harmonically complex basic waveform. Contains <strong>all harmonics</strong> (both
                  odd and even) at decreasing amplitudes. Sounds bright, buzzy, and aggressive — like a bowed string
                  or a brass instrument. It's the most popular waveform in synthesizers because its harmonic richness
                  makes it a great starting point for filtering into other sounds.
                </p>
              </div>
              <div className="waveform-def">
                <h3>Square Wave</h3>
                <p>
                  A hollow, reedy sound. Contains only <strong>odd harmonics</strong> (3rd, 5th, 7th...) at stronger
                  amplitudes than a triangle wave, giving it a more nasal, clarinet-like quality. The abrupt on/off
                  nature of the wave creates a distinctive "buzzy" tone. Classic in 8-bit video game music and early
                  electronic music.
                </p>
              </div>
            </div>
            <p>
              <strong>Try it:</strong> Switch between waveforms using the picker above the visualization and listen
              to how the same intervals sound different with each shape. Notice how the wave overlaps look different
              too — more complex waveforms produce more intricate combined patterns.
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
