import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { useEffect, useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchMedications, fetchProfile } from '../api/medicence'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import SiteFooter from './SiteFooter'

function initialsFrom(name?: string | null, username?: string) {
  const source = (name || username || 'U').trim()
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

export default function AppLayout() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0))
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // Warm the medications cache as soon as the shell mounts so Featured products
  // on the landing page appear without waiting for that section to render.
  useEffect(() => {
    void queryClient.prefetchQuery({
      queryKey: ['medications'],
      queryFn: fetchMedications,
      staleTime: 60_000,
    })
  }, [queryClient])
  
  const profile = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    enabled: !!user,
  })

  const initials = useMemo(
    () => initialsFrom(profile.data?.fullName, user?.username),
    [profile.data?.fullName, user?.username],
  )

  function openMenu(e: MouseEvent<HTMLElement>) {
    setAnchorEl(e.currentTarget)
  }

  function closeMenu() {
    setAnchorEl(null)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background:
          'radial-gradient(ellipse 90% 55% at 0% -10%, #c5e4db 0%, transparent 55%), radial-gradient(ellipse 70% 45% at 100% 0%, #d7ebe4 0%, transparent 50%), linear-gradient(180deg, #eef4f1 0%, #e4ece8 100%)',
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'rgba(255,255,255,0.92)',
          color: 'text.primary',
          borderBottom: '1px solid rgba(11, 95, 82, 0.1)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Toolbar sx={{ gap: 1, flexWrap: 'wrap', py: 0.5 }}>
          <IconButton
            edge="start"
            sx={{ display: { md: 'none' } }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            <MenuIcon />
          </IconButton>

          <Typography
            component={RouterLink}
            to="/"
            variant="h5"
            sx={{
              fontFamily: '"Fraunces", Georgia, serif',
              fontWeight: 700,
              color: 'primary.main',
              mr: 2,
              letterSpacing: '-0.02em',
            }}
          >
            Medicence Supplies
          </Typography>

          <Box
            sx={{
              display: { xs: mobileOpen ? 'flex' : 'none', md: 'flex' },
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { md: 'center' },
              gap: 0.5,
              width: { xs: '100%', md: 'auto' },
              flexGrow: 1,
            }}
          >
            {user?.role === 'ADMIN' && (
              <>
                <Button component={RouterLink} to="/admin" color="inherit">
                  Dashboard
                </Button>
                <Button component={RouterLink} to="/catalog" color="inherit">
                  Catalog
                </Button>
                <Button component={RouterLink} to="/admin/medications" color="inherit">
                  Inventory
                </Button>
                <Button component={RouterLink} to="/admin/orders" color="inherit">
                  Orders
                </Button>
                <Button component={RouterLink} to="/admin/stock" color="inherit">
                  Stock
                </Button>
                <Button component={RouterLink} to="/admin/support" color="inherit">
                  Tickets
                </Button>
              </>
            )}

            {user?.role === 'SUPPLIER' && (
              <>
                <Button component={RouterLink} to="/supplier" color="inherit">
                  Dashboard
                </Button>
                <Button component={RouterLink} to="/catalog" color="inherit">
                  Catalog
                </Button>
                <Button component={RouterLink} to="/supplier/catalog" color="inherit">
                  Inventory
                </Button>
                <Button component={RouterLink} to="/supplier/requests" color="inherit">
                  Requests
                </Button>
              </>
            )}

            {(!user || user.role === 'CUSTOMER') && (
              <>
                <Button component={RouterLink} to="/" color="inherit">
                  Home
                </Button>
                <Button component={RouterLink} to="/catalog" color="inherit">
                  Catalog
                </Button>
                {user?.role === 'CUSTOMER' && (
                  <Button component={RouterLink} to="/orders" color="inherit">
                    Orders
                  </Button>
                )}
              </>
            )}
          </Box>

          {user?.role === 'CUSTOMER' && (
            <IconButton component={RouterLink} to="/cart" color="inherit" aria-label="Cart">
              <Badge badgeContent={cartCount} color="secondary">
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>
          )}

          {user ? (
            <>
              <IconButton onClick={openMenu} aria-label="Account menu" sx={{ p: 0.5 }}>
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: 'primary.main',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                  }}
                >
                  {initials}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <Box sx={{ px: 2, py: 1.2, minWidth: 200 }}>
                  <Typography fontWeight={700}>{profile.data?.fullName || user.username}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.role}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem
                  onClick={() => {
                    closeMenu()
                    navigate('/account/profile')
                  }}
                >
                  <ListItemIcon>
                    <PersonOutlineIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    closeMenu()
                    navigate('/account/settings')
                  }}
                >
                  <ListItemIcon>
                    <SettingsOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    closeMenu()
                    navigate('/help')
                  }}
                >
                  <ListItemIcon>
                    <SupportAgentOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  Help and Support
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    closeMenu()
                    logout()
                    navigate('/')
                  }}
                >
                  <ListItemIcon>
                    <LogoutOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  Sign out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button component={RouterLink} to="/login" color="inherit">
                Sign in
              </Button>
              <Button component={RouterLink} to="/register" variant="contained">
                Get started
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <SiteFooter />
    </Box>
  )
}

export function PageShell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <Container
      maxWidth={wide ? 'lg' : 'lg'}
      sx={{
        py: { xs: 3, md: 5 },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {children}
    </Container>
  )
}
