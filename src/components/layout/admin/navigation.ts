import type SvgIcon from '@mui/material/SvgIcon';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import CasinoOutlinedIcon from '@mui/icons-material/CasinoOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

/** Width of the admin sidebar (matches MUI drawerWidth convention: 33 * 8px). */
export const ADMIN_DRAWER_WIDTH = 264;

export interface AdminNavItem {
  label: string;
  path: string;
  icon: typeof SvgIcon;
  disabled?: boolean;
}

export interface AdminNavSection {
  /** Optional section caption shown above the group in the sidebar. */
  caption?: string;
  items: AdminNavItem[];
}

/**
 * Admin navigation structure, grouped by admin workflow area.
 * Pending sections remain disabled until their pages are implemented.
 */
export const ADMIN_NAV_SECTIONS: AdminNavSection[] = [
  {
    items: [
      { label: 'Dashboard', path: '/admin', icon: DashboardOutlinedIcon },
    ],
  },
  {
    caption: 'Committee Operations',
    items: [
      { label: 'Committees', path: '/admin/committees', icon: GroupsOutlinedIcon },
      { label: 'Members', path: '/admin/members', icon: HowToRegOutlinedIcon },
      { label: 'Contributions & Payments', path: '/admin/contributions', icon: AccountBalanceWalletOutlinedIcon },
      { label: 'Cycles', path: '/admin/cycles', icon: AutorenewOutlinedIcon },
      { label: 'Lottery', path: '/admin/lottery', icon: CasinoOutlinedIcon },
      { label: 'Payouts', path: '/admin/payouts', icon: PaymentsOutlinedIcon },
    ],
  },
  {
    caption: 'System',
    items: [
      { label: 'Notifications', path: '/admin/notifications', icon: NotificationsOutlinedIcon, disabled: true },
      { label: 'Audit Logs', path: '/admin/audit-logs', icon: HistoryEduOutlinedIcon },
      { label: 'Reports', path: '/admin/reports', icon: AssessmentOutlinedIcon, disabled: true },
      { label: 'Settings', path: '/admin/settings', icon: SettingsOutlinedIcon, disabled: true },
    ],
  },
];
