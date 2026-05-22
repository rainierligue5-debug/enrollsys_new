# 🔗 System Architecture & Connection Guide

Complete visual guide to understand how all components connect.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR ANDROID PHONE                            │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │          EXPO GO APP (React Native)                        │  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ LoginScreen / RegisterScreen (Auth)                 │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                          ↓                                  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ AdminDashboard / StudentDashboard (Main App)       │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                          ↓                                  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ API Service Layer (Axios HTTP Calls)              │  │  │
│  │  │  • auth.service.ts                                 │  │  │
│  │  │  • students.service.ts                             │  │  │
│  │  │  • subjects.service.ts                             │  │  │
│  │  │  • enrollments.service.ts                          │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                          ↓                                  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ AsyncStorage (Token & User Data)                   │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                          ↓                                        │
│                   WiFi Network Connection                        │
│                   (Same WiFi as Computer)                        │
│                          ↓                                        │
└─────────────────────────────────────────────────────────────────┘
                          ↓
                    HTTP/REST API
                  (Port 8000 / API/)
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│              YOUR COMPUTER (DJANGO BACKEND)                      │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Django Development Server (0.0.0.0:8000)                 │  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ API Endpoints:                                      │  │  │
│  │  │  • /api/auth/login/                                 │  │  │
│  │  │  • /api/auth/register/                              │  │  │
│  │  │  • /api/students/                                   │  │  │
│  │  │  • /api/subjects/                                   │  │  │
│  │  │  • /api/sections/                                   │  │  │
│  │  │  • /api/enrollments/                                │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                          ↓                                  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ Django REST Framework                              │  │  │
│  │  │  • Authentication (JWT)                             │  │  │
│  │  │  • CORS Middleware                                  │  │  │
│  │  │  • Serializers & Views                              │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                          ↓                                  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ Database (SQLite)                                   │  │  │
│  │  │  • Users, Students, Subjects, Sections, Enrollments│  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📡 Data Flow Example: User Login

```
STEP 1: User enters email & password
┌──────────────────────────┐
│  LoginScreen             │
│  email: "admin@admin.edu"│
│  password: "password123" │
└──────┬───────────────────┘
       │ onPress handleLogin()
       ↓
STEP 2: Call authentication service
┌──────────────────────────────┐
│  auth.service.ts             │
│  login(email, password)      │
└──────┬───────────────────────┘
       │ HTTP POST Request
       ↓
STEP 3: Axios sends HTTP request
┌──────────────────────────────────────┐
│  api.config.ts                       │
│  POST /api/auth/login/               │
│  Body: { email, password }           │
│  Header: { Content-Type: JSON }      │
└──────┬───────────────────────────────┘
       │
       ├─→ Interceptor: Add Auth Token (if exists)
       │
       ↓ Over WiFi (192.168.1.100:8000)
┌──────────────────────────────────────┐
│  Django Backend                      │
│  school_api/urls.py                  │
│  → core/views.py (auth/login/)       │
└──────┬───────────────────────────────┘
       │ Authenticate User
       │ Generate JWT Token
       │ Return: {access, refresh, user}
       ↓
STEP 4: Response received
┌──────────────────────────────────────┐
│  Response:                           │
│  {                                   │
│    "access": "eyJ0eXAi...",         │
│    "refresh": "eyJ0eXAi...",        │
│    "user": {                         │
│      "id": 1,                        │
│      "email": "admin@admin.edu",    │
│      "role": "admin"                │
│    }                                 │
│  }                                   │
└──────┬───────────────────────────────┘
       │ Interceptor: Save Token
       │ AsyncStorage.setItem("access_token", ...)
       │ AsyncStorage.setItem("user", ...)
       ↓
STEP 5: Navigation to dashboard
┌──────────────────────────────────────┐
│  useAuth() hook updates user state   │
│  RootNavigator sees user.role        │
│  → AdminNavigator (if admin)         │
│  → StudentNavigator (if student)     │
└──────────────────────────────────────┘
       ↓
STEP 6: Dashboard appears
┌──────────────────────────────────────┐
│  Admin/StudentDashboard loads        │
│  Makes API calls for data            │
│  Displays content                    │
└──────────────────────────────────────┘
```

---

## 🔄 Request/Response Cycle

### Standard Request Flow

```
Phone App                          WiFi Network                   Django Server
─────────────                      ────────────                   ─────────────

User Action
    ↓
[Service Method]
    ↓
axios.post(
  'api/endpoint/',
  data,
  { headers }
)
    │
    ├─→ Interceptor: Request
    │   • Add Auth Token
    │   • Add Headers
    │
    └─→ HTTP POST Request ──────────→ 192.168.1.100:8000/api/endpoint/
                                        ↓
                                   [Django Middleware]
                                   • CORS Check
                                   • Authentication
                                   • Permission Check
                                        ↓
                                   [View/Serializer]
                                   • Process Request
                                   • Query Database
                                   • Format Response
                                        ↓
                                   HTTP 200 Response ──────────→
                                   {
                                     "data": [...],
                                     "status": "success"
                                   }
    ←──────────────────────────────────
                                     ↓
                                   [Response Handler]
                                   • Parse JSON
                                   • Interceptor: Response
                                   • Update State
                                   ↓
                                   [UI Update]
                                   • Re-render Screen
                                   • Show Data/Error
```

