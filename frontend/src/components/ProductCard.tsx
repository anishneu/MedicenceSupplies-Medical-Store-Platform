import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import type { Medication } from '../types'
import { PLACEHOLDER_IMAGE } from '../types'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'

interface Props {
  medication: Medication
  showAddToCart?: boolean
}

export default function ProductCard({ medication, showAddToCart = true }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const canBuy = showAddToCart && (!user || user.role === 'CUSTOMER')

  function handleAdd() {
    if (!user) {
      navigate('/login')
      return
    }
    addItem(medication, 1)
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform 220ms ease, box-shadow 220ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 18px 40px rgba(16, 40, 32, 0.12)',
        },
      }}
    >
      <Box
        component={RouterLink}
        to={`/products/${medication.id}`}
        sx={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
      >
        <CardMedia
          component="img"
          height="190"
          image={medication.imageUrl || PLACEHOLDER_IMAGE}
          alt={medication.name}
          sx={{ objectFit: 'cover', bgcolor: '#d7ebe4' }}
          onError={(e) => {
            const img = e.currentTarget
            if (!img.src.endsWith(PLACEHOLDER_IMAGE)) {
              img.src = PLACEHOLDER_IMAGE
            }
          }}
        />
        <CardContent sx={{ pb: 1 }}>
          <Stack direction="row" spacing={0.75} mb={1} flexWrap="wrap" useFlexGap>
            <Chip size="small" label={medication.category} />
            {medication.featured && <Chip size="small" color="primary" label="Featured" />}
          </Stack>
          <Typography variant="h6" sx={{ fontSize: '1.05rem', minHeight: 52 }}>
            {medication.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
            {(medication.description || 'Clinical-grade supply for pharmacies and care teams.').slice(0, 72)}
            …
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1.5}>
            <Typography variant="h6" color="primary.main">
              ${Number(medication.price).toFixed(2)}
            </Typography>
            <Typography variant="caption" color={medication.stock < 10 ? 'warning.main' : 'text.secondary'}>
              {medication.stock} in stock
            </Typography>
          </Stack>
        </CardContent>
      </Box>
      {canBuy && (
        <CardActions sx={{ mt: 'auto', px: 2, pb: 2 }}>
          <Button fullWidth variant="contained" disabled={medication.stock < 1} onClick={handleAdd}>
            {user ? 'Add to cart' : 'Sign in to buy'}
          </Button>
        </CardActions>
      )}
    </Card>
  )
}
