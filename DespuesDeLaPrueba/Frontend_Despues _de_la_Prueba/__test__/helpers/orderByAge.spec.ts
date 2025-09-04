import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { orderAge } from '../../src/core/utils/orderByAge'

describe('orderByAge', () => {
  it('should order users by age ascending', () => {
    const users = ref([
      { id: 1, name: 'John', lastName: 'Doe', age: '30', sex: 'male', email: 'john@example.com' },
      { id: 2, name: 'Jane', lastName: 'Smith', age: '25', sex: 'female', email: 'jane@example.com' },
      { id: 3, name: 'Bob', lastName: 'Johnson', age: '35', sex: 'male', email: 'bob@example.com' }
    ])

    const result = orderAge(users)

    expect(result).toEqual([
      { id: 2, name: 'Jane', lastName: 'Smith', age: '25', sex: 'female', email: 'jane@example.com' },
      { id: 1, name: 'John', lastName: 'Doe', age: '30', sex: 'male', email: 'john@example.com' },
      { id: 3, name: 'Bob', lastName: 'Johnson', age: '35', sex: 'male', email: 'bob@example.com' }
    ])
  })

  it('should handle empty array', () => {
    const users = ref([])
    const result = orderAge(users)
    expect(result).toEqual([])
  })

  it('should handle single user', () => {
    const users = ref([
      { id: 1, name: 'John', lastName: 'Doe', age: '30', sex: 'male', email: 'john@example.com' }
    ])
    const result = orderAge(users)
    expect(result).toEqual([
      { id: 1, name: 'John', lastName: 'Doe', age: '30', sex: 'male', email: 'john@example.com' }
    ])
  })
})
