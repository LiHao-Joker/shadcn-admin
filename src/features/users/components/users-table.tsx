import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { getPaginationUsersEndpoint, getRolesEndpoint } from '@/api'
import { cn } from '@/lib/utils'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { useUsers } from '@/features/users/components/users-provider.tsx'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { usersColumns as columns } from './users-columns'

type DataTableProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function UsersTable({ search, navigate }: DataTableProps) {
  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  const { open, setRoles, roles: roless } = useUsers()

  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
    columnFilters: [
      // username per-column text filter
      { columnId: 'userName', searchKey: 'userName', type: 'string' },
      // { columnId: 'email', searchKey: 'Email', type: 'string' },
      // { columnId: 'status', searchKey: 'status', type: 'array' },
      { columnId: 'role', searchKey: 'role', type: 'array' },
    ],
  })

  const { data: users, refetch } = useQuery({
    queryKey: [
      'users',
      pagination.pageSize,
      pagination.pageIndex,
      columnFilters,
      sorting,
    ],
    queryFn: async () => {
      // 第二个参数是查询函数
      const res = await getPaginationUsersEndpoint({
        query: {
          pageSize: pagination.pageSize,
          pageIndex: pagination.pageIndex + 1,
          search: columnFilters.find((c) => c.id === 'userName')
            ?.value as string,
          sort: sorting
            .map((s) => `${s.id} ${s.desc ? 'desc' : 'asc'}`)
            ?.join(', '),
          roles: columnFilters.find((c) => c.id === 'role')?.value as string[],
        },
      })
      return res.data
    },
  })

  const { data: roles, isSuccess } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await getRolesEndpoint({
        query: {
          isActive: true,
        },
      })
      return res.data
    },
  })

  useEffect(() => {
    if (open === null) {
      refetch()
    }
  }, [open, refetch])

  useEffect(() => {
    if (isSuccess) setRoles(roles!.items)
  }, [roles, setRoles, isSuccess])

  const table = useReactTable({
    data: users?.items ?? [],
    columns,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
    manualPagination: true,
    rowCount: users?.totalCount || 0,
    pageCount: users?.totalPages || 0,
    onPaginationChange,

    manualFiltering: true,

    manualSorting: true,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    enableRowSelection: true,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  useEffect(() => {
    ensurePageInRange(table.getPageCount())
  }, [table, ensurePageInRange])

  return (
    <div className='space-y-4 max-sm:has-[div[role="toolbar"]]:mb-16'>
      <DataTableToolbar
        table={table}
        searchKey={'userName'}
        searchPlaceholder='搜索用户名...'
        filters={[
          {
            columnId: 'role',
            title: '角色',
            options: roless!.map((role) => ({
              value: role.id,
              label: role.name,
            })),
          },
        ]}
      />
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        header.column.columnDef.meta?.className ?? ''
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='group/row'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        cell.column.columnDef.meta?.className ?? ''
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      <DataTableBulkActions table={table} />
    </div>
  )
}
