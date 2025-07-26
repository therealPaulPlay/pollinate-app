// Get risk color based on level
export function getRiskColor(level) {
    const colors = {
        0: 'var(--color-card',
        1: 'var(--color-secondary)',
        2: '#fbbf24', // yellow
        3: '#f97316', // orange
        4: '#ef4444', // red
        5: '#dc2626'  // dark red
    };
    return colors[level] || colors[0];
}