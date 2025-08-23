import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store.ts'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: ({ location }) => {
    const isAuthenticated = useAuthStore.getState().auth.isAuthenticated
    if (!isAuthenticated()) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.href,
        },
      })
    }
  },
})
