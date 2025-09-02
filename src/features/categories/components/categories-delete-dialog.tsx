'use client'

import { useMutation } from '@tanstack/react-query'
import { deleteCategoryEndpoint, type CategoryDto } from '@/api'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'

type CategoryDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: CategoryDto
}

export function CategoriesDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: CategoryDeleteDialogProps) {
  const { mutateAsync: deleteCategory } = useMutation({
    mutationFn: async () => {
      await deleteCategoryEndpoint({
        path: {
          id: currentRow.id,
        },
      })
    },
  })

  const handleDelete = async () => {
    await deleteCategory()
    onOpenChange(false)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          删除分类
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            您确定要删除分类
            <span className='font-bold'>{currentRow.name}</span> 吗？
          </p>

          <Alert variant='destructive'>
            <AlertTitle>警告！</AlertTitle>
            <AlertDescription>
              请谨慎操作，此操作一旦执行将无法回滚。
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='删除'
      cancelBtnText='取消'
      destructive
    />
  )
}
