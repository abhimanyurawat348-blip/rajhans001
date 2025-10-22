import React, { useState, useEffect } from 'react';
import { X, Download, Eye } from 'lucide-react';
import { StudyResource } from '../types';
import { GeneratedQuestionPaper } from '../types';

// Create a union type for both resource types
type QuestionPaperResource = StudyResource | GeneratedQuestionPaper;

// Create a type for our paper data
interface PaperData {
  id: string;
  title: string;
  time: string;
  maxMarks: string;
  instructions: string[];
  sections: {
    name: string;
    questions: {
      id: number | string;
      text: string;
      marks: number;
      options?: string[];
      answer?: string;
      explanation?: string;
      subQuestions?: {
        id: string;
        text: string;
        answer?: string;
      }[];
    }[];
  }[];
  viewMode?: 'full' | 'solutions'; // Add viewMode property
}

interface QuestionPaperDisplayProps {
  resource: PaperData;
  onClose: () => void;
  onDownload: (resource: QuestionPaperResource, withSolutions?: boolean) => void;
}

const QuestionPaperDisplay: React.FC<QuestionPaperDisplayProps> = ({ 
  resource, 
  onClose,
  onDownload
}) => {
  const [showSolutions, setShowSolutions] = useState(false);
  const [viewMode, setViewMode] = useState<'full' | 'solutions'>(resource.viewMode || 'full');

  // Update viewMode when resource changes
  useEffect(() => {
    if (resource.viewMode) {
      setViewMode(resource.viewMode);
      if (resource.viewMode === 'solutions') {
        setShowSolutions(true);
      }
    }
  }, [resource.viewMode]);

  // Find the corresponding StudyResource for download
  const findStudyResource = (): QuestionPaperResource | null => {
    // This would need to be implemented based on how resources are stored
    // For now, we'll create a mock resource
    return {
      id: resource.id,
      title: resource.title,
      subject: "Science",
      class: resource.id.includes('9') ? "9" : "10",
      type: "sample-paper",
      downloadUrl: `/sample-papers/${resource.id}.pdf`,
      has_solutions: true
    } as StudyResource;
  };

  const handleDownload = (withSolutions?: boolean) => {
    const studyResource = findStudyResource();
    if (studyResource) {
      onDownload(studyResource, withSolutions);
    }
  };

  const toggleSolutionsView = () => {
    if (viewMode === 'full') {
      setViewMode('solutions');
      setShowSolutions(true);
    } else {
      setViewMode('full');
      setShowSolutions(false);
    }
  };

  // Render only solutions view
  const renderSolutionsOnly = () => {
    return (
      <div className="space-y-6">
        {resource.sections.map((section, sectionIdx) => (
          <div key={sectionIdx}>
            <h3 className="text-xl font-bold mb-4">{section.name} - Solutions</h3>
            <div className="space-y-4">
              {section.questions.map((question) => (
                <div key={question.id} className="border-b border-gray-200 pb-4">
                  <p className="font-medium mb-2">
                    Question {question.id}.
                  </p>
                  
                  {question.answer && (
                    <div className="mt-2">
                      <p className="font-semibold">Answer:</p>
                      <p className="whitespace-pre-line">{question.answer}</p>
                    </div>
                  )}
                  
                  {question.explanation && (
                    <div className="mt-2">
                      <p className="font-semibold">Explanation:</p>
                      <p>{question.explanation}</p>
                    </div>
                  )}
                  
                  {question.subQuestions && (
                    <div className="mt-2">
                      {question.subQuestions.map((subQ) => (
                        <div key={subQ.id} className="mb-2">
                          <p className="font-semibold">{subQ.id}. {subQ.text}</p>
                          {subQ.answer && <p className="whitespace-pre-line ml-4">{subQ.answer}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{resource.title}</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleDownload(false)}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
              <button 
                onClick={() => handleDownload(true)}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-1" />
                With Solutions
              </button>
              <button 
                onClick={toggleSolutionsView}
                className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                <Eye className="h-4 w-4 mr-1" />
                {viewMode === 'full' ? 'See Solutions' : 'See Full Paper'}
              </button>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {viewMode === 'full' ? (
            <>
              <div className="mb-6">
                <button
                  onClick={() => setShowSolutions(!showSolutions)}
                  className={`px-4 py-2 rounded-md ${
                    showSolutions 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {showSolutions ? 'Hide Solutions' : 'Show Solutions'}
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  {resource.time && <p><strong>Time:</strong> {resource.time}</p>}
                  <p><strong>Max. Marks:</strong> {resource.maxMarks}</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">General Instructions:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {resource.instructions.map((instruction, idx) => (
                      <li key={idx}>{instruction}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {resource.sections.map((section, sectionIdx) => (
                <div key={sectionIdx} className="mb-8">
                  <h3 className="text-xl font-bold mb-4">{section.name}</h3>
                  <div className="space-y-6">
                    {section.questions.map((question) => (
                      <div key={question.id} className="border-b border-gray-200 pb-4">
                        <p className="font-medium mb-2">
                          Question {question.id}. {question.text} [{question.marks}]
                        </p>
                        
                        {question.options && (
                          <ul className="list-[lower-alpha] pl-5 space-y-1 mb-2">
                            {question.options.map((option, idx) => (
                              <li key={idx}>{option}</li>
                            ))}
                          </ul>
                        )}
                        
                        {showSolutions && question.answer && (
                          <div className="mt-2 p-3 bg-blue-50 rounded-md">
                            <p className="font-semibold">Answer:</p>
                            <p className="whitespace-pre-line">{question.answer}</p>
                            {question.explanation && (
                              <p className="mt-2">
                                <span className="font-semibold">Explanation:</span> {question.explanation}
                              </p>
                            )}
                          </div>
                        )}
                        
                        {question.subQuestions && showSolutions && (
                          <div className="mt-2 p-3 bg-blue-50 rounded-md">
                            {question.subQuestions.map((subQ) => (
                              <div key={subQ.id} className="mb-2">
                                <p className="font-semibold">{subQ.text}</p>
                                <p className="whitespace-pre-line">{subQ.answer}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            renderSolutionsOnly()
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionPaperDisplay;