// Search System Implementation

class SearchSystem {
    constructor(options = {}) {
        this.options = {
            minChars: options.minChars || 2,
            debounceTime: options.debounceTime || 300,
            highlightClass: options.highlightClass || 'search-highlight',
            searchableElements: options.searchableElements || ['h1', 'h2', 'h3', 'p', '.card-content'],
            excludeElements: options.excludeElements || ['.search-container', 'nav', 'footer']
        };
        
        this.searchInput = document.querySelector('#search-input');
        this.searchResults = document.querySelector('#search-results');
        this.searchContainer = document.querySelector('.search-container');
        
        this.init();
    }
    
    init() {
        if (!this.searchInput || !this.searchResults) return;
        
        // Initialize search input event listeners
        this.searchInput.addEventListener('input', this.debounce(() => {
            const query = this.searchInput.value.trim();
            if (query.length >= this.options.minChars) {
                this.performSearch(query);
            } else {
                this.clearResults();
            }
        }, this.options.debounceTime));
        
        // Handle keyboard navigation
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSearch();
            }
        });
        
        // Clear search when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.searchContainer.contains(e.target)) {
                this.clearSearch();
            }
        });
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    performSearch(query) {
        // Reset previous results
        this.clearResults();
        
        // Convert query to lowercase for case-insensitive search
        const searchQuery = query.toLowerCase();
        
        // Get all searchable content
        const searchableContent = this.getSearchableContent();
        
        // Filter and rank results
        const results = searchableContent
            .map(element => {
                const text = element.textContent.toLowerCase();
                const index = text.indexOf(searchQuery);
                if (index === -1) return null;
                
                return {
                    element,
                    text,
                    index,
                    score: this.calculateRelevanceScore(text, searchQuery, index)
                };
            })
            .filter(result => result !== null)
            .sort((a, b) => b.score - a.score);
        
        // Display results
        this.displayResults(results, searchQuery);
    }
    
    getSearchableContent() {
        const elements = [];
        this.options.searchableElements.forEach(selector => {
            const found = Array.from(document.querySelectorAll(selector));
            elements.push(...found);
        });
        
        // Filter out elements that should be excluded
        return elements.filter(element => {
            return !this.options.excludeElements.some(excludeSelector => 
                element.matches(excludeSelector) || element.closest(excludeSelector)
            );
        });
    }
    
    calculateRelevanceScore(text, query, index) {
        let score = 0;
        
        // Higher score for matches at the start of the text
        score += (1 - index / text.length) * 10;
        
        // Higher score for exact matches
        if (text.includes(` ${query} `)) score += 5;
        
        // Higher score for matches in headings
        if (text.length < 100) score += 3;
        
        // Higher score for frequency of matches
        const matches = text.split(query).length - 1;
        score += matches;
        
        return score;
    }
    
    displayResults(results, query) {
        if (results.length === 0) {
            this.showNoResults();
            return;
        }
        
        const resultsFragment = document.createDocumentFragment();
        
        results.slice(0, 10).forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'search-result';
            
            // Get context around the match
            const context = this.getContext(result.text, result.index, query.length);
            
            // Create result content
            resultElement.innerHTML = this.highlightText(context, query);
            
            // Add click handler to scroll to result
            resultElement.addEventListener('click', () => {
                this.scrollToElement(result.element);
                this.clearSearch();
            });
            
            resultsFragment.appendChild(resultElement);
        });
        
        this.searchResults.appendChild(resultsFragment);
        this.searchResults.style.display = 'block';
    }
    
    getContext(text, index, queryLength, contextLength = 100) {
        let start = Math.max(0, index - contextLength / 2);
        let end = Math.min(text.length, index + queryLength + contextLength / 2);
        
        // Adjust to show complete words
        while (start > 0 && text[start - 1] !== ' ') start--;
        while (end < text.length && text[end] !== ' ') end++;
        
        let context = text.slice(start, end);
        
        // Add ellipsis if necessary
        if (start > 0) context = '...' + context;
        if (end < text.length) context += '...';
        
        return context;
    }
    
    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, `<span class="${this.options.highlightClass}">$1</span>`);
    }
    
    scrollToElement(element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Temporarily highlight the element
        element.classList.add('highlight');
        setTimeout(() => element.classList.remove('highlight'), 2000);
    }
    
    showNoResults() {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = 'Aucun résultat trouvé';
        this.searchResults.appendChild(noResults);
        this.searchResults.style.display = 'block';
    }
    
    clearResults() {
        while (this.searchResults.firstChild) {
            this.searchResults.removeChild(this.searchResults.firstChild);
        }
        this.searchResults.style.display = 'none';
    }
    
    clearSearch() {
        this.searchInput.value = '';
        this.clearResults();
    }
}

// Initialize search system
document.addEventListener('DOMContentLoaded', () => {
    const searchSystem = new SearchSystem({
        minChars: 2,
        debounceTime: 300,
        searchableElements: [
            'h1', 'h2', 'h3', 'p',
            '.info-card', '.aspect-card',
            '.content-section'
        ],
        excludeElements: [
            '.search-container',
            'nav',
            'footer',
            '.menu-toggle'
        ]
    });
});

// Export SearchSystem class for use in other files
export { SearchSystem }; 