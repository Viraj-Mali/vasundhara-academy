export default function sitemap() {
  const baseUrl = 'https://vasundharaacademy.edu.in';

  const routes = [
    { url: '/', changeFrequency: 'weekly', priority: 1.0 },
    { url: '/about', changeFrequency: 'monthly', priority: 0.9 },
    { url: '/about/mission-vision', changeFrequency: 'monthly', priority: 0.7 },
    { url: '/about/president-message', changeFrequency: 'monthly', priority: 0.7 },
    { url: '/about/principal-message', changeFrequency: 'monthly', priority: 0.7 },
    { url: '/about/board-of-directors', changeFrequency: 'monthly', priority: 0.6 },
    { url: '/about/general-info', changeFrequency: 'monthly', priority: 0.7 },
    { url: '/about/awards', changeFrequency: 'monthly', priority: 0.6 },
    { url: '/academics', changeFrequency: 'monthly', priority: 0.8 },
    { url: '/academics/curriculum', changeFrequency: 'monthly', priority: 0.7 },
    { url: '/academics/programs', changeFrequency: 'monthly', priority: 0.7 },
    { url: '/academics/staff', changeFrequency: 'monthly', priority: 0.6 },
    { url: '/academics/calendar', changeFrequency: 'monthly', priority: 0.6 },
    { url: '/academics/policies', changeFrequency: 'yearly', priority: 0.5 },
    { url: '/academics/teacher-training', changeFrequency: 'monthly', priority: 0.5 },
    { url: '/admissions', changeFrequency: 'weekly', priority: 0.9 },
    { url: '/admissions/process', changeFrequency: 'monthly', priority: 0.8 },
    { url: '/admissions/fee-structure', changeFrequency: 'monthly', priority: 0.8 },
    { url: '/admissions/apply', changeFrequency: 'weekly', priority: 0.9 },
    { url: '/facilities', changeFrequency: 'monthly', priority: 0.7 },
    { url: '/student-section', changeFrequency: 'monthly', priority: 0.7 },
    { url: '/staff-details', changeFrequency: 'monthly', priority: 0.6 },
    { url: '/comprehensive-info', changeFrequency: 'monthly', priority: 0.6 },
    { url: '/disclosures', changeFrequency: 'monthly', priority: 0.7 },
    { url: '/events', changeFrequency: 'weekly', priority: 0.7 },
    { url: '/alumni', changeFrequency: 'monthly', priority: 0.5 },
    { url: '/why-vasundhara', changeFrequency: 'monthly', priority: 0.7 },
    { url: '/contact', changeFrequency: 'monthly', priority: 0.8 },
    { url: '/enquire', changeFrequency: 'monthly', priority: 0.8 },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
