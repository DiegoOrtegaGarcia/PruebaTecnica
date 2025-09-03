import type { PeopleData, SexOptions, FormData } from '@/types/types'
import { useField, useForm } from 'vee-validate'
import { computed, onMounted, reactive, ref } from 'vue'
import { orderAge } from '@/helpers/orderByAge'
import { getUSerHelper } from '@/helpers/Api/getUserHelper'
import { createUser } from '@/helpers/Api/createUser'
import { deleteUserHelper } from '@/helpers/Api/deleteUser'
import { fetchUserNationality } from '@/helpers/Api/externa/fetchNationality'

export const useFormComponent = () => {
  // Esquema de validación
  const validationSchema = {
    name: (value: string) => {
      if (value?.length >= 5) return true
      return 'El nombre debe tener al menos 5 caracteres'
    },
    lastName: (value: string) => {
      if (value?.length >= 5) return true
      return 'El apellido debe tener al menos 5 caracteres'
    },
    age: (value: string) => {
      const age = Number(value)
      if (!value) return 'La edad es obligatoria'
      if (isNaN(age)) return 'La edad debe ser un número válido'
      if (age < 0) return 'La edad no puede ser negativa'
      if (age > 120) return 'La edad no puede ser mayor a 120'
      if (!Number.isInteger(age)) return 'La edad debe ser un número entero'
      return true
    },
    sex: (value: string) => {
      if (value) return true
      return 'El sexo es obligatorio'
    },
    email: (value: string) => {
      if (!value) return 'El correo electrónico es obligatorio'
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) return 'Debe ser un correo electrónico válido'
      return true
    }
  }

  // Configuración de useForm
  const { handleSubmit, resetForm: resetVeeForm } = useForm<FormData>({
    validationSchema,
  })

  const users = ref<PeopleData[]>([])
  const loadingUsers = ref(false)
  const userNationalities = ref<Record<string, { country_id: string; probability: number }>>({})
  const deleteDialog = ref(false)
  const deleting = ref(false)
  const userToDelete = ref<number>(0)
  const nationality = ref<{ country_name: string; probability: number } | null>(null)
  const loading = ref(false)

  // Campos con validaciones automáticas del schema
  const name = useField<string>('name')
  const lastName = useField<string>('lastName')
  const age = useField<string>('age')
  const sex = useField<string>('sex')
  const email = useField<string>('email')

  const snackbar = reactive({
    show: false,
    message: '',
    color: 'success',
  })


  // Computed properties
  const averageAge = computed(() => {
    if (users.value.length === 0) return 0
    const total = users.value.reduce((sum, user) => sum + Number(user.age), 0)
    return Math.round(total / users.value.length)
  })

  const usersBySex = computed(() => {
    const counts: Record<string, number> = {}
    for (const user of users.value) {
      counts[user.sex] = (counts[user.sex] || 0) + 1
    }
    return counts
  })

  const youngestUser = computed(() => {
    return orderAge(users)[0]
  })

  const oldestUser = computed(() => {
    const sorted = orderAge(users)
    return sorted[sorted.length - 1]
  })

  // Función para resetear el formulario
  const resetForm = () => {
    resetVeeForm()
    nationality.value = null
  }

  const getUsers = async () => {
    loadingUsers.value = true
    try {
      users.value = await getUSerHelper()
      for (const user of users.value) {
        if (user.name && user.name.length > 2) {       
          fetchUserNationality(user.id, user.name,userNationalities)
        }
      }
    } catch (error) {
      showSnackbar('Error al cargar usuarios', 'error')
    } finally {
      loadingUsers.value = false
    }
  }

  const submitForm = handleSubmit(async (values) => {
    loading.value = true
    try {
      const user = await createUser(values)
      fetchUserNationality(user.id, user.name,userNationalities)
      users.value.push(user)
      showSnackbar('Usuario registrado correctamente', 'success')
      resetForm()
    } catch (error) {
      showSnackbar('Error al registrar usuario', 'error')
    } finally {
      loading.value = false
    }
  })

  // Funciones de eliminación
  const deleteUser = (id: number) => {
    userToDelete.value = id
    deleteDialog.value = true
  }

  const confirmDelete = async () => {
    deleting.value = true
    try {
      deleteUserHelper(userToDelete.value)
      users.value = users.value.filter(user => user.id !== userToDelete.value)
      showSnackbar('Usuario eliminado correctamente', 'success')
    } catch (error) {
      showSnackbar('Error al eliminar usuario', 'error')
    } finally {
      deleting.value = false
      deleteDialog.value = false
      userToDelete.value = 0
    }
  }

  const showSnackbar = (message: string, color = 'success') => {
    snackbar.message = message
    snackbar.color = color
    snackbar.show = true
  }

  onMounted(getUsers)

  return {
    submitForm,loading,loadingUsers,users,userNationalities,deleteUser,averageAge,usersBySex,youngestUser,snackbar,deleteDialog,deleting,confirmDelete,nationality,oldestUser,name,lastName,email,sex,age,resetForm,
  }
}