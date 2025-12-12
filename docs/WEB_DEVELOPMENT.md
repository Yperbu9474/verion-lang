# Web Development with Verion Language - Complete Guide

## 🌐 Building Websites with VL

Verion Language makes web development simple with clean, readable syntax for HTML, CSS, and full web applications.

---

## Quick Start

### 1. Basic Web Server

```vl
require "express" as express

set app to express()

app.get("/", define(req, res):
    res.send("<h1>Hello World!</h1>")
end)

app.listen(3000, define():
    write "Server running on http://localhost:3000"
end)
```

Run it:
```bash
vl run server.vl
```

---

## HTML Generation

### Helper Functions

VL makes HTML generation clean and maintainable:

```vl
# HTML structure helpers
define html(content):
    return "<!DOCTYPE html><html>" plus content plus "</html>"
end

define head(title, styles):
    return "<head><title>" plus title plus "</title><style>" plus styles plus "</style></head>"
end

define body(content):
    return "<body>" plus content plus "</body>"
end

# Element helpers
define div(className, content):
    return "<div class='" plus className plus "'>" plus content plus "</div>"
end

define h1(text):
    return "<h1>" plus text plus "</h1>"
end

define p(text):
    return "<p>" plus text plus "</p>"
end

define button(text, onclick):
    return "<button onclick='" plus onclick plus "'>" plus text plus "</button>"
end

define link(href, text):
    return "<a href='" plus href plus "'>" plus text plus "</a>"
end

define image(src, alt):
    return "<img src='" plus src plus "' alt='" plus alt plus "'/>"
end
```

### Usage Example

```vl
require "express" as express
set app to express()

app.get("/", define(req, res):
    # Build page
    set styles to "body { font-family: Arial; } h1 { color: #333; }"
    set content to h1("Welcome") plus p("This is my website")
    
    set pageHead to head("My Site", styles)
    set pageBody to body(content)
    set page to html(pageHead plus pageBody)
    
    res.send(page)
end)

app.listen(3000)
```

---

## CSS Styling

### Inline CSS

```vl
app.get("/", define(req, res):
    set css to "
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', sans-serif;
            line-height: 1.6;
            background: #f4f4f4;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .card {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .btn {
            background: #4CAF50;
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .btn:hover {
            background: #45a049;
        }
    "
    
    set html to "<!DOCTYPE html><html><head><style>" plus css plus "</style></head><body><div class='container'><div class='card'><h1>Styled Content</h1><p>Beautiful styling with VL!</p><button class='btn'>Click Me</button></div></div></body></html>"
    
    res.send(html)
end)
```

### Modern CSS Features

```vl
set modernStyles to "
    :root {
        --primary: #6366f1;
        --secondary: #8b5cf6;
        --dark: #1e293b;
    }
    
    /* Flexbox Layout */
    .flex-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }
    
    /* Grid Layout */
    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }
    
    /* Gradients */
    .gradient-bg {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
    }
    
    /* Animations */
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .animate {
        animation: fadeIn 0.6s ease;
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
        .grid-container {
            grid-template-columns: 1fr;
        }
    }
"
```

---

## Component Patterns

### Navigation Bar

```vl
define navbar(brand, links):
    set navHtml to "<nav class='navbar'>"
    set navHtml to navHtml plus "<div class='brand'>" plus brand plus "</div>"
    set navHtml to navHtml plus "<div class='nav-links'>"
    
    for link in links:
        set navHtml to navHtml plus "<a href='" plus link.href plus "'>" plus link.text plus "</a>"
    end
    
    set navHtml to navHtml plus "</div></nav>"
    return navHtml
end

# Usage
set links to [
    { href: "/", text: "Home" },
    { href: "/about", text: "About" },
    { href: "/contact", text: "Contact" }
]
set nav to navbar("My Site", links)
```

### Card Component

```vl
define card(title, description, buttonText, buttonLink):
    return "
        <div class='card'>
            <h3>" plus title plus "</h3>
            <p>" plus description plus "</p>
            <a href='" plus buttonLink plus "' class='btn'>" plus buttonText plus "</a>
        </div>
    "
end

# Usage
set card1 to card("Feature 1", "Amazing feature", "Learn More", "/feature1")
set card2 to card("Feature 2", "Another feature", "Explore", "/feature2")
```

### Hero Section

```vl
define hero(title, subtitle, ctaText, ctaLink):
    return "
        <section class='hero'>
            <div class='hero-content'>
                <h1>" plus title plus "</h1>
                <p>" plus subtitle plus "</p>
                <a href='" plus ctaLink plus "' class='cta-button'>" plus ctaText plus "</a>
            </div>
        </section>
    "
end
```

---

## Complete Website Example

### Multi-Page Site

