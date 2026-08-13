import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'

export function useClientPagination<T>(items: T[], defaultRowsPerPage = 8) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage)

  const paged = useMemo(() => {
    const start = page * rowsPerPage
    return items.slice(start, start + rowsPerPage)
  }, [items, page, rowsPerPage])

  function handleChangePage(_: unknown, newPage: number) {
    setPage(newPage)
  }

  function handleChangeRowsPerPage(event: ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  function resetPage() {
    setPage(0)
  }

  return {
    page,
    rowsPerPage,
    paged,
    handleChangePage,
    handleChangeRowsPerPage,
    resetPage,
    count: items.length,
  }
}
