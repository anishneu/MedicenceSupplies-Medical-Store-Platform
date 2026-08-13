import { Alert, Box, Button, Link, Paper, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { login } from '../api/medicence'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
  const setUser = useAuthStore((s) => s.setUser)
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const user = await login(username, password)
      setUser(user)
      if (user.role === 'ADMIN') navigate('/admin')
      else if (user.role === 'SUPPLIER') navigate('/supplier')
      else navigate('/catalog')
    } catch {
      setError('Invalid username or password')
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
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 420,
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          bgcolor: '#fff',
          boxShadow: '0 24px 60px rgba(0,0,0,0.28)',
        }}
      >
        <Stack spacing={1} mb={3}>
          <Typography
            component={RouterLink}
            to="/"
            variant="h3"
            sx={{
              fontFamily: '"Fraunces", Georgia, serif',
              color: 'primary.main',
              fontSize: { xs: '2rem', sm: '2.35rem' },
              textDecoration: 'none',
            }}
          >
            Medicence Supplies
          </Typography>
          <Typography color="text.secondary">Sign in to your wholesale workspace.</Typography>
        </Stack>

        <Stack component="form" spacing={2} onSubmit={onSubmit}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required fullWidth />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </Stack>

        <Typography mt={3} variant="body2" color="text.secondary">
          New here?{' '}
          <Link component={RouterLink} to="/register">
            Create an account
          </Link>
        </Typography>
      </Paper>
    </Box>
  )
}
