/**
 * Admin layout building blocks — shell, sidebar, app bar, page container,
 * role guard, and the navigation definition.
 */
export { AdminShell } from './AdminShell';
export { AdminSidebar } from './AdminSidebar';
export { AdminAppBar } from './AdminAppBar';
export { AdminPageContainer } from './AdminPageContainer';
export type { AdminBreadcrumb } from './AdminPageContainer';
export { AdminGuard } from './AdminGuard';
export {
  ADMIN_DRAWER_WIDTH,
  ADMIN_NAV_SECTIONS,
} from './navigation';
export type { AdminNavItem, AdminNavSection } from './navigation';
