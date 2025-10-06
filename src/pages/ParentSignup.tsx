import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const ParentSignup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'validate' | 'create'>('validate');
  const [validationData, setValidationData] = useState({
    studentName: '',
    admissionNumber: '',
    class: '',
    section: '',
    studentPassword: ''
  });
  const [parentData, setParentData] = useState({
    parentName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [studentUid, setStudentUid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleValidationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValidationData({
      ...validationData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleParentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParentData({
      ...parentData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const studentDocRef = doc(db, 'students', validationData.admissionNumber);
      const studentDoc = await getDoc(studentDocRef);

      if (!studentDoc.exists()) {
        setError('Student not found. Please register the student first.');
        setLoading(false);
        return;
      }

      const studentData = studentDoc.data();

      if (
        studentData.username.toLowerCase() !== validationData.studentName.toLowerCase() ||
        studentData.class !== validationData.class ||
        studentData.section !== validationData.section ||
        studentData.password !== validationData.studentPassword
      ) {
        setError('Student credentials do not match. Please verify the information.');
        setLoading(false);
        return;
      }

      const parentsQuery = query(collection(db, 'parents'), where('studentUid', '==', studentData.uid));
      const parentsSnapshot = await getDocs(parentsQuery);

      if (!parentsSnapshot.empty) {
        setError('A parent account is already registered for this student.');
        setLoading(false);
        return;
      }

      setStudentUid(studentData.uid);
      setStep('create');
    } catch (err) {
      console.error('Validation error:', err);
      setError('Validation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (parentData.password !== parentData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (parentData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        parentData.email,
        parentData.password
      );

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: parentData.parentName,
        email: parentData.email,
        role: 'parent',
        studentUid: studentUid,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await setDoc(doc(db, 'parents', userCredential.user.uid), {
        uid: userCredential.user.uid,
        parentName: parentData.parentName,
        email: parentData.email,
        studentUid: studentUid,
        studentAdmissionNumber: validationData.admissionNumber,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await setDoc(doc(db, 'staffNotifications', `parent_registration_${userCredential.user.uid}`), {
        type: 'parent_registration',
        parentUid: userCredential.user.uid,
        parentName: parentData.parentName,
        studentAdmissionNumber: validationData.admissionNumber,
        timestamp: Date.now(),
        createdAt: new Date(),
        read: false
      });

      setSuccess(true);

      setTimeout(() => {
        navigate('/parent-login');
      }, 2000);
    } catch (err: unknown) {
      const errorObj = err as { code?: string };
      if (errorObj.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
      } else if (errorObj.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (errorObj.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password.');
      } else {
        setError('Failed to create account. Please try again.');
      }
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md"
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Parent Account Created Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your parent account has been created. Redirecting to login...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl"
      >
        <button
          onClick={() => step === 'validate' ? navigate('/parent-portal') : setStep('validate')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Parent Registration</h1>
          <p className="text-gray-600">
            {step === 'validate' ? 'Validate student credentials first' : 'Create your parent account'}
          </p>
        </div>

        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mb-8 flex items-start space-x-3">
          <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-900 font-semibold mb-1">Important Notice</p>
            <p className="text-amber-800 text-sm">
              First register the student, then parent registration with the same credentials.
            </p>
          </div>
        </div>

        {step === 'validate' ? (
          <form onSubmit={validateStudent} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Step 1: Validate Student Information</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="studentName"
                    name="studentName"
                    value={validationData.studentName}
                    onChange={handleValidationInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter student's full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admissionNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Admission Number
                </label>
                <input
                  type="text"
                  id="admissionNumber"
                  name="admissionNumber"
                  value={validationData.admissionNumber}
                  onChange={handleValidationInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g., RHPS2025001"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-2">
                  Class
                </label>
                <select
                  id="class"
                  name="class"
                  value={validationData.class}
                  onChange={handleValidationInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Class</option>
                  {[3, 4, 5, 6, 7, 8, 9, 10].map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-2">
                  Section
                </label>
                <select
                  id="section"
                  name="section"
                  value={validationData.section}
                  onChange={handleValidationInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="studentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Student's Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  id="studentPassword"
                  name="studentPassword"
                  value={validationData.studentPassword}
                  onChange={handleValidationInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter student's password"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Use the password the student created during registration</p>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 font-semibold"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <span>Validate & Continue</span>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Step 2: Create Parent Account</h2>

            <div>
              <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-2">
                Parent Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="parentName"
                  name="parentName"
                  value={parentData.parentName}
                  onChange={handleParentInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={parentData.email}
                onChange={handleParentInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={parentData.password}
                    onChange={handleParentInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Create your password"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={parentData.confirmPassword}
                    onChange={handleParentInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500">Password must be at least 6 characters</p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 font-semibold"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  <span>Create Parent Account</span>
                </>
              )}
            </button>
          </form>
        )}

        {step === 'validate' && (
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/parent-login')}
              className="text-teal-600 hover:text-teal-700 font-semibold"
            >
              Login here
            </button>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default ParentSignup;
