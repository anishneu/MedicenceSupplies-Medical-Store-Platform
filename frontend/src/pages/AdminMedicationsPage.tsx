import {
  Alert,
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
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
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  createMedication,
  deleteMedication,
  fetchMedications,
  updateMedication,
} from '../api/medicence'
import { PageShell } from '../components/AppLayout'
import { useClientPagination } from '../hooks/useClientPagination'
import type { Medication } from '../types'
import { PLACEHOLDER_IMAGE } from '../types'

const emptyForm = {
  name: '',
  category: '',
  price: 0,
  stock: 0,
  description: '',
  imageUrl: '',
  featured: false,
}

export default function AdminMedicationsPage() {
  const queryClient = useQueryClient()
  const { data = [], isLoading, error } = useQuery({ queryKey: ['medications'], queryFn: fetchMedications })
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Medication | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('nameAsc')

  const filtered = useMemo(() => {
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
      if (sort === 'mostOrdered') return (b.timesOrdered || 0) - (a.timesOrdered || 0)
      if (sort === 'featured') return Number(b.featured) - Number(a.featured)
      return a.name.localeCompare(b.name)
    })
    return list
  }, [data, q, sort])

  const pagination = useClientPagination(filtered, 5)
  useEffect(() => {
    pagination.resetPage()
  }, [q, sort])

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        category: form.category,
        price: form.price,
        stock: form.stock,
        description: form.description,
        imageUrl: form.imageUrl,
        featured: form.featured,
      }
      if (editing) return updateMedication(editing.id, payload)
      return createMedication(payload)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['medications'] })
      setOpen(false)
      setEditing(null)
      setForm(emptyForm)
    },
  })

  const remove = useMutation({
    mutationFn: deleteMedication,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['medications'] }),
  })

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  function openEdit(med: Medication) {
    setEditing(med)
    setForm({
      name: med.name,
      category: med.category,
      price: Number(med.price),
      stock: med.stock,
      description: med.description || '',
      imageUrl: med.imageUrl || '',
      featured: !!med.featured,
    })
    setOpen(true)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    save.mutate()
  }

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
        <Alert severity="error">Failed to load medications</Alert>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
          <Typography variant="h3">Inventory</Typography>
          <Button variant="contained" onClick={openCreate}>
            Add product
          </Button>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label="Search inventory"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="inv-sort">Sort by</InputLabel>
            <Select labelId="inv-sort" label="Sort by" value={sort} onChange={(e) => setSort(e.target.value)}>
              <MenuItem value="nameAsc">Name A–Z</MenuItem>
              <MenuItem value="featured">Featured first</MenuItem>
              <MenuItem value="mostOrdered">Most ordered</MenuItem>
              <MenuItem value="priceAsc">Price: low to high</MenuItem>
              <MenuItem value="priceDesc">Price: high to low</MenuItem>
              <MenuItem value="stockAsc">Stock: low to high</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(11,95,82,0.1)', overflow: 'hidden' }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(11,95,82,0.04)' }}>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell align="right">Ordered</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagination.paged.map((med) => (
                  <TableRow key={med.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar variant="rounded" src={med.imageUrl || PLACEHOLDER_IMAGE} alt={med.name} />
                        <Stack>
                          <Typography fontWeight={600}>{med.name}</Typography>
                          {med.featured && <Chip size="small" color="primary" label="Featured" sx={{ alignSelf: 'start' }} />}
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>{med.category}</TableCell>
                    <TableCell align="right">${Number(med.price).toFixed(2)}</TableCell>
                    <TableCell align="right">{med.stock}</TableCell>
                    <TableCell align="right">{med.timesOrdered || 0}</TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => openEdit(med)}>
                        Edit
                      </Button>
                      <IconButton aria-label="Delete" onClick={() => remove.mutate(med.id)}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
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

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>{editing ? 'Edit product' : 'Add product'}</DialogTitle>
          <DialogContent>
            <Stack component="form" id="med-form" spacing={2} mt={1} onSubmit={onSubmit}>
              <TextField label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <TextField label="Category" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <TextField label="Price" type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              <TextField label="Stock" type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
              <TextField label="Description" multiline minRows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <TextField label="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} helperText="Local path like /products/amoxicillin.png or https URL" />
              <FormControlLabel
                control={<Switch checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />}
                label="Featured product"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="med-form" variant="contained" disabled={save.isPending}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </PageShell>
  )
}
