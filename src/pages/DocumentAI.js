import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './../App.css';

const DocumentAI = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('lease');
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setMessage('');
    } else {
      setMessage('Please select a PDF file.');
      setSelectedFile(null);
    }
  };

  const handleParse = async () => {
    if (!selectedFile) {
      setMessage('Please select a PDF first.');
      return;
    }

    setParsing(true);
    setMessage('Parsing with AI...');

    // In a real implementation, you would upload the PDF to your backend
    // and call DeepSeek API with the file content.
    // For this demo, we'll simulate an API call with a timeout.
    setTimeout(() => {
      const mockResult = documentType === 'lease'
        ? {
            tenant_name: 'Acme Corporation',
            start_date: '2025-01-01',
            end_date: '2029-12-31',
            base_rent: 12500,
            escalation_rate: 3.5,
            cam_responsibilities: 'Tenant pays 20% of common area maintenance',
          }
        : {
            vendor_name: 'SecureTech Solutions',
            start_date: '2024-06-15',
            end_date: '2025-06-14',
            scope_of_work: 'Monthly security system maintenance and monitoring',
            rate: 850,
            renewal_terms: 'Automatic annual renewal with 5% increase',
          };

      setParsedData(mockResult);
      setParsing(false);
      setMessage('Parsing complete! Review the extracted data below.');
    }, 2000);
  };

  const handleImport = async () => {
    if (!parsedData) {
      setMessage('No parsed data to import.');
      return;
    }

    setImporting(true);
    setMessage('Importing to database...');

    try {
      if (documentType === 'lease') {
        // Insert into leases table
        const { error } = await supabase
          .from('leases')
          .insert([
            {
              tenant_id: null, // Would need to match tenant by name
              start_date: parsedData.start_date,
              end_date: parsedData.end_date,
              base_rent: parsedData.base_rent,
              escalation_rate: parsedData.escalation_rate,
              cam_responsibilities: parsedData.cam_responsibilities,
              // other fields as needed
            },
          ]);

        if (error) throw error;
        setMessage('Lease imported successfully!');
      } else {
        // Insert into vendor_contracts table (assume it exists)
        const { error } = await supabase
          .from('vendor_contracts')
          .insert([
            {
              vendor_name: parsedData.vendor_name,
              start_date: parsedData.start_date,
              end_date: parsedData.end_date,
              scope_of_work: parsedData.scope_of_work,
              rate: parsedData.rate,
              renewal_terms: parsedData.renewal_terms,
            },
          ]);

        if (error) throw error;
        setMessage('Vendor contract imported successfully!');
      }
    } catch (err) {
      console.error('Import error:', err);
      setMessage('Error importing: ' + err.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="page-container">
      <header className="dashboard-header">
        <h2>AI‑Powered Document Parsing</h2>
        <p>Upload a lease or vendor contract PDF to automatically extract key terms.</p>
      </header>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Left Column: Upload & Controls */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Upload & Parse</h3>
          </div>
          <div className="card-content">
            <div className="form-group">
              <label htmlFor="file-upload" className="form-label">
                Select PDF
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="form-input"
              />
              {selectedFile && (
                <p className="file-info">
                  <strong>Selected:</strong> {selectedFile.name}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="form-select"
              >
                <option value="lease">Lease Agreement</option>
                <option value="vendor">Vendor Contract</option>
              </select>
            </div>

            <button
              className="btn-primary"
              onClick={handleParse}
              disabled={parsing || !selectedFile}
              style={{ marginTop: '1rem', width: '100%' }}
            >
              {parsing ? 'Parsing...' : 'Parse with AI'}
            </button>

            {message && (
              <div className={`message ${message.includes('Error') ? 'error' : 'info'}`}>
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Extracted Data */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Extracted Data</h3>
            <span className="card-badge">
              {parsedData ? 'Ready' : 'Pending'}
            </span>
          </div>
          <div className="card-content">
            {parsedData ? (
              <>
                <pre className="json-display">
                  {JSON.stringify(parsedData, null, 2)}
                </pre>
                <button
                  className="btn-success"
                  onClick={handleImport}
                  disabled={importing}
                  style={{ marginTop: '1rem', width: '100%' }}
                >
                  {importing ? 'Importing...' : 'Import to Database'}
                </button>
                <p className="help-text">
                  This will insert the parsed data into the appropriate Supabase table.
                </p>
              </>
            ) : (
              <div className="placeholder-data">
                <p>No data extracted yet.</p>
                <p className="help-text">
                  Upload a PDF and click "Parse with AI" to see extracted terms.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="dashboard-card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h3>How It Works</h3>
        </div>
        <div className="card-content">
          <ol className="instructions-list">
            <li>Select a PDF lease or vendor contract.</li>
            <li>Choose the document type from the dropdown.</li>
            <li>Click "Parse with AI" – the system sends the PDF to DeepSeek API with a prompt to extract key terms.</li>
            <li>Review the extracted JSON in the right panel.</li>
            <li>Click "Import to Database" to save the data into the correct table (leases or vendor_contracts).</li>
          </ol>
          <p className="help-text">
            <strong>Note:</strong> This demo uses mock data. To enable real AI parsing, set up a backend endpoint that calls the DeepSeek API with your API key.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentAI;