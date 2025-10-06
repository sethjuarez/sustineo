# SPA Conversion Summary

## Overview
This document summarizes the conversion of the BuildEvents application from a server-side rendered (SSR) web application to a Single-Page Application (SPA) with MSAL authentication.

## What Changed

### Before (Web Application)
- **Architecture**: Server-Side Rendering (SSR) enabled
- **Authentication**: Azure Easy Auth (`/.auth/me` endpoint)
- **Client Type**: Confidential client (can store secrets)
- **Data Loading**: Server-side loaders
- **Deployment**: Requires Node.js server

### After (Single-Page Application)
- **Architecture**: Client-side only (SPA mode)
- **Authentication**: MSAL React (Azure AD)
- **Client Type**: Public client (cannot store secrets)
- **Data Loading**: Client-side with `useEffect`
- **Deployment**: Static files only (CDN-ready)

## Technical Changes

### 1. Configuration Changes
**File**: `web/react-router.config.ts`
```typescript
// Before
ssr: true

// After
ssr: false  // Enables SPA mode
```

### 2. Authentication Implementation
**New Files**:
- `web/store/authConfig.ts` - MSAL configuration
- `web/app/entry.client.tsx` - Custom entry point with MsalProvider

**Modified Files**:
- `web/store/useuser.tsx` - Now uses `useMsal()` hook instead of `fetch('/.auth/me')`

**Key Changes**:
```typescript
// Before: Server-side auth
const response = await fetch(`${WEB_ENDPOINT}/.auth/me`);
const userData = await response.json();

// After: MSAL client-side auth
const { instance, accounts } = useMsal();
const account = accounts[0];
```

### 3. Data Loading Pattern
**Modified Files**:
- `web/app/routes/home.tsx`
- `web/app/routes/app.tsx`
- `web/app/favicon.tsx`

**Before**: Server-side loaders
```typescript
export async function loader({ params }: Route.LoaderArgs) {
  const data = await fetchData();
  return data;
}

export default function Component({ loaderData }: Route.ComponentProps) {
  const data = loaderData;
  // ...
}
```

**After**: Client-side data fetching
```typescript
export default function Component() {
  const [data, setData] = useState(defaultData);
  
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchData();
      setData(result);
    };
    fetchData();
  }, []);
  // ...
}
```

### 4. Package Dependencies
**Added**:
- `@azure/msal-react` - MSAL React components and hooks
- `@azure/msal-browser` - MSAL browser authentication library

## Benefits of SPA Mode

### Advantages
1. ✅ **Simpler Deployment**: Static files only (no server required)
2. ✅ **CDN-Friendly**: Can be deployed to CDN for global distribution
3. ✅ **Lower Cost**: No server costs, just static hosting
4. ✅ **Better Caching**: Static assets can be aggressively cached
5. ✅ **Client-Side Routing**: Instant page transitions
6. ✅ **Industry Standard**: Matches Microsoft's recommended pattern for SPAs

### Trade-offs
1. ⚠️ **No SSR**: Slightly slower initial page load (mitigated by code splitting)
2. ⚠️ **Client-Side Auth**: Cannot store secrets (appropriate for public clients)
3. ⚠️ **API Required**: Must have separate API for data operations

## Authentication Flow

### Development (localhost)
- Uses default user (Seth Juarez)
- No Azure AD configuration required
- Allows local development without cloud dependencies

### Production
1. User visits application
2. MSAL checks for existing session
3. If not authenticated, redirects to Azure AD login
4. User authenticates with Microsoft credentials
5. Redirected back to app with tokens
6. MSAL manages token refresh automatically

## Environment Configuration

### Required Variables (Production)
```env
VITE_AZURE_CLIENT_ID=<your-app-client-id>
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/<tenant-id>
VITE_AZURE_REDIRECT_URI=<your-production-url>
```

### Azure AD App Registration
- **Platform**: Single-page application (SPA)
- **Redirect URIs**: Must match production URLs
- **Supported account types**: Configure as needed
- **API permissions**: User.Read (for profile access)

## Build Output

### SPA Mode Output
```
build/client/
├── assets/          # JS and CSS bundles
├── images/          # Static images
├── videos/          # Static videos
└── index.html       # Entry point (isSpaMode: true)
```

### Deployment
The `build/client` directory contains all static files needed for deployment:
- Can be deployed to Azure Static Web Apps
- Can be deployed to Azure Blob Storage with CDN
- Can be deployed to any static hosting service (Netlify, Vercel, etc.)

## Testing

### Build Verification
```bash
cd web
npm run build
# Verify: "SPA Mode: Generated build/client/index.html"
```

### Local Testing
```bash
cd web
npm run dev
# Visit: http://localhost:5173
```

### Type Checking
```bash
cd web
npm run typecheck
```

## Documentation
- **Authentication Setup**: [AUTHENTICATION.md](./AUTHENTICATION.md)
- **React Router SPA Mode**: https://reactrouter.com/how-to/spa
- **MSAL React Docs**: https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react

## Conclusion
The application is now a true Single-Page Application that follows Microsoft's recommended pattern for browser-based applications. It uses MSAL React for secure authentication and can be deployed as static files to any hosting platform.
