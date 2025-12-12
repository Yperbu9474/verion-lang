# Verion Language Quick Reference Card

## 🎯 Essential Syntax

### Variables
```vl
set name to "Alice"
set age to 30
set isActive to true
set numbers to [1, 2, 3]
set user to { name: "Bob", age: 25 }
```

### Output
```vl
write "Hello World"
print variable
```

### Arithmetic
```vl
set x to 10 plus 5       # 15
set y to 20 minus 3      # 17
set z to 4 multiply 7    # 28
set w to 15 divide 3     # 5
```

### Comparisons
```vl
is greater than
is less than
is equals
is not equals
is greater than or equal to
is less than or equal to
```

### Logic
```vl
and  # Both conditions must be true
or   # Either condition must be true
not  # Negates a condition
```

## 🔀 Control Flow

### If/Elif/Else
```vl
if condition:
    # code
elif other_condition:
    # code
else:
    # code
end
```

### While Loop
```vl
while count is less than 10:
    # code
    set count to count plus 1
end
```

### For Loop
```vl
for item in collection:
    # code
end
```

### Repeat Loop
```vl
repeat 5 times:
    # code
end
```

### Break/Continue
```vl
break      # Exit loop
continue   # Skip to next iteration
```

## 📦 Functions

### Basic Function
```vl
define greet(name):
    write "Hello " plus name
end

greet("Alice")
```

### Function with Return
```vl
define add(a, b):
    return a plus b
end

set result to add(5, 3)
```

### Async Function
```vl
async define fetchData(url):
    set response to await fetch(url)
    set data to await response.json()
    return data
end
```

## 🎨 Classes

```vl
class Person:
    define constructor(name, age):
        set this.name to name
        set this.age to age
    end
    
    define greet():
        write "Hi, I'm " plus this.name
    end
end

set person to new Person("Alice", 30)
person.greet()
```

## 📥 Imports

### ES6 Import
```vl
import "module-name" as moduleName
import { thing } from "module-name"
import { thing as alias } from "module-name"
```

### CommonJS Require
```vl
require "module-name" as moduleName
```

### Export
```vl
export define myFunction():
    # code
end

export set myVariable to "value"
```

## ⚠️ Error Handling

```vl
try:
    # risky code
catch error:
    write "Error: " plus error.message
finally:
    # cleanup code
end

# Throw errors
throw new Error("Something went wrong")
```

## 🔄 Async/Await

```vl
async define main():
    try:
        set data to await fetchData()
        write data
    catch error:
        write "Error: " plus error.message
    end
end
```

## 📊 Data Structures

### Arrays
```vl
set fruits to ["apple", "banana", "orange"]
fruits.push("grape")
set first to fruits[0]
set length to fruits.length

for fruit in fruits:
    write fruit
end
```

### Objects
```vl
set user to {
    name: "Alice",
    age: 30,
    email: "alice@example.com"
}

write user.name
set user.age to 31
user["email"] to "newemail@example.com"
```

## 🌐 Common Patterns

### Read File
```vl
require "fs" as fs

set content to fs.readFileSync("file.txt", "utf8")
write content
```

### Write File
```vl
require "fs" as fs

fs.writeFileSync("output.txt", "content")
```

### HTTP Request
```vl
async define getData():
    set response to await fetch("https://api.example.com/data")
    set json to await response.json()
    return json
end
```

### Express Server
```vl
require "express" as express

set app to express()

app.get("/", define(req, res):
    res.send("Hello World")
end)

app.listen(3000, define():
    write "Server running on port 3000"
end)
```

### Discord Bot
```vl
import { Client, GatewayIntentBits } from "discord.js"

set client to new Client({ intents: [GatewayIntentBits.Guilds] })

client.on("ready", define():
    write "Bot is ready!"
end)

client.on("messageCreate", async define(message):
    if message.content is equals "!ping":
        await message.reply("Pong!")
    end
end)

client.login(process.env.DISCORD_TOKEN)
```

## 🛠️ CLI Commands

```bash
vl init                    # Create new project
vl run file.vl             # Run a VL file
vl build file.vl           # Transpile to JavaScript
vl pkg add <package>       # Install npm package
vl pkg remove <package>    # Remove npm package
vl up                      # Update VL toolchain
vl help                    # Show help
```

## 💡 Tips

1. **Use descriptive variable names**: `userAge` not `x`
2. **Handle errors with try/catch**: Always wrap risky operations
3. **Use async for I/O**: File operations, network requests
4. **Keep functions small**: One function, one purpose
5. **Use environment variables**: Never hardcode secrets

## 📖 More Resources

- **Complete Tutorial**: [docs/LEARN.md](LEARN.md)
- **Full Syntax Guide**: [docs/SYNTAX_COMPLETE.md](SYNTAX_COMPLETE.md)
- **API Reference**: [docs/API_REFERENCE.md](API_REFERENCE.md)
- **Examples**: Check the `examples/` directory

---

**Quick Tip**: Start with `vl init` to create a new project with examples!
