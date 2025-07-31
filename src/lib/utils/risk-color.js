function checkIfDarkMode() {
    if (typeof document !== "undefined") return document.documentElement.classList.contains('dark');
}

// Get risk color based on level
export function getRiskColor(level) {
    const opacityParam = checkIfDarkMode() ? "0.85" : "1";
    const colors = {
        0: 'var(--color-card)',
        1: `rgba(227, 189, 101, ${opacityParam})`,
        2: 'var(--color-primary)', // yellow
        3: `rgba(238, 147, 51, ${opacityParam})`, // orange
        4: `rgba(238, 104, 51, ${opacityParam})`, // orange-red
        5: `rgba(238, 51, 51, ${opacityParam})`  // dark red
    };
    return colors[level] || colors[0];
}