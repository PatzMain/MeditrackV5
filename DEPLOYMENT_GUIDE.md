# Meditrack Deployment Guide

## Prerequisites

1. **Supabase Project**: Set up according to `SUPABASE_SETUP.md`
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Git Repository**: Push your code to GitHub, GitLab, or Bitbucket

## Environment Variables

### Production Environment Variables

Set these in your Vercel project settings under Environment Variables:

#### Frontend (Vercel Environment Variables)
```
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

#### Backend (Vercel Environment Variables)
```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
JWT_SECRET=your_random_jwt_secret_here
NODE_ENV=production
```

## Deployment Steps

### 1. Prepare the Repository

1. Ensure all files are committed to your Git repository
2. Push to your remote repository (GitHub/GitLab/Bitbucket)

### 2. Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (run from project root)
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: meditrack
# - Directory: ./
# - Build Command: npm run build
# - Output Directory: frontend/build
```

#### Option B: Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/build`
   - **Install Command**: `npm run install:all`

### 3. Configure Environment Variables

1. In Vercel dashboard, go to your project
2. Navigate to Settings → Environment Variables
3. Add all the environment variables listed above
4. Set Environment to "Production"

### 4. Configure Domain (Optional)

1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain if you have one
3. Follow Vercel's DNS configuration instructions

### 5. Update CORS Settings

Update the CORS origin in `backend/src/server.ts`:
```typescript
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://your-vercel-domain.vercel.app'  // Replace with your actual domain
    : 'http://localhost:3000',
  credentials: true
}));
```

### 6. Update Supabase Auth Settings

1. Go to your Supabase dashboard
2. Navigate to Authentication → Settings
3. Add your Vercel domain to the Site URL and Additional URLs:
   - Site URL: `https://your-vercel-domain.vercel.app`
   - Additional URLs: `https://your-vercel-domain.vercel.app/**`

## Project Structure for Deployment

```
meditrack/
├── frontend/          # React app (deployed to Vercel)
├── backend/           # Express API (deployed as Vercel Functions)
├── vercel.json        # Vercel configuration
├── package.json       # Root package.json with build scripts
└── README.md
```

## Build Commands

The deployment uses these scripts:

- **Root build**: `npm run build` (builds both frontend and backend)
- **Frontend build**: `npm run build --prefix frontend`
- **Backend build**: `npm run build --prefix backend`

## Monitoring and Logs

1. **Vercel Dashboard**: View deployment logs and function logs
2. **Supabase Dashboard**: Monitor database performance and API usage
3. **Browser DevTools**: Check for frontend errors

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs in Vercel dashboard

2. **Environment Variables**
   - Ensure all required env vars are set
   - Check for typos in variable names
   - Verify Supabase URLs and keys are correct

3. **CORS Errors**
   - Update CORS origin in backend
   - Add domain to Supabase auth settings

4. **Database Connection Issues**
   - Verify Supabase service key is correct
   - Check RLS policies are properly configured
   - Ensure database schema is deployed

### Performance Optimization

1. **Frontend**
   - Enable gzip compression (Vercel default)
   - Optimize images and assets
   - Implement code splitting

2. **Backend**
   - Use Vercel Edge Functions for better performance
   - Implement caching strategies
   - Optimize database queries

## Security Checklist

- [ ] All sensitive environment variables are set in Vercel (not in code)
- [ ] Supabase RLS policies are enabled and configured
- [ ] CORS is properly configured
- [ ] JWT secrets are random and secure
- [ ] HTTPS is enabled (Vercel default)
- [ ] Database backups are configured in Supabase

## Production URLs

After deployment, your application will be available at:
- **Frontend**: `https://your-project-name.vercel.app`
- **API**: `https://your-project-name.vercel.app/api`
- **Health Check**: `https://your-project-name.vercel.app/api/health`

## Maintenance

1. **Regular Updates**
   - Keep dependencies updated
   - Monitor security vulnerabilities
   - Review Vercel and Supabase usage metrics

2. **Backup Strategy**
   - Supabase automatic backups (enabled by default)
   - Export critical configuration settings
   - Document environment variables securely

3. **Monitoring**
   - Set up uptime monitoring
   - Configure error alerting
   - Monitor database performance

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Project Issues**: Create issues in your Git repository