import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle } from 'lucide-react';

const ReportIncident: React.FC = () => {
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const { currentUser, login, reportIncident } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to report an incident');
      return;
    }
    try {
      await reportIncident({ description });
      navigate('/');
    } catch (error) {
      setError('Failed to report incident');
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg">
          <h3 className="text-2xl font-bold text-center flex items-center justify-center">
            <AlertTriangle className="mr-2" /> Report Cyberbullying Incident
          </h3>
          <p className="mt-4">You need to be logged in to report an incident.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center flex items-center justify-center">
          <AlertTriangle className="mr-2" /> Report Cyberbullying Incident
        </h3>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block" htmlFor="description">Incident Description</label>
            <textarea
              id="description"
              placeholder="Describe the incident..."
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
            />
          </div>
          <div className="flex items-baseline justify-between">
            <button className="px-6 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-900">Report</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIncident;