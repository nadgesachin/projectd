import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';

import { createPost, selectPostsCreating } from '../../features/posts/postSlice';
import { selectUser as selectAuthUser } from '../../features/auth/authSlice';
import { postSchema } from '../../utils/validations';
import Button from '../common/Button';
import Loader from '../common/Loader';

const PostForm = ({ onSuccess, placeholder = "What's on your mind?" }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectAuthUser);
  const isCreating = useSelector(selectPostsCreating);
  
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [showLocation, setShowLocation] = useState(false);
  const [location, setLocation] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(postSchema),
    defaultValues: {
      content: '',
      tags: [],
    },
  });

  const content = watch('content');

  // Handle media file drop
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.ogg'],
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles) => {
      const newFiles = [...mediaFiles, ...acceptedFiles];
      setMediaFiles(newFiles);
      
      // Create previews for images
      const newPreviews = acceptedFiles.map(file => ({
        file,
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'video',
      }));
      setMediaPreviews([...mediaPreviews, ...newPreviews]);
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach(error => {
          if (error.code === 'file-too-large') {
            toast.error(`${file.name} is too large. Maximum size is 10MB.`);
          } else if (error.code === 'file-invalid-type') {
            toast.error(`${file.name} is not a supported file type.`);
          } else {
            toast.error(`Error with ${file.name}: ${error.message}`);
          }
        });
      });
    },
  });

  const removeMediaFile = (index) => {
    const newFiles = mediaFiles.filter((_, i) => i !== index);
    const newPreviews = mediaPreviews.filter((_, i) => i !== index);
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(mediaPreviews[index].url);
    
    setMediaFiles(newFiles);
    setMediaPreviews(newPreviews);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setLocation(locationData);
        toast.success('Location added to post');
      },
      (error) => {
        toast.error('Unable to get your location');
      }
    );
  };

  const extractHashtags = (text) => {
    const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
    return text.match(hashtagRegex) || [];
  };

  const onSubmit = async (data) => {
    try {
      const postData = {
        content: data.content,
        media: mediaFiles,
        tags: extractHashtags(data.content),
        location: location,
        visibility: 'public',
      };

      await dispatch(createPost(postData)).unwrap();
      
      // Reset form
      reset();
      setMediaFiles([]);
      setMediaPreviews([]);
      setLocation(null);
      setShowLocation(false);
      setIsExpanded(false);
      
      toast.success('Post created successfully!');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error('Failed to create post');
    }
  };

  const handleInputFocus = () => {
    setIsExpanded(true);
  };

  const handleInputChange = (e) => {
    setValue('content', e.target.value);
    if (e.target.value.length > 0) {
      setIsExpanded(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* User Info */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            {currentUser?.profileImage ? (
              <img
                src={currentUser.profileImage}
                alt={`${currentUser.firstName} ${currentUser.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-gray-700">
                {currentUser?.firstName?.charAt(0) || 'U'}{currentUser?.lastName?.charAt(0) || 'P'}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {currentUser?.firstName} {currentUser?.lastName}
            </p>
            <p className="text-xs text-gray-500 capitalize">{currentUser?.role}</p>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <textarea
            {...register('content')}
            onFocus={handleInputFocus}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              errors.content ? 'border-red-300 focus:ring-red-500' : ''
            }`}
            rows={isExpanded ? 4 : 2}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        {/* Media Previews */}
        {mediaPreviews.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {mediaPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  {preview.type === 'image' ? (
                    <img
                      src={preview.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={preview.url}
                      className="w-full h-24 object-cover rounded-lg"
                      muted
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeMediaFile(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isExpanded && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {/* Media Upload */}
              <div {...getRootProps()}>
                <input {...getInputProps()} ref={fileInputRef} />
                <button
                  type="button"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDragActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Photo/Video</span>
                </button>
              </div>

              {/* Location */}
              <button
                type="button"
                onClick={getCurrentLocation}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Location</span>
              </button>
            </div>

            {/* Character Count */}
            <div className="text-xs text-gray-500">
              {content?.length || 0}/2000
            </div>
          </div>
        )}

        {/* Location Display */}
        {location && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm text-green-800">Location added</span>
              </div>
              <button
                type="button"
                onClick={() => setLocation(null)}
                className="text-green-600 hover:text-green-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        {isExpanded && (
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={isCreating || !content?.trim()}
            >
              {isCreating ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  Posting...
                </>
              ) : (
                'Post'
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PostForm;
