import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer.tsx'
import { Header } from '@/components/layout/header.tsx'
import { Main } from '@/components/layout/main.tsx'
import { ProfileDropdown } from '@/components/profile-dropdown.tsx'
import { Search } from '@/components/search.tsx'
import { ThemeSwitch } from '@/components/theme-switch.tsx'
import { DishPrimaryButtons } from '@/features/dishes/components/dish-primary-buttons.tsx'
import DishesDialogs from '@/features/dishes/components/dishes-dialogs.tsx'
import { DishesProvider } from '@/features/dishes/components/dishes-provider.tsx'
import DishesTable from '@/features/dishes/components/dishes-table.tsx'

const route = getRouteApi('/_authenticated/dishes/')

function Dishes() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  return (
    <DishesProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>菜品列表</h2>
            <p className='text-muted-foreground'>在此管理您的菜品。</p>
          </div>
          <DishPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DishesTable search={search} navigate={navigate} />
        </div>
      </Main>
      <DishesDialogs />
    </DishesProvider>
  )
}

export default Dishes
