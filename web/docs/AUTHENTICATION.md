# Authentication Setup

This application is configured as a **Single-Page Application (SPA)** using MSAL (Microsoft Authentication Library) for Azure AD authentication.

## Application Type

### Single-Page Application (SPA)
A single-page application runs entirely in the browser and fetches data (HTML, CSS, and JavaScript) dynamically or at application load time. It can call web APIs to interact with back-end data sources.

Because a SPA's code runs entirely in the browser, it's considered a **public client** that's unable to store secrets securely.

## Authentication Architecture

This application uses:
- **Framework**: React with React Router (SPA mode)
- **Authentication Library**: MSAL React (`@azure/msal-react`)
- **Browser Library**: MSAL Browser (`@azure/msal-browser`)

### Features
- ✅ Request ID tokens for user sign-in
- ✅ Request access tokens for protected web APIs
- ✅ Client-side authentication flow
- ✅ No server-side session management

## Configuration

### 1. Azure AD App Registration

Before using authentication, you need to register your application in Azure AD:

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Configure:
   - **Name**: Your application name (e.g., "BuildEvents by Contoso")
   - **Supported account types**: Choose appropriate option
   - **Redirect URI**: 
     - Platform: **Single-page application (SPA)**
     - URI: `http://localhost:5173` (for development)
5. After registration, note the **Application (client) ID**
6. Note your **Directory (tenant) ID** (from the Overview page)

### 2. Environment Variables

Create a `.env` file in the `web` directory (copy from `.env.example`):

```env
VITE_AZURE_CLIENT_ID=your-client-id-here
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
VITE_AZURE_REDIRECT_URI=http://localhost:5173
```

For multi-tenant support, use:
```env
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/common
```

### 3. SPA Mode Configuration

The application is configured in `react-router.config.ts`:

```typescript
export default {
  ssr: false,  // SPA mode enabled
} satisfies Config;
```

## Local Development

For local development, the application falls back to a default user when running on `localhost`:

```typescript
// Default user for localhost development
const defaultUser = {
  key: "seth-juarez",
  name: "Seth Juarez",
  email: "seth.juarez@microsoft.com",
  avatar: "/images/people/seth-juarez.jpg",
};
```

This allows development without requiring Azure AD configuration.

## Authentication Flow

### Sign In
When deployed (not localhost), users are authenticated using MSAL:

1. MSAL checks for existing authentication
2. If not authenticated, user can be prompted to sign in
3. User is redirected to Azure AD login page
4. After successful authentication, user is redirected back to the app
5. MSAL manages tokens and session

### User Information
The `useUser()` hook provides:
- `user`: User object with name, email, and avatar
- `loading`: Loading state during authentication
- `error`: Any authentication errors

## Code Structure

### Files
- `store/authConfig.ts`: MSAL configuration
- `store/useuser.tsx`: User authentication hook
- `app/root.tsx`: MSAL provider setup

### Usage Example

```tsx
import { useUser } from "store/useuser";

function MyComponent() {
  const { user, loading, error } = useUser();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Welcome, {user.name}!</div>;
}
```

## Deployment

When deploying to production:

1. Update redirect URIs in Azure AD app registration to include production URL
2. Set environment variables in your hosting platform
3. Ensure the application is served over HTTPS (required by Azure AD)

## References

- [MSAL React Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react)
- [Azure AD SPA Quickstart](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-v2-javascript-auth-code)
- [React Router SPA Mode](https://reactrouter.com/how-to/spa)
