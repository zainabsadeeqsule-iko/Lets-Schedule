<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Log in As Student</h1>
    <p class="text-base mb-4 leading-5">
      New to Lets-Schedule?
      <RouterLink :to="{ name: 'studentSignup' }" class="font-semibold text-primary">Sign up</RouterLink>
    </p>
    <VaInput
      v-model="formData.student_id"
      :rules="[validators.required, validators.numeric, validators.minLength(9), validators.maxLength(9)]"
      class="mb-4"
      label="Student ID"
      type="string"
    />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="formData.password"
        :rules="[validators.required, validators.minLength(6)]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Password"
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
    <div class="auth-layout__options flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <VaCheckbox v-model="formData.keepLoggedIn" class="mb-2 sm:mb-0" label="Keep me signed in on this device" />
      <RouterLink :to="{ name: 'recover-password' }" class="mt-2 sm:mt-0 sm:ml-1 font-semibold text-primary">
        Forgot password?
      </RouterLink>
    </div>
    <div class="flex justify-center mt-4">
      <VaButton class="w-full" @click="submit" :loading="isLoading">Login</VaButton>
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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { validators } from '../../../services/utils'
import { post } from '@/plugins/http'

const { validate } = useForm('form')
const { push } = useRouter()
const { init } = useToast()
const isLoading = ref(false)

const formData = reactive({
  student_id: '',
  password: '',
  keepLoggedIn: false,
})

const submit = async () => {
  if (validate()) {
    try {
      isLoading.value = true
      const response = await post('/student-login', formData)
      if (response.status === 200) {
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
</script>
