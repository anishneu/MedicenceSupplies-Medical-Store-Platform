import axios from 'axios'

const baseURL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || 'http://localhost:8080'

const api = axios.create({
  baseURL,
  timeout: 60000,
})

if (import.meta.env.PROD && (!import.meta.env.VITE_API_URL || String(import.meta.env.VITE_API_URL).includes('YOUR-RENDER'))) {
  console.error(
    'VITE_API_URL is missing or still a placeholder. Set it in Netlify → Site settings → Environment variables to your Render API URL, then redeploy.',
  )
}

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('medicence-auth')
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { state?: { user?: { token?: string } } }
      const token = parsed.state?.user?.token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      // ignore malformed storage
    }
  }
  return config
})

export default api
