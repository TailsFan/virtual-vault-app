"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from '@/lib/types';

export default function TestSearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "Products");
        const snapshot = await getDocs(productsCollection);
        const products = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as Product));
        setAllProducts(products);
        console.log('All products loaded:', products);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
      <div className="mt-4 space-y-2">
        <p>Current query: {searchQuery}</p>
        <p>Search URL would be: /search?q={encodeURIComponent(searchQuery)}</p>
        
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div>
            <p>Total products in database: {allProducts.length}</p>
            <div className="mt-2">
              <p className="font-semibold">All product names:</p>
              <ul className="list-disc list-inside max-h-40 overflow-y-auto">
                {allProducts.map((product, index) => (
                  <li key={product.id} className="text-sm">
                    {index + 1}. {product.name}
                  </li>
                ))}
              </ul>
            </div>
            
            {searchQuery && (
              <div className="mt-4">
                <p className="font-semibold">Search results for "{searchQuery}":</p>
                {allProducts.filter(product => 
                  product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  product.description?.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((product, index) => (
                  <div key={product.id} className="border p-2 mt-2 rounded">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
