import apiTokens from "@/axios/axiosToken"

export const getUSerHelper = async () =>{
  try{
    const response = await apiTokens.get('/people')
    return response.data.data || response.data
  }catch{
    throw new Error("Error")
  }
}