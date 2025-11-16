
import { useEffect } from 'react';

interface ServiceData {
  name: string;
  description: string;
  provider: string;
}

interface StructuredDataProps {
  type: 'service' | 'faq' | 'organization' | 'breadcrumb';
  data?: any;
  services?: ServiceData[];
  faqs?: { question: string; answer: string; }[];
}

const StructuredData = ({ type, data, services, faqs }: StructuredDataProps) => {
  useEffect(() => {
    let structuredData: any = {};

    switch (type) {
      case 'service':
        if (services) {
          structuredData = {
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Video Production",
            "provider": {
              "@type": "Organization",
              "name": "ContentFarm",
              "url": "https://contentfarm.club"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Video Production Services",
              "itemListElement": services.map((service, index) => ({
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": service.name,
                  "description": service.description
                }
              }))
            }
          };
        }
        break;

      case 'faq':
        if (faqs) {
          structuredData = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          };
        }
        break;

      case 'organization':
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "ContentFarm",
          "url": "https://contentfarm.club",
          "logo": "https://contentfarm.club/lovable-uploads/42844e19-815c-453d-9d1d-66e5ec0590fb.png",
          "description": "Video production agency specializing in SaaS companies",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Lisbon",
            "addressCountry": "Portugal"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "email": "kvit@contentfarm.club",
            "contactType": "Customer Service"
          }
        };
        break;

      case 'breadcrumb':
        if (data && data.breadcrumbs) {
          structuredData = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": data.breadcrumbs.map((crumb: any, index: number) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": crumb.name,
              "item": crumb.url
            }))
          };
        }
        break;
    }

    if (Object.keys(structuredData).length > 0) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      script.id = `structured-data-${type}`;
      
      // Remove existing script with same ID
      const existing = document.getElementById(`structured-data-${type}`);
      if (existing) {
        existing.remove();
      }
      
      document.head.appendChild(script);

      return () => {
        const scriptElement = document.getElementById(`structured-data-${type}`);
        if (scriptElement) {
          scriptElement.remove();
        }
      };
    }
  }, [type, data, services, faqs]);

  return null;
};

export default StructuredData;
