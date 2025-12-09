"use client"

import React, { useState, useEffect, useRef } from "react";
import { Search, Filter, MapPin, ChevronDown, Check, X } from "lucide-react"
import { institutionsAPI } from "../services/api"
import InstitutionCard from "../components/InstitutionCard"

export default function Institutions() {
  const [institutions, setInstitutions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Multi-Select States
  const [selectedCategories, setSelectedCategories] = useState(["All"])
  const [selectedCities, setSelectedCities] = useState(["All"])
  
  const [sortBy, setSortBy] = useState("rating")

  // Dropdown UI State
  const [openDropdown, setOpenDropdown] = useState(null) // 'category' | 'city' | null
  const dropdownRef = useRef(null)

  const categories = ["All", "School", "College", "Coaching Center", "University", "Vocational Institute"]
  const cities = ["All", "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Pune", "Hyderabad"]

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // Fetch Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInstitutions();
    }, 500); 
    return () => clearTimeout(timer); 
  }, [searchTerm, selectedCategories, selectedCities, sortBy])

  const fetchInstitutions = async () => {
    try {
      setLoading(true)
      
      // Convert Array to "School,College" for backend OR logic
      const categoryParam = selectedCategories.includes("All") ? "All" : selectedCategories.join(",");
      const cityParam = selectedCities.includes("All") ? "All" : selectedCities.join(",");

      const params = {
        search: searchTerm,
        category: categoryParam,
        city: cityParam,
        sortBy: sortBy,
      }
      const response = await institutionsAPI.getAll(params)
      setInstitutions(response.data.data)
    } catch (error) {
      console.error("Error fetching institutions:", error)
    } finally {
      setLoading(false)
    }
  }

  // Toggle Selection Helper
  const toggleSelection = (item, currentList, setList) => {
    let newList = [...currentList];

    if (item === "All") {
        setList(["All"]);
        return;
    }

    if (newList.includes("All")) {
        newList = []; // Clear "All" if selecting specific item
    }

    if (newList.includes(item)) {
        newList = newList.filter(i => i !== item); // Uncheck
    } else {
        newList.push(item); // Check
    }

    if (newList.length === 0) newList = ["All"]; // Revert to All if empty

    setList(newList);
  };

  const getFilterSummary = () => {
    const filters = []
    if (searchTerm) filters.push("Search")
    if (!selectedCategories.includes("All")) filters.push(`${selectedCategories.length} Categories`)
    if (!selectedCities.includes("All")) filters.push(`${selectedCities.length} Cities`)
    if (filters.length === 0) return "None"
    return filters.join(", ")
  }

  // --- COMPONENT HELPERS ---
  const renderMultiSelect = (label, options, selectedValues, setValues, type) => (
    <div className="relative">
        <button 
            onClick={() => setOpenDropdown(openDropdown === type ? null : type)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white flex justify-between items-center text-gray-700 hover:border-blue-500 focus:outline-none"
        >
            <span className="truncate">
                {selectedValues.includes("All") ? label : `${selectedValues.length} Selected`}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>

        {openDropdown === type && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                {options.map((option) => {
                    const isSelected = selectedValues.includes(option);
                    return (
                        <div 
                            key={option} 
                            onClick={() => toggleSelection(option, selectedValues, setValues)}
                            className={`px-4 py-2 cursor-pointer flex items-center justify-between text-sm hover:bg-blue-50 ${isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                        >
                            <span>{option}</span>
                            {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                        </div>
                    );
                })}
            </div>
        )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8" onClick={() => setOpenDropdown(null)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Institution</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover top-rated schools, colleges, and coaching centers that match your educational goals
          </p>
        </div>

        {/* Search and Filters */}
        <div 
            ref={dropdownRef}
            className="bg-white rounded-lg shadow-md p-6 mb-8 sticky top-4 z-20"
            onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Search Input */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search institutions, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Dropdowns */}
            {renderMultiSelect("All Categories", categories, selectedCategories, setSelectedCategories, 'category')}
            {renderMultiSelect("All Cities", cities, selectedCities, setSelectedCities, 'city')}

            {/* Sort */}
            <div className="relative">
                <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                >
                <option value="rating">Highest Rated</option>
                <option value="students">Most Students</option>
                <option value="name">Name A-Z</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Active Tags */}
          {(selectedCategories.length > 0 && !selectedCategories.includes("All") || selectedCities.length > 0 && !selectedCities.includes("All")) && (
              <div className="mt-4 flex flex-wrap gap-2 animate-fade-in">
                  {!selectedCategories.includes("All") && selectedCategories.map(cat => (
                      <span key={cat} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {cat}
                          <button onClick={() => toggleSelection(cat, selectedCategories, setSelectedCategories)} className="ml-2 hover:text-blue-900"><X className="h-3 w-3" /></button>
                      </span>
                  ))}
                  {!selectedCities.includes("All") && selectedCities.map(city => (
                      <span key={city} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {city}
                          <button onClick={() => toggleSelection(city, selectedCities, setSelectedCities)} className="ml-2 hover:text-purple-900"><X className="h-3 w-3" /></button>
                      </span>
                  ))}
                  <button onClick={() => { setSelectedCategories(["All"]); setSelectedCities(["All"]); }} className="text-sm text-gray-500 hover:text-gray-700 underline ml-2">Clear Filters</button>
              </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">Showing <span className="font-semibold">{institutions.length}</span> institutions</p>
          <div className="flex items-center space-x-2 text-sm text-gray-500"><Filter className="h-4 w-4" /><span>Filters: {getFilterSummary()}</span></div>
        </div>

        {/* Results */}
        {loading ? (
           <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
           </div>
        ) : (
           <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {institutions.map((institution) => <InstitutionCard key={institution._id} institution={institution} />)}
            </div>
            {institutions.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No institutions found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
           </>
        )}
      </div>
    </div>
  )
}