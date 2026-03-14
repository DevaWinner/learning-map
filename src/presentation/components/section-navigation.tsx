import { useLocation, useNavigate } from 'react-router-dom';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';

const navigationItems = [
  {
    to: '/overview',
    label: 'Overview',
  },
  {
    to: '/sessions',
    label: 'Sessions',
  },
  {
    to: '/reporting',
    label: 'Reporting',
  },
  {
    to: '/projects',
    label: 'Projects',
  },
];

export function SectionNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath =
    navigationItems.find((item) => location.pathname.startsWith(item.to))?.to ??
    '/overview';

  return (
    <div className="mt-4 overflow-x-auto">
      <Tabs value={currentPath} onValueChange={(value) => void navigate(value)}>
        <TabsList className="inline-flex h-10 w-max rounded-2xl border border-border/70 bg-background/75 p-1 shadow-sm backdrop-blur-sm">
          {navigationItems.map((item) => (
            <TabsTrigger
              key={item.to}
              value={item.to}
              className="rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] sm:text-sm"
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}

