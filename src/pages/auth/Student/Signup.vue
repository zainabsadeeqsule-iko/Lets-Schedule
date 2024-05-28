<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Sign up As Student</h1>
    <p class="text-base mb-4 leading-5">
      Have an account?
      <RouterLink :to="{ name: 'studentLogin' }" class="font-semibold text-primary">Login</RouterLink>
    </p>
    <VaInput
      v-model="formData.student_id"
      :rules="[validators.required, validators.numeric, validators.minLength(9), validators.maxLength(9)]"
      class="mb-4"
      label="Student ID"
      type="string"
    />
    <VaInput v-model="formData.name" :rules="[validators.required]" class="mb-4" label="Student Name" type="string" />
    <VaInput v-model="formData.phone" :rules="[validators.required]" class="mb-4" label="Phone Number" type="string" />
    <VaSelect
      v-model="formData.department_id"
      :rules="[validators.required]"
      class="mb-4"
      label="Department"
      :options="departments"
      :loading="isDepartmentsLoading"
      value-by="id"
      text-by="name"
    />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        ref="password1"
        v-model="formData.password"
        :rules="passwordRules"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Password"
        messages="Password should be 8+ characters: letters, numbers, and special characters."
        @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
      >
        <template #appendInner>
          <VaIcon
            :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
      <VaInput
        ref="password2"
        v-model="formData.password_confirmation"
        :rules="[
          (v) => !!v || 'Repeat Password field is required',
          (v) => v === formData.password || 'Passwords don\'t match',
        ]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Repeat Password"
        @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
      >
        <template #appendInner>
          <VaIcon
            :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
    </VaValue>

    <div class="flex justify-center mt-4">
      <VaButton class="w-full" @click="submit" :loading="isLoading">Create account</VaButton>
    </div>
    <div class="mt-4">
      <hr class="my-4" />
      <p class="text-base mb-2 text-center">Not a Student?</p>
      <div class="flex justify-between">
        <RouterLink :to="{ name: 'adminLogin' }" class="font-semibold text-primary">Login As Admin</RouterLink>
        <RouterLink :to="{ name: 'lecturerLogin' }" class="font-semibold text-primary">Login as Lecturer</RouterLink>
      </div>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { validators } from '../../../services/utils'
import { get, post } from '@/plugins/http'

const { validate } = useForm('form')
const { push } = useRouter()
const { init } = useToast()
const isLoading = ref(false)

const formData = reactive({
  student_id: '',
  name: '',
  phone: '',
  department_id: '',
  password: '',
  password_confirmation: '',
})

const departments = ref([])
const isDepartmentsLoading = ref(true)

onMounted(async () => {
  try {
    const response = await get('/fetch-departments')
    if (response.data.success) {
      departments.value = response.data.data
    } else {
      console.error('Failed to fetch departments:', response.data)
    }
  } catch (error) {
    console.error('Error fetching departments:', error)
  } finally {
    isDepartmentsLoading.value = false
  }
})

const submit = async () => {
  if (validate()) {
    try {
      isLoading.value = true
      const response = await post('/student-register', formData)
      console.log(response)
      if (response.status === 201) {
        // Save the token and student data to local storage
        localStorage.setItem('accessToken', response.data.token)
        localStorage.setItem('role', response.data.role)
        localStorage.setItem('studentData', JSON.stringify(response.data.student))
        init({ message: response.data.message, color: 'success' })
        push({ name: 'studentDashboard' })
      } else {
        if (response.data.errors) {
          console.error('Login failed:', response.data.errors)
          // Extract the error message from the response data
          const errorMessage = response.data.message || 'Invalid credentials'
          const errorDetails = Object.values(response.data.errors).flat().join(', ')
          init({ message: `${errorMessage}: ${errorDetails}`, color: 'danger' })
        } else {
          init({ message: response.data.message, color: 'danger' })
        }
      }
    } catch (error) {
      console.error('Login failed:', error)
      init({ message: 'An error occurred during login', color: 'danger' })
    } finally {
      isLoading.value = false
    }
  }
}

const passwordRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || 'Password field is required',
  (v) => (v && v.length >= 8) || 'Password must be at least 8 characters long',
  (v) => (v && /[A-Za-z]/.test(v)) || 'Password must contain at least one letter',
  (v) => (v && /\d/.test(v)) || 'Password must contain at least one number',
  (v) => (v && /[!@#$%^&*(),.?":{}|<>]/.test(v)) || 'Password must contain at least one special character',
]
</script>
