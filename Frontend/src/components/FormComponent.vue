<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="6" md="8">
        <v-card class="pa-6" elevation="4">
          <v-card-title class="text-h5 text-center mb-4">
            Registro de Usuario
          </v-card-title>

          <v-form @submit.prevent="submitForm">
            <!-- Campo Nombre -->
            <v-text-field
              v-model="formData.name"
              class="mb-3"
              clearable
              :error-messages="nameError"
              label="Nombre"
              variant="outlined"
              @blur="validateField('name')"
            />

            <!-- Campo Apellidos -->
            <v-text-field
              v-model="formData.lastName"
              class="mb-3"
              clearable
              :error-messages="lastNameError"
              label="Apellidos"
              variant="outlined"
              @blur="validateField('lastName')"
            />

            <!-- Campo Edad -->
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

            <!-- Campo Sexo -->
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

            <!-- Campo Correo -->
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

            <!-- Botones -->
            <v-row class="mt-4">
              <v-col cols="6">
                <v-btn
                  block
                  color="primary"
                  :loading="loading"
                  size="large"
                  type="submit"
                >
                  Registrar
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  block
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

    <!-- Snackbar para mensajes -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
  import { useField } from 'vee-validate'
  import { computed, reactive, ref } from 'vue'
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

  // Configurar campos con useField (sin reglas predefinidas)
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

  // Funciones de validación personalizadas
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
    { title: 'Masculino', value: 1 },
    { title: 'Femenino', value: 0 },
  ]

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

    switch (fieldName) {
      case 'name': {
        nameValue.value = formData.name
        break
      }
      case 'lastName': {
        lastNameValue.value = formData.lastName
        break
      }
      case 'age': {
        ageValue.value = formData.age
        break
      }
      case 'sex': {
        sexValue.value = formData.sex
        break
      }
      case 'email': {
        emailValue.value = formData.email
        break
      }
    }
  }

  // Función para validar todo el formulario
  const validateForm = () => {
    for (const field of Object.keys(touchedFields)) {
      touchedFields[field] = true
      validateField(field)
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
      // Aquí iría la llamada a tu API
      const response = await apiTokens.post('/people', {
        name: formData.name,
        lastName: formData.lastName,
        age: Number(formData.age),
        sex: formData.sex,
        email: formData.email,
      })
      console.log('send')
      resetForm()
    } catch (error) {
      console.error('Error:', error)
      showSnackbar('Error al registrar usuario', 'error')
    } finally {
      loading.value = false
    }
  }

  // Función para resetear el formulario
  const resetForm = () => {
    formData.name = ''
    formData.lastName = ''
    formData.age = ''
    formData.sex = ''
    formData.email = ''

    // Resetear estados de validación
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
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}

.v-text-field, .v-select {
  border-radius: 8px;
}
</style>
