import type { PeopleData,FormData } from "@/types/types"
import apiTokens from "@/axios/axiosToken"

export const createUser = async (values: FormData) => {
  try{
    const response = await apiTokens.post('/people', {
        name: values.name,
        lastName: values.lastName,
        age: Number(values.age),
        sex: values.sex,
        email: values.email,
      })
      return response.data.user as PeopleData
  }catch{
    throw new Error("Error")
  }
}