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
    <div className="sticky top-4 z-30 mt-4 w-full pb-3">
      <Tabs
        value={currentPath}
        onValueChange={(value) => void navigate(value)}
        className="block w-full"
      >
        <TabsList className="grid h-12 w-full grid-cols-4 rounded-xl border border-border/70 bg-muted p-1 sm:h-12 sm:rounded-2xl sm:p-1">
          {navigationItems.map((item) => (
            <TabsTrigger
              key={item.to}
              value={item.to}
              className="min-w-0 rounded-lg px-2 py-2 text-sm font-semibold tracking-normal sm:rounded-xl sm:px-3 sm:py-2 sm:text-base sm:tracking-normal"
            >
              <span className="truncate">{item.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
