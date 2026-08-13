import {
  Alert,
  Button,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { placeOrder } from '../api/medicence'
import { PageShell } from '../components/AppLayout'
import { useCartStore } from '../store/cartStore'

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const clear = useCartStore((s) => s.clear)
  const total = useCartStore((s) => s.total)
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const checkout = useMutation({
    mutationFn: () =>
      placeOrder(items.map((i) => ({ medicationId: i.medication.id, quantity: i.quantity }))),
    onSuccess: () => {
      clear()
      navigate('/orders')
    },
    onError: (err: unknown) => {
      const message =
        typeof err === 'object' && err && 'response' in err
          ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ??
            'Checkout failed')
          : 'Checkout failed'
      setError(message)
    },
  })

  if (items.length === 0) {
    return (
      <PageShell>
        <Stack spacing={2}>
          <Typography variant="h3">Cart</Typography>
          <Typography color="text.secondary">Your cart is empty.</Typography>
          <Button variant="contained" onClick={() => navigate('/catalog')} sx={{ alignSelf: 'start' }}>
            Browse catalog
          </Button>
        </Stack>
      </PageShell>
    )
  }

  return (
    <PageShell>
    <Stack spacing={3}>
      <Typography variant="h3">Cart</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Table sx={{ background: 'rgba(247,251,249,0.85)', borderRadius: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Medication</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="center">Qty</TableCell>
            <TableCell align="right">Line total</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.medication.id}>
              <TableCell>{item.medication.name}</TableCell>
              <TableCell align="right">${Number(item.medication.price).toFixed(2)}</TableCell>
              <TableCell align="center">
                <TextField
                  type="number"
                  size="small"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.medication.id, Number(e.target.value))}
                  inputProps={{ min: 1, max: item.medication.stock, style: { width: 64 } }}
                />
              </TableCell>
              <TableCell align="right">
                ${(Number(item.medication.price) * item.quantity).toFixed(2)}
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => removeItem(item.medication.id)} aria-label="Remove">
                  <DeleteOutlineIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Total: ${total().toFixed(2)}</Typography>
        <Button variant="contained" size="large" disabled={checkout.isPending} onClick={() => checkout.mutate()}>
          {checkout.isPending ? 'Placing order…' : 'Place order'}
        </Button>
      </Stack>
    </Stack>
    </PageShell>
  )
}
