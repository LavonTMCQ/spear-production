# TeamViewer API Endpoints Reference

This document outlines the key TeamViewer API endpoints that will be used in our SPEAR application for remote device control and subscription management.

## Authentication

```
/api/v1/oauth2/authorize
```
- **Purpose**: Initiate the OAuth 2.0 authorization flow
- **Method**: `GET`
- **Parameters**:
  - `client_id`: Your TeamViewer application client ID
  - `response_type`: Set to "code"
  - `redirect_uri`: Your application's callback URL

```
/api/v1/oauth2/token
```
- **Purpose**: Exchange authorization code for access token
- **Method**: `POST`
- **Parameters**:
  - `client_id`: Your TeamViewer application client ID
  - `client_secret`: Your TeamViewer application client secret
  - `code`: The authorization code received from the authorize endpoint
  - `grant_type`: Set to "authorization_code"
  - `redirect_uri`: Must match the redirect URI used in the authorization request

```
/api/v1/oauth2/revoke
```
- **Purpose**: Revoke an access token
- **Method**: `POST`
- **Parameters**:
  - `token`: The access token to revoke

## Session Management

```
/api/v1/sessions
```
- **Purpose**: Create and manage remote control sessions
- **Methods**: 
  - `GET /api/v1/sessions` - List all sessions
  - `POST /api/v1/sessions` - Create a new session
  - `GET /api/v1/sessions/{sessionId}` - Get details of a specific session
  - `DELETE /api/v1/sessions/{sessionId}` - End/close a specific session

```
/api/v1/sessions/{sessionId}/state
```
- **Purpose**: Manage the state of a session (start, pause, resume)
- **Methods**:
  - `PUT /api/v1/sessions/{sessionId}/state` - Update session state

## User Management

```
/api/v1/users
```
- **Purpose**: Create and manage user accounts
- **Methods**:
  - `GET /api/v1/users` - List all users
  - `POST /api/v1/users` - Create a new user
  - `GET /api/v1/users/{userId}` - Get details of a specific user
  - `PUT /api/v1/users/{userId}` - Update a user's information
  - `DELETE /api/v1/users/{userId}` - Delete a user

```
/api/v1/users/{userId}/permissions
```
- **Purpose**: Manage user permissions
- **Methods**:
  - `GET /api/v1/users/{userId}/permissions` - Get user permissions
  - `PUT /api/v1/users/{userId}/permissions` - Update user permissions

## Group Management

```
/api/v1/groups
```
- **Purpose**: Create and manage groups for device organization
- **Methods**:
  - `GET /api/v1/groups` - List all groups
  - `POST /api/v1/groups` - Create a new group
  - `GET /api/v1/groups/{groupId}` - Get details of a specific group
  - `PUT /api/v1/groups/{groupId}` - Update a group
  - `DELETE /api/v1/groups/{groupId}` - Delete a group

```
/api/v1/groups/{groupId}/share
```
- **Purpose**: Share groups with other users
- **Methods**:
  - `POST /api/v1/groups/{groupId}/share` - Share a group

## Device Management

```
/api/v1/devices
```
- **Purpose**: Manage devices in your TeamViewer account
- **Methods**:
  - `GET /api/v1/devices` - List all devices
  - `GET /api/v1/devices/{deviceId}` - Get details of a specific device
  - `PUT /api/v1/devices/{deviceId}` - Update device information

```
/api/v1/devices/{deviceId}/access
```
- **Purpose**: Control access to specific devices
- **Methods**:
  - `GET /api/v1/devices/{deviceId}/access` - Get access information
  - `PUT /api/v1/devices/{deviceId}/access` - Update access permissions

## Web Client Embedding

For embedding the TeamViewer Web Client in an iframe, you would use:

```html
<iframe 
  src="https://web.teamviewer.com/v15/?connect={deviceId}" 
  width="800" 
  height="600"
  allow="microphone; camera; fullscreen"
></iframe>
```

Note: The exact URL structure may vary, and as mentioned in the documentation, the domain needs to be allowlisted in the TeamViewer application.

## Implementation Flow Examples

### User Registration and Device Assignment
1. Create a TeamViewer user account:
   ```
   POST /api/v1/users
   ```
2. Create a group for the user:
   ```
   POST /api/v1/groups
   ```
3. Share the group with the user:
   ```
   POST /api/v1/groups/{groupId}/share
   ```
4. Add devices to the group:
   ```
   PUT /api/v1/devices/{deviceId}
   ```

### Starting a Remote Control Session
1. Create a new session:
   ```
   POST /api/v1/sessions
   ```
2. Embed the session in an iframe or redirect to the TeamViewer web client

### Revoking Access (Subscription Ended)
1. Update user permissions to revoke access:
   ```
   PUT /api/v1/users/{userId}/permissions
   ```
2. Update device access settings:
   ```
   PUT /api/v1/devices/{deviceId}/access
   ```
3. End any active sessions:
   ```
   DELETE /api/v1/sessions/{sessionId}
   ```

## Important Considerations

1. **Authentication**: All API requests require OAuth 2.0 authentication
2. **Rate Limits**: TeamViewer likely imposes rate limits on API calls
3. **Allowlisting**: For iframe embedding, your domain needs to be allowlisted
4. **Licensing**: Some endpoints may only be available with specific license tiers

## Next Steps

When we get access to the full TeamViewer API documentation:
1. Verify the exact parameter requirements for each endpoint
2. Confirm response formats and status codes
3. Check for any limitations or quotas
4. Explore webhook capabilities for real-time notifications
