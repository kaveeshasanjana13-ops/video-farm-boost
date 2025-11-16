
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  name: string;
  path: string;
}

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap: { [key: string]: string } = {
    'about': 'About Us',
    'case-studies': 'Case Studies',
    'shorts': 'YouTube Shorts',
    'blog': 'Blog',
    'pricing': 'Pricing',
    'career': 'Career',
    'privacy-policy': 'Privacy Policy',
    'terms-of-service': 'Terms of Service',
    'cookie-policy': 'Cookie Policy'
  };

  if (pathnames.length === 0) return null;

  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', path: '/' },
    ...pathnames.map((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
      return {
        name: breadcrumbNameMap[name] || name.charAt(0).toUpperCase() + name.slice(1),
        path: routeTo
      };
    })
  ];

  return (
    <nav className="bg-gray-50 py-3 px-4 sm:px-6 lg:px-8" aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.path} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />}
              {index === 0 && <Home className="h-4 w-4 text-gray-500 mr-2" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {breadcrumb.name}
                </span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {breadcrumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
