import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import type { Notification, NotificationType } from '@/types';

/** Shared styling for notification type icons. */
const NOTIFICATION_ICON_SX = { fontSize: 22, color: 'text.secondary' } as const;

/** Icon visualising a notification type. */
export function NotificationTypeIcon({ type }: { type: NotificationType }) {
  switch (type) {
    case 'PAYMENT_VERIFIED':
    case 'PAYMENT_REJECTED':
    case 'CONTRIBUTION_REMINDER':
      return <PaymentOutlinedIcon sx={NOTIFICATION_ICON_SX} />;
    case 'LOTTERY_COMPLETED':
      return <EmojiEventsOutlinedIcon sx={NOTIFICATION_ICON_SX} />;
    case 'PAYOUT_COMPLETED':
      return <AccountBalanceWalletOutlinedIcon sx={NOTIFICATION_ICON_SX} />;
    case 'CONTRIBUTION_OVERDUE':
      return <WarningAmberOutlinedIcon sx={NOTIFICATION_ICON_SX} />;
    case 'COMMITTEE_INVITATION':
      return <MailOutlinedIcon sx={NOTIFICATION_ICON_SX} />;
    case 'COMMITTEE_STATUS_CHANGED':
    case 'CYCLE_STARTED':
    case 'CYCLE_COMPLETED':
      return <InfoOutlinedIcon sx={NOTIFICATION_ICON_SX} />;
    default:
      return <NotificationsNoneOutlinedIcon sx={NOTIFICATION_ICON_SX} />;
  }
}

/** Maps notification type to a chip color. */
export function notificationChipColor(
  type: NotificationType,
): 'default' | 'success' | 'warning' | 'error' | 'info' {
  switch (type) {
    case 'PAYMENT_VERIFIED':
    case 'PAYOUT_COMPLETED':
    case 'LOTTERY_COMPLETED':
      return 'success';
    case 'PAYMENT_REJECTED':
    case 'CONTRIBUTION_OVERDUE':
      return 'error';
    case 'CONTRIBUTION_REMINDER':
      return 'warning';
    default:
      return 'info';
  }
}

/**
 * Committee detail tab key a notification type relates to, used for
 * navigation. Returns null for types without a dedicated tab (they fall
 * back to the committee overview).
 */
export function notificationTabKey(type: NotificationType): string | null {
  switch (type) {
    case 'CONTRIBUTION_REMINDER':
    case 'CONTRIBUTION_OVERDUE':
      return 'contributions';
    case 'PAYMENT_VERIFIED':
    case 'PAYMENT_REJECTED':
      return 'payments';
    case 'CYCLE_STARTED':
    case 'CYCLE_COMPLETED':
      return 'cycles';
    case 'LOTTERY_COMPLETED':
      return 'lottery';
    case 'PAYOUT_COMPLETED':
      return 'payouts';
    default:
      return null;
  }
}

/**
 * Resolves the in-app route a notification points at, or null when it has
 * no related committee. Only documented fields (type, committeeId) are used.
 */
export function notificationHref(
  notification: Pick<Notification, 'type' | 'committeeId'>,
): string | null {
  if (!notification.committeeId) return null;
  const tab = notificationTabKey(notification.type);
  return tab
    ? `/committees/${notification.committeeId}?tab=${tab}`
    : `/committees/${notification.committeeId}`;
}
