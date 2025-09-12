'use client'

import { useRef } from 'react'
import { type UserDto } from '@/api'
import { useReactToPrint } from 'react-to-print'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import UserPrint from '@/features/users/components/user-print.tsx'

type UsersPrintDialogProps = {
  currentRow?: UserDto
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserPrintDialog({
  currentRow,
  open,
  onOpenChange,
}: UsersPrintDialogProps) {
  const contentRef = useRef(null)
  const handlePrint = useReactToPrint({
    contentRef,
  })
  const handleClick = () => {
    handlePrint()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>打印用户</DialogTitle>
          <DialogDescription>
            '在这里打印用户信息. ' 完成后点击打印按钮.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <UserPrint ref={contentRef} currentRow={currentRow} />
        </div>
        <DialogFooter>
          <Button onClick={handleClick}>打印</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
