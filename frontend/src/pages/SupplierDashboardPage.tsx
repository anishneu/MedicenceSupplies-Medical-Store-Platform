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
import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'
import { fetchDashboardStats, fetchPendingStockRequests } from '../api/medicence'
import { PageShell } from '../components/AppLayout'

export default function SupplierDashboardPage() {
  const stats = useQuery({ queryKey: ['dashboard-stats'], queryFn: fetchDashboardStats })
  const pending = useQuery({ queryKey: ['pending-stock-requests'], queryFn: fetchPendingStockRequests })

  if (stats.isLoading || pending.isLoading) {
    return (
      <PageShell>
        <CircularProgress />
      </PageShell>
    )
  }
  if (stats.error || !stats.data) {
    return (
      <PageShell>
        <Alert severity="error">Could not load supplier dashboard</Alert>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h3" gutterBottom>
            Supplier workspace
          </Typography>
          <Typography color="text.secondary">
            Replenish Medicence inventory and clear pending stock requests.
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h3">{stats.data.medicationCount}</Typography>
                <Typography color="text.secondary">Catalog SKUs</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h3">{stats.data.lowStockCount}</Typography>
                <Typography color="text.secondary">Low stock (&lt; 20)</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h3">{stats.data.pendingStockRequestCount}</Typography>
                <Typography color="text.secondary">Pending requests</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button component={RouterLink} to="/supplier/requests" variant="contained">
            Review requests ({pending.data?.length ?? 0})
          </Button>
          <Button component={RouterLink} to="/supplier/catalog" variant="outlined">
            Update inventory
          </Button>
          <Button component={RouterLink} to="/catalog" variant="text">
            View public catalog
          </Button>
        </Stack>
      </Stack>
    </PageShell>
  )
}
