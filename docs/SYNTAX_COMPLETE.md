# Verion Language - Complete Syntax Guide

Welcome to Verion Language! A modern, intuitive programming language that combines the simplicity of Python with the power of Node.js.

## Table of Contents
1. [Basic Syntax](#basic-syntax)
2. [Data Types](#data-types)
3. [Operators](#operators)
4. [Control Flow](#control-flow)
5. [Functions](#functions)
6. [Classes](#classes)
7. [Imports & Exports](#imports--exports)
8. [Async/Await](#asyncawait)
9. [Error Handling](#error-handling)
10. [Advanced Features](#advanced-features)

## Basic Syntax

### Comments
```vl
# This is a single-line comment
```

### Output
```vl
write "Hello, World!"
print "Hello, World!"  # Alias for write
```

### Variables
```vl
set x to 5
set name to "Alice"
set isActive to true
set empty to null
```

## Data Types

### Primitives
- **Numbers**: `42`, `3.14`, `-10`
- **Strings**: `"hello"`, `'world'`
- **Booleans**: `true`, `false`
- **Null**: `null`, `none` (alias)

### Arrays
```vl
set numbers to [1, 2, 3, 4, 5]
set mixed to ["hello", 42, true, null]
set names to ["Alice", "Bob", "Charlie"]
```

### Objects (JavaScript style)
```vl
set user to {
    name: "Alice",
    age: 30,
    email: "alice@example.com"
}

# Access properties
write user.name
write user["age"]
```

## Operators

### Arithmetic Operators
| VL Syntax | JavaScript | Description |
|-----------|------------|-------------|
| `plus` | `+` | Addition |
| `minus` | `-` | Subtraction |
| `multiply` | `*` | Multiplication |
| `divide` | `/` | Division |

**Examples:**
```vl
set result to 5 plus 3        # 8
set diff to 10 minus 2         # 8
set product to 4 multiply 5    # 20
set quotient to 20 divide 4    # 5
```

### Comparison Operators
| VL Syntax | JavaScript | Description |
|-----------|------------|-------------|
| `is greater than` | `>` | Greater than |
| `is less than` | `<` | Less than |
| `is equals` | `===` | Equal to |

**Examples:**
```vl
if x is greater than 5:
    write "x is big"
end

if age is less than 18:
    write "Minor"
end

if name is equals "Alice":
    write "Hello Alice!"
end
```

### Logical Operators
| VL Syntax | JavaScript | Description |
|-----------|------------|-------------|
| `and` | `&&` | Logical AND |
| `or` | `||` | Logical OR |
| `not` | `!` | Logical NOT |

**Examples:**
```vl
if age is greater than 18 and hasLicense is equals true:
    write "Can drive"
end

if isWeekend is equals true or isHoliday is equals true:
    write "Day off!"
end
```

## Control Flow

### If Statements
```vl
# Simple if
if condition:
    # code
end

# If-else
if condition:
    # code
else:
    # other code
end

# If-elif-else
if score is greater than 90:
    write "A"
elif score is greater than 80:
    write "B"
elif score is greater than 70:
    write "C"
else:
    write "F"
end
```

### Loops

#### Repeat Loop (Fixed iterations)
```vl
repeat 5 times:
    write "Hello"
end

set count to 10
repeat count times:
    write "Counting"
end
```

#### While Loop
```vl
set i to 0
while i is less than 5:
    write i
    set i to i plus 1
end
```

#### For Loop (Iteration)
```vl
set fruits to ["apple", "banana", "orange"]

for fruit in fruits:
    write fruit
end

# With numbers
set numbers to [1, 2, 3, 4, 5]
for num in numbers:
    write num
end
```

### Break and Continue
```vl
# Break - exit loop
for i in numbers:
    if i is equals 3:
        break
    end
    write i
end

# Continue - skip to next iteration
for i in numbers:
    if i is equals 3:
        continue
    end
    write i
end
```

## Functions

### Basic Function Definition
```vl
define greet(name):
    write "Hello, "
    write name
end

greet("Alice")
```

**Alias:** You can also use `function` instead of `define`:
```vl
function greet(name):
    write "Hello, " plus name
end
```

### Functions with Return Values
```vl
define add(a, b):
    return a plus b
end

set sum to add(5, 3)
write sum  # 8

define multiply(x, y):
    set result to x multiply y
    return result
end
```

### Multiple Parameters
```vl
define createUser(name, age, email):
    set user to {
        name: name,
        age: age,
        email: email
    }
    return user
end

set newUser to createUser("Bob", 25, "bob@example.com")
```

### Async Functions
```vl
async define fetchData(url):
    set response to await fetch(url)
    set data to await response.json()
    return data
end

# Call async function
async define main():
    set result to await fetchData("https://api.example.com/data")
    write result
end
```

## Classes

### Class Definition
```vl
class Person:
    define constructor(name, age):
        set this.name to name
        set this.age to age
    end
    
    define greet():
        write "Hello, my name is " plus this.name
    end
    
    define birthday():
        set this.age to this.age plus 1
        write "Happy birthday! Now " plus this.age
    end
end
```

### Creating Instances
```vl
set person1 to new Person("Alice", 30)
person1.greet()
person1.birthday()

# Access properties
write person1.name
write person1.age
```

### Class with Async Methods
```vl
class ApiClient:
    define constructor(baseUrl):
        set this.baseUrl to baseUrl
    end
    
    async define get(endpoint):
        set url to this.baseUrl plus endpoint
        set response to await fetch(url)
        return await response.json()
    end
    
    async define post(endpoint, data):
        set url to this.baseUrl plus endpoint
        set options to {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }
        set response to await fetch(url, options)
        return await response.json()
    end
end

# Usage
set api to new ApiClient("https://api.example.com")
set users to await api.get("/users")
```

## Imports & Exports

### Import (ES6 Style)
```vl
# Default import
import express from "express"

# Named imports
import { Client, GatewayIntentBits } from "discord.js"

# Multiple named imports
import { readFile, writeFile, existsSync } from "fs"
```

### Require (CommonJS Style)
```vl
# Basic require with alias
require "express" as express

# Require built-in modules
require "fs" as fs
require "path" as path

# Require local files
require "./utils" as utils
require "../config.js" as config
```

### Exports
```vl
# Export function
export define calculateTax(amount):
    return amount multiply 0.1
end

# Export async function
export async define fetchUserData(userId):
    set response to await fetch("/api/users/" plus userId)
    return await response.json()
end

# Export class
export class Calculator:
    define add(a, b):
        return a plus b
    end
    
    define subtract(a, b):
        return a minus b
    end
end
```

## Async/Await

### Async Functions
```vl
async define downloadFile(url):
    write "Downloading from " plus url
    
    try:
        set response to await fetch(url)
        set data to await response.text()
        write "Download complete!"
        return data
    catch error:
        write "Download failed: " plus error.message
        throw error
    end
end
```

### Await Expressions
```vl
async define processUserData(userId):
    # Await function calls
    set user to await getUser(userId)
    set posts to await getUserPosts(user.id)
    
    # Process data
    write "Processing " plus posts.length plus " posts"
    
    # Await in loops
    for post in posts:
        set comments to await getComments(post.id)
        post.commentCount to comments.length
    end
    
    return { user, posts }
end
```

### Parallel Async Operations
```vl
async define fetchAllData():
    # All requests start simultaneously
    set userPromise to getUser(1)
    set postsPromise to getPosts()
    set commentsPromise to getComments()
    
    # Wait for all to complete
    set user to await userPromise
    set posts to await postsPromise
    set comments to await commentsPromise
    
    return { user, posts, comments }
end
```

## Error Handling

### Try-Catch
```vl
try:
    set result to riskyOperation()
    write result
catch error:
    write "Error occurred: " plus error.message
end
```

### Try-Catch-Finally
```vl
try:
    set file to fs.readFileSync("data.txt", "utf8")
    write "File content: " plus file
catch error:
    write "Failed to read file: " plus error.message
finally:
    write "File operation completed"
end
```

### Async Error Handling
```vl
async define fetchData(url):
    try:
        set response to await fetch(url)
        
        if response.status is not equals 200:
            throw new Error("HTTP error: " plus response.status)
        end
        
        set data to await response.json()
        return data
    catch error:
        write "Fetch failed: " plus error.message
        return null
    end
end
```

### Throwing Custom Errors
```vl
define validateAge(age):
    if age is less than 0:
        throw new Error("Age cannot be negative")
    end
    
    if age is greater than 150:
        throw new Error("Age is unrealistic")
    end
    
    return true
end

try:
    validateAge(-5)
catch error:
    write error.message  # "Age cannot be negative"
end
```

## Advanced Features

### Working with Arrays
```vl
set numbers to [1, 2, 3, 4, 5]

# Access elements
write numbers[0]  # 1
write numbers[numbers.length minus 1]  # 5

# Modify arrays
numbers.push(6)
set last to numbers.pop()
set first to numbers.shift()
numbers.unshift(0)

# Array methods
set doubled to numbers.map(define(n): return n multiply 2 end)
set evens to numbers.filter(define(n): return n % 2 is equals 0 end)
set sum to numbers.reduce(define(acc, n): return acc plus n end, 0)
```

### Working with Objects
```vl
set user to {
    name: "Alice",
    age: 30,
    email: "alice@example.com",
    address: {
        city: "New York",
        country: "USA"
    }
}

# Access properties
write user.name
write user["age"]
write user.address.city

# Modify properties
set user.age to 31
set user["email"] to "newemail@example.com"

# Add properties
set user.phone to "555-1234"

# Object methods
set keys to Object.keys(user)
set values to Object.values(user)
```

### String Operations
```vl
set text to "Hello World"

# String methods
set upper to text.toUpperCase()  # "HELLO WORLD"
set lower to text.toLowerCase()  # "hello world"
set parts to text.split(" ")     # ["Hello", "World"]
set sub to text.substring(0, 5)  # "Hello"
set replaced to text.replace("World", "VL")  # "Hello VL"

# String properties
set len to text.length  # 11

# Template literals (using JS syntax)
set name to "Alice"
set greeting to `Hello, ${name}!`
```

### JSON Operations
```vl
# Parse JSON string
set jsonString to '{"name":"Alice","age":30}'
set obj to JSON.parse(jsonString)
write obj.name  # Alice

# Convert to JSON string
set user to { name: "Bob", age: 25 }
set json to JSON.stringify(user)
write json  # {"name":"Bob","age":25}

# Pretty print JSON
set prettyJson to JSON.stringify(user, null, 2)
```

### File System Operations (with Node.js)
```vl
require "fs" as fs

# Read file
set content to fs.readFileSync("file.txt", "utf8")

# Write file
fs.writeFileSync("output.txt", "Hello, World!")

# Async file operations
async define readFileAsync(filename):
    set content to await fs.promises.readFile(filename, "utf8")
    return content
end
```

### HTTP Requests
```vl
# Using fetch (modern)
async define makeRequest():
    set response to await fetch("https://api.example.com/data")
    set data to await response.json()
    return data
end

# POST request
async define sendData(payload):
    set options to {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    }
    
    set response to await fetch("https://api.example.com/users", options)
    set result to await response.json()
    return result
end
```

## Common Patterns

### Database Connection (Example with any DB library)
```vl
require "mongodb" as mongodb

async define connectDB():
    set client to new mongodb.MongoClient("mongodb://localhost:27017")
    
    try:
        await client.connect()
        write "Connected to database"
        set db to client.db("myapp")
        return db
    catch error:
        write "Database connection failed: " plus error.message
        throw error
    end
end
```

### Express.js Server Pattern
```vl
require "express" as express

set app to express()
app.use(express.json())

# Routes
app.get("/", define(req, res):
    res.json({ message: "Welcome to VL API" })
end)

app.post("/api/data", async define(req, res):
    try:
        set data to req.body
        set result to await processData(data)
        res.json({ success: true, data: result })
    catch error:
        res.status(500).json({ success: false, error: error.message })
    end
end)

# Start server
set PORT to 3000
app.listen(PORT, define():
    write "Server running on port " plus PORT
end)
```

### Discord Bot Pattern
```vl
import { Client, GatewayIntentBits } from "discord.js"

set client to new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.on("ready", define():
    write "Bot is online!"
end)

client.on("messageCreate", async define(message):
    if message.author.bot:
        return
    end
    
    if message.content is equals "!ping":
        await message.reply("Pong!")
    end
end)

client.login("YOUR_TOKEN_HERE")
```

## Best Practices

### 1. Use Descriptive Variable Names
```vl
# Good
set userEmail to "user@example.com"
set totalPrice to 99.99
set isAuthenticated to true

# Avoid
set e to "user@example.com"
set p to 99.99
set flag to true
```

### 2. Handle Errors Properly
```vl
async define getUserData(userId):
    try:
        set user to await fetchUser(userId)
        
        if not user:
            throw new Error("User not found")
        end
        
        return user
    catch error:
        write "Error fetching user: " plus error.message
        return null
    end
end
```

### 3. Use Async/Await for Async Operations
```vl
# Good
async define loadData():
    set data to await fetchData()
    set processed to await processData(data)
    return processed
end

# Avoid (unless you need promises)
define loadData():
    return fetchData().then(define(data):
        return processData(data)
    end)
end
```

### 4. Organize Code with Functions and Classes
```vl
# Group related functionality
class UserService:
    define constructor(db):
        set this.db to db
    end
    
    async define create(userData):
        # create user
    end
    
    async define findById(id):
        # find user
    end
    
    async define update(id, updates):
        # update user
    end
end
```

## Next Steps

- **[API Reference](api.md)** - Complete API documentation
- **[CLI Guide](cli.md)** - Command-line tools and usage
- **[Examples](../examples/)** - Real-world code examples
- **Discord Bot Tutorial** - Build a complete Discord bot
- **Web Server Tutorial** - Create a REST API with Express

## Quick Reference

| Feature | Syntax |
|---------|--------|
| Variable | `set name to value` |
| Function | `define name(params): ... end` |
| Async Function | `async define name(): ... end` |
| If Statement | `if condition: ... end` |
| For Loop | `for item in list: ... end` |
| While Loop | `while condition: ... end` |
| Class | `class Name: ... end` |
| Import | `import module from "path"` |
| Require | `require "path" as name` |
| Try-Catch | `try: ... catch error: ... end` |
| Await | `await expression` |
| Return | `return value` |

---

**Happy Coding with Verion Language! 🚀**
