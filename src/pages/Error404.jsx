import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { ROUTES } from '../utils/constants';

const Error404 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page not found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => window.location.href = ROUTES.HOME}
          >
            Go back home
          </Button>
          
          <div className="text-sm text-gray-500">
            Need help?{' '}
            <Link to={ROUTES.CONTACT} className="text-primary-600 hover:text-primary-500">
              Contact support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404;
