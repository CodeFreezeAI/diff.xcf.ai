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
                borderColor: '#FF0000',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                borderWidth: 4,
                pointRadius: 6,
                pointHoverRadius: 8,
                tension: 0.4
            },
            {
                label: 'Myers Typical O(n√n)',
                data: [31623, 125000, 353553, 1000000, 3952847, 31622777],
                borderColor: '#0066FF',
                backgroundColor: 'rgba(0, 102, 255, 0.1)',
                borderWidth: 4,
                pointRadius: 6,
                pointHoverRadius: 8,
                tension: 0.4
            },
            {
                label: 'Optimus O(n log n)',
                data: [9966, 29897, 61439, 132877, 391927, 1660964],
                borderColor: '#00AA00',
                backgroundColor: 'rgba(0, 170, 0, 0.1)',
                borderWidth: 4,
                pointRadius: 6,
                pointHoverRadius: 8,
                tension: 0.4
            },
            {
                label: 'Myers Worst O(n²)',
                data: [1000000, 6250000, 25000000, 100000000, 625000000, 10000000000],
                borderColor: '#FF6600',
                backgroundColor: 'rgba(255, 102, 0, 0.1)',
                borderWidth: 4,
                pointRadius: 6,
                pointHoverRadius: 8,
                tension: 0.4
            }
        ]
    };

    const algoConfig = {
        type: 'line',
        data: algoData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Operations vs Input Size',
                    font: {
                        size: 20,
                        weight: 'bold'
                    },
                    color: '#333'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Input Size',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                y: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Operations (Log Scale)',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            const showValues = [1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000];
                            if (showValues.includes(value)) {
                                return value.toLocaleString();
                            }
                            return '';
                        },
                        padding: 20
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            hover: {
                animationDuration: 300
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    };

    const algoCtx = document.getElementById('algoPerformanceChart');
    if (algoCtx) {
        algoComparisonChart = new Chart(algoCtx.getContext('2d'), algoConfig);
        setupLegendClickHandlers();
    }
}

function setupLegendClickHandlers() {
    const legendItems = document.querySelectorAll('.algo-comparison-legend-item');
    
    legendItems.forEach((item, index) => {
        item.classList.add('algo-legend-clickable');
        item.addEventListener('click', function() {
            toggleDatasetVisibility(index);
        });
    });
}

function toggleDatasetVisibility(datasetIndex) {
    if (!algoComparisonChart) return;
    
    const dataset = algoComparisonChart.data.datasets[datasetIndex];
    const meta = algoComparisonChart.getDatasetMeta(datasetIndex);
    
    // Toggle visibility
    meta.hidden = !meta.hidden;
    
    // Update legend item appearance
    const legendItem = document.querySelectorAll('.algo-comparison-legend-item')[datasetIndex];
    if (meta.hidden) {
        legendItem.classList.add('algo-legend-hidden');
        legendItem.classList.remove('algo-legend-visible');
    } else {
        legendItem.classList.add('algo-legend-visible');
        legendItem.classList.remove('algo-legend-hidden');
    }
    
    algoComparisonChart.update();
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