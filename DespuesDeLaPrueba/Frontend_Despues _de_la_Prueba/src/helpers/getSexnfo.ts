import type { SexOptions } from "@/types/types"

export const getSexLabel = (sex: keyof SexOptions) => {
    const options: SexOptions = {
      male: 'Masculino',
      female: 'Femenino',
      other: 'Otro',
    }
    return options[sex] || sex
  }

export  const getSexColor = (sex: keyof SexOptions) => {
    const colors = {
      male: 'blue',
      female: 'pink',
      other: 'green',
    }
    return colors[sex] || 'grey'
  }