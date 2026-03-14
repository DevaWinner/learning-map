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
    <div className="mx-auto mt-4 w-full max-w-md sm:max-w-none">
      <Tabs value={currentPath} onValueChange={(value) => void navigate(value)}>
        <TabsList className="grid h-12 w-full grid-cols-4 rounded-xl border border-border/70 bg-muted/65 p-1 shadow-sm backdrop-blur-sm sm:inline-flex sm:h-12 sm:w-auto sm:rounded-2xl sm:p-1">
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
