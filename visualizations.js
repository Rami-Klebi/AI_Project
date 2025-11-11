// Interactive Data Visualizations
class AIVisualization {
    constructor(container) {
        this.container = container;
        this.svg = null;
        this.width = container.clientWidth;
        this.height = 400;
        this.margin = { top: 20, right: 20, bottom: 30, left: 40 };
        this.animationDuration = 1000;
        this.isAnimating = false;
        this.initSVG();
        this.addControls();
        this.addAccessibilityFeatures();
        this.addExportFunctionality();
        this.addDataFiltering();
        this.addAnimationControls();
    }

    initSVG() {
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('role', 'img')
            .attr('aria-label', 'Data visualization')
            .attr('aria-describedby', 'visualization-description');

        this.svg.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        this.svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(${this.margin.left}, ${this.height - this.margin.bottom})`);

        this.svg.append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        this.svg.append('g')
            .attr('class', 'data-points')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        this.svg.append('g')
            .attr('class', 'trend-line')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        this.svg.append('g')
            .attr('class', 'value-labels')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        // Add description for screen readers
        this.container.setAttribute('aria-label', 'Interactive data visualization');
        this.container.setAttribute('role', 'region');
    }

    addAccessibilityFeatures() {
        // Add ARIA roles and labels
        this.svg.attr('role', 'img')
            .attr('aria-label', 'Interactive data visualization')
            .attr('aria-describedby', 'visualization-description');

        // Add keyboard navigation
        this.svg.on('keydown', (event) => {
            switch(event.key) {
                case '+':
                    this.zoom(1.2);
                    break;
                case '-':
                    this.zoom(0.8);
                    break;
                case 'r':
                    this.resetZoom();
                    break;
                case ' ':
                    this.toggleAnimation();
                    break;
            }
        });

        // Add focus states
        this.svg.selectAll('.control-button, .filter-button')
            .attr('tabindex', '0')
            .on('focus', function() {
                d3.select(this).classed('focused', true);
            })
            .on('blur', function() {
                d3.select(this).classed('focused', false);
            });
    }

    addControls() {
        const controls = d3.select(this.container)
            .append('div')
            .attr('class', 'visualization-controls');

        // Zoom controls
        controls.append('button')
            .attr('class', 'control-button zoom-in')
            .attr('aria-label', 'Zoom in')
            .text('+')
            .on('click', () => this.zoom(1.2));

        controls.append('button')
            .attr('class', 'control-button zoom-out')
            .attr('aria-label', 'Zoom out')
            .text('-')
            .on('click', () => this.zoom(0.8));

        controls.append('button')
            .attr('class', 'control-button reset')
            .attr('aria-label', 'Reset zoom')
            .text('Reset')
            .on('click', () => this.resetZoom());

        // Animation controls
        controls.append('button')
            .attr('class', 'control-button play')
            .attr('aria-label', 'Play animation')
            .text('▶')
            .on('click', () => this.toggleAnimation());

        // Export button
        controls.append('button')
            .attr('class', 'control-button export')
            .attr('aria-label', 'Export visualization')
            .text('Export')
            .on('click', () => this.exportVisualization());
    }

    addExportFunctionality() {
        this.exportVisualization = () => {
            const svgData = this.svg.node().outerHTML;
            const blob = new Blob([svgData], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = 'visualization.svg';
            link.click();
            
            URL.revokeObjectURL(url);
        };
    }

    addDataFiltering() {
        const filters = d3.select(this.container)
            .append('div')
            .attr('class', 'filter-controls');

        const filterOptions = ['All', 'Recent', 'Historical', 'Projected'];
        
        filterOptions.forEach(option => {
            filters.append('button')
                .attr('class', 'filter-button')
                .attr('aria-label', `Filter by ${option}`)
                .text(option)
                .on('click', () => this.filterData(option));
        });
    }

    addAnimationControls() {
        const animationControls = d3.select(this.container)
            .append('div')
            .attr('class', 'animation-controls');

        animationControls.append('button')
            .attr('class', 'animation-button play')
            .attr('aria-label', 'Play animation')
            .text('▶')
            .on('click', () => this.toggleAnimation());

        animationControls.append('button')
            .attr('class', 'animation-button pause')
            .attr('aria-label', 'Pause animation')
            .text('⏸')
            .on('click', () => this.toggleAnimation());

        animationControls.append('input')
            .attr('type', 'range')
            .attr('class', 'animation-speed')
            .attr('min', '0.5')
            .attr('max', '2')
            .attr('step', '0.1')
            .attr('value', '1')
            .attr('aria-label', 'Animation speed')
            .on('input', (e) => this.setAnimationSpeed(e.target.value));
    }

    updateAnimationFrame(frame) {
        if (!this.isAnimating) return;

        // Update visualization based on current frame
        this.updateData(frame);
        
        // Schedule next frame
        requestAnimationFrame(() => this.updateAnimationFrame(frame + 1));
    }

    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        if (this.isAnimating) {
            this.updateAnimationFrame(0);
        }
    }

    setAnimationSpeed(speed) {
        this.animationDuration = 1000 / speed;
    }

    zoom(scale) {
        const zoom = d3.zoom()
            .scaleExtent([0.5, 5])
            .on('zoom', (event) => {
                this.svg.selectAll('.data-points, .trend-line, .grid, .x-axis, .y-axis')
                    .attr('transform', event.transform);
            });

        this.svg.call(zoom.transform, d3.zoomIdentity.scale(scale));
    }

    resetZoom() {
        this.svg.call(d3.zoom().transform, d3.zoomIdentity);
    }

    filterData(filter) {
        // Update visualization based on selected filter
        this.updateData(this.data, filter);
    }

    createTimelineChart(data) {
        this.dataType = 'timeline';
        const width = this.width - this.margin.left - this.margin.right;
        const height = this.height - this.margin.top - this.margin.bottom;

        // Scales
        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.year))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([height, 0]);

        // Line generator
        const line = d3.line()
            .x(d => x(d.year))
            .y(d => y(d.value))
            .curve(d3.curveMonotoneX);

        // Add axes
        this.svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-45)');

        this.svg.append('g')
            .call(d3.axisLeft(y));

        // Add grid lines
        this.svg.append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft(y)
                .tickSize(-width)
                .tickFormat('')
            )
            .style('stroke-dasharray', '3,3')
            .style('stroke-opacity', 0.2);

        // Add line
        const path = this.svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'var(--accent-color)')
            .attr('stroke-width', 3)
            .attr('d', line);

        // Animation
        const pathLength = path.node().getTotalLength();
        path.attr('stroke-dasharray', pathLength)
            .attr('stroke-dashoffset', pathLength)
            .transition()
            .duration(2000)
            .attr('stroke-dashoffset', 0);

        // Add dots with hover effects
        const dots = this.svg.selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', d => x(d.year))
            .attr('cy', d => y(d.value))
            .attr('r', 0)
            .style('fill', 'var(--accent-color)')
            .attr('role', 'button')
            .attr('tabindex', '0')
            .attr('aria-label', d => `Year ${d.year.getFullYear()}, Value ${d.value} billion euros`)
            .transition()
            .delay((d, i) => i * 200)
            .duration(500)
            .attr('r', 6);

        // Add enhanced tooltips
        const tooltip = d3.select(this.container)
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)
            .attr('role', 'tooltip');

        dots.on('mouseover', (event, d) => {
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(`
                <strong>Année:</strong> ${d.year.getFullYear()}<br/>
                <strong>Valeur:</strong> ${d.value} milliards €<br/>
                <strong>Croissance:</strong> ${this.calculateGrowth(data, d)}%<br/>
                <strong>Tendance:</strong> ${this.calculateTrend(data, d)}
            `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        });

        // Add trend line with animation
        const trendLine = this.calculateTrendLine(data);
        this.svg.append('path')
            .datum(trendLine)
            .attr('class', 'trend-line')
            .attr('fill', 'none')
            .attr('stroke', 'var(--primary-color)')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5')
            .attr('d', line)
            .attr('stroke-dasharray', '1000')
            .attr('stroke-dashoffset', '1000')
            .transition()
            .duration(2000)
            .attr('stroke-dashoffset', '0');

        // Add legend
        this.addLegend([
            { color: 'var(--accent-color)', text: 'Investissements en IA' }
        ]);
    }

    calculateTrendLine(data) {
        const n = data.length;
        const sumX = data.reduce((sum, d) => sum + d.year.getTime(), 0);
        const sumY = data.reduce((sum, d) => sum + d.value, 0);
        const sumXY = data.reduce((sum, d) => sum + d.year.getTime() * d.value, 0);
        const sumXX = data.reduce((sum, d) => sum + d.year.getTime() * d.year.getTime(), 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        return data.map(d => ({
            year: d.year,
            value: (slope * d.year.getTime() + intercept) / 1000000000
        }));
    }

    createRadarChart(data) {
        this.dataType = 'radar';
        const width = this.width - this.margin.left - this.margin.right;
        const height = this.height - this.margin.top - this.margin.bottom;
        const radius = Math.min(width, height) / 2;

        // Radar chart setup
        const angleSlice = Math.PI * 2 / data.axes.length;

        // Scales
        const rScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, radius]);

        // Draw the circular grid
        const levels = 5;
        this.svg.selectAll('.gridCircle')
            .data(d3.range(1, levels + 1))
            .enter()
            .append('circle')
            .attr('class', 'gridCircle')
            .attr('r', d => radius / levels * d)
            .style('fill', 'none')
            .style('stroke', '#ddd')
            .style('stroke-dasharray', '4,4');

        // Draw the axes
        const axes = this.svg.selectAll('.axis')
            .data(data.axes)
            .enter()
            .append('g')
            .attr('class', 'axis');

        axes.append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', (d, i) => rScale(100) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr('y2', (d, i) => rScale(100) * Math.sin(angleSlice * i - Math.PI / 2))
            .style('stroke', '#ddd')
            .style('stroke-width', '1px');

        // Add axis labels with improved readability
        axes.append('text')
            .attr('class', 'axis-label')
            .attr('x', (d, i) => rScale(110) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr('y', (d, i) => rScale(110) * Math.sin(angleSlice * i - Math.PI / 2))
            .text(d => d)
            .style('text-anchor', 'middle')
            .style('font-size', '0.8rem')
            .style('font-weight', 'bold')
            .style('fill', 'var(--text-dark)');

        // Draw the radar chart paths with animations
        data.series.forEach((serie, i) => {
            const path = this.svg.append('path')
                .datum(serie.values)
                .attr('class', 'radarPath')
                .style('fill', serie.color)
                .style('fill-opacity', 0.1)
                .style('stroke', serie.color)
                .style('stroke-width', '2px')
                .attr('d', d3.lineRadial()
                    .radius(d => rScale(d.value))
                    .angle((d, i) => i * angleSlice)
                    .curve(d3.curveCardinalClosed)
                );

            const pathLength = path.node().getTotalLength();
            path.attr('stroke-dasharray', pathLength)
                .attr('stroke-dashoffset', pathLength)
                .transition()
                .duration(2000)
                .attr('stroke-dashoffset', 0);
        });

        // Add interactive points
        data.series.forEach((serie, i) => {
            const points = this.svg.selectAll(`.point-${i}`)
                .data(serie.values)
                .enter()
                .append('circle')
                .attr('class', `point-${i}`)
                .attr('r', 4)
                .style('fill', serie.color)
                .attr('cx', (d, j) => rScale(d.value) * Math.cos(angleSlice * j - Math.PI / 2))
                .attr('cy', (d, j) => rScale(d.value) * Math.sin(angleSlice * j - Math.PI / 2))
                .attr('role', 'button')
                .attr('tabindex', '0')
                .attr('aria-label', (d, j) => `${data.axes[j]}: ${d.value}%`)
                .on('mouseover', (event, d, j) => {
                    const tooltip = d3.select(this.container)
                        .append('div')
                        .attr('class', 'tooltip')
                        .style('opacity', 0)
                        .attr('role', 'tooltip');

                    tooltip.transition()
                        .duration(200)
                        .style('opacity', .9);

                    tooltip.html(`
                        <strong>${data.axes[j]}</strong><br/>
                        <strong>${serie.name}:</strong> ${d.value}%<br/>
                        <strong>Comparaison:</strong> ${this.calculateComparison(data, d, j)}%
                    `)
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 28) + 'px');
                });
        });

        // Add legend
        this.addLegend(data.series.map(s => ({
            color: s.color,
            text: s.name
        })));
    }

    createBarChart(data) {
        this.dataType = 'bar';
        const width = this.width - this.margin.left - this.margin.right;
        const height = this.height - this.margin.top - this.margin.bottom;

        // Scales
        const x = d3.scaleBand()
            .domain(data.map(d => d.category))
            .range([0, width])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([height, 0]);

        // Add axes
        this.svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-45)');

        this.svg.append('g')
            .call(d3.axisLeft(y));

        // Add grid lines
        this.svg.append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft(y)
                .tickSize(-width)
                .tickFormat('')
            )
            .style('stroke-dasharray', '3,3')
            .style('stroke-opacity', 0.2);

        // Add bars with animations
        const bars = this.svg.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.category))
            .attr('width', x.bandwidth())
            .attr('y', height)
            .attr('height', 0)
            .style('fill', 'var(--accent-color)')
            .attr('role', 'button')
            .attr('tabindex', '0')
            .attr('aria-label', d => `${d.category}: ${d.value}/100`)
            .transition()
            .duration(1000)
            .attr('y', d => y(d.value))
            .attr('height', d => height - y(d.value));

        // Add enhanced value labels
        this.svg.selectAll('.value-label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'value-label')
            .attr('x', d => x(d.category) + x.bandwidth() / 2)
            .attr('y', d => y(d.value) - 5)
            .attr('text-anchor', 'middle')
            .style('font-size', '0.8rem')
            .style('font-weight', 'bold')
            .text(d => d.value)
            .attr('aria-hidden', 'true');

        // Add enhanced tooltips
        const tooltip = d3.select(this.container)
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)
            .attr('role', 'tooltip');

        bars.on('mouseover', (event, d) => {
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(`
                <strong>${d.category}</strong><br/>
                <strong>Score:</strong> ${d.value}/100<br/>
                <strong>Priorité:</strong> ${this.getPriority(d.value)}<br/>
                <strong>Impact:</strong> ${this.calculateImpact(d.value)}%
            `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        });

        // Add legend
        this.addLegend([
            { color: 'var(--accent-color)', text: 'Niveau de Défi' }
        ]);
    }

    getPriority(value) {
        if (value >= 90) return 'Très Élevée';
        if (value >= 80) return 'Élevée';
        if (value >= 70) return 'Moyenne';
        return 'Faible';
    }

    calculateGrowth(data, point) {
        const index = data.findIndex(d => d.year.getTime() === point.year.getTime());
        if (index === 0) return 'N/A';
        const prevValue = data[index - 1].value;
        return ((point.value - prevValue) / prevValue * 100).toFixed(1);
    }

    calculateTrend(data, point) {
        const index = data.findIndex(d => d.year.getTime() === point.year.getTime());
        if (index < 2) return 'N/A';
        const prevValue = data[index - 1].value;
        const prevPrevValue = data[index - 2].value;
        const currentTrend = point.value - prevValue;
        const prevTrend = prevValue - prevPrevValue;
        return currentTrend > prevTrend ? 'Accélération' : 'Décélération';
    }

    calculateComparison(data, point, index) {
        const otherSeries = data.series.filter(s => s !== data.series[index]);
        const avgValue = otherSeries.reduce((sum, s) => sum + s.values[index].value, 0) / otherSeries.length;
        return ((point.value - avgValue) / avgValue * 100).toFixed(1);
    }

    calculateImpact(value) {
        return (value * 0.8).toFixed(1);
    }

    addLegend(items) {
        const legend = d3.select(this.container)
            .append('div')
            .attr('class', 'legend')
            .attr('role', 'list');

        items.forEach(item => {
            const legendItem = legend.append('div')
                .attr('class', 'legend-item')
                .attr('role', 'listitem');

            legendItem.append('div')
                .attr('class', 'legend-color')
                .style('background-color', item.color)
                .attr('aria-hidden', 'true');

            legendItem.append('div')
                .attr('class', 'legend-text')
                .text(item.text);
        });
    }
}

// Initialize visualizations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Sample data
    const timelineData = [
        { year: new Date('2015'), value: 12 },
        { year: new Date('2016'), value: 26 },
        { year: new Date('2017'), value: 39 },
        { year: new Date('2018'), value: 58 },
        { year: new Date('2019'), value: 67 },
        { year: new Date('2020'), value: 85 },
        { year: new Date('2021'), value: 93 },
        { year: new Date('2022'), value: 120 },
        { year: new Date('2023'), value: 150 }
    ];

    const radarData = {
        axes: ['Santé', 'Finance', 'Transport', 'Éducation', 'Industrie', 'Commerce', 'Recherche'],
        series: [
            {
                name: 'Impact Actuel',
                color: 'var(--accent-color)',
                values: [
                    { value: 85 },
                    { value: 90 },
                    { value: 75 },
                    { value: 65 },
                    { value: 80 },
                    { value: 85 },
                    { value: 70 }
                ]
            },
            {
                name: 'Potentiel Futur',
                color: 'var(--success-color)',
                values: [
                    { value: 95 },
                    { value: 95 },
                    { value: 90 },
                    { value: 85 },
                    { value: 90 },
                    { value: 90 },
                    { value: 85 }
                ]
            }
        ]
    };

    const barData = [
        { category: 'Éthique', value: 90 },
        { category: 'Sécurité', value: 85 },
        { category: 'Formation', value: 75 },
        { category: 'Infrastructure', value: 80 },
        { category: 'Réglementation', value: 85 }
    ];

    // Initialize visualizations
    document.querySelectorAll('[data-visualization]').forEach(container => {
        const viz = new AIVisualization(container);
        const type = container.dataset.visualization;

        switch(type) {
            case 'timeline':
                viz.createTimelineChart(timelineData);
                break;
            case 'radar':
                viz.createRadarChart(radarData);
                break;
            case 'bar':
                viz.createBarChart(barData);
                break;
        }
    });
});

// Particle System and Visual Effects

class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            particleCount: options.particleCount || 50,
            baseSize: options.baseSize || 3,
            sizeVariation: options.sizeVariation || 1.5,
            speed: options.speed || 1,
            colorPalette: options.colorPalette || ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f'],
            connectDistance: options.connectDistance || 150,
            responsive: options.responsive !== undefined ? options.responsive : true
        };
        
        this.particles = [];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        this.resizeCanvas();
        if (this.options.responsive) {
            window.addEventListener('resize', () => this.resizeCanvas());
        }
        
        this.createParticles();
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }
    
    createParticles() {
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: this.options.baseSize + Math.random() * this.options.sizeVariation,
                color: this.options.colorPalette[Math.floor(Math.random() * this.options.colorPalette.length)],
                speedX: (Math.random() - 0.5) * this.options.speed,
                speedY: (Math.random() - 0.5) * this.options.speed
            });
        }
    }
    
    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.options.connectDistance) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / this.options.connectDistance})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off walls
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawConnections();
        this.particles.forEach(particle => this.drawParticle(particle));
        this.updateParticles();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Text Animation System
class TextAnimator {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            duration: options.duration || 2000,
            delay: options.delay || 100,
            easing: options.easing || 'cubic-bezier(0.4, 0, 0.2, 1)'
        };
        
        this.init();
    }
    
    init() {
        const text = this.element.textContent;
        this.element.textContent = '';
        
        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.display = 'inline-block';
            span.style.transition = `all ${this.options.duration}ms ${this.options.easing} ${index * this.options.delay}ms`;
            this.element.appendChild(span);
        });
    }
    
    animate() {
        [...this.element.children].forEach(span => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
        });
    }
}

// Initialize Particle System for hero section
document.addEventListener('DOMContentLoaded', () => {
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        new ParticleSystem(heroBackground, {
            particleCount: 30,
            baseSize: 2,
            sizeVariation: 1,
            speed: 0.5,
            colorPalette: ['#3498db', '#2ecc71', '#e74c3c'],
            connectDistance: 100
        });
    }
    
    // Initialize text animations
    document.querySelectorAll('.animate-text').forEach(element => {
        const animator = new TextAnimator(element);
        // Animate when element becomes visible
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animator.animate();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(element);
    });
});

// Export classes for use in other files
export { ParticleSystem, TextAnimator }; 