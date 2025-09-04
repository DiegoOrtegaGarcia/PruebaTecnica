<script setup lang="ts">
  import { useRegisterForm } from '@/modules/register/hooks/useRegisterForm'
  import { useAlerMessage } from '@/core/hooks/useAlertMessage'
  import { useRouterHelper } from '@/core/hooks/useRouterHelper'

  const { redirectTo } = useRouterHelper()
  const { isMessage, textMessage, alertMessage, finishMessage } = useAlerMessage('/products', redirectTo)
  const { name, password, email, isLoading, submit } = useRegisterForm(alertMessage, finishMessage)
  const showPassword = ref(false)

</script>

<template>
  <v-container class="fill-height register-container" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" lg="5" md="7" sm="10">
        <v-card class="register-card pa-8" elevation="12" rounded="xl">
          <div class="d-flex align-center mb-2">
            <v-btn
              color="primary"
              href="/"
              icon="mdi-arrow-left"
              size="large"
              variant="text"
            />
            <v-spacer />
          </div>

          <v-card-title class="text-center mb-6 px-0">
            <h2 class="text-h3 font-weight-bold text-primary">Create Account</h2>
            <p class="text-body-1 mt-2 text-medium-emphasis">
              Join us
            </p>
          </v-card-title>

          <v-form class="px-2" @submit.prevent="submit">
            <v-text-field
              v-model="name.value.value"
              class="mb-4"
              clearable
              color="primary"
              :error-messages="name.errorMessage.value"
              label="Full Name"
              prepend-inner-icon="mdi-account-outline"
              variant="outlined"
            />

            <v-text-field
              v-model="email.value.value"
              class="mb-4"
              clearable
              color="primary"
              :error-messages="email.errorMessage.value"
              label="Email Address"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
            />

            <v-text-field
              v-model="password.value.value"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              class="mb-2"
              color="primary"
              :error-messages="password.errorMessage.value"
              label="Password"
              prepend-inner-icon="mdi-lock-outline"
              :type="showPassword ? 'text' : 'password'"
              variant="outlined"
              @click:append-inner="showPassword = !showPassword"
            />
            <v-btn
              block
              class="mb-4"
              color="primary"
              :disabled="isLoading"
              :loading="isLoading"
              rounded="lg"
              size="x-large"
              type="submit"
              variant="elevated"
            >
              <span class="text-button">Create Account</span>
              <template #loader>
                <v-progress-circular
                  color="white"
                  indeterminate
                  size="24"
                />
              </template>
            </v-btn>

            <div class="text-center mt-4">
              <span class="text-body-2 text-medium-emphasis">Already have an account?</span>
              <v-btn
                class="ml-1"
                color="primary"
                href="/login"
                size="small"
                variant="text"
              >
                Sign In
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!-- Notification Dialog -->
    <v-dialog
      v-model="isMessage"
      max-width="500"
      persistent
    >
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon
            class="mr-2"
            :color="textMessage.status"
          >
            {{
              textMessage.status === 'success' ? 'mdi-check-circle' :
              textMessage.status === 'error' ? 'mdi-alert-circle' :
              'mdi-information'
            }}
          </v-icon>
          <span class="text-h6">{{ textMessage.status?.toString().toUpperCase() }}</span>
          <v-spacer />
          <v-btn
            icon
            @click="isMessage = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-2">
          {{ textMessage.text }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            variant="text"
            @click="isMessage = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.register-container {
  background: linear-gradient(135deg, #052d7e 0%, #000000 100%);
}

.register-card {
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1) !important;
  max-width: 500px;
  margin: 0 auto;
}

.v-text-field :deep(.v-input__prepend-inner) {
  margin-right: 12px;
  margin-top: 12px;
}

.v-btn--elevated {
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.25);
  transition: all 0.3s ease;
}

.v-btn--elevated:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.3);
}

.v-card-title h2 {
  background: linear-gradient(to right, #1976D2, #2196F3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

ul {
  list-style-type: none;
}

ul li:before {
  content: "•";
  margin-right: 8px;
}
</style>
