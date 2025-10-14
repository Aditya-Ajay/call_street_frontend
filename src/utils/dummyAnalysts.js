/**
 * Dummy Analyst Data Generator
 * Generates realistic analyst profiles for testing and development
 */

const indianNames = [
  'Rajesh Mehta', 'Priya Sharma', 'Amit Kumar', 'Sneha Patel', 'Vikram Singh',
  'Anita Desai', 'Rahul Gupta', 'Kavita Iyer', 'Sanjay Reddy', 'Neha Agarwal',
  'Arjun Malhotra', 'Pooja Verma', 'Karthik Rao', 'Divya Nair', 'Rohan Joshi',
  'Meera Kulkarni', 'Aditya Kapoor', 'Suman Pillai', 'Vishal Shah', 'Ritu Bose',
  'Manoj Tiwari', 'Anjali Menon', 'Deepak Chauhan', 'Lata Bhatt', 'Suresh Naik',
  'Geeta Rao', 'Nikhil Pandey', 'Swati Jain', 'Prakash Shetty', 'Seema Ahuja'
];

export const specializations = [
  'Equity Trading',
  'F&O Trading',
  'Commodity Trading',
  'Technical Analysis',
  'Options Trading',
  'Intraday Trading',
  'Swing Trading',
  'Investment Advisory',
  'Forex Trading',
  'Crypto Trading',
  'Fundamental Analysis',
  'Derivatives Trading'
];

export const languages = [
  'English',
  'Hindi',
  'Tamil',
  'Telugu',
  'Marathi',
  'Gujarati',
  'Bengali',
  'Kannada',
  'Malayalam',
  'Punjabi'
];

const taglines = [
  'Making markets simple for everyone',
  'Your trusted trading partner',
  'Data-driven trading strategies',
  'Consistent returns, proven track record',
  'Empowering traders with knowledge',
  'Risk-managed trading approach',
  'Technical precision, fundamental insight',
  'Building wealth through smart trading',
  'Market expert with 15+ years experience',
  'Helping traders achieve financial freedom'
];

/**
 * Generate a single random analyst profile
 * @param {number} id - Analyst ID
 * @returns {object} Analyst profile object
 */
