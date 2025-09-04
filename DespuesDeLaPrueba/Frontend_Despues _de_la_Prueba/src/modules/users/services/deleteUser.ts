import apiTokens from "@/core/axios/axiosToken"

export const  deleteUserHelper = async(id: number) =>{
  try {
    await apiTokens.delete(`/people/${id}`)
  } catch{
    throw new Error("Error")
  }
}
