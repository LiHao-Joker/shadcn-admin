import CategoriesActionDialog from '@/features/categories/components/categories-action-dialog.tsx'
import { CategoriesDeleteDialog } from '@/features/categories/components/categories-delete-dialog.tsx'
import { useCategories } from '@/features/categories/components/categories-provider.tsx'
import { CategoriesStatusDialog } from '@/features/categories/components/categories-status-dialog.tsx'

function CategoriesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCategories()
  return (
    <>
      <CategoriesActionDialog
        key='category-add'
        open={open === 'add'}
        onOpenChange={() => {
          setOpen('add')
        }}
      ></CategoriesActionDialog>

      {currentRow && (
        <>
          <CategoriesActionDialog
            key={`category-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          ></CategoriesActionDialog>

          <CategoriesDeleteDialog
            key={`category-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          ></CategoriesDeleteDialog>

          <CategoriesStatusDialog
            key={`category-status-${currentRow.id}`}
            open={open === 'status'}
            onOpenChange={() => {
              setOpen('status')
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

export default CategoriesDialogs
