import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {
  createStockRequest,
  fetchAdminStockRequests,
  fetchLowStock,
} from '../api/medicence'
import { PageShell } from '../components/AppLayout'
import { PLACEHOLDER_IMAGE } from '../types'

export default function AdminStockPage() {
  const queryClient = useQueryClient()
  const [qty, setQty] = useState<Record<number, number>>({})
  const lowStock = useQuery({ queryKey: ['low-stock'], queryFn: () => fetchLowStock(20) })
  const requests = useQuery({ queryKey: ['admin-stock-requests'], queryFn: fetchAdminStockRequests })

  const create = useMutation({
    mutationFn: ({ medicationId, requestedQuantity }: { medicationId: number; requestedQuantity: number }) =>
      createStockRequest(medicationId, requestedQuantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stock-requests'] })
      queryClient.invalidateQueries({ queryKey: ['low-stock'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })

  if (lowStock.isLoading || requests.isLoading) {
    return (
      <PageShell>
        <Box sx={{ display: 'grid', placeItems: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </PageShell>
    )
  }

  if (lowStock.error || requests.error) {
    return (
      <PageShell>
        <Alert severity="error">Could not load stock data</Alert>
      </PageShell>
    )
  }

  const lowItems = lowStock.data ?? []
  const requestItems = requests.data ?? []

  return (
    <PageShell>
      <Stack spacing={4} maxWidth={960} mx="auto">
        <Box>
          <Typography variant="h3" gutterBottom>
            Stock management
          </Typography>
          <Typography color="text.secondary" maxWidth={560}>
            Review items below the reorder threshold and send replenishment requests to suppliers.
          </Typography>
        </Box>

        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h5">Low stock</Typography>
            <Chip
              size="small"
              color={lowItems.length ? 'warning' : 'success'}
              label={`${lowItems.length} item${lowItems.length === 1 ? '' : 's'}`}
            />
          </Stack>

          {lowItems.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                border: '1px solid rgba(11,95,82,0.1)',
                textAlign: 'center',
              }}
            >
              <Inventory2OutlinedIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography fontWeight={600}>Inventory looks healthy</Typography>
              <Typography color="text.secondary" variant="body2">
                No medications are currently under the low-stock threshold.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {lowItems.map((med) => (
                <Grid item xs={12} md={6} key={med.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      border: '1px solid rgba(11,95,82,0.12)',
                      height: '100%',
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Avatar
                        variant="rounded"
                        src={med.imageUrl || PLACEHOLDER_IMAGE}
                        alt={med.name}
                        sx={{ width: 72, height: 72, bgcolor: '#d7ebe4' }}
                      />
                      <Box flex={1} minWidth={0}>
                        <Typography fontWeight={700} noWrap>
                          {med.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={1.5}>
                          {med.category}
                        </Typography>
                        <Chip
                          size="small"
                          color="warning"
                          label={`${med.stock} left`}
                          sx={{ mb: 2 }}
                        />
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <TextField
                            type="number"
                            size="small"
                            label="Qty"
                            value={qty[med.id] ?? 50}
                            onChange={(e) => setQty({ ...qty, [med.id]: Number(e.target.value) })}
                            inputProps={{ min: 1 }}
                            sx={{ width: 96 }}
                          />
                          <Button
                            variant="contained"
                            onClick={() =>
                              create.mutate({
                                medicationId: med.id,
                                requestedQuantity: qty[med.id] ?? 50,
                              })
                            }
                            disabled={create.isPending}
                          >
                            Request stock
                          </Button>
                        </Stack>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Box>
          <Typography variant="h5" mb={2}>
            Stock requests
          </Typography>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid rgba(11,95,82,0.12)',
              overflow: 'hidden',
            }}
          >
            <TableContainer>
              <Table size="small" sx={{ tableLayout: 'fixed' }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(11,95,82,0.04)' }}>
                    <TableCell sx={{ width: '42%' }}>Medication</TableCell>
                    <TableCell sx={{ width: '14%' }} align="right">
                      Qty
                    </TableCell>
                    <TableCell sx={{ width: '18%' }}>Status</TableCell>
                    <TableCell sx={{ width: '26%' }}>Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requestItems.map((r) => (
                    <TableRow key={r.id} hover>
                      <TableCell>
                        <Typography fontWeight={600} noWrap>
                          {r.medicationName}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{r.requestedQuantity}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={r.status}
                          color={
                            r.status === 'APPROVED'
                              ? 'success'
                              : r.status === 'REJECTED'
                                ? 'default'
                                : 'warning'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(r.createdAt).toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  {requestItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Box sx={{ py: 3, textAlign: 'center' }}>
                          <Typography color="text.secondary">
                            No stock requests yet. Create one from a low-stock item above.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Stack>
    </PageShell>
  )
}
