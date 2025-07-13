'use client';

import { useState } from 'react';
import axios from 'axios';

export default function SearchBar({ onUserSelect }: { onUserSelect: (user: any) => void }) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = async () => {
    if (!search.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    const res = await axios.get(`/api/friends/search?nickname=${search}`);
    setResults(res.data);
    setShowDropdown(true);
  };

  const handleSelect = (user: any) => {
    onUserSelect(user);
    setSearch('');
    setResults([]);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          handleSearch();
        }}
        placeholder="Search users"
        className="w-full px-3 py-2 border rounded bg-white text-black"
      />
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded shadow max-h-60 overflow-y-auto">
          {results.map((user) => (
            <li
              key={user._id}
              onClick={() => handleSelect(user)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {user.nickname}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}