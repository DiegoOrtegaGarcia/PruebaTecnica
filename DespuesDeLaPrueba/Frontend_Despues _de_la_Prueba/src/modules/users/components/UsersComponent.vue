<!-- UserComponent.vue -->
<template>
  <tr class="user-row">
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
        @click="onDeleteUser(user.id)"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </td>
  </tr>
</template>

<script setup lang="ts">
  import type { UserTableProps } from '@/core/types/types'

  const props = defineProps<UserTableProps>()

  const onDeleteUser = (id: number) => {
    // Emitir evento para que el componente padre maneje la eliminación
    // o llamar directamente a la función si se pasa como prop
    if (props.onDeleteUser) {
      props.onDeleteUser(id)
    }
  }
</script>

<style scoped>
.user-row:hover {
  background-color: #f5f5f5;
}

/* Asegurar que las celdas ocupen el espacio completo */
.user-row td {
  padding: 12px;
  vertical-align: middle;
}

.hide-on-mobile {
  display: none;
}

@media (min-width: 601px) {
  .hide-on-mobile {
    display: table-cell;
  }
}
</style>
