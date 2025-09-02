import { type ColumnDef } from '@tanstack/react-table'
import { type CategoryDto } from '@/api'
import { cn } from '@/lib/utils.ts'
import { Badge } from '@/components/ui/badge.tsx'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text.tsx'
import { CategoriesRowActions } from '@/features/categories/components/categories-row-actions.tsx'
import { callTypes, categoryTypes } from '@/features/categories/data/data.ts'

export const categoriesColunms: ColumnDef<CategoryDto>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn('sticky md:table-cell start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.columnDef.meta?.label}
      />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36 ps-3'>{row.getValue('name')}</LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
      label: '名称',
    },
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.columnDef.meta?.label}
      />
    ),
    cell: ({ row }) => {
      const { type } = row.original
      const categoryType = categoryTypes.find(({ value }) => value === type)

      if (!categoryType) {
        return null
      }

      return (
        <div className='flex items-center gap-x-2'>
          {categoryType.icon && (
            <categoryType.icon size={16} className='text-muted-foreground' />
          )}
          <span className='text-sm capitalize'>{categoryType.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    meta: {
      label: '种类',
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.columnDef.meta?.label}
      />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36 ps-3'>
        {row.getValue('description')}
      </LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
      label: '备注',
    },
    enableHiding: false,
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.columnDef.meta?.label}
      />
    ),
    meta: {
      label: '状态',
    },
    cell: ({ row }) => {
      const { isActive } = row.original
      const badgeColor = callTypes.get(isActive)
      return (
        <div className='flex space-x-2'>
          <Badge variant='outline' className={cn('capitalize', badgeColor)}>
            {row.getValue('isActive') ? '使用' : '禁用'}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableHiding: true,
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: CategoriesRowActions,
  },
]
