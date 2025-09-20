# Supabase Setup Instructions

## 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Sign up/Login to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: "Meditrack"
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
6. Click "Create new project"

## 2. Database Setup

1. Once your project is created, go to the SQL Editor
2. Copy and paste the contents of `database/schema.sql`
3. Click "Run" to execute the schema

## 3. Environment Variables Setup

### Backend (.env)
Copy `backend/.env.example` to `backend/.env` and fill in:

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
JWT_SECRET=your_random_jwt_secret_here
```

### Frontend (.env)
Copy `frontend/.env.example` to `frontend/.env` and fill in:

```
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Get Supabase Keys

1. In your Supabase dashboard, go to Settings > API
2. Copy the Project URL and anon/public key for frontend
3. Copy the service_role key for backend (keep this secret!)

## 5. Authentication Setup

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure your site URL (for development: http://localhost:3000)
3. Add additional URLs for production when deployed

## 6. Row Level Security

The schema automatically sets up Row Level Security policies. Your tables are protected and users can only access data they're authorized to see.

## 7. Test Connection

After setup, you can test the connection by running the development servers:

```bash
npm run dev
```

The application should now connect to your Supabase database.

## Database Schema Overview

- **profiles**: User profiles extending Supabase auth
- **patients**: Patient information and status
- **patient_monitoring**: Vital signs and monitoring data
- **inventory_categories**: Categories for inventory items
- **inventory_items**: Medical supplies and equipment
- **inventory_transactions**: Track inventory movements
- **system_logs**: Audit trail for system activities

## User Roles

- **admin**: Full system access
- **doctor**: Patient management and monitoring
- **nurse**: Patient care and monitoring
- **technician**: Inventory management focus