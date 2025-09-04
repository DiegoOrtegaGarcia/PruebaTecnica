import type { PeopleData } from "@/modules/users/types/peopleTypes"

export const orderAge = (users: Ref<PeopleData[]>) => {
  return [...users.value].sort((a, b) => {
    return Number(a.age) - Number(b.age)
  })
}