---

## 📝 Key Configuration Points

### 1. IP Address Configuration

```
Your Computer
└─ Find IP: ipconfig → 192.168.1.100
   ↓
   ├─→ Update Django: school_api/settings.py
   │   ALLOWED_HOSTS = ['127.0.0.1', 'localhost', '192.168.1.100']
   │
   └─→ Update Expo: expo-app/src/config/api.config.ts
       export const API_BASE_URL = 'http://192.168.1.100:8000/api/';
```

### 2. Authentication Flow

```
Token Storage (AsyncStorage)
    ↓
access_token ─→ Added to every request
    ↓
Authorization: Bearer eyJ0eXAi...
    ↓
Django validates token
    ↓
If valid: Process request
If expired: Return 401
    ↓
App catches 401 → Clear token → Navigate to Login
```

### 3. Error Handling

```
Request Sent
    ↓
Does Backend Respond?
    ├─ No → "Cannot connect to backend"
    │       Check: WiFi, IP, Django running
    │
    └─ Yes → Does Response Have Data?
             ├─ No (Error) → Show Error Message
             │              Check: CORS, Authentication, Permissions
             │
             └─ Yes (Success) → Update State & UI
```

---

## 🔐 Authentication & Security

### JWT Token Flow

```
1. Login Request
   └─→ POST /api/auth/login/
       { email, password }

2. Backend Validates
   └─→ Check credentials in database
       ├─ Valid → Generate JWT tokens
       └─ Invalid → Return 401

3. Tokens Returned
   └─→ {
       "access": "JWT_TOKEN_SHORT_LIVED",
       "refresh": "JWT_TOKEN_LONG_LIVED",
       "user": { ... }
     }

4. Token Storage
   └─→ AsyncStorage.setItem('access_token', JWT_TOKEN)
       AsyncStorage.setItem('refresh_token', JWT_TOKEN)
       AsyncStorage.setItem('user', JSON.stringify(user))

5. Subsequent Requests
   └─→ Every request includes:
       Headers: {
         'Authorization': 'Bearer JWT_TOKEN'
       }

6. Token Validation (Django)
   └─→ Check signature
       Check expiration
       Check permissions
       ├─ Valid → Process request
       └─ Invalid → Return 401 → App clears token
```

### CORS Protection

```
Request Origin: http://192.168.1.100:19000 (Expo)
    ↓
Django CORS Middleware Checks:
    ├─ Is origin in CORS_ALLOWED_ORIGINS?
    ├─ Is method in CORS_ALLOW_METHODS?
    └─ Are headers in CORS_ALLOW_HEADERS?
    ↓
Response Includes:
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
    ↓
Browser/App Accepts Response
```

---

## 🚨 Common Connection Issues

### Issue 1: Cannot Connect to Backend

```
Error Message: "Cannot connect to backend"
                "Check: 1. Django is running"
                "      2. WiFi network is same"
                "      3. API_BASE_URL is correct"

Debug Flow:
    ├─ [ ] Is Django running on Terminal 1?
    │      python manage.py runserver 0.0.0.0:8000
    │
    ├─ [ ] Is phone on same WiFi as computer?
    │      Settings → WiFi → Check network name matches
    │
    ├─ [ ] Is IP address correct in Expo app?
    │      Check: expo-app/src/config/api.config.ts
    │             export const API_BASE_URL = 'http://YOUR_IP:8000/api/';
    │
    ├─ [ ] Can you access from phone browser?
    │      Open: http://192.168.1.100:8000/api/auth/login/
    │      Should see Django API interface
    │
    └─ [ ] Is firewall blocking port 8000?
           Windows: netstat -ano | findstr :8000
```

### Issue 2: CORS Error

```
Error Message: "Access to XMLHttpRequest blocked by CORS policy"

Debug Flow:
    ├─ Check ALLOWED_HOSTS includes your IP
    │  File: school_api/settings.py
    │  ALLOWED_HOSTS = ['127.0.0.1', 'localhost', '192.168.1.100']
    │
    ├─ Check CORS settings exist
    │  CORS_ALLOW_ALL_ORIGINS = True
    │  CORS_ALLOW_CREDENTIALS = True
    │
    ├─ Restart Django server
    │  Ctrl+C then: python manage.py runserver 0.0.0.0:8000
    │
    └─ If still fails, check middleware order
       MIDDLEWARE = [
         'corsheaders.middleware.CorsMiddleware',  ← Must be first
         ...
       ]
```

