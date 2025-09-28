import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRegistrations } from '../contexts/RegistrationContext';
import { UserPlus, Trophy, Music, CheckCircle, ArrowLeft, Calendar, User, Users } from 'lucide-react';

const Registration: React.FC = () => {
  const { submitRegistration } = useRegistrations();
  const [currentStep, setCurrentStep] = useState<'category' | 'activity' | 'form' | 'success'>('category');
  const [selectedCategory, setSelectedCategory] = useState<'sports' | 'activity' | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    studentName: '',
    class: '',
    section: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female',
    fatherName: '',
    motherName: ''
  });

  const sportsActivities = [
    { id: 'football', name: 'Football', icon: '⚽', description: 'Join our competitive football team' },
    { id: 'cricket', name: 'Cricket', icon: '🏏', description: 'Play in inter-school cricket matches' },
    { id: 'basketball', name: 'Basketball', icon: '🏀', description: 'Develop your basketball skills' },
    { id: 'volleyball', name: 'Volleyball', icon: '🏐', description: 'Team sport for all skill levels' },
    { id: 'badminton', name: 'Badminton', icon: '🏸', description: 'Individual and doubles competitions' }
  ];

  const otherActivities = [
    { id: 'dance', name: 'Dance', icon: '💃', description: 'Express yourself through dance' },
    { id: 'music', name: 'Music', icon: '🎵', description: 'Learn instruments and vocal techniques' },
    { id: 'debate', name: 'Debate', icon: '🗣️', description: 'Develop public speaking skills' },
    { id: 'speech', name: 'Speech', icon: '🎤', description: 'Master the art of public speaking' },
    { id: 'anchoring', name: 'Anchoring', icon: '📺', description: 'Host school events and programs' },
    { id: 'extempore', name: 'Extempore', icon: '💭', description: 'Improve spontaneous speaking' },
    { id: 'spell-bee', name: 'Spell Bee', icon: '📝', description: 'Compete in spelling competitions' },
    { id: 'art', name: 'Art & Craft', icon: '🎨', description: 'Explore your creative side' }
  ];

  const handleCategorySelect = (category: 'sports' | 'activity') => {
    setSelectedCategory(category);
    setCurrentStep('activity');
  };

  const handleActivitySelect = (activityId: string) => {
    setSelectedActivity(activityId);
    setCurrentStep('form');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getEligibilityCategory = (dateOfBirth: string) => {
    const age = calculateAge(dateOfBirth);
    if (age < 14) return 'Under 14';
    if (age < 16) return 'Under 16';
    return 'Under 18';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await submitRegistration({
        ...formData,
        dateOfBirth: new Date(formData.dateOfBirth),
        category: selectedCategory!,
        activityType: selectedActivity
      });

      if (success) {
        setCurrentStep('success');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep('category');
    setSelectedCategory(null);
    setSelectedActivity('');
    setFormData({
      studentName: '',
      class: '',
      section: '',
      dateOfBirth: '',
      gender: 'male',
      fatherName: '',
      motherName: ''
    });
    setError('');
  };

  const getActivityName = (activityId: string) => {
    const allActivities = [...sportsActivities, ...otherActivities];
    const activity = allActivities.find(a => a.id === activityId);
    return activity?.name || activityId;
  };

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md"
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            You have been successfully registered for <strong>{getActivityName(selectedActivity)}</strong>.
            {formData.dateOfBirth && (
              <span className="block mt-2 text-sm">
                Eligibility Category: <strong>{getEligibilityCategory(formData.dateOfBirth)}</strong>
              </span>
            )}
          </p>
          <button
            onClick={resetForm}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
          >
            Register for Another Activity
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <UserPlus className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Activity Registration</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join sports teams and extracurricular activities to enhance your school experience.
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 ${currentStep === 'category' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'category' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="font-medium">Category</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center space-x-2 ${currentStep === 'activity' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'activity' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="font-medium">Activity</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center space-x-2 ${currentStep === 'form' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="font-medium">Details</span>
            </div>
          </div>
        </motion.div>

        {/* Category Selection */}
        {currentStep === 'category' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-8"
          >
            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              onClick={() => handleCategorySelect('sports')}
              className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-center">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Sports Teams</h3>
                <p className="text-gray-600 mb-6">
                  Join competitive sports teams and represent the school in inter-school competitions.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {sportsActivities.slice(0, 3).map(sport => (
                    <span key={sport.id} className="text-2xl">{sport.icon}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              onClick={() => handleCategorySelect('activity')}
              className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Music className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Other Activities</h3>
                <p className="text-gray-600 mb-6">
                  Explore creative and intellectual activities to develop diverse skills and talents.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {otherActivities.slice(0, 4).map(activity => (
                    <span key={activity.id} className="text-2xl">{activity.icon}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Activity Selection */}
        {currentStep === 'activity' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Select {selectedCategory === 'sports' ? 'Sport' : 'Activity'}
              </h2>
              <button
                onClick={() => setCurrentStep('category')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(selectedCategory === 'sports' ? sportsActivities : otherActivities).map((activity) => (
                <motion.div
                  key={activity.id}
                  whileHover={{ y: -5 }}
                  onClick={() => handleActivitySelect(activity.id)}
                  className="p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 cursor-pointer transition-all duration-200 hover:shadow-lg"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">{activity.icon}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{activity.name}</h3>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Registration Form */}
        {currentStep === 'form' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Registration Form</h2>
                <p className="text-gray-600">Registering for: <strong>{getActivityName(selectedActivity)}</strong></p>
              </div>
              <button
                onClick={() => setCurrentStep('activity')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="studentName"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  {formData.dateOfBirth && (
                    <p className="text-sm text-blue-600 mt-1">
                      Eligibility Category: {getEligibilityCategory(formData.dateOfBirth)}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-2">
                    Class *
                  </label>
                  <input
                    type="text"
                    id="class"
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 12"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-2">
                    Section *
                  </label>
                  <input
                    type="text"
                    id="section"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., A"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700 mb-2">
                    Father's Name *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="fatherName"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="motherName" className="block text-sm font-medium text-gray-700 mb-2">
                    Mother's Name *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="motherName"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg"
                >
                  {error}
                </motion.div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Your registration will be processed and you will be contacted with further details about practice schedules and requirements.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 font-semibold"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    <span>Complete Registration</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Registration;