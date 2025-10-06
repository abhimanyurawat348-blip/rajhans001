import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit, updateDoc, doc, deleteDoc, addDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  Shield,
  Bell,
  Users,
  FileText,
  Calendar,
  ClipboardList,
  Trash2,
  CheckCircle,
  LogOut,
  MessageSquare,
  Monitor,
  UserPlus,
  BookOpen,
  Upload
} from 'lucide-react';

// ... existing interfaces remain the same ...

interface StudentDoc {
  id: string;
  username?: string;
  email?: string;
  role?: string;
  class?: string;
  section?: string;
  admissionNumber?: string;
  createdAt?: { seconds?: number } | Date;
}

interface ParentDoc {
  id: string;
  email?: string;
  role?: string;
  studentId?: string;
  studentEmail?: string;
  createdAt?: { seconds?: number } | Date;
}

interface MarksheetUpload {
  class: string;
  section: string;
  subject: string;
  examType: string;
  marksData: Array<{
    studentId: string;
    marks: number;
    maxMarks: number;
    grade?: string;
  }>;
}

// ... existing helpers remain the same ...

const NewStaffPortal: React.FC = () => {
  // ... existing state variables remain the same ...
  const [parents, setParents] = useState<ParentDoc[]>([]);
  const [showMarksheetForm, setShowMarksheetForm] = useState(false);
  const [marksheetData, setMarksheetData] = useState<MarksheetUpload>({
    class: '',
    section: '',
    subject: '',
    examType: '',
    marksData: []
  });
  const [selectedClassStudents, setSelectedClassStudents] = useState<StudentDoc[]>([]);

  // ... existing useEffect remains the same ...

  const loadAllData = async () => {
    try {
      // ... existing data loading remains the same ...
      
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersData = usersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StudentDoc[];
      
      setStudents(usersData.filter((u) => (u as { role?: string }).role === 'student'));
      setParents(usersData.filter((u) => (u as { role?: string }).role === 'parent'));

      // ... rest of existing data loading remains the same ...
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  // ... existing handlers remain the same ...

  const handleCreateMarksheet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create marks records for each student
      for (const markData of marksheetData.marksData) {
        await addDoc(collection(db, 'marks'), {
          studentId: markData.studentId,
          subject: marksheetData.subject,
          examType: marksheetData.examType,
          marks: markData.marks,
          maxMarks: markData.maxMarks,
          grade: markData.grade,
          class: marksheetData.class,
          section: marksheetData.section,
          createdAt: new Date()
        });
      }
      
      setShowMarksheetForm(false);
      setMarksheetData({
        class: '',
        section: '',
        subject: '',
        examType: '',
        marksData: []
      });
      
      loadAllData();
    } catch (err) {
      console.error('Error creating marksheet:', err);
    }
  };

  const loadStudentsByClass = async (classValue: string, sectionValue: string) => {
    try {
      const studentsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'student'),
        where('class', '==', classValue),
        where('section', '==', sectionValue)
      );
      
      const studentsSnapshot = await getDocs(studentsQuery);
      const studentsData = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StudentDoc[];
      
      setSelectedClassStudents(studentsData);
      
      // Initialize marks data
      setMarksheetData(prev => ({
        ...prev,
        marksData: studentsData.map(student => ({
          studentId: student.id,
          marks: 0,
          maxMarks: 100
        }))
      }));
    } catch (err) {
      console.error('Error loading students:', err);
    }
  };

  // ... existing handlers remain the same ...

  // ... existing authentication logic remains the same ...

  // ... existing dashboard rendering remains the same ...

  {activeSection === 'students' && (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Students</h2>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Student
            </button>
          </div>
        </div>
        
        {students.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No students registered</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.class}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.section}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.admissionNumber || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-red-600 hover:text-red-900">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Parents</h2>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Parent
            </button>
          </div>
        </div>
        
        {parents.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No parents registered</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parents.map((parent) => (
                  <tr key={parent.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{parent.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {students.find(s => s.id === parent.studentId)?.username || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parent.studentEmail}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-red-600 hover:text-red-900">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )}

  // ... existing registrations section remains the same ...

  {activeSection === 'complaints' && (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Student Complaints</h2>
          <button
            onClick={() => exportToPDF(complaints, 'complaints_report', 'Student Complaints Report')}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
        </div>
        
        {complaints.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No complaints</p>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{complaint.studentName}</p>
                    <p className="text-sm text-gray-600">
                      Class {complaint.class}-{complaint.section} • Email: {complaint.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      Father: {complaint.fatherName || 'N/A'} • Mother: {complaint.motherName || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-700 mt-2">{complaint.complaint}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      IP: {complaint.ipAddress || 'Unknown'} •{' '}
                      {new Date(toMillis(complaint.submittedAt)).toLocaleDateString()}
                    </p>
                  </div>
                  <MessageSquare className="h-6 w-6 text-red-600" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )}

  // ... existing meetings section remains the same ...

  {activeSection === 'notices' && (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Notice Board</h2>
          <button
            onClick={() => setShowNoticeForm(!showNoticeForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Post Notice
          </button>
        </div>

        {showNoticeForm && (
          <form onSubmit={handleCreateNotice} className="mb-6 p-4 bg-gray-50 rounded-lg">
            {/* ... existing notice form remains the same ... */}
          </form>
        )}

        {notices.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No notices posted</p>
        ) : (
          <div className="space-y-4">
            {/* ... existing notices display remains the same ... */}
          </div>
        )}
      </div>
    </div>
  )}

  // Add marksheet upload section
  {activeSection === 'marksheets' && (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Upload Marksheets</h2>
          <button
            onClick={() => setShowMarksheetForm(!showMarksheetForm)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Marksheet
          </button>
        </div>

        {showMarksheetForm && (
          <form onSubmit={handleCreateMarksheet} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <input
                    type="text"
                    value={marksheetData.class}
                    onChange={(e) => {
                      setMarksheetData({ ...marksheetData, class: e.target.value });
                      if (marksheetData.section) {
                        loadStudentsByClass(e.target.value, marksheetData.section);
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter class (e.g., 10)"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                  <input
                    type="text"
                    value={marksheetData.section}
                    onChange={(e) => {
                      setMarksheetData({ ...marksheetData, section: e.target.value });
                      if (marksheetData.class) {
                        loadStudentsByClass(marksheetData.class, e.target.value);
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter section (e.g., A)"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={marksheetData.subject}
                    onChange={(e) => setMarksheetData({ ...marksheetData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter subject name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
                  <input
                    type="text"
                    value={marksheetData.examType}
                    onChange={(e) => setMarksheetData({ ...marksheetData, examType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter exam type (e.g., Midterm)"
                    required
                  />
                </div>
              </div>
              
              {selectedClassStudents.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Enter Marks for Students</h3>
                  <div className="space-y-3">
                    {selectedClassStudents.map((student, index) => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div>
                          <p className="font-medium text-gray-900">{student.username}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            max={marksheetData.marksData[index]?.maxMarks || 100}
                            value={marksheetData.marksData[index]?.marks || 0}
                            onChange={(e) => {
                              const newMarksData = [...marksheetData.marksData];
                              newMarksData[index] = {
                                ...newMarksData[index],
                                marks: parseInt(e.target.value) || 0
                              };
                              setMarksheetData({ ...marksheetData, marksData: newMarksData });
                            }}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                          />
                          <span className="text-gray-500">/</span>
                          <input
                            type="number"
                            min="1"
                            value={marksheetData.marksData[index]?.maxMarks || 100}
                            onChange={(e) => {
                              const newMarksData = [...marksheetData.marksData];
                              newMarksData[index] = {
                                ...newMarksData[index],
                                maxMarks: parseInt(e.target.value) || 100
                              };
                              setMarksheetData({ ...marksheetData, marksData: newMarksData });
                            }}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Marks
              </button>
            </div>
          </form>
        )}

        {/* Display existing marksheets */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Marksheets</h3>
          {marksheets.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No marksheets uploaded yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marksheets.map((marksheet) => (
                <div key={marksheet.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{marksheet.title}</h4>
                      <p className="text-sm text-gray-600">{marksheet.subject} - {marksheet.examType}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Class {marksheet.class}-{marksheet.section}
                      </p>
                    </div>
                    <BookOpen className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {new Date(marksheet.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => deleteDoc(doc(db, 'marks', marksheet.id))}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )}
</div>
  );
};

export default NewStaffPortal;