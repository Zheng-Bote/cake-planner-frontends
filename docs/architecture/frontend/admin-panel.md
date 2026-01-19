<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Admin Panel Architecture](#admin-panel-architecture)
  - [Components & Pages](#components--pages)
  - [Services (Shared Library)](#services-shared-library)
  - [Models (Shared Library)](#models-shared-library)
  - [Architecture Diagram](#architecture-diagram)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Admin Panel Architecture

The **Admin Panel** is an Angular application designed for administrators to manage users and departments (groups) within the Cake Planner ecosystem. It leverages a shared library for core services and models.

## Components & Pages

The application is structured into several key pages, each responsible for a specific administrative task:

- **Login** (`pages/login`): Handles administrator authentication.
- **User List** (`pages/user-list`): Displays a paginated list of registered users. Allows admins to manage user roles and details.
- **Groups** (`pages/groups`): Manages the departments or groups available in the system.

## Services (Shared Library)

The Admin Panel relies heavily on the `shared-lib` for communication with the backend:

- **AuthService**: Manages authentication state (JWT), login, and token refresh.
- **AdminService**: Provides administrative functions like fetching user lists and managing groups.
- **SystemInfoService**: Retrieves backend system information.

## Models (Shared Library)

Key data models used:

- **User**: Represents a user entity.
- **Group**: Represents a department/group.
- **SystemInfo**: Represents backend status information.

## Architecture Diagram

![Admin Panel Architecture](../assets/img/architecture/frontend/architecture_admin-panel.png)
