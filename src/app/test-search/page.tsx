"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TestSearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Test search for:', searchQuery.trim());
      const searchUrl = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      console.log('Test navigating to:', searchUrl);
      router.push(searchUrl);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Test Search Page</h1>
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium mb-2">
            Test Search:
          </label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter search query..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Test Search
        </button>
      </form>
      <div className="mt-4">
        <p>Current query: {searchQuery}</p>
        <p>Search URL would be: /search?q={encodeURIComponent(searchQuery)}</p>
      </div>
    </div>
  );
}
