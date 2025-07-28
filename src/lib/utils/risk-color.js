// Get risk color based on level
export function getRiskColor(level) {
    const colors = {
        0: 'var(--color-card',
        1: 'var(--color-secondary)',
        2: 'var(--color-primary)', // yellow
        3: 'rgb(238, 147, 51)', // orange
        4: 'rgb(238, 104, 51)', // orange-red
        5: 'rgb(238, 51, 51)'  // dark red
    };
    return colors[level] || colors[0];
}