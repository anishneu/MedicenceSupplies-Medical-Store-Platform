import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined'
import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'
import { fetchMedications } from '../api/medicence'
import ProductCard from '../components/ProductCard'
import { useAuthStore } from '../store/authStore'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80'

export default function LandingPage() {
  const user = useAuthStore((s) => s.user)
  const { data: meds = [], isPending, isError } = useQuery({
    queryKey: ['medications'],
    queryFn: fetchMedications,
    staleTime: 60_000,
  })
  const featured = meds.filter((m) => m.featured).slice(0, 4)
  const showcase = featured.length ? featured : meds.slice(0, 4)

  const ctaTo = user
    ? user.role === 'ADMIN'
      ? '/admin'
      : user.role === 'SUPPLIER'
        ? '/supplier'
        : '/catalog'
    : '/register'

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '78vh', md: '88vh' },
          display: 'flex',
          alignItems: 'flex-end',
          color: '#f7fbf9',
          backgroundImage: `linear-gradient(100deg, rgba(7,40,36,0.88) 0%, rgba(7,40,36,0.55) 48%, rgba(7,40,36,0.25) 100%), url(${HERO_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 10 }, pt: { xs: 10, md: 0 } }}>
          <Chip
            label="Medical wholesale commerce"
            sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.14)', color: '#fff', backdropFilter: 'blur(6px)' }}
          />
          <Typography
            variant="h1"
            sx={{
              maxWidth: 720,
              fontSize: { xs: '2.6rem', sm: '3.6rem', md: '4.4rem' },
              lineHeight: 1.05,
              mb: 2,
            }}
          >
            Medicence Supplies
          </Typography>
          <Typography sx={{ maxWidth: 520, fontSize: { xs: '1.05rem', md: '1.2rem' }, opacity: 0.92, mb: 3 }}>
            Source medications, devices, and clinical essentials with inventory visibility,
            supplier workflows, and role-based fulfillment.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button component={RouterLink} to={ctaTo} variant="contained" size="large" color="secondary">
              {user ? 'Go to workspace' : 'Create account'}
            </Button>
            <Button
              component={RouterLink}
              to="/catalog"
              variant="outlined"
              size="large"
              sx={{ borderColor: 'rgba(255,255,255,0.55)', color: '#fff' }}
            >
              Browse catalog
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Grid container spacing={3}>
          {[
            {
              icon: <Inventory2OutlinedIcon color="primary" />,
              title: 'Live catalog',
              body: 'Browse priced inventory with stock levels and product imagery.',
            },
            {
              icon: <LocalShippingOutlinedIcon color="primary" />,
              title: 'Order orchestration',
              body: 'Customers place carts; admins process and track fulfillment status.',
            },
            {
              icon: <VerifiedOutlinedIcon color="primary" />,
              title: 'Supplier network',
              body: 'Approve replenishment requests and keep shelves ready.',
            },
            {
              icon: <SupportAgentOutlinedIcon color="primary" />,
              title: 'Help desk',
              body: 'Submit tickets and manage support from the same platform.',
            },
          ].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <Box sx={{ p: 1 }}>
                <Box sx={{ mb: 1.5 }}>{item.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.body}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: 'rgba(255,255,255,0.55)', py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ sm: 'center' }}
            mb={3}
            spacing={2}
          >
            <Box>
              <Typography variant="h3" gutterBottom>
                Featured products
              </Typography>
              <Typography color="text.secondary">
                A sample of Medicence catalog SKUs ready for clinical procurement.
              </Typography>
            </Box>
            <Button
              component={RouterLink}
              to="/catalog"
              variant="outlined"
              size="medium"
              sx={{
                alignSelf: { xs: 'flex-start', sm: 'center' },
                flexShrink: 0,
                px: 2.5,
                py: 0.75,
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              View all
            </Button>
          </Stack>
          <Grid container spacing={2.5}>
            {isPending &&
              Array.from({ length: 4 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={3} key={`sk-${i}`}>
                  <Skeleton variant="rounded" height={280} sx={{ borderRadius: 3 }} />
                </Grid>
              ))}
            {!isPending &&
              !isError &&
              showcase.map((med) => (
                <Grid item xs={12} sm={6} md={3} key={med.id}>
                  <ProductCard medication={med} showAddToCart />
                </Grid>
              ))}
            {!isPending && isError && (
              <Grid item xs={12}>
                <Stack alignItems="center" spacing={1.5} py={4}>
                  <CircularProgress size={28} />
                  <Typography color="text.secondary" textAlign="center">
                    Could not load featured products. Is the API running on port 8080?
                  </Typography>
                </Stack>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Box
          sx={{
            borderRadius: 3,
            p: { xs: 3, md: 5 },
            background: 'linear-gradient(120deg, #0b5f52 0%, #1a7d6c 55%, #c45c26 160%)',
            color: '#f7fbf9',
          }}
        >
          <Typography variant="h3" gutterBottom sx={{ color: 'inherit' }}>
            Built for three roles
          </Typography>
          <Typography sx={{ maxWidth: 640, mb: 3, opacity: 0.92 }}>
            Customers shop and track orders. Admins manage inventory, fulfillment, and support.
            Suppliers replenish stock and clear pending requests.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button component={RouterLink} to="/login" variant="contained" color="secondary">
              Sign in
            </Button>
            <Button
              component={RouterLink}
              to="/help"
              variant="outlined"
              sx={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}
            >
              Help & Support
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
