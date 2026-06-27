// Just Intonation frequency ratios - derived from natural harmonic series
// These are the "pure" ratios that create consonant intervals

export const INTERVALS = [
  { name: 'Unison', shortName: 'P1', ratio: [1, 1], semitones: 0, consonance: 'perfect', description: 'Same frequency - complete overlap' },
  { name: 'Minor Second', shortName: 'm2', ratio: [16, 15], semitones: 1, consonance: 'dissonant', description: 'The most dissonant interval - creates beating' },
  { name: 'Major Second', shortName: 'M2', ratio: [9, 8], semitones: 2, consonance: 'dissonant', description: 'A whole step - mild dissonance' },
  { name: 'Minor Third', shortName: 'm3', ratio: [6, 5], semitones: 3, consonance: 'imperfect', description: 'Sad/dark quality - ratio 6:5' },
  { name: 'Major Third', shortName: 'M3', ratio: [5, 4], semitones: 4, consonance: 'imperfect', description: 'Bright/happy quality - ratio 5:4' },
  { name: 'Perfect Fourth', shortName: 'P4', ratio: [4, 3], semitones: 5, consonance: 'perfect', description: 'Strong consonance - ratio 4:3' },
  { name: 'Tritone', shortName: 'TT', ratio: [45, 32], semitones: 6, consonance: 'dissonant', description: 'The "devil\'s interval" - maximum tension' },
  { name: 'Perfect Fifth', shortName: 'P5', ratio: [3, 2], semitones: 7, consonance: 'perfect', description: 'Most consonant after unison/octave - ratio 3:2' },
  { name: 'Minor Sixth', shortName: 'm6', ratio: [8, 5], semitones: 8, consonance: 'imperfect', description: 'Inversion of major third' },
  { name: 'Major Sixth', shortName: 'M6', ratio: [5, 3], semitones: 9, consonance: 'imperfect', description: 'Inversion of minor third' },
  { name: 'Minor Seventh', shortName: 'm7', ratio: [9, 5], semitones: 10, consonance: 'dissonant', description: 'Creates pull toward resolution' },
  { name: 'Major Seventh', shortName: 'M7', ratio: [15, 8], semitones: 11, consonance: 'dissonant', description: 'Bright tension - wants to resolve to octave' },
  { name: 'Octave', shortName: 'P8', ratio: [2, 1], semitones: 12, consonance: 'perfect', description: 'Double the frequency - waves align every 2 cycles' },
];

export const CHORD_TYPES = [
  { name: 'Major Triad', intervals: ['P1', 'M3', 'P5'], description: 'Happy, bright, stable. Built on 4:5:6 ratio.' },
  { name: 'Minor Triad', intervals: ['P1', 'm3', 'P5'], description: 'Sad, dark, stable. Built on 10:12:15 ratio.' },
  { name: 'Diminished Triad', intervals: ['P1', 'm3', 'TT'], description: 'Tense, unstable. Two minor thirds stacked.' },
  { name: 'Augmented Triad', intervals: ['P1', 'M3', 'm6'], description: 'Mysterious, unresolved. Two major thirds stacked.' },
  { name: 'Dominant 7th', intervals: ['P1', 'M3', 'P5', 'm7'], description: 'Bluesy tension. Wants to resolve down a fifth.' },
  { name: 'Major 7th', intervals: ['P1', 'M3', 'P5', 'M7'], description: 'Lush, dreamy. Jazz standard chord.' },
  { name: 'Minor 7th', intervals: ['P1', 'm3', 'P5', 'm7'], description: 'Mellow, smooth. Common in jazz and R&B.' },
  { name: 'Diminished 7th', intervals: ['P1', 'm3', 'TT', 'M6'], description: 'Symmetrical - all minor thirds. Maximum tension.' },
  { name: 'Half-Diminished 7th', intervals: ['P1', 'm3', 'TT', 'm7'], description: 'Dark tension. Also called minor 7 flat 5.' },
  { name: 'Augmented 7th', intervals: ['P1', 'M3', 'm6', 'm7'], description: 'Exotic, altered. Used in jazz voice leading.' },
  { name: 'Sus2', intervals: ['P1', 'M2', 'P5'], description: 'Open, ambiguous. Neither major nor minor.' },
  { name: 'Sus4', intervals: ['P1', 'P4', 'P5'], description: 'Suspended tension. Wants to resolve to major or minor.' },
  { name: 'Power Chord (5th)', intervals: ['P1', 'P5'], description: 'Root + fifth only. Pure, strong. Used in rock music.' },
  { name: 'Add9', intervals: ['P1', 'M3', 'P5', 'M2'], description: 'Bright and open. Major triad with added 9th.' },
];

export function getIntervalByName(shortName) {
  return INTERVALS.find(i => i.shortName === shortName);
}

export function getRatioValue(ratio) {
  return ratio[0] / ratio[1];
}

export function getFrequencyForInterval(rootFreq, interval) {
  return rootFreq * getRatioValue(interval.ratio);
}

export function getChordFrequencies(rootFreq, chordType) {
  return chordType.intervals.map(shortName => {
    const interval = getIntervalByName(shortName);
    return {
      interval,
      frequency: getFrequencyForInterval(rootFreq, interval),
    };
  });
}

// Calculate how "consonant" a combination of frequencies is
// based on how often their wave peaks align
export function calculateConsonanceScore(frequencies) {
  if (frequencies.length < 2) return 1;
  const root = frequencies[0];
  let totalScore = 0;
  let pairs = 0;

  for (let i = 0; i < frequencies.length; i++) {
    for (let j = i + 1; j < frequencies.length; j++) {
      const ratio = frequencies[j] / frequencies[i];
      // Find closest simple ratio
      let bestScore = 0;
      for (let num = 1; num <= 16; num++) {
        for (let den = 1; den <= 16; den++) {
          const simpleRatio = num / den;
          const diff = Math.abs(ratio - simpleRatio);
          if (diff < 0.02) {
            const simplicity = 1 / (num + den);
            bestScore = Math.max(bestScore, simplicity);
          }
        }
      }
      totalScore += bestScore;
      pairs++;
    }
  }

  return pairs > 0 ? totalScore / pairs : 0;
}

// Get note name from frequency (A4 = 440Hz)
export function frequencyToNoteName(freq) {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const semitonesFromA4 = 12 * Math.log2(freq / 440);
  const noteIndex = Math.round(semitonesFromA4);
  const octave = Math.floor((noteIndex + 9) / 12) + 4;
  const nameIndex = ((noteIndex % 12) + 12 + 9) % 12;
  const centsOff = Math.round((semitonesFromA4 - noteIndex) * 100);
  const centsStr = centsOff === 0 ? '' : centsOff > 0 ? ` +${centsOff}c` : ` ${centsOff}c`;
  return `${noteNames[nameIndex]}${octave}${centsStr}`;
}
