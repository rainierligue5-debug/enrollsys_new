# IP Configuration Guide

## Overview
This guide explains how to configure the IP addresses for different network environments in your Enrollment System. You'll need to update these when switching between different WiFi networks.

---

## Current Network Setup
- **WiFi Network IP**: `192.168.68.109`
- **Django Backend**: `http://192.168.68.109:8000/api/`
- **React Frontend**: `http://192.168.68.109:3000`
- **Expo Mobile App**: Configured to use the above backend URL

---

## Step 1: Find Your Computer's IP Address

### On Windows:
```bash
# Open Command Prompt or PowerShell and run:
ipconfig

# Look for "IPv4 Address" under your WiFi adapter
# Example: IPv4 Address . . . . . . . . . . . : 192.168.1.100
```

### On Mac:
```bash
# Open Terminal and run:
ifconfig

# Look for "inet" under your WiFi adapter (en0 or en1)
# Example: inet 192.168.1.100 netmask 0xffffff00 broadcast 192.168.1.255
```

### On Linux:
```bash
# Open Terminal and run:
hostname -I

# Or use:
ip addr
```

---

## Step 2: Update Files with New IP Address

### A. Update `.env` file

**Location**: `Enrollment_api/.env`

**Find this line**:
```
FRONTEND_URL=http://192.168.68.109:3000
```

**Replace with** (use YOUR new IP):
```
FRONTEND_URL=http://YOUR_NEW_IP:3000
```

**Example**:
```
FRONTEND_URL=http://192.168.1.100:3000
```

---

### B. Update Expo API Configuration

**Location**: `Enrollment_api/expo-app/src/config/api.config.ts`

**Find this line**:
```typescript
export const API_BASE_URL = 'http://192.168.68.109:8000/api/';
```

**Replace with** (use YOUR new IP):
```typescript
export const API_BASE_URL = 'http://YOUR_NEW_IP:8000/api/';
```

**Example**:
```typescript
export const API_BASE_URL = 'http://192.168.1.100:8000/api/';
```

---

### C. Update Django Settings (Already Uses .env)

**Location**: `Enrollment_api/school_api/settings.py`

This file automatically reads from the `.env` file, so you only need to update `.env`. The settings.py will use:
```python
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
```

---

## Step 3: Verify Django Server

**Ensure Django is running on `0.0.0.0`**:

```bash
# Navigate to project root
cd Enrollment_api

# Run Django server
python manage.py runserver 0.0.0.0:8000
```

This allows the server to accept connections from any IP on the network.

---

## Step 4: Verify React Frontend

**Make sure React is accessible on your network**:

```bash
# Navigate to frontend directory
cd Enrollment_api/frontend

# Start React dev server
npm start

# It should start on http://localhost:3000
# But be accessible from http://192.168.68.109:3000 or your new IP
```

---

## Step 5: Update Expo App

**Option 1: Hot Reload (Faster)**
- The app uses our API config, so changes take effect after rebuilding
- Restart Expo Go or rebuild the app

**Option 2: Rebuild from Scratch**
```bash
# Navigate to Expo app directory
cd Enrollment_api/expo-app

# Rebuild the app
npm start

# Scan the QR code with Expo Go
```

---

## Step 6: Test the Connection

### From Your Mobile Device:

1. **Ensure phone is on the same WiFi network** as your computer
2. **Open Expo Go** on your mobile device
3. **Scan the QR code** from the terminal (from `npm start`)
4. **Try logging in** - this tests the backend connection
5. **Check activation emails** - this confirms the frontend URL is correct

### Test Activation:
- Create a new account on mobile
- Check your email for activation link
- The link should contain your NEW IP: `http://YOUR_NEW_IP:3000/activate/...`
- Click the link on your mobile device (same WiFi network)

---

## Common Issues & Fixes

### Issue 1: "Cannot connect to backend"
**Solution**:
- Verify your phone is on the same WiFi network
- Check that Django is running: `python manage.py runserver 0.0.0.0:8000`
- Verify the IP address is correct using `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- Test connection: Try `http://YOUR_IP:8000` in mobile browser

### Issue 2: "Activation link doesn't work"
**Solution**:
- Ensure `.env` file has the correct `FRONTEND_URL`
- The IP in the activation email should match your new IP
- Check that React frontend is running and accessible
- Manually test: `http://YOUR_NEW_IP:3000/activate/YOUR_TOKEN`

### Issue 3: "Font loading error in Expo"
**Solution**:
- This is already fixed in `App.tsx`
- Rebuild the app with `npm start` and rescan the QR code
- Clear Expo Go cache if it persists: Settings → Clear All Data

### Issue 4: "Mobile app shows stale IP"
**Solution**:
- Ensure you updated the correct file: `expo-app/src/config/api.config.ts`
- Rebuild the Expo app completely
- On iOS: Force close Expo Go and restart
- On Android: Clear app cache in Settings

---

## Automation Script (Optional)

If you frequently switch networks, you can use this script to update all IPs at once:

### Windows (PowerShell)
```powershell
# Save as: update_ip.ps1

param(
    [string]$NewIP
)

# Update .env
(Get-Content "Enrollment_api\.env") -replace 'http://[0-9.]+:3000', "http://${NewIP}:3000" | Set-Content "Enrollment_api\.env"

# Update api.config.ts
(Get-Content "Enrollment_api\expo-app\src\config\api.config.ts") -replace 'http://[0-9.]+:8000', "http://${NewIP}:8000" | Set-Content "Enrollment_api\expo-app\src\config\api.config.ts"

Write-Host "Updated all IPs to: $NewIP"
```

**Usage**:
```powershell
.\update_ip.ps1 -NewIP "192.168.1.100"
```

---

## Summary of File Changes

| File | What to Update | Current Value | Format |
|------|---|---|---|
| `.env` | `FRONTEND_URL` | `http://192.168.68.109:3000` | URL |
| `expo-app/src/config/api.config.ts` | `API_BASE_URL` | `http://192.168.68.109:8000/api/` | String |
| `school_api/settings.py` | (Automatic from .env) | N/A | (Auto-read) |

---

## Quick Checklist

When switching to a new WiFi network:

- [ ] Find your new computer IP address (`ipconfig` on Windows)
- [ ] Update `.env` with new `FRONTEND_URL`
- [ ] Update `expo-app/src/config/api.config.ts` with new `API_BASE_URL`
- [ ] Restart Django server: `python manage.py runserver 0.0.0.0:8000`
- [ ] Restart React: `npm start` in `frontend/` directory
- [ ] Rebuild Expo: `npm start` in `expo-app/` directory
- [ ] Verify phone is on the same WiFi network
- [ ] Test login and activation flow
- [ ] Check activation email has the correct IP in the link

---

## Production Deployment

For production, you would typically:
1. Use a domain name instead of IP address
2. Use HTTPS instead of HTTP
3. Set `DEBUG=False` in Django
4. Configure proper `ALLOWED_HOSTS`
5. Use environment-specific `.env` files

For more details, see `SETUP_CHECKLIST.md` and `README.md`.
