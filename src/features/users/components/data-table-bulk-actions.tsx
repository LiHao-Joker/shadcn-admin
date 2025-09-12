import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Printer, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { UsersMultiPrintDialog } from '@/features/users/components/users-multi-print-dialog.tsx'
import { UsersMultiDeleteDialog } from './users-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showPrintConfirm, setShowPrintConfirm] = useState(false)
  // const selectedRows = table.getFilteredSelectedRowModel().rows

  return (
    <>
      <BulkActionsToolbar table={table} entityName='用户'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='删除选中的用户'
              title='删除选中的用户'
            >
              <Trash2 />
              <span className='sr-only'>删除选中的用户</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>删除选中的用户</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size='icon'
              onClick={() => setShowPrintConfirm(true)}
              className='size-8'
              aria-label='打印选中的用户'
              title='打印选中的用户'
            >
              <Printer />
              <span className='sr-only'>打印选中的用户</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>打印选中的用户</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <UsersMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />

      <UsersMultiPrintDialog
        table={table}
        open={showPrintConfirm}
        onOpenChange={setShowPrintConfirm}
      />
    </>
  )
}
