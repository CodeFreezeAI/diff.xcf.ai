// Performance chart functionality for MultiLineDiff Website
document.addEventListener('DOMContentLoaded', function() {
    initPerformanceChart();
    initPerformanceAnimations();
});

function initPerformanceChart() {
    const chartCanvas = document.getElementById('performance-chart');
    if (!chartCanvas) return;

    // Performance data
    const performanceData = {
        algorithms: ['Flash', 'Zoom', 'Optimus', 'Megatron'],
        createTimes: [14.5, 23.9, 43.7, 47.8],
        applyTimes: [6.6, 9.1, 6.6, 7.0],
        totalTimes: [21.0, 33.0, 50.3, 54.8],
        operations: [3, 3, 1256, 1256],
        colors: {
            flash: '#ff6b6b',     // Red
            zoom: '#4ecdc4',      // Teal
            optimus: '#45b7d1',   // Blue
            megatron: '#96ceb4'   // Green
        },
        emojis: ['⚡', '🔍', '🤖', '🧠']
    };

    // Chart configuration
    const config = {
        type: 'bar',
        data: {
            labels: performanceData.algorithms.map((alg, i) => `${performanceData.emojis[i]} ${alg}`),
            datasets: [
                {
                    label: 'Create Time (ms)',
                    data: performanceData.createTimes,
                    backgroundColor: [
                        performanceData.colors.flash + '80',
                        performanceData.colors.zoom + '80',
                        performanceData.colors.optimus + '80',
                        performanceData.colors.megatron + '80'
                    ],
                    borderColor: [
                        performanceData.colors.flash,
                        performanceData.colors.zoom,
                        performanceData.colors.optimus,
                        performanceData.colors.megatron
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                },
                {
                    label: 'Apply Time (ms)',
                    data: performanceData.applyTimes,
                    backgroundColor: [
                        performanceData.colors.flash + '40',
                        performanceData.colors.zoom + '40',
                        performanceData.colors.optimus + '40',
                        performanceData.colors.megatron + '40'
                    ],
                    borderColor: [
                        performanceData.colors.flash,
                        performanceData.colors.zoom,
                        performanceData.colors.optimus,
                        performanceData.colors.megatron
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            devicePixelRatio: window.devicePixelRatio || 1,
            resizeDelay: 0,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#f8fafc',
                        font: {
                            family: 'Inter, sans-serif',
                            size: window.innerWidth <= 480 ? 10 : window.innerWidth <= 768 ? 11 : 12,
                            weight: '600'
                        },
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: window.innerWidth <= 480 ? 8 : 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    titleColor: '#f8fafc',
                    bodyColor: '#cbd5e1',
                    borderColor: '#334155',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        title: function(context) {
                            const index = context[0].dataIndex;
                            return `${performanceData.emojis[index]} ${performanceData.algorithms[index]} Algorithm`;
                        },
                        afterBody: function(context) {
                            const index = context[0].dataIndex;
                            const total = performanceData.totalTimes[index];
                            const ops = performanceData.operations[index];
                            return [
                                `Total Time: ${total}ms`,
                                `Operations: ${ops}`,
                                `Efficiency: ${(1000/total).toFixed(1)} ops/sec`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: '#334155',
                        lineWidth: 1
                    },
                    ticks: {
                        color: '#cbd5e1',
                        font: {
                            family: 'Inter, sans-serif',
                            size: window.innerWidth <= 320 ? 8 : window.innerWidth <= 480 ? 9 : window.innerWidth <= 768 ? 10 : 11,
                            weight: '500'
                        },
                        maxRotation: window.innerWidth <= 480 ? 45 : 0,
                        minRotation: 0
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#334155',
                        lineWidth: 1
                    },
                    ticks: {
                        color: '#cbd5e1',
                        font: {
                            family: 'Inter, sans-serif',
                            size: window.innerWidth <= 320 ? 8 : window.innerWidth <= 480 ? 9 : window.innerWidth <= 768 ? 10 : 11
                        },
                        callback: function(value) {
                            return value + 'ms';
                        }
                    },
                    title: {
                        display: window.innerWidth > 480,
                        text: 'Time (milliseconds)',
                        color: '#f8fafc',
                        font: {
                            family: 'Inter, sans-serif',
                            size: window.innerWidth <= 768 ? 10 : 12,
                            weight: '600'
                        }
                    }
                }
            },
            animation: {
                duration: window.innerWidth <= 480 ? 1000 : 2000,
                easing: 'easeOutQuart',
                delay: (context) => {
                    return context.dataIndex * (window.innerWidth <= 480 ? 100 : 200);
                }
            },
            elements: {
                bar: {
                    borderRadius: window.innerWidth <= 480 ? 4 : 8
                }
            }
        }
    };

    // Create chart
    const chart = new Chart(chartCanvas, config);

    // Force chart to resize on window resize and update responsive properties
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Update responsive font sizes and properties
            const isMobile = window.innerWidth <= 480;
            const isTablet = window.innerWidth <= 768;
            const isTiny = window.innerWidth <= 320;
            
            // Update legend font size
            chart.options.plugins.legend.labels.font.size = isTiny ? 8 : isMobile ? 10 : isTablet ? 11 : 12;
            chart.options.plugins.legend.labels.padding = isMobile ? 8 : 15;
            
            // Update axis font sizes
            const fontSize = isTiny ? 8 : isMobile ? 9 : isTablet ? 10 : 11;
            chart.options.scales.x.ticks.font.size = fontSize;
            chart.options.scales.y.ticks.font.size = fontSize;
            chart.options.scales.x.ticks.maxRotation = isMobile ? 45 : 0;
            
            // Update y-axis title visibility
            chart.options.scales.y.title.display = !isMobile;
            chart.options.scales.y.title.font.size = isTablet ? 10 : 12;
            
            // Update animation duration
            chart.options.animation.duration = isMobile ? 1000 : 2000;
            
            // Update bar border radius
            chart.options.elements.bar.borderRadius = isMobile ? 4 : 8;
            
            // Resize and update the chart
            chart.resize();
            chart.update('none');
        }, 250);
    });

    // Add chart controls
    addChartControls(chart, performanceData);

    // Animate chart on scroll
    const chartContainer = chartCanvas.closest('.performance-chart');
    if (chartContainer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    chart.update('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(chartContainer);
    }
}

