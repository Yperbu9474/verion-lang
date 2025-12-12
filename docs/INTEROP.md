# Verion Language Interoperability Guide

## 🌉 Working with Python and Node.js

Verion Language is designed to work seamlessly with both Python and Node.js, acting as a bridge between both ecosystems.

---

## 📦 Node.js Integration

### Using npm Packages in VL

VL can use any npm package directly:

```vl
# Install package
# Run: vl pkg add axios

# Use in your code
require "axios" as axios

async define getData():
    set response to await axios.get("https://api.example.com/data")
    return response.data
end
```

### Using VL from Node.js

**Step 1: Create VL module with exports**

```vl
# mymodule.vl
define greet(name):
    return "Hello, " plus name
end

define add(a, b):
    return a plus b
end

export define greet
export define add
```

**Step 2: Build the module**

```bash
vl build mymodule.vl
```

**Step 3: Import in Node.js**

```javascript
// In your Node.js file
import { greet, add } from './dist/mymodule.mjs';

console.log(greet("Alice"));  // Hello, Alice
console.log(add(5, 3));       // 8
```

**Alternative: Execute VL from Node.js**

```javascript
const { execSync } = require('child_process');

// Run VL file
const output = execSync('vl run myfile.vl', { encoding: 'utf8' });
console.log(output);
```

---

## 🐍 Python Integration

### Calling Python from VL

**Method 1: Inline Python Code**

```vl
require "child_process" as child_process
require "util" as util

async define runPython(code):
    set exec to util.promisify(child_process.exec)
    set command to "python -c \"" plus code plus "\""
    set result to await exec(command)
    return result.stdout.trim()
end

async define main():
    # Run Python calculation
    set pythonCode to "import math; print(math.sqrt(144))"
    set result to await runPython(pythonCode)
    write "Square root: " plus result
end

main()
```

**Method 2: Python Scripts**

```vl
require "child_process" as child_process
require "util" as util

async define runPythonFile(filePath):
    set exec to util.promisify(child_process.exec)
    set command to "python " plus filePath
    set result to await exec(command)
    return result.stdout.trim()
end

async define main():
    set output to await runPythonFile("myscript.py")
    write output
end

main()
```

**Method 3: Python with JSON Data Exchange**

```vl
require "child_process" as child_process
require "util" as util

async define callPython(data):
    set exec to util.promisify(child_process.exec)
    set jsonData to JSON.stringify(data)
    
    # Python processes JSON and returns JSON
    set pythonCode to "import json; data = json.loads('" plus jsonData plus "'); result = [x * 2 for x in data]; print(json.dumps(result))"
    set command to "python -c \"" plus pythonCode plus "\""
    
    set result to await exec(command)
    return JSON.parse(result.stdout.trim())
end

async define main():
    set numbers to [1, 2, 3, 4, 5]
    set doubled to await callPython(numbers)
    write doubled  # [2, 4, 6, 8, 10]
end

main()
```

### Using Python Modules from VL

**Python module (helper.py):**

```python
#!/usr/bin/env python3
import json
import sys

def calculate(operation, a, b):
    operations = {
        'add': a + b,
        'multiply': a * b,
        'power': a ** b
    }
    return operations[operation]

if __name__ == "__main__":
    command = sys.argv[1]
    if command == "calculate":
        op = sys.argv[2]
        a = float(sys.argv[3])
        b = float(sys.argv[4])
        print(json.dumps(calculate(op, a, b)))
```

**VL code:**

```vl
require "child_process" as child_process
require "util" as util

async define callPythonModule(command, args):
    set exec to util.promisify(child_process.exec)
    set cmd to "python helper.py " plus command plus " " plus args
    set result to await exec(cmd)
    return JSON.parse(result.stdout.trim())
end

async define main():
    set result to await callPythonModule("calculate", "multiply 7 6")
    write "7 * 6 = " plus result  # 42
end

main()
```

---

## 🔄 Hybrid Applications

### Example: Web Server Using Both Python and Node.js

```vl
require "express" as express
require "child_process" as child_process
require "util" as util

set app to express()
app.use(express.json())

# Helper to run Python
async define runPython(code):
    set exec to util.promisify(child_process.exec)
    set command to "python -c \"" plus code plus "\""
    set result to await exec(command)
    return result.stdout.trim()
end

# Node.js endpoint
app.get("/node/process", define(req, res):
    set data to [1, 2, 3, 4, 5]
    set processed to []
    for item in data:
        processed.push(item multiply 2)
    end
    res.json({ result: processed, by: "Node.js" })
end)

# Python endpoint
app.get("/python/process", async define(req, res):
    set pythonCode to "data = [1,2,3,4,5]; print([x*2 for x in data])"
    set result to await runPython(pythonCode)
    res.json({ result: result, by: "Python" })
end)

app.listen(3000, define():
    write "Hybrid server running on port 3000"
end)
```

