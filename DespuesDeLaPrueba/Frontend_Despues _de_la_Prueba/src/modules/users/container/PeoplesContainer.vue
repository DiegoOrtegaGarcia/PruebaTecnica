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
                  v-model="name.value.value"
                  class="mb-3"
                  clearable
                  :error-messages="name.errorMessage.value"
                  label="Nombre"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="lastName.value.value"
                  class="mb-3"
                  clearable
                  :error-messages="lastName.errorMessage.value"
                  label="Apellidos"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="age.value.value"
                  class="mb-3"
                  :error-messages="age.errorMessage.value"
                  label="Edad"
                  max="120"
                  min="0"
                  type="number"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="sex.value.value"
                  class="mb-3"
                  clearable
                  :error-messages="sex.errorMessage.value"
                  :items="genderOptions"
                  label="Sexo"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="email.value.value"
                  class="mb-3"
                  clearable
                  :error-messages="email.errorMessage.value"
                  label="Correo electrónico"
                  type="email"
                  variant="outlined"
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
                <UsersComponent
                  v-for="user in users"
                  :key="user.id"
                  :get-sex-color="getSexColor"
                  :get-sex-label="getSexLabel"
                  :on-delete-user="deleteUser"
                  :user="user"
                  :user-nationalities="userNationalities"
                />
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
              <v-card v-if="name.value.value && nationality" class="mt-4" variant="outlined">
                <v-card-text class="text-center">
                  <div class="text-subtitle-2">Nacionalidad probable para "{{ name.value.value }}"</div>
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
  import { usePeopleComponent } from '@/modules/users/hooks/usePeopleComponent'
  import { genderOptions } from '@/core/constants/constants'
  import{getSexColor,getSexLabel} from "@/core/utils/getSexnfo"
import UsersComponent from '../components/UsersComponent.vue'
  const {submitForm,loading, resetForm, loadingUsers, users, userNationalities, deleteUser, averageAge,usersBySex, youngestUser, snackbar, deleteDialog, deleting, confirmDelete,nationality, oldestUser, name, lastName, email, sex, age
} = usePeopleComponent()

</script>

<style>
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
