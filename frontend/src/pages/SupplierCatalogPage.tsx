import {
  Alert,
  Avatar,
  Button,
  Chip,
  FormControl,
  InputLabel,
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
  TextField,
  Typography,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { fetchLowStock, fetchMedications, updateStock } from '../api/medicence'
import { PageShell } from '../components/AppLayout'
import { useClientPagination } from '../hooks/useClientPagination'
import { PLACEHOLDER_IMAGE } from '../types'

export default function SupplierCatalogPage() {
  const queryClient = useQueryClient()
  const meds = useQuery({ queryKey: ['medications'], queryFn: fetchMedications })
  const low = useQuery({ queryKey: ['supplier-low-stock'], queryFn: () => fetchLowStock(10) })
  const [stockValues, setStockValues] = useState<Record<number, number>>({})
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('stockAsc')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const filtered = useMemo(() => {
    const data = meds.data ?? []
    let list = data.filter(
      (m) =>
        !q ||
        m.name.toLowerCase().includes(q.toLowerCase()) ||
        m.category.toLowerCase().includes(q.toLowerCase()),
    )
    list = [...list].sort((a, b) => {
      if (sort === 'priceAsc') return Number(a.price) - Number(b.price)
      if (sort === 'priceDesc') return Number(b.price) - Number(a.price)
      if (sort === 'stockAsc') return a.stock - b.stock
      if (sort === 'stockDesc') return b.stock - a.stock
      if (sort === 'mostOrdered') return (b.timesOrdered || 0) - (a.timesOrdered || 0)
      if (sort === 'featured') return Number(b.featured) - Number(a.featured)
      return a.name.localeCompare(b.name)
    })
    return list
  }, [meds.data, q, sort])

  const pagination = useClientPagination(filtered, 5)
  useEffect(() => {
    pagination.resetPage()
  }, [q, sort])

  const lowPagination = useClientPagination(low.data ?? [], 5)

  const saveStock = useMutation({
    mutationFn: ({ medicationId, stock }: { medicationId: number; stock: number }) =>
      updateStock(medicationId, stock),
    onSuccess: async (updated) => {
      setStockValues((prev) => {
        const next = { ...prev }
        delete next[updated.id]
        return next
      })
      setFeedback({ type: 'success', text: `Updated ${updated.name} to ${updated.stock} units.` })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['medications'] }),
        queryClient.invalidateQueries({ queryKey: ['supplier-low-stock'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] }),
      ])
    },
    onError: () => {
      setFeedback({ type: 'error', text: 'Could not update stock. Try again.' })
    },
  })

  if (meds.isLoading || low.isLoading) {
    return (
      <PageShell>
        <Typography>Loading…</Typography>
      </PageShell>
    )
  }
  if (meds.error) {
    return (
      <PageShell>
        <Alert severity="error">Could not load inventory</Alert>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h3">Inventory</Typography>
          <Typography color="text.secondary">
            Update stock levels for Medicence Supplies. Changes appear immediately in the public catalog.
          </Typography>
        </Stack>

        {feedback && (
          <Alert severity={feedback.type} onClose={() => setFeedback(null)}>
            {feedback.text}
          </Alert>
        )}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label="Search inventory"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="supplier-inv-sort">Sort by</InputLabel>
            <Select
              labelId="supplier-inv-sort"
              label="Sort by"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <MenuItem value="stockAsc">Stock: low to high</MenuItem>
              <MenuItem value="stockDesc">Stock: high to low</MenuItem>
              <MenuItem value="nameAsc">Name A–Z</MenuItem>
              <MenuItem value="featured">Featured first</MenuItem>
              <MenuItem value="mostOrdered">Most ordered</MenuItem>
              <MenuItem value="priceAsc">Price: low to high</MenuItem>
              <MenuItem value="priceDesc">Price: high to low</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Paper
          elevation={0}
          sx={{ borderRadius: 3, border: '1px solid rgba(11,95,82,0.1)', overflow: 'hidden' }}
        >
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(11,95,82,0.04)' }}>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Current stock</TableCell>
                  <TableCell align="center">Set stock</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagination.paged.map((med) => (
                  <TableRow key={med.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          variant="rounded"
                          src={med.imageUrl || PLACEHOLDER_IMAGE}
                          alt={med.name}
                        />
                        <Stack>
                          <Typography fontWeight={600}>{med.name}</Typography>
                          {med.featured && (
                            <Chip
                              size="small"
                              color="primary"
                              label="Featured"
                              sx={{ alignSelf: 'start' }}
                            />
                          )}
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>{med.category}</TableCell>
                    <TableCell align="right">${Number(med.price).toFixed(2)}</TableCell>
                    <TableCell align="right">{med.stock}</TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        size="small"
                        value={stockValues[med.id] ?? med.stock}
                        onChange={(e) =>
                          setStockValues({ ...stockValues, [med.id]: Number(e.target.value) })
                        }
                        inputProps={{ min: 0, style: { width: 72 } }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="contained"
                        disabled={saveStock.isPending}
                        onClick={() =>
                          saveStock.mutate({
                            medicationId: med.id,
                            stock: stockValues[med.id] ?? med.stock,
                          })
                        }
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {pagination.count === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>No products match your search.</TableCell>
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

        <Stack spacing={2}>
          <Typography variant="h4">Low stock (&lt; 10)</Typography>
          <Paper
            elevation={0}
            sx={{ borderRadius: 3, border: '1px solid rgba(11,95,82,0.1)', overflow: 'hidden' }}
          >
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(11,95,82,0.04)' }}>
                    <TableCell>Product</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Stock</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowPagination.paged.map((med) => (
                    <TableRow key={med.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar
                            variant="rounded"
                            src={med.imageUrl || PLACEHOLDER_IMAGE}
                            alt={med.name}
                          />
                          <Typography fontWeight={600}>{med.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{med.category}</TableCell>
                      <TableCell align="right">{med.stock}</TableCell>
                    </TableRow>
                  ))}
                  {lowPagination.count === 0 && (
                    <TableRow>
                      <TableCell colSpan={3}>No low-stock items.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {lowPagination.count > 0 && (
              <TablePagination
                component="div"
                count={lowPagination.count}
                page={lowPagination.page}
                onPageChange={lowPagination.handleChangePage}
                rowsPerPage={lowPagination.rowsPerPage}
                onRowsPerPageChange={lowPagination.handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              />
            )}
          </Paper>
        </Stack>
      </Stack>
    </PageShell>
  )
}
