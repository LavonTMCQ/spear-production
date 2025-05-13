# Spear Application Deployment Guide

This guide provides instructions for deploying the Spear application to production using Railway for the backend and database, and Vercel for the frontend.

## Prerequisites

- Railway account
- Vercel account
- PostgreSQL database on Railway
- TeamViewer API credentials

## Deployment Steps

### 1. Set Up PostgreSQL Database on Railway

1. PostgreSQL database has been set up on Railway with the following details:
   - Host: gondola.proxy.rlwy.net
   - Port: 31227
   - Username: postgres
   - Password: MZJFKNWbjshCnQHDbLsetLFvkpvUDtqh
   - Database: railway
   - Connection URL: postgresql://postgres:MZJFKNWbjshCnQHDbLsetLFvkpvUDtqh@gondola.proxy.rlwy.net:31227/railway?schema=public

### 2. Deploy Backend to Railway

1. Create a new project on Railway
2. Connect your GitHub repository
3. Configure the following environment variables:
   - `DATABASE_URL`: PostgreSQL connection string (Railway will automatically provide this)
   - `TEAMVIEWER_CLIENT_ID`: 748865-SKNA4jUQk10HvZIZhVoD
   - `TEAMVIEWER_CLIENT_SECRET`: XhWKLqAlNJM3YVkEPiFA
   - `TEAMVIEWER_REDIRECT_URI`: https://spear-app.vercel.app/api/auth/callback/teamviewer
   - `NEXTAUTH_SECRET`: spear-app-production-secret-key-change-this-in-production
   - `NEXTAUTH_URL`: https://spear-app.vercel.app

4. Deploy the application

### 3. Deploy Frontend to Vercel

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Configure the following environment variables:
   - `NEXT_PUBLIC_TEAMVIEWER_CLIENT_ID`: 748865-SKNA4jUQk10HvZIZhVoD
   - `NEXT_PUBLIC_TEAMVIEWER_CLIENT_SECRET`: XhWKLqAlNJM3YVkEPiFA
   - `NEXT_PUBLIC_TEAMVIEWER_REDIRECT_URI`: https://spear-app.vercel.app/api/auth/callback/teamviewer
   - `DATABASE_URL`: postgresql://postgres:MZJFKNWbjshCnQHDbLsetLFvkpvUDtqh@gondola.proxy.rlwy.net:31227/railway?schema=public
   - `NEXTAUTH_SECRET`: spear-app-production-secret-key-change-this-in-production
   - `NEXTAUTH_URL`: https://spear-app.vercel.app

4. Deploy the application

### 4. Run Database Migrations

After deploying to Railway, run the database migrations:

```bash
# Using Railway CLI
railway run npx prisma migrate deploy

# Or using Vercel CLI
vercel run npx prisma migrate deploy
```

### 5. Verify Deployment

1. Test the application by visiting your production URL
2. Verify that the TeamViewer integration works correctly
3. Test both admin and client roles

## Configuration Files

The following configuration files are included in the repository:

- `railway.json`: Railway deployment configuration
- `vercel.json`: Vercel deployment configuration
- `.env.production.example`: Example production environment variables

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues, verify:

1. The `DATABASE_URL` environment variable is correctly set
2. The database is accessible from your deployment environment
3. The database schema has been properly migrated

### TeamViewer Integration Issues

If the TeamViewer integration is not working:

1. Verify that the TeamViewer API credentials are correctly set
2. Check that the redirect URI is correctly configured in the TeamViewer Developer Portal
3. Ensure that the TeamViewer script token is valid

## Maintenance

### Database Backups

Railway automatically creates backups of your PostgreSQL database. You can also manually create backups:

```bash
railway run pg_dump -U postgres -d spear_db > backup.sql
```

### Monitoring

Use Railway and Vercel's built-in monitoring tools to track the performance and health of your application.

## Security Considerations

1. Ensure that all sensitive environment variables are properly secured
2. Use HTTPS for all production traffic
3. Regularly rotate API keys and secrets
4. Implement proper access controls for admin and client roles
