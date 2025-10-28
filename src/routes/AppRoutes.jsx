import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import Layout from '../components/layout/Layout';
import Loader from '../components/common/Loader';
import { ROUTES } from '../utils/constants';

// Lazy load pages for better performance
const Home = React.lazy(() => import('../pages/Home'));
const Login = React.lazy(() => import('../pages/Login'));
const Register = React.lazy(() => import('../pages/Register'));
const ForgotPassword = React.lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('../pages/ResetPassword'));
const Profile = React.lazy(() => import('../pages/Profile'));
const EditProfile = React.lazy(() => import('../pages/EditProfile'));
const Connections = React.lazy(() => import('../pages/Connections'));
const Discovery = React.lazy(() => import('../pages/Discovery'));
const Events = React.lazy(() => import('../pages/Events'));
const CreateEvent = React.lazy(() => import('../pages/CreateEvent'));
const EventDetail = React.lazy(() => import('../pages/EventDetail'));
const Chat = React.lazy(() => import('../pages/Chat'));
const Communities = React.lazy(() => import('../pages/Communities'));
const CreateCommunity = React.lazy(() => import('../pages/CreateCommunity'));
const CommunityDetail = React.lazy(() => import('../pages/CommunityDetail'));
const Admin = React.lazy(() => import('../pages/Admin'));
const Settings = React.lazy(() => import('../pages/Settings'));
const Notifications = React.lazy(() => import('../pages/Notifications'));
const Search = React.lazy(() => import('../pages/Search'));
const About = React.lazy(() => import('../pages/About'));
const Contact = React.lazy(() => import('../pages/Contact'));
const Privacy = React.lazy(() => import('../pages/Privacy'));
const Terms = React.lazy(() => import('../pages/Terms'));
const Error404 = React.lazy(() => import('../pages/Error404'));
const Error500 = React.lazy(() => import('../pages/Error500'));
const TestPage = React.lazy(() => import('../pages/TestPage'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} replace />;
};

// Public Route Component (redirect to home if authenticated)
const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return !isAuthenticated ? children : <Navigate to={ROUTES.HOME} replace />;
};

// Loading component for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader size="lg" text="Loading page..." />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.HOME} element={<Layout showSidebar={false} showFooter={true}><Home /></Layout>} />
        <Route path={ROUTES.ABOUT} element={<Layout showSidebar={false} showFooter={true}><About /></Layout>} />
        <Route path={ROUTES.CONTACT} element={<Layout showSidebar={false} showFooter={true}><Contact /></Layout>} />
        <Route path={ROUTES.PRIVACY} element={<Layout showSidebar={false} showFooter={true}><Privacy /></Layout>} />
        <Route path={ROUTES.TERMS} element={<Layout showSidebar={false} showFooter={true}><Terms /></Layout>} />

        {/* Auth Routes - Unprotected for Testing */}
        <Route path={ROUTES.LOGIN} element={<Layout showSidebar={false} showFooter={false}><Login /></Layout>} />
        <Route path={ROUTES.REGISTER} element={<Layout showSidebar={false} showFooter={false}><Register /></Layout>} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<Layout showSidebar={false} showFooter={false}><ForgotPassword /></Layout>} />
        <Route path={ROUTES.RESET_PASSWORD} element={<Layout showSidebar={false} showFooter={false}><ResetPassword /></Layout>} />

        {/* All Routes - Unprotected for Testing */}
        <Route path={ROUTES.PROFILE} element={<Layout><Profile /></Layout>} />
        <Route path={ROUTES.EDIT_PROFILE} element={<Layout><EditProfile /></Layout>} />
        <Route path={ROUTES.CONNECTIONS} element={<Layout><Connections /></Layout>} />
        <Route path={ROUTES.DISCOVERY} element={<Layout><Discovery /></Layout>} />
        <Route path={ROUTES.EVENTS} element={<Layout><Events /></Layout>} />
        <Route path={ROUTES.CREATE_EVENT} element={<Layout><CreateEvent /></Layout>} />
        <Route path={ROUTES.EVENT_DETAIL} element={<Layout><EventDetail /></Layout>} />
        <Route path={ROUTES.CHAT} element={<Layout><Chat /></Layout>} />
        <Route path={ROUTES.COMMUNITIES} element={<Layout><Communities /></Layout>} />
        <Route path={ROUTES.CREATE_COMMUNITY} element={<Layout><CreateCommunity /></Layout>} />
        <Route path={ROUTES.COMMUNITY_DETAIL} element={<Layout><CommunityDetail /></Layout>} />
        <Route path={ROUTES.ADMIN} element={<Layout><Admin /></Layout>} />
        <Route path={ROUTES.SETTINGS} element={<Layout><Settings /></Layout>} />
        <Route path={ROUTES.NOTIFICATIONS} element={<Layout><Notifications /></Layout>} />
        <Route path={ROUTES.SEARCH} element={<Layout><Search /></Layout>} />

        {/* Test Route */}
        <Route path="/test" element={<Layout showSidebar={false} showFooter={false}><TestPage /></Layout>} />

        {/* Error Routes */}
        <Route path={ROUTES.ERROR_404} element={<Layout showSidebar={false} showFooter={true}><Error404 /></Layout>} />
        <Route path={ROUTES.ERROR_500} element={<Layout showSidebar={false} showFooter={true}><Error500 /></Layout>} />

        {/* Catch all route - redirect to 404 */}
        <Route path="*" element={<Navigate to={ROUTES.ERROR_404} replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
