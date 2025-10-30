/**
 * Landing Page
 * First page users see when visiting the site
 * Features: Hero, Features Section, How It Works, Featured Analysts, Pricing Info, Footer
 */

import { Link } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/common/Button';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Featured analysts data
  const featuredAnalysts = [
    {
      id: 1,
      name: 'Rajesh Mehta',
      photo: 'https://ui-avatars.com/api/?name=Rajesh+Mehta&background=10B981&color=fff&size=128',
      specialization: 'Equity & F&O',
      rating: 4.8,
      reviewCount: 342,
      subscribers: 2300,
      verified: true,
    },
    {
      id: 2,
      name: 'Priya Sharma',
      photo: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=10B981&color=fff&size=128',
      specialization: 'Technical Analysis',
      rating: 4.9,
      reviewCount: 428,
      subscribers: 3100,
      verified: true,
    },
    {
      id: 3,
      name: 'Amit Kumar',
      photo: 'https://ui-avatars.com/api/?name=Amit+Kumar&background=10B981&color=fff&size=128',
      specialization: 'Commodity Trading',
      rating: 4.7,
      reviewCount: 276,
      subscribers: 1800,
      verified: true,
    },
    {
      id: 4,
      name: 'Sneha Patel',
      photo: 'https://ui-avatars.com/api/?name=Sneha+Patel&background=10B981&color=fff&size=128',
      specialization: 'Options Trading',
      rating: 4.9,
      reviewCount: 512,
      subscribers: 4200,
      verified: true,
    },
  ];

  return (
    <div className="landing-page min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            AnalystHub
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/discovery" className="text-gray-600 hover:text-primary font-medium transition">
              Browse Analysts
            </Link>
            <a href="#how-it-works" className="text-gray-600 hover:text-primary font-medium transition">
              How it Works
            </a>
            <Link to="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/discovery">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-primary"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 animate-slideDown">
            <nav className="flex flex-col p-4 gap-3">
              <Link
                to="/discovery"
                className="px-4 py-3 text-gray-600 hover:text-primary hover:bg-primary-light rounded-lg font-medium transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Analysts
              </Link>
              <a
                href="#how-it-works"
                className="px-4 py-3 text-gray-600 hover:text-primary hover:bg-primary-light rounded-lg font-medium transition"
                onClick={() => setIsMenuOpen(false)}
              >
                How it Works
              </a>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" size="md" fullWidth>
                  Sign In
                </Button>
              </Link>
              <Link to="/discovery" onClick={() => setIsMenuOpen(false)}>
                <Button size="md" fullWidth>
                  Get Started
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-light via-white to-blue-50 py-12 md:py-20 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 opacity-5 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
                <span className="flex items-center justify-center w-6 h-6 bg-primary rounded-full">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-sm font-semibold text-gray-700">SEBI Registered Analysts</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                Connect with India's Top <span className="text-primary">SEBI Registered</span> Analysts
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Get expert trading calls, market insights, and join exclusive communities. Track performance, learn strategies, and trade with confidence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8">
                <Link to="/discovery">
                  <Button size="lg" className="shadow-xl">
                    Browse Analysts
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline">
                    Sign In
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-primary border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 font-medium">10,000+ traders trust us</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="w-5 h-5 text-warning" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 font-medium">4.8/5.0 rating</span>
                </div>
              </div>
            </div>

            {/* Right Column - Hero Image/Illustration */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="bg-gradient-to-br from-primary to-blue-500 rounded-2xl p-8 shadow-2xl">
                  <div className="bg-white rounded-xl p-6 space-y-4">
                    {/* Mock Trading Call Card */}
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                          <span className="text-primary font-bold">RM</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Rajesh Mehta</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        BUY
                      </span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">RELIANCE</p>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Entry</p>
                          <p className="font-bold text-gray-900">2450</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Target</p>
                          <p className="font-bold text-green-600">2580</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Stop Loss</p>
                          <p className="font-bold text-red-600">2410</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-xs text-gray-600">Confidence: High</span>
                      <span className="text-xs font-semibold text-primary">View Details</span>
                    </div>
                  </div>
                </div>

                {/* Floating stats */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Success Rate</p>
                  <p className="text-2xl font-bold text-green-600">87%</p>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Active Calls</p>
                  <p className="text-2xl font-bold text-primary">24</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AnalystHub?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get everything you need to make informed trading decisions from verified professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-xl hover:bg-primary-light transition group">
              <div className="w-16 h-16 bg-primary-light group-hover:bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 transition">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Verified Analysts</h3>
              <p className="text-gray-600">
                SEBI registered and RIA certified professionals with transparent track records
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-xl hover:bg-primary-light transition group">
              <div className="w-16 h-16 bg-primary-light group-hover:bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 transition">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Real-time Calls</h3>
              <p className="text-gray-600">
                Get trading calls across equity, F&O, commodities with instant notifications
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-xl hover:bg-primary-light transition group">
              <div className="w-16 h-16 bg-primary-light group-hover:bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 transition">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Community Access</h3>
              <p className="text-gray-600">
                Join exclusive chat communities and interact directly with analysts
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6 rounded-xl hover:bg-primary-light transition group">
              <div className="w-16 h-16 bg-primary-light group-hover:bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 transition">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Track Performance</h3>
              <p className="text-gray-600">
                See historical call performance, accuracy rates, and ROI metrics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-1 bg-gradient-to-r from-primary via-primary to-primary" style={{ top: '4rem' }} />

            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-center mb-3 text-gray-900">Browse Verified Analysts</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Discover SEBI-registered analysts with transparent track records. Filter by specialization, rating, and price to find your perfect match.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-center mb-3 text-gray-900">Subscribe to Their Tier</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Choose a plan that fits your trading style - free tier or paid plans with weekly, monthly, or yearly options.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold text-center mb-3 text-gray-900">Get Calls & Join Community</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Receive real-time trading calls, market insights, and access exclusive community chat. Trade with confidence!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Analysts Section */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Analysts
            </h2>
            <p className="text-lg text-gray-600">
              Meet some of our top-rated SEBI registered analysts
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredAnalysts.map((analyst) => (
              <div
                key={analyst.id}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary hover:shadow-xl transition group"
              >
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <img
                      src={analyst.photo}
                      alt={analyst.name}
                      className="w-20 h-20 rounded-full mx-auto border-4 border-primary-light"
                    />
                    {analyst.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 mb-1">{analyst.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{analyst.specialization}</p>

                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(analyst.rating) ? 'text-warning' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{analyst.rating}</span>
                    <span className="text-xs text-gray-500">({analyst.reviewCount})</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {(analyst.subscribers / 1000).toFixed(1)}K subscribers
                  </p>

                  <Link to={`/analyst/${analyst.id}`}>
                    <Button variant="outline" size="sm" fullWidth className="group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/discovery">
              <Button size="lg" variant="outline">
                View All Analysts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-primary to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Trading Journey?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-blue-50">
            Join thousands of traders learning from the best SEBI registered analysts. Start with free content today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/discovery">
              <Button size="lg" className="bg-white !text-primary hover:bg-gray-100">
                Get Started Now
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company */}
            <div>
              <h3 className="text-lg font-bold mb-4">AnalystHub</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Connecting retail traders with SEBI verified analysts for informed trading decisions.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/discovery" className="text-gray-400 hover:text-white text-sm transition">
                    Browse Analysts
                  </Link>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-400 hover:text-white text-sm transition">
                    How it Works
                  </a>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white text-sm transition">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white text-sm transition">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-400 hover:text-white text-sm transition">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2025 AnalystHub. All rights reserved. | SEBI Registered Platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
