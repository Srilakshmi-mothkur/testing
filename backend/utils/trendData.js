function analyzeTrends(progress) {
  const sorted = [...progress].sort((a, b) => new Date(a.date) - new Date(b.date));
  const stats = {
    social: [],
    creative: [],
    moral: [],
    notes: [],
    dates: []
  };

  for (let entry of sorted) {
    stats.social.push(entry.social.level);
    stats.creative.push(entry.creative.level);
    stats.moral.push(entry.moral.level);
    stats.notes.push(entry.note);
    stats.dates.push(new Date(entry.date).toLocaleDateString());
  }

  return stats;
}

module.exports = analyzeTrends