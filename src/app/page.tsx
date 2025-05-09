"use client";

import { JSX, useState, useMemo, useCallback } from "react";
import { useAdvocates } from "@/hooks/useAdvocates";
import { useDebounce } from "@/hooks/useDebounce";
import "./globals.css";

export default function Home(): JSX.Element {
  const { advocates, setFilteredAdvocates, isLoading, error } = useAdvocates();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const resetSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  const filteredAdvocates = useMemo(() => {
    if (!debouncedSearchTerm) {
      return advocates;
    }

    const searchTermLower = debouncedSearchTerm.toLowerCase();
    const isNumeric = /^\d+$/.test(debouncedSearchTerm);

    return advocates.filter((advocate) => {
      const stringMatch =
        advocate.firstName.toLowerCase().includes(searchTermLower) ||
        advocate.lastName.toLowerCase().includes(searchTermLower) ||
        advocate.city.toLowerCase().includes(searchTermLower) ||
        advocate.degree.toLowerCase().includes(searchTermLower) ||
        advocate.specialties.some(specialty =>
          specialty.toLowerCase().includes(searchTermLower)
        );

      // Number-based searches
      const numberMatch = isNumeric && (
        advocate.yearsOfExperience.toString() === debouncedSearchTerm ||
        advocate.phoneNumber.toString().includes(debouncedSearchTerm)
      );

      return stringMatch || numberMatch;
    });
  }, [advocates, debouncedSearchTerm]);

  const onClick = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  // Handle specialty tag clicks
  const handleSpecialtyClick = (specialty: string) => {
    setSearchTerm(specialty);

    const searchTermLower = specialty.toLowerCase();
    const filtered = advocates.filter((advocate) =>
      advocate.specialties.some(spec => spec.toLowerCase().includes(searchTermLower))
    );

    setFilteredAdvocates(filtered);
  };

  // hook actions
  if(isLoading) {
    return (
      <main id="advocates-main" className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 id="page-title" className="text-3xl font-bold text-gray-800">
          Solace Advocates
        </h1>
        <p className="text-gray-500 mb-8">Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main id="advocates-main" className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 id="page-title" className="text-3xl font-bold text-gray-800">
          Solace Advocates
        </h1>
        <p className="text-red-500 mb-8">Error: {error.message}</p>
      </main>
    );
  }

  return (
    <main id="advocates-main" className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 id="page-title" className="text-3xl font-bold text-gray-800">
        Solace Advocates
      </h1>
      <p className="text-gray-500 mb-8">
        Find the right advocate for your needs
      </p>

      <div id="search-container" className="card mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-grow">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={handleSearch}
                className="advocate-search-input"
                placeholder="Search by any field..."
                aria-label="Search advocates"
              />
            </div>
          </div>
          <button id="reset-search" onClick={onClick} className="btn-primary">
            Reset Search
          </button>
        </div>
        {searchTerm && (
          <p
            id="search-term-display"
            className="mt-1 text-sm text-gray-500"
          >
            Searching for:{" "}
            <span className="font-medium">{searchTerm}</span>
          </p>
        )}
      </div>

      <div
        id="advocates-table-container"
        className="overflow-x-auto shadow-md rounded-lg"
      >
        <table
          className="min-w-full divide-y divide-gray-200"
          aria-label="Advocates list"
        >
          <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="advocate-table-header">
              First Name
            </th>
            <th scope="col" className="advocate-table-header">
              Last Name
            </th>
            <th scope="col" className="advocate-table-header">
              City
            </th>
            <th scope="col" className="advocate-table-header">
              Degree
            </th>
            <th scope="col" className="advocate-table-header">
              Specialties
            </th>
            <th scope="col" className="advocate-table-header">
              Experience
            </th>
            <th scope="col" className="advocate-table-header">
              Phone
            </th>
          </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {filteredAdvocates.length > 0 ? (
            filteredAdvocates.map((advocate, index) => (
              <tr
                key={`advocate-${advocate.firstName}-${advocate.lastName}`}
                className="hover:bg-gray-50"
              >
                <td className="advocate-table-cell-primary">
                  {advocate.firstName}
                </td>
                <td className="advocate-table-cell">{advocate.lastName}</td>
                <td className="advocate-table-cell">{advocate.city}</td>
                <td className="advocate-table-cell">{advocate.degree}</td>
                <td className="advocate-table-cell">
                  <div className="flex flex-wrap gap-1">
                    {advocate.specialties.map((specialty, idx) => (
                      <span
                        key={`specialty-${index}-${idx}`}
                        className="advocate-specialty-tag cursor-pointer hover:bg-blue-200"
                        onClick={() => handleSpecialtyClick(specialty)}
                        title="Click to search for this specialty"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="advocate-table-cell">
                  {advocate.yearsOfExperience}
                </td>
                <td className="advocate-table-cell">
                  {advocate.phoneNumber}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={7}
                className="advocate-table-cell text-center"
                id="no-results"
              >
                No advocates found matching your search criteria.
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

      {filteredAdvocates.length > 0 && (
        <p id="results-counter" className="mt-3 text-sm text-gray-500">
          Showing {filteredAdvocates.length}{" "}
          {filteredAdvocates.length === 1 ? "advocate" : "advocates"}
        </p>
      )}
    </main>
  );
}
