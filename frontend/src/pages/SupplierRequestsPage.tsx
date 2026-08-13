import {
  Alert,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { approveStockRequest, fetchPendingStockRequests, rejectStockRequest } from '../api/medicence'
import { PageShell } from '../components/AppLayout'
import { useClientPagination } from '../hooks/useClientPagination'

async function invalidateStockCaches(queryClient: ReturnType<typeof useQueryClient>) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ['pending-stock-requests'] }),
    queryClient.invalidateQueries({ queryKey: ['medications'] }),
    queryClient.invalidateQueries({ queryKey: ['supplier-low-stock'] }),
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] }),
  ])
}

export default function SupplierRequestsPage() {
  const queryClient = useQueryClient()
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['pending-stock-requests'],
    queryFn: fetchPendingStockRequests,
  })
  const pagination = useClientPagination(data, 5)

  const approve = useMutation({
    mutationFn: approveStockRequest,
    onSuccess: () => invalidateStockCaches(queryClient),
  })
  const reject = useMutation({
    mutationFn: rejectStockRequest,
    onSuccess: () => invalidateStockCaches(queryClient),
  })

  if (isLoading) {
    return (
      <PageShell>
        <Typography>Loading…</Typography>
      </PageShell>
    )
  }
  if (error) {
    return (
      <PageShell>
        <Alert severity="error">Could not load stock requests</Alert>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <Stack spacing={3}>
        <Typography variant="h3">Pending stock requests</Typography>
        <Paper
          elevation={0}
          sx={{ borderRadius: 3, border: '1px solid rgba(11,95,82,0.1)', overflow: 'hidden' }}
        >
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(11,95,82,0.04)' }}>
                  <TableCell>Medication</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell>Requested by</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagination.paged.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>{r.medicationName}</TableCell>
                    <TableCell align="right">{r.requestedQuantity}</TableCell>
                    <TableCell>{r.requestedBy}</TableCell>
                    <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        color="success"
                        disabled={approve.isPending || reject.isPending}
                        onClick={() => approve.mutate(r.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        disabled={approve.isPending || reject.isPending}
                        onClick={() => reject.mutate(r.id)}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {pagination.count === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>No pending requests.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {pagination.count > 0 && (
            <TablePagination
              component="div"
              count={pagination.count}
              page={pagination.page}
              onPageChange={pagination.handleChangePage}
              rowsPerPage={pagination.rowsPerPage}
              onRowsPerPageChange={pagination.handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          )}
        </Paper>
      </Stack>
    </PageShell>
  )
}