export const generateAnalyst = (id) => {
  const name = indianNames[id % indianNames.length];
  const rating = (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5 to 5.0
  const reviewCount = Math.floor(Math.random() * 500) + 50; // 50-550
  const subscriberCount = Math.floor(Math.random() * 10000) + 100; // 100-10100
  const totalPosts = Math.floor(Math.random() * 500) + 50; // 50-550
  const accuracy = Math.floor(Math.random() * 20) + 75; // 75-95%

  // Randomly select 2-4 specializations
  const numSpecs = Math.floor(Math.random() * 3) + 2;
  const shuffledSpecs = [...specializations].sort(() => 0.5 - Math.random());
  const analystSpecs = shuffledSpecs.slice(0, numSpecs);

  // Randomly select 1-3 languages
  const numLangs = Math.floor(Math.random() * 3) + 1;
  const shuffledLangs = [...languages].sort(() => 0.5 - Math.random());
  const analystLangs = shuffledLangs.slice(0, numLangs);

  // Generate price (in paisa)
  const priceOptions = [29900, 49900, 99900, 149900, 199900, 299900];
  const minPrice = priceOptions[Math.floor(Math.random() * priceOptions.length)];

  // Free audience available (30% chance)
  const hasFreeAudience = Math.random() > 0.7;

  // SEBI verified (90% chance)
  const sebiVerified = Math.random() > 0.1;

  // Generate initials for avatar
  const initials = name.split(' ').map(n => n[0]).join('');

  return {
    id: id,
    _id: `analyst_${id}`,
    name: name,
    full_name: name,
    display_name: name,
    tagline: taglines[id % taglines.length],
    profile_photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10B981&color=fff&size=128`,
    specializations: analystSpecs,
    expertise_areas: analystSpecs,
    languages: analystLangs,
    rating: parseFloat(rating),
    avg_rating: rating,
    total_reviews: reviewCount,
    review_count: reviewCount,
    subscriber_count: subscriberCount,
    total_subscribers: subscriberCount,
    total_posts: totalPosts,
    accuracy: accuracy,
    min_price: minPrice,
    has_free_audience: hasFreeAudience,
    sebi_verified: sebiVerified,
    sebi_registration: sebiVerified ? `INH${Math.floor(Math.random() * 900000) + 100000}` : null,
    avg_reply_time: ['< 30m', '< 1h', '< 2h', '< 4h'][Math.floor(Math.random() * 4)],
    experience_years: Math.floor(Math.random() * 15) + 5, // 5-20 years
    total_calls_made: totalPosts,
    success_rate: accuracy,
    active_subscribers: Math.floor(subscriberCount * 0.8), // 80% active
    bio: `SEBI registered analyst with ${Math.floor(Math.random() * 15) + 5}+ years of experience in ${analystSpecs[0].toLowerCase()}. Helping traders achieve consistent returns through proven strategies.`,
    created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  };
};

/**
 * Generate multiple analyst profiles
 * @param {number} count - Number of analysts to generate
 * @returns {array} Array of analyst profiles
 */
export const generateAnalysts = (count = 30) => {
  return Array.from({ length: count }, (_, i) => generateAnalyst(i + 1));
};

/**
 * Filter analysts based on criteria
 * @param {array} analysts - Array of analyst objects
 * @param {object} filters - Filter criteria
 * @returns {array} Filtered analysts
 */
export const filterAnalysts = (analysts, filters) => {
  let filtered = [...analysts];

  // Search filter
  if (filters.search && filters.search.trim() !== '') {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(analyst =>
      analyst.name.toLowerCase().includes(searchTerm) ||
      analyst.specializations.some(spec => spec.toLowerCase().includes(searchTerm)) ||
      analyst.tagline.toLowerCase().includes(searchTerm)
    );
  }

  // Specialization filter
  if (filters.specializations && filters.specializations.length > 0) {
    filtered = filtered.filter(analyst =>
      filters.specializations.some(filterSpec =>
        analyst.specializations.some(analystSpec =>
          analystSpec.toLowerCase().includes(filterSpec.toLowerCase())
        )
      )
    );
  }

  // Language filter
  if (filters.languages && filters.languages.length > 0) {
    filtered = filtered.filter(analyst =>
      filters.languages.some(filterLang =>
        analyst.languages.includes(filterLang)
      )
    );
  }

  // Rating filter
  if (filters.minRating) {
    filtered = filtered.filter(analyst => analyst.rating >= filters.minRating);
  }

  // Price range filter
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(analyst => analyst.min_price >= filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(analyst => analyst.min_price <= filters.maxPrice);
  }

  // Free audience filter
  if (filters.hasFreeAudience) {
    filtered = filtered.filter(analyst => analyst.has_free_audience);
  }

  // SEBI verified filter
  if (filters.sebiVerified) {
    filtered = filtered.filter(analyst => analyst.sebi_verified);
  }

  return filtered;
};

/**
 * Sort analysts based on criteria
 * @param {array} analysts - Array of analyst objects
 * @param {string} sortBy - Sort criteria
 * @returns {array} Sorted analysts
 */
export const sortAnalysts = (analysts, sortBy) => {
  const sorted = [...analysts];

  switch (sortBy) {
    case 'rating_desc':
      return sorted.sort((a, b) => b.rating - a.rating);

    case 'rating_asc':
      return sorted.sort((a, b) => a.rating - b.rating);

    case 'subscribers_desc':
      return sorted.sort((a, b) => b.subscriber_count - a.subscriber_count);

    case 'subscribers_asc':
      return sorted.sort((a, b) => a.subscriber_count - b.subscriber_count);

    case 'price_asc':
      return sorted.sort((a, b) => a.min_price - b.min_price);

    case 'price_desc':
      return sorted.sort((a, b) => b.min_price - a.min_price);

    case 'created_desc':
      return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    case 'created_asc':
      return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    case 'popular':
    default:
      // Popular = combination of rating and subscribers
      return sorted.sort((a, b) => {
        const scoreA = a.rating * 1000 + a.subscriber_count;
        const scoreB = b.rating * 1000 + b.subscriber_count;
        return scoreB - scoreA;
      });
  }
};

export default {
  generateAnalyst,
  generateAnalysts,
  filterAnalysts,
  sortAnalysts,
  specializations,
  languages,
};