```vl
require "express" as express
set app to express()

# Shared styles
define getSharedStyles():
    return "
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .navbar { background: #333; color: white; padding: 1rem 2rem; }
        .navbar a { color: white; text-decoration: none; margin-right: 1rem; }
        .container { max-width: 1200px; margin: 2rem auto; padding: 0 2rem; }
        .hero { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 4rem 2rem; text-align: center; }
        .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 2rem; }
    "
end

# Homepage
app.get("/", define(req, res):
    set styles to getSharedStyles()
    set html to "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Home</title><style>" plus styles plus "</style></head><body><nav class='navbar'><a href='/'>Home</a><a href='/about'>About</a><a href='/contact'>Contact</a></nav><div class='hero'><h1>Welcome</h1><p>Build amazing websites with VL</p></div><div class='container'><div class='card'><h2>Getting Started</h2><p>VL makes web development simple and fun!</p></div></div></body></html>"
    res.send(html)
end)

# About page
app.get("/about", define(req, res):
    set styles to getSharedStyles()
    set html to "<!DOCTYPE html><html><head><title>About</title><style>" plus styles plus "</style></head><body><nav class='navbar'><a href='/'>Home</a><a href='/about'>About</a><a href='/contact'>Contact</a></nav><div class='container'><div class='card'><h1>About Us</h1><p>We build with Verion Language.</p></div></div></body></html>"
    res.send(html)
end)

app.listen(3000)
```

---

## Static Files

### Serving CSS/JS/Images

```vl
require "express" as express
set app to express()

# Serve static files from 'public' directory
app.use(express.static("public"))

app.get("/", define(req, res):
    set html to "
        <!DOCTYPE html>
        <html>
        <head>
            <link rel='stylesheet' href='/styles.css'>
            <script src='/script.js'></script>
        </head>
        <body>
            <h1>Hello World</h1>
            <img src='/logo.png' alt='Logo'/>
        </body>
        </html>
    "
    res.send(html)
end)

app.listen(3000)
```

Directory structure:
```
project/
├── server.vl
└── public/
    ├── styles.css
    ├── script.js
    └── logo.png
```

---

## Form Handling

```vl
require "express" as express
set app to express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

# Display form
app.get("/contact", define(req, res):
    set html to "
        <!DOCTYPE html>
        <html>
        <head>
            <title>Contact</title>
            <style>
                .form-group { margin-bottom: 1rem; }
                label { display: block; margin-bottom: 0.5rem; }
                input, textarea { width: 100%; padding: 0.5rem; }
                button { background: #4CAF50; color: white; padding: 1rem 2rem; border: none; cursor: pointer; }
            </style>
        </head>
        <body>
            <h1>Contact Us</h1>
            <form method='POST' action='/contact'>
                <div class='form-group'>
                    <label>Name</label>
                    <input type='text' name='name' required/>
                </div>
                <div class='form-group'>
                    <label>Email</label>
                    <input type='email' name='email' required/>
                </div>
                <div class='form-group'>
                    <label>Message</label>
                    <textarea name='message' required></textarea>
                </div>
                <button type='submit'>Send</button>
            </form>
        </body>
        </html>
    "
    res.send(html)
end)

# Handle form submission
app.post("/contact", define(req, res):
    set name to req.body.name
    set email to req.body.email
    set message to req.body.message
    
    write "Form submitted:"
    write "Name: " plus name
    write "Email: " plus email
    write "Message: " plus message
    
    res.send("<h1>Thank you for contacting us!</h1><a href='/contact'>Back</a>")
end)

app.listen(3000)
```

---

## Best Practices

### 1. Organize Your Code

```vl
# components.vl - Reusable components
define navbar(brand, links):
    # navbar code
end

define footer(text):
    # footer code
end

# styles.vl - CSS styles
define getMainStyles():
    return "/* your styles */"
end

# main.vl - Main app
require "./components" as components
require "./styles" as styles
```

### 2. Use Template Literals

```vl
set name to "John"
set greeting to "Hello, " plus name plus "!"
```

### 3. Responsive Design

```vl
set responsiveCSS to "
    .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
    
    @media (max-width: 768px) {
        .container { padding: 0 1rem; }
        h1 { font-size: 2rem; }
    }
    
    @media (max-width: 480px) {
        h1 { font-size: 1.5rem; }
    }
"
```

### 4. Modern CSS Features

```vl
set modernCSS to "
    /* CSS Variables */
    :root {
        --primary: #6366f1;
        --spacing: 1rem;
    }
    
    /* Flexbox */
    .flex { display: flex; gap: var(--spacing); }
    
    /* Grid */
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing); }
    
    /* Animations */
    @keyframes slideIn {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
    }
"
```

---

## Complete Examples

Check out these full website examples:

1. **portfolio-website.vl** - Modern portfolio with animations
2. **blog-website.vl** - Complete blog platform
3. **website-builder.vl** - Multi-page site with components

---

## Running Your Website

```bash
# Build
vl build website.vl

# Run
node dist/website.mjs

# Or run directly
vl run website.vl
```

Visit `http://localhost:3000` in your browser!

---

## Next Steps

- Add a database (MongoDB, PostgreSQL)
- Implement user authentication
- Add real-time features with WebSockets
- Deploy to production (Heroku, Vercel, AWS)

**Now you can build production-ready websites with Verion Language!** 🚀
