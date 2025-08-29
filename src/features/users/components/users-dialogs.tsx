import { UsersDeleteDialog } from '@/features/users/components/users-delete-dialog.tsx'
import { useUsers } from '@/features/users/components/users-provider.tsx'
import UsersResetpasswordDialog from '@/features/users/components/users-resetpassword-dialog.tsx'
import { UsersStatusDialog } from '@/features/users/components/users-status-dialog.tsx'
import { UsersActionDialog } from './users-action-dialog'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers()
  return (
    <>
      <UsersActionDialog
        key='user-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            key={`user-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <UsersStatusDialog
            key={`user-status-${currentRow.id}`}
            open={open === 'status'}
            onOpenChange={() => {
              setOpen('status')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <UsersDeleteDialog
            key={`user-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
          <UsersResetpasswordDialog
            key={`user-resetpassword-${currentRow.id}`}
            open={open === 'resetpassword'}
            onOpenChange={() => {
              setOpen('resetpassword')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
