# ✅ Mobile Setup Checklist

Print this out or keep it open while setting up!

---

## 📋 Pre-Setup Checklist

**Before you start, verify you have:**

- [ ] Computer with Windows/Mac/Linux
- [ ] Python 3.8+ installed and working
- [ ] Node.js 16+ and npm installed
- [ ] Django project at `C:\code_backup\Enrollment_api`
- [ ] Virtual environment activated
- [ ] Android phone with WiFi capability
- [ ] Expo Go app installed on phone
- [ ] Both connected to same WiFi network
- [ ] Test user credentials handy

---

## 🔍 Step 1: Find Your Computer's IP Address

**Windows:**
```powershell
# Open PowerShell
ipconfig
```
Look for: `IPv4 Address . . . . . . : 192.168.X.X`

**Write it down:**
```
My IP Address: ___.___.___.___ 

Date Found: ________________
WiFi Name: ________________________
```

- [ ] IP address found
- [ ] IP address written down
- [ ] IP is in 192.168.X.X or 10.X.X.X format

---

## ✏️ Step 2: Update Django Settings

**File:** `school_api/settings.py` (around line 30)

**Find this:**
```python
ALLOWED_HOSTS = ['127.0.0.1', 'localhost', '192.168.1.100']
```

**Change to your IP:**
```python
ALLOWED_HOSTS = [
    '127.0.0.1',
    'localhost',
    '192.168.1.50',  # ← YOUR IP HERE (example)
]
```

**Verify:**
- [ ] File opened in editor
- [ ] Line 30 area found
- [ ] IP replaced (not '192.168.1.100')
- [ ] File saved (Ctrl+S)

---

## ✏️ Step 3: Update Expo API Configuration

**File:** `expo-app/src/config/api.config.ts` (around line 30)

**Find this:**
```typescript
export const API_BASE_URL = 'http://192.168.1.100:8000/api/';
```

**Change to your IP:**
```typescript
export const API_BASE_URL = 'http://192.168.1.50:8000/api/';
// ↑ YOUR IP HERE (same as Django)
```

**Verify:**
- [ ] File opened in editor
- [ ] Line 30 area found
- [ ] IP matches Django settings (copy from there)
- [ ] Port is 8000
- [ ] URL ends with `/api/`
- [ ] File saved (Ctrl+S)

---

## 🚀 Step 4: Start Django Backend

**Open Terminal 1 (for Django):**

```powershell
# Change to project folder
cd C:\code_backup\Enrollment_api

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Start Django on all interfaces
python manage.py runserver 0.0.0.0:8000
```

**Expected output:**
```
Starting development server at http://0.0.0.0:8000/
Quit the server with CTRL-BREAK.
```

**Verify:**
- [ ] No errors (red text)
- [ ] Message says "Starting development server"
- [ ] Terminal is ready (no ">>>" prompt)
- [ ] **Leave this terminal open**

---

## 🚀 Step 5: Start Expo Frontend

**Open Terminal 2 (for Expo):**

```powershell
# Change to Expo app folder
cd C:\code_backup\Enrollment_api\expo-app

# Install dependencies (first time only)
npm install

# Start development server
npm start
```

**Expected output:**
```
› Metro waiting on exp://192.168.X.X:19000
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

 ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 █ ▄▄▄▄▄ █▀▀▀▄▄▀ ▀██▄ █▀█▀▀ █ █▀█ ▄▄▄▄▄ █
 █ █   █ █ █▀█   █  ▄▀▄ █  █ █ █ █   █ █
 █ █▄▄▄█ █▀▀▀▄▀▀█▀███▀▀██ ▀█▀▀▀ █▄▄▄█ █
 █▄▄▄▄▄▄▄█ ▀ █ ▀ █ ▀▄▄▀█▄█ ▀▄▄ ▄█▄▄▄▄▄▄▄█
 ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
```

**Verify:**
- [ ] Dependencies installed (or were already installed)
- [ ] Message shows "Metro waiting..."
- [ ] QR code is visible (above the ASCII art)
- [ ] **Leave this terminal open**

---

## 📱 Step 6: Test on Your Phone

**On your phone:**
- [ ] Phone is on same WiFi as computer
- [ ] Expo Go app is open
- [ ] Tap "Scan QR Code" button (bottom right)
- [ ] Point camera at Terminal 2 QR code
- [ ] Wait for app to load (30-60 seconds)

