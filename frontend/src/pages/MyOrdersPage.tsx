import {
  Alert,
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
import { useQuery } from '@tanstack/react-query'
import { fetchMyOrders } from '../api/medicence'
import { PageShell } from '../components/AppLayout'
import { useClientPagination } from '../hooks/useClientPagination'

export default function MyOrdersPage() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['my-orders'],
    queryFn: fetchMyOrders,
  })
  const pagination = useClientPagination(data, 5)

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
          <Typography variant="h3">My orders</Typography>
          <Typography color="text.secondary">
            Track fulfillment status for your Medicence Supplies purchases.
          </Typography>
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
                  <TableCell>Date</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagination.paged.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleString()}</TableCell>
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
                  </TableRow>
                ))}
                {data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>No orders yet. Browse the catalog to get started.</TableCell>
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
