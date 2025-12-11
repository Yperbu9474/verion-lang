# How to Fix npm Publish 403 Error (2FA Required)

## The Problem

npm requires **Two-Factor Authentication (2FA)** to publish packages. You need to either:
1. Enable 2FA on your npm account, OR
2. Use an access token with 2FA bypass

## Solution: Enable 2FA (Recommended)

### Step 1: Enable 2FA on npm

1. Go to https://www.npmjs.com/settings/YOUR_USERNAME/tfa
2. Or: `npm profile enable-2fa auth-and-writes`
3. Choose your authentication method:
   - **Authenticator App** (Google Authenticator, Authy) - RECOMMENDED
   - **SMS** (less secure)

4. Follow the prompts to set up 2FA

### Step 2: Publish with 2FA

```bash
npm publish
```

You'll be prompted for your 2FA code during publish.

---

## Alternative: Use Access Token (For CI/CD)

### Step 1: Generate Access Token

1. Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Click "Generate New Token"
3. Choose "Automation" token type (has 2FA bypass)
4. Set permissions:
   - ✅ Read and write packages
5. Copy the token (you'll only see it once!)

### Step 2: Login with Token

```bash
# Set token as environment variable
$env:NPM_TOKEN = "npm_XXXXXXXXXXXXXXXXXXXXXXXXXX"

# Or configure npm to use token
npm config set //registry.npmjs.org/:_authToken="npm_XXXXXXXXXXXXXXXXXXXXXXXXXX"
```

### Step 3: Publish

```bash
npm publish
```

---

## Quick Commands

```bash
# Check if you're logged in
npm whoami

# Login to npm
npm login

# Enable 2FA (easiest way)
npm profile enable-2fa auth-and-writes

# Publish (will prompt for 2FA code)
npm publish

# Publish with specific tag
npm publish --tag latest

# Publish with access level
npm publish --access public
```

---

## After Publishing Successfully

### Verify Your Package

```bash
# View on npm
npm view verion-lang

# Install and test
npm install -g verion-lang
vl --version
vl run examples/hello.vl
```

### Share Your Package

- npm page: https://www.npmjs.com/package/verion-lang
- GitHub releases
- Social media / Reddit / HN

---

## Common Issues

### "Package name already taken"
If `verion-lang` is taken, try:
- `@yourusername/verion-lang` (scoped package)
- `verion-language`
- `vl-lang`

Update `package.json`:
```json
{
  "name": "@yourusername/verion-lang"
}
```

### "You do not have permission"
Make sure you're logged in as the right user:
```bash
npm whoami
npm logout
npm login
```

### "Invalid version"
npm uses semantic versioning (semver):
```bash
npm version 1.0.0
npm publish
```

---

## Security Best Practices

1. ✅ Always use 2FA
2. ✅ Never share your npm token
3. ✅ Use automation tokens for CI/CD
4. ✅ Regularly rotate tokens
5. ✅ Review package access regularly

---

## Next Steps

1. **Enable 2FA**: `npm profile enable-2fa auth-and-writes`
2. **Publish**: `npm publish`
3. **Verify**: `npm view verion-lang`
4. **Share**: Tell the world about your language! 🎉

Need help? https://docs.npmjs.com/about-two-factor-authentication
