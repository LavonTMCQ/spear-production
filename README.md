# SPEAR - Secure Platform for Extended Augmented Reality

## Overview

SPEAR is a remote device control and subscription management application built with Next.js, featuring a modern UI with Hero UI components and shadcn/ui for streamlined development. The application provides a comprehensive solution for managing remote devices, user subscriptions, and administrative functions.

## Features

### User Features
- **Remote Device Control**: Connect to and control remote devices with a custom loading screen
- **Device Management**: Name and manage multiple devices
- **Subscription Management**: View, update, and manage subscription plans
- **Dark Mode Support**: Toggle between light and dark themes
- **Responsive Design**: Optimized for both desktop and mobile devices

### Admin Features
- **Client Management**: View and manage client accounts
- **Device Inventory**: Track and assign devices to clients
- **Subscription Oversight**: Monitor subscription statuses and payments
- **System Settings**: Configure application-wide settings
- **AI Assistant**: Intelligent assistant powered by Mastra and OpenAI to help with administrative tasks
- **Remote Access Integrations**: Comprehensive management of multiple remote access services
  - **TeamViewer Integration**: Complete TeamViewer API integration

### Notification System
- **Role-Based Notifications**: Separate admin and client notifications
- **Visual Distinction**: Clear visual indicators for different notification types
- **Notification Management**: Mark as read, delete, and manage notifications
- **Real-time Updates**: Add new notifications from anywhere in the application

## Technology Stack

- **Frontend Framework**: Next.js 15.3.0 with App Router
- **UI Components**: shadcn/ui and Hero UI
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with Prisma adapter
- **State Management**: React Context API
- **Animation**: Framer Motion
- **Icons**: Heroicons
- **AI Integration**: Mastra and OpenAI for intelligent assistance

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/spear.git
   cd spear
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables
   - Create a `.env.local` file in the root directory based on `.env.example`
   - Add your OpenAI API key: `OPENAI_API_KEY=your_openai_api_key_here`
   - Add remote access service API credentials (when available):
     ```
     # TeamViewer API Credentials
     TEAMVIEWER_CLIENT_ID=your_teamviewer_client_id
     TEAMVIEWER_CLIENT_SECRET=your_teamviewer_client_secret
     TEAMVIEWER_REDIRECT_URI=https://your-app-domain.com/api/auth/callback/teamviewer
     ```

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser

### Test Accounts

- **Admin**: admin@example.com / password
- **Client**: client@example.com / password

## Project Structure

```
/src
  /app                 # Next.js App Router pages
    /(auth)            # Authentication routes
    /admin             # Admin dashboard and features
    /dashboard         # Client dashboard and features
  /components          # Reusable components
    /admin             # Admin-specific components
    /dashboard         # Client-specific components
    /layout            # Layout components (header, sidebar, etc.)
    /ui                # UI components (buttons, cards, etc.)
  /contexts            # React Context providers
  /data                # Mock data and data models
  /lib                 # Utility libraries
  /types               # TypeScript type definitions
  /utils               # Utility functions
```

## Key Features Implementation

### Remote Access Integrations

SPEAR supports multiple remote access services, giving you flexibility in how you connect to and manage remote devices.

#### TeamViewer Integration

The TeamViewer integration provides comprehensive tools for managing remote device connections:

- **Integration Dashboard**: Dedicated page for managing the TeamViewer API integration
  - API configuration management
  - Connection settings
  - Allowlisted domains management for iframe embedding
  - Connection logs and monitoring

- **API Status Monitoring**: Real-time monitoring of TeamViewer API endpoints
  - Health status of different API endpoints
  - Response time tracking
  - Manual status check triggering

- **Bulk Device Operations**: Perform operations on multiple devices at once
  - Import devices in bulk
  - Assign multiple devices to a client
  - Revoke access for multiple devices
  - Sync devices with TeamViewer

- **Device Provisioning**: Multiple methods for device setup
  - Manual provisioning
  - QR code-based provisioning
  - Bulk provisioning for multiple devices

- **Enhanced Remote Control**: Improved remote session experience
  - Clean interface for remote sessions
  - Connection status and elapsed time tracking
  - Fullscreen mode support
  - Graceful disconnection handling



### Notification System

The notification system is implemented using React Context API to provide global state management for notifications. It includes:

- **NotificationContext**: Manages notification state and provides methods for interacting with notifications
- **NotificationProvider**: Wraps the application and provides role-based notification filtering
- **useNotifications**: Custom hook for accessing notification functionality

Notifications are categorized as either "admin" or "client" and are visually distinguished in the UI. Admin users can see both admin and client notifications, while client users can only see client notifications.

### AI Assistant

The AI Assistant is implemented using Mastra and OpenAI to provide intelligent assistance for administrative tasks. It includes:

- **Server Action**: A Next.js server action that handles AI processing on the server
- **Admin Agent**: A Mastra agent configured with specific instructions for helping administrators
- **Notification Tool**: A custom tool that allows the agent to send notifications to users
- **Conversation UI**: A chat interface for interacting with the AI assistant

The AI Assistant can help with various administrative tasks and can send both admin and client notifications when appropriate. The implementation uses Next.js server actions to handle the AI processing on the server, avoiding client-side Node.js module compatibility issues.

### Role-Based Access Control

The application implements role-based access control to ensure users only access appropriate features:

- **Admin Layout**: Checks for admin role and redirects non-admin users
- **Dashboard Layout**: Checks for client role and redirects admin users
- **Navigation Menu**: Displays different navigation options based on user role

### Subscription Management

The subscription system includes:

- **Subscription Plans**: Basic Plan ($350/month) and Additional Device Plan ($300/month/device)
- **Subscription States**: active, past_due, canceled, unpaid
- **Payment Processing**: Integration with payment processing (mock implementation)

## Deployment

The application can be deployed using various platforms:

1. Build the production version
   ```bash
   npm run build
   # or
   yarn build
   # or
   pnpm build
   ```

2. Start the production server
   ```bash
   npm start
   # or
   yarn start
   # or
   pnpm start
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
