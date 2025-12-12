# Verion Language - API Reference

Complete reference for all Verion Language features and APIs.

## Table of Contents
1. [Core Language Features](#core-language-features)
2. [Built-in Functions](#built-in-functions)
3. [Node.js Integration](#nodejs-integration)
4. [Common Libraries](#common-libraries)
5. [Best Practices](#best-practices)

---

## Core Language Features

### Variables

#### Syntax
```vl
set variableName to value
```

#### Examples
```vl
set age to 25
set name to "Alice"
set isActive to true
set data to null
set numbers to [1, 2, 3]
set user to { name: "Bob", age: 30 }
```

### Functions

#### Basic Function
```vl
define functionName(param1, param2):
    # function body
    return result
end
```

#### Async Function
```vl
async define fetchData(url):
    set response to await fetch(url)
    return await response.json()
end
```

#### Anonymous Function (in JavaScript context)
```vl
set callback to define(x):
    return x multiply 2
end
```

### Classes

#### Class Definition
```vl
class ClassName:
    define constructor(param1, param2):
        set this.property1 to param1
        set this.property2 to param2
    end
    
    define method1():
        # method body
    end
    
    async define asyncMethod():
        # async method body
    end
end
```

#### Creating Instances
```vl
set instance to new ClassName(arg1, arg2)
instance.method1()
```

---

## Built-in Functions

### Console Output

#### `write` / `print`
Outputs a value to the console.

```vl
write "Hello, World!"
print 42
write variable
```

Transpiles to: `console.log(value)`

### Mathematical Operations

#### Arithmetic Operators
```vl
set sum to a plus b           # Addition
set diff to a minus b          # Subtraction
set product to a multiply b    # Multiplication
set quotient to a divide b     # Division
```

### Comparison Operators

```vl
a is greater than b    # a > b
a is less than b       # a < b
a is equals b          # a === b
```

### Logical Operators

```vl
condition1 and condition2   # Logical AND
condition1 or condition2    # Logical OR
not condition               # Logical NOT
```

---

## Node.js Integration

### Importing Modules

#### ES6 Imports
```vl
import express from "express"
import { readFile, writeFile } from "fs"
import { Client } from "discord.js"
```

#### CommonJS Require
```vl
require "express" as express
require "fs" as fs
require "./myModule" as myModule
```

### File System (fs)

#### Read File (Sync)
```vl
require "fs" as fs

set content to fs.readFileSync("file.txt", "utf8")
write content
```

#### Read File (Async)
```vl
require "fs" as fs

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

#### Write File (Sync)
```vl
require "fs" as fs

fs.writeFileSync("output.txt", "Hello, VL!")
```

#### Write File (Async)
```vl
async define writeFile(path, content):
    try:
        await fs.promises.writeFile(path, content, "utf8")
        write "File written successfully"
    catch error:
        write "Error writing file: " plus error.message
    end
end
```

#### Check if File Exists
```vl
require "fs" as fs

if fs.existsSync("file.txt"):
    write "File exists"
else:
    write "File not found"
end
```

### Path Operations

```vl
require "path" as path

set filePath to "/user/documents/file.txt"

set dirname to path.dirname(filePath)    # "/user/documents"
set basename to path.basename(filePath)  # "file.txt"
set ext to path.extname(filePath)        # ".txt"

set joined to path.join("folder", "subfolder", "file.txt")
set resolved to path.resolve("relative/path")
```

### HTTP/HTTPS Requests

#### Using Fetch API
```vl
# GET Request
async define fetchData(url):
    try:
        set response to await fetch(url)
        
        if response.ok is not equals true:
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

#### POST Request
```vl
async define postData(url, payload):
    set options to {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }
    
    try:
        set response to await fetch(url, options)
        set result to await response.json()
        return result
    catch error:
        write "POST failed: " plus error.message
        return null
    end
end
```

---

## Common Libraries

### Express.js - Web Server

#### Basic Setup
```vl
require "express" as express

set app to express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
```

#### Routes

##### GET Route
```vl
app.get("/api/users", define(req, res):
    set users to [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" }
    ]
    res.json(users)
end)
```

##### POST Route
```vl
app.post("/api/users", define(req, res):
    set userData to req.body
    
    # Validate
    if not userData.name:
        res.status(400).json({ error: "Name is required" })
        return
    end
    
    # Create user
    set newUser to { id: generateId(), name: userData.name }
    res.status(201).json(newUser)
end)
```

##### PUT Route
```vl
app.put("/api/users/:id", define(req, res):
    set userId to req.params.id
    set updates to req.body
    
    # Update logic here
    
    res.json({ message: "User updated", id: userId })
end)
```

##### DELETE Route
```vl
app.delete("/api/users/:id", define(req, res):
    set userId to req.params.id
    
    # Delete logic here
    
    res.json({ message: "User deleted", id: userId })
end)
```

#### Middleware
```vl
# Logging middleware
app.use(define(req, res, next):
    write req.method plus " " plus req.url
    next()
end)

# Authentication middleware
define authenticate(req, res, next):
    set token to req.headers.authorization
    
    if not token:
        res.status(401).json({ error: "Unauthorized" })
        return
    end
    
    # Verify token logic here
    
    next()
end

app.get("/protected", authenticate, define(req, res):
    res.json({ message: "Protected data" })
end)
```

#### Error Handling
```vl
# Error handling middleware (must be last)
app.use(define(error, req, res, next):
    write "Error: " plus error.message
    res.status(500).json({ error: "Internal server error" })
end)
```

#### Starting Server
```vl
set PORT to 3000

app.listen(PORT, define():
    write "Server running on http://localhost:" plus PORT
end)
```

### Discord.js - Discord Bots

#### Bot Setup
```vl
import { Client, GatewayIntentBits } from "discord.js"

set client to new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})
```

#### Events

##### Ready Event
```vl
client.on("ready", define():
    write "Bot is online!"
    write "Logged in as: " plus client.user.tag
end)
```

##### Message Event
```vl
client.on("messageCreate", async define(message):
    # Ignore bots
    if message.author.bot:
        return
    end
    
    # Handle commands
    if message.content is equals "!ping":
        await message.reply("Pong!")
    end
    
    if message.content.startsWith("!hello"):
        set username to message.author.username
        await message.reply("Hello, " plus username plus "!")
    end
end)
```

##### Interaction Event (Slash Commands)
```vl
client.on("interactionCreate", async define(interaction):
    if not interaction.isChatInputCommand():
        return
    end
    
    if interaction.commandName is equals "ping":
        await interaction.reply("Pong!")
    end
end)
```

#### Sending Messages
```vl
# Reply to message
await message.reply("Response text")

# Send to channel
await message.channel.send("Message text")

# Send embed
set embed to {
    color: 0x0099ff,
    title: "Title",
    description: "Description text",
    fields: [
        { name: "Field 1", value: "Value 1" },
        { name: "Field 2", value: "Value 2" }
    ]
}

await message.channel.send({ embeds: [embed] })
```

#### Bot Login
```vl
client.login("YOUR_BOT_TOKEN")
```

### MongoDB - Database

#### Connect to Database
```vl
require "mongodb" as mongodb

async define connect():
    set uri to "mongodb://localhost:27017"
    set client to new mongodb.MongoClient(uri)
    
    try:
        await client.connect()
        write "Connected to MongoDB"
        return client
    catch error:
        write "Connection failed: " plus error.message
        throw error
    end
end
```

#### CRUD Operations

##### Insert Document
```vl
async define insertUser(db, userData):
    set collection to db.collection("users")
    set result to await collection.insertOne(userData)
    return result.insertedId
end
```

##### Find Documents
```vl
async define findUsers(db, query):
    set collection to db.collection("users")
    set users to await collection.find(query).toArray()
    return users
end
```

##### Update Document
```vl
async define updateUser(db, userId, updates):
    set collection to db.collection("users")
    set result to await collection.updateOne(
        { _id: userId },
        { $set: updates }
    )
    return result.modifiedCount
end
```

##### Delete Document
```vl
async define deleteUser(db, userId):
    set collection to db.collection("users")
    set result to await collection.deleteOne({ _id: userId })
    return result.deletedCount
end
```

### Axios - HTTP Client

#### GET Request
```vl
require "axios" as axios

async define getData(url):
    try:
        set response to await axios.get(url)
        return response.data
    catch error:
        write "Request failed: " plus error.message
        return null
    end
end
```

#### POST Request
```vl
async define postData(url, data):
    try:
        set response to await axios.post(url, data)
        return response.data
    catch error:
        write "POST failed: " plus error.message
        return null
    end
end
```

#### With Headers and Config
```vl
async define apiRequest(url, method, data):
    set config to {
        method: method,
        url: url,
        headers: {
            "Authorization": "Bearer TOKEN",
            "Content-Type": "application/json"
        },
        data: data
    }
    
    try:
        set response to await axios(config)
        return response.data
    catch error:
        if error.response:
            write "Status: " plus error.response.status
            write "Data: " plus error.response.data
        else:
            write "Error: " plus error.message
        end
        return null
    end
end
```

---

## Best Practices

### 1. Error Handling

Always wrap async operations in try-catch:
```vl
async define safeOperation():
    try:
        set result to await riskyOperation()
        return result
    catch error:
        write "Error: " plus error.message
        return null
    end
end
```

### 2. Resource Cleanup

Use finally blocks for cleanup:
```vl
async define processFile(path):
    set file to null
    try:
        set file to await openFile(path)
        set content to await file.read()
        return content
    catch error:
        write "Error: " plus error.message
        return null
    finally:
        if file:
            await file.close()
        end
    end
end
```

### 3. Input Validation

Always validate user input:
```vl
define validateEmail(email):
    if not email:
        throw new Error("Email is required")
    end
    
    if not email.includes("@"):
        throw new Error("Invalid email format")
    end
    
    return true
end
```

### 4. Environment Variables

Use environment variables for secrets:
```vl
# Never hardcode tokens!
# Good:
set token to process.env.BOT_TOKEN

# Bad:
set token to "hardcoded-secret-token"
```

### 5. Async Best Practices

```vl
# Use await for sequential operations
async define sequential():
    set user to await getUser()
    set posts to await getPosts(user.id)
    set comments to await getComments(posts[0].id)
    return { user, posts, comments }
end

# Start parallel operations together
async define parallel():
    set userPromise to getUser()
    set postsPromise to getPosts()
    
    set user to await userPromise
    set posts to await postsPromise
    
    return { user, posts }
end
```

### 6. Code Organization

Organize related functions in classes:
```vl
class UserService:
    define constructor(db):
        set this.db to db
    end
    
    async define create(userData):
        return await this.db.users.insertOne(userData)
    end
    
    async define findById(id):
        return await this.db.users.findOne({ _id: id })
    end
    
    async define update(id, updates):
        return await this.db.users.updateOne({ _id: id }, { $set: updates })
    end
    
    async define delete(id):
        return await this.db.users.deleteOne({ _id: id })
    end
end
```

---

## Quick Reference Tables

### Operators

| VL Syntax | JavaScript | Description |
|-----------|------------|-------------|
| `plus` | `+` | Addition |
| `minus` | `-` | Subtraction |
| `multiply` | `*` | Multiplication |
| `divide` | `/` | Division |
| `is greater than` | `>` | Greater than |
| `is less than` | `<` | Less than |
| `is equals` | `===` | Strict equality |
| `and` | `&&` | Logical AND |
| `or` | `\|\|` | Logical OR |
| `not` | `!` | Logical NOT |

### Control Flow

| Feature | Syntax |
|---------|--------|
| If | `if condition: ... end` |
| If-Else | `if condition: ... else: ... end` |
| If-Elif-Else | `if c1: ... elif c2: ... else: ... end` |
| While | `while condition: ... end` |
| For | `for item in list: ... end` |
| Repeat | `repeat n times: ... end` |
| Break | `break` |
| Continue | `continue` |

### Functions

| Feature | Syntax |
|---------|--------|
| Function | `define name(params): ... end` |
| Async Function | `async define name(): ... end` |
| Return | `return value` |
| Call Function | `name(args)` |
| Await | `await expression` |

### Classes

| Feature | Syntax |
|---------|--------|
| Class | `class Name: ... end` |
| Constructor | `define constructor(params): ... end` |
| Method | `define methodName(): ... end` |
| Create Instance | `new ClassName(args)` |
| This | `this.property` |

---

## Additional Resources

- **GitHub Repository**: [github.com/verion-lang](https://github.com/verion-lang)
- **Examples**: Check the `examples/` directory
- **Community**: Join our Discord server
- **Issues**: Report bugs on GitHub Issues

---

*Last Updated: December 2025*
