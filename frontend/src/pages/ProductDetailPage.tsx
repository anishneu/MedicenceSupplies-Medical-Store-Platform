import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { fetchMedication } from '../api/medicence'
import { PageShell } from '../components/AppLayout'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import { PLACEHOLDER_IMAGE } from '../types'

export default function ProductDetailPage() {
  const { id } = useParams()
  const medId = Number(id)
  const user = useAuthStore((s) => s.user)
  const addItem = useCartStore((s) => s.addItem)
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)

  const { data, isLoading, error } = useQuery({
    queryKey: ['medication', medId],
    queryFn: () => fetchMedication(medId),
    enabled: Number.isFinite(medId),
  })

  const add = useMutation({
    mutationFn: async () => {
      if (!data) return
      if (!user) {
        navigate('/login')
        return
      }
      addItem(data, qty)
      navigate('/cart')
    },
  })

  if (isLoading) {
    return (
      <PageShell>
        <CircularProgress />
      </PageShell>
    )
  }
  if (error || !data) {
    return (
      <PageShell>
        <Alert severity="error">Product not found</Alert>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <Button component={RouterLink} to="/catalog" sx={{ mb: 2 }}>
        ← Back to catalog
      </Button>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={data.imageUrl || PLACEHOLDER_IMAGE}
            alt={data.name}
            onError={(e) => {
              const img = e.currentTarget
              if (!img.src.endsWith(PLACEHOLDER_IMAGE)) img.src = PLACEHOLDER_IMAGE
            }}
            sx={{
              width: '100%',
              borderRadius: 3,
              aspectRatio: '4 / 3',
              objectFit: 'cover',
              bgcolor: '#d7ebe4',
              p: 0,
              boxShadow: '0 18px 40px rgba(16,40,32,0.12)',
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Chip label={data.category} sx={{ mb: 1.5 }} />
          <Typography variant="h3" gutterBottom>
            {data.name}
          </Typography>
          <Typography variant="h4" color="primary.main" gutterBottom>
            ${Number(data.price).toFixed(2)}
          </Typography>
          <Typography color="text.secondary" paragraph>
            {data.description || 'Clinical supply item from the Medicence catalog.'}
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }} color={data.stock < 10 ? 'warning.main' : 'text.secondary'}>
            Availability: {data.stock} units
          </Typography>

          {(!user || user.role === 'CUSTOMER') && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
              <TextField
                type="number"
                label="Qty"
                size="small"
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                inputProps={{ min: 1, max: data.stock }}
                sx={{ width: 100 }}
              />
              <Button
                variant="contained"
                size="large"
                disabled={data.stock < 1}
                onClick={() => add.mutate()}
              >
                {user ? 'Add to cart' : 'Sign in to purchase'}
              </Button>
            </Stack>
          )}
        </Grid>
      </Grid>
    </PageShell>
  )
}
