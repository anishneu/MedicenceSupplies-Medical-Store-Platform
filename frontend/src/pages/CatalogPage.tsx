import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchMedications } from '../api/medicence'
import ProductCard from '../components/ProductCard'
import { PageShell } from '../components/AppLayout'
import type { Medication } from '../types'

type SortOption =
  | 'featured'
  | 'mostOrdered'
  | 'nameAsc'
  | 'nameDesc'
  | 'priceAsc'
  | 'priceDesc'

const PAGE_SIZE = 8

export default function CatalogPage() {
  const { data = [], isLoading, error } = useQuery({ queryKey: ['medications'], queryFn: fetchMedications })
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('ALL')
  const [sort, setSort] = useState<SortOption>('featured')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [page, setPage] = useState(1)

  const categories = useMemo(
    () => ['ALL', ...Array.from(new Set(data.map((m) => m.category))).sort()],
    [data],
  )

  const filteredSorted = useMemo(() => {
    let list: Medication[] = data.filter((m) => {
      const matchesQ =
        !q ||
        m.name.toLowerCase().includes(q.toLowerCase()) ||
        (m.description || '').toLowerCase().includes(q.toLowerCase())
      const matchesCat = category === 'ALL' || m.category === category
      const matchesStock = !inStockOnly || m.stock > 0
      return matchesQ && matchesCat && matchesStock
    })

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'nameAsc':
          return a.name.localeCompare(b.name)
        case 'nameDesc':
          return b.name.localeCompare(a.name)
        case 'priceAsc':
          return Number(a.price) - Number(b.price)
        case 'priceDesc':
          return Number(b.price) - Number(a.price)
        case 'mostOrdered':
          return (b.timesOrdered || 0) - (a.timesOrdered || 0)
        case 'featured':
        default: {
          const af = a.featured ? 1 : 0
          const bf = b.featured ? 1 : 0
          if (bf !== af) return bf - af
          return (b.timesOrdered || 0) - (a.timesOrdered || 0)
        }
      }
    })

    return list
  }, [data, q, category, sort, inStockOnly])

  useEffect(() => {
    setPage(1)
  }, [q, category, sort, inStockOnly])

  const pageCount = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE))
  const paged = filteredSorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <PageShell>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h3" gutterBottom>
            Product catalog
          </Typography>
          <Typography color="text.secondary">
            Search, filter, and sort Medicence Supplies inventory.
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} useFlexGap flexWrap="wrap">
          <TextField
            sx={{ flex: 1, minWidth: 220 }}
            label="Search products"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="cat">Category</InputLabel>
            <Select labelId="cat" label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c === 'ALL' ? 'All categories' : c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="sort">Sort by</InputLabel>
            <Select
              labelId="sort"
              label="Sort by"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
            >
              <MenuItem value="featured">Most featured</MenuItem>
              <MenuItem value="mostOrdered">Most ordered</MenuItem>
              <MenuItem value="nameAsc">Name A–Z</MenuItem>
              <MenuItem value="nameDesc">Name Z–A</MenuItem>
              <MenuItem value="priceAsc">Price: low to high</MenuItem>
              <MenuItem value="priceDesc">Price: high to low</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel id="stock">Availability</InputLabel>
            <Select
              labelId="stock"
              label="Availability"
              value={inStockOnly ? 'IN_STOCK' : 'ALL'}
              onChange={(e) => setInStockOnly(e.target.value === 'IN_STOCK')}
            >
              <MenuItem value="ALL">All items</MenuItem>
              <MenuItem value="IN_STOCK">In stock only</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Chip size="small" label={`${filteredSorted.length} products`} />
          {sort === 'featured' && <Chip size="small" color="primary" variant="outlined" label="Featured first" />}
          {sort === 'mostOrdered' && <Chip size="small" color="secondary" variant="outlined" label="By order volume" />}
        </Stack>

        {isLoading && <CircularProgress />}
        {error && (
          <Alert severity="error">
            Could not load catalog. Open your Render API URL in a browser first (wake the free
            service), confirm Netlify env <code>VITE_API_URL</code> is that same URL, then
            redeploy the Netlify site.
          </Alert>
        )}

        <Grid container spacing={2.5}>
          {paged.map((med) => (
            <Grid item xs={12} sm={6} md={3} key={med.id}>
              <ProductCard medication={med} />
            </Grid>
          ))}
        </Grid>

        {!isLoading && filteredSorted.length === 0 && (
          <Typography color="text.secondary">No products match your filters.</Typography>
        )}

        {filteredSorted.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
            <Pagination
              color="primary"
              count={pageCount}
              page={page}
              onChange={(_, value) => setPage(value)}
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Stack>
    </PageShell>
  )
}
