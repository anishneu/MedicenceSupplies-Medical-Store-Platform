import { CssBaseline, ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import LoginPage from '../pages/LoginPage'
import theme from '../theme'

describe('LoginPage', () => {
  it('renders Medicence Supplies brand', () => {
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter>
            <LoginPage />
          </MemoryRouter>
        </QueryClientProvider>
      </ThemeProvider>,
    )
    expect(screen.getByText('Medicence Supplies')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })
})
