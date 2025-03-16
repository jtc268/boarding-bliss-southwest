'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [formData, setFormData] = useState({
    confirmationNumber: '',
    firstName: '',
    lastName: '',
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<null | {
    success: boolean;
    message: string;
    data?: {
      flightInfo?: string;
      output?: string;
    };
  }>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/schedule-checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Error scheduling check-in:', error);
      setResponse({
        success: false,
        message: 'Failed to schedule check-in. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-southwest-blue mb-4">
            BoardingBliss
          </h1>
          <p className="text-lg">
            Automatic Southwest Airlines Check-in Service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-2xl font-semibold mb-6">Schedule Check-in</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="confirmationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmation Number
                </label>
                <input
                  type="text"
                  id="confirmationNumber"
                  name="confirmationNumber"
                  value={formData.confirmationNumber}
                  onChange={handleChange}
                  className="input-field"
                  required
                  placeholder="e.g. ABC123"
                  maxLength={6}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-field"
                  required
                  placeholder="e.g. John"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-field"
                  required
                  placeholder="e.g. Smith"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-southwest-blue text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                disabled={loading}
              >
                {loading ? 'Scheduling...' : 'Schedule Check-in'}
              </button>
            </form>
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold mb-6">Check-in Status</h2>
            {response ? (
              <div className={`p-4 rounded-md ${response.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <h3 className={`text-lg font-medium ${response.success ? 'text-green-800' : 'text-red-800'}`}>
                  {response.success ? 'Success!' : 'Error'}
                </h3>
                <p className="mt-2">{response.message}</p>
                
                {response.success && response.data?.flightInfo && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <h4 className="font-medium mb-2">Flight Details:</h4>
                    <p className="whitespace-pre-line">{response.data.flightInfo}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-8">
                <p className="text-gray-500">
                  Submit the form to check your flight status
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            BoardingBliss automatically checks you in to your Southwest flight exactly 24 hours before departure.
          </p>
          <p className="mt-2">
            Your information is never stored and is only used to schedule your check-in.
          </p>
        </div>
      </div>
    </main>
  );
} 