import {
  Alert,
  Button,
  Chip,
  CircularProgress,
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
import { fetchAllOrders, processOrder } from '../api/medicence'
import { PageShell } from '../components/AppLayout'
import { useClientPagination } from '../hooks/useClientPagination'

export default function AdminOrdersPage() {
  const queryClient = useQueryClient()
  const { data = [], isLoading, error } = useQuery({ queryKey: ['all-orders'], queryFn: fetchAllOrders })
  const pagination = useClientPagination(data, 5)
  const process = useMutation({
    mutationFn: processOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['all-orders'] }),
  })

  if (isLoading) {
    return (
      <PageShell>
        <CircularProgress />
      </PageShell>
    )
  }
  if (error) {
    return (
      <PageShell>
        <Alert severity="error">Could not load orders</Alert>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h3">Orders</Typography>
          <Typography color="text.secondary">Review and process customer orders.</Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid rgba(11,95,82,0.1)',
            overflow: 'hidden',
          }}
        >
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(11,95,82,0.04)' }}>
                  <TableCell>ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {pagination.paged.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.username}</TableCell>
                    <TableCell>
                      {order.items.map((i) => `${i.medicationName} ×${i.quantity}`).join(', ')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={order.status}
                        color={order.status === 'PROCESSED' ? 'success' : 'warning'}
                      />
                    </TableCell>
                    <TableCell align="right">${Number(order.total).toFixed(2)}</TableCell>
                    <TableCell align="right">
                      {order.status === 'PENDING' && (
                        <Button size="small" variant="contained" onClick={() => process.mutate(order.id)}>
                          Process
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>No orders yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={pagination.count}
            page={pagination.page}
            onPageChange={pagination.handleChangePage}
            rowsPerPage={pagination.rowsPerPage}
            onRowsPerPageChange={pagination.handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>
      </Stack>
    </PageShell>
  )
}
