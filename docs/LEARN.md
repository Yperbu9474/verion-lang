# Learn Verion Language - Complete Tutorial

Welcome to Verion Language! This guide will take you from zero to building real applications.

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Your First Program](#your-first-program)
4. [Basic Concepts](#basic-concepts)
5. [Functions](#functions)
6. [Classes](#classes)
7. [Async Programming](#async-programming)
8. [Working with Files](#working-with-files)
9. [Building a Discord Bot](#building-a-discord-bot)
10. [Building a Web Server](#building-a-web-server)
11. [Building a REST API](#building-a-rest-api)

---

## Introduction

Verion Language (VL) is designed to be:
- **Simple**: English-like syntax that's easy to read and write
- **Powerful**: Full Node.js integration for real-world applications
- **Modern**: Async/await, classes, and ES6 features built-in
- **Versatile**: Build bots, web servers, APIs, and command-line tools

## Installation

```bash
# Navigate to the verion-lang directory
cd verion-lang

# Install dependencies
npm install

# Link globally (optional)
npm link

# Verify installation
vl help
```

## Your First Program

### Step 1: Create a file

Create `hello.vl`:
```vl
write "Hello, Verion Language!"
```

### Step 2: Run it

```bash
vl run hello.vl
```

Output:
```
Hello, Verion Language!
```

Congratulations! You've written your first VL program! 🎉

## Basic Concepts

### Variables

Variables store data. Use `set` to create them:

```vl
set name to "Alice"
set age to 30
set isStudent to true
set grade to 95.5
```

### Data Types

```vl
# Numbers
set count to 42
set price to 19.99

# Strings
set message to "Hello"
set quote to 'Single quotes work too'

# Booleans
set isActive to true
set isDeleted to false

# Null
set empty to null

# Arrays
set numbers to [1, 2, 3, 4, 5]
set names to ["Alice", "Bob", "Charlie"]

# Objects
set user to {
    name: "Alice",
    age: 30,
    email: "alice@example.com"
}
```

### Output

```vl
write "Hello"        # Outputs: Hello
print 42             # print is an alias for write
write variable       # Print variable value
```

### Arithmetic

```vl
set x to 10
set y to 5

set sum to x plus y           # 15
set difference to x minus y    # 5
set product to x multiply y    # 50
set quotient to x divide y     # 2

write "Sum: " plus sum
```

### Comparisons

```vl
set age to 25

if age is greater than 18:
    write "Adult"
end

if age is less than 65:
    write "Not retired"
end

if age is equals 25:
    write "Exactly 25!"
end
```

### Logical Operators

```vl
set age to 25
set hasLicense to true

if age is greater than 18 and hasLicense is equals true:
    write "Can drive"
end

if age is less than 18 or hasLicense is equals false:
    write "Cannot drive"
end
```

## Control Flow

### If Statements

```vl
set score to 85

if score is greater than 90:
    write "Grade: A"
elif score is greater than 80:
    write "Grade: B"
elif score is greater than 70:
    write "Grade: C"
else:
    write "Grade: F"
end
```

### Loops

#### While Loop

```vl
set count to 0

while count is less than 5:
    write count
    set count to count plus 1
end
```

#### For Loop

```vl
set fruits to ["apple", "banana", "orange"]

for fruit in fruits:
    write "I like " plus fruit
end
```

#### Repeat Loop

```vl
repeat 3 times:
    write "Hello!"
end
```

### Break and Continue

```vl
# Break - exit loop early
for i in [1, 2, 3, 4, 5]:
    if i is equals 3:
        break
    end
    write i
end
# Output: 1, 2

# Continue - skip to next iteration
for i in [1, 2, 3, 4, 5]:
    if i is equals 3:
        continue
    end
    write i
end
# Output: 1, 2, 4, 5
```

## Functions

### Basic Functions

```vl
define greet(name):
    write "Hello, " plus name
end

greet("Alice")
greet("Bob")
```

### Functions with Return Values

```vl
define add(a, b):
    return a plus b
end

set result to add(5, 3)
write result  # 8

define multiply(x, y):
    set product to x multiply y
    return product
end

set answer to multiply(4, 7)
write answer  # 28
```

### Multiple Parameters

```vl
define createProfile(name, age, email):
    set profile to {
        name: name,
        age: age,
        email: email
    }
    return profile
end

set user to createProfile("Alice", 30, "alice@example.com")
write user.name
```

## Classes

### Basic Class

```vl
class Person:
    define constructor(name, age):
        set this.name to name
        set this.age to age
    end
    
    define introduce():
        write "Hi, I'm " plus this.name
        write "I'm " plus this.age plus " years old"
    end
    
    define birthday():
        set this.age to this.age plus 1
        write "Happy birthday! Now " plus this.age
    end
end

# Create instances
set person1 to new Person("Alice", 30)
set person2 to new Person("Bob", 25)

person1.introduce()
person2.birthday()
```

### Class with Multiple Methods

```vl
class BankAccount:
    define constructor(owner, balance):
        set this.owner to owner
        set this.balance to balance
    end
    
    define deposit(amount):
        set this.balance to this.balance plus amount
        write "Deposited: " plus amount
        write "New balance: " plus this.balance
    end
    
    define withdraw(amount):
        if amount is greater than this.balance:
            write "Insufficient funds!"
            return false
        end
        
        set this.balance to this.balance minus amount
        write "Withdrew: " plus amount
        write "New balance: " plus this.balance
        return true
    end
    
    define getBalance():
        return this.balance
    end
end

set account to new BankAccount("Alice", 1000)
account.deposit(500)
account.withdraw(200)
write "Final balance: " plus account.getBalance()
```

## Async Programming

### Async Functions

```vl
async define fetchUserData(userId):
    write "Fetching user " plus userId plus "..."
    
    set url to "https://api.example.com/users/" plus userId
    set response to await fetch(url)
    set data to await response.json()
    
    write "User data received!"
    return data
end

async define main():
    set user to await fetchUserData(123)
    write user.name
end
```

### Error Handling with Async

```vl
async define safeDataFetch(url):
    try:
        set response to await fetch(url)
        
        if response.ok is not equals true:
            throw new Error("HTTP Error: " plus response.status)
        end
        
        set data to await response.json()
        return data
    catch error:
        write "Error fetching data: " plus error.message
        return null
    end
end
```

## Working with Files

### Read Files

```vl
require "fs" as fs

# Synchronous read
set content to fs.readFileSync("data.txt", "utf8")
write content

# Async read
async define readFile(path):
    try:
        set content to await fs.promises.readFile(path, "utf8")
        return content
    catch error:
        write "Error reading file: " plus error.message
        return null
    end
end
```

### Write Files

```vl
require "fs" as fs

# Synchronous write
fs.writeFileSync("output.txt", "Hello from VL!")

# Async write
async define writeFile(path, content):
    try:
        await fs.promises.writeFile(path, content, "utf8")
        write "File written successfully!"
    catch error:
        write "Error writing file: " plus error.message
    end
end
```

### Check if File Exists

```vl
require "fs" as fs

if fs.existsSync("myfile.txt"):
    write "File exists!"
    set content to fs.readFileSync("myfile.txt", "utf8")
    write content
else:
    write "File not found"
end
```

## Building a Discord Bot

### Step 1: Install Discord.js

```bash
vl pkg add discord.js
```

### Step 2: Create bot.vl

```vl
import { Client, GatewayIntentBits } from "discord.js"

# Create bot client
set client to new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

# Bot ready event
client.on("ready", define():
    write "✅ Bot is online!"
    write "Logged in as: " plus client.user.tag
end)

# Message handler
client.on("messageCreate", async define(message):
    # Ignore bot messages
    if message.author.bot is equals true:
        return
    end
    
    # Ping command
    if message.content is equals "!ping":
        await message.reply("Pong! 🏓")
    end
    
    # Hello command
    if message.content is equals "!hello":
        set greeting to "Hello, " plus message.author.username plus "! 👋"
        await message.reply(greeting)
    end
    
    # Info command
    if message.content is equals "!info":
        set info to "**Bot Info**\nName: " plus client.user.username plus "\nServers: " plus client.guilds.cache.size
        await message.reply(info)
    end
    
    # Help command
    if message.content is equals "!help":
        set helpText to "**Commands:**\n!ping - Test bot\n!hello - Get greeted\n!info - Bot information\n!help - This message"
        await message.reply(helpText)
    end
end)

# Login (use environment variable for security)
client.login(process.env.DISCORD_TOKEN)
```

### Step 3: Set up token

```bash
# On Windows
set DISCORD_TOKEN=your_token_here

# On Mac/Linux
export DISCORD_TOKEN=your_token_here
```

### Step 4: Run the bot

```bash
vl run bot.vl
```

## Building a Web Server

### Step 1: Install Express

```bash
vl pkg add express
```

### Step 2: Create server.vl

```vl
require "express" as express

# Create app
set app to express()

# Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

# Home route
app.get("/", define(req, res):
    res.send("<h1>Welcome to VL Web Server!</h1>")
end)

# API endpoint
app.get("/api/hello", define(req, res):
    res.json({
        message: "Hello from Verion Language!",
        timestamp: Date.now()
    })
end)

# Dynamic route
app.get("/user/:name", define(req, res):
    set name to req.params.name
    res.send("Hello, " plus name plus "!")
end)

# POST endpoint
app.post("/api/data", define(req, res):
    set data to req.body
    write "Received data:"
    write data
    
    res.json({
        success: true,
        received: data
    })
end)

# Start server
set PORT to 3000
app.listen(PORT, define():
    write "🚀 Server running on http://localhost:" plus PORT
end)
```

### Step 3: Run the server

```bash
vl run server.vl
```

### Step 4: Test it

```bash
# Visit in browser
http://localhost:3000
http://localhost:3000/api/hello
http://localhost:3000/user/Alice
```

## Building a REST API

### Full REST API Example

```vl
require "express" as express

set app to express()
app.use(express.json())

# In-memory database
set todos to []
set nextId to 1

# GET all todos
app.get("/api/todos", define(req, res):
    res.json({
        success: true,
        data: todos,
        count: todos.length
    })
end)

# GET single todo
app.get("/api/todos/:id", define(req, res):
    set id to Number(req.params.id)
    set todo to null
    
    for t in todos:
        if t.id is equals id:
            set todo to t
            break
        end
    end
    
    if todo is equals null:
        res.status(404).json({
            success: false,
            error: "Todo not found"
        })
    else:
        res.json({
            success: true,
            data: todo
        })
    end
end)

# POST new todo
app.post("/api/todos", define(req, res):
    set title to req.body.title
    
    if not title:
        res.status(400).json({
            success: false,
            error: "Title is required"
        })
        return
    end
    
    set newTodo to {
        id: nextId,
        title: title,
        completed: false
    }
    
    todos.push(newTodo)
    set nextId to nextId plus 1
    
    res.status(201).json({
        success: true,
        data: newTodo
    })
end)

# PUT update todo
app.put("/api/todos/:id", define(req, res):
    set id to Number(req.params.id)
    set found to false
    
    for todo in todos:
        if todo.id is equals id:
            if req.body.title:
                set todo.title to req.body.title
            end
            if req.body.completed is not null:
                set todo.completed to req.body.completed
            end
            set found to true
            
            res.json({
                success: true,
                data: todo
            })
            break
        end
    end
    
    if found is equals false:
        res.status(404).json({
            success: false,
            error: "Todo not found"
        })
    end
end)

# DELETE todo
app.delete("/api/todos/:id", define(req, res):
    set id to Number(req.params.id)
    set initialLength to todos.length
    
    set newTodos to []
    for todo in todos:
        if todo.id is not equals id:
            newTodos.push(todo)
        end
    end
    set todos to newTodos
    
    if todos.length is less than initialLength:
        res.json({
            success: true,
            message: "Todo deleted"
        })
    else:
        res.status(404).json({
            success: false,
            error: "Todo not found"
        })
    end
end)

# Start server
set PORT to 3000
app.listen(PORT, define():
    write "📝 Todo API running on http://localhost:" plus PORT
    write ""
    write "Endpoints:"
    write "  GET    /api/todos"
    write "  GET    /api/todos/:id"
    write "  POST   /api/todos"
    write "  PUT    /api/todos/:id"
    write "  DELETE /api/todos/:id"
end)
```

### Testing the API

```bash
# Get all todos
curl http://localhost:3000/api/todos

# Create a todo
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn VL"}'

# Get specific todo
curl http://localhost:3000/api/todos/1

# Update todo
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete todo
curl -X DELETE http://localhost:3000/api/todos/1
```

## Next Steps

Now that you've learned the basics of Verion Language, you can:

1. **Explore the Examples** - Check out `examples/` directory for more code
2. **Read the Documentation** - See `docs/SYNTAX_COMPLETE.md` for full syntax reference
3. **Build Your Own Project** - Start with `vl init` and create something awesome!
4. **Join the Community** - Share your projects and get help

## Tips and Best Practices

### 1. Use Descriptive Variable Names

```vl
# Good
set userAge to 25
set totalPrice to 99.99

# Avoid
set x to 25
set p to 99.99
```

### 2. Handle Errors Properly

```vl
try:
    set result to riskyOperation()
catch error:
    write "Error: " plus error.message
    # Handle gracefully
end
```

### 3. Use Async for I/O Operations

```vl
# Good - async for file/network operations
async define loadData():
    set data to await fetch("https://api.example.com/data")
    return data
end
```

### 4. Keep Functions Small and Focused

```vl
# Each function does one thing well
define validateEmail(email):
    return email.includes("@")
end

define sendEmail(to, subject, body):
    # Send email logic
end

define notifyUser(email, message):
    if validateEmail(email):
        sendEmail(email, "Notification", message)
    end
end
```

### 5. Use Environment Variables for Secrets

```vl
# Never hardcode tokens!
set apiKey to process.env.API_KEY
set dbPassword to process.env.DB_PASSWORD
```

## Troubleshooting

### Common Issues

**Issue**: `vl: command not found`
**Solution**: Run `npm link` in the verion-lang directory

**Issue**: Import/require not working
**Solution**: Make sure you've installed the package with `vl pkg add <package>`

**Issue**: Async function not working
**Solution**: Make sure to use `await` and mark the calling function as `async`

## Resources

- **Full Syntax Guide**: `docs/SYNTAX_COMPLETE.md`
- **API Reference**: `docs/API_REFERENCE.md`
- **Examples**: `examples/` directory
- **GitHub Issues**: Report bugs and request features

---

**Happy coding with Verion Language! 🚀**

Remember: The best way to learn is by doing. Start building something today!
