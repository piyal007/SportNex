# SportNex - Sports Club Management System

A comprehensive sports club management system built with React, Node.js, and MongoDB. This application handles user registration, membership management, court/session booking, payments, and administrative functions with role-based authentication.

## 🚀 Live Demo

- **Live Site URL**: [Your Live Site URL Here]
- **Admin Username**: [Will be set during first setup]
- **Admin Password**: [Will be set during first setup]

## ✨ Key Features

• **Role-Based Authentication** - Three user roles (User, Member, Admin) with specific permissions
• **Court Booking System** - Real-time court availability and booking management
• **Payment Integration** - Secure payment processing with Stripe
• **Membership Management** - Automatic member promotion after booking approval
• **Coupon System** - Discount codes and promotional offers
• **Admin Dashboard** - Comprehensive management tools for administrators
• **Member Dashboard** - Booking history, payments, and member-specific features
• **Responsive Design** - Mobile-first design that works on all devices
• **Real-time Notifications** - Toast notifications for all user actions
• **Announcement System** - Club updates and communication tools
• **Search & Filter** - Advanced search functionality across all modules

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **React Hot Toast** - Notification system
- **Firebase Auth** - Authentication service

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **JWT** - JSON Web Tokens for authorization
- **Stripe** - Payment processing

## 🏗️ Project Structure

```
sportnex/
├── a12-client/          # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # React contexts (Auth, etc.)
│   │   ├── pages/       # Page components
│   │   ├── layouts/     # Layout components
│   │   ├── routes/      # Route configuration
│   │   ├── utils/       # Utility functions
│   │   └── hooks/       # Custom React hooks
│   └── public/          # Static assets
└── a12-server/          # Backend Node.js application
    ├── index.js         # Main server file
    └── package.json     # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Firebase project
- Stripe account

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
4. See `ADMIN_SETUP_GUIDE.md` for detailed troubleshooting

## 📱 User Roles & Permissions

### 🔵 User (Default)
- View courts and pricing
- Book court sessions (pending approval)
- View personal profile
- Cancel pending bookings
- View announcements

### 🟢 Member (After booking approval)
- All User permissions
- View approved bookings
- Make payments for approved bookings
- View confirmed bookings
- Access payment history

### 🔴 Admin (System Administrator)
- All Member permissions
- Manage all users and members
- Approve/reject booking requests
- Manage courts and pricing
- Create and manage coupons
- Make announcements
- View system statistics
- Manage confirmed bookings

## 🔐 Security Features

- **Firebase Authentication** - Secure user authentication
- **JWT Authorization** - Token-based API access
- **Role-Based Access Control** - Granular permission system
- **Route Protection** - Frontend and backend route guards
- **Input Validation** - Comprehensive data validation
- **Secure Payment Processing** - PCI-compliant Stripe integration

## 📊 Key Workflows

### Booking Process
1. User browses available courts
2. User books a session (status: pending)
3. Admin reviews and approves booking
4. User becomes a member (if first booking)
5. Member makes payment
6. Booking confirmed

### Payment Flow
1. Member views approved bookings
2. Clicks "Pay Now" button
3. Applies coupon code (optional)
4. Completes Stripe payment
5. Booking moves to confirmed status

## 🛠️ Development

### Available Scripts

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

**Backend:**
```bash
npm start            # Start server
npm run dev          # Start with nodemon (if configured)
```

### Code Style

- **ESLint** configuration for code quality
- **Prettier** for code formatting
- **Mobile-first** responsive design approach
- **Component-based** architecture
- **Custom hooks** for reusable logic

## 📚 Documentation

- `ROLE_BASED_AUTH_GUIDE.md` - Detailed authentication system guide
- `ADMIN_SETUP_GUIDE.md` - Complete admin setup instructions
- Component documentation in respective files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation files
- Review the troubleshooting sections
- Open an issue on GitHub

---

**Built with ❤️ for Programming Hero Assignment 12**
