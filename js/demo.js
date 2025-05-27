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
    let lastDiffTime = 0;
    let isGenerating = false;
    
    function startPerformanceMonitoring() {
        // Don't start the cycling animation - we only want real timing
        console.log('🎯 Performance monitoring initialized - showing real algorithm times only');
    }

    function updatePerformanceDisplay() {
        // Only update with real diff times, no cycling animation
        const liveTiming = document.querySelector('.live-timing');
        if (liveTiming && lastDiffTime > 0) {
            // Show real timing with 3 decimal places precision
            const preciseTime = Math.max(lastDiffTime, 0.001).toFixed(3);
            liveTiming.innerHTML = `⚡ <span style="display: inline-block; min-width: 60px;">${preciseTime}ms</span>`;
        }
        
        // Update time displays with last real timing
        const timeDisplays = document.querySelectorAll('.time-display');
        timeDisplays.forEach(display => {
            if (lastDiffTime > 0) {
                // Show real timing with 3 decimal places precision
                const preciseTime = Math.max(lastDiffTime, 0.001).toFixed(3);
                display.innerHTML = `<span style="display: inline-block; min-width: 60px;">${preciseTime}ms</span>`;
            } else {
                display.innerHTML = '<span style="display: inline-block; min-width: 60px;">0.001ms</span>';
            }
        });
    }

    function stopPerformanceMonitoring() {
        // No animation to stop
    }

    // Initialize without starting animation
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
            
            // Automatically generate diff after loading example
            setTimeout(() => {
                generateDiff();
                applySyntaxHighlighting();
            }, 100);
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

    // Generate diff button (now handled in updateOutputStats and showPlaceholder)
    // The DIFF button is dynamically created in the stats grid

    // Auto-generate on input change (debounced)
    const debouncedGenerate = debounce(generateDiff, 1000);
    const debouncedHighlight = debounce(applySyntaxHighlighting, 300);
    
    if (sourceInput) {
        sourceInput.addEventListener('input', () => {
            debouncedGenerate();
            debouncedHighlight();
        });
    }
    
    if (destInput) {
        destInput.addEventListener('input', () => {
            debouncedGenerate();
            debouncedHighlight();
        });
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
        
        // Add some complexity to ensure measurable timing
        console.log(`📝 Input sizes: Source=${source.length} chars, Dest=${destination.length} chars`);

        // Set generating flag for live timing
        isGenerating = true;

        // Use real algorithm implementation with minimal delay for UI feedback
        setTimeout(() => {
            console.log(`🚀 Starting ${algorithm} algorithm...`);
            const result = generateRealDiff(source, destination, algorithm, format);
            
            // Store the actual timing for live display - NO PARSING, keep raw precision
            lastDiffTime = result.stats.createTime; // Raw number, no conversion
            isGenerating = false;
            
            console.log(`✅ ${algorithm} completed in ${lastDiffTime}ms (raw: ${result.stats.createTime})`);
            
            // Update performance displays immediately
            updatePerformanceDisplay();
            
            displayDiffResult(result);
        }, 50); // Minimal delay for UI feedback
    }

    function generateRealDiff(source, destination, algorithm, format) {
        // Use the actual MultiLineDiff implementation with high precision timing
        console.log(`🚀 Starting timing measurement for ${algorithm}...`);
        
        const createStartTime = performance.now();
        
        // Create diff using real algorithm
        const diffResult = MultiLineDiff.createDiff(source, destination, algorithm);
        
        const createEndTime = performance.now();
        let actualCreateTime = createEndTime - createStartTime;
        
        // Measure apply time
        const applyStartTime = performance.now();
        const appliedResult = MultiLineDiff.applyDiff(source, diffResult);
        const applyEndTime = performance.now();
        let actualApplyTime = applyEndTime - applyStartTime;
        
        // Debug: Check if timing is too small
        console.log(`🔍 RAW MEASUREMENTS: Create=${actualCreateTime}ms, Apply=${actualApplyTime}ms`);
        
        // If timing is 0 or extremely small, run multiple iterations for better measurement
        if (actualCreateTime < 0.001) {
            console.log(`⚡ Running multiple iterations for better precision...`);
            const iterations = 100;
            const multiStartTime = performance.now();
            
            for (let i = 0; i < iterations; i++) {
                MultiLineDiff.createDiff(source, destination, algorithm);
            }
            
            const multiEndTime = performance.now();
            actualCreateTime = (multiEndTime - multiStartTime) / iterations;
            console.log(`📊 Average over ${iterations} iterations: ${actualCreateTime}ms`);
        }
        
        // Calculate stats with NO ROUNDING - keep full precision
        const sourceLines = source.split('\n');
        const destLines = destination.split('\n');
        
        console.log(`🎯 FINAL TIMING: Create=${actualCreateTime}ms, Apply=${actualApplyTime}ms`);
        console.log(`📊 Algorithm: ${algorithm}, Operations: ${diffResult.operations.length}`);
        
        console.log(`✅ DISPLAY TIMING: Create=${actualCreateTime}ms, Apply=${actualApplyTime}ms`);
        
        const stats = {
            algorithm: algorithm,
            format: format,
            sourceLines: sourceLines.length,
            destLines: destLines.length,
            operations: diffResult.operations.length,
            createTime: actualCreateTime, // Show real timing, no artificial minimum
            applyTime: actualApplyTime,   // Show real timing, no artificial minimum
            totalTime: actualCreateTime + actualApplyTime,
            accuracy: appliedResult === destination ? '100%' : 'ERROR'
        };

        // Generate output based on format
        let diffContent = '';
        
        if (format === 'ai') {
            diffContent = MultiLineDiff.generateASCIIDiff(diffResult, source);
        } else if (format === 'json') {
            diffContent = generateJSONFromDiffResult(diffResult);
        } else if (format === 'base64') {
            diffContent = generateBase64FromDiffResult(diffResult);
        }

        return {
            content: diffContent,
            stats: stats,
            diffResult: diffResult
        };
    }



    function generateJSONFromDiffResult(diffResult) {
        const operations = diffResult.operations.map(op => {
            switch (op.type) {
                case 'retain':
                    return { "=": op.value };
                case 'delete':
                    return { "-": op.value };
                case 'insert':
                    return { "+": op.value };
                default:
                    return {};
            }
        });
        
        const metadata = {
            "alg": diffResult.metadata?.algorithm || "unknown",
            "ops": diffResult.operations.length,
            "tim": diffResult.metadata?.processingTime || 0
        };

        return JSON.stringify({
            "operations": operations,
            "metadata": metadata
        }, null, 2);
    }

    function generateBase64FromDiffResult(diffResult) {
        const jsonDiff = generateJSONFromDiffResult(diffResult);
        return btoa(jsonDiff);
    }

    // Remove old simulation functions - now using real algorithms

    function displayDiffResult(result) {
        if (!diffOutput) return;
        
        // Display the diff content
        const format = formatSelect?.value || 'ai';
        
        if (format === 'ai') {
            // For AI format, escape HTML for syntax highlighting
            diffOutput.innerHTML = `
                <pre class="ascii-diff"><code class="language-swift">${escapeHtml(result.content)}</code></pre>
            `;
            
            // Apply syntax highlighting for ASCII diff (AI format only)
            highlightASCIIDiff(diffOutput.querySelector('.ascii-diff'));
            
            // Apply Prism.js syntax highlighting for AI format
            if (window.Prism) {
                Prism.highlightElement(diffOutput.querySelector('code'));
            }
        } else if (format === 'base64') {
            // For base64 format, add text wrapping
            diffOutput.innerHTML = `
                <pre class="base64-output"><code>${escapeHtml(result.content)}</code></pre>
            `;
        } else {
            // For JSON format
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
        
        // For AI format, let Prism.js handle the syntax highlighting
        // The emoji symbols will be part of the Swift syntax highlighting
    }

    function updateOutputStats(stats) {
        if (!outputStats) return;

        const algorithmEmojis = {
            flash: '⚡',
            optimus: '🤖',
            megatron: '🧠'
        };

        const formatEmojis = {
            ai: '🤖',
            json: '📊',
            base64: '🔐'
        };

        // Create live timing display with real precision
        const preciseCreateTime = Math.max(stats.createTime, 0.001).toFixed(3);
        
        outputStats.innerHTML = `
            <div class="stats-grid">
                <button class="stat-badge diff-button" id="generate-diff-btn">GEN D1F</button>
                <span class="stat-badge algorithm-badge">${algorithmEmojis[stats.algorithm] || '🔧'} ${stats.algorithm}</span>
                <span class="stat-badge timing-badge live-timing">⚡ ${preciseCreateTime}ms</span>
                <span class="stat-badge format-badge">${formatEmojis[stats.format] || '📄'} ${stats.format}</span>
                <span class="stat-badge ops-badge">📊 ${stats.operations} ops</span>
            </div>
        `;

        // Add accuracy indicator if there's an error
        if (stats.accuracy && stats.accuracy !== '100%') {
            const currentContent = outputStats.innerHTML;
            const updatedContent = currentContent.replace(
                '</div>',
                '<span class="stat-badge error-badge">❌ ' + stats.accuracy + '</span></div>'
            );
            outputStats.innerHTML = updatedContent;
        } else if (stats.accuracy) {
            const currentContent = outputStats.innerHTML;
            const updatedContent = currentContent.replace(
                '</div>',
                '<span class="stat-badge success-badge">✅ ' + stats.accuracy + '</span></div>'
            );
            outputStats.innerHTML = updatedContent;
        }

        // Add click handler to the new DIFF button
        const diffBtn = document.getElementById('generate-diff-btn');
        if (diffBtn) {
            diffBtn.addEventListener('click', generateDiff);
        }
    }

    function showPlaceholder() {
        if (!diffOutput) return;
        
        diffOutput.innerHTML = `
            <div class="placeholder">
                <div class="placeholder-icon">📊</div>
                <p>Enter source and destination code to generate a diff</p>
            </div>
        `;
        
        // Reset timing displays with real precision
        lastDiffTime = 0;
        const liveTiming = document.querySelector('.live-timing');
        if (liveTiming) {
            liveTiming.innerHTML = `⚡ <span style="display: inline-block; min-width: 60px;">0.001ms</span>`;
        }
        
        const timeDisplays = document.querySelectorAll('.time-display');
        timeDisplays.forEach(display => {
            display.innerHTML = '<span style="display: inline-block; min-width: 60px;">0.001ms</span>';
        });
        
        if (outputStats) {
            // Get current algorithm selection
            const currentAlgorithm = algorithmSelect?.value || 'flash';
            const algorithmEmojis = {
                flash: '⚡',
                optimus: '🤖',
                megatron: '🧠'
            };
            
            outputStats.innerHTML = `
                <div class="stats-grid">
                    <button class="stat-badge diff-button" id="generate-diff-btn">GEN D1F</button>
                    <span class="stat-badge algorithm-badge">${algorithmEmojis[currentAlgorithm] || '🔧'} ${currentAlgorithm}</span>
                    <span class="stat-badge timing-badge">⚡ 0.001ms</span>
                    <span class="stat-badge success-badge">✅ 100%</span>
                    <span class="stat-badge format-badge">🤖 ai</span>
                    <span class="stat-badge ops-badge">📊 0 ops</span>
                </div>
            `;
            
            // Add click handler to the initial DIFF button
            const diffBtn = document.getElementById('generate-diff-btn');
            if (diffBtn) {
                diffBtn.addEventListener('click', generateDiff);
            }
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Auto-detect language and apply syntax highlighting
    function detectLanguage(code) {
        if (!code.trim()) return 'text';
        
        // Swift detection
        if (code.includes('func ') && (code.includes('-> ') || code.includes(': String') || code.includes(': Double'))) {
            return 'swift';
        }
        
        // Python detection
        if (code.includes('def ') && code.includes(':') && (code.includes('self') || code.includes('import ') || code.includes('class '))) {
            return 'python';
        }
        
        // JavaScript detection
        if (code.includes('function ') || code.includes('const ') || code.includes('let ') || code.includes('var ') || code.includes('=>')) {
            return 'javascript';
        }
        
        // Default to text
        return 'text';
    }

    function applySyntaxHighlighting() {
        if (!window.Prism) return;
        
        const sourceCode = sourceInput?.value || '';
        const destCode = destInput?.value || '';
        
        // Detect languages
        const sourceLang = detectLanguage(sourceCode);
        const destLang = detectLanguage(destCode);
        
        // Apply syntax highlighting classes
        if (sourceInput) {
            sourceInput.className = `demo-textarea language-${sourceLang}`;
            sourceInput.setAttribute('data-language', sourceLang);
        }
        
        if (destInput) {
            destInput.className = `demo-textarea language-${destLang}`;
            destInput.setAttribute('data-language', destLang);
        }
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
    
    // Initialize syntax highlighting
    applySyntaxHighlighting();

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
        `;
        
        copyBtn.addEventListener('click', () => {
            const content = diffOutput.querySelector('pre')?.textContent || '';
            navigator.clipboard.writeText(content).then(() => {
                copyBtn.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                `;
                setTimeout(() => {
                    copyBtn.innerHTML = `
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    `;
                }, 2000);
            });
        });

        if (diffOutput && diffOutput.querySelector('pre')) {
            diffOutput.classList.add('demo-output-positioned');
            diffOutput.appendChild(copyBtn);
        }
    }

    // Add copy button when diff is generated
    const originalDisplayDiffResult = displayDiffResult;
    displayDiffResult = function(result) {
        originalDisplayDiffResult(result);
        setTimeout(addCopyButton, 100);
    };

    // CSS styles are now in css/js-styles.css
}

// Export for use in other modules
window.DemoModule = {
    generateDiff: () => {
        const generateBtn = document.getElementById('generate-diff');
        if (generateBtn) generateBtn.click();
    }
}; 