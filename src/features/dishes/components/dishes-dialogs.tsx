import { useDishes } from '@/features/dishes/components/dishes-provider.tsx'
import { DishesActionDialog } from './dishes-action-dialog'

function DishesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDishes()
  return (
    <>
      <DishesActionDialog
        key='dish-add'
        open={open === 'add'}
        onOpenChange={() => {
          setOpen('add')
        }}
      ></DishesActionDialog>

      {currentRow && (
        <>
          <DishesActionDialog
            key={`dish-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          ></DishesActionDialog>

          {/*    <CategoriesDeleteDialog*/}
          {/*      key={`category-delete-${currentRow.id}`}*/}
          {/*      open={open === 'delete'}*/}
          {/*      onOpenChange={() => {*/}
          {/*        setOpen('delete')*/}
          {/*        setTimeout(() => {*/}
          {/*          setCurrentRow(null)*/}
          {/*        }, 500)*/}
          {/*      }}*/}
          {/*      currentRow={currentRow}*/}
          {/*    ></CategoriesDeleteDialog>*/}

          {/*    <CategoriesStatusDialog*/}
          {/*      key={`category-status-${currentRow.id}`}*/}
          {/*      open={open === 'status'}*/}
          {/*      onOpenChange={() => {*/}
          {/*        setOpen('status')*/}
          {/*        setTimeout(() => {*/}
          {/*          setCurrentRow(null)*/}
          {/*        }, 500)*/}
          {/*      }}*/}
          {/*      currentRow={currentRow}*/}
          {/*    />*/}
          {/*  </>*/}
          {/*)}*/}
        </>
      )}
    </>
  )
}

export default DishesDialogs
