import { useRouter } from 'vue-router'

export function useRouterHelper () {
  const router = useRouter()

  const redirectTo = (path: string) => {
    router.push(path)
  }

  return {
    redirectTo,
  }
}
