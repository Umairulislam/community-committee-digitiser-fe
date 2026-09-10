'use client';

import { useRef, useState } from 'react';
import { Alert, Box, Button } from '@mui/material';
import { useLazyGetReportCsvQuery } from '../api/adminReportsApi';
import { REPORTS, type ReportArgs } from '../utils/reportRequest';

export function ReportExport({ args }: { args: ReportArgs }) {
  const [download, result] = useLazyGetReportCsvQuery();
  const [message, setMessage] = useState<'success' | 'error' | null>(null);
  const busy = useRef(false);
  const exportCsv = async () => {
    if (busy.current) return;
    busy.current = true;
    setMessage(null);
    const request = download(args, false);
    try {
      const csv = await request.unwrap();
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = REPORTS[args.report].filename;
      document.body.appendChild(link);
      try { link.click(); } finally {
        link.remove();
        // Let the browser start the download before releasing its object URL.
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
      setMessage('success');
    } catch {
      setMessage('error');
    } finally {
      request.unsubscribe();
      busy.current = false;
    }
  };
  return (
    <Box sx={{ my: 2 }}>
      <Button variant="outlined" disabled={result.isFetching} onClick={exportCsv}>{result.isFetching ? 'Downloading…' : args.report === 'outstanding' ? 'Download this page as CSV' : 'Download CSV'}</Button>
      {message && <Alert sx={{ mt: 1 }} severity={message} onClose={() => setMessage(null)}>{message === 'success' ? 'CSV download started.' : 'Unable to download the report. Please try again.'}</Alert>}
    </Box>
  );
}
