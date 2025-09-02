<template>
  <v-container>
    <!-- Formulario en la parte superior -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-6" elevation="4">
          <v-card-title class="text-h5 text-center mb-4">
            Registro de Usuario
          </v-card-title>

          <v-form @submit.prevent="submitForm">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.name"
                  class="mb-3"
                  clearable
                  :error-messages="nameError"
                  label="Nombre"
                  variant="outlined"
                  @blur="validateField('name')"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.lastName"
                  class="mb-3"
                  clearable
                  :error-messages="lastNameError"
                  label="Apellidos"
                  variant="outlined"
                  @blur="validateField('lastName')"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.age"
                  class="mb-3"
                  :error-messages="ageError"
                  label="Edad"
                  max="120"
                  min="0"
                  type="number"
                  variant="outlined"
                  @blur="validateField('age')"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="formData.sex"
                  class="mb-3"
                  clearable
                  :error-messages="sexError"
                  :items="genderOptions"
                  label="Sexo"
                  variant="outlined"
                  @blur="validateField('sex')"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.email"
                  class="mb-3"
                  clearable
                  :error-messages="emailError"
                  label="Correo electrónico"
                  type="email"
                  variant="outlined"
                  @blur="validateField('email')"
                />
              </v-col>
            </v-row>

            <v-row class="mt-4">
              <v-col class="text-center" cols="12">
                <v-btn
                  class="me-4"
                  color="primary"
                  :loading="loading"
                  size="large"
                  type="submit"
                >
                  Registrar
                </v-btn>
                <v-btn
                  color="secondary"
                  size="large"
                  @click="resetForm"
                >
                  Limpiar
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabla y estadísticas -->
    <v-row class="mt-6">
      <!-- Tabla de usuarios a la izquierda -->
      <v-col cols="12" lg="8">
        <v-card class="pa-4" elevation="4">
          <v-card-title class="text-h5 text-center mb-4">
            Usuarios Registrados
          </v-card-title>

          <v-card-text>
            <div v-if="loadingUsers" class="text-center">
              <v-progress-circular color="primary" indeterminate />
              <p class="mt-2">Cargando usuarios...</p>
            </div>

            <div v-else-if="users.length === 0" class="text-center text-grey">
              <v-icon color="grey-lighten-1" size="64">mdi-account-multiple</v-icon>
              <p>No hay usuarios registrados</p>
            </div>

            <v-table v-else density="comfortable">
              <thead>
                <tr>
                  <th class="text-left">Nombre</th>
                  <th class="text-left hide-on-mobile">Apellidos</th>
                  <th class="text-left hide-on-mobile">Edad</th>
                  <th class="text-left">Sexo</th>
                  <th class="text-left">Email</th>
                  <th class="text-left">Nacionalidad</th>
                  <th class="text-left">Acciones</th>

                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id" class="user-row">
                  <td>{{ user.name }}</td>
                  <td class="hide-on-mobile">{{ user.lastName }}</td>
                  <td class="hide-on-mobile">{{ user.age }}</td>
                  <td>
                    <v-chip
                      :color="getSexColor(user.sex)"
                      size="small"
                      variant="outlined"
                    >
                      {{ getSexLabel(user.sex) }}
                    </v-chip>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span v-if="userNationalities[user.id]">
                      {{ userNationalities[user.id].country_id }}
                      ({{ (userNationalities[user.id].probability * 100).toFixed(1) }}%)
                    </span>
                    <span v-else class="text-grey">Cargando...</span>
                  </td>
                  <td>
                    <v-btn
                      color="error"
                      icon
                      size="small"
                      @click="deleteUser(user.id)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Estadísticas a la derecha -->
      <v-col cols="12" lg="4">
        <v-card class="pa-4" elevation="4">
          <v-card-title class="text-h5 text-center mb-4">
            Estadísticas
          </v-card-title>

          <v-card-text>
            <div v-if="users.length === 0" class="text-center text-grey">
              <p>No hay datos para mostrar</p>
            </div>

            <div v-else>
              <!-- Edad promedio -->
              <v-card class="mb-4" variant="outlined">
                <v-card-text class="text-center">
                  <div class="text-h6 text-primary">Edad Promedio</div>
                  <div class="text-h4">{{ averageAge }}</div>
                  <div class="text-caption">años</div>
                </v-card-text>
              </v-card>

              <!-- Cantidad por sexo -->
              <v-card class="mb-4" variant="outlined">
                <v-card-text>
                  <div class="text-h6 text-center text-primary mb-3">Personas por Sexo</div>
                  <v-list density="compact">
                    <v-list-item v-for="(count, sex) in usersBySex" :key="sex">
                      <template #prepend>
                        <v-avatar :color="getSexColor(sex)" size="25">
                          <span class="text-white text-caption">{{ count }}</span>
                        </v-avatar>
                      </template>
                      <v-list-item-title>{{ getSexLabel(sex) }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>

              <!-- Persona más joven y mayor -->
              <v-row>
                <v-col cols="6">
                  <v-card height="100%" variant="outlined">
                    <v-card-text class="text-center">
                      <div class="text-subtitle-2 text-success">Más Joven</div>
                      <div class="text-h6">{{ youngestUser?.name }}</div>
                      <div class="text-caption">{{ youngestUser?.age }} años</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card height="100%" variant="outlined">
                    <v-card-text class="text-center">
                      <div class="text-subtitle-2 text-orange">Mayor Edad</div>
                      <div class="text-h6">{{ oldestUser?.name }}</div>
                      <div class="text-caption">{{ oldestUser?.age }} años</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Total de usuarios -->
              <v-card class="mt-4" variant="outlined">
                <v-card-text class="text-center">
                  <div class="text-subtitle-2">Total de Usuarios</div>
                  <div class="text-h4 text-indigo">{{ users.length }}</div>
                </v-card-text>
              </v-card>
              <v-card v-if="formData.name && nationality" class="mt-4" variant="outlined">
                <v-card-text class="text-center">
                  <div class="text-subtitle-2">Nacionalidad probable para "{{ formData.name }}"</div>
                  <div class="text-h6 text-deep-purple">{{ nationality.country_name }}</div>
                  <div class="text-caption">Probabilidad: {{ (nationality.probability * 100).toFixed(1) }}%</div>
                </v-card-text>
              </v-card>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar para mensajes -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>

    <!-- Dialogo de confirmación para eliminar -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que quieres eliminar este usuario?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="deleteDialog = false">
            Cancelar
          </v-btn>
          <v-btn color="error" :loading="deleting" variant="flat" @click="confirmDelete">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
  import { useField } from 'vee-validate'
  import { computed, onMounted, reactive, ref, watch } from 'vue'
  import apiTokens from '@/axios/axiosToken'

  // Datos del formulario
  const formData = reactive({
    name: '',
    lastName: '',
    age: '',
    sex: '',
    email: '',
  })

  // Estado de validación
  const touchedFields = reactive({
    name: false,
    lastName: false,
    age: false,
    sex: false,
    email: false,
  })

  // Lista de usuarios
  const users = ref([])
  const loadingUsers = ref(false)
  const userNationalities = ref({})
  // Estados para eliminación
  const deleteDialog = ref(false)
  const deleting = ref(false)
  const userToDelete = ref(null)
  const nationality = ref(null)

  // Configurar campos con useField
  const { value: nameValue, errorMessage: nameError } = useField('name', validateName)
  const { value: lastNameValue, errorMessage: lastNameError } = useField('lastName', validateLastName)
  const { value: ageValue, errorMessage: ageError } = useField('age', validateAge)
  const { value: sexValue, errorMessage: sexError } = useField('sex', validateSex)
  const { value: emailValue, errorMessage: emailError } = useField('email', validateEmail)

  // Sincronizar valores con formData
  nameValue.value = formData.name
  lastNameValue.value = formData.lastName
  ageValue.value = formData.age
  sexValue.value = formData.sex
  emailValue.value = formData.email

  // Funciones de validación
  function validateName (value) {
    if (!value) return 'El nombre es obligatorio'
    if (value.length > 255) return 'El nombre no puede exceder 255 caracteres'
    return true
  }

  function validateLastName (value) {
    if (!value) return 'Los apellidos son obligatorios'
    if (value.length > 255) return 'Los apellidos no pueden exceder 255 caracteres'
    return true
  }

  function validateAge (value) {
    if (!value) return 'La edad es obligatoria'
    const age = Number(value)
    if (age < 0) return 'La edad debe ser mayor o igual a 0'
    if (age > 120) return 'La edad no puede ser mayor a 120'
    if (!Number.isInteger(age)) return 'La edad debe ser un número entero'
    return true
  }

  function validateSex (value) {
    if (!value) return 'El sexo es obligatorio'
    return true
  }

  function validateEmail (value) {
    if (!value) return 'El correo electrónico es obligatorio'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return 'Debe ser un correo electrónico válido'
    return true
  }

  // Estado del componente
  const loading = ref(false)
  const snackbar = reactive({
    show: false,
    message: '',
    color: 'success',
  })

  // Opciones para el select de sexo
  const genderOptions = [
    { title: 'Masculino', value: 'male' },
    { title: 'Femenino', value: 'female' },
    { title: 'Otro', value: 'other' },
  ]

  // Computed properties para estadísticas
  const averageAge = computed(() => {
    if (users.value.length === 0) return 0
    const total = users.value.reduce((sum, user) => sum + user.age, 0)
    return Math.round(total / users.value.length)
  })

  const usersBySex = computed(() => {
    const counts = {}
    for (const user of users.value) {
      counts[user.sex] = (counts[user.sex] || 0) + 1
    }
    return counts
  })

  const youngestUser = computed(() => {
    if (users.value.length === 0) return null
    return users.value.reduce((youngest, user) =>
      user.age < youngest.age ? user : youngest,
    )
  })

  const oldestUser = computed(() => {
    if (users.value.length === 0) return null
    return users.value.reduce((oldest, user) =>
      user.age > oldest.age ? user : oldest,
    )
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
          fetchUserNationality(user.id, user.name)
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
  const getSexLabel = sex => {
    const options = {
      male: 'Masculino',
      female: 'Femenino',
      other: 'Otro',
    }
    return options[sex] || sex
  }

  // Función para color del chip de sexo
  const getSexColor = sex => {
    const colors = {
      male: 'blue',
      female: 'pink',
      other: 'green',
    }
    return colors[sex] || 'grey'
  }

  // Watchers para sincronizar valores
  watch(() => formData.name, newVal => {
    nameValue.value = newVal
    if (touchedFields.name) validateField('name')
  })

  watch(() => formData.lastName, newVal => {
    lastNameValue.value = newVal
    if (touchedFields.lastName) validateField('lastName')
  })

  watch(() => formData.age, newVal => {
    ageValue.value = newVal
    if (touchedFields.age) validateField('age')
  })

  watch(() => formData.sex, newVal => {
    sexValue.value = newVal
    if (touchedFields.sex) validateField('sex')
  })

  watch(() => formData.email, newVal => {
    emailValue.value = newVal
    if (touchedFields.email) validateField('email')
  })

  // Función para validar campo individual
  const validateField = fieldName => {
    touchedFields[fieldName] = true
  }

  const fetchUserNationality = async (userId, userName) => {
    try {
      const response = await fetch(`https://api.nationalize.io/?name=${encodeURIComponent(userName)}`)
      const data = await response.json()

      if (data.country && data.country.length > 0) {
        const highestProb = data.country.reduce((max, current) =>
          current.probability > max.probability ? current : max,
        )

        // Actualizar reactivamente
        userNationalities.value = {
          ...userNationalities.value,
          [userId]: {
            country_id: highestProb.country_id,
            probability: highestProb.probability,
          },
        }
      }
    } catch (error) {
      console.error('Error al obtener nacionalidad:', error)
    }
  }
  // Función para validar todo el formulario
  const validateForm = () => {
    for (const field of Object.keys(touchedFields)) {
      touchedFields[field] = true
    }

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
  const deleteUser = id => {
    userToDelete.value = id
    deleteDialog.value = true
  }

  const confirmDelete = async () => {
    if (!userToDelete.value) return

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
      userToDelete.value = null
    }
  }

  // Función para resetear el formulario
  const resetForm = () => {
    formData.name = ''
    formData.lastName = ''
    formData.age = ''
    formData.sex = ''
    formData.email = ''

    for (const field of Object.keys(touchedFields)) {
      touchedFields[field] = false
    }
  }

  // Función para mostrar mensajes
  const showSnackbar = (message, color = 'success') => {
    snackbar.message = message
    snackbar.color = color
    snackbar.show = true
  }

  // Cargar usuarios al montar el componente
  onMounted(getUsers)
</script>

<style scoped>
.user-row:hover {
  background-color: #f5f5f5;
}

.v-card {
  border-radius: 12px;
}

.v-text-field, .v-select {
  border-radius: 8px;
}
.user-row:hover {
  background-color: #f5f5f5;
}

.v-card {
  border-radius: 12px;
}

.v-text-field, .v-select {
  border-radius: 8px;
}

/* Ocultar columnas Apellidos y Edad en pantallas menores de 600px */
@media (max-width: 600px) {
  .hide-on-mobile {
    display: none;
  }
}
</style>
