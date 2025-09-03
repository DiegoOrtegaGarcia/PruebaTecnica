import type { FormFielStatus, PeopleData, SexOptions } from '@/types/types'
import { useField } from 'vee-validate'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import apiTokens from '@/axios/axiosToken'
import { validateAge, validateEmail, validateStringField } from '@/helpers/formValidations'
import { orderAge } from '@/helpers/orderByAge'

export const useFormCoponent = () => {
  const formData = reactive<PeopleData>({
    id: 0,
    name: '',
    lastName: '',
    age: '',
    sex: '',
    email: '',
  })

  const touchedFields = reactive<FormFielStatus>({
    name: false,
    lastName: false,
    age: false,
    sex: false,
    email: false,
  })

  const users = ref<PeopleData[]>([])
  const loadingUsers = ref(false)
  const userNationalities = ref({})
  const deleteDialog = ref(false)
  const deleting = ref(false)
  const userToDelete = ref<number>()
  const nationality = ref(null)
  const loading = ref(false)

  const { value: nameValue, errorMessage: nameError } = useField('name', validateStringField)
  const { value: lastNameValue, errorMessage: lastNameError } = useField('lastName', validateStringField)
  const { value: ageValue, errorMessage: ageError } = useField('age', validateAge)
  const { value: sexValue, errorMessage: sexError } = useField('sex', validateStringField)
  const { value: emailValue, errorMessage: emailError } = useField('email', validateEmail)

  nameValue.value = formData.name
  lastNameValue.value = formData.lastName
  ageValue.value = formData.age
  sexValue.value = formData.sex
  emailValue.value = formData.email

  const snackbar = reactive({
    show: false,
    message: '',
    color: 'success',
  })

  const genderOptions = [
    { title: 'Masculino', value: 'male' },
    { title: 'Femenino', value: 'female' },
    { title: 'Otro', value: 'other' },
  ]

  const averageAge = computed(() => {
    if (users.value.length === 0) {
      return 0
    }
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
    return orderAge(users)[0] // Primer elemento (más joven)
  })

  const oldestUser = computed(() => {
    return orderAge(users)[users.value.length - 1]// Último elemento (más viejo)
  })

  // Obtener usuarios
  const getUsers = async () => {
    loadingUsers.value = true
    try {
      const response = await apiTokens.get('/people')
      users.value = response.data.data || response.data

      // Cargar nacionalidades para cada usuario
      for (const user of users.value) {
        if (user.name && user.name.length > 2) {
          fetchUserNationality(user.email, user.name)
        }
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
      showSnackbar('Error al cargar usuarios', 'error')
    } finally {
      loadingUsers.value = false
    }
  }

  // Función para mostrar etiqueta del sexo
  const getSexLabel = (sex: keyof SexOptions) => {
    const options: SexOptions = {
      male: 'Masculino',
      female: 'Femenino',
      other: 'Otro',
    }
    return options[sex] || sex
  }

  // Función para color del chip de sexo
  const getSexColor = (sex: keyof SexOptions) => {
    const colors = {
      male: 'blue',
      female: 'pink',
      other: 'green',
    }
    return colors[sex] || 'grey'
  }

  // Función para validar campo individual
  const validateField = (fieldName: keyof FormFielStatus, value: boolean) => {
    touchedFields[fieldName] = value
  }

  const fetchUserNationality = async (userId: string, userName: string) => {
    try {
      const response = await fetch(`https://api.nationalize.io/?name=${encodeURIComponent(userName)}`)
      const data = await response.json()

      userNationalities.value = {
        ...userNationalities.value,
        [userId]: {
          country_id: data.country[0].country_id,
          probability: data.country[0].probability,
        },
      }
    } catch (error) {
      console.error('Error al obtener nacionalidad:', error)
    }
  }
  // Función para validar todo el formulario
  const validateForm = () => {
    return !nameError.value
      && !lastNameError.value
      && !ageError.value
      && !sexError.value
      && !emailError.value
  }

  // Función para enviar el formulario
  const submitForm = async () => {
    if (!validateForm()) {
      showSnackbar('Por favor, corrige los errores del formulario', 'error')
      return
    }

    loading.value = true

    try {
      const response = await apiTokens.post('/people', {
        name: formData.name,
        lastName: formData.lastName,
        age: Number(formData.age),
        sex: formData.sex,
        email: formData.email,
      })

      // Agregar el nuevo usuario a la lista de manera reactiva
      fetchUserNationality(response.data.user.id, response.data.user.name)
      users.value.push(response.data.user)

      showSnackbar('Usuario registrado correctamente', 'success')
      resetForm()
    } catch (error) {
      console.error('Error:', error)
      showSnackbar('Error al registrar usuario', 'error')
    } finally {
      loading.value = false
    }
  }

  // Función para eliminar usuario
  const deleteUser = (id: number) => {
    userToDelete.value = id
    deleteDialog.value = true
  }

  const confirmDelete = async () => {
    deleting.value = true
    try {
      await apiTokens.delete(`/people/${userToDelete.value}`)
      // Eliminar usuario de la lista de manera reactiva
      users.value = users.value.filter(user => user.id !== userToDelete.value)

      showSnackbar('Usuario eliminado correctamente', 'success')
    } catch (error) {
      console.error('Error al eliminar:', error)
      showSnackbar('Error al eliminar usuario', 'error')
    } finally {
      deleting.value = false
      deleteDialog.value = false
      userToDelete.value = 0
    }
  }

  // Función para resetear el formulario
  const resetForm = () => {
    formData.name = ''
    formData.lastName = ''
    formData.age = ''
    formData.sex = ''
    formData.email = ''

    for (const field of Object.keys(touchedFields) as (keyof FormFielStatus)[]) {
      validateField(field, false)
    }
  }

  // Función para mostrar mensajes
  const showSnackbar = (message: string, color = 'success') => {
    snackbar.message = message
    snackbar.color = color
    snackbar.show = true
  }

  // Cargar usuarios al montar el componente

  // Watchers para sincronizar valores
  watch(() => formData.name, newVal => {
    nameValue.value = newVal
    if (touchedFields.name) {
      validateField('name', true)
    }
  })

  watch(() => formData.lastName, newVal => {
    lastNameValue.value = newVal
    if (touchedFields.lastName) {
      validateField('lastName', true)
    }
  })

  watch(() => formData.age, newVal => {
    ageValue.value = newVal
    if (touchedFields.age) {
      validateField('age', true)
    }
  })

  watch(() => formData.sex, newVal => {
    sexValue.value = newVal
    if (touchedFields.sex) {
      validateField('sex', true)
    }
  })

  watch(() => formData.email, newVal => {
    emailValue.value = newVal
    if (touchedFields.email) {
      validateField('email', true)
    }
  })

  onMounted(getUsers)

  return {
    submitForm, formData, nameError, validateField, lastNameError, ageError, sexError, genderOptions, emailError, loading, resetForm, loadingUsers, users, getSexColor, getSexLabel, userNationalities, deleteUser, averageAge, usersBySex, youngestUser, snackbar, deleteDialog, deleting, confirmDelete, nationality, oldestUser,
  }
}
