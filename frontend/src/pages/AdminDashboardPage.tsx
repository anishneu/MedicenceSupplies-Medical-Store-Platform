import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined'
import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'
import { fetchDashboardStats } from '../api/medicence'
import { PageShell } from '../components/AppLayout'

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['dashboard-stats'], queryFn: fetchDashboardStats })

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
        <Alert severity="error">Could not load dashboard</Alert>
      </PageShell>
    )
  }

  const cards = [
    {
      label: 'SKUs in catalog',
      value: data.medicationCount,
      icon: <Inventory2OutlinedIcon color="primary" />,
      to: '/admin/medications',
    },
    {
      label: 'Low stock items',
      value: data.lowStockCount,
      icon: <WarningAmberOutlinedIcon color="warning" />,
      to: '/admin/stock',
    },
    {
      label: 'Pending orders',
      value: data.pendingOrderCount,
      icon: <LocalShippingOutlinedIcon color="primary" />,
      to: '/admin/orders',
    },
    {
      label: 'Open support tickets',
      value: data.openTicketCount,
      icon: <SupportAgentOutlinedIcon color="primary" />,
      to: '/admin/support',
    },
  ]

  return (
    <PageShell>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h3" gutterBottom>
            Admin dashboard
          </Typography>
          <Typography color="text.secondary">
            Operations overview for Medicence Supplies inventory, orders, and support.
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          {cards.map((c) => (
            <Grid item xs={12} sm={6} md={3} key={c.label}>
              <Card>
                <CardContent>
                  <Stack spacing={1}>
                    {c.icon}
                    <Typography variant="h3">{c.value}</Typography>
                    <Typography color="text.secondary">{c.label}</Typography>
                    <Button component={RouterLink} to={c.to} size="small">
                      Open
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button component={RouterLink} to="/admin/medications" variant="contained">
            Manage inventory
          </Button>
          <Button component={RouterLink} to="/admin/orders" variant="outlined">
            Process orders
          </Button>
          <Button component={RouterLink} to="/admin/stock" variant="outlined">
            Request stock
          </Button>
        </Stack>
      </Stack>
    </PageShell>
  )
}
