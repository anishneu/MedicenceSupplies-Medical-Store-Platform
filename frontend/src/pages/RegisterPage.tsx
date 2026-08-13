import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { register } from '../api/medicence'
import { useAuthStore } from '../store/authStore'
import type { Role } from '../types'

export default function RegisterPage() {
  const setUser = useAuthStore((s) => s.setUser)
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('CUSTOMER')
  const [supplierName, setSupplierName] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const user = await register({
        username,
        password,
        role,
        supplierName: role === 'SUPPLIER' ? supplierName : undefined,
        contactInfo: role === 'SUPPLIER' ? contactInfo : undefined,
      })
      setUser(user)
      navigate(user.role === 'SUPPLIER' ? '/supplier' : '/catalog')
    } catch (err: unknown) {
      const message =
        typeof err === 'object' && err && 'response' in err
          ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ??
            'Registration failed')
          : 'Registration failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        py: 4,
        background:
          'linear-gradient(160deg, rgba(7,64,56,0.94) 0%, rgba(11,95,82,0.9) 50%, rgba(26,125,108,0.85) 100%)',
      }}
    >
      <Paper
        sx={{
          width: '100%',
          maxWidth: 460,
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          background: 'rgba(247, 251, 249, 0.97)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.28)',
        }}
      >
        <Typography
          component={RouterLink}
          to="/"
          variant="h4"
          mb={1}
          color="primary.main"
          sx={{ display: 'block', textDecoration: 'none', fontFamily: '"Fraunces", Georgia, serif' }}
        >
          Join Medicence Supplies
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Register as a customer or supplier. Admin accounts are provisioned separately.
        </Typography>

        <Stack component="form" spacing={2} onSubmit={onSubmit}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            helperText="At least 6 characters"
          />
          <FormControl fullWidth>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <MenuItem value="CUSTOMER">Customer</MenuItem>
              <MenuItem value="SUPPLIER">Supplier</MenuItem>
            </Select>
          </FormControl>
          {role === 'SUPPLIER' && (
            <>
              <TextField
                label="Supplier name"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                required
              />
              <TextField
                label="Contact info"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
              />
            </>
          )}
          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </Button>
        </Stack>

        <Typography mt={3} variant="body2">
          Already registered?{' '}
          <Link component={RouterLink} to="/login">
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  )
}
