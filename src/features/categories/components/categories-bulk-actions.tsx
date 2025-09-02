import { type Table } from '@tanstack/react-table'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function CategoriesBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  return (
    <>
      <BulkActionsToolbar
        table={table}
        entityName='分类'
        children={undefined}
      ></BulkActionsToolbar>
    </>
  )
}