### Issue 3: 401 Unauthorized

```
Error Message: "401 Unauthorized"

Debug Flow:
    ├─ Are credentials correct?
    │  Try login with: admin@admin.edu / [test_password]
    │
    ├─ Is token being saved?
    │  Check AsyncStorage in Expo DevTools
    │
    ├─ Is token being sent in requests?
    │  Check interceptor in api.config.ts
    │
    └─ Has token expired?
       JWT tokens expire after 60 minutes
       Try logging in again
```

---

## 📊 Dependency Map

### Frontend Dependencies

```
expo-app
├── React Native (Core)
├── React Navigation (Navigation)
├── Axios (HTTP Requests)
├── AsyncStorage (Local Storage)
├── React Native Community NetInfo (Network Detection)
└── React Native Vector Icons (Icons)
```

### Backend Dependencies

```
Django (Already installed)
├── Django REST Framework
├── SimpleJWT (Token Auth)
├── django-cors-headers (CORS)
├── Djoser (Auth Endpoints)
├── Cloudinary (Image Storage)
└── Other existing packages
```

---

## 🎯 Development Workflow

### Daily Development

```
1. Start Backend (Terminal 1)
   cd C:\code_backup\Enrollment_api
   python manage.py runserver 0.0.0.0:8000
   └─ Stays running all day

2. Start Frontend (Terminal 2)
   cd C:\code_backup\Enrollment_api\expo-app
   npm start
   └─ Stays running while developing

3. Make Changes
   Edit files in VS Code
   └─ Auto-reload in app

4. Test on Phone
   Scan QR code → Changes appear
   └─ Instant feedback

5. Debugging
   - Check terminal for errors (red text)
   - Use Expo DevTools (Cmd+D or Cmd+M)
   - Look at AsyncStorage, Network tab
```

### When Changing Networks

```
1. Find new IP address
   Windows: ipconfig
   
2. Update Django Settings
   school_api/settings.py
   ALLOWED_HOSTS = [..., 'NEW_IP']
   
3. Update Expo Config
   expo-app/src/config/api.config.ts
   export const API_BASE_URL = 'http://NEW_IP:8000/api/';
   
4. Restart both servers
   Terminal 1: Ctrl+C → python manage.py runserver 0.0.0.0:8000
   Terminal 2: r (for reload)
```

---

## ✅ Verification Steps

### Backend is Working

```bash
# Terminal 1
python manage.py runserver 0.0.0.0:8000

# Expected Output:
# Starting development server at http://0.0.0.0:8000/
# Quit the server with CTRL-BREAK.
```

### Frontend is Running

```bash
# Terminal 2
npm start

# Expected Output:
# › Metro waiting on exp://192.168.X.X:19000
# › Scan the QR code above with Expo Go
```

### App Connects to Backend

```
From Phone Browser:
1. Open: http://192.168.1.100:8000/api/auth/login/
2. Should see: Django API interface
3. If blank/error: Check network and IP
```

### Login Works

```
From Expo App:
1. Scan QR code
2. See login screen
3. Enter credentials: admin@admin.edu / password
4. Should see: Admin Dashboard (or Student Dashboard)
5. If error: Check terminal for details
```

---

## 📚 File Reference

| File | Purpose | Edit For |
|------|---------|----------|
| `api.config.ts` | API configuration | Changing API URL |
| `auth.service.ts` | Authentication API calls | Adding auth endpoints |
| `AuthContext.tsx` | Global auth state | Modifying auth flow |
| `RootNavigator.tsx` | Main navigation logic | Adding new screens |
| `settings.py` | Django configuration | IP/CORS settings |
| `manage.py` | Django management | Running migrations |

---

## 🚀 Quick Reference Commands

```powershell
# Find IP Address
ipconfig

# Start Django (Terminal 1)
cd C:\code_backup\Enrollment_api
python manage.py runserver 0.0.0.0:8000

# Start Expo (Terminal 2)
cd C:\code_backup\Enrollment_api\expo-app
npm start

# Reset Expo Cache
npm start -- --reset-cache

# Reinstall Dependencies
npm install

# Check Errors
npm test

# Type Checking
npx tsc
```

---

## 💡 Pro Tips

1. **Keep both terminals open** - Don't close them while developing
2. **Use Expo DevTools** - Press Cmd+D (iOS) or Cmd+M (Android)
3. **Check terminal first** - Errors show in computer terminal, not app
4. **Reload with `r`** - Just type `r` in Expo terminal to reload app
5. **Test on real device** - More accurate than emulator
6. **Keep IP written down** - You'll need it for other networks
7. **Use Postman** - Test API endpoints before connecting frontend

---

**Ready to develop? Follow MOBILE_SETUP.md to get started! 🎉**
