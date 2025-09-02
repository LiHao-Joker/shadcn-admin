import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer.tsx'
import { Header } from '@/components/layout/header.tsx'
import { Main } from '@/components/layout/main.tsx'
import { ProfileDropdown } from '@/components/profile-dropdown.tsx'
import { Search } from '@/components/search.tsx'
import { ThemeSwitch } from '@/components/theme-switch.tsx'
import CategoriesDialogs from '@/features/categories/components/categories-dialogs.tsx'
import { CategoriesProvider } from '@/features/categories/components/categories-provider.tsx'
import CategoriesTable from '@/features/categories/components/categories-table.tsx'
import { CategoriesPrimaryButtons } from '@/features/categories/components/category-primary-buttons.tsx'

const route = getRouteApi('/_authenticated/categories/')

function Categories() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  return (
    <CategoriesProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>分类列表</h2>
            <p className='text-muted-foreground'>在此管理您的分类。</p>
          </div>
          <CategoriesPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <CategoriesTable search={search} navigate={navigate} />
        </div>
      </Main>
      <CategoriesDialogs />
    </CategoriesProvider>
  )
}

export default Categories
