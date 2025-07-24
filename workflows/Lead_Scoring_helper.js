// Lead_Scoring_Helper.js

/**
 * Calculates a lead score based on enrichment and engagement data.
 * 
 * @param {Object} enrichmentData - Data obtained from Clearbit/Apollo enrichment.
 * @param {Object} engagementData - Data about lead's interactions (page visits, etc.).
 *                             
 * @returns {number} The calculated lead score (0-100).
 */
function calculateScore(enrichmentData, engagementData) {
  // --- Demographic scoring (50% weight) ---
  let demographicScore = 0;
  const companySize = enrichmentData.company_size; // Expecting a number

  if (companySize > 500) {
    demographicScore += 20;
  } else if (companySize > 100) {
    demographicScore += 15;
  } else if (companySize > 0) { // Assuming size 0 or undefined gets base points or 0
     demographicScore += 10;
  }
  // else { demographicScore += 0; } // Implicit

  // Check for specific tech stack keywords (adjust 'your-product' as needed)
  const techStack = enrichmentData.tech_stack;
  if (Array.isArray(techStack) && techStack.includes('your-product')) {
    demographicScore += 25;
  }

  // Check for specific industries (adjust list as needed)
  const industry = enrichmentData.industry; // Assuming this field exists
  if (['enterprise', 'tech'].includes(industry)) {
    demographicScore += 15;
  }

  // Apply weight
  demographicScore = demographicScore * 0.5;


  // --- Behavioral scoring (50% weight) ---
  let behavioralScore = 0;
  // Placeholder engagement data structure (adjust based on your actual data source)
  const pageVisits = engagementData.page_visits || 0;
  const timeOnPage = engagementData.time_on_page || 0; // in seconds?
  const clickedPricing = engagementData.clicked_pricing || false;
  const clickedDemo = engagementData.clicked_demo || false; // Added for hot trigger

  if (pageVisits > 5) {
    behavioralScore += 20;
  } else if (pageVisits > 2) {
    behavioralScore += 10;
  } else if (pageVisits > 0) {
    behavioralScore += 5;
  }
  // else { behavioralScore += 0; } // Implicit

  if (timeOnPage > 120) { // Assuming 120 seconds = 2 minutes
    behavioralScore += 15;
  }

  if (clickedPricing) {
    behavioralScore += 25;
  }

  // Apply weight
  behavioralScore = behavioralScore * 0.5;


  // --- Hot trigger modifiers ---
  let hotTriggers = 0;

  const utmSource = enrichmentData.utm_source; // Assuming this field exists
  if (utmSource === 'paid') {
    hotTriggers += 10;
  }

  if (clickedDemo) {
    hotTriggers += 10;
  }

  if (companySize > 1000) {
    hotTriggers += 10;
  }

  // Ensure score doesn't exceed 100
  const totalScore = demographicScore + behavioralScore + hotTriggers;
  return Math.min(100, Math.round(totalScore)); // Return rounded score
}

// Example Usage (for testing/documentation):
/*
const exampleEnrichmentData = {
  company_size: 750,
  tech_stack: ['aws', 'your-product', 'react'],
  industry: 'tech',
  utm_source: 'paid'
};

const exampleEngagementData = {
  page_visits: 4,
  time_on_page: 150,
  clicked_pricing: true,
  clicked_demo: false
};

const score = calculateScore(exampleEnrichmentData, exampleEngagementData);
console.log(`Calculated Lead Score: ${score}`); // Expected based on logic
*/

// Make the function available if used in a module system (optional for n8n context)
// module.exports = { calculateScore };
