"use client";
import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [apiTest, setApiTest] = useState('Testing...');
  const [envVars, setEnvVars] = useState<any>({});

  useEffect(() => {
    fetch('/api/test-connection')
      .then(r => r.json())
      .then(data => setApiTest(JSON.stringify(data, null, 2)))
      .catch(e => setApiTest('ERROR: ' + e.message));

    fetch('/api/env-check')
      .then(r => r.json())
      .then(data => setEnvVars(data))
      .catch(e => setEnvVars({ error: e.message }));
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-400 p-8 font-mono text-sm">
      <h1 className="text-3xl mb-8 text-white">DEBUG DASHBOARD</h1>
      
      <section className="mb-8 border border-green-400 p-4">
        <h2 className="text-xl mb-4 text-yellow-400">ENV VARIABLES</h2>
        <pre className="bg-gray-900 p-4 rounded overflow-auto">
          {JSON.stringify(envVars, null, 2)}
        </pre>
      </section>

      <section className="mb-8 border border-green-400 p-4">
        <h2 className="text-xl mb-4 text-yellow-400">API TEST</h2>
        <pre className="bg-gray-900 p-4 rounded overflow-auto">
          {apiTest}
        </pre>
      </section>

      <section className="mb-8 border border-green-400 p-4">
        <h2 className="text-xl mb-4 text-yellow-400">TAILWIND TEST</h2>
        <div className="text-white">Can you see white text?</div>
        <div className="bg-red-500 p-2 mt-2">Red background?</div>
        <div className="bg-blue-500 p-2 mt-2">Blue background?</div>
      </section>
    </div>
  );
}
