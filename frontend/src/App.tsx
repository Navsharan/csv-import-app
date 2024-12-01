import { useRef } from 'react';
import { FileUpload } from './components/FileUpload'
import { DataTable } from './components/DataTable'

function App() {
  const dataTableRef = useRef<{ refreshData: () => void } | null>(null);

  const handleUploadSuccess = () => {
    dataTableRef.current?.refreshData();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">CSV Data Import</h1>
        
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Import Data</h2>
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Data View</h2>
            <DataTable ref={dataTableRef} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