**Expected:**
- [ ] Loading animation appears
- [ ] Text scrolls in Expo terminal
- [ ] App loads on phone
- [ ] See login screen with email/password inputs

---

## 🔐 Step 7: Test Login

**On your phone:**

```
Email: admin@admin.edu
Password: [your admin password]
```

- [ ] Enter email address
- [ ] Enter password
- [ ] Tap "Sign In"
- [ ] Wait for processing

**Expected after login:**
- [ ] Dashboard screen appears
- [ ] Shows statistics/data
- [ ] No red error messages

---

## ✅ Success Indicators

If all these are checked, you're successful! 🎉

- [ ] Terminal 1: Django running (http://0.0.0.0:8000/)
- [ ] Terminal 2: Expo running (exp://...19000)
- [ ] Phone: App loaded from QR code
- [ ] Phone: Login works with test credentials
- [ ] Phone: Dashboard displays data
- [ ] Phone: No connection errors in app

---

## 🐛 Troubleshooting Checklist

**If something doesn't work:**

### App won't load from QR code
- [ ] QR code is visible in Terminal 2
- [ ] Phone is on same WiFi network
- [ ] Try scanning with phone camera app instead
- [ ] Try typing code manually in Expo Go
- [ ] Restart Expo: Ctrl+C in Terminal 2, then `npm start`

### "Cannot connect to backend" error
- [ ] Is Django running in Terminal 1?
- [ ] Are phone and computer on same WiFi? (check WiFi name)
- [ ] Is IP address correct in `api.config.ts`?
- [ ] Test from phone browser: `http://192.168.1.YOUR_IP:8000/api/auth/login/`

### Login doesn't work
- [ ] Is password correct?
- [ ] Are you using right email?
- [ ] Can you access `/api/auth/login/` from phone browser?
- [ ] Check Terminal 1 for error messages

### App shows blank screen
- [ ] Wait 60+ seconds for first load
- [ ] Check Terminal 2 for red error text
- [ ] Press 'r' in Terminal 2 to reload

### "Module not found" error
- [ ] In Terminal 2: `npm install`
- [ ] Wait for installation
- [ ] Restart: `npm start`

---

## 📞 If Still Stuck

**Check these files for help:**

1. **MOBILE_SETUP.md** - Detailed troubleshooting
2. **EXPO_SETUP.md** - Expo-specific issues
3. **ARCHITECTURE_GUIDE.md** - How everything connects

**Or check Terminal output:**
- Terminal 1 (Django) - Backend errors
- Terminal 2 (Expo) - Frontend errors (red text)
- Phone Logs - In Expo DevTools (Cmd+D or Cmd+M)

---

## 📝 Notes

```
IP Address Used: ___________________________

Date/Time Setup: ___________________________

Test Credentials:
  Email: _________________________
  Password: _________________________

Issues Encountered:
  _______________________________________________
  _______________________________________________

Solutions Used:
  _______________________________________________
  _______________________________________________
```

---

## 🎯 Quick Commands Reference

```powershell
# Terminal 1 - Django
cd C:\code_backup\Enrollment_api
python manage.py runserver 0.0.0.0:8000

# Terminal 2 - Expo
cd C:\code_backup\Enrollment_api\expo-app
npm install
npm start

# Find IP address
ipconfig

# Stop server (Ctrl+C then)
Ctrl+C  # In either terminal

# Reload Expo without restarting
r       # Type 'r' in Terminal 2

# Reset Expo cache
npm start -- --reset-cache
```

---

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Find IP address | 2 min |
| Update Django settings | 2 min |
| Update Expo config | 2 min |
| Start Django | 1 min |
| Install Expo deps | 3 min |
| Start Expo | 2 min |
| Load on phone | 2 min |
| Test login | 1 min |
| **Total** | **~15 minutes** |

---

## 🎉 You Did It!

Once all boxes are checked, your mobile enrollment system is ready!

Next steps:
1. Explore the app on your phone
2. Try different screens and features
3. Read MOBILE_RESPONSIVENESS.md to customize styling
4. Share the app with others (scan same QR code)

---

**Print this checklist and keep it handy! ✅**

---

**Need help? Check MOBILE_SETUP.md for detailed instructions.**
