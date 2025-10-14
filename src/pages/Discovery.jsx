/**
 * Discovery Page
 * Browse and search for analysts with comprehensive filters
 * Features: Search, Filters (sidebar + mobile), Sort, Pagination, Responsive Grid
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import AnalystCard from '../components/AnalystCard';
import { generateAnalysts, filterAnalysts, sortAnalysts, specializations, languages } from '../utils/dummyAnalysts';
import { formatCompactNumber } from '../utils/helpers';

const Discovery = () => {
  // State management
  const [allAnalysts] = useState(generateAnalysts(30));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 300000]); // in paisa
  const [hasFreeAudience, setHasFreeAudience] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false); // Mobile filter toggle
  const [displayCount, setDisplayCount] = useState(12); // For load more functionality

  // Debounced search (using useMemo for simplicity)
  const debouncedSearch = useMemo(() => searchQuery, [searchQuery]);

  // Filter and sort analysts
  const filteredAndSortedAnalysts = useMemo(() => {
    const filters = {
      search: debouncedSearch,
      specializations: selectedSpecializations,
      languages: selectedLanguages,
      minRating: minRating,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      hasFreeAudience: hasFreeAudience,
    };

    const filtered = filterAnalysts(allAnalysts, filters);
    const sorted = sortAnalysts(filtered, sortBy);
    return sorted;
  }, [allAnalysts, debouncedSearch, selectedSpecializations, selectedLanguages, minRating, priceRange, hasFreeAudience, sortBy]);

  // Paginated analysts
  const displayedAnalysts = filteredAndSortedAnalysts.slice(0, displayCount);
  const hasMore = displayCount < filteredAndSortedAnalysts.length;

  // Handle specialization filter
  const toggleSpecialization = (spec) => {
    setSelectedSpecializations(prev =>
      prev.includes(spec)
        ? prev.filter(s => s !== spec)
        : [...prev, spec]
    );
  };

  // Handle language filter
  const toggleLanguage = (lang) => {
    setSelectedLanguages(prev =>
      prev.includes(lang)
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedSpecializations([]);
    setSelectedLanguages([]);
    setMinRating(0);
    setPriceRange([0, 300000]);
    setHasFreeAudience(false);
    setSortBy('popular');
  };

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedSpecializations.length > 0) count++;
    if (selectedLanguages.length > 0) count++;
    if (minRating > 0) count++;
    if (priceRange[0] > 0 || priceRange[1] < 300000) count++;
    if (hasFreeAudience) count++;
    return count;
  }, [selectedSpecializations, selectedLanguages, minRating, priceRange, hasFreeAudience]);

  return (
    <div className="discovery-page min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            AnalystHub
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:block">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/login" className="sm:hidden">
              <button className="p-2 text-gray-600 hover:text-primary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Page Title & Search */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Discover Analysts
          </h1>
          <p className="text-gray-600 mb-4">
            Browse {allAnalysts.length}+ SEBI registered analysts
          </p>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, specialization..."
              className="w-full h-12 pl-12 pr-4 border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
            />
            <svg
              className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filter Button & Sort */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-xl hover:border-primary transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="font-medium">Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 px-4 border-2 border-gray-300 rounded-xl bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="popular">Popular</option>
            <option value="rating_desc">Highest Rated</option>
            <option value="subscribers_desc">Most Subscribers</option>
            <option value="price_asc">Lowest Price</option>
            <option value="created_desc">Newest</option>
          </select>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-primary hover:text-primary-dark font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Specializations */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Specialization</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {specializations.slice(0, 8).map((spec) => (
                    <label key={spec} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedSpecializations.includes(spec)}
                        onChange={() => toggleSpecialization(spec)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-primary transition">
                        {spec}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Languages</h3>
                <div className="space-y-2">
                  {languages.slice(0, 6).map((lang) => (
                    <label key={lang} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedLanguages.includes(lang)}
                        onChange={() => toggleLanguage(lang)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-primary transition">
                        {lang}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Minimum Rating</h3>
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === rating}
                        onChange={() => setMinRating(rating)}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-2 focus:ring-primary cursor-pointer"
                      />
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-gray-700 group-hover:text-primary transition">
                          {rating}+ Stars
                        </span>
                      </div>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === 0}
                      onChange={() => setMinRating(0)}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-2 focus:ring-primary cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-primary transition">
                      All Ratings
                    </span>
                  </label>
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange[0] === 0 && priceRange[1] === 300000}
                      onChange={() => setPriceRange([0, 300000])}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-2 focus:ring-primary cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-primary transition">
                      All Prices
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange[0] === 0 && priceRange[1] === 50000}
                      onChange={() => setPriceRange([0, 50000])}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-2 focus:ring-primary cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-primary transition">
                      Under ₹500/mo
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange[0] === 50000 && priceRange[1] === 100000}
                      onChange={() => setPriceRange([50000, 100000])}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-2 focus:ring-primary cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-primary transition">
                      ₹500 - ₹1000/mo
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange[0] === 100000 && priceRange[1] === 300000}
                      onChange={() => setPriceRange([100000, 300000])}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-2 focus:ring-primary cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-primary transition">
                      ₹1000+ /mo
                    </span>
                  </label>
                </div>
              </div>

              {/* Other Filters */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Other</h3>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={hasFreeAudience}
                    onChange={(e) => setHasFreeAudience(e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-primary transition">
                    Free Content Available
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Mobile Filters Modal */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => setShowFilters(false)}
              />

              {/* Filter Panel */}
              <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white shadow-2xl overflow-y-auto animate-slideIn">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Specializations */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Specialization</h3>
                    <div className="space-y-2">
                      {specializations.slice(0, 8).map((spec) => (
                        <label key={spec} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedSpecializations.includes(spec)}
                            onChange={() => toggleSpecialization(spec)}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700">{spec}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Languages</h3>
                    <div className="space-y-2">
                      {languages.slice(0, 6).map((lang) => (
                        <label key={lang} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedLanguages.includes(lang)}
                            onChange={() => toggleLanguage(lang)}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Minimum Rating</h3>
                    <div className="space-y-2">
                      {[4.5, 4.0, 3.5, 0].map((rating) => (
                        <label key={rating} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="rating-mobile"
                            checked={minRating === rating}
                            onChange={() => setMinRating(rating)}
                            className="w-4 h-4 text-primary border-gray-300 focus:ring-2 focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700">
                            {rating > 0 ? `${rating}+ Stars` : 'All Ratings'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="price-mobile"
                          checked={priceRange[0] === 0 && priceRange[1] === 300000}
                          onChange={() => setPriceRange([0, 300000])}
                          className="w-4 h-4 text-primary border-gray-300 focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">All Prices</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="price-mobile"
                          checked={priceRange[0] === 0 && priceRange[1] === 50000}
                          onChange={() => setPriceRange([0, 50000])}
                          className="w-4 h-4 text-primary border-gray-300 focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">Under ₹500/mo</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="price-mobile"
                          checked={priceRange[0] === 50000 && priceRange[1] === 100000}
                          onChange={() => setPriceRange([50000, 100000])}
                          className="w-4 h-4 text-primary border-gray-300 focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">₹500 - ₹1000/mo</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="price-mobile"
                          checked={priceRange[0] === 100000 && priceRange[1] === 300000}
                          onChange={() => setPriceRange([100000, 300000])}
                          className="w-4 h-4 text-primary border-gray-300 focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">₹1000+ /mo</span>
                      </label>
                    </div>
                  </div>

                  {/* Other */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Other</h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasFreeAudience}
                        onChange={(e) => setHasFreeAudience(e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">Free Content Available</span>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={clearAllFilters}
                    >
                      Clear All
                    </Button>
                    <Button
                      fullWidth
                      onClick={() => setShowFilters(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Grid */}
          <div className="lg:col-span-3">
            {/* Results Header - Desktop */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{displayedAnalysts.length}</span> of{' '}
                <span className="font-semibold text-gray-900">{filteredAndSortedAnalysts.length}</span> analysts
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 px-4 border-2 border-gray-300 rounded-xl bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="popular">Most Popular</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="subscribers_desc">Most Subscribers</option>
                <option value="price_asc">Lowest Price</option>
                <option value="created_desc">Newest First</option>
              </select>
            </div>

            {/* Active Filters Pills */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-sm text-gray-600 font-medium">Active filters:</span>
                {selectedSpecializations.map((spec) => (
                  <span
                    key={spec}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary-light text-primary rounded-full text-xs font-medium"
                  >
                    {spec}
                    <button
                      onClick={() => toggleSpecialization(spec)}
                      className="hover:text-primary-dark"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))}
                {selectedLanguages.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                  >
                    {lang}
                    <button
                      onClick={() => toggleLanguage(lang)}
                      className="hover:text-blue-900"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Analysts Grid */}
            {displayedAnalysts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayedAnalysts.map((analyst) => (
                    <AnalystCard key={analyst.id} analyst={analyst} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center mt-8">
                    <Button
                      onClick={() => setDisplayCount(prev => prev + 12)}
                      variant="outline"
                      size="lg"
                    >
                      Load More Analysts
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                      Showing {displayedAnalysts.length} of {filteredAndSortedAnalysts.length}
                    </p>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No analysts found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={clearAllFilters} variant="outline">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discovery;
