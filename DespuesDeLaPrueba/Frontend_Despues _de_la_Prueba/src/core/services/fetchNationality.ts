export const fetchUserNationality = async (userId: string | number, userName: string,userNationalities : Ref<Record<string, { country_id: string; probability: number }>>) => {
    try {
      const response = await fetch(`https://api.nationalize.io/?name=${encodeURIComponent(userName)}`)
      const data = await response.json()

      userNationalities.value = {
        ...userNationalities.value,
        [userId]: {
          country_id: data.country[0]?.country_id || 'Unknown',
          probability: data.country[0]?.probability || 0,
        },
      }
    } catch (error) {
      console.error('Error al obtener nacionalidad:', error)
    }
  }
