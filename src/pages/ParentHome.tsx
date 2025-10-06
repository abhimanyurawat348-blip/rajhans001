import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, BookOpen, CheckCircle, XCircle, Calendar, DollarSign, Users, Award, TrendingUp, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface StudentData {
  username: string;
  admissionNumber: string;
  class: string;
  section: string;
  fatherName: string;
  motherName: string;
}

interface MarksData {
  unitTest1?: number;
  unitTest2?: number;
  unitTest3?: number;
  unitTest4?: number;
  halfYearly?: number;
  final?: number;
  subject?: string;
}

interface HomeworkItem {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  status: 'done' | 'not-done';
}

interface AttendanceData {
  present: number;
  total: number;
  percentage: number;
}

interface PTMData {
  id: string;
  date: string;
  time: string;
  teacher: string;
  subject: string;
  notes: string;
}

const ParentHome: React.FC = () => {
  const navigate = useNavigate();
  const [parentName, setParentName] = useState('');
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [marks, setMarks] = useState<MarksData[]>([]);
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [attendance, setAttendance] = useState<AttendanceData>({ present: 0, total: 0, percentage: 0 });
  const [ptmData, setPtmData] = useState<PTMData[]>([]);
  const [feesPending, setFeesPending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const parentDoc = await getDoc(doc(db, 'parents', user.uid));
          if (parentDoc.exists()) {
            const parentData = parentDoc.data();
            setParentName(parentData.parentName);

            const studentDoc = await getDoc(doc(db, 'users', parentData.studentUid));
            if (studentDoc.exists()) {
              const student = studentDoc.data() as StudentData;
              setStudentData(student);

              const marksQuery = query(
                collection(db, 'marks'),
                where('studentUid', '==', parentData.studentUid)
              );
              const marksSnapshot = await getDocs(marksQuery);
              const marksData: MarksData[] = [];
              marksSnapshot.forEach(doc => {
                marksData.push(doc.data() as MarksData);
              });
              setMarks(marksData);

              const homeworkQuery = query(
                collection(db, 'homework'),
                where('studentUid', '==', parentData.studentUid)
              );
              const homeworkSnapshot = await getDocs(homeworkQuery);
              const homeworkData: HomeworkItem[] = [];
              homeworkSnapshot.forEach(doc => {
                homeworkData.push({ id: doc.id, ...doc.data() } as HomeworkItem);
              });
              setHomework(homeworkData);

              const attendanceDoc = await getDoc(doc(db, 'attendance', parentData.studentUid));
              if (attendanceDoc.exists()) {
                setAttendance(attendanceDoc.data() as AttendanceData);
              }

              const ptmQuery = query(
                collection(db, 'parentTeacherMeetings'),
                where('studentUid', '==', parentData.studentUid)
              );
              const ptmSnapshot = await getDocs(ptmQuery);
              const ptmDataArray: PTMData[] = [];
              ptmSnapshot.forEach(doc => {
                ptmDataArray.push({ id: doc.id, ...doc.data() } as PTMData);
              });
              setPtmData(ptmDataArray);

              const feesDoc = await getDoc(doc(db, 'fees', parentData.studentUid));
              if (feesDoc.exists()) {
                setFeesPending(feesDoc.data().pending || false);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/parent-login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/parent-portal');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const calculateAverage = () => {
    if (marks.length === 0) return 0;
    const total = marks.reduce((sum, mark) => {
      const testSum = (mark.unitTest1 || 0) + (mark.unitTest2 || 0) + (mark.unitTest3 || 0) + (mark.unitTest4 || 0) + (mark.halfYearly || 0) + (mark.final || 0);
      return sum + testSum;
    }, 0);
    const count = marks.length * 6;
    return (total / count).toFixed(1);
  };

  const homeworkCompleted = homework.filter(h => h.status === 'done').length;
  const homeworkTotal = homework.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
            <p className="text-gray-600">Welcome, {parentName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {studentData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Information</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600">Student Name</p>
                <p className="text-lg font-semibold text-gray-900">{studentData.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Admission Number</p>
                <p className="text-lg font-semibold text-gray-900">{studentData.admissionNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Class & Section</p>
                <p className="text-lg font-semibold text-gray-900">{studentData.class}-{studentData.section}</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-3xl font-bold text-teal-600">{calculateAverage()}%</p>
              </div>
              <TrendingUp className="h-10 w-10 text-teal-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attendance</p>
                <p className="text-3xl font-bold text-blue-600">{attendance.percentage}%</p>
              </div>
              <Calendar className="h-10 w-10 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Homework</p>
                <p className="text-3xl font-bold text-green-600">{homeworkCompleted}/{homeworkTotal}</p>
              </div>
              <BookOpen className="h-10 w-10 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fee Status</p>
                <p className={`text-2xl font-bold ${feesPending ? 'text-red-600' : 'text-green-600'}`}>
                  {feesPending ? 'Pending' : 'Paid'}
                </p>
              </div>
              <DollarSign className={`h-10 w-10 ${feesPending ? 'text-red-600' : 'text-green-600'}`} />
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Award className="h-8 w-8 text-teal-600" />
              <h2 className="text-2xl font-bold text-gray-900">Academic Performance</h2>
            </div>

            {marks.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No marks uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {marks.map((mark, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">{mark.subject || 'Subject'}</h3>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600">Unit Test 1</p>
                        <p className="font-bold text-gray-900">{mark.unitTest1 || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Unit Test 2</p>
                        <p className="font-bold text-gray-900">{mark.unitTest2 || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Unit Test 3</p>
                        <p className="font-bold text-gray-900">{mark.unitTest3 || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Unit Test 4</p>
                        <p className="font-bold text-gray-900">{mark.unitTest4 || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Half-Yearly</p>
                        <p className="font-bold text-gray-900">{mark.halfYearly || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Final</p>
                        <p className="font-bold text-gray-900">{mark.final || '-'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <BookOpen className="h-8 w-8 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Homework Status</h2>
            </div>

            {homework.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No homework assigned yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {homework.map((hw) => (
                  <div key={hw.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{hw.title}</h3>
                      <p className="text-sm text-gray-600">{hw.subject}</p>
                      <p className="text-xs text-gray-500">Due: {hw.dueDate}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {hw.status === 'done' ? (
                        <>
                          <CheckCircle className="h-6 w-6 text-green-600" />
                          <span className="text-sm font-medium text-green-600">Done</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-6 w-6 text-red-600" />
                          <span className="text-sm font-medium text-red-600">Not Done</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-8 border-4 border-amber-300"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Users className="h-10 w-10 text-amber-600" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
              Parent-Teacher Meetings
            </h2>
          </div>

          {ptmData.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-amber-400 mx-auto mb-4" />
              <p className="text-amber-700 text-lg font-semibold">No meetings scheduled yet</p>
              <p className="text-amber-600 text-sm mt-2">Check back later for upcoming parent-teacher meetings</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {ptmData.map((meeting) => (
                <motion.div
                  key={meeting.id}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  className="bg-white rounded-xl shadow-lg p-6 border-2 border-amber-200 cursor-pointer hover:border-amber-400 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{meeting.subject}</h3>
                      <p className="text-gray-600">with {meeting.teacher}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-amber-500" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700">
                      <span className="font-semibold">Date:</span> {meeting.date}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Time:</span> {meeting.time}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Notes:</span> {meeting.notes}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ParentHome;
