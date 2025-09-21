'use client';

import { useState } from 'react';
import { testFirebaseConnection, getUserByEmail } from '@/utils/testConnection';
import { Play, Database, Users, CheckCircle, XCircle } from 'lucide-react';

export default function TestConnectionPage() {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [userResult, setUserResult] = useState(null);

  const runConnectionTest = async () => {
    setLoading(true);
    setTestResults(null);
    
    try {
      const results = await testFirebaseConnection();
      setTestResults(results);
    } catch (error) {
      setTestResults({
        success: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const testUserLookup = async () => {
    if (!email) return;
    
    setLoading(true);
    setUserResult(null);
    
    try {
      const user = await getUserByEmail(email);
      setUserResult(user);
    } catch (error) {
      setUserResult({
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Firebase Connection Test</h1>
          <p className="mt-2 text-sm text-gray-600">
            Test your connection to the existing Firebase database
          </p>
        </div>

        <div className="mt-8 space-y-8">
          {/* Connection Test */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-900">Database Connection Test</h2>
                  <p className="text-sm text-gray-500">Test connection to your users collection</p>
                </div>
              </div>
              <button
                onClick={runConnectionTest}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <Play className="h-4 w-4 mr-2" />
                {loading ? 'Testing...' : 'Run Test'}
              </button>
            </div>

            {testResults && (
              <div className="mt-6">
                {testResults.success ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          Connection Successful!
                        </h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>Found {testResults.userCount} users in the database</p>
                          {testResults.users && testResults.users.length > 0 && (
                            <div className="mt-4">
                              <h4 className="font-medium">Users:</h4>
                              <ul className="mt-2 space-y-1">
                                {testResults.users.map((user, index) => (
                                  <li key={user.id} className="text-xs">
                                    {index + 1}. {user.email} (ID: {user.user_identity})
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <XCircle className="h-5 w-5 text-red-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Connection Failed
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{testResults.error}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Lookup Test */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Users className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">User Lookup Test</h2>
                <p className="text-sm text-gray-500">Test finding a user by email</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter user email"
                className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                onClick={testUserLookup}
                disabled={loading || !email}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <Play className="h-4 w-4 mr-2" />
                {loading ? 'Searching...' : 'Find User'}
              </button>
            </div>

            {userResult && (
              <div className="mt-4">
                {userResult.error ? (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <XCircle className="h-5 w-5 text-red-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                        <p className="text-sm text-red-700">{userResult.error}</p>
                      </div>
                    </div>
                  </div>
                ) : userResult ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">User Found!</h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p><strong>ID:</strong> {userResult.id}</p>
                          <p><strong>Email:</strong> {userResult.email}</p>
                          <p><strong>User Identity:</strong> {userResult.user_identity || userResult.userIdentity}</p>
                          <p><strong>Has Password:</strong> {userResult.password ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex">
                      <XCircle className="h-5 w-5 text-yellow-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">User Not Found</h3>
                        <p className="text-sm text-yellow-700">No user found with that email address</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-4">Next Steps</h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p>1. Make sure your Firebase configuration is correct in <code className="bg-blue-100 px-2 py-1 rounded">.env.local</code></p>
              <p>2. Ensure your Firestore security rules allow read access to the users collection</p>
              <p>3. If the connection test fails, check your Firebase project settings</p>
              <p>4. Once connected, you can use the User Management section to manage your existing users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}