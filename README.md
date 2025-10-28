# ThriveUnity Frontend

A modern, scalable React.js frontend application for professional networking platform connecting entrepreneurs, mentors, and investors.

## 🚀 Features

- **Modern React Architecture**: Built with React 18, Vite, and modern best practices
- **State Management**: Redux Toolkit with persistence for scalable state management
- **Styling**: Tailwind CSS + Bootstrap 5 for rapid, responsive UI development
- **Routing**: React Router v6 with protected routes and lazy loading
- **Form Handling**: React Hook Form with Yup validation
- **API Integration**: Axios with interceptors for secure API communication
- **Real-time Features**: Socket.io integration ready for chat and live updates
- **Performance**: Code splitting, lazy loading, and optimization
- **Accessibility**: WCAG compliant components and navigation
- **Security**: Input sanitization, CSRF protection, and secure authentication

## 🏗️ Project Structure

```
thriveunity-frontend/
├── public/
│   └── index.html
├── src/
│   ├── app/                    # Redux store configuration
│   │   ├── store.js
│   │   └── rootReducer.js
│   ├── assets/                 # Static assets
│   │   ├── images/
│   │   └── icons/
│   ├── components/             # Reusable UI components
│   │   ├── common/            # Button, Modal, Loader, etc.
│   │   ├── layout/            # Navbar, Sidebar, Footer, Layout
│   │   └── forms/             # Form components
│   ├── features/              # Feature-based Redux slices
│   │   ├── auth/              # Authentication
│   │   └── user/              # User management
│   ├── modules/               # Business logic modules
│   │   ├── community/
│   │   ├── events/
│   │   ├── chat/
│   │   ├── discovery/
│   │   └── admin/
│   ├── hooks/                 # Custom React hooks
│   ├── pages/                 # Page components
│   ├── routes/                # Routing configuration
│   ├── services/              # API services
│   ├── styles/                # Global styles
│   ├── utils/                 # Utility functions and constants
│   ├── App.jsx                # Main app component
│   └── main.jsx               # App entry point
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
└── package.json
```

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend Framework** | React.js (v18+) | Component-based architecture |
| **Build Tool** | Vite | Fast development and building |
| **State Management** | Redux Toolkit + Redux Persist | Global state & persistence |
| **Styling** | Tailwind CSS + Bootstrap 5 | Utility-first styling |
| **Routing** | React Router v6 | SPA navigation |
| **Form Handling** | React Hook Form + Yup | Form validation |
| **API Client** | Axios | HTTP requests with interceptors |
| **Real-time** | Socket.io-client | Live updates and chat |
| **Notifications** | React Toastify | User feedback |
| **Icons** | Heroicons | Consistent iconography |

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.19+ or v22.12+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd thriveunity-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env.development
   
   # Edit environment variables
   nano .env.development
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### Environment Variables

Create a `.env.development` file with the following variables:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000

# Google Maps API
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# App Configuration
REACT_APP_APP_NAME=ThriveUnity
REACT_APP_DEBUG=true
```

## 📱 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 🎨 UI Components

### Common Components

- **Button**: Multiple variants (primary, secondary, outline, ghost)
- **Modal**: Accessible modal with overlay and escape key support
- **Loader**: Loading states with skeleton loaders
- **Toast**: Notification system integration

### Layout Components

- **Navbar**: Responsive navigation with user menu
- **Sidebar**: Collapsible sidebar navigation
- **Footer**: Site footer with links and newsletter
- **Layout**: Main layout wrapper with sidebar integration

## 🔐 Authentication

The app includes a complete authentication system with:

- **Login/Register**: Form validation and error handling
- **Password Reset**: Forgot password and reset functionality
- **Protected Routes**: Route guards for authenticated users
- **Persistent Sessions**: Redux Persist for session management
- **Role-based Access**: Support for different user roles

## 🌐 API Integration

### Services Structure

- **api.js**: Centralized Axios configuration with interceptors
- **authService.js**: Authentication-related API calls
- **userService.js**: User profile and management APIs

### Features

- **Request/Response Interceptors**: Automatic token handling
- **Error Handling**: Global error management
- **Loading States**: Request state management
- **Timeout Configuration**: Configurable request timeouts

## 🎯 Key Features

### 1. Discovery
- Location-based user discovery
- Advanced filtering and search
- Connection suggestions

### 2. Events
- Event creation and management
- RSVP functionality
- Calendar integration

### 3. Communities
- Community creation and joining
- Discussion forums
- Member management

### 4. Chat
- Real-time messaging
- Group conversations
- File sharing

### 5. User Management
- Profile management
- Connection requests
- Privacy settings

## 🔧 Configuration

### Tailwind CSS

Custom theme configuration in `tailwind.config.js`:

- **Colors**: Primary, secondary, success, warning, danger
- **Typography**: Inter font family
- **Spacing**: Custom spacing scale
- **Animations**: Custom keyframes and transitions

### Redux Store

Store configuration in `src/app/store.js`:

- **Redux Toolkit**: Modern Redux with less boilerplate
- **Redux Persist**: Session persistence
- **DevTools**: Development tools integration
- **Middleware**: Custom middleware for API calls

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Deployment Options

- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **AWS S3**: Static website hosting
- **Docker**: Containerized deployment

### Environment Variables for Production

```env
REACT_APP_API_URL=https://api.thriveunity.com
REACT_APP_SOCKET_URL=https://api.thriveunity.com
REACT_APP_GOOGLE_MAPS_API_KEY=your_production_key
REACT_APP_DEBUG=false
```

## 🧪 Testing

### Test Structure

- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: Feature testing
- **E2E Tests**: End-to-end testing with Cypress

### Running Tests

```bash
npm run test                 # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage report
npm run test:e2e            # E2E tests
```

## 📊 Performance

### Optimization Features

- **Code Splitting**: Lazy loading of routes and components
- **Bundle Analysis**: Webpack bundle analyzer
- **Image Optimization**: Lazy loading and compression
- **Caching**: Service worker for offline support

### Performance Monitoring

- **Core Web Vitals**: Performance metrics
- **Bundle Size**: Optimized bundle sizes
- **Loading Times**: Fast initial load

## 🔒 Security

### Security Features

- **Input Sanitization**: XSS prevention
- **CSRF Protection**: Cross-site request forgery protection
- **Secure Headers**: Security headers configuration
- **Authentication**: JWT token management

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests**
5. **Submit a pull request**

### Code Standards

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message format
- **TypeScript**: Type safety (future implementation)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check this README and inline code comments
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 🗺️ Roadmap

### Phase 1 (Completed)
- ✅ Project setup and configuration
- ✅ Basic UI components and layout
- ✅ Authentication system
- ✅ Routing and navigation

### Phase 2 (In Progress)
- 🔄 User profile management
- 🔄 Discovery and search functionality
- 🔄 Event management system

### Phase 3 (Planned)
- 📅 Real-time chat implementation
- 📅 Community features
- 📅 Admin dashboard
- 📅 Mobile app (React Native)

---

**Built with ❤️ for the entrepreneurial community**# projectd
