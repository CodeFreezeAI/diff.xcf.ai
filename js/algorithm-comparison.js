// Algorithm Comparison Chart - Completely separate from existing code
let algoComparisonChart;
let algoIsLogScale = true;

// Initialize the algorithm comparison chart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAlgoComparisonChart();
});

function initializeAlgoComparisonChart() {
    const algoData = {
        labels: ['1,000', '2,500', '5,000', '10,000', '25,000', '100,000'],
        datasets: [
            {
                label: 'Flash O(n)',
                data: [1000, 2500, 5000, 10000, 25000, 100000],
                borderColor: 'rgba(255, 215, 0, 0.85)',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 0,
                tension: 0.4,
                hoverBorderWidth: 2,
                emoji: '⚡'
            },
            {
                label: 'Optimus O(n log n)',
                data: [9966, 29897, 61439, 132877, 391927, 1660964],
                borderColor: '#007AFF',
                backgroundColor: 'rgba(0, 122, 255, 0.1)',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 0,
                tension: 0.4,
                hoverBorderWidth: 2,
                emoji: '🤖'
            },
            {
                label: 'Myers Typical O(n√n)',
                data: [31623, 158114, 353553, 1000000, 4999999, 31622776],
                borderColor: '#FF0000',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 0,
                tension: 0.4,
                hoverBorderWidth: 2,
                emoji: '🐌'
            },
            {
                label: 'Myers Worst O(n²)',
                data: [1000000, 6250000, 25000000, 100000000, 625000000, 10000000000],
                borderColor: '#FF8C00',
                backgroundColor: 'rgba(255, 140, 0, 0.1)',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 0,
                tension: 0.4,
                hoverBorderWidth: 2,
                emoji: '🦕'
            }
        ]
    };

    const algoCtx = document.getElementById('algoPerformanceChart');
    if (!algoCtx) return;

    // Track hovered elements
    let hoveredElements = [];

    // Custom plugin to draw emojis on data points
    const emojiPlugin = {
        id: 'emojiOverlay',
        afterDatasetsDraw(chart) {
            const { ctx, chartArea } = chart;
            
            chart.data.datasets.forEach((dataset, datasetIndex) => {
                const meta = chart.getDatasetMeta(datasetIndex);
                if (!meta.hidden && dataset.emoji) {
                    meta.data.forEach((point, pointIndex) => {
                        const { x, y } = point;
                        
                        // Check if this point is being hovered
                        const isHovered = hoveredElements.some(el => 
                            el.datasetIndex === datasetIndex && el.index === pointIndex
                        );
                        
                        // Set emoji size instantly - no animation
                        const fontSize = isHovered ? 28 : 18;
                        ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        
                        // Draw emoji on top of the data point
                        ctx.fillText(dataset.emoji, x, y);
                    });
                }
            });
        }
    };

    algoComparisonChart = new Chart(algoCtx, {
        type: 'line',
        data: algoData,
        plugins: [emojiPlugin],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            onHover: (event, activeElements, chart) => {
                // Update hovered elements
                hoveredElements = [...activeElements];
                
                // Always update chart to reflect current hover state
                chart.update('none');
            },
            scales: {
                y: {
                    type: algoIsLogScale ? 'logarithmic' : 'linear',
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        lineWidth: 1
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        callback: function(value) {
                            // Only show specific clean tick values
                            const allowedValues = [
                                1000,        // 1,000
                                10000,       // 10,000
                                100000,      // 100,000
                                1000000,     // 1,000,000
                                10000000,    // 10,000,000
                                100000000,   // 100,000,000
                                1000000000,  // 1,000,000,000
                                10000000000  // 10,000,000,000
                            ];
                            
                            if (!allowedValues.includes(value)) {
                                return null; // Hide all other ticks
                            }
                            
                            if (algoIsLogScale) {
                                return value.toLocaleString();
                            } else {
                                return value >= 1000000 ? (value / 1000000).toFixed(1) + 'M' : 
                                       value >= 1000 ? (value / 1000).toFixed(0) + 'K' : value;
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Operations',
                        color: '#ffffff',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        lineWidth: 1
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Input Size',
                        color: '#ffffff',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Operations vs Input Size',
                    font: {
                        size: 20,
                        weight: 'bold'
                    },
                    color: '#ffffff'
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        labelPointStyle: function(context) {
                            const emojis = ['⚡', '🤖', '🐌', '🦕'];
                            return {
                                pointStyle: 'circle',
                                rotation: 0
                            };
                        },
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            const emojis = ['⚡', '🤖', '🐌', '🦕'];
                            const emoji = emojis[context.datasetIndex] || '⚪';
                            return `${emoji} ${context.dataset.label}: ${context.parsed.y.toLocaleString()} operations`;
                        }
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#ffffff',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            elements: {
                point: {
                    backgroundColor: 'transparent',
                    borderColor: 'none',
                    borderWidth: 0,
                    hoverBackgroundColor: 'transparent',
                    hoverBorderColor: 'transparent',
                    hoverBorderWidth: 0
                }
            }
        }
    });

    // Add click handlers for interactive legend
    addAlgoLegendClickHandlers();
    
    // Add mouse leave handler to clear hover states
    algoCtx.addEventListener('mouseleave', function() {
        if (algoComparisonChart && hoveredElements.length > 0) {
            hoveredElements = [];
            algoComparisonChart.update('none');
        }
    });
}

function addAlgoLegendClickHandlers() {
    const legendItems = document.querySelectorAll('.d1f-alg-comparison-legend-item');
    
    legendItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            if (algoComparisonChart) {
                const meta = algoComparisonChart.getDatasetMeta(index);
                meta.hidden = meta.hidden === null ? !algoComparisonChart.data.datasets[index].hidden : !meta.hidden;
                
                // Toggle visual state
                if (meta.hidden) {
                    item.classList.add('d1f-alg-legend-hidden');
                    item.classList.remove('d1f-alg-legend-visible');
                } else {
                    item.classList.add('d1f-alg-legend-visible');
                    item.classList.remove('d1f-alg-legend-hidden');
                }
                
                algoComparisonChart.update();
            }
        });
        
        // Add clickable class for visual feedback
        item.classList.add('d1f-alg-legend-clickable');
        item.classList.add('d1f-alg-legend-visible');
    });
}

function toggleAlgoScale() {
    if (!algoComparisonChart) return;
    
    algoIsLogScale = !algoIsLogScale;
    
    if (algoIsLogScale) {
        algoComparisonChart.options.scales.y.type = 'logarithmic';
        algoComparisonChart.options.scales.y.title.text = 'Operations (Log Scale)';
    } else {
        algoComparisonChart.options.scales.y.type = 'linear';
        algoComparisonChart.options.scales.y.title.text = 'Operations (Linear Scale)';
        algoComparisonChart.options.scales.y.beginAtZero = true;
    }
    
    algoComparisonChart.update('active');
} 