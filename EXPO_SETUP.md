# Expo to Expo Go Setup Instructions

Complete step-by-step guide to run the Expo app on your phone using Expo Go.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd C:\code_backup\Enrollment_api\expo-app
npm install
```

### 2. Start Development Server

```bash
npm start
```

### 3. Scan QR Code

- Open **Expo Go** on your phone
- Tap the **"Scan QR Code"** button (bottom right)
- Scan the QR code shown in terminal
- App loads automatically

---

## 📱 Installation Guide

### On Your Computer

#### Step 1: Open Terminal

- Press `Win + R`
- Type `cmd` or `powershell`

#### Step 2: Navigate to Project

```cmd
cd C:\code_backup\Enrollment_api\expo-app
```

#### Step 3: Install Dependencies

```cmd
npm install
```

This installs all required packages. **First time may take 2-3 minutes.**

#### Step 4: Start Expo Server

```cmd
npm start
```

You should see:

```
› Metro waiting on exp://192.168.1.100:19000
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

 ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 █ ▄▄▄▄▄ █▀▀▀▄▄▀ ▀██▄ █▀█▀▀ █ █▀█ ▄▄▄▄▄ █
 █ █   █ █ █▀█   █  ▄▀▄ █  █ █ █ █   █ █
 █ █▄▄▄█ █▀▀▀▄▀▀█▀███▀▀██ ▀█▀▀▀ █▄▄▄█ █
 █▄▄▄▄▄▄▄█ ▀ █ ▀ █ ▀▄▄▀█▄█ ▀▄▄ ▄█▄▄▄▄▄▄▄█
 ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
```

**Leave this terminal open!**

### On Your Phone

#### Step 1: Install Expo Go

- **Android:** Search "Expo Go" in Google Play Store → Install
- **iOS:** Search "Expo Go" in App Store → Install

#### Step 2: Connect to WiFi

- Make sure phone is on **SAME WiFi** as computer
- Network name must be identical

#### Step 3: Open Expo Go

- Tap the app icon
- You should see a mostly blank screen with options

#### Step 4: Scan QR Code

Option A - QR Code Method:
1. Tap "Scan QR Code" (bottom right)
2. Point camera at QR code on computer screen
3. App starts loading
4. Wait 30+ seconds for first load

Option B - Manually Enter Code:
1. Look in terminal for `exp://IP:PORT`
2. Tap "Enter manually"
3. Type the code
4. App starts loading

#### Step 5: Wait for App to Load

First load takes 30-60 seconds. You'll see:
- "Connecting..." message
- Loading indicator
- Then the Enrollment System login screen

---

## 🔧 Keyboard Shortcuts in Terminal

While `npm start` is running:

| Key | Action |
|-----|--------|
| `q` | Quit |
| `a` | Open Android Emulator |
| `i` | Open iOS Simulator (Mac only) |
| `w` | Open web browser |
| `r` | Reload app |
| `d` | Open DevTools |
| `j` | Open debugger |
| `m` | Toggle menu |

---

## 🐛 Troubleshooting

### "QR Code Won't Scan"

**Solution 1:** Use phone camera
- Some phones need camera app instead of Expo app
- Take screenshot of QR code
- Open in camera app
- Should get prompt to open Expo

**Solution 2:** Manually enter code
1. Look for line: `exp://192.168.X.X:19000`
2. In Expo Go, tap "Enter manually"
3. Paste the full code

**Solution 3:** Reconnect WiFi
1. Phone → Settings → WiFi
2. Forget the network
3. Reconnect to same network
4. Try scanning again

### "App Loads Then Crashes"

**Solution 1:** Check terminal for errors
- Red text in terminal shows exact error
- Common: module not found, API URL wrong, network error

**Solution 2:** Clear cache and reload
```bash
# In terminal where npm start is running
# Press: r (for reload)
```

Or stop and restart:
```bash
# Press Ctrl+C in terminal
npm start -- --reset-cache
```

**Solution 3:** Reinstall dependencies
```bash
cd C:\code_backup\Enrollment_api\expo-app
rm -r node_modules
npm install
npm start
```

### "Cannot Connect to Backend"

**Check 1:** Same WiFi network?
- Phone WiFi name = Computer WiFi name
- Not on mobile data
- Not on different networks

