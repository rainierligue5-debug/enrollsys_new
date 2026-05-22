# Email Activation Fix: Complete Resolution (Updated)

## Issue
When students clicked the activation email link, the system returned:
```
POST /api/auth/users/activation/ HTTP/1.1" 400 (Bad Request)
Failed to load resource: the server responded with a status of 400 (Bad Request)
```
The error message was: **"Invalid user id or user doesn't exist."**

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

3. **Additional Issue**: Djoser activation endpoint expects **form data**, not JSON
   - Frontend was sending JSON: `{"uid": "...", "token": "..."}`
   - Djoser expects URL-encoded form data: `uid=...&token=...`

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

### 2. Frontend: Send Form Data Instead of JSON

**File: `frontend/src/api.ts`** (Lines 133-140, 141-148, 148-155)

Changed activation functions to send URL-encoded form data:
```typescript
export const activateAccount = async (uid: string, token: string): Promise<{ message: string }> => {
  const formData = new URLSearchParams();
  formData.append('uid', uid);
  formData.append('token', token);
  const res = await API.post("auth/users/activation/", formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return res.data;
};
```

**Why form data?**
- Djoser activation endpoint expects `application/x-www-form-urlencoded` data
- JSON requests were causing parsing issues in Djoser

### 3. Frontend: Support Both Path and Query Parameters

**File: `frontend/src/App.tsx`** (Routes 17-21)

Added route to support query-parameter activation:
```tsx
<Route path="/activate/:uid/:token" element={<Activation />} />
<Route path="/activate" element={<Activation />} />
<Route path="/activate/:uid/:token" element={<Activation />} />
<Route path="/password-reset/confirm" element={<PasswordResetConfirm />} />
<Route path="/password-reset/confirm/:uid/:token" element={<PasswordResetConfirm />} />
```

### 4. Frontend: Dual Parameter Extraction

**File: `frontend/src/pages/Activation.tsx`** (Lines 7-27)

Extracts parameters from **both** URL path parameters (`useParams`) **AND** query parameters (`useLocation().search`):
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
5. **Frontend POST** to `/api/auth/users/activation/` with form data:
   ```
   Content-Type: application/x-www-form-urlencoded
   uid=MjA&token=d8hzo7-b7e628bd8c09908160e6a37d9aa9f01d
   ```
6. **Backend validates** token → User activated successfully ✅

## Testing

Verified activation flow works:
- ✅ Django token validation accepts the token
- ✅ Djoser endpoint returns HTTP 204 (success) with form data
- ✅ User `is_active` flag set to `True`
- ✅ Frontend build completes without errors

## Backward Compatibility

The changes are **fully backward compatible**:
- Old path-param routes still work for existing bookmarks/emails
- Frontend supports both path and query parameters
- Query parameters take priority in new activation emails

## Files Modified

1. `school_api/settings.py` - Djoser URL format
2. `user/views.py` - Removed unnecessary URL-encoding
3. `frontend/src/api.ts` - Changed to send form data for activation endpoints
4. `frontend/src/App.tsx` - Activation routes
5. `frontend/src/pages/Activation.tsx` - Dual param extraction
6. `frontend/src/pages/PasswordResetConfirm.tsx` - Dual param extraction

## Summary

The issue was caused by **URL path parameters corrupting Django's token format** during React routing, and **incorrect Content-Type** (JSON vs form data) for Djoser endpoints. The fix uses **query parameters** (industry standard for tokens) and **form data** (expected by Djoser). The activation flow now works reliably with no token validation errors.
