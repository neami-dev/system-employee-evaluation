import { CheckCircle2 } from 'lucide-react';
import React from 'react';

function GithubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 flex flex-col justify-center items-center p-4">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">GitHub</h1>
      <ul className="text-lg text-gray-800 list-none space-y-2 mb-8">
        <li className="flex items-center mb-9">
          <CheckCircle2 className="h-9 w-9 text-green-500 mr-2" /> {/* "DONE" icon */}
          <span className="text-green-600 text-[25px] font-semibold">Token is integrated</span>
        </li>
        <li className="flex items-center my-5">
          <CheckCircle2 className="h-9 w-9 text-gray-500 mr-2" /> {/* "DONE" icon */}
          <span className="text-gray-600 text-[25px] font-semibold">Choose the repo you are working on</span>
        </li>
        
      </ul>
      <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition duration-150 ease-in-out transform hover:scale-105">
        Choose the Repo
      </button>
    </div>
  );
}

export default GithubPage;
