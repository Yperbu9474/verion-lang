# Verion Language - Complete Syntax Reference

## Overview

Verion Language (VL) is a high-level, English-like programming language designed for readability and ease of use. This document provides a complete reference for all language features.

## Table of Contents

- [Comments](#comments)
- [Output](#output)
- [Variables](#variables)
- [Data Types](#data-types)
- [Operators](#operators)
- [Functions](#functions)
- [Control Flow](#control-flow)
- [Expressions](#expressions)
- [Reserved Keywords](#reserved-keywords)

---

## Comments

Single-line comments start with `#`:

```vl
# This is a comment
write "This is code"  # Inline comment
```

**Notes:**
- Comments are ignored by the compiler
- Use comments to explain complex logic
- Comments can appear on their own line or after code

---

## Output

### write Statement

Print values to the console:

```vl
write "Hello, World!"
write 42
write name
write x plus y
```

**Syntax:**
```
write <expression>
```

**Examples:**
```vl
# Print string literal
write "Hello"

# Print number
write 100

# Print variable
set x to 10
write x

# Print expression result
write 5 plus 3
```

**Transpiles to:**
```javascript
console.log("Hello");
console.log(100);
let x = 10;
console.log(x);
console.log((5 + 3));
```

---

## Variables

### Variable Declaration

Use `set` to create or update variables:

```vl
set name to "Alice"
set age to 25
set score to 100
```

**Syntax:**
```
set <identifier> to <expression>
```

**Examples:**
```vl
# String variable
set greeting to "Hello"

# Number variable
set count to 10

# Expression result
set total to 5 plus 10

# Variable reference
set x to 10
set y to x
```

**Transpiles to:**
```javascript
let greeting = "Hello";
let count = 10;
let total = (5 + 10);
let x = 10;
let y = x;
```

### Variable Naming Rules

- Must start with a letter or underscore
- Can contain letters, numbers, and underscores
- Case-sensitive (`name` and `Name` are different)
- Cannot be a reserved keyword

**Valid names:**
```vl
set userName to "Alice"
set user_name to "Bob"
set _private to 42
set count1 to 10
```

**Invalid names:**
```vl
set 1count to 10      # Cannot start with number
set user-name to "x"  # Cannot contain hyphen
set write to 5        # Cannot use keyword
```

---

## Data Types

### Strings

Text enclosed in double quotes:

```vl
set message to "Hello, World!"
set name to "Alice"
set empty to ""
```

**Escape sequences:**
```vl
# Supported escapes: \n \t \r \\ \" \'
set multiline to "Line 1\nLine 2"
set quoted to "She said \"Hello\""
```

### Numbers

Integer or decimal numbers:

```vl
set age to 25
set price to 19.99
set negative to -10
set zero to 0
```

**Notes:**
- No separate integer/float types
- Standard JavaScript number precision
- Support for negative numbers

### Identifiers

Variable and function names:

```vl
set myVariable to 10
define myFunction():
    write "Hello"
end
```

---

## Operators

### Arithmetic Operators

| Operator | Keyword | Example | Result |
|----------|---------|---------|--------|
| Addition | `plus` | `5 plus 3` | `8` |
| Subtraction | `minus` | `10 minus 4` | `6` |
| Multiplication | `multiply` | `3 multiply 4` | `12` |
| Division | `divide` | `20 divide 5` | `4` |

**Examples:**
```vl
set a to 10
set b to 5

set sum to a plus b           # 15
set difference to a minus b   # 5
set product to a multiply b   # 50
set quotient to a divide b    # 2
```

### Comparison Operators

| Comparison | Syntax | Example | Result |
|------------|--------|---------|--------|
| Greater than | `is greater than` | `10 is greater than 5` | `true` |
| Less than | `is less than` | `5 is less than 10` | `true` |
| Equals | `is equals` | `5 is equals 5` | `true` |

**Examples:**
```vl
set x to 10
set y to 5

if x is greater than y:
    write "x is bigger"
end

if y is less than x:
    write "y is smaller"
end

if x is equals 10:
    write "x is ten"
end
```

### Logical Operators

| Operator | Keyword | Example |
|----------|---------|---------|
| AND | `and` | `x is greater than 5 and x is less than 10` |
| OR | `or` | `x is equals 0 or x is equals 1` |

**Examples:**
```vl
set age to 25

# Using AND
if age is greater than 18 and age is less than 65:
    write "Working age"
end

# Using OR
if age is less than 13 or age is greater than 65:
    write "Discount applies"
end
```

---

## Functions

### Function Definition

Define reusable blocks of code:

```vl
define functionName(param1, param2):
    # function body
    write param1
    write param2
end
```

**Syntax:**
```
define <name>(<parameters>):
    <statements>
end
```

**Examples:**

**No parameters:**
```vl
define sayHello():
    write "Hello, World!"
end

sayHello()
```

**With parameters:**
```vl
define greet(name):
    write "Hello, "
    write name
end

greet("Alice")
greet("Bob")
```

**Multiple parameters:**
```vl
define add(a, b):
    set result to a plus b
    write result
end

add(5, 3)
add(10, 20)
```

**Nested calls:**
```vl
define inner():
    write "Inner function"
end

define outer():
    write "Outer function"
    inner()
end

outer()
```

### Function Calls

Invoke functions with arguments:

```vl
functionName(arg1, arg2)
```

**Examples:**
```vl
greet("Alice")
add(5, 10)
calculate(x, y, z)
```

---

## Control Flow

### Conditional Statements (if/else)

Execute code based on conditions:

```vl
if <condition>:
    <statements>
end

if <condition>:
    <statements>
else:
    <statements>
end
```

**Examples:**

**Simple if:**
```vl
set age to 20

if age is greater than 18:
    write "Adult"
end
```

**if/else:**
```vl
set score to 85

if score is greater than 90:
    write "Grade: A"
else:
    write "Grade: B or lower"
end
```

**Multiple conditions:**
```vl
set temperature to 25

if temperature is greater than 30:
    write "Hot"
end

if temperature is less than 10:
    write "Cold"
end
```

**Nested conditionals:**
```vl
set age to 25
set hasTicket to 1

if age is greater than 18:
    if hasTicket is greater than 0:
        write "Can enter"
    else:
        write "Need ticket"
    end
end
```

### Loops

#### Repeat Loop

Execute code a specific number of times:

```vl
repeat <count> times:
    <statements>
end
```

**Examples:**

**Fixed count:**
```vl
repeat 5 times:
    write "Hello"
end
```

**Variable count:**
```vl
set n to 3
repeat n times:
    write "Looping"
end
```

**Nested loops:**
```vl
repeat 3 times:
    write "Outer"
    repeat 2 times:
        write "  Inner"
    end
end
```

---

## Expressions

### Primary Expressions

**Literals:**
```vl
"Hello"     # String
42          # Number
```

**Variables:**
```vl
myVariable
userName
count
```

**Function calls:**
```vl
calculate(5, 10)
greet("Alice")
```

### Binary Expressions

**Arithmetic:**
```vl
5 plus 3
10 minus 4
3 multiply 7
20 divide 4
```

**Comparison:**
```vl
x is greater than 10
age is less than 65
score is equals 100
```

**Logical:**
```vl
x is greater than 5 and x is less than 10
age is equals 18 or age is equals 21
```

### Expression Precedence

1. Primary expressions (literals, variables, function calls)
2. Multiplicative operators (`multiply`, `divide`)
3. Additive operators (`plus`, `minus`)
4. Comparison operators (`is greater than`, `is less than`, `is equals`)
5. Logical operators (`and`, `or`)

**Examples:**
```vl
# Multiply before add
set result to 5 plus 3 multiply 2  # Result: 11 (not 16)

# Comparison before logical
if x is greater than 5 and y is less than 10:
    write "Valid range"
end
```

---

## Reserved Keywords

The following words are reserved and cannot be used as identifiers:

### Statements
- `write` - Output statement
- `set` - Variable assignment
- `to` - Assignment operator
- `define` - Function definition
- `end` - Block terminator
- `if` - Conditional statement
- `else` - Alternative branch
- `repeat` - Loop statement
- `times` - Loop count indicator

### Operators
- `plus` - Addition
- `minus` - Subtraction
- `multiply` - Multiplication
- `divide` - Division
- `is` - Comparison prefix
- `greater` - Greater than comparison
- `less` - Less than comparison
- `than` - Comparison suffix
- `equals` - Equality comparison
- `and` - Logical AND
- `or` - Logical OR

### Symbols
- `:` - Block start
- `,` - Parameter separator
- `.` - Member access
- `(` `)` - Function parameters
- `#` - Comment marker

---

## Complete Examples

### Example 1: Calculator

```vl
# Simple calculator
set a to 10
set b to 5

write "Addition:"
set sum to a plus b
write sum

write "Subtraction:"
set diff to a minus b
write diff

write "Multiplication:"
set prod to a multiply b
write prod

write "Division:"
set quot to a divide b
write quot
```

### Example 2: Grade Calculator

```vl
# Grade calculator
set score to 85

write "Your score:"
write score

if score is greater than 90:
    write "Grade: A"
else:
    if score is greater than 80:
        write "Grade: B"
    else:
        write "Grade: C"
    end
end
```

### Example 3: Countdown

```vl
# Countdown timer
set count to 5

write "Starting countdown..."

repeat count times:
    write "Tick"
end

write "Done!"
```

### Example 4: User Greeting System

```vl
# User greeting system
define greetUser(name, age):
    write "Hello, "
    write name
    write "You are "
    write age
    write " years old"
    
    if age is greater than 18:
        write "You are an adult"
    else:
        write "You are a minor"
    end
end

greetUser("Alice", 25)
greetUser("Bob", 16)
```

---

## Future Features (Planned)

The following features are planned for future versions:

### Arrays
```vl
set numbers to [1, 2, 3, 4, 5]
set names to ["Alice", "Bob", "Charlie"]
```

### While Loops
```vl
while x is less than 10:
    set x to x plus 1
    write x
end
```

### Return Statements
```vl
define add(a, b) returns number:
    return a plus b
end
```

### String Concatenation
```vl
set fullName to firstName plus " " plus lastName
```

### Objects
```vl
set person to {name: "Alice", age: 25}
```

### Modules
```vl
import helpers from "helpers.vl"
export function greet(name)
```

---

## Transpilation

All Verion Language code transpiles to JavaScript:

**VL Code:**
```vl
set x to 10
write x
```

**JavaScript Output:**
```javascript
let x = 10;
console.log(x);
```

Use `vl build file.vl` to see the transpiled JavaScript output.

---

## Best Practices

1. **Use descriptive names:**
   ```vl
   set userAge to 25           # Good
   set x to 25                 # Less clear
   ```

2. **Add comments for complex logic:**
   ```vl
   # Calculate compound interest
   set interest to principal multiply rate multiply time
   ```

3. **Keep functions focused:**
   ```vl
   # Good - single purpose
   define calculateTotal(price, tax):
       set result to price plus tax
       write result
   end
   ```

4. **Use proper indentation:**
   ```vl
   if x is greater than 10:
       write "Big"
       if x is greater than 100:
           write "Very big"
       end
   end
   ```

5. **Test incrementally:**
   - Write small functions
   - Test each function independently
   - Build complex logic step by step

---

For more information, see:
- [CLI Documentation](cli.md)
- [Examples Directory](../examples/)
