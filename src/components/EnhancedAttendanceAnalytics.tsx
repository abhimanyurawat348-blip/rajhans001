import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  Users, 
  Clock,
  Zap,
  Award
} from 'lucide-react';
import { 
  getStudentAttendanceTrends, 
  getClassAttendanceTrends, 
  predictAttendanceRisk,
  getClassAttendanceSummaries,
  AttendanceTrend,
  ClassAttendanceSummary,
  AttendancePrediction
} from '../utils/attendanceAnalytics';

interface EnhancedAttendanceAnalyticsProps {
  selectedClass: string;
  selectedSection: string;
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

const EnhancedAttendanceAnalytics: React.FC<EnhancedAttendanceAnalyticsProps> = ({ 
  selectedClass, 
  selectedSection 
}) => {
  const [studentTrends, setStudentTrends] = useState<AttendanceTrend[]>([]);
  const [classTrends, setClassTrends] = useState<AttendanceTrend[]>([]);
  const [attendancePredictions, setAttendancePredictions] = useState<AttendancePrediction[]>([]);
  const [classSummaries, setClassSummaries] = useState<ClassAttendanceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch class trends
        if (selectedClass && selectedSection) {
          const classTrendData = await getClassAttendanceTrends(selectedClass, selectedSection, 30);
          setClassTrends(classTrendData);
        }
        
        // Fetch class summaries
        const summaries = await getClassAttendanceSummaries();
        setClassSummaries(summaries);
        
        // Simulate fetching predictions (in a real app, this would fetch for specific students)
        const mockPredictions: AttendancePrediction[] = [
          {
            studentId: '1',
            riskLevel: 'high',
            predictedAttendance: 65,
            explanation: 'Declining trend over last 2 weeks'
          },
          {
            studentId: '2',
            riskLevel: 'medium',
            predictedAttendance: 78,
            explanation: 'Inconsistent attendance pattern'
          },
          {
            studentId: '3',
            riskLevel: 'low',
            predictedAttendance: 92,
            explanation: 'Consistent attendance record'
          }
        ];
        setAttendancePredictions(mockPredictions);
      } catch (error) {
        console.error('Error fetching attendance analytics data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedClass, selectedSection]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Prepare data for charts
  const classSummaryData = classSummaries.map(summary => ({
    name: `${summary.class}${summary.section}`,
    percentage: summary.percentage,
    present: summary.present,
    total: summary.total
  }));

  const riskLevelData = [
    { name: 'Low Risk', value: attendancePredictions.filter(p => p.riskLevel === 'low').length },
    { name: 'Medium Risk', value: attendancePredictions.filter(p => p.riskLevel === 'medium').length },
    { name: 'High Risk', value: attendancePredictions.filter(p => p.riskLevel === 'high').length }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Class Average</p>
              <p className="text-2xl font-bold text-gray-900">
                {classTrends.length > 0 
                  ? `${classTrends[classTrends.length - 1].percentage}%` 
                  : 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Award className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {classTrends.length > 1 
              ? `Trend: ${classTrends[classTrends.length - 1].percentage >= classTrends[classTrends.length - 2].percentage ? '↑' : '↓'}`
              : 'Insufficient data'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">At-Risk Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {attendancePredictions.filter(p => p.riskLevel === 'high').length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Require immediate attention</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Classes Tracked</p>
              <p className="text-2xl font-bold text-gray-900">{classSummaries.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Across all sections</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Attendance Trends */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            Class Attendance Trends
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={classTrends}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Attendance']}
                  labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="percentage" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }} 
                  name="Attendance %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Class Attendance Distribution */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-green-500" />
            Class Attendance Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={classSummaryData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Attendance']}
                  labelFormatter={(value) => `Class: ${value}`}
                />
                <Bar dataKey="percentage" name="Attendance %" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Risk Predictions */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-500" />
          Attendance Risk Predictions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Risk Distribution Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskLevelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                >
                  {riskLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Students']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Student Risk Levels</h4>
            {attendancePredictions.map((prediction, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  prediction.riskLevel === 'high' 
                    ? 'bg-red-50 border-red-200' 
                    : prediction.riskLevel === 'medium' 
                      ? 'bg-yellow-50 border-yellow-200' 
                      : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">Student ID: {prediction.studentId}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    prediction.riskLevel === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : prediction.riskLevel === 'medium' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {prediction.riskLevel.charAt(0).toUpperCase() + prediction.riskLevel.slice(1)} Risk
                  </span>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className={`h-2 rounded-full ${
                        prediction.riskLevel === 'high' 
                          ? 'bg-red-500' 
                          : prediction.riskLevel === 'medium' 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                      }`} 
                      style={{ width: `${prediction.predictedAttendance}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{prediction.predictedAttendance}%</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{prediction.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
          Attendance Alerts
        </h3>
        <div className="space-y-3">
          {attendancePredictions
            .filter(p => p.riskLevel === 'high')
            .map((prediction, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="font-medium text-gray-900">High Absentee Risk Detected</p>
                  <p className="text-sm text-gray-600">Student ID: {prediction.studentId} - {prediction.explanation}</p>
                </div>
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  Notify Parents
                </button>
              </div>
            ))}
          
          {classTrends.length > 2 && 
           classTrends[classTrends.length - 1].percentage < 80 && (
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div>
                <p className="font-medium text-gray-900">Class Attendance Below Threshold</p>
                <p className="text-sm text-gray-600">
                  Class {selectedClass}{selectedSection} attendance is {classTrends[classTrends.length - 1].percentage}%
                </p>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                View Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedAttendanceAnalytics;