import * as yup from 'yup';

// Login validation schema
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

// Register validation schema
export const registerSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastName: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  role: yup
    .string()
    .oneOf(['entrepreneur', 'investor', 'mentor'], 'Please select a valid role')
    .required('Role is required'),
  terms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions'),
});

// Forgot password validation schema
export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

// Reset password validation schema
export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

// Change password validation schema
export const changePasswordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required('Current password is required'),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('New password is required'),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your new password'),
});

// Profile update validation schema
export const profileUpdateSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastName: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  bio: yup
    .string()
    .max(500, 'Bio must be less than 500 characters'),
  location: yup
    .string()
    .max(100, 'Location must be less than 100 characters'),
  website: yup
    .string()
    .url('Please enter a valid URL'),
  phone: yup
    .string()
    .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'),
});

// Contact form validation schema
export const contactSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  subject: yup
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .required('Subject is required'),
  message: yup
    .string()
    .min(10, 'Message must be at least 10 characters')
    .required('Message is required'),
});

// Event creation validation schema
export const eventSchema = yup.object().shape({
  title: yup
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters')
    .required('Title is required'),
  description: yup
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .required('Description is required'),
  date: yup
    .date()
    .min(new Date(), 'Event date must be in the future')
    .required('Event date is required'),
  time: yup
    .string()
    .required('Event time is required'),
  location: yup
    .string()
    .min(5, 'Location must be at least 5 characters')
    .required('Location is required'),
  maxAttendees: yup
    .number()
    .min(1, 'Maximum attendees must be at least 1')
    .max(1000, 'Maximum attendees cannot exceed 1000')
    .required('Maximum attendees is required'),
  category: yup
    .string()
    .oneOf(['networking', 'workshop', 'conference', 'meetup', 'other'], 'Please select a valid category')
    .required('Category is required'),
});

// Post creation validation schema
export const postSchema = yup.object().shape({
  content: yup
    .string()
    .min(10, 'Post must be at least 10 characters')
    .max(2000, 'Post must be less than 2000 characters')
    .required('Post content is required'),
  tags: yup
    .array()
    .of(yup.string())
    .max(5, 'Maximum 5 tags allowed'),
});

// Comment validation schema
export const commentSchema = yup.object().shape({
  content: yup
    .string()
    .min(1, 'Comment cannot be empty')
    .max(500, 'Comment must be less than 500 characters')
    .required('Comment is required'),
});
