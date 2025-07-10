import React, { useState } from 'react';
import { useStore } from '../store/useStore';

interface UploadedQuestion {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  tags: string[];
}

interface UploadResult {
  success: boolean;
  message: string;
  questions?: UploadedQuestion[];
  totalExtracted?: number;
  totalSaved?: number;
  error?: string;
}

const PDFUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const { user } = useStore();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setUploadResult(null);
    } else {
      alert('Please select a valid PDF file');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setUploadResult(null);
    } else {
      alert('Please drop a valid PDF file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a PDF file first');
      return;
    }

    if (!user || !['teacher', 'admin'].includes(user.role)) {
      alert('Only teachers and admins can upload questions');
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);
      formData.append('userRole', user.role);
      formData.append('userId', user.id);

      const response = await fetch('http://localhost:5000/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      const result: UploadResult = await response.json();

      if (result.success) {
        setUploadResult(result);
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setUploadResult(result);
      }
    } catch (error) {
      setUploadResult({
        success: false,
        message: 'Error uploading file',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!user || !['teacher', 'admin'].includes(user.role)) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold">Access Denied</h3>
          <p className="text-red-600">Only teachers and admins can upload questions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Questions from PDF</h2>
        
        <div className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-700">
                  {selectedFile ? selectedFile.name : 'Drop your PDF file here'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedFile 
                    ? `Size: ${formatFileSize(selectedFile.size)}`
                    : 'or click to browse files'
                  }
                </p>
              </div>

              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <button
                onClick={() => document.getElementById('pdf-upload')?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Choose PDF File
              </button>
            </div>
          </div>

          {/* Upload Button */}
          {selectedFile && (
            <div className="flex justify-center">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  isUploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isUploading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </div>
                ) : (
                  'Upload and Extract Questions'
                )}
              </button>
            </div>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <div className={`rounded-lg p-4 ${
              uploadResult.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className={`font-semibold ${
                uploadResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {uploadResult.success ? 'Upload Successful!' : 'Upload Failed'}
              </h3>
              <p className={`mt-2 ${
                uploadResult.success ? 'text-green-600' : 'text-red-600'
              }`}>
                {uploadResult.message}
              </p>
              
              {uploadResult.success && uploadResult.questions && (
                <div className="mt-4">
                  <h4 className="font-medium text-green-800 mb-2">
                    Extracted Questions ({uploadResult.totalSaved} saved):
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {uploadResult.questions.map((question, index) => (
                      <div key={question._id} className="bg-white p-3 rounded border">
                        <h5 className="font-medium text-gray-800">{question.title}</h5>
                        <div className="flex space-x-2 mt-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {question.difficulty}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                            {question.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {question.description.substring(0, 150)}...
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {uploadResult.error && (
                <p className="text-red-600 text-sm mt-2">
                  Error: {uploadResult.error}
                </p>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Instructions</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Upload a PDF file containing coding questions</li>
              <li>• The system will automatically extract questions from the PDF</li>
              <li>• Questions should be numbered (1., 2., Q1., etc.) for better extraction</li>
              <li>• Maximum file size: 10MB</li>
              <li>• Only PDF files are supported</li>
              <li>• Questions will be categorized based on filename and content</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFUpload; 