import { useState } from 'react';
import { Check, X } from 'lucide-react';

interface Dataset {
  id: string;
  name: string;
  data: number[][];
  columns: string[];
  selectedColumns: string[];
  source: 'upload' | 'generate' | 'ai';
}

interface ColumnSelectorProps {
  dataset: Dataset;
  onColumnSelection: (selectedColumns: string[]) => void;
}

export function ColumnSelector({ dataset, onColumnSelection }: ColumnSelectorProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const handleColumnToggle = (column: string) => {
    const newSelection = selectedColumns.includes(column)
      ? selectedColumns.filter(c => c !== column)
      : [...selectedColumns, column];
    
    setSelectedColumns(newSelection);
  };

  const handleConfirm = () => {
    onColumnSelection(selectedColumns);
  };

  const handleSelectAll = () => {
    const allColumns = dataset.columns;
    setSelectedColumns(allColumns);
  };

  const handleSelectNone = () => {
    setSelectedColumns([]);
  };

  // Analyze columns to show which ones have numeric data
  const getColumnStats = (columnIndex: number) => {
    const values = dataset.data.map(row => row[columnIndex]).filter(val => !isNaN(val));
    return {
      hasNumericData: values.length > 0,
      numericCount: values.length,
      totalCount: dataset.data.length,
      sampleValues: values.slice(0, 3).map(v => v.toFixed(2))
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Select Columns for Analysis
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={handleSelectAll}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Select All
          </button>
          <button
            onClick={handleSelectNone}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-600 mb-2">
          <strong>Dataset:</strong> {dataset.name}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Rows:</strong> {dataset.data.length} • <strong>Columns:</strong> {dataset.columns.length}
        </p>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {dataset.columns.map((column, index) => {
          const stats = getColumnStats(index);
          const isSelected = selectedColumns.includes(column);
          
          return (
            <div
              key={column}
              className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleColumnToggle(column)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{column}</h4>
                      <div className="text-sm text-gray-600">
                        {stats.hasNumericData ? (
                          <span className="text-green-600">
                            ✓ {stats.numericCount}/{stats.totalCount} numeric values
                            {stats.sampleValues.length > 0 && (
                              <span className="ml-2">
                                Sample: {stats.sampleValues.join(', ')}
                                {stats.numericCount > 3 && '...'}
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-red-600">✗ No numeric data</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedColumns.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <h4 className="font-medium text-primary-900 mb-2">
            Selected Columns ({selectedColumns.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedColumns.map(column => (
              <span
                key={column}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
              >
                {column}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleColumnToggle(column);
                  }}
                  className="ml-1 hover:text-primary-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          onClick={handleConfirm}
          disabled={selectedColumns.length === 0}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            selectedColumns.length === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'btn-primary'
          }`}
        >
          Analyze Selected Columns
        </button>
      </div>
    </div>
  );
}

