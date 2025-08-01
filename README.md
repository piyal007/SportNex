# 🏆 SportNex - Sports Club Management System

A comprehensive, modern sports club management system built with React, Node.js, and MongoDB. This full-stack application provides complete solutions for sports clubs, gyms, and recreational facilities with advanced booking systems, payment processing, and administrative tools.

## 🌐 Live Demo

- **🌍 Live Site URL**: [https://assignment-12-piyal.web.app](https://assignment-12-piyal.web.app)
- **👑 Admin Username**: `admin@gmail.com`
- **🔐 Admin Password**: `Pass3ord@`

## ✨ Key Features (15+ Features)

### 🔐 Authentication & Security
- **Multi-Role Authentication System** - User, Member, and Admin roles with granular permissions
- **Firebase Authentication** - Secure, scalable authentication with email/password
- **JWT Token Management** - Secure API access with automatic token refresh
- **Route Protection** - Frontend and backend route guards for security

### 📅 Booking & Management
- **Real-Time Court Booking System** - Live availability tracking and instant booking
- **Advanced Booking Management** - Pending, approved, confirmed, and cancelled statuses
- **Slot-based Booking** - Flexible time slot selection for different court types
- **Booking History** - Complete booking timeline and status tracking

### 💳 Payment & Financial
- **Stripe Payment Integration** - Secure, PCI-compliant payment processing
- **Coupon & Discount System** - Promotional codes with expiration dates
- **Payment History** - Detailed transaction records and receipts
- **Multi-currency Support** - USD-based pricing with easy currency expansion

### 👥 User Management
- **Member Lifecycle Management** - Automatic promotion from user to member
- **Profile Management** - Comprehensive user profiles with contact information
- **Admin User Control** - Full CRUD operations for user management
- **Role-based Access Control** - Granular permissions for different user types

### 🏟️ Court & Facility Management
- **Court Type Management** - Different court types (Tennis, Basketball, etc.)
- **Dynamic Pricing** - Flexible pricing per session and court type
- **Availability Tracking** - Real-time court availability status
- **Capacity Management** - Maximum booking limits and scheduling

### 📊 Analytics & Reporting
- **Admin Dashboard** - Comprehensive statistics and analytics
- **Booking Analytics** - Revenue tracking and booking patterns
- **User Statistics** - Member growth and engagement metrics
- **Payment Reports** - Financial reporting and transaction history

### 📢 Communication
- **Announcement System** - Club-wide notifications and updates
- **Real-time Notifications** - Toast notifications for all user actions
- **Email Notifications** - Automated email alerts for booking status changes

### 🎨 User Experience
- **Responsive Design** - Mobile-first design that works on all devices
- **Modern UI/UX** - Clean, intuitive interface with Tailwind CSS
- **Dark/Light Theme** - Theme toggle for user preference
- **Loading States** - Smooth loading animations and feedback

### 🔍 Search & Filter
- **Advanced Search** - Search across courts, users, and bookings
- **Filter System** - Filter by status, date, court type, and more
- **Pagination** - Efficient data loading for large datasets

### 🛠️ Technical Excellence
- **Performance Optimized** - Fast loading with React 18 and Vite
- **SEO Friendly** - Meta tags and proper routing structure
- **Error Handling** - Comprehensive error handling and user feedback
- **Data Caching** - TanStack Query for efficient data management

## 🛠️ Technology Stack

### Frontend
- **⚛️ React 18** - Modern React with hooks and context API
- **⚡ Vite** - Lightning-fast build tool and development server
- **🎨 Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **🛣️ React Router DOM** - Client-side routing with nested routes
- **📊 TanStack Query** - Powerful data fetching, caching, and synchronization
- **🔔 React Hot Toast** - Beautiful notification system
- **🔥 Firebase Auth** - Google's authentication service
- **💳 Stripe Elements** - Secure payment form components

### Backend
- **🟢 Node.js** - JavaScript runtime environment
- **🚀 Express.js** - Fast, unopinionated web framework
- **🍃 MongoDB** - NoSQL database with Mongoose ODM
- **🔐 JWT** - JSON Web Tokens for secure authorization
- **💳 Stripe API** - Payment processing and subscription management
- **🌐 CORS** - Cross-origin resource sharing configuration

## 🏗️ Project Structure

```
sportnex/
├── 📁 a12-client/          # Frontend React application
│   ├── 📁 src/
│   │   ├── 📁 components/  # Reusable UI components
│   │   │   ├── 📁 dashboard/  # Dashboard-specific components
│   │   │   ├── 📁 navbar/     # Navigation components
│   │   │   ├── 📁 footer/     # Footer components
│   │   │   └── 📁 ui/         # Base UI components
│   │   ├── 📁 contexts/    # React contexts (Auth, Theme)
│   │   ├── 📁 pages/       # Page components
│   │   │   ├── 📁 auth/     # Authentication pages
│   │   │   ├── 📁 dashboard/ # Dashboard pages
│   │   │   ├── 📁 courts/   # Court-related pages
│   │   │   └── 📁 home/     # Home page components
│   │   ├── 📁 layouts/     # Layout components
│   │   ├── 📁 routes/      # Route configuration
│   │   ├── 📁 utils/       # Utility functions
│   │   ├── 📁 hooks/       # Custom React hooks
│   │   └── 📁 firebase/    # Firebase configuration
│   └── 📁 public/          # Static assets
└── 📁 a12-server/          # Backend Node.js application
    ├── 📄 index.js         # Main server file with all routes
    ├── 📄 package.json     # Dependencies and scripts
    └── 📄 vercel.json      # Vercel deployment configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud database)
- **Firebase project** (for authentication)
- **Stripe account** (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd sportnex
   ```

2. **Install backend dependencies**
   ```bash
   cd a12-server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../a12-client
   npm install
   ```

4. **Environment Configuration**
   
   **Backend (.env in a12-server/):**
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   DB_USER=your_db_username
   DB_PASS=your_db_password
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_PRIVATE_KEY=your_firebase_private_key
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   STRIPE_SECRET_KEY=your_stripe_secret_key
   CLIENT_URL=http://localhost:5173
   ```
   
   **Frontend (.env in a12-client/):**
   ```env
   VITE_API_URL=http://localhost:3000
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

5. **Start the applications**
   
   **Backend:**
   ```bash
   cd a12-server
   npm start
   ```
   
   **Frontend:**
   ```bash
   cd a12-client
   npm run dev
   ```

## 👑 Admin Setup (First Time)

**Important**: When you first deploy the application, no admin account exists. Follow these steps to create the first administrator:

### Automatic Setup Process

1. **Start the application** (both frontend and backend)
2. **Visit the website** - You'll see a blue banner indicating admin setup is needed
3. **Register/Login** with your desired admin account
4. **Click "Setup Admin"** in the banner or visit `/admin-setup`
5. **Complete the setup** by clicking "Create Admin Account"
6. **Access Admin Dashboard** - You'll be redirected automatically

### Manual Verification

You can verify the setup worked by:
- Checking the MongoDB users collection for a user with `role: "admin"`
- Accessing the Admin Dashboard at `/admin-dashboard`
- The setup banner should disappear after successful creation

### Troubleshooting Setup

If you encounter issues:
1. Check the browser console for errors
2. Verify backend server is running
3. Check MongoDB connection
4. Ensure all environment variables are set correctly

## 📱 User Roles & Permissions

### 🔵 User (Default Role)
- **View courts and pricing** - Browse available courts and session rates
- **Book court sessions** - Submit booking requests (pending approval)
- **View personal profile** - Access and edit personal information
- **Cancel pending bookings** - Cancel bookings before approval
- **View announcements** - Read club announcements and updates

### 🟢 Member (After booking approval)
- **All User permissions** - Everything a regular user can do
- **View approved bookings** - See bookings that have been approved
- **Make payments** - Process payments for approved bookings
- **View confirmed bookings** - Access confirmed and paid bookings
- **Payment history** - View complete transaction history
- **Member dashboard** - Access member-specific features

### 🔴 Admin (System Administrator)
- **All Member permissions** - Everything members can do
- **Manage all users** - View, edit, and delete user accounts
- **Approve/reject bookings** - Manage booking requests
- **Manage courts** - Add, edit, and remove court listings
- **Create coupons** - Generate promotional discount codes
- **Make announcements** - Post club-wide announcements
- **View system statistics** - Access analytics and reports
- **Manage confirmed bookings** - Oversee all booking operations

## 🔐 Security Features

- **🔒 Firebase Authentication** - Enterprise-grade authentication service
- **🎫 JWT Authorization** - Token-based API access with automatic refresh
- **👥 Role-Based Access Control** - Granular permission system
- **🛡️ Route Protection** - Frontend and backend route guards
- **✅ Input Validation** - Comprehensive data validation and sanitization
- **💳 Secure Payment Processing** - PCI-compliant Stripe integration
- **🔐 HTTPS Enforcement** - Secure communication protocols
- **🛡️ CORS Protection** - Cross-origin request security

## 📊 Key Workflows

### Booking Process
1. **User Registration** - New user creates account
2. **Court Browsing** - User explores available courts and pricing
3. **Booking Request** - User selects court, date, and time slots
4. **Admin Review** - Admin reviews and approves/rejects booking
5. **Member Promotion** - User automatically becomes member (if first booking)
6. **Payment Processing** - Member pays for approved booking
7. **Booking Confirmation** - Booking moves to confirmed status

### Payment Flow
1. **View Approved Bookings** - Member sees approved bookings
2. **Payment Initiation** - Member clicks "Pay Now" button
3. **Coupon Application** - Optional coupon code application
4. **Stripe Payment** - Secure payment processing
5. **Confirmation** - Booking moves to confirmed status
6. **Receipt Generation** - Payment confirmation and receipt

## 🛠️ Development

### Available Scripts

**Frontend:**
```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint for code quality
```

**Backend:**
```bash
npm start            # Start production server
npm run dev          # Start with nodemon (if configured)
```

### Code Style & Best Practices

- **ESLint Configuration** - Code quality and consistency
- **Prettier Formatting** - Automatic code formatting
- **Mobile-first Design** - Responsive design approach
- **Component Architecture** - Reusable, modular components
- **Custom Hooks** - Reusable logic and state management
- **TypeScript Ready** - Easy migration to TypeScript

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/users` - Create/update user profile
- `GET /api/user/role` - Get current user role
- `GET /api/users/:firebaseUid` - Get user profile

### Booking Endpoints
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings (admin)
- `PATCH /api/bookings/:id/status` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

### Court Endpoints
- `GET /api/courts` - Get all courts
- `POST /api/courts` - Create court (admin)
- `PUT /api/courts/:id` - Update court (admin)
- `DELETE /api/courts/:id` - Delete court (admin)

### Payment Endpoints
- `POST /api/payments/process` - Process payment
- `GET /api/payments/history` - Get payment history
- `GET /api/payments/admin` - Get all payments (admin)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** and test thoroughly
4. **Commit your changes** (`git commit -m 'Add amazing feature'`)
5. **Push to the branch** (`git push origin feature/amazing-feature`)
6. **Submit a pull request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Troubleshooting

### Common Issues

1. **MongoDB Connection Errors**
   - Verify MongoDB URI in environment variables
   - Check network connectivity
   - Ensure MongoDB service is running

2. **Firebase Authentication Issues**
   - Verify Firebase configuration
   - Check API keys in environment variables
   - Ensure Firebase project is properly set up

3. **Payment Processing Errors**
   - Verify Stripe keys are correct
   - Check Stripe account status
   - Ensure proper webhook configuration

### Getting Help

- **📖 Documentation** - Check the documentation files
- **🐛 Issues** - Open an issue on GitHub
- **💬 Discussions** - Use GitHub Discussions for questions
- **📧 Email Support** - Contact for urgent issues

## 🎯 Future Enhancements

- **📱 Mobile App** - Native iOS and Android applications
- **🔔 Push Notifications** - Real-time push notifications
- **📊 Advanced Analytics** - Detailed reporting and insights
- **🌐 Multi-language Support** - Internationalization
- **🔗 API Documentation** - Swagger/OpenAPI documentation
- **🧪 Unit Testing** - Comprehensive test coverage
- **🚀 Performance Optimization** - Advanced caching and optimization

---

**Built with ❤️ for Programming Hero Assignment 12**

*SportNex - Where Sports Meet Technology*
