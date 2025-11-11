// Configuration des graphiques
const chartColors = {
    primary: '#3498db',
    secondary: '#2c3e50',
    accent: '#e74c3c',
    success: '#2ecc71',
    warning: '#f1c40f'
};

// Graphique de l'évolution de l'IA
function createAIEvolutionChart(ctx) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
            datasets: [{
                label: 'Investissements Mondiaux (Milliards $)',
                data: [12, 26, 39, 58, 67, 85, 93, 120, 150],
                borderColor: chartColors.primary,
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Évolution des Investissements en IA',
                    font: {
                        size: 16,
                        family: 'Montserrat'
                    }
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Graphique des domaines d'application
function createAIApplicationsChart(ctx) {
    return new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [
                'Santé',
                'Finance',
                'Transport',
                'Éducation',
                'Industrie',
                'Commerce',
                'Recherche'
            ],
            datasets: [{
                label: 'Impact Actuel',
                data: [85, 90, 75, 65, 80, 85, 70],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: chartColors.primary,
                pointBackgroundColor: chartColors.primary
            }, {
                label: 'Potentiel Futur',
                data: [95, 95, 90, 85, 90, 90, 85],
                backgroundColor: 'rgba(46, 204, 113, 0.2)',
                borderColor: chartColors.success,
                pointBackgroundColor: chartColors.success
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Impact de l\'IA par Secteur',
                    font: {
                        size: 16,
                        family: 'Montserrat'
                    }
                }
            }
        }
    });
}

// Graphique des défis de l'IA
function createAIChallengesChart(ctx) {
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Éthique', 'Sécurité', 'Formation', 'Infrastructure', 'Réglementation'],
            datasets: [{
                label: 'Niveau de Priorité',
                data: [90, 85, 75, 80, 85],
                backgroundColor: [
                    chartColors.primary,
                    chartColors.secondary,
                    chartColors.accent,
                    chartColors.success,
                    chartColors.warning
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Principaux Défis de l\'IA',
                    font: {
                        size: 16,
                        family: 'Montserrat'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Animation des graphiques au défilement
function initChartAnimations() {
    const chartElements = document.querySelectorAll('.chart-container');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const canvas = entry.target.querySelector('canvas');
                const chartType = canvas.getAttribute('data-chart');
                
                switch(chartType) {
                    case 'evolution':
                        createAIEvolutionChart(canvas);
                        break;
                    case 'applications':
                        createAIApplicationsChart(canvas);
                        break;
                    case 'challenges':
                        createAIChallengesChart(canvas);
                        break;
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    chartElements.forEach(el => observer.observe(el));
}

// Initialisation des graphiques au chargement
document.addEventListener('DOMContentLoaded', initChartAnimations);

// Charts and Data Visualization System

class ChartSystem {
    constructor() {
        this.charts = new Map();
        this.options = {
            colors: ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6'],
            fontFamily: "'Montserrat', sans-serif",
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        };
        
        this.init();
    }
    
    init() {
        // Initialize charts when elements are visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const chartId = entry.target.id;
                    const chartType = entry.target.dataset.chartType;
                    const chartData = this.getChartData(chartId);
                    
                    if (chartData) {
                        this.createChart(entry.target, chartType, chartData);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        // Observe all chart containers
        document.querySelectorAll('[data-chart-type]').forEach(container => {
            observer.observe(container);
        });
    }
    
    getChartData(chartId) {
        // Define chart data based on chart ID
        const chartData = {
            'ai-adoption-chart': {
                type: 'line',
                data: {
                    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
                    datasets: [{
                        label: "Adoption de l'IA",
                        data: [45, 55, 65, 75, 85, 90],
                        borderColor: this.options.colors[0],
                        backgroundColor: this.adjustOpacity(this.options.colors[0], 0.2),
                        tension: 0.4
                    }]
                }
            },
            'ai-impact-chart': {
                type: 'radar',
                data: {
                    labels: ['Santé', 'Finance', 'Transport', 'Éducation', 'Industrie', 'Commerce'],
                    datasets: [{
                        label: "Impact de l'IA",
                        data: [85, 90, 75, 80, 95, 85],
                        borderColor: this.options.colors[1],
                        backgroundColor: this.adjustOpacity(this.options.colors[1], 0.2)
                    }]
                }
            },
            'ai-types-chart': {
                type: 'doughnut',
                data: {
                    labels: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Robotique'],
                    datasets: [{
                        data: [30, 25, 20, 15, 10],
                        backgroundColor: this.options.colors
                    }]
                }
            }
        };
        
        return chartData[chartId];
    }
    
    createChart(container, type, data) {
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const chartOptions = this.getChartOptions(type);
        
        const chart = new Chart(ctx, {
            type: data.type || type,
            data: data.data,
            options: chartOptions
        });
        
        this.charts.set(container.id, chart);
        
        // Add resize handler
        window.addEventListener('resize', () => {
            chart.resize();
        });
    }
    
    getChartOptions(type) {
        const baseOptions = {
            responsive: this.options.responsive,
            maintainAspectRatio: this.options.maintainAspectRatio,
            animation: this.options.animation,
            plugins: {
                legend: {
                    labels: {
                        font: {
                            family: this.options.fontFamily
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        family: this.options.fontFamily,
                        size: 14
                    },
                    bodyFont: {
                        family: this.options.fontFamily,
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 4
                }
            }
        };
        
        // Type-specific options
        const typeOptions = {
            line: {
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            font: {
                                family: this.options.fontFamily
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: this.options.fontFamily
                            }
                        }
                    }
                }
            },
            radar: {
                scales: {
                    r: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                family: this.options.fontFamily
                            }
                        }
                    }
                }
            },
            doughnut: {
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        };
        
        return { ...baseOptions, ...(typeOptions[type] || {}) };
    }
    
    adjustOpacity(color, opacity) {
        if (color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return color;
    }
    
    updateChart(chartId, newData) {
        const chart = this.charts.get(chartId);
        if (chart) {
            chart.data = newData;
            chart.update();
        }
    }
    
    destroyChart(chartId) {
        const chart = this.charts.get(chartId);
        if (chart) {
            chart.destroy();
            this.charts.delete(chartId);
        }
    }
}

// Initialize chart system
document.addEventListener('DOMContentLoaded', () => {
    // Load Chart.js from CDN if not already loaded
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => {
            new ChartSystem();
        };
        document.head.appendChild(script);
    } else {
        new ChartSystem();
    }
});

// Export ChartSystem class for use in other files
export { ChartSystem }; 