# Meditrack: Patient Monitoring and Inventory Management

A full-stack PERN application for healthcare facilities to manage patient monitoring and inventory tracking with professional medical theming and secure authentication.

## 🏥 Features

### Core Functionality
- **🔐 Secure Authentication**: JWT-based login with Supabase Auth
- **📊 Dashboard**: Real-time system overview with key metrics
- **👥 Patient Monitoring**: Track patient vital signs and status
- **📦 Inventory Management**: Manage medical supplies and equipment
- **📚 Archives**: Historical patient records and data access
- **📋 System Logs**: Audit trail and activity tracking

### Security & Compliance
- **HIPAA-compliant** database with Row Level Security (RLS)
- **Role-based access control** (Admin, Doctor, Nurse, Technician)
- **Secure JWT authentication** with refresh tokens
- **Encrypted data transmission** via HTTPS
- **Comprehensive audit logging** for compliance

### User Experience
- **Medical-themed UI** with professional healthcare design
- **Responsive design** for desktop and mobile devices
- **Real-time updates** for critical patient information
- **Intuitive navigation** with sidebar and breadcrumbs

## 🚀 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS** for styling with custom medical theme
- **React Router** for navigation
- **Supabase Client** for authentication

### Backend
- **Node.js** with Express.js and TypeScript
- **Supabase** for database and authentication
- **JWT** for secure session management
- **Row Level Security** for data protection

### Database
- **PostgreSQL** via Supabase
- **Comprehensive schema** for healthcare data
- **Automated backups** and replication
- **Real-time subscriptions** for live updates

### Deployment
- **Vercel** for hosting and serverless functions
- **Automated CI/CD** pipeline
- **Environment-based configuration**
- **SSL/TLS encryption** by default

## 📁 Project Structure

```
meditrack/
├── 📁 frontend/                 # React TypeScript application
│   ├── 📁 src/
│   │   ├── 📁 components/      # Reusable UI components
│   │   │   ├── 📁 Layout/      # Sidebar, Header, Layout components
│   │   │   └── ProtectedRoute.tsx
│   │   ├── 📁 contexts/        # React contexts (Auth)
│   │   ├── 📁 pages/           # Page components
│   │   ├── 📁 types/           # TypeScript type definitions
│   │   ├── 📁 utils/           # Utility functions and Supabase client
│   │   └── App.tsx             # Main app component with routing
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── package.json
├── 📁 backend/                  # Express.js API server
│   ├── 📁 src/
│   │   ├── 📁 routes/          # API route handlers
│   │   ├── 📁 middleware/      # Authentication middleware
│   │   ├── 📁 types/           # TypeScript interfaces
│   │   ├── 📁 utils/           # Supabase client and utilities
│   │   └── server.ts           # Main server file
│   ├── tsconfig.json           # TypeScript configuration
│   └── package.json
├── 📁 database/                 # Database schema and setup
│   └── schema.sql              # Complete database schema
├── 📄 vercel.json              # Vercel deployment configuration
├── 📄 SUPABASE_SETUP.md        # Supabase setup instructions
├── 📄 DEPLOYMENT_GUIDE.md      # Detailed deployment guide
└── 📄 README.md                # This file
```

## 🛠️ Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Supabase account** (free tier available)
- **Vercel account** (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd meditrack
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up Supabase**
   - Follow instructions in `SUPABASE_SETUP.md`
   - Create your Supabase project and database
   - Run the SQL schema from `database/schema.sql`

4. **Configure environment variables**
   - Copy `backend/.env.example` to `backend/.env`
   - Copy `frontend/.env.example` to `frontend/.env`
   - Fill in your Supabase credentials

5. **Start development servers**
   ```bash
   npm run dev
   ```

### Development URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health

## 🔑 Authentication & Roles

### User Roles
- **👨‍⚕️ Admin**: Full system access and user management
- **👩‍⚕️ Doctor**: Patient management and medical records
- **👩‍⚕️ Nurse**: Patient care and monitoring
- **🔧 Technician**: Equipment and inventory management

### Demo Credentials
```
Email: admin@meditrack.com
Password: admin123
Role: Admin
```

## 🔐 Security Features

- **Row Level Security (RLS)** on all database tables
- **JWT-based authentication** with automatic token refresh
- **Role-based access control** for different user types
- **Secure password hashing** via Supabase Auth
- **HTTPS enforcement** in production
- **Comprehensive audit logging** for all user actions

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token

### Patients
- `GET /api/patients` - List all patients
- `GET /api/patients/:id` - Get patient details
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `GET /api/patients/:id/monitoring` - Get patient monitoring data
- `POST /api/patients/:id/monitoring` - Add monitoring record

### Inventory
- `GET /api/inventory/categories` - List inventory categories
- `GET /api/inventory/items` - List inventory items
- `GET /api/inventory/items/:id` - Get item details
- `POST /api/inventory/items` - Create new item
- `PUT /api/inventory/items/:id` - Update item
- `GET /api/inventory/transactions` - List transactions
- `POST /api/inventory/transactions` - Create transaction

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/health` - API health check

## 🚀 Deployment

### Quick Deploy to Vercel

1. **Push to Git repository** (GitHub, GitLab, or Bitbucket)

2. **Deploy with Vercel CLI**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

3. **Configure environment variables** in Vercel dashboard

4. **Update Supabase settings** with your production URL

For detailed deployment instructions, see `DEPLOYMENT_GUIDE.md`.

## 🔧 Development Scripts

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Start both frontend and backend in development mode
npm run dev

# Build both frontend and backend for production
npm run build

# Start production server
npm start

# Frontend only
cd frontend && npm start

# Backend only
cd backend && npm run dev
```

## 🗄️ Database Schema

The application uses a comprehensive PostgreSQL schema including:

- **profiles** - User profiles extending Supabase auth
- **patients** - Patient information and status
- **patient_monitoring** - Vital signs and monitoring records
- **inventory_categories** - Categories for medical supplies
- **inventory_items** - Medical supplies and equipment
- **inventory_transactions** - Inventory movement tracking
- **system_logs** - Comprehensive audit trail

## 🧪 Testing

```bash
# Run frontend tests
cd frontend && npm test

# Run backend tests (when implemented)
cd backend && npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is private and proprietary. All rights reserved.

## 🆘 Support

- **Setup Issues**: Check `SUPABASE_SETUP.md` and `DEPLOYMENT_GUIDE.md`
- **API Documentation**: See the API endpoints section above
- **Bug Reports**: Create an issue in the repository
- **Feature Requests**: Open a discussion in the repository

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Basic authentication and user management
- ✅ Dashboard with system overview
- ✅ Navigation and routing
- ✅ Medical-themed UI design

### Phase 2 (Next)
- 🔄 Full patient monitoring implementation
- 🔄 Complete inventory management system
- 🔄 Real-time notifications and alerts
- 🔄 Advanced reporting and analytics

### Phase 3 (Future)
- 📅 Mobile application
- 📅 Integration with medical devices
- 📅 Advanced AI/ML features
- 📅 Multi-facility support

---

**Meditrack** - Professional healthcare management for the digital age. 🏥✨