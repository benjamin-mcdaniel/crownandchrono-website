/**
 * Editor personalities for Crown and Chrono
 */

// Define editors with their details and specialties
export const editors = {
  victoria: {
    id: 'victoria',
    name: 'Victoria Montgomery',
    title: 'Luxury Watch Enthusiast',
    specialty: ['rolex', 'cartier', 'luxury', 'investment'],
    bio: 'Victoria is a passionate collector of luxury timepieces with over 15 years in the watch community. Her Instagram account featuring high-end watches has gathered a significant following, where she shares insights on investment pieces and heritage brands.',
    image: '/images/editors/victoria.avif', // Placeholder - create this image later
  },
  marcus: {
    id: 'marcus',
    name: 'Marcus Chen',
    title: 'Technical Watch Reviewer',
    specialty: ['movements', 'technology', 'education', 'terminology', 'complications'],
    bio: 'Marcus turned his fascination with watch mechanics into a popular YouTube channel with over 200K subscribers. He specializes in explaining complex watch mechanisms and has interviewed numerous master watchmakers throughout his career as a content creator.',
    image: '/images/editors/marcus.avif', // Placeholder - create this image later
  },
  james: {
    id: 'james',
    name: 'James "Jimmy" Ellison',
    title: 'Everyday Watch Influencer',
    specialty: ['citizen', 'eco-drive', 'practical', 'affordable'],
    bio: 'Jimmy built his reputation reviewing practical, everyday timepieces on his blog. With a no-nonsense approach to watch reviewing, he focuses on value, reliability, and functionality that resonates with his community of practical watch enthusiasts.',
    image: '/images/editors/james.avif', // Placeholder - create this image later
  },
  alexis: {
    id: 'alexis',
    name: 'Alexis "Lexi" Rivera',
    title: 'Adventure Watch Content Creator',
    specialty: ['g-shock', 'sports', 'outdoor', 'durable'],
    bio: 'Lexi is an adventure sports enthusiast who tests watches in real-world extreme conditions. Her social media showcases watches that can withstand her active lifestyle, from rock climbing to ultra-marathons, gaining her a loyal following of outdoor enthusiasts.',
    image: '/images/editors/alexis.avif', // Placeholder - create this image later
  }
};

/**
 * Find the most appropriate editor for a given article based on its tags and content
 * @param {Object} frontmatter - Article frontmatter containing title, tags, etc.
 * @return {Object} - The editor object
 */
export function getEditorForArticle(frontmatter) {
  const title = frontmatter.title.toLowerCase();
  const tags = frontmatter.tags ? frontmatter.tags.map(tag => tag.toLowerCase()) : [];
  
  // Check title for brand keywords
  if (title.includes('rolex') || title.includes('cartier') || title.includes('luxury') || title.includes('investment')) {
    return editors.victoria;
  }
  
  if (title.includes('citizen') || title.includes('eco-drive')) {
    return editors.james;
  }
  
  if (title.includes('g-shock') || title.includes('gshock')) {
    return editors.alexis;
  }
  
  if (title.includes('movement') || title.includes('technology') || title.includes('terminology') || title.includes('guide') || title.includes('education')) {
    return editors.marcus;
  }
  
  // Check tags
  if (tags.includes('luxury') || tags.includes('investment')) {
    return editors.victoria;
  }
  
  if (tags.includes('education') || tags.includes('technology')) {
    return editors.marcus;
  }
  
  if (tags.includes('sports') || tags.includes('outdoor')) {
    return editors.alexis;
  }
  
  // Default assignment based on broader categories in the title
  if (title.includes('diving') || title.includes('sport') || title.includes('adventure') || title.includes('outdoor')) {
    return editors.alexis;
  }
  
  if (title.includes('understanding') || title.includes('guide') || title.includes('explained') || title.includes('terminology')) {
    return editors.marcus;
  }
  
  // Default to Victoria for anything with "classic" or formal watches
  if (title.includes('classic') || title.includes('heritage') || title.includes('history')) {
    return editors.victoria;
  }
  
  // Default to Jimmy for everything else
  return editors.james;
}