**Check 2:** Django running?
```bash
# In DIFFERENT terminal
cd C:\code_backup\Enrollment_api
python manage.py runserver 0.0.0.0:8000
```

**Check 3:** Correct IP address in code?
- Edit: `expo-app/src/config/api.config.ts`
- Update: `export const API_BASE_URL = 'http://YOUR_IP:8000/api/';`
- Replace YOUR_IP with actual IP (like 192.168.1.100)

**Check 4:** Test with browser first
1. Open phone browser
2. Go to: `http://YOUR_IP:8000/`
3. If it shows page → Django is working
4. If blank/error → Network problem

### "Blank White/Black Screen"

**Solution 1:** Wait longer
- First load takes 60+ seconds
- Don't kill the app or terminal

**Solution 2:** Check for errors
- Press `Cmd+D` (iOS) or `Cmd+M` (Android) for DevTools
- Look in Logs tab for errors

**Solution 3:** Force reload
1. Close Expo Go completely
2. Reopen Expo Go
3. Scan QR code again

### "Module 'X' not found"

**Solution:**
```bash
# In expo-app folder
npm install
npm start -- --reset-cache
```

---

## 🔄 Workflow Tips

### Editing Code

1. Edit file in VS Code
2. **Save** the file (Ctrl+S)
3. App **automatically reloads** in 2-3 seconds
4. You see changes immediately
5. No need to restart terminal

### Testing Changes

1. Make code change
2. Save file
3. Verify reload in app
4. Change something visible (like button text)
5. Save and see it update

### Debugging in App

1. While app running, press `Cmd+D` (iOS) or `Cmd+M` (Android)
2. Select "Show DevTools"
3. Choose "Open Remote Debugger"
4. Browser tab opens with inspector
5. See console logs and network requests

---

## 📋 Full Checklist

Before running app:

- [ ] Node.js installed (`node -v` shows version)
- [ ] Expo CLI installed globally
- [ ] Project folder exists: `C:\code_backup\Enrollment_api\expo-app`
- [ ] `package.json` exists in that folder
- [ ] `npm install` completed successfully
- [ ] Expo Go installed on phone
- [ ] Phone on same WiFi as computer
- [ ] Django backend running (different terminal)
- [ ] IP address updated in `api.config.ts`

---

## 🎯 Common Commands

### Development

```bash
# Start dev server
npm start

# Run on specific platform
npm run android
npm run ios
npm run web

# Reset cache (if issues)
npm start -- --reset-cache

# Clean install
rm -r node_modules
npm install
npm start
```

### Production

```bash
# Build for Android
npm run build:android

# Build for iOS
npm run build:ios

# Deploy to EAS
npm run build
```

---

## 🎨 Customization

### Change App Name

Edit `app.json`:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug"
  }
}
```

### Change Colors

Edit screen files in `src/screens/`:
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f172a',  // Dark blue
  },
});
```

### Change API URL

Edit `src/config/api.config.ts`:
```typescript
export const API_BASE_URL = 'http://YOUR_IP:8000/api/';
```

---

## 🚀 Advanced Tips

### Live Reload vs Fast Refresh

The app supports both:
- **Live Reload** - Full app reload
- **Fast Refresh** - Only changed component reloads

Changes to styles → fast refresh (instant)  
Changes to logic → live reload (2-3 seconds)

### Environment Variables

For production, add `.env`:
```
REACT_APP_API_URL=https://your-api.com/api/
REACT_APP_ENV=production
```

Then in code:
```typescript
const apiUrl = process.env.REACT_APP_API_URL;
```

### Performance Optimization

1. Use FlatList instead of ScrollView for long lists
2. Memoize expensive computations
3. Lazy load images
4. Close DevTools when not debugging

---

## ✅ You're All Set!

Your Expo app is ready to use! 

**Next steps:**
1. ✅ Run `npm start` in terminal
2. ✅ Scan QR code with Expo Go
3. ✅ Log in with test credentials
4. ✅ Explore the app on your phone

---

## 📞 Need More Help?

Check these files:
- `MOBILE_SETUP.md` - Complete network setup
- `MOBILE_RESPONSIVENESS.md` - UI/UX details
- `package.json` - Dependencies
- `App.tsx` - Main entry point

---

**Happy coding! 🎉**
