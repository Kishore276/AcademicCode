# 🚀 Real-Time Coding Platform

A comprehensive, role-based coding platform with real-time features, built with React frontend and Node.js/Express backend, powered by Firebase Firestore.

## ✨ Features

### 🎯 **Core Features**
- **Role-based Access**: Student, Teacher, and Admin dashboards
- **Real-time Collaboration**: Live code editing, chat, and notifications
- **PDF Question Upload**: Extract questions from PDF files automatically
- **Code Execution**: Real-time code compilation and testing
- **Contest Management**: Create and participate in coding contests
- **Progress Tracking**: Analytics and performance monitoring

### 🔥 **Firebase Integration**
- **Firestore Database**: NoSQL database for all data
- **Real-time Updates**: Live data synchronization
- **Scalable Architecture**: Cloud-based infrastructure
- **Secure Authentication**: JWT-based user management

### 📊 **Dashboard Features**
- **Student Dashboard**: Practice problems, join contests, track progress
- **Teacher Dashboard**: Create problems, monitor students, upload PDFs
- **Admin Dashboard**: User management, analytics, system overview

### 🎮 **Gamification**
- **Leaderboards**: Contest and problem rankings
- **Achievements**: Badges and progress tracking
- **Points System**: Score-based learning progression

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Socket.IO Client** for real-time features
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **Firebase Firestore** for database
- **Socket.IO** for real-time communication
- **Multer** for file uploads
- **PDF-Parse** for PDF processing

### Database
- **Firebase Firestore**: NoSQL cloud database
- **Real-time listeners**: Live data updates
- **Scalable**: Automatic scaling

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project (see setup guide)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd coding-platform
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Firebase Setup
Follow the detailed setup guide in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md):

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project

2. **Enable Firestore**
   - Navigate to Firestore Database
   - Create database in test mode

3. **Generate Service Account Key**
   - Go to Project Settings > Service Accounts
   - Download `serviceAccountKey.json`
   - Place it in the `backend` folder

### 4. Configure Environment
```bash
# Backend configuration
cd backend
# Edit config.env with your settings
```

### 5. Seed Database (Optional)
```bash
cd backend
node seedFirebase.js
```

### 6. Start Development Servers
```bash
# Start backend (Terminal 1)
cd backend
npm run dev

# Start frontend (Terminal 2)
npm run dev
```

### 7. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🔑 Test Credentials

After seeding the database:

### Admin Account
- **Email**: admin@codingplatform.com
- **Password**: admin123

### Teacher Account
- **Email**: teacher1@codingplatform.com
- **Password**: teacher123

### Student Account
- **Email**: student1@codingplatform.com
- **Password**: student123

## 📁 Project Structure

```
coding-platform/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── services/          # API services
│   └── data/              # Static data files
├── backend/               # Backend source code
│   ├── config/            # Configuration files
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── uploads/           # File uploads
│   └── serviceAccountKey.json  # Firebase credentials
├── FIREBASE_SETUP.md      # Firebase setup guide
└── README.md              # This file
```

## 🔥 Firebase Features

### Database Collections
- **users**: User profiles and authentication
- **problems**: Coding problems and test cases
- **contests**: Contest information and participants
- **submissions**: Code submissions and results

### Real-time Features
- **Live Code Editor**: Collaborative coding
- **Chat System**: Real-time messaging
- **Notifications**: Instant updates
- **Online Users**: See who's online

### Security
- **JWT Authentication**: Secure user sessions
- **Role-based Access**: Permission control
- **Firestore Rules**: Database security

## 📊 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Problems
- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get specific problem
- `POST /api/problems` - Create new problem
- `PUT /api/problems/:id` - Update problem

### Contests
- `GET /api/contests` - Get all contests
- `POST /api/contests` - Create contest
- `POST /api/contests/:id/join` - Join contest
- `GET /api/contests/:id/leaderboard` - Get leaderboard

### Submissions
- `POST /api/submissions` - Submit code
- `GET /api/submissions` - Get submissions
- `POST /api/submissions/:id/rejudge` - Rejudge submission

### File Upload
- `POST /api/upload-pdf` - Upload and extract PDF questions

## 🎯 Key Features

### PDF Question Upload
1. **Upload PDF**: Drag and drop or select file
2. **Automatic Extraction**: Parse questions using AI
3. **Review & Edit**: Modify extracted questions
4. **Save to Database**: Store in Firestore

### Real-time Collaboration
- **Live Code Editor**: Multiple users can code together
- **Chat Panel**: Real-time messaging
- **Online Users**: See who's currently active
- **Notifications**: Instant updates for all users

### Contest System
- **Create Contests**: Teachers can create coding contests
- **Join Contests**: Students can participate
- **Live Leaderboard**: Real-time rankings
- **Problem Solving**: Submit solutions during contests

## 🔧 Development

### Adding New Features
1. **Frontend**: Add components in `src/components/`
2. **Backend**: Add routes in `backend/routes/`
3. **Database**: Update Firebase services in `backend/services/`
4. **Real-time**: Add Socket.IO events

### Code Style
- **Frontend**: TypeScript with React hooks
- **Backend**: CommonJS modules with async/await
- **Database**: Firebase Firestore with service layer

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting service
```

### Backend Deployment
```bash
# Set production environment variables
npm start
# Deploy to your Node.js hosting service
```

### Firebase Configuration
- **Production Rules**: Update Firestore security rules
- **Environment Variables**: Set production Firebase config
- **Service Account**: Use production service account key

## 📈 Performance

### Firebase Optimizations
- **Indexing**: Create composite indexes for queries
- **Pagination**: Limit query results
- **Caching**: Implement client-side caching
- **Real-time**: Use Firestore listeners efficiently

### Frontend Optimizations
- **Code Splitting**: Lazy load components
- **Memoization**: Use React.memo and useMemo
- **Bundle Size**: Optimize with Vite
- **Caching**: Implement service worker

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) guide
2. Review the troubleshooting section
3. Create an issue in the repository

## 🎉 Acknowledgments

- **Firebase**: For the excellent cloud platform
- **React Team**: For the amazing frontend framework
- **Express.js**: For the robust backend framework
- **Tailwind CSS**: For the utility-first CSS framework

---

**Happy Coding! 🚀** 