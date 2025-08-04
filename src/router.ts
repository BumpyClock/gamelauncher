import './pages/HomePage';
import './pages/LibraryPage';
import './pages/SettingsPage';

export interface RouteConfig {
  path: string;
  title: string;
  component: string;
}

export const routeConfig: RouteConfig[] = [
  { path: '/', title: 'Home', component: 'home-page' },
  { path: '/library', title: 'My Library', component: 'library-page' },
  { path: '/settings', title: 'Settings', component: 'settings-page' }
];

export const routes = routeConfig.map(route => ({
  path: route.path,
  render: () => {
    document.title = `${route.title} - Game Launcher`;
    return document.createElement(route.component);
  },
}));

export function getCurrentRoute(): RouteConfig | undefined {
  const currentPath = window.location.pathname;
  return routeConfig.find(route => route.path === currentPath);
}
