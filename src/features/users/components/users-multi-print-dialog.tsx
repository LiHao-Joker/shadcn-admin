'use client'

import { useRef } from 'react'
import { type Table } from '@tanstack/react-table'
import { type UserDto } from '@/api'
import { AlertTriangle } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import UserPrint from '@/features/users/components/user-print.tsx'

type UserMultiPrintDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function UsersMultiPrintDialog<TData>({
  open,
  onOpenChange,
  table,
}: UserMultiPrintDialogProps<TData>) {
  const contentRef = useRef(null)

  const handlePrint = useReactToPrint({
    contentRef,
    onPrintError: (_, error) => {
      toast.error(error.message)
    },
  })

  const handleClick = () => {
    handlePrint()
    onOpenChange(false)
  }

  const selectedRows = table.getFilteredSelectedRowModel().rows

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleClick}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          打印数量 {selectedRows.length}{' '}
        </span>
      }
      desc={
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <p className='mb-2'>
            您确定要打印选中的用户吗？
            <br />
            此操作无法撤销。
          </p>
          <div ref={contentRef}>
            {selectedRows.map((row, index) => (
              <div key={index} className='print:break-before-page'>
                <UserPrint currentRow={row.original as UserDto} />
              </div>
            ))}
          </div>
        </div>
      }
      confirmText='打印'
      cancelBtnText='取消'
      destructive
    />
  )
}
