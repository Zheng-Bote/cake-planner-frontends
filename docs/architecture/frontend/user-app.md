# User App Architecture

The **User App** is the main customer-facing Angular application where users can view the cake calendar, announce cakes, and manage their profile.

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---

## Components & Pages

The application offers a rich set of features for general users:

- **Login** (`pages/login`): User authentication.
- **Register** (`pages/register-user`): New user registration flow.
- **Dashboard** (`pages/dashboard`): The landing page showing upcoming events and announcements.
- **Calendar** (`pages/calendar`): Interactive calendar to view and manage cake events.
- **Profile** (`pages/profile`): User profile management, including 2FA settings.
- **Change Password** (`pages/change-password`): Password management.

## Services (Shared Library)

The User App uses the `shared-lib` for core logic and backend communication:

- **AuthService**: Handles login, registration, and session management.
- **EventService**: Manages cake events (CRUD operations for calendar).
- **SSEService**: Handles Server-Sent Events for real-time updates (e.g., new cake announcements).
- **SystemInfoService**: Checks backend connectivity and versions.

## Models (Shared Library)

Key models include:

- **User**: User profile data.
- **Event**: Represents a cake event (date, type, description).
- **2FA**: Two-factor authentication configuration.

## Architecture Diagram

![User App Architecture](../../assets/img/architecture/frontend/architecture_user-app.png)
