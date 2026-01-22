# 📦 How to Publish branchguard to npm

## Simple Manual Publishing (No GitHub Actions)

### Step 1: Create npm Account

1. Go to https://www.npmjs.com/signup
2. Create your account
3. Verify your email

### Step 2: Login to npm

```bash
npm login
```

Enter your:
- Username
- Password
- Email
- One-time password (if 2FA enabled)

### Step 3: Build the Project

```bash
pnpm install
pnpm build
```

Verify the build:
```bash
ls dist/
# Should see: index.js, package.json
```

### Step 4: Publish to npm

```bash
npm publish --access public
```

That's it! Your package is now live on npm! 🎉

### Step 5: Verify

```bash
# Install globally
npm install -g branchguard

# Test it
branchguard --version
branchguard --help

# Test in a git repo
cd /path/to/test/repo
branchguard init
```

## 🔄 Publishing Updates

When you want to publish a new version:

1. **Update version in package.json**
   ```json
   "version": "1.0.1"  // was 1.0.0
   ```

2. **Update CHANGELOG.md**
   ```markdown
   ## [1.0.1] - 2025-01-22
   ### Fixed
   - Bug fixes here
   ```

3. **Build and publish**
   ```bash
   pnpm build
   npm publish
   ```

## 📋 Pre-Publish Checklist

- [ ] Logged in to npm (`npm whoami` to check)
- [ ] Version updated in package.json
- [ ] CHANGELOG.md updated
- [ ] Code committed and pushed to GitHub
- [ ] Build successful (`pnpm build`)
- [ ] dist/ folder exists with index.js

## 🎯 What Gets Published

The `.npmignore` file controls what's included:

**Included:**
- `dist/` - Built CLI (368KB)
- `README.md` - Documentation
- `LICENSE` - MIT license
- `package.json` - Metadata

**Excluded:**
- `src/` - Source files
- `website/` - Website code
- Development files
- node_modules/

## 🔍 Check Package Before Publishing

```bash
# See what will be published
npm pack --dry-run

# Create a tarball to inspect
npm pack
# Creates: branchguard-1.0.0.tgz
```

## ⚠️ Troubleshooting

### "You must be logged in"
```bash
npm login
```

### "Package name already taken"
- Choose a different name in package.json
- Or check if you own it: https://www.npmjs.com/package/branchguard

### "Build failed"
```bash
rm -rf dist node_modules
pnpm install
pnpm build
```

### "Permission denied"
```bash
# Make sure you're logged in
npm whoami

# If not logged in
npm login
```

## 🚀 After Publishing

Your package will be available at:
- npm: https://www.npmjs.com/package/branchguard
- Install: `npm install -g branchguard`
- Use: `npx branchguard init`

## 📊 Monitor Your Package

- Downloads: https://www.npmjs.com/package/branchguard
- GitHub: https://github.com/uvenkatateja/branchguard
- Issues: https://github.com/uvenkatateja/branchguard/issues

## 🎉 That's It!

No GitHub Actions, no secrets, no automation. Just:

```bash
npm login
pnpm build
npm publish --access public
```

Simple and straightforward! 🚀
