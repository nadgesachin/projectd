import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Upload, X, MapPin, Calendar, Clock, Video, Building, Image as ImageIcon } from 'lucide-react';
import { createEvent, selectEventLoading } from '../features/events/eventSlice';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

// Validation schema
const schema = yup.object().shape({
  title: yup.string().required('Event title is required').min(5, 'Title must be at least 5 characters'),
  description: yup.string().required('Description is required').min(20, 'Description must be at least 20 characters'),
  category: yup.string().required('Category is required'),
  eventType: yup.string().required('Event type is required'),
  startDate: yup.date().required('Start date is required').min(new Date(), 'Start date must be in the future'),
  endDate: yup.date().required('End date is required').min(yup.ref('startDate'), 'End date must be after start date'),
  location: yup.string().when('eventType', {
    is: (val) => val === 'in-person' || val === 'hybrid',
    then: (schema) => schema.required('Location is required for in-person/hybrid events'),
    otherwise: (schema) => schema.notRequired(),
  }),
  onlineLink: yup.string().when('eventType', {
    is: (val) => val === 'online' || val === 'hybrid',
    then: (schema) => schema.url('Must be a valid URL').required('Online link is required for online/hybrid events'),
    otherwise: (schema) => schema.notRequired(),
  }),
  maxAttendees: yup.number().positive('Must be a positive number').integer('Must be a whole number'),
  price: yup.number().min(0, 'Price cannot be negative'),
});

const CreateEvent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectEventLoading);

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [eventType, setEventType] = useState('in-person');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      eventType: 'in-person',
      price: 0,
    },
  });

  const watchEventType = watch('eventType');

  const categories = [
    'Networking',
    'Workshop',
    'Conference',
    'Meetup',
    'Webinar',
    'Hackathon',
    'Pitch Event',
    'Social',
    'Training',
    'Panel Discussion',
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
      const eventData = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      };

      // If there's an image, you would upload it first and get the URL
      // For now, we'll just include it in the data
      if (imageFile) {
        // In a real app, upload the image and get the URL
        // eventData.image = uploadedImageUrl;
      }

      await dispatch(createEvent(eventData)).unwrap();
      toast.success('Event created successfully!');
      reset();
      navigate('/events');
    } catch (err) {
      toast.error(err || 'Failed to create event');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an Event</h1>
          <p className="text-gray-600">
            Organize an event to connect with the community
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Event Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Image
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
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
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

          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              {...register('title')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter event title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register('description')}
              rows="5"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe your event..."
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
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
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

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type *
            </label>
            <div className="grid grid-cols-3 gap-4">
              <label className="relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  {...register('eventType')}
                  value="online"
                  className="sr-only"
                />
                <Video className="w-6 h-6 text-green-600 mb-2" />
                <span className="font-semibold text-gray-900">Online</span>
              </label>
              <label className="relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  {...register('eventType')}
                  value="in-person"
                  className="sr-only"
                />
                <Building className="w-6 h-6 text-blue-600 mb-2" />
                <span className="font-semibold text-gray-900">In-Person</span>
              </label>
              <label className="relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  {...register('eventType')}
                  value="hybrid"
                  className="sr-only"
                />
                <MapPin className="w-6 h-6 text-purple-600 mb-2" />
                <span className="font-semibold text-gray-900">Hybrid</span>
              </label>
            </div>
            {errors.eventType && (
              <p className="mt-1 text-sm text-red-500">{errors.eventType.message}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                {...register('startDate')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-500">{errors.startDate.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                End Date & Time *
              </label>
              <input
                type="datetime-local"
                {...register('endDate')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Location (for in-person/hybrid) */}
          {(watchEventType === 'in-person' || watchEventType === 'hybrid') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Location *
              </label>
              <input
                type="text"
                {...register('location')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter venue address"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
              )}
            </div>
          )}

          {/* Online Link (for online/hybrid) */}
          {(watchEventType === 'online' || watchEventType === 'hybrid') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Video className="inline w-4 h-4 mr-1" />
                Online Meeting Link *
              </label>
              <input
                type="url"
                {...register('onlineLink')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.onlineLink ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://zoom.us/j/..."
              />
              {errors.onlineLink && (
                <p className="mt-1 text-sm text-red-500">{errors.onlineLink.message}</p>
              )}
            </div>
          )}

          {/* Additional Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Attendees (Optional)
              </label>
              <input
                type="number"
                {...register('maxAttendees')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.maxAttendees ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Unlimited"
              />
              {errors.maxAttendees && (
                <p className="mt-1 text-sm text-red-500">{errors.maxAttendees.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (USD)
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00 (Free)"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size="small" />
                  Creating...
                </>
              ) : (
                'Create Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;

