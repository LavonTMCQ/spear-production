Build a TeamViewer integration
Last Modified: Jun 21, 2023

Developers can create their own integration for attended access with connection reports to the TeamViewer platform using public TeamViewer APIs.

It is strongly recommended to read the API documentation for a detailed description of the functionality used below and for further functionality (e.g. unattended access), which can be included via public APIs.

The API calls use a bearer token for authorization to enable communication with the TeamViewer backend. This token can be either obtained as a script token via the TeamViewer (Classic) Management Console or (recommended and described here) via the OAuth procedure described below.

Once implemented, OAuth can be used to obtain a bearer token from TeamViewer for each platform user. Enable them to connect from the platform where TeamViewer is integrated using their TeamViewer account, create sessions, and get connection reports. 

This article will cover the following calls:

Authentication via OAuth
Session creation
Connection reporting
📌Note: Please get in touch with a TeamViewer representative for deeper technical integration and commercial collaboration, including using TeamViewer trademarks.

This article applies to developers who want to build an integration with TeamViewer.

Prerequisites
To authenticate with the TeamViewer backend, a TeamViewer account is needed, which can be created for free at: https://login.teamviewer.com

💡Hint: We recommend using a generic account for your company (e.g. admin@yourcompany.com).

📌Note: Once the integration is in place, all users who want to use the integration need a TeamViewer account, and TeamViewer license requirements apply.

Create a client app for OAuth
The OAuth procedure requires that the backend provides a client app with the client id and client secret.

1) Click on your user icon and select Edit profile

image.png
2) Select Apps

3) Click Create App

4) Give the app a meaningful name

5) Give the app a meaningful description

6) Set the redirect URI of your application

7) Set the app permissions (Session, account, and connection reports are required)

8) Click Create

image.png
You can create a script token to test the API calls without OAuth.

OAuth
To enable the users to obtain a bearer token for regular users, the app needs to provide the following functionality: 

1) Call to get the TeamViewer OAuth login mask (Must be called in a browser)

Here is one example:

https://login.teamviewer.com/oauth2/authorize?response_type=code&client_id=123456-pDPThfDpeAnIXmuEDSSJ&redirect_uri=http://www.google.com&display=popup

💡Hint: The ClientID, Client Secret, and redirect_uri are the same ones created above.

image.png
2) This call returns a code that needs to be included in the call below together with the client secret from your client apps

image.png
Sessions for attended access
A session a supporter can share with an end customer is created with the following call.

This call will provide, among other information 3 links:

Supporter link
Supporter link for WebClient
End customer link
The supporter links (1 & 2) shall be shown to the supporter to activate the TeamViewer connection from their side. The WebClient link can be used if the support session shall be launched from the browser if no installation on the Supporter side is wanted.

The end customer link will be shown on the end customer's side. Once the end customer clicks on it, it will connect to the session via the installed TeamViewer client or the TeamViewer Quicksupport module.

The API call
POST: https://webapi.teamviewer.com/api/v1/docs/index#/

Body:

{
"groupname":"TV_test",
"description": "Issue with configuration of corporate email in domain \\example.com",
            "end_customer": {
                "name": "John Doe",
                "email": "john.doe@example.com"
            },
}
For further details, please check the API documentation.

image.png
Use the bearer token obtained via OAuth to execute the API call.

image.png
Connection Reporting
For auditing purposes and to provide a history for documentation e.g. in a ticketing system, TeamViewer provides connection reports which can be obtained with the following call:

https://webapi.teamviewer.com/api/v1/reports/connections  

The call returns all connections, including their session IDs.

API Documentation
Please find below further documentation about API.

PDF
https://dl.teamviewer.com/integrate/TeamViewer _API_Documentation.pdf

Swagger documentation
https://webapi.teamviewer.com/api/v1/docs/index#/