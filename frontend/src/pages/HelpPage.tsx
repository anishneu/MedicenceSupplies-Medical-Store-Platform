import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Chip,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { createSupportTicket, fetchMyTickets } from '../api/medicence'
import { PageShell } from '../components/AppLayout'
import { useAuthStore } from '../store/authStore'
import { Link as RouterLink } from 'react-router-dom'

const faqs = [
  {
    q: 'How do I place an order?',
    a: 'Sign in as a customer, add products from the catalog or shop, then checkout from your cart. Stock is reserved when the order is placed.',
  },
  {
    q: 'Who can register as admin?',
    a: 'Admin accounts are provisioned by the platform. Self-registration supports Customer and Supplier roles only.',
  },
  {
    q: 'How does replenishment work?',
    a: 'Admins create stock requests for low inventory. Suppliers approve or reject those requests and can also set stock levels directly.',
  },
  {
    q: 'Where can I update shipping details?',
    a: 'Open Account settings to edit your name, email, phone, and address.',
  },
]

export default function HelpPage() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const tickets = useQuery({
    queryKey: ['my-tickets'],
    queryFn: fetchMyTickets,
    enabled: !!user,
  })

  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState('GENERAL')
  const [ok, setOk] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const create = useMutation({
    mutationFn: () => createSupportTicket({ subject, message, category }),
    onSuccess: async () => {
      setSubject('')
      setMessage('')
      setOk('Ticket submitted. Our team will follow up.')
      setErr(null)
      await queryClient.invalidateQueries({ queryKey: ['my-tickets'] })
    },
    onError: () => setErr('Could not submit ticket'),
  })

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    create.mutate()
  }

  return (
    <PageShell>
      <Typography variant="h3" gutterBottom>
        Help & Support
      </Typography>
      <Typography color="text.secondary" mb={4}>
        Guides for Medicence Supplies buyers, admins, and suppliers — plus a ticket desk for account-specific issues.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Frequently asked
          </Typography>
          {faqs.map((f) => (
            <Accordion key={f.q} disableGutters elevation={0} sx={{ mb: 1, border: '1px solid rgba(11,95,82,0.1)' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={600}>{f.q}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{f.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: support@medicence.example
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: +1 (800) 555-0147
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Hours: Mon–Fri · 8am–8pm ET
            </Typography>
            {!user && (
              <Button component={RouterLink} to="/login" variant="contained">
                Sign in to open a ticket
              </Button>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          {user ? (
            <Stack spacing={3}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Submit a ticket
                </Typography>
                {ok && <Alert severity="success" sx={{ mb: 2 }}>{ok}</Alert>}
                {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
                <Stack component="form" spacing={2} onSubmit={onSubmit}>
                  <FormControl fullWidth>
                    <InputLabel id="cat">Category</InputLabel>
                    <Select
                      labelId="cat"
                      label="Category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <MenuItem value="GENERAL">General</MenuItem>
                      <MenuItem value="ORDERS">Orders</MenuItem>
                      <MenuItem value="INVENTORY">Inventory</MenuItem>
                      <MenuItem value="ACCOUNT">Account</MenuItem>
                      <MenuItem value="BILLING">Billing</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Subject"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                  <TextField
                    label="Message"
                    required
                    multiline
                    minRows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <Button type="submit" variant="contained" disabled={create.isPending}>
                    Send ticket
                  </Button>
                </Stack>
              </Paper>

              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Your tickets
                </Typography>
                <Stack spacing={1.5}>
                  {(tickets.data || []).map((t) => (
                    <Stack
                      key={t.id}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ py: 1, borderBottom: '1px solid rgba(0,0,0,0.06)' }}
                    >
                      <Box>
                        <Typography fontWeight={600}>{t.subject}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t.category} · {new Date(t.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                      <Chip size="small" label={t.status} />
                    </Stack>
                  ))}
                  {tickets.data?.length === 0 && (
                    <Typography color="text.secondary">No tickets yet.</Typography>
                  )}
                </Stack>
              </Paper>
            </Stack>
          ) : (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Need personalized help?
              </Typography>
              <Typography color="text.secondary" mb={2}>
                Sign in to create support tickets and track responses against your account.
              </Typography>
              <Button component={RouterLink} to="/login" variant="contained">
                Sign in
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>
    </PageShell>
  )
}
