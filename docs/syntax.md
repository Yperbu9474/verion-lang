# Verion Language Syntax (draft)

> This is a very early draft. The current implementation only supports a few
> special forms and otherwise passes code through as JavaScript.

## Comments

```vl
# this is a comment
```

## Print

```vl
print "Hello"
print 1 + 2
```

Both compile to:

```js
console.log("Hello");
console.log(1 + 2);
```

## Roadmap

- Bot helpers: `bot.login`, `bot.on`, etc.
- DB helpers: `db.connect`, `db.query`
- Web helpers: `web.get`, `web.post`
- Android bindings (via JS/TS toolchain)
