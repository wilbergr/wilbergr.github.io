import { INTERVALS, getRatioValue, getFrequencyForInterval, frequencyToNoteName } from '../services/musicTheory';
import { playToneForDuration, playChordForDuration, stopAllTones } from '../services/audioEngine';
import { COLORS } from './WaveVisualizer';

const CONSONANCE_BADGES = {
  perfect: { label: 'Perfect', color: '#66bb6a' },
  imperfect: { label: 'Imperfect', color: '#ffa726' },
  dissonant: { label: 'Dissonant', color: '#ef5350' },
};

export default function IntervalTable({ rootFrequency, selectedIntervals, onToggleInterval }) {
  function handlePlayInterval(interval) {
    const freq = getFrequencyForInterval(rootFrequency, interval);
    playChordForDuration([rootFrequency, freq], 2000);
  }

  function handlePlaySingle(interval) {
    const freq = getFrequencyForInterval(rootFrequency, interval);
    playToneForDuration(freq, 1500);
  }

  return (
    <div className="interval-table-container">
      <table className="interval-table">
        <thead>
          <tr>
            <th></th>
            <th>Interval</th>
            <th>Ratio</th>
            <th>Decimal</th>
            <th>Frequency</th>
            <th>Note</th>
            <th>Consonance</th>
            <th>Play</th>
          </tr>
        </thead>
        <tbody>
          {INTERVALS.map((interval, i) => {
            const freq = getFrequencyForInterval(rootFrequency, interval);
            const isSelected = selectedIntervals.includes(interval.shortName);
            const badge = CONSONANCE_BADGES[interval.consonance];
            const colorIndex = selectedIntervals.indexOf(interval.shortName);
            const dotColor = colorIndex >= 0 ? COLORS[colorIndex % COLORS.length] : 'transparent';

            return (
              <tr
                key={interval.shortName}
                className={isSelected ? 'selected' : ''}
                title={interval.description}
              >
                <td>
                  <label className="checkbox-cell">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleInterval(interval.shortName)}
                    />
                    {isSelected && (
                      <span className="color-dot" style={{ backgroundColor: dotColor }} />
                    )}
                  </label>
                </td>
                <td className="interval-name">
                  <strong>{interval.shortName}</strong>
                  <span className="full-name">{interval.name}</span>
                </td>
                <td className="ratio-cell">{interval.ratio[0]}:{interval.ratio[1]}</td>
                <td className="decimal-cell">{getRatioValue(interval.ratio).toFixed(4)}</td>
                <td className="freq-cell">{freq.toFixed(1)} Hz</td>
                <td className="note-cell">{frequencyToNoteName(freq)}</td>
                <td>
                  <span className="consonance-badge" style={{ backgroundColor: badge.color }}>
                    {badge.label}
                  </span>
                </td>
                <td className="play-cell">
                  <button
                    className="play-btn small"
                    onClick={() => handlePlaySingle(interval)}
                    title="Play this note alone"
                  >
                    &#9654; Note
                  </button>
                  <button
                    className="play-btn small outline"
                    onClick={() => handlePlayInterval(interval)}
                    title="Play this interval with the root note"
                  >
                    &#9654; Pair
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
