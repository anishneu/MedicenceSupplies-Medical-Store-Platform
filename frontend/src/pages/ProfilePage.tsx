import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { fetchProfile, updateProfile } from '../api/medicence'
import { PageShell } from '../components/AppLayout'
import type { UserProfile } from '../types'

function initialsFrom(name?: string | null, username?: string) {
  const source = (name || username || 'U').trim()
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

export default function ProfilePage() {
  const queryClient = useQueryClient()
  const { data, isLoading, error } = useQuery({ queryKey: ['profile'], queryFn: fetchProfile })
  const [form, setForm] = useState<Partial<UserProfile>>({})
  const [message, setMessage] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  const initials = useMemo(
    () => initialsFrom(form.fullName || data?.fullName, data?.username),
    [form.fullName, data?.fullName, data?.username],
  )

  const saveProfile = useMutation({
    mutationFn: () =>
      updateProfile({
        email: form.email,
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
      setMessage('Profile updated')
      setErr(null)
    },
    onError: () => setErr('Could not update profile'),
  })

  function onProfileSubmit(e: FormEvent) {
    e.preventDefault()
    saveProfile.mutate()
  }

  if (isLoading) {
    return (
      <PageShell>
        <Typography>Loading profile…</Typography>
      </PageShell>
    )
  }
  if (error) {
    return (
      <PageShell>
        <Alert severity="error">Could not load profile</Alert>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <Typography variant="h3" gutterBottom>
        Profile
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Your public account details for Medicence Supplies.
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      {err && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {err}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 96,
                height: 96,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                fontWeight: 700,
              }}
            >
              {initials}
            </Avatar>
            <Typography variant="h6">{form.fullName || data?.username}</Typography>
            <Typography color="text.secondary">{data?.role}</Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              @{data?.username}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Stack component="form" spacing={2} onSubmit={onProfileSubmit}>
              <TextField label="Username" value={data?.username || ''} disabled />
              <TextField label="Role" value={data?.role || ''} disabled />
              <TextField
                label="Full name"
                value={form.fullName || ''}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
              <TextField
                label="Email"
                type="email"
                value={form.email || ''}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <TextField
                label="Phone"
                value={form.phone || ''}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <TextField
                label="Address"
                value={form.address || ''}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                multiline
                minRows={2}
              />
              <Box>
                <Button type="submit" variant="contained" disabled={saveProfile.isPending}>
                  Save profile
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </PageShell>
  )
}
