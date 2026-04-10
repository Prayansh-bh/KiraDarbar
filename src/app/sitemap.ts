import { MetadataRoute } from 'next'

// Note: In a true prod app, we would query the Supabase CMS for the exact state list.
// However, since we defined standard Indian states in the Rights page earlier, we can map them dynamically here.
const STATES = [
  "maharashtra", "karnataka", "delhi", "haryana", "uttar-pradesh", "telangana",
  "tamil-nadu", "west-bengal", "gujarat", "rajasthan" // Subset for demonstration
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kiradarbar.in'

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/rights`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }
  ];

  const stateRoutes = STATES.map((state) => ({
    url: `${baseUrl}/rights/${state}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // We theoretically would also map blog routes here by parsing the /content dir natively
  // But hardcoded static + parametric mapped logic handles 90% of structural SEO 
  
  return [...staticRoutes, ...stateRoutes]
}
