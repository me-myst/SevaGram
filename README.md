# SevaGram - Rural Home Services Platform

**Connecting rural communities with essential home services**

## 🎯 Project Overview

SevaGram is a web platform designed to bridge the gap between service providers and customers in rural areas. We provide essential home services including plumbing, electrical work, carpentry, agriculture equipment repair, and more.

## 🛠️ Tech Stack

- **Frontend:** React.js, Bootstrap, HTML5, CSS3
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Payment Integration:** Razorpay/Stripe

## 📋 Features

### Customer Features

- User registration and login
- Browse services by category
- Search for service providers by location
- Book services with scheduling
- Track booking status
- Rate and review service providers
- Multiple payment options (Cash, UPI, Wallet)

### Service Provider Features

- Provider registration with verification
- Profile management
- Accept/reject booking requests
- Manage availability
- Track earnings
- View ratings and feedback

### Admin Features

- User and provider management
- Service category management
- Booking monitoring
- Analytics dashboard
- Payment tracking

## 🗂️ Project Structure

```
sevagram/
├── frontend/                 # React application
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── ServiceCard.js
│   │   │   └── BookingForm.js
│   │   ├── pages/           # Page components
│   │   │   ├── Home.js
│   │   │   ├── Services.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   └── BookService.js
│   │   ├── services/        # API calls
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── bookingService.js
│   │   ├── context/         # React Context for state
│   │   │   └── AuthContext.js
│   │   ├── utils/           # Helper functions
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
├── backend/                  # Node.js + Express API
│   ├── controllers/         # Route handlers
│   │   ├── authController.js
│   │   ├── serviceController.js
│   │   ├── bookingController.js
│   │   └── userController.js
│   ├── models/              # MongoDB schemas
│   │   ├── User.js
│   │   ├── ServiceProvider.js
│   │   ├── Service.js
│   │   ├── Booking.js
│   │   └── Review.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── config/              # Configuration files
│   │   └── db.js
│   ├── utils/               # Helper functions
│   ├── server.js            # Entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/me-myst/sevagram.git
cd sevagram
```

2. Install backend dependencies

```bash
cd backend
npm install
```

3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

4. Set up environment variables

```bash
# Create .env file in backend directory
cp .env.example .env
# Add your MongoDB URI, JWT secret, etc.
```

5. Run the application

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

## 📦 Dependencies

### Backend

- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- express-validator

### Frontend

- react
- react-router-dom
- axios
- bootstrap
- react-bootstrap

## 🗄️ Database Schema

### Collections

- **users** - Customer accounts
- **serviceProviders** - Service provider accounts
- **services** - Available service categories
- **bookings** - Service booking records
- **reviews** - Customer reviews and ratings

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Services

- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `GET /api/services/category/:category` - Get services by category

### Bookings

- `POST /api/bookings` - Create new booking
- `GET /api/bookings/user/:userId` - Get user bookings
- `PUT /api/bookings/:id` - Update booking status

### Reviews

- `POST /api/reviews` - Add review
- `GET /api/reviews/provider/:providerId` - Get provider reviews

## 🎨 Design Considerations

- **Mobile-first responsive design**
- **Simple and intuitive UI for all age groups**
- **Offline-first approach for poor connectivity**
- **Multi-language support (Hindi, English, Regional languages)**

## 📱 Future Enhancements

- WhatsApp integration for bookings
- SMS notifications
- Voice search in regional languages
- Progressive Web App (PWA)
- Service provider training modules

## 👨‍💻 Developer

**@me-myst**

## 📄 License

MIT License

---

**Built with ❤️ for Rural India**

```

```
