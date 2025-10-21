import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChildPerformance {
  name: string;
  class: string;
  section: string;
  marks: {
    unit_test_1?: number;
    unit_test_2?: number;
    unit_test_3?: number;
    half_yearly?: number;
    final_exam?: number;
    [key: string]: any;
  };
  maxMarks: number;
}

interface PerformanceDigestProps {
  parentName: string;
  children: ChildPerformance[];
  weekStartDate: string;
  weekEndDate: string;
}

const ParentPerformanceDigest: React.FC<PerformanceDigestProps> = ({ 
  parentName, 
  children, 
  weekStartDate, 
  weekEndDate 
}) => {
  const calculateChildPercentage = (marks: any, maxMarks: number = 100) => {
    const totalMarks = Object.values(marks).reduce((sum: number, val: any) => {
      if (typeof val === 'number') return sum + val;
      return sum;
    }, 0);
    const examCount = Object.keys(marks).length;
    return examCount > 0 ? Math.round((totalMarks / (examCount * maxMarks)) * 100) : 0;
  };

  const getImprovementStatus = (child: ChildPerformance) => {
    const exams = ['unit_test_1', 'unit_test_2', 'unit_test_3'];
    const marks = exams.map(exam => child.marks[exam]).filter(mark => mark !== undefined);
    
    if (marks.length < 2) return 'Insufficient data';
    
    const recent = marks[marks.length - 1];
    const previous = marks[marks.length - 2];
    
    if (recent > previous) return 'Improving';
    if (recent < previous) return 'Declining';
    return 'Stable';
  };

  const getTopSubject = (child: ChildPerformance) => {
    const subjects = Object.entries(child.marks);
    if (subjects.length === 0) return 'No data';
    
    const topSubject = subjects.reduce((prev, current) => 
      (current[1] > prev[1]) ? current : prev
    );
    
    return `${topSubject[0].replace(/_/g, ' ')} (${topSubject[1]}/${child.maxMarks})`;
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '800px', 
      margin: '0 auto', 
      backgroundColor: '#f8fafc',
      padding: '20px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px'
    }}>
      <div style={{ 
        backgroundColor: '#3b82f6', 
        color: 'white', 
        padding: '20px', 
        borderRadius: '8px 8px 0 0',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '28px' }}>🎓 RHPS Parent Performance Digest</h1>
        <p style={{ margin: '10px 0 0', fontSize: '16px', opacity: 0.9 }}>
          Weekly Summary for {parentName} • {weekStartDate} to {weekEndDate}
        </p>
      </div>

      <div style={{ padding: '20px' }}>
        <p style={{ fontSize: '16px', color: '#334155', lineHeight: '1.6' }}>
          Dear {parentName},
        </p>
        <p style={{ fontSize: '16px', color: '#334155', lineHeight: '1.6' }}>
          Here's your weekly digest of your child's academic performance at Royal Hindustan Private School.
        </p>

        {children.map((child, index) => (
          <div 
            key={index} 
            style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              padding: '20px', 
              margin: '20px 0',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h2 style={{ 
              color: '#1e293b', 
              borderBottom: '2px solid #3b82f6', 
              paddingBottom: '10px',
              marginBottom: '20px'
            }}>
              📚 {child.name} (Class {child.class}-{child.section})
            </h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
              <div style={{ 
                flex: 1, 
                minWidth: '200px', 
                backgroundColor: '#eff6ff', 
                padding: '15px', 
                borderRadius: '8px',
                border: '1px solid #bfdbfe'
              }}>
                <h3 style={{ margin: '0 0 10px', color: '#1e40af' }}>Overall Performance</h3>
                <p style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: '#3b82f6',
                  margin: '0'
                }}>
                  {calculateChildPercentage(child.marks, child.maxMarks)}%
                </p>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#64748b',
                  margin: '5px 0 0'
                }}>
                  {getImprovementStatus(child)}
                </p>
              </div>

              <div style={{ 
                flex: 1, 
                minWidth: '200px', 
                backgroundColor: '#f0fdf4', 
                padding: '15px', 
                borderRadius: '8px',
                border: '1px solid #bbf7d0'
              }}>
                <h3 style={{ margin: '0 0 10px', color: '#166534' }}>Top Subject</h3>
                <p style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  color: '#16a34a',
                  margin: '0'
                }}>
                  {getTopSubject(child)}
                </p>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#64748b',
                  margin: '5px 0 0'
                }}>
                  Keep up the good work!
                </p>
              </div>
            </div>

            <h3 style={{ color: '#1e293b', margin: '20px 0 15px' }}>Performance Trend</h3>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'UT1', percentage: child.marks.unit_test_1 ? Math.round((child.marks.unit_test_1 / child.maxMarks) * 100) : 0 },
                    { name: 'UT2', percentage: child.marks.unit_test_2 ? Math.round((child.marks.unit_test_2 / child.maxMarks) * 100) : 0 },
                    { name: 'UT3', percentage: child.marks.unit_test_3 ? Math.round((child.marks.unit_test_3 / child.maxMarks) * 100) : 0 },
                    { name: 'Half-Yearly', percentage: child.marks.half_yearly ? Math.round((child.marks.half_yearly / child.maxMarks) * 100) : 0 },
                    { name: 'Final', percentage: child.marks.final_exam ? Math.round((child.marks.final_exam / child.maxMarks) * 100) : 0 }
                  ].filter(item => item.percentage > 0)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Percentage']}
                    labelFormatter={(value) => `Exam: ${value}`}
                  />
                  <Bar dataKey="percentage" fill="#3b82f6" name="Performance" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ 
              backgroundColor: '#fffbeb', 
              border: '1px solid #fde68a', 
              borderRadius: '8px', 
              padding: '15px', 
              marginTop: '20px'
            }}>
              <h3 style={{ 
                color: '#b45309', 
                margin: '0 0 10px',
                display: 'flex',
                alignItems: 'center'
              }}>
                💡 Teacher's Insight
              </h3>
              <p style={{ 
                color: '#92400e', 
                margin: 0,
                fontStyle: 'italic'
              }}>
                "{child.name} has shown consistent performance this week. Focus on {Object.keys(child.marks)[0]?.replace(/_/g, ' ') || 'core subjects'} 
                for further improvement. Regular practice and timely homework submission will help maintain this progress."
              </p>
            </div>
          </div>
        ))}

        <div style={{ 
          backgroundColor: '#eff6ff', 
          borderRadius: '8px', 
          padding: '20px', 
          marginTop: '30px',
          border: '1px solid #bfdbfe'
        }}>
          <h2 style={{ 
            color: '#1e40af', 
            margin: '0 0 15px',
            display: 'flex',
            alignItems: 'center'
          }}>
            🚀 Quick Tips for Parents
          </h2>
          <ul style={{ 
            paddingLeft: '20px', 
            margin: 0,
            color: '#334155'
          }}>
            <li style={{ marginBottom: '10px' }}>Set aside 30 minutes daily for homework review</li>
            <li style={{ marginBottom: '10px' }}>Encourage reading for 20 minutes before bedtime</li>
            <li style={{ marginBottom: '10px' }}>Maintain regular communication with class teachers</li>
            <li>Ensure adequate sleep (8-9 hours) for optimal learning</li>
          </ul>
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px', 
          paddingTop: '20px', 
          borderTop: '1px solid #e2e8f0',
          color: '#64748b',
          fontSize: '14px'
        }}>
          <p>
            Need help? Contact us at <a href="mailto:support@rhps.edu.in" style={{ color: '#3b82f6' }}>support@rhps.edu.in</a> 
            or call +91-9876543210
          </p>
          <p style={{ marginTop: '10px' }}>
            © 2025 Royal Hindustan Private School. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ParentPerformanceDigest;