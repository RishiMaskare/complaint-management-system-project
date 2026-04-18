# Smart Campus Complaint Management System

A full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows students to submit and track campus complaints with secure authentication, strict admin control, and analytics dashboard.

## Features

### Student Features
- Register/Login with college email
- Submit complaints with category, description, and image upload
- Auto-priority detection based on keywords (urgent, danger, etc.)
- Track complaint status (Pending, In Progress, Resolved)
- View personal complaint history

### Admin Features
- Secure login (no public registration)
- Dashboard with overview statistics
- View all complaints with advanced filtering
- Update complaint status and add remarks
- Delete invalid complaints
- Analytics dashboard with charts and insights

### Security Features
- JWT-based authentication
- Role-based access control (RBAC)
- Admin creation protected by secret key
- Password hashing with bcrypt
- No role manipulation from frontend
- Protected API routes

## Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS for styling
- React Router DOM for navigation
- Axios for API calls
- Recharts for analytics charts
- React Hot Toast for notifications
- Lucide React for icons

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for image uploads
- Cloudinary for image storage (optional)
- Express Validator for input validation
- Bcrypt.js for password hashing

## Project Structure

```
complaint-ms-project/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── config/             # Configuration files
│   └── package.json
└── package.json            # Root package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository and navigate to the project folder

2. Install all dependencies:
```bash
npm run install:all
```

Or install manually:
```bash
# Root dependencies
npm install

# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

3. Set up environment variables:

Create `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/complaint-ms
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
ADMIN_SECRET_KEY=your_super_secure_admin_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name (optional)
CLOUDINARY_API_KEY=your_cloudinary_api_key (optional)
CLOUDINARY_API_SECRET=your_cloudinary_api_secret (optional)
```

Create `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Create the first admin user:

Option 1: Using the seed script
```bash
npm run seed:admin
```

Option 2: Using the API with secret key
```bash
curl -X POST http://localhost:5000/api/admin/create \
  -H "x-admin-secret-key: your_admin_secret_key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin Name",
    "email": "admin@college.edu",
    "password": "securepassword"
  }'
```

### Running the Application

Development mode (runs both frontend and backend):
```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new student
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Complaints
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints` - Get all complaints (filtered by role)
- `GET /api/complaints/:id` - Get single complaint
- `PUT /api/complaints/:id` - Update complaint (admin only)
- `DELETE /api/complaints/:id` - Delete complaint (admin only)

### Analytics
- `GET /api/analytics` - Get analytics data (admin only)

### Admin
- `POST /api/admin/create` - Create admin (requires secret key)

## Security Considerations

1. **Admin Creation**: Admins can only be created using the secret key or seed script. There is no public admin registration.

2. **Role Assignment**: User roles are assigned only in the backend. The frontend never sends role information.

3. **Authentication**: All protected routes require a valid JWT token.

4. **Authorization**: Admin routes check for admin role in addition to valid authentication.

5. **Input Validation**: All inputs are validated using express-validator.

6. **Password Security**: Passwords are hashed using bcrypt with salt rounds of 10.

## License

MIT
