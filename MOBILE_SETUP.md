# Complete Mobile Setup Guide for Enrollment System

This guide shows you how to run the Enrollment System on your Android phone using Expo Go and connect it to the Django backend over WiFi.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Finding Your Computer's IP Address](#finding-your-computers-ip-address)
3. [Backend Setup (Django)](#backend-setup-django)
4. [Frontend Setup (Expo)](#frontend-setup-expo)
5. [Testing the Connection](#testing-the-connection)
6. [Troubleshooting](#troubleshooting)
7. [Running Both Systems](#running-both-systems)

---

## Prerequisites

### On Your Computer

- ✅ Python 3.8+ installed
- ✅ Node.js 16+ and npm installed
- ✅ Django project in: `C:\code_backup\Enrollment_api`
- ✅ Virtual environment activated
- ✅ All dependencies installed

### On Your Phone

- ✅ Android phone with WiFi capability
- ✅ Expo Go app installed (free from Google Play Store)
- ✅ Phone connected to SAME WiFi network as computer

### Tools

- 📝 Notepad or text editor
- 🌐 Browser on your phone

---

## Finding Your Computer's IP Address

### Windows

1. **Open PowerShell:**
   - Press `Win + R`
   - Type `powershell` and press Enter

2. **Run command:**
   ```powershell
   ipconfig
   ```

3. **Find the IP address:**
   - Look for section: "Ethernet adapter" or "Wireless LAN adapter"
   - Find line: `IPv4 Address . . . . . . . . . : 192.168.X.X`
   - **This is your IP address** (example: `192.168.1.100`)

4. **Write it down** - you'll need this in multiple places

### Mac

1. **Open Terminal:**
   - Press `Cmd + Space`
   - Type `terminal` and press Enter

2. **Run command:**
   ```bash
   ifconfig | grep "inet "
   ```

3. **Find the IP address:**
   - Look for line starting with `inet` (not `inet6`)
   - It should be `192.168.X.X` or `10.0.X.X`
   - **This is your IP address**

### Linux

1. **Open Terminal**

2. **Run command:**
   ```bash
   hostname -I
   ```

3. **The output is your IP address**

---

## Backend Setup (Django)

### Step 1: Update Django Settings

Edit `school_api/settings.py`:

```python
# Around line 30, find ALLOWED_HOSTS
ALLOWED_HOSTS = [
    '127.0.0.1',
    'localhost',
    '192.168.1.100',  # ← REPLACE WITH YOUR IP ADDRESS
]
```

**Example:** If your IP is `192.168.1.50`, change it to:

```python
ALLOWED_HOSTS = [
    '127.0.0.1',
    'localhost',
    '192.168.1.50',
]
```

### Step 2: Check CORS Configuration

Verify `CORS_ALLOW_ALL_ORIGINS` is set in `school_api/settings.py`:

```python
# Around line 115
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
```

✅ Already configured - no changes needed!

### Step 3: Start Django Server

**Important:** Use `0.0.0.0:8000` to listen on all network interfaces

```powershell
# Navigate to project
cd C:\code_backup\Enrollment_api

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Run Django server on all interfaces
python manage.py runserver 0.0.0.0:8000
```

You should see:

```
Starting development server at http://0.0.0.0:8000/
Quit the server with CTRL-BREAK.
```

✅ **Backend is now accessible from your phone!**

---

## Frontend Setup (Expo)

### Step 1: Navigate to Expo App

```powershell
cd C:\code_backup\Enrollment_api\expo-app
```

### Step 2: Install Dependencies

```powershell
npm install
```

Wait for installation to complete.

### Step 3: Update API Configuration

Edit `src/config/api.config.ts` and update the URL:

```typescript
// Around line 30
export const API_BASE_URL = 'http://192.168.1.100:8000/api/';
```

**Replace `192.168.1.100` with YOUR actual IP address.**

### Step 4: Start Expo Development Server

```powershell
npm start
```

You will see:

```
› Metro waiting on exp://192.168.X.X:19000
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

**Leave this terminal open!** It will keep running your development server.

---

## Testing the Connection

### Test 1: Browser Connection (Before App)

1. **On your phone browser**, go to:
   ```
   http://192.168.1.100:8000/api/auth/login/
   ```
   (Replace IP with your actual IP)

2. **Expected:** You see a Django API interface

3. **If it doesn't work:**
   - Check WiFi connection (same network?)
   - Check firewall (might be blocking port 8000)
   - Restart router
   - Try different IP address

### Test 2: Expo QR Code Connection

1. **Open Expo Go on your phone**

2. **Scan the QR code** shown in your computer's terminal

3. **Wait for app to load** (first time takes 30+ seconds)

4. **Try to login** with test credentials:
   ```
   Email: admin@admin.edu
   Password: [your admin password]
   ```

5. **If login fails:**
   - Check error message
   - Verify API URL in `api.config.ts`
   - Check Django is still running
   - Check network connection

---

## Troubleshooting

### Issue: "Cannot connect to backend"

**Solution:**

1. ✅ Check phone and computer are on SAME WiFi
   ```powershell
   # On computer terminal, verify Django is running
   python manage.py runserver 0.0.0.0:8000
   ```

2. ✅ Verify IP address in `api.config.ts` is correct
   ```typescript
   export const API_BASE_URL = 'http://192.168.1.100:8000/api/';
   ```

3. ✅ Check firewall isn't blocking port 8000
   ```powershell
   # Windows: Check if port is listening
   netstat -ano | findstr :8000
   ```

4. ✅ Try accessing from phone browser first:
   ```
   http://192.168.1.100:8000/
   ```

### Issue: QR Code Won't Scan

**Solution:**

1. ✅ Use phone's camera app instead (for iOS)
2. ✅ Make sure you're scanning from the correct terminal
3. ✅ Try pressing `w` in terminal to open in web browser first

### Issue: "CORS error" or "Unauthorized"

**Solution:**

1. ✅ Verify CORS settings in `school_api/settings.py`
2. ✅ Check ALLOWED_HOSTS includes your IP
3. ✅ Restart Django server
4. ✅ Clear app data and try again

### Issue: "Module not found" in Expo

**Solution:**

```powershell
# In expo-app folder
npm install
npm start -- --reset-cache
```

### Issue: Page is blank on phone

**Solution:**

1. ✅ Check terminal for errors (look at computer terminal)
2. ✅ Press `Cmd+D` (iOS) or `Cmd+M` (Android) to open DevTools
3. ✅ Check the "Logs" tab for error messages
4. ✅ Take screenshot of error and compare with screenshots in this guide

---

## Running Both Systems

### Terminal 1 - Django Backend

```powershell
cd C:\code_backup\Enrollment_api
.\.venv\Scripts\Activate.ps1
python manage.py runserver 0.0.0.0:8000
```

Keep this running! You should see:
```
Starting development server at http://0.0.0.0:8000/
```

### Terminal 2 - Expo Frontend

```powershell
cd C:\code_backup\Enrollment_api\expo-app
npm start
```

Keep this running! You should see:
```
› Scan the QR code above with Expo Go
```

### Terminal 3 - Optional (For other commands)

```powershell
cd C:\code_backup\Enrollment_api
# Run migrations, tests, etc here as needed
```

---

## Quick Reference

### IP Address Locations to Update

1. **Django Settings:**
   - File: `school_api/settings.py`
   - Line: `ALLOWED_HOSTS = ['127.0.0.1', 'localhost', '192.168.1.100']`
   - Change: `192.168.1.100` to your IP

2. **Expo API Config:**
   - File: `expo-app/src/config/api.config.ts`
   - Line: `export const API_BASE_URL = 'http://192.168.1.100:8000/api/';`
   - Change: `192.168.1.100` to your IP

### Commands to Remember

```powershell
# Find your IP
ipconfig

# Start Django (Terminal 1)
python manage.py runserver 0.0.0.0:8000

# Start Expo (Terminal 2)
cd expo-app
npm start

# Test on phone browser
http://YOUR_IP:8000/api/auth/login/
```

---

## ✅ Checklist

Before testing, verify:

- [ ] Computer and phone on same WiFi network
- [ ] Django running on `0.0.0.0:8000`
- [ ] IP address found and noted
- [ ] `ALLOWED_HOSTS` updated in Django settings
- [ ] `API_BASE_URL` updated in Expo app
- [ ] Expo app installed on phone
- [ ] Test user credentials available
- [ ] Firewall allows port 8000

---

## 🎉 Ready to Test!

1. **Scan QR code** with Expo Go on your phone
2. **Wait for app to load**
3. **Sign in** with your credentials
4. **Enjoy using the app on mobile!**

---

## 📝 Notes

- **Every time** you change networks, update the IP address in both places
- **Android Emulator users:** Use `http://10.0.2.2:8000/api/` instead of IP
- **Production deployment:** Use proper domain names, not IP addresses
- **Security:** These settings are for development only. Use HTTPS and proper authentication for production

---

## Need Help?

**Check the app terminal:**
- Computer terminal shows detailed error messages
- Look for red text or "ERROR:" messages

**Common error messages:**
- `connection refused` → Django not running
- `ECONNREFUSED` → Wrong IP address
- `CORS error` → CORS not configured
- `401 Unauthorized` → Wrong credentials

---

**Happy developing! 🚀**