function addChartControls(chart, data) {
    const chartContainer = chart.canvas.closest('.performance-chart');
    if (!chartContainer) return;

    // Create controls container
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'performance-controls';

    // View toggle buttons
    const viewButtons = [
        { id: 'create', label: '🚀 Create Time', dataset: 0 },
        { id: 'apply', label: '⚡ Apply Time', dataset: 1 },
        { id: 'total', label: '🎯 Total Time', dataset: 'total' },
        { id: 'both', label: '📊 Both', dataset: 'both' }
    ];

    viewButtons.forEach(button => {
        const btn = document.createElement('button');
        btn.className = 'performance-btn';
        btn.textContent = button.label;

        if (button.id === 'both') {
            btn.classList.add('active');
        }

        btn.addEventListener('click', () => {
            // Update active button
            controlsDiv.querySelectorAll('.performance-btn').forEach(b => {
                b.classList.remove('active');
            });
            btn.classList.add('active');

            // Update chart data
            updateChartView(chart, data, button.dataset);
        });

        controlsDiv.appendChild(btn);
    });

    chartContainer.appendChild(controlsDiv);
}

function updateChartView(chart, data, view) {
    const datasets = chart.data.datasets;
    
    switch (view) {
        case 0: // Create time only
            datasets[0].hidden = false;
            datasets[1].hidden = true;
            break;
        case 1: // Apply time only
            datasets[0].hidden = true;
            datasets[1].hidden = false;
            break;
        case 'total': // Total time
            datasets[0].data = data.totalTimes;
            datasets[0].label = 'Total Time (ms)';
            datasets[0].hidden = false;
            datasets[1].hidden = true;
            break;
        case 'both': // Both create and apply
        default:
            datasets[0].data = data.createTimes;
            datasets[0].label = 'Create Time (ms)';
            datasets[0].hidden = false;
            datasets[1].hidden = false;
            break;
    }
    
    chart.update('active');
}

function initPerformanceAnimations() {
    // Animate performance table rows
    const tableRows = document.querySelectorAll('.performance-data tbody tr');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    tableRows.forEach(row => {
        row.classList.add('performance-table-row');
        observer.observe(row);
    });

    // Hover effects are now handled by CSS

    // Animate winner row
    const winnerRow = document.querySelector('.performance-data tr.winner');
    if (winnerRow) {
        const animateWinner = () => {
            winnerRow.classList.add('performance-winner-glow');
            setTimeout(() => {
                winnerRow.classList.remove('performance-winner-glow');
            }, 2000);
        };

        // Animate winner on scroll into view
        const winnerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(animateWinner, 1000);
                    winnerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        winnerObserver.observe(winnerRow);
    }
}

// Performance comparison utility
function compareAlgorithms(alg1, alg2) {
    const data = {
        flash: { create: 14.5, apply: 6.6, total: 21.0, ops: 3 },
        zoom: { create: 23.9, apply: 9.1, total: 33.0, ops: 3 },
        optimus: { create: 43.7, apply: 6.6, total: 50.3, ops: 1256 },
        megatron: { create: 47.8, apply: 7.0, total: 54.8, ops: 1256 }
    };

    const stats1 = data[alg1.toLowerCase()];
    const stats2 = data[alg2.toLowerCase()];

    if (!stats1 || !stats2) {
        return null;
    }

    return {
        createSpeedup: (stats2.create / stats1.create).toFixed(2),
        applySpeedup: (stats2.apply / stats1.apply).toFixed(2),
        totalSpeedup: (stats2.total / stats1.total).toFixed(2),
        efficiency1: (1000 / stats1.total).toFixed(1),
        efficiency2: (1000 / stats2.total).toFixed(1)
    };
}

// Real-time performance monitor (simulation)
function initPerformanceMonitor() {
    const monitor = document.createElement('div');
    monitor.className = 'performance-monitor';
    monitor.className = 'performance-monitor';
    monitor.style.display = 'none';

    monitor.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 10px;">⚡ Performance Monitor</div>
        <div id="fps-counter">FPS: --</div>
        <div id="memory-usage">Memory: --</div>
        <div id="load-time">Load: --ms</div>
    `;

    document.body.appendChild(monitor);

    // Toggle monitor with keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'P') {
            monitor.style.display = monitor.style.display === 'none' ? 'block' : 'none';
        }
    });

    // Update performance metrics
    let frameCount = 0;
    let lastTime = performance.now();

    function updateMetrics() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            document.getElementById('fps-counter').textContent = `FPS: ${fps}`;
            
            if (performance.memory) {
                const memory = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
                document.getElementById('memory-usage').textContent = `Memory: ${memory}MB`;
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(updateMetrics);
    }

    updateMetrics();

    // Track page load time
    window.addEventListener('load', () => {
        const loadTime = Math.round(performance.now());
        document.getElementById('load-time').textContent = `Load: ${loadTime}ms`;
    });
}

// Initialize performance monitor in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    initPerformanceMonitor();
}

// Export for use in other modules
window.PerformanceModule = {
    compareAlgorithms,
    updateChartView
}; 