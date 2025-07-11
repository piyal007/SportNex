# Role-Based Authentication System Guide

## Overview

This SportNex application implements a comprehensive role-based authentication system using Firebase Authentication with Google Sign-In and custom user role management. The system automatically assigns roles and redirects users to appropriate dashboards based on their permissions.

## User Roles

### 1. **User** (Default Role)
- **Access**: Basic user dashboard
- **Permissions**: View profile, manage personal bookings, view announcements
- **Dashboard Route**: `/dashboard`

### 2. **Member** 
- **Access**: Enhanced member dashboard
- **Permissions**: All user permissions + approved bookings, payment history, member-specific features
- **Dashboard Route**: `/member-dashboard`

### 3. **Admin**
- **Access**: Full administrative dashboard
- **Permissions**: All system permissions + user management, court management, booking management, announcements, coupons
- **Dashboard Route**: `/admin-dashboard`

## System Components

### 1. AuthContext (`src/contexts/AuthContext.jsx`)

**Enhanced Features:**
- Firebase authentication integration
- Backend user synchronization
- Role management and caching
- Helper functions for role checking

**Key Functions:**
```javascript
// Role checking helpers
hasRole(role) // Check specific role
hasAnyRole(roles) // Check multiple roles
isAdmin() // Check admin role
isMemberOrAdmin() // Check member or admin role

// User management
createOrUpdateUserInBackend(user) // Sync with backend
fetchUserRole() // Get user role from backend
```

### 2. Role-Based Route Protection (`src/components/RoleBasedRoute.jsx`)

**Components:**
- `RoleBasedRoute` - Generic role protection
- `AdminRoute` - Admin-only access
- `MemberRoute` - Member and Admin access
- `UserRoute` - All authenticated users
- `MemberOrAdminRoute` - Member and Admin only

**Features:**
- Automatic role verification
- Loading states during authentication
- Unauthorized access handling with toast notifications
- Redirect to login for unauthenticated users

### 3. Automatic Role-Based Redirection (`src/components/RoleBasedRedirect.jsx`)

**Purpose:**
- Automatically redirects users to appropriate dashboards after login
- Handles intended destination preservation
- Provides smooth user experience with loading indicators

**Redirect Logic:**
- `admin` → `/admin-dashboard`
- `member` → `/member-dashboard`
- `user` → `/dashboard`
- Fallback → `/dashboard`

### 4. Enhanced Navbar (`src/components/navbar/Navbar.jsx`)

**Role-Based Features:**
- Dynamic dashboard links based on user role
- Admin users see "Admin Dashboard"
- Members see "Member Dashboard"
- Regular users see "Dashboard"
- Responsive design for mobile and desktop

## Authentication Flow

### 1. **Registration Process**
```
User Registration (Firebase) 
→ Create/Update User in Backend 
→ Assign Default Role ('user') 
→ Redirect to Role-Based Dashboard
```

### 2. **Login Process**
```
User Login (Firebase) 
→ Fetch User Role from Backend 
→ Update AuthContext State 
→ Redirect to Role-Based Dashboard
```

### 3. **Google Sign-In Process**
```
Google Authentication (Firebase) 
→ Create/Update User in Backend 
→ Assign/Fetch Role 
→ Redirect to Role-Based Dashboard
```

## Backend Integration

### API Endpoints

**User Management:**
```javascript
// Create or update user
POST /api/users
Body: { uid, email, displayName, photoURL }

// Get user by UID
GET /api/users/:uid

// Update user role (Admin only)
PATCH /api/users/:uid/role
Body: { role: 'user' | 'member' | 'admin' }
```

### Database Schema

**Users Collection:**
```javascript
{
  uid: String, // Firebase UID
  email: String,
  displayName: String,
  photoURL: String,
  role: String, // 'user', 'member', 'admin'
  createdAt: Date,
  updatedAt: Date
}
```

## Usage Examples

### 1. **Protecting Routes**

```jsx
// Admin-only route
<Route path="/admin-dashboard/*" element={
  <AdminRoute>
    <AdminDashboard />
  </AdminRoute>
} />

// Member and Admin route
<Route path="/member-dashboard/*" element={
  <MemberRoute>
    <MemberDashboard />
  </MemberRoute>
} />

// All authenticated users
<Route path="/dashboard/*" element={
  <UserRoute>
    <UserDashboard />
  </UserRoute>
} />
```

### 2. **Conditional Rendering Based on Roles**

```jsx
const { userRole, isAdmin, isMemberOrAdmin } = useAuth();

return (
  <div>
    {isAdmin() && <AdminPanel />}
    {isMemberOrAdmin() && <MemberFeatures />}
    {userRole === 'user' && <BasicFeatures />}
  </div>
);
```

### 3. **Role-Based Navigation**

```jsx
const { userRole, isAdmin } = useAuth();

const getDashboardLink = () => {
  if (isAdmin()) return '/admin-dashboard';
  if (userRole === 'member') return '/member-dashboard';
  return '/dashboard';
};
```

## Security Features

### 1. **Frontend Protection**
- Route-level protection with role verification
- Component-level conditional rendering
- Automatic redirects for unauthorized access
- Loading states to prevent UI flashing

### 2. **Backend Protection**
- JWT token verification middleware
- Role-based access control for API endpoints
- User role validation on each request
- Secure user creation and role assignment

### 3. **Data Persistence**
- User roles stored in backend database
- Local storage for role caching
- Automatic role refresh on authentication state changes
- Fallback mechanisms for role retrieval

## Environment Configuration

### Frontend (.env)
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend API
VITE_API_BASE_URL=http://localhost:3000

# Stripe (for payments)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Backend (.env)
```env
# Server Configuration
PORT=3000
CLIENT_URL=http://localhost:5173

# Database
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=sportnex

# JWT
ACCESS_TOKEN_SECRET=your_jwt_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Development Setup

### 1. **Start Backend Server**
```bash
cd a12-server
npm install
npm start
# Server runs on http://localhost:3000
```

### 2. **Start Frontend Development Server**
```bash
cd a12-client
npm install
npm run dev
# Client runs on http://localhost:5173
```

### 3. **Test Role-Based Authentication**
1. Register a new user (gets 'user' role by default)
2. Login and verify redirect to `/dashboard`
3. Manually update user role in database to 'admin'
4. Login again and verify redirect to `/admin-dashboard`

## Troubleshooting

### Common Issues

1. **User not redirecting to correct dashboard**
   - Check if backend is running and accessible
   - Verify user role in database
   - Check browser console for API errors

2. **Role not updating after database change**
   - Clear localStorage: `localStorage.clear()`
   - Logout and login again
   - Check if `fetchUserRole()` is being called

3. **Unauthorized access errors**
   - Verify JWT token is being sent with requests
   - Check if user role matches route requirements
   - Ensure backend middleware is properly configured

### Debug Tips

```javascript
// Check current user state
console.log('User:', user);
console.log('User Role:', userRole);
console.log('Is Admin:', isAdmin());
console.log('Is Member or Admin:', isMemberOrAdmin());

// Check localStorage
console.log('Stored Role:', localStorage.getItem('userRole'));
console.log('Stored User:', localStorage.getItem('userDoc'));
```

## Best Practices

1. **Always use role-based route protection** for sensitive pages
2. **Implement both frontend and backend validation** for security
3. **Use loading states** to prevent UI flashing during authentication
4. **Provide clear error messages** for unauthorized access
5. **Cache user roles** to improve performance
6. **Implement proper logout** to clear all user data
7. **Test all role combinations** thoroughly
8. **Keep role logic centralized** in AuthContext

## Future Enhancements

1. **Role Hierarchy**: Implement role inheritance (admin > member > user)
2. **Permission System**: Granular permissions beyond roles
3. **Role Management UI**: Admin interface for role assignment
4. **Audit Logging**: Track role changes and access attempts
5. **Session Management**: Advanced session handling and timeout
6. **Multi-factor Authentication**: Enhanced security features