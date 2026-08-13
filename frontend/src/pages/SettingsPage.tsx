import {
  Alert,
  Button,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { changePassword, fetchProfile, updateProfile } from '../api/medicence'
import { PageShell } from '../components/AppLayout'
import type { UserProfile } from '../types'

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const { data, isLoading, error } = useQuery({ queryKey: ['profile'], queryFn: fetchProfile })
  const [form, setForm] = useState<Partial<UserProfile>>({})
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  const saveNotifications = useMutation({
    mutationFn: () =>
      updateProfile({
        notifyOrders: form.notifyOrders,
        notifyStock: form.notifyStock,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
      setMessage('Settings saved')
      setErr(null)
    },
    onError: () => setErr('Could not save settings'),
  })

  const savePassword = useMutation({
    mutationFn: () => changePassword(currentPassword, newPassword),
    onSuccess: () => {
      setCurrentPassword('')
      setNewPassword('')
      setMessage('Password changed')
      setErr(null)
    },
    onError: () => setErr('Could not change password'),
  })

  if (isLoading) {
    return (
      <PageShell>
        <Typography>Loading settings…</Typography>
      </PageShell>
    )
  }
  if (error) {
    return (
      <PageShell>
        <Alert severity="error">Could not load settings</Alert>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <Typography variant="h3" gutterBottom>
        Settings
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Notification preferences and account security.
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

      <Stack spacing={3} maxWidth={560}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Notifications
          </Typography>
          <Stack
            component="form"
            spacing={1}
            onSubmit={(e: FormEvent) => {
              e.preventDefault()
              saveNotifications.mutate()
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={!!form.notifyOrders}
                  onChange={(e) => setForm({ ...form, notifyOrders: e.target.checked })}
                />
              }
              label="Order updates"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={!!form.notifyStock}
                  onChange={(e) => setForm({ ...form, notifyStock: e.target.checked })}
                />
              }
              label="Stock / replenishment alerts"
            />
            <Button type="submit" variant="contained" sx={{ alignSelf: 'start' }} disabled={saveNotifications.isPending}>
              Save notifications
            </Button>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Security
          </Typography>
          <Stack
            component="form"
            spacing={2}
            onSubmit={(e: FormEvent) => {
              e.preventDefault()
              savePassword.mutate()
            }}
          >
            <TextField
              label="Current password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <TextField
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              helperText="At least 6 characters"
            />
            <Button type="submit" variant="outlined" sx={{ alignSelf: 'start' }} disabled={savePassword.isPending}>
              Update password
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </PageShell>
  )
}
