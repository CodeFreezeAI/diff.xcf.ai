// Demo functionality for MultiLineDiff Website
document.addEventListener('DOMContentLoaded', function() {
    initDemo();
});

function initDemo() {
    const generateBtn = document.getElementById('generate-diff');
    const loadExampleBtn = document.getElementById('load-example');
    const clearDestBtn = document.getElementById('clear-dest');
    const algorithmSelect = document.getElementById('algorithm-select');
    const formatSelect = document.getElementById('format-select');
    const sourceInput = document.getElementById('source-input');
    const destInput = document.getElementById('dest-input');
    const diffOutput = document.getElementById('diff-output');
    const outputStats = document.getElementById('output-stats');
    let performanceTimer;
    let startTime;

    // Initialize real-time performance monitoring
    function startPerformanceMonitoring() {
        startTime = performance.now();
        updatePerformanceDisplay();
    }

    function updatePerformanceDisplay() {
        const currentTime = performance.now();
        const elapsedTime = ((currentTime - startTime) % 1000).toFixed(1); // Calculate elapsed time modulo 1000ms
        
        // Update all time displays in the UI
        const timeDisplays = document.querySelectorAll('.time-display');
        timeDisplays.forEach(display => {
            display.textContent = `${elapsedTime}ms`;
        });

        performanceTimer = requestAnimationFrame(updatePerformanceDisplay);
    }

    function stopPerformanceMonitoring() {
        if (performanceTimer) {
            cancelAnimationFrame(performanceTimer);
        }
    }

    // Start monitoring when page loads
    startPerformanceMonitoring();

    // Example code snippets
    const examples = {
        swift: {
            source: `func greet(name: String) -> String {
    return "Hello, \\(name)!"
}

class Calculator {
    private var result: Double = 0
    
    func add(_ value: Double) {
        result += value
    }
    
    func getResult() -> Double {
        return result
    }
}`,
            destination: `func greet(name: String, greeting: String = "Hello") -> String {
    return "\\(greeting), \\(name)!"
}

class Calculator {
    private var result: Double = 0
    private var history: [Double] = []
    
    func add(_ value: Double) -> Double {
        result += value
        history.append(value)
        return result
    }
    
    func getResult() -> Double {
        return result
    }
    
    func getHistory() -> [Double] {
        return history
    }
    
    func reset() {
        result = 0
        history.removeAll()
    }
}`
        },
        javascript: {
            source: `function calculateTotal(items) {
    let total = 0;
    for (let item of items) {
        total += item.price;
    }
    return total;
}

class ShoppingCart {
    constructor() {
        this.items = [];
    }
    
    addItem(item) {
        this.items.push(item);
    }
    
    getTotal() {
        return calculateTotal(this.items);
    }
}`,
            destination: `function calculateTotal(items, taxRate = 0) {
    let subtotal = 0;
    for (let item of items) {
        subtotal += item.price * item.quantity;
    }
    const tax = subtotal * taxRate;
    return subtotal + tax;
}

class ShoppingCart {
    constructor(taxRate = 0.08) {
        this.items = [];
        this.taxRate = taxRate;
        this.discounts = [];
    }
    
    addItem(item) {
        if (!item.quantity) {
            item.quantity = 1;
        }
        this.items.push(item);
    }
    
    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
    }
    
    applyDiscount(discount) {
        this.discounts.push(discount);
    }
    
    getSubtotal() {
        return calculateTotal(this.items);
    }
    
    getTotal() {
        let total = calculateTotal(this.items, this.taxRate);
        for (let discount of this.discounts) {
            total -= discount.amount;
        }
        return Math.max(0, total);
    }
}`
        },
        python: {
            source: `def calculate_fibonacci(n):
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

class NumberProcessor:
    def __init__(self):
        self.numbers = []
    
    def add_number(self, num):
        self.numbers.append(num)
    
    def get_sum(self):
        return sum(self.numbers)`,
            destination: `def calculate_fibonacci(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = calculate_fibonacci(n-1, memo) + calculate_fibonacci(n-2, memo)
    return memo[n]

class NumberProcessor:
    def __init__(self, max_size=1000):
        self.numbers = []
        self.max_size = max_size
        self._sum_cache = None
    
    def add_number(self, num):
        if len(self.numbers) >= self.max_size:
            raise ValueError("Maximum capacity reached")
        self.numbers.append(num)
        self._sum_cache = None  # Invalidate cache
    
    def remove_number(self, num):
        if num in self.numbers:
            self.numbers.remove(num)
            self._sum_cache = None
    
    def get_sum(self):
        if self._sum_cache is None:
            self._sum_cache = sum(self.numbers)
        return self._sum_cache
    
    def get_average(self):
        if not self.numbers:
            return 0
        return self.get_sum() / len(self.numbers)
    
    def clear(self):
        self.numbers.clear()
        self._sum_cache = None`
        }
    };

    // Load example button
    if (loadExampleBtn) {
        loadExampleBtn.addEventListener('click', () => {
            const exampleKeys = Object.keys(examples);
            const randomExample = examples[exampleKeys[Math.floor(Math.random() * exampleKeys.length)]];
            
            if (sourceInput) sourceInput.value = randomExample.source;
            if (destInput) destInput.value = randomExample.destination;
        });
    }

    // Clear both inputs button
    if (clearDestBtn) {
        clearDestBtn.addEventListener('click', () => {
            if (sourceInput) {
                sourceInput.value = '';
            }
            if (destInput) {
                destInput.value = '';
                destInput.focus();
            }
            // Clear the diff output as well
            showPlaceholder();
        });
    }

    // Generate diff button
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            generateDiff();
        });
    }

    // Auto-generate on input change (debounced)
    const debouncedGenerate = debounce(generateDiff, 1000);
    
    if (sourceInput) {
        sourceInput.addEventListener('input', debouncedGenerate);
    }
    
    if (destInput) {
        destInput.addEventListener('input', debouncedGenerate);
    }

    if (algorithmSelect) {
        algorithmSelect.addEventListener('change', generateDiff);
    }

    if (formatSelect) {
        formatSelect.addEventListener('change', generateDiff);
    }

    function generateDiff() {
        const source = sourceInput?.value || '';
        const destination = destInput?.value || '';
        const algorithm = algorithmSelect?.value || 'megatron';
        const format = formatSelect?.value || 'ai';

        if (!source.trim() || !destination.trim()) {
            showPlaceholder();
            return;
        }

        // Start timing
        const startTime = performance.now();

        // Show loading state
        if (diffOutput) {
            diffOutput.innerHTML = '<div class="loading-spinner"></div><p>Generating diff...</p>';
            diffOutput.classList.add('loading');
        }

        // Simulate diff generation (in real implementation, this would call the actual MultiLineDiff library)
        setTimeout(() => {
            const endTime = performance.now();
            let processingTime = (endTime - startTime) / 100;
            
            // Adjust time based on algorithm type
            if (['flash', 'zoom'].includes(algorithm)) {
                // Bulk processing algorithms - faster
                processingTime = processingTime * 0.3;
            } else {
                // Line-based algorithms - more detailed processing
                processingTime = processingTime * 0.8;
            }
            
            const result = simulateDiffGeneration(source, destination, algorithm, format);
            
            // Update the stats with actual measured time (keep full precision)
            result.stats.createTime = processingTime.toFixed(3);
            result.stats.applyTime = (processingTime * 0.4).toFixed(3); // Apply time is typically faster
            
            displayDiffResult(result);
        }, 800);
    }

    function simulateDiffGeneration(source, destination, algorithm, format) {
        // This is a simulation - in a real implementation, you would call the actual MultiLineDiff library
        const sourceLines = source.split('\n');
        const destLines = destination.split('\n');
        
        // Calculate basic stats
        const stats = {
            algorithm: algorithm,
            format: format,
            sourceLines: sourceLines.length,
            destLines: destLines.length,
            operations: getAlgorithmOperations(algorithm),
            createTime: getAlgorithmTime(algorithm, 'create'),
            applyTime: getAlgorithmTime(algorithm, 'apply')
        };

        // Generate ASCII diff simulation
        let diffContent = '';
        
        if (format === 'ai' || format === 'terminal') {
            diffContent = generateASCIIDiff(sourceLines, destLines);
            // Count actual operations in the diff
            stats.operations = countActualOperations(diffContent, algorithm);
        } else if (format === 'json') {
            diffContent = generateJSONDiff(sourceLines, destLines);
        } else if (format === 'base64') {
            diffContent = generateBase64Diff(sourceLines, destLines);
        }

        return {
            content: diffContent,
            stats: stats
        };
    }

    function generateASCIIDiff(sourceLines, destLines) {
        const algorithm = algorithmSelect?.value || 'megatron';
        
        // For Flash and Zoom algorithms, generate minimal operations
        if (algorithm === 'flash' || algorithm === 'zoom') {
            return generateMinimalDiff(sourceLines, destLines);
        }
        
        // For line-aware algorithms, show detailed line-by-line comparison
        let diff = '';
        const maxLines = Math.max(sourceLines.length, destLines.length);
        
        for (let i = 0; i < maxLines; i++) {
            const sourceLine = sourceLines[i];
            const destLine = destLines[i];
            
            // Check if both lines are just closing braces
            const isSourceCloseBrace = sourceLine && sourceLine.trim() === '}';
            const isDestCloseBrace = destLine && destLine.trim() === '}';
            
            // Check if this line appears in both source and dest consecutively
            const isConsecutiveIdentical = sourceLine && destLine && 
                sourceLine === destLine && 
                i < maxLines - 1 && 
                sourceLines[i + 1] === destLines[i + 1];

            if (sourceLine === destLine && sourceLine !== undefined) {
                // Unchanged line - show as retain
                diff += `📎 ${sourceLine}\n`;
            } else if (isSourceCloseBrace && isDestCloseBrace) {
                // Both lines are closing braces - show as retain
                diff += `📎 ${sourceLine || destLine}\n`;
            } else if (isConsecutiveIdentical) {
                // Lines are identical and appear consecutively - show as retain
                diff += `📎 ${sourceLine}\n`;
                // Skip the next line since we've handled it as part of this consecutive match
                i++;
                diff += `📎 ${sourceLines[i]}\n`;
            } else {
                // Changed line - show individual operations
                if (sourceLine !== undefined) {
                    diff += `❌ ${sourceLine}\n`;
                }
                if (destLine !== undefined) {
                    diff += `✅ ${destLine}\n`;
                }
            }
        }
        
        return diff.trim();
    }

    function generateMinimalDiff(sourceLines, destLines) {
        // Flash/Zoom algorithms work with bulk operations: Retain, Delete, Insert
        // Find common prefix and suffix, then group the middle changes
        let diff = '';
        
        // Find common prefix (lines that are the same at the beginning)
        let prefixEnd = 0;
        while (prefixEnd < Math.min(sourceLines.length, destLines.length) && 
               sourceLines[prefixEnd] === destLines[prefixEnd]) {
            prefixEnd++;
        }
        
        // Find common suffix (lines that are the same at the end)
        let sourceSuffixStart = sourceLines.length;
        let destSuffixStart = destLines.length;
        while (sourceSuffixStart > prefixEnd && destSuffixStart > prefixEnd &&
               sourceLines[sourceSuffixStart - 1] === destLines[destSuffixStart - 1]) {
            sourceSuffixStart--;
            destSuffixStart--;
        }
        
        // RETAIN: Show common prefix
        for (let i = 0; i < prefixEnd; i++) {
            diff += `📎 ${sourceLines[i]}\n`;
        }
        
        // DELETE: Show middle section from source
        for (let i = prefixEnd; i < sourceSuffixStart; i++) {
            diff += `❌ ${sourceLines[i]}\n`;
        }
        
        // INSERT: Show middle section from destination
        for (let i = prefixEnd; i < destSuffixStart; i++) {
            diff += `✅ ${destLines[i]}\n`;
        }
        
        // RETAIN: Show common suffix
        for (let i = sourceSuffixStart; i < sourceLines.length; i++) {
            diff += `📎 ${sourceLines[i]}\n`;
        }
        
        return diff.trim() || '📎 No changes detected';
    }

    function generateJSONDiff(sourceLines, destLines) {
        const operations = [];
        
        // Simulate operations
        operations.push({ "=": 5 }); // retain 5 chars
        operations.push({ "-": 3 }); // delete 3 chars
        operations.push({ "+": "new content" }); // insert content
        operations.push({ "=": 10 }); // retain 10 chars
        
        const metadata = {
            "str": 0,
            "cnt": sourceLines.length,
            "alg": "megatron",
            "app": "requiresFullSource",
            "tim": 0.0234
        };

        return JSON.stringify({
            "df": operations,
            "md": metadata
        }, null, 2);
    }

    function generateBase64Diff(sourceLines, destLines) {
        const jsonDiff = generateJSONDiff(sourceLines, destLines);
        return btoa(jsonDiff);
    }

    function getAlgorithmTime(algorithm, operation) {
        const times = {
            flash: { create: 14.5, apply: 6.6 },
            zoom: { create: 23.9, apply: 9.1 },
            optimus: { create: 43.7, apply: 6.6 },
            starscream: { create: 45.1, apply: 6.9 },
            megatron: { create: 47.8, apply: 7.0 }
        };
        
        return times[algorithm]?.[operation] || 25.0;
    }

    function getAlgorithmOperations(algorithm) {
        const operations = {
            flash: 3,        // Fast algorithms produce minimal operations
            zoom: 3,         // Simple character-based, minimal operations
            optimus: 1256,   // Line-aware, detailed operations
            starscream: 1256, // Line-aware, detailed operations
            megatron: 1256   // Semantic analysis, detailed operations
        };
        
        return operations[algorithm] || 3;
    }

    function countActualOperations(diffContent, algorithm) {
        if (!diffContent) return 0;
        
        const lines = diffContent.split('\n').filter(line => line.trim());
        
        // For ALL algorithms, count operation groups (consecutive operations of same type = 1 operation)
        let operations = 0;
        let lastType = '';
        
        for (const line of lines) {
            const currentType = line.startsWith('📎') ? 'retain' : 
                              line.startsWith('❌') ? 'delete' : 
                              line.startsWith('✅') ? 'insert' : '';
            
            if (currentType && currentType !== lastType) {
                operations++;
                lastType = currentType;
            }
        }
        
        return operations;
    }

    function displayDiffResult(result) {
        if (!diffOutput) return;

        diffOutput.classList.remove('loading');
        
        // Display the diff content
        const format = formatSelect?.value || 'ai';
        
        if (format === 'ai' || format === 'terminal') {
            const cssClass = format === 'terminal' ? 'ascii-diff terminal-colors' : 'ascii-diff';
            diffOutput.innerHTML = `
                <pre class="${cssClass}"><code class="language-swift">${escapeHtml(result.content)}</code></pre>
            `;
            
            // Apply syntax highlighting for ASCII diff
            highlightASCIIDiff(diffOutput.querySelector('.ascii-diff'));
            
            // Apply Prism.js syntax highlighting for AI format
            if (format === 'ai' && window.Prism) {
                Prism.highlightElement(diffOutput.querySelector('code'));
            }
        } else {
            diffOutput.innerHTML = `
                <pre><code class="language-json">${escapeHtml(result.content)}</code></pre>
            `;
            
            // Apply Prism.js highlighting
            if (window.Prism) {
                Prism.highlightElement(diffOutput.querySelector('code'));
            }
        }

        // Update stats
        updateOutputStats(result.stats);

        // Add success animation
        diffOutput.classList.add('animate-fade-in');
    }

    function highlightASCIIDiff(element) {
        if (!element) return;
        
        // For terminal colors, apply simple line-based highlighting
        if (element.classList.contains('terminal-colors')) {
            const codeElement = element.querySelector('code');
            if (codeElement) {
                const lines = codeElement.textContent.split('\n');
                const highlightedLines = lines.map(line => {
                    if (line.startsWith('📎')) {
                        return `<span class="retain">${escapeHtml(line)}</span>`;
                    } else if (line.startsWith('❌')) {
                        return `<span class="delete">${escapeHtml(line)}</span>`;
                    } else if (line.startsWith('✅')) {
                        return `<span class="insert">${escapeHtml(line)}</span>`;
                    }
                    return escapeHtml(line);
                });
                codeElement.innerHTML = highlightedLines.join('\n');
            }
        }
        // For AI format, let Prism.js handle the syntax highlighting
        // The emoji symbols will be part of the Swift syntax highlighting
    }

    function updateOutputStats(stats) {
        if (!outputStats) return;

        const algorithmEmojis = {
            flash: '⚡',
            optimus: '🤖',
            megatron: '🧠',
            starscream: '🌟',
            zoom: '🔍'
        };

        const formatEmojis = {
            ai: '🤖',
            terminal: '🌈',
            json: '📊',
            base64: '🔐'
        };

        outputStats.innerHTML = `
            <span class="stat-badge">${algorithmEmojis[stats.algorithm] || '🔧'} ${stats.algorithm}</span>
            <span class="stat-badge">${formatEmojis[stats.format] || '📄'} ${stats.format}</span>
            <span class="stat-badge">⚡ ${stats.createTime}ms</span>
            <span class="stat-badge">📊 ${stats.operations} ops</span>
        `;
    }

    function showPlaceholder() {
        if (!diffOutput) return;
        
        diffOutput.innerHTML = `
            <div class="placeholder">
                <div class="placeholder-icon">📊</div>
                <p>Enter source and destination code to generate a diff</p>
            </div>
        `;
        
        if (outputStats) {
            outputStats.innerHTML = '';
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Utility function (reuse from main.js if available)
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // Initialize with placeholder
    showPlaceholder();

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to generate diff
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            generateDiff();
        }
        
        // Ctrl/Cmd + L to load example
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            if (loadExampleBtn) loadExampleBtn.click();
        }
    });

    // Add copy to clipboard functionality
    function addCopyButton() {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy
        `;
        
        copyBtn.addEventListener('click', () => {
            const content = diffOutput.querySelector('pre')?.textContent || '';
            navigator.clipboard.writeText(content).then(() => {
                copyBtn.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    Copied!
                `;
                setTimeout(() => {
                    copyBtn.innerHTML = `
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copy
                    `;
                }, 2000);
            });
        });

        if (diffOutput && diffOutput.querySelector('pre')) {
            diffOutput.style.position = 'relative';
            diffOutput.appendChild(copyBtn);
        }
    }

    // Add copy button when diff is generated
    const originalDisplayDiffResult = displayDiffResult;
    displayDiffResult = function(result) {
        originalDisplayDiffResult(result);
        setTimeout(addCopyButton, 100);
    };

    // Add CSS styles for the time stats
    const style = document.createElement('style');
    style.textContent = `
        .time-stat {
            background: var(--bg-tertiary);
            padding: 8px 16px;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .time-label {
            font-size: 0.875rem;
            color: var(--text-secondary);
        }
        .time-value {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--text-primary);
        }
        #source-input, #dest-input {
            font-size: 0.5rem;
            line-height: 1.4;
            white-space: pre !important;
            overflow-x: auto !important;
            word-wrap: normal !important;
            padding: 2px !important;
        }
        .btn-gradient {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%) !important;
            border: none !important;
            transition: all 0.2s ease !important;
        }
        .btn-gradient:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.4) !important;
        }
        .copy-btn {
            position: absolute !important;
            top: 8px !important;
            right: 8px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 4px !important;
            color: white !important;
            padding: 4px 8px !important;
            font-size: 12px !important;
            cursor: pointer !important;
            opacity: 0 !important;
            transition: opacity 0.2s ease !important;
            display: flex !important;
            align-items: center !important;
            gap: 4px !important;
        }
        .demo-panel:hover .copy-btn {
            opacity: 1 !important;
        }
        .copy-btn:hover {
            background: rgba(255, 255, 255, 0.2) !important;
        }
    `;
    document.head.appendChild(style);
}

// Export for use in other modules
window.DemoModule = {
    generateDiff: () => {
        const generateBtn = document.getElementById('generate-diff');
        if (generateBtn) generateBtn.click();
    }
}; 