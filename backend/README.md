# Online Auction System - Spring Boot Backend

A comprehensive Java Spring Boot backend for an online auction system with role-based authentication and real-time bidding capabilities.

## Features

- **User Authentication**: JWT-based authentication with Spring Security
- **Role Management**: Customer and Admin roles with proper access control
- **Auction Management**: Create, approve, and manage auction listings
- **Bidding System**: Real-time bid placement with validation and history
- **Admin Panel**: Approve/reject auctions, manage users
- **RESTful APIs**: Complete CRUD operations for all entities

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- PostgreSQL 12 or higher

## Setup Instructions

### 1. Database Setup

Create PostgreSQL databases:

```sql
CREATE DATABASE auction_db;
CREATE DATABASE auction_db_dev;
```

### 2. Configuration

Update database credentials in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/auction_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Build and Run

```bash
# Navigate to backend directory
cd backend

# Clean and install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### 4. Default Users

The application creates default users for testing:

- **Admin**: email: `admin@auction.com`, password: `admin123`
- **Customer**: email: `customer@auction.com`, password: `customer123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Auctions
- `GET /api/auctions/active` - Get active auctions (public)
- `POST /api/auctions` - Create new auction (authenticated)
- `GET /api/auctions/my-auctions` - Get user's auctions (authenticated)
- `GET /api/auctions/{id}` - Get auction details (authenticated)
- `POST /api/auctions/{id}/bid` - Place bid (authenticated)
- `GET /api/auctions/{id}/bids` - Get bid history (authenticated)

### Admin
- `GET /api/admin/pending-auctions` - Get pending auctions (admin only)
- `GET /api/admin/all-auctions` - Get all auctions (admin only)
- `PUT /api/admin/auctions/{id}/status` - Update auction status (admin only)

### Health Check
- `GET /api/health` - Application health status

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (Unique)
- `username` (Unique)
- `password` (Hashed)
- `role` (CUSTOMER/ADMIN)
- `created_at`, `updated_at`

### Auction Items Table
- `id` (UUID, Primary Key)
- `title`, `description`
- `starting_price`, `current_price`
- `image_url`, `category`
- `auction_end`
- `status` (PENDING/APPROVED/REJECTED/ACTIVE/ENDED)
- `seller_id` (Foreign Key to Users)
- `created_at`, `updated_at`

### Bids Table
- `id` (UUID, Primary Key)
- `auction_id` (Foreign Key to Auction Items)
- `bidder_id` (Foreign Key to Users)
- `amount`
- `created_at`

## Security

- JWT tokens for authentication
- Role-based access control
- Password encryption with BCrypt
- CORS configuration for frontend integration
- Input validation and sanitization

## Development

To run in development mode:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

This uses the development database configuration from `application-dev.properties`.