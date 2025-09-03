import type { PeopleData } from '@/types/types'

export const orderAge = (users: Ref<PeopleData[]>) => {
  return [...users.value].sort((a, b) => {
    return Number(a.age) - Number(b.age)
  })
}