---

## 🎯 Best Practices

### 1. Data Exchange Format

Always use JSON for data exchange between VL, Python, and Node.js:

```vl
# VL → Python
set data to { name: "Alice", age: 30 }
set jsonData to JSON.stringify(data)

# Python → VL
set result to JSON.parse(pythonOutput)
```

### 2. Error Handling

Always wrap external calls in try-catch:

```vl
try:
    set result to await runPython(code)
    write result
catch error:
    write "Error: " plus error.message
end
```

### 3. Module Organization

**Structure for hybrid projects:**

```
my-project/
├── vl/                  # Verion Language files
│   ├── main.vl
│   └── helpers.vl
├── python/              # Python modules
│   ├── calculator.py
│   └── data_processing.py
├── node/                # Node.js files
│   ├── server.js
│   └── utils.js
├── dist/                # Transpiled VL code
└── package.json
```

### 4. Performance Considerations

- **Spawn overhead**: Each Python call spawns a new process
- **Use Python for**: Heavy computation, data science, machine learning
- **Use Node.js for**: I/O operations, web servers, async operations
- **Use VL for**: Glue code, business logic, readable scripts

### 5. Environment Setup

Ensure both Python and Node.js are in PATH:

```bash
# Check installations
python --version
node --version
vl --version
```

---

## 📋 Common Patterns

### Pattern 1: Python for ML, Node for API

```vl
require "express" as express
require "child_process" as child_process
require "util" as util

set app to express()

async define predict(data):
    # Use Python ML model
    set exec to util.promisify(child_process.exec)
    set jsonData to JSON.stringify(data)
    set pythonCode to "import json; from model import predict; data = json.loads('" plus jsonData plus "'); print(json.dumps(predict(data)))"
    set result to await exec("python -c \"" plus pythonCode plus "\"")
    return JSON.parse(result.stdout.trim())
end

app.post("/predict", async define(req, res):
    set prediction to await predict(req.body)
    res.json(prediction)
end)
```

### Pattern 2: Node for I/O, Python for Processing

```vl
require "fs" as fs
require "child_process" as child_process
require "util" as util

async define processFile(filePath):
    # Read with Node.js
    set content to fs.readFileSync(filePath, "utf8")
    
    # Process with Python
    set exec to util.promisify(child_process.exec)
    set pythonCode to "text = '" plus content plus "'; print(text.upper())"
    set result to await exec("python -c \"" plus pythonCode plus "\"")
    
    # Write with Node.js
    fs.writeFileSync("output.txt", result.stdout.trim())
end
```

### Pattern 3: VL Module in Both Ecosystems

```vl
# analytics.vl
define calculateStats(numbers):
    set total to 0
    for num in numbers:
        set total to total plus num
    end
    
    set avg to total divide numbers.length
    return { sum: total, average: avg }
end

export define calculateStats
```

**Use in Node.js:**
```javascript
import { calculateStats } from './dist/analytics.mjs';
const stats = calculateStats([1, 2, 3, 4, 5]);
```

**Use in Python (via CLI):**
```python
import subprocess
import json

result = subprocess.run(['vl', 'run', 'analytics.vl'], capture_output=True)
data = json.loads(result.stdout)
```

---

## 🚀 Examples

Check out these working examples in the `examples/` directory:

- `python-interop.vl` - Python integration examples
- `hybrid-app.vl` - Web server using both Python and Node.js
- `python-helper.py` - Reusable Python module
- `use-python-module.vl` - Calling Python modules from VL
- `node-use-vl.js` - Using VL from Node.js
- `vl-module.vl` - Exportable VL module

---

## 💡 Tips

1. **Start simple**: Begin with basic Python calls before complex data exchange
2. **Test separately**: Verify Python and Node.js code work independently first
3. **Use type hints**: Document expected data types in comments
4. **Version control**: Track Python, Node, and VL versions in project
5. **Consider alternatives**: For tight integration, consider native addons

---

**You now have the power of Python's data science capabilities AND Node.js's async I/O, all with VL's readable syntax!** 🎉
