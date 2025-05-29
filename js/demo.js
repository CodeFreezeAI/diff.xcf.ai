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
        // Don't start the cycling animation - we only want real timing only
        console.log('🎯 Performance monitoring initialized - showing real algorithm times only');
    }

    function updatePerformanceDisplay() {
        // Only update with real diff times, no cycling animation
        const liveTiming = document.querySelector('.live-timing');
        if (liveTiming && lastDiffTime > 0) {
            // Show real timing with 3 decimal places precision
            const preciseTime = Math.max(lastDiffTime, 0.000).toFixed(3);
            liveTiming.innerHTML = `⚡ <span style="display: inline-block; min-width: 60px;">${preciseTime}ms</span>`;
        }
        
        // Update time displays with last real timing
        const timeDisplays = document.querySelectorAll('.time-display');
        timeDisplays.forEach(display => {
            if (lastDiffTime > 0) {
                // Show real timing with 3 decimal places precision
                const preciseTime = Math.max(lastDiffTime, 0.000).toFixed(3);
                display.innerHTML = `<span style="display: inline-block; min-width: 60px;">${preciseTime}ms</span>`;
            } else {
                display.innerHTML = '<span style="display: inline-block; min-width: 60px;">0.000ms</span>';
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
        },
        react: {
            source: `function Button({ text, onClick }) {
    return (
        <button onClick={onClick}>
            {text}
        </button>
    );
}

function App() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <h1>Counter: {count}</h1>
            <Button text="Click me" onClick={() => setCount(count + 1)} />
        </div>
    );
}`,
            destination: `function Button({ text, onClick, variant = "primary", disabled = false }) {
    return (
        <button 
            className={\`btn btn-\${variant}\`}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
}

function App() {
    const [count, setCount] = useState(0);
    const [isDisabled, setIsDisabled] = useState(false);
    
    const handleIncrement = () => {
        setCount(prevCount => prevCount + 1);
        if (count >= 9) {
            setIsDisabled(true);
        }
    };
    
    const handleReset = () => {
        setCount(0);
        setIsDisabled(false);
    };
    
    return (
        <div className="app">
            <h1>Counter: {count}</h1>
            <div className="button-group">
                <Button 
                    text="Increment" 
                    onClick={handleIncrement}
                    disabled={isDisabled}
                />
                <Button 
                    text="Reset" 
                    onClick={handleReset}
                    variant="secondary"
                />
            </div>
            {count >= 10 && <p>Maximum reached!</p>}
        </div>
    );
}`
        },
        css: {
            source: `.button {
    padding: 8px 16px;
    border: none;
    background: blue;
    color: white;
    cursor: pointer;
}

.card {
    border: 1px solid #ccc;
    padding: 16px;
}`,
            destination: `.button {
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.button:active {
    transform: translateY(0);
}

.card {
    border: 1px solid #e1e5e9;
    border-radius: 12px;
    padding: 24px;
    background: white;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition: box-shadow 0.2s ease;
}

.card:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}`
        },
        java: {
            source: `public class Person {
    private String name;
    private int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public String getName() {
        return name;
    }
    
    public int getAge() {
        return age;
    }
}`,
            destination: `public class Person {
    private String name;
    private int age;
    private String email;
    private boolean isActive;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
        this.email = "";
        this.isActive = true;
    }
    
    public Person(String name, int age, String email) {
        this(name, age);
        this.email = email;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public int getAge() {
        return age;
    }
    
    public void setAge(int age) {
        if (age >= 0) {
            this.age = age;
        }
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        this.isActive = active;
    }
    
    @Override
    public String toString() {
        return String.format("Person{name='%s', age=%d, email='%s', active=%b}", 
                           name, age, email, isActive);
    }
}`
        },
        html: {
            source: `<!DOCTYPE html>
<html>
<head>
    <title>Simple Page</title>
</head>
<body>
    <h1>Welcome</h1>
    <p>This is a simple page.</p>
    <button>Click me</button>
</body>
</html>`,
            destination: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enhanced Page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav>
            <h1>Welcome to Our Site</h1>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="home">
            <h2>Welcome</h2>
            <p>This is an enhanced page with modern structure.</p>
            <div class="button-group">
                <button class="btn-primary">Get Started</button>
                <button class="btn-secondary">Learn More</button>
            </div>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 Our Company. All rights reserved.</p>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>`
        },
        sql: {
            source: `SELECT id, name, email
FROM users
WHERE age > 18;

INSERT INTO orders (user_id, total)
VALUES (1, 99.99);`,
            destination: `SELECT 
    u.id,
    u.name,
    u.email,
    u.created_at,
    COUNT(o.id) as order_count,
    COALESCE(SUM(o.total), 0) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.age > 18 
    AND u.is_active = true
GROUP BY u.id, u.name, u.email, u.created_at
HAVING COUNT(o.id) > 0
ORDER BY total_spent DESC, u.created_at ASC;

INSERT INTO orders (user_id, total, status, created_at)
VALUES (1, 99.99, 'pending', NOW());

INSERT INTO order_items (order_id, product_id, quantity, price)
SELECT 
    LAST_INSERT_ID(),
    p.id,
    1,
    p.price
FROM products p
WHERE p.id IN (101, 102, 103);`
        },
        rust: {
            source: `struct Point {
    x: f64,
    y: f64,
}

impl Point {
    fn new(x: f64, y: f64) -> Point {
        Point { x, y }
    }
    
    fn distance(&self, other: &Point) -> f64 {
        ((self.x - other.x).powi(2) + (self.y - other.y).powi(2)).sqrt()
    }
}`,
            destination: `use std::fmt;

#[derive(Debug, Clone, PartialEq)]
struct Point {
    x: f64,
    y: f64,
}

impl Point {
    fn new(x: f64, y: f64) -> Point {
        Point { x, y }
    }
    
    fn origin() -> Point {
        Point { x: 0.0, y: 0.0 }
    }
    
    fn distance(&self, other: &Point) -> f64 {
        ((self.x - other.x).powi(2) + (self.y - other.y).powi(2)).sqrt()
    }
    
    fn translate(&mut self, dx: f64, dy: f64) {
        self.x += dx;
        self.y += dy;
    }
    
    fn magnitude(&self) -> f64 {
        self.distance(&Point::origin())
    }
}

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "({:.2}, {:.2})", self.x, self.y)
    }
}

impl Default for Point {
    fn default() -> Self {
        Point::origin()
    }
}`
        },
        go: {
            source: `package main

import "fmt"

type User struct {
    Name string
    Age  int
}

func (u User) Greet() {
    fmt.Printf("Hello, I'm %s\\n", u.Name)
}

func main() {
    user := User{Name: "Alice", Age: 30}
    user.Greet()
}`,
            destination: `package main

import (
    "encoding/json"
    "fmt"
    "log"
    "time"
)

type User struct {
    ID        int       \`json:"id"\`
    Name      string    \`json:"name"\`
    Age       int       \`json:"age"\`
    Email     string    \`json:"email"\`
    CreatedAt time.Time \`json:"created_at"\`
    IsActive  bool      \`json:"is_active"\`
}

func NewUser(name string, age int, email string) *User {
    return &User{
        Name:      name,
        Age:       age,
        Email:     email,
        CreatedAt: time.Now(),
        IsActive:  true,
    }
}

func (u *User) Greet() {
    fmt.Printf("Hello, I'm %s and I'm %d years old\\n", u.Name, u.Age)
}

func (u *User) Activate() {
    u.IsActive = true
}

func (u *User) Deactivate() {
    u.IsActive = false
}

func (u *User) ToJSON() ([]byte, error) {
    return json.Marshal(u)
}

func main() {
    user := NewUser("Alice", 30, "alice@example.com")
    user.Greet()
    
    jsonData, err := user.ToJSON()
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("User JSON: %s\\n", jsonData)
}`
        },
        markdown: {
            source: `# My Project

This is a simple project.

## Features

- Basic functionality
- Easy to use

## Installation

Run the following command:

\`\`\`bash
npm install
\`\`\``,
            destination: `# My Awesome Project

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/user/project)
[![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)](https://github.com/user/project/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

This is an advanced project with comprehensive documentation and modern features.

## 🚀 Features

- ✅ Advanced functionality with real-time updates
- ✅ Intuitive and responsive user interface
- ✅ Comprehensive API with authentication
- ✅ Built-in analytics and monitoring
- ✅ Cross-platform compatibility
- ✅ Extensive test coverage (95%+)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 16.0 or higher)
- npm or yarn package manager
- Docker (optional, for containerized deployment)

## 🛠️ Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/user/my-awesome-project.git
cd my-awesome-project
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

## 🔧 Configuration

The application can be configured through environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| \`PORT\` | Server port | 3000 |
| \`DATABASE_URL\` | Database connection string | Required |
| \`API_KEY\` | External API key | Required |

## 📖 API Documentation

Full API documentation is available at \`/docs\` when running the server.

## 🧪 Testing

Run the test suite:
\`\`\`bash
npm test
npm run test:coverage
\`\`\`

## 🚢 Deployment

### Docker

\`\`\`bash
docker build -t my-awesome-project .
docker run -p 3000:3000 my-awesome-project
\`\`\`

### Manual Deployment

\`\`\`bash
npm run build
npm start
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **John Doe** - *Initial work* - [johndoe](https://github.com/johndoe)

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by best practices from the community
- Built with modern technologies`
        },
        json: {
            source: `{
    "name": "my-app",
    "version": "1.0.0",
    "scripts": {
        "start": "node index.js"
    }
}`,
            destination: `{
    "name": "my-awesome-app",
    "version": "2.1.0",
    "description": "An awesome application with modern features",
    "main": "dist/index.js",
    "scripts": {
        "start": "node dist/index.js",
        "dev": "nodemon src/index.js",
        "build": "babel src -d dist",
        "test": "jest",
        "test:watch": "jest --watch",
        "test:coverage": "jest --coverage",
        "lint": "eslint src/",
        "lint:fix": "eslint src/ --fix",
        "deploy": "npm run build && npm run deploy:prod"
    },
    "keywords": [
        "node",
        "javascript",
        "api",
        "express",
        "modern"
    ],
    "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "url": "https://johndoe.dev"
    },
    "license": "MIT",
    "repository": {
        "type": "git",
        "url": "https://github.com/johndoe/my-awesome-app.git"
    },
    "bugs": {
        "url": "https://github.com/johndoe/my-awesome-app/issues"
    },
    "homepage": "https://github.com/johndoe/my-awesome-app#readme",
    "dependencies": {
        "express": "^4.18.2",
        "cors": "^2.8.5",
        "helmet": "^7.0.0",
        "dotenv": "^16.3.1",
        "mongoose": "^7.5.0",
        "bcryptjs": "^2.4.3",
        "jsonwebtoken": "^9.0.2"
    },
    "devDependencies": {
        "@babel/cli": "^7.22.0",
        "@babel/core": "^7.22.0",
        "@babel/preset-env": "^7.22.0",
        "eslint": "^8.45.0",
        "jest": "^29.6.0",
        "nodemon": "^3.0.1",
        "supertest": "^6.3.3"
    },
    "engines": {
        "node": ">=16.0.0",
        "npm": ">=8.0.0"
    }
}`
        }
    };

    // Track last selected example to ensure variety
    let lastSelectedExample = null;

    // Load example button
    if (loadExampleBtn) {
        loadExampleBtn.addEventListener('click', () => {
            const exampleKeys = Object.keys(examples);
            let randomExample;
            
            // If we have multiple examples, ensure we don't repeat the last one
            if (exampleKeys.length > 1 && lastSelectedExample) {
                const availableKeys = exampleKeys.filter(key => key !== lastSelectedExample);
                const randomKey = availableKeys[Math.floor(Math.random() * availableKeys.length)];
                randomExample = examples[randomKey];
                lastSelectedExample = randomKey;
            } else {
                // First time or only one example
                const randomKey = exampleKeys[Math.floor(Math.random() * exampleKeys.length)];
                randomExample = examples[randomKey];
                lastSelectedExample = randomKey;
            }
            
            if (sourceInput) sourceInput.value = randomExample.source;
            if (destInput) destInput.value = randomExample.destination;
            
            // Automatically generate diff after loading example - immediate execution
                generateDiff();
                applySyntaxHighlighting();
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
            generateDiff(); // Remove debounce for immediate diff generation
            debouncedHighlight();
        });
    }
    
    if (destInput) {
        destInput.addEventListener('input', () => {
            generateDiff(); // Remove debounce for immediate diff generation
            debouncedHighlight();
        });
    }

    if (algorithmSelect) {
        algorithmSelect.addEventListener('change', generateDiff);
    }

    if (formatSelect) {
        formatSelect.addEventListener('change', () => {
            const selectedFormat = formatSelect.value;
            console.log(`🔄 Format changed to: ${selectedFormat}`);
            generateDiff();
        });
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

        // Use real algorithm implementation - immediate execution
            console.log(`🚀 Starting ${algorithm} algorithm...`);
            const result = generateRealDiff(source, destination, algorithm, format);
            
            // Store the actual timing for live display - NO PARSING, keep raw precision
            lastDiffTime = result.stats.createTime; // Raw number, no conversion
            isGenerating = false;
            
            console.log(`✅ ${algorithm} completed in ${lastDiffTime}ms (raw: ${result.stats.createTime})`);
            
            // Update performance displays immediately
            updatePerformanceDisplay();
            
            displayDiffResult(result);
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
        } else if (format === 'terminal') {
            const asciiContent = MultiLineDiff.generateASCIIDiff(diffResult, source);
            diffContent = colorTerminalDiff(asciiContent);
        } else if (format === 'base64') {
            diffContent = generateBase64FromDiffResult(diffResult, actualCreateTime);
        } else if (format === 'json') {
            diffContent = generateJSONFromDiffResult(diffResult, actualCreateTime);
        }

        return {
            content: diffContent,
            stats: stats,
            diffResult: diffResult
        };
    }

    function generateJSONFromDiffResult(diffResult, timing) {
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
            "tim": timing
        };

        return JSON.stringify({
            "operations": operations,
            "metadata": metadata
        }, null, 2);
    }

    function generateBase64FromDiffResult(diffResult, timing) {
        const jsonDiff = generateJSONFromDiffResult(diffResult, timing);
        return btoa(jsonDiff);
    }

    // Function to color terminal diff lines
    function colorTerminalDiff(content) {
        console.log(`🎨 colorTerminalDiff called with ${content.split('\n').length} lines`);
        const lines = content.split('\n');
        
        const coloredLines = lines.map((line, index) => {
            const isFirstLine = index === 0;
            const isLastLine = index === lines.length - 1;
            
            // Calculate padding based on position
            let topPadding = isFirstLine ? '12px' : '2px';
            let bottomPadding = isLastLine ? '12px' : '2px';
            let padding = `${topPadding} 8px ${bottomPadding} 18px`;
            
            if (line.startsWith('📎 ')) {
                // Retain lines - lighter gray with more opaque ghost gray background gradient
                return `<div style="color: #bbbbbb; background: linear-gradient(to right, rgba(187,187,187,0.25), transparent); padding: ${padding};">${escapeHtml(line)}</div>`;
            } else if (line.startsWith('❌ ')) {
                // Delete lines - more saturated red with ghost red background gradient
                return `<div style="color: #ff3333; background: linear-gradient(to right, rgba(255,51,51,0.15), transparent); padding: ${padding};">${escapeHtml(line)}</div>`;
            } else if (line.startsWith('✅ ')) {
                // Insert lines - slightly less bright green with ghost green background gradient
                return `<div style="color: #55cc55; background: linear-gradient(to right, rgba(85,204,85,0.15), transparent); padding: ${padding};">${escapeHtml(line)}</div>`;
            } else {
                // Other lines - default color
                return `<div style="padding: ${padding};">${escapeHtml(line)}</div>`;
            }
        });
        
        const result = coloredLines.join('');
        console.log(`✅ Terminal format applied with colored lines`);
        return result;
    }

    // Remove old simulation functions - now using real algorithms

    function displayDiffResult(result) {
        if (!diffOutput) return;
        
        // Display the diff content
        const format = formatSelect?.value || 'ai';
        console.log(`🎨 Displaying diff result with format: ${format}`);
        
        // Remove any previous format classes
        diffOutput.classList.remove('terminal-format', 'ai-format', 'base64-format', 'json-format');
        
        if (format === 'ai') {
            // For AI format, escape HTML for syntax highlighting
            diffOutput.classList.add('ai-format');
            diffOutput.innerHTML = `
                <pre class="ascii-diff"><code class="language-swift">${escapeHtml(result.content)}</code></pre>
            `;
            
            // Apply syntax highlighting for ASCII diff (AI format)
            highlightASCIIDiff(diffOutput.querySelector('.ascii-diff'));
            
            // Apply Prism.js syntax highlighting for AI format
            if (window.Prism) {
                Prism.highlightElement(diffOutput.querySelector('code'));
            }
        } else if (format === 'terminal') {
            console.log(`💻 Displaying terminal format...`);
            diffOutput.classList.add('terminal-format');
            diffOutput.innerHTML = result.content;
            console.log(`✅ Terminal format displayed successfully`);
        } else if (format === 'base64') {
            // For base64 format, add text wrapping
            diffOutput.classList.add('base64-format');
            diffOutput.innerHTML = `
                <pre class="base64-output"><code>${escapeHtml(result.content)}</code></pre>
            `;
        } else {
            // For JSON format
            diffOutput.classList.add('json-format');
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
            megatron: '🧠',
            zoom: '🔍'
        };

        // Create live timing display with real precision
        const preciseCreateTime = Math.max(stats.createTime, 0.000).toFixed(3);
        
        // Check screen width to conditionally render badges
        const windowWidth = window.innerWidth;
        
        let algorithmBadge = '';
        let opsBadge = '';
        
        if (windowWidth > 1371 || windowWidth <= 1024) {
            // Show all 4 badges for large screens (>1371px) and small screens (<=1024px)
            algorithmBadge = `
                <span class="stat-badge algorithm-badge">
                    <span class="badge-emoji">${algorithmEmojis[stats.algorithm] || '🔧'}</span> 
                    ${stats.algorithm}
                </span>
            `;
            opsBadge = `<span class="stat-badge ops-badge"><span class="badge-emoji">📊</span> ${stats.operations} ops</span>`;
        } else if (windowWidth <= 1371 && windowWidth > 1176) {
            // Show 3 badges for medium screens (1371px down to 1177px)
            opsBadge = `<span class="stat-badge ops-badge"><span class="badge-emoji">📊</span> ${stats.operations} ops</span>`;
        }
        // For 1176px down to 1025px, show only timing and success (no ops or algorithm badges)
        
        outputStats.innerHTML = `
            <div class="stats-grid">
                ${opsBadge}
                ${algorithmBadge}
                <span class="stat-badge timing-badge live-timing"><span class="badge-emoji">⚡</span> ${preciseCreateTime}ms</span>
                <span class="stat-badge success-badge"><span class="badge-emoji">✅</span> ${stats.accuracy}</span>
            </div>
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
        
        // Reset timing displays with real precision
        lastDiffTime = 0;
        
        if (outputStats) {
            // Get current algorithm selection
            const currentAlgorithm = algorithmSelect?.value || 'optimus';
            const algorithmEmojis = {
                flash: '⚡',
                optimus: '🤖',
                megatron: '🧠',
                zoom: '🔍'
            };
            
            // Check screen width to conditionally render badges
            const windowWidth = window.innerWidth;
            
            let algorithmBadge = '';
            let opsBadge = '';
            
            if (windowWidth > 1371 || windowWidth <= 1024) {
                // Show all 4 badges for large screens (>1371px) and small screens (<=1024px)
                algorithmBadge = `
                    <span class="stat-badge algorithm-badge">
                        <span class="badge-emoji">${algorithmEmojis[currentAlgorithm] || '🔧'}</span> 
                        ${currentAlgorithm}
                    </span>
                `;
                opsBadge = `<span class="stat-badge ops-badge"><span class="badge-emoji">📊</span> 0 ops</span>`;
            } else if (windowWidth <= 1371 && windowWidth > 1176) {
                // Show 3 badges for medium screens (1371px down to 1177px)
                opsBadge = `<span class="stat-badge ops-badge"><span class="badge-emoji">📊</span> 0 ops</span>`;
            }
            // For 1176px down to 1025px, show only timing and success (no ops or algorithm badges)
            
            outputStats.innerHTML = `
                <div class="stats-grid">
                    ${opsBadge}
                    ${algorithmBadge}
                    <span class="stat-badge timing-badge"><span class="badge-emoji">⚡</span> 0.000ms</span>
                    <span class="stat-badge success-badge"><span class="badge-emoji">✅</span> 100%</span>
                </div>
            `;
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
        
        // JavaScript/React detection
        if (code.includes('function ') || code.includes('const ') || code.includes('let ') || code.includes('var ') || code.includes('=>') || code.includes('useState') || code.includes('React')) {
            return 'javascript';
        }
        
        // CSS detection
        if (code.includes('{') && code.includes('}') && (code.includes('padding:') || code.includes('margin:') || code.includes('background:') || code.includes('border:'))) {
            return 'css';
        }
        
        // HTML detection
        if (code.includes('<!DOCTYPE') || code.includes('<html') || code.includes('<head>') || code.includes('<body>')) {
            return 'html';
        }
        
        // SQL detection
        if (code.includes('SELECT') || code.includes('INSERT') || code.includes('UPDATE') || code.includes('DELETE') || code.includes('FROM') || code.includes('WHERE')) {
            return 'sql';
        }
        
        // Java detection
        if (code.includes('public class') || code.includes('private ') || code.includes('public ') && code.includes('{') && code.includes('(')) {
            return 'java';
        }
        
        // Rust detection
        if (code.includes('struct ') || code.includes('impl ') || code.includes('fn ') || code.includes('use std::')) {
            return 'rust';
        }
        
        // Go detection
        if (code.includes('package ') || code.includes('func ') && code.includes('import') || code.includes('type ') && code.includes('struct')) {
            return 'go';
        }
        
        // JSON detection
        if (code.trim().startsWith('{') && code.trim().endsWith('}') && (code.includes('"name"') || code.includes('"version"') || code.includes('"scripts"'))) {
            return 'json';
        }
        
        // Markdown detection
        if (code.includes('# ') || code.includes('## ') || code.includes('```') || code.includes('[![')) {
            return 'markdown';
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

    // Add resize event listener to update layout
    window.addEventListener('resize', () => {
        // Re-render stats when window is resized
        if (outputStats && outputStats.innerHTML.includes('stats-grid')) {
            // Check if we're in a generated diff state or placeholder state
            const hasRealData = outputStats.innerHTML.includes('live-timing');
            if (hasRealData) {
                // Re-trigger the last diff generation if there was real data
                const source = sourceInput?.value || '';
                const destination = destInput?.value || '';
                if (source.trim() && destination.trim()) {
                    generateDiff();
                } else {
                    showPlaceholder();
                }
            } else {
                showPlaceholder();
            }
        }
    });

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
        // Remove existing copy button if present
        const existingCopyBtn = diffOutput.querySelector('.copy-btn');
        if (existingCopyBtn) {
            existingCopyBtn.remove();
        }
        
        // Also check parent panel for copy button (for terminal format)
        const parentPanel = diffOutput.closest('.demo-panel');
        const existingParentCopyBtn = parentPanel?.querySelector('.copy-btn');
        if (existingParentCopyBtn) {
            existingParentCopyBtn.remove();
        }
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
        `;
        
        copyBtn.addEventListener('click', () => {
            // Get content based on format
            let content = '';
            const format = formatSelect?.value || 'ai';
            
            if (format === 'terminal') {
                // For terminal format, extract text content from the styled divs
                const terminalDivs = diffOutput.querySelectorAll('div');
                content = Array.from(terminalDivs).map(div => div.textContent).join('\n');
            } else {
                // For other formats, get text content from pre element
                content = diffOutput.querySelector('pre')?.textContent || diffOutput.textContent || '';
            }
            
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

        if (diffOutput) {
            const format = formatSelect?.value || 'ai';
            
            if (format === 'terminal') {
                // For terminal format, append to parent panel so it doesn't scroll
                const parentPanel = diffOutput.closest('.demo-panel');
                if (parentPanel) {
                    parentPanel.classList.add('demo-output-positioned');
                    parentPanel.appendChild(copyBtn);
                }
            } else {
                // For other formats, append to diff output as before
                diffOutput.classList.add('demo-output-positioned');
                diffOutput.appendChild(copyBtn);
            }
        }
    }

    // Add copy button when diff is generated - ensure it works for all formats
    const originalDisplayDiffResult = displayDiffResult;
    displayDiffResult = function(result) {
        originalDisplayDiffResult(result);
        // Always add copy button for any format that has content
        if (result && result.content) {
            addCopyButton();
        }
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