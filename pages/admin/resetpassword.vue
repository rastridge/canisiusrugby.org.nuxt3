<template>
  <div class="row">
    <div class="col-sm-6 col-sm-offset-3">
      <h3 class="sub-headline">Admin User Request Password Reset</h3>
      <form @submit.prevent="handleSubmit">
        <input
          type="text"
          v-model="formData.username"
        />
        <button type="submit">submit</button>
      </form>
      <p>
        <span
          v-for="error in v$.$errors"
          :key="error.$uid"
        >
          {{ error.$property }} - {{ error.$message }},
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
  import { required } from '@vuelidate/validators'
  import { useVuelidate } from '@vuelidate/core'
  import { useFetch } from 'nuxt/app'

  const formData = reactive({ username: '' })

  const rules = {
    username: { required },
  }

  const v$ = useVuelidate(rules, formData)

  const handleSubmit = async () => {
    const result = await v$.value.$validate()
    if (result) {
      const username = formData.username
      console.log(username)
      const { data } = await useFetch(`/users/resetrequest`, {
        method: 'POST',
        body: { username },
      })
    } else {
      alert('not validated')
    }
  }

  /*   const handleSubmit = async (e) => {
    console.log('e = ', e)
    submitStatus.value = ''
    v$.value.$validate()
    if (v$.value.$error) {
      submitStatus.value = 'ERROR'
    } else {
      submitStatus.value = 'PENDING'

      const { data } = await useFetch(
        `/user/resetRequest/${formData.username}`,
        {
          method: 'get',
        },
      )
      console.log(data)
      if (!username.error) {
        navigateTo('/admin/loginpage')
      } else {
        submitStatus.value = 'ERROR'
        error = username.error
      }
    }
  } */
</script>
