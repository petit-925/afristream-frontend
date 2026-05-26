export function formatCategory(value?: string) {
  const v = (value || '').toLowerCase();
  const map: Record<string, string> = {
    'picture-frames': 'Picture Frames',
    'templates': 'Templates',
    'web-design': 'Web Design',
    'web-designs': 'Web Designs',
    'apps': 'Apps',
    'software': 'Software',
    'logos': 'Logos',
    'branding': 'Branding',
    'electronics': 'Electronics',
    'accessories': 'Accessories',
    'phones': 'Phones',
    'art-paint': 'Art & Paints',
    'videos-pictures': 'Videos & Pictures',
  };
  if (map[v]) return map[v];
  return v.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'General';
}


