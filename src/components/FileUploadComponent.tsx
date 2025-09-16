import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';

interface Dataset {
  id: string;
  name: string;
  data: number[][];
  columns: string[];
  selectedColumns: string[];
  source: 'upload';
}

interface FileUploadComponentProps {
  onDatasetAdded: (dataset: Dataset) => void;
  onBack: () => void;
}

export function FileUploadComponent({ onDatasetAdded, onBack }: FileUploadComponentProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const parseCSV = (text: string): { data: number[][], columns: string[] } => {
    const lines = text.trim().split('\n');
    if (lines.length === 0) throw new Error('File is empty');
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data: number[][] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length !== headers.length) continue;
      
      const numericRow: number[] = [];
      for (let j = 0; j < values.length; j++) {
        const num = parseFloat(values[j]);
        if (!isNaN(num)) {
          numericRow.push(num);
        } else {
          // Skip non-numeric values
          continue;
        }
      }
      
      if (numericRow.length > 0) {
        data.push(numericRow);
      }
    }
    
    return { data, columns: headers };
  };

  const handleFile = async (file: File) => {
    setUploadStatus('uploading');
    setErrorMessage('');
    
    try {
      if (!file.name.match(/\.(csv|xlsx?)$/i)) {
        throw new Error('Please upload a CSV or Excel file');
      }
      
      const text = await file.text();
      const { data, columns } = parseCSV(text);
      
      if (data.length === 0) {
        throw new Error('No numeric data found in the file');
      }
      
      const dataset: Dataset = {
        id: `upload_${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        data,
        columns,
        selectedColumns: [],
        source: 'upload'
      };
      
      onDatasetAdded(dataset);
      setUploadStatus('success');
      
      // Reset after 2 seconds
      setTimeout(() => {
        setUploadStatus('idle');
      }, 2000);
      
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to process file');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Upload Dataset</h3>
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : uploadStatus === 'success'
            ? 'border-green-500 bg-green-50'
            : uploadStatus === 'error'
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileInput}
          className="hidden"
        />
        
        {uploadStatus === 'uploading' && (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600">Processing file...</p>
          </div>
        )}
        
        {uploadStatus === 'success' && (
          <div className="space-y-4">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
            <p className="text-green-600 font-medium">File uploaded successfully!</p>
          </div>
        )}
        
        {uploadStatus === 'error' && (
          <div className="space-y-4">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
            <p className="text-red-600 font-medium">Upload failed</p>
            <p className="text-sm text-red-500">{errorMessage}</p>
          </div>
        )}
        
        {uploadStatus === 'idle' && (
          <div className="space-y-4">
            <Upload className="h-12 w-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your file here or click to browse
              </p>
              <p className="text-gray-600 mb-4">
                Supports CSV and Excel files (.csv, .xlsx, .xls)
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary"
              >
                Choose File
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">File Requirements</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• First row should contain column headers</li>
              <li>• At least one column must contain numeric data</li>
              <li>• Maximum file size: 10MB</li>
              <li>• Supported formats: CSV, Excel (.xlsx, .xls)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

