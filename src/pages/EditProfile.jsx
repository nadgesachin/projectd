import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';

import {
  fetchUserProfile,
  updateUserProfile,
  uploadProfileImage,
  selectUserProfile,
  selectUserLoading,
  selectUserError,
  clearUserError,
} from '../features/user/userSlice';
import { profileUpdateSchema } from '../utils/validations';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector(selectUserProfile);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(profileUpdateSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      bio: '',
      location: '',
      website: '',
      phone: '',
    },
  });

  // Load user profile on component mount
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Set form values when profile loads
  useEffect(() => {
    if (profile) {
      setValue('firstName', profile.firstName || '');
      setValue('lastName', profile.lastName || '');
      setValue('bio', profile.bio || '');
      setValue('location', profile.location || '');
      setValue('website', profile.website || '');
      setValue('phone', profile.phone || '');
      setImagePreview(profile.profileImage);
    }
  }, [profile, setValue]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearUserError());
    }
  }, [error, dispatch]);

  // Image dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setImagePreview(URL.createObjectURL(file));
        await handleImageUpload(file);
      }
    },
  });

  const handleImageUpload = async (file) => {
    setUploadingImage(true);
    try {
      await dispatch(uploadProfileImage(file)).unwrap();
      toast.success('Profile image updated successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
      setImagePreview(profile?.profileImage);
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(updateUserProfile(data)).unwrap();
      toast.success('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      // Error is handled by the slice and shown via toast
    }
  };

  if (loading && !profile) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <Loader size="lg" text="Loading profile..." />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Helmet>
        <title>Edit Profile - ThriveUnity</title>
        <meta name="description" content="Edit your ThriveUnity profile" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <p className="mt-1 text-sm text-gray-600">
              Update your profile information and settings.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Profile Image Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Profile Picture
              </label>
              
              <div className="flex items-center space-x-6">
                {/* Current/Preview Image */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-gray-600">
                        {watch('firstName')?.charAt(0) || 'U'}{watch('lastName')?.charAt(0) || 'P'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Upload Area */}
                <div className="flex-1">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      isDragActive
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input {...getInputProps()} />
                    {uploadingImage ? (
                      <div className="flex items-center justify-center">
                        <Loader size="sm" className="mr-2" />
                        <span className="text-sm text-gray-600">Uploading...</span>
                      </div>
                    ) : (
                      <div>
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-blue-600 hover:text-blue-500">
                              Click to upload
                            </span>{' '}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="mt-1">
                  <input
                    {...register('firstName')}
                    type="text"
                    className={`input-field ${
                      errors.firstName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="mt-1">
                  <input
                    {...register('lastName')}
                    type="text"
                    className={`input-field ${
                      errors.lastName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                    }`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <div className="mt-1">
                <textarea
                  {...register('bio')}
                  rows={4}
                  className={`input-field ${
                    errors.bio ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                  }`}
                  placeholder="Tell us about yourself..."
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                )}
              </div>
            </div>

            {/* Location and Website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <div className="mt-1">
                  <input
                    {...register('location')}
                    type="text"
                    className={`input-field ${
                      errors.location ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                    }`}
                    placeholder="City, Country"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <div className="mt-1">
                  <input
                    {...register('website')}
                    type="url"
                    className={`input-field ${
                      errors.website ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                    }`}
                    placeholder="https://yourwebsite.com"
                  />
                  {errors.website && (
                    <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  {...register('phone')}
                  type="tel"
                  className={`input-field ${
                    errors.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/profile')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EditProfile;
