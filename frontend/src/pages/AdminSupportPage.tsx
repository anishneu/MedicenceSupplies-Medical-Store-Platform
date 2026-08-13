import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
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
import { fetchAllTickets, updateTicketStatus } from '../api/medicence'
import { PageShell } from '../components/AppLayout'
import { useClientPagination } from '../hooks/useClientPagination'
import type { SupportTicket } from '../types'

export default function AdminSupportPage() {
  const queryClient = useQueryClient()
  const { data = [], isLoading, error } = useQuery({ queryKey: ['all-tickets'], queryFn: fetchAllTickets })
  const pagination = useClientPagination(data, 5)
  const update = useMutation({
    mutationFn: ({ id, status }: { id: number; status: SupportTicket['status'] }) =>
      updateTicketStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['all-tickets'] }),
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
        <Alert severity="error">Could not load tickets</Alert>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <Typography variant="h3" gutterBottom>
        Support tickets
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Triage customer and supplier requests across the Medicence platform.
      </Typography>

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(11,95,82,0.1)', overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(11,95,82,0.04)' }}>
                <TableCell>Subject</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {pagination.paged.map((t) => (
                <TableRow key={t.id} hover>
                  <TableCell>
                    <Typography fontWeight={600}>{t.subject}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t.message.slice(0, 80)}…
                    </Typography>
                  </TableCell>
                  <TableCell>{t.username}</TableCell>
                  <TableCell>
                    <Chip size="small" label={t.category} />
                  </TableCell>
                  <TableCell>{t.status}</TableCell>
                  <TableCell>{new Date(t.createdAt).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                      <Select
                        size="small"
                        value={t.status}
                        onChange={(e) =>
                          update.mutate({ id: t.id, status: e.target.value as SupportTicket['status'] })
                        }
                      >
                        <MenuItem value="OPEN">OPEN</MenuItem>
                        <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
                        <MenuItem value="RESOLVED">RESOLVED</MenuItem>
                      </Select>
                      <Button size="small" onClick={() => update.mutate({ id: t.id, status: 'RESOLVED' })}>
                        Resolve
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>No tickets yet.</TableCell>
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
    </PageShell>
  )
}
