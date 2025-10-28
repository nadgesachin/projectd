import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Upload, X, Lock, Globe, Image as ImageIcon } from 'lucide-react';
import { createCommunity, selectCommunityLoading } from '../features/community/communitySlice';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required('Community name is required').min(3, 'Name must be at least 3 characters'),
  description: yup.string().required('Description is required').min(20, 'Description must be at least 20 characters'),
  category: yup.string().required('Category is required'),
  privacy: yup.string().required('Privacy setting is required'),
  location: yup.string(),
  rules: yup.string(),
  tags: yup.string(),
});

const CreateCommunity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectCommunityLoading);

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      privacy: 'public',
    },
  });

  const categories = [
    'Technology',
    'Entrepreneurship',
    'Investment',
    'Mentorship',
    'Networking',
    'Marketing',
    'Design',
    'Development',
    'Business',
    'Social Impact',
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data) => {
    try {
      const communityData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
      };

      // If there's an image, you would upload it first and get the URL
      // For now, we'll just include it in the data
      if (imageFile) {
        // In a real app, upload the image and get the URL
        // communityData.image = uploadedImageUrl;
      }

      await dispatch(createCommunity(communityData)).unwrap();
      toast.success('Community created successfully!');
      reset();
      navigate('/communities');
    } catch (err) {
      toast.error(err || 'Failed to create community');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a Community</h1>
          <p className="text-gray-600">
            Build a community around your interests and connect with like-minded people
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Community Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Community Image
            </label>
            {imagePreview ? (
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          {/* Community Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Community Name *
            </label>
            <input
              type="text"
              {...register('name')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter community name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register('description')}
              rows="4"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe what your community is about..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              {...register('category')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          {/* Privacy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Privacy *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="relative flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  {...register('privacy')}
                  value="public"
                  className="sr-only"
                />
                <div className="flex items-start">
                  <Globe className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">Public</div>
                    <div className="text-sm text-gray-600">Anyone can join</div>
                  </div>
                </div>
              </label>
              <label className="relative flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  {...register('privacy')}
                  value="private"
                  className="sr-only"
                />
                <div className="flex items-start">
                  <Lock className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">Private</div>
                    <div className="text-sm text-gray-600">Requires approval</div>
                  </div>
                </div>
              </label>
            </div>
            {errors.privacy && (
              <p className="mt-1 text-sm text-red-500">{errors.privacy.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location (Optional)
            </label>
            <input
              type="text"
              {...register('location')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="City, Country"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (Optional)
            </label>
            <input
              type="text"
              {...register('tags')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter tags separated by commas (e.g., startup, tech, innovation)"
            />
            <p className="mt-1 text-sm text-gray-500">Separate tags with commas</p>
          </div>

          {/* Community Rules */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Community Rules (Optional)
            </label>
            <textarea
              {...register('rules')}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Set some ground rules for your community..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/communities')}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size="small" />
                  Creating...
                </>
              ) : (
                'Create Community'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunity;

