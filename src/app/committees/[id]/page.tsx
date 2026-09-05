'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Tab,
  Tabs,
} from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { useAuth } from '@/features/auth';
import {
  CommitteeDetailHeader,
  MembersList,
  CyclesList,
  ContributionSummaryCard,
  useGetReportSummaryQuery,
  useGetMembersQuery,
  useGetCyclesQuery,
  useGetContributionSummaryQuery,
} from '@/features/committees';
import { UserContributionsPanel } from '@/features/contributions';
import { UserPaymentsPanel } from '@/features/payments';
import { UserLotteryPanel } from '@/features/lottery';
import { UserPayoutsPanel } from '@/features/payouts';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  if (value !== index) return null;
  return <Box sx={{ mt: 3 }}>{children}</Box>;
}

/**
 * Committee detail page with tabbed sections:
 * - Overview: report summary
 * - Contributions: current contribution with pay action and history by cycle
 * - Payments: the user's payment history and details
 * - Members: member list
 * - Cycles: cycle list with progress
 * - Lottery: current draw status and completed lottery results
 * - Payouts: the user's payout record and committee payout history
 */
export default function CommitteeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const committeeId = params.id as string;

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch committee data
  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
    error: summaryErrorData,
  } = useGetReportSummaryQuery({ committeeId });

  const {
    data: membersData,
    isLoading: membersLoading,
  } = useGetMembersQuery({ committeeId, limit: 50 });

  const {
    data: cyclesData,
    isLoading: cyclesLoading,
  } = useGetCyclesQuery({ committeeId, limit: 50 });

  // Find the active cycle for contribution summary
  const activeCycle = cyclesData?.data?.find((c) => c.status === 'ACTIVE');

  // Fetch contribution summary for active cycle
  const {
    data: contributionSummary,
    isLoading: contributionLoading,
  } = useGetContributionSummaryQuery(
    { committeeId, cycleId: activeCycle?.id ?? '' },
    { skip: !activeCycle?.id }
  );

  // Loading state
  if (authLoading || summaryLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (summaryError) {
    const errorMessage = (summaryErrorData as { data?: { message?: string } })?.data?.message
      ?? 'Failed to load committee details.';
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" icon={<ErrorOutlineOutlinedIcon />}>
          {errorMessage}
        </Alert>
        <Button startIcon={<ArrowBackOutlinedIcon />} onClick={() => router.push('/committees')} sx={{ mt: 2 }}>
          Back to Committees
        </Button>
      </Container>
    );
  }

  if (!summary) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Committee not found.</Alert>
        <Button startIcon={<ArrowBackOutlinedIcon />} onClick={() => router.push('/committees')} sx={{ mt: 2 }}>
          Back to Committees
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back button */}
      <Button
        startIcon={<ArrowBackOutlinedIcon />}
        onClick={() => router.push('/committees')}
        sx={{ mb: 2 }}
      >
        Back to Committees
      </Button>

      {/* Committee Header */}
      <CommitteeDetailHeader summary={summary} />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" />
          <Tab label="Contributions" />
          <Tab label="Payments" />
          <Tab label="Members" />
          <Tab label="Cycles" />
          <Tab label="Lottery" />
          <Tab label="Payouts" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={activeTab} index={0}>
        {/* Overview: Active cycle contribution summary */}
        {activeCycle ? (
          <ContributionSummaryCard
            summary={contributionSummary}
            loading={contributionLoading}
          />
        ) : (
          <Alert severity="info" sx={{ mt: 2 }}>
            No active cycle. Contributions will appear when a cycle is started.
          </Alert>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <UserContributionsPanel committeeId={committeeId} />
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <UserPaymentsPanel committeeId={committeeId} />
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <MembersList members={membersData?.data ?? []} loading={membersLoading} />
      </TabPanel>

      <TabPanel value={activeTab} index={4}>
        <CyclesList cycles={cyclesData?.data ?? []} loading={cyclesLoading} />
      </TabPanel>

      <TabPanel value={activeTab} index={5}>
        <UserLotteryPanel committeeId={committeeId} />
      </TabPanel>

      <TabPanel value={activeTab} index={6}>
        <UserPayoutsPanel committeeId={committeeId} />
      </TabPanel>
    </Container>
  );
}
