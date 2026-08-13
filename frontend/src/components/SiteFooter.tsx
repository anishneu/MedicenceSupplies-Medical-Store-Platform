import { Box, Button, Container, Divider, Link, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export default function SiteFooter() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        pt: 5,
        pb: 4,
        borderTop: '1px solid rgba(11,95,82,0.14)',
        background: 'rgba(255,255,255,0.72)',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          justifyContent="space-between"
          mb={4}
        >
          <Box maxWidth={360}>
            <Typography variant="h5" color="primary.main" gutterBottom>
              Medicence Supplies
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Industrial-grade medical commerce for clinics, pharmacies, and care networks —
              catalog, fulfillment, and supplier coordination in one platform.
            </Typography>
          </Box>
          <Stack spacing={1}>
            <Typography fontWeight={700}>Explore</Typography>
            <Link component={RouterLink} to="/catalog" color="inherit" underline="hover">
              Catalog
            </Link>
            <Link component={RouterLink} to="/help" color="inherit" underline="hover">
              Help & Support
            </Link>
            <Link component={RouterLink} to="/login" color="inherit" underline="hover">
              Sign in
            </Link>
          </Stack>
          <Stack spacing={1}>
            <Typography fontWeight={700}>Contact</Typography>
            <Typography variant="body2" color="text.secondary">
              support@medicence.example
            </Typography>
            <Typography variant="body2" color="text.secondary">
              +1 (800) 555-0147
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mon–Fri · 8am–8pm ET
            </Typography>
          </Stack>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Medicence Supplies. All rights reserved.
          </Typography>
          <Button component={RouterLink} to="/register" size="small">
            Open a wholesale account
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}
