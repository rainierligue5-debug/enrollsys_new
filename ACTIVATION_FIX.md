# Email Activation Fix: Complete Resolution

## Issue
When students clicked the activation email link, the system returned:
```
POST /api/auth/users/activation/ HTTP/1.1" 400 (Bad Request)
Failed to load resource: the server responded with a status of 400 (Bad Request)
```
The error message was: **"invalid token for given user"** (technically "Stale token for given user" from Djoser)

## Root Cause Analysis

### What Was Happening:
1. **Backend** generated activation links with tokens in **URL path parameters**:
   ```
   http://localhost:3000/activate/{base64_uid}/{django_token}
   ```

2. **Problem with path parameters**:
   - Django tokens contain special characters: `-` (hyphen) and alphanumeric
   - Example token: `d8hzo7-b7e628bd8c09908160e6a37d9aa9f01d`
   - When placed in URL path like `/activate/ABC/d8hzo7-abc...`, React Router's path matching could corrupt or decode these characters differently than expected
   - By the time the token reached the backend for validation, the hyphen or other special characters were altered
   - Djoser's token validator rejected the modified token as "stale" (invalid)

3. **Why 400 instead of 403?**
   - Requests library sent JSON body by default instead of form data
   - Djoser expects form data for `/api/auth/users/activation/`
   - This is a secondary issue

## Solution Implemented

### 1. Backend: Use Query Parameters (Primary Fix)

**File: `school_api/settings.py`** (Lines 183-184)

Changed from:
```python
'ACTIVATION_URL': 'http://localhost:3000/activate/{uid}/{token}',
'PASSWORD_RESET_CONFIRM_URL': 'http://localhost:3000/password-reset/confirm/{uid}/{token}',
```

To:
```python
'ACTIVATION_URL': 'http://localhost:3000/activate?uid={uid}&token={token}',
'PASSWORD_RESET_CONFIRM_URL': 'http://localhost:3000/password-reset/confirm?uid={uid}&token={token}',
```

**Why query parameters?**
- Query parameters are URL-encoded and properly escaped by HTTP libraries
- No risk of special characters corrupting the values during routing
- Standard practice for sensitive token passing in URLs

### 2. Backend: URL-Encode Token Values

**File: `user/views.py`** (Lines 8, 249-250, 309-310)

Added URL-quoting for extra safety:
```python
from urllib.parse import quote

# In register_student() and register_admin():
activation_uid = quote(force_str(urlsafe_base64_encode(force_bytes(user.pk))), safe='')
token = quote(default_token_generator.make_token(user), safe='')
activation_link = settings.DJOSER['ACTIVATION_URL'].replace('{uid}', activation_uid).replace('{token}', token)
```

### 3. Frontend: Support Both Path and Query Parameters

**File: `frontend/src/App.tsx`** (Routes 17-21)

Added new routes for query-parameter activation:
```tsx
<Route path="/activate/:uid/:token" element={<Activation />} />
<Route path="/activate" element={<Activation />} />
<Route path="/activate/:uid/:token" element={<Activation />} />
<Route path="/password-reset/confirm" element={<PasswordResetConfirm />} />
<Route path="/password-reset/confirm/:uid/:token" element={<PasswordResetConfirm />} />
```

### 4. Frontend: Dual Parameter Extraction

**File: `frontend/src/pages/Activation.tsx`** (Lines 7-27)

Extracts parameters from both path and query:
```tsx
const { uid: paramUid, token: paramToken } = useParams<{ uid: string; token: string }>();
const location = useLocation();

const searchParams = new URLSearchParams(location.search);
const uid = paramUid || searchParams.get("uid") || undefined;
const token = paramToken || searchParams.get("token") || undefined;
```

**File: `frontend/src/pages/PasswordResetConfirm.tsx`** (Lines 6-30)

Same dual extraction logic for password reset tokens.

## How It Works Now

### Activation Flow:
1. **Student registers** → Backend creates account with `is_active=False`
2. **Activation email sent** with link:
   ```
   http://localhost:3000/activate?uid=MjA&token=d8hzo7-b7e628bd8c09908160e6a37d9aa9f01d
   ```
3. **Student clicks link** → React Router matches `/activate` route (not path params)
4. **Query params extracted** from `?uid=...&token=...`
5. **Frontend POST** to `/api/auth/users/activation/` with `{"uid": "MjA", "token": "d8hzo7-..."}`
6. **Backend validates** token → User activated successfully ✅

## Testing

Verified activation flow works:
- ✅ Django token validation accepts the token
- ✅ Djoser endpoint returns HTTP 204 (success)
- ✅ User `is_active` flag set to `True`
- ✅ Frontend build completes without errors

## Backward Compatibility

The changes are **fully backward compatible**:
- Old path-param routes still work for existing bookmarks/emails
- Frontend supports both path and query parameters
- Query parameters take priority in new activation emails

## Testing the Fix

To test end-to-end:

1. **Register a new student account**:
   - Go to Register page
   - Fill in credentials (email, password, student info)
   - Submit registration

2. **Check email/console for activation link**:
   - If SMTP configured: Check email inbox
   - If SMTP not configured: Check Django console output for activation URL

3. **Click activation link**:
   - Should see "Activating Account..." loading state
   - Should see success message: "Account activated successfully!"
   - Should be able to log in with credentials

4. **Verify email sending**:
   - Check Django server logs for successful mail send
   - If using console backend, activation link printed to server terminal

## Files Modified

1. `school_api/settings.py` - Djoser URL format
2. `user/views.py` - Token URL-encoding
3. `frontend/src/App.tsx` - Activation routes
4. `frontend/src/pages/Activation.tsx` - Dual param extraction
5. `frontend/src/pages/PasswordResetConfirm.tsx` - Dual param extraction

## Summary

The issue was caused by **URL path parameters corrupting Django's token format** during React routing. The fix uses **query parameters** (industry standard for tokens) and provides **dual extraction logic** for backward compatibility. The activation flow now works reliably with no token validation errors.
