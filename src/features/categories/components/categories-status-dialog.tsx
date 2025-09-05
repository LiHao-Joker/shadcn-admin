import { useMutation } from '@tanstack/react-query'
import { type CategoryDto, patchCategoryEndpoint } from '@/api'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx'
import { ConfirmDialog } from '@/components/confirm-dialog.tsx'

type CategoryStatusDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: CategoryDto
}

export function CategoriesStatusDialog({
  open,
  onOpenChange,
  currentRow,
}: CategoryStatusDialogProps) {
  const { mutateAsync: changeStatus } = useMutation({
    mutationFn: async () => {
      await patchCategoryEndpoint({
        body: {
          patches: [
            {
              operationType: 'replace',
              op: 'replace',
              value: !currentRow.isActive,
              path: '/isActive',
            },
          ],
        },
        path: {
          id: currentRow.id,
        },
      })
    },
  })

  const handleChangeStatus = async () => {
    await changeStatus()
    onOpenChange(false)
  }

  return (
    <div>
      <ConfirmDialog
        open={open}
        onOpenChange={onOpenChange}
        handleConfirm={handleChangeStatus}
        title={
          <span className='text-destructive'>
            <AlertTriangle
              className='stroke-destructive me-1 inline-block'
              size={18}
            />{' '}
            改变分类状态
          </span>
        }
        desc={
          <div className='space-y-4'>
            <p className='mb-2'>
              您确定要{currentRow.isActive ? '禁用' : '启用'}分类
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
        confirmText='确定'
        cancelBtnText='取消'
        destructive
      ></ConfirmDialog>
    </div>
  )
}
