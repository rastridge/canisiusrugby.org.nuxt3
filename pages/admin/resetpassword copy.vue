<template>
  <div class="row">
    <div class="col-sm-6 col-sm-offset-3">
      <h3 class="sub-headline">Admin User Request Password Reset</h3>
      <p
        v-if="submitStatus === 'ERROR'"
        :class="{ error: submitStatus === 'ERROR' }"
      >
        Please fill the form correctly.
      </p>
      <form class="form-horizontal">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            v-model="formData.username"
            type="text"
            name="username"
            class="form-control"
            @change="v$.username.$touch"
          />
        </div>
        <h3 class="info-frame">
          In a few moments instructions to reset your password will be sent to
          you at the email address associated with this username
        </h3>

        <button
          type="submit"
          @click="handleSubmit()"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
  import { required } from '@vuelidate/validators'
  import { useVuelidate } from '@vuelidate/core'

  const formData = reactive({
    username: '',
  })

  const submitStatus = ref('OK')
  const rules = computed(() => {
    return {
      username: { required },
    }
  })

  const v$ = useVuelidate(rules, formData)

  const handleSubmit = async (e) => {
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
      /*       if (!username.error) {
        navigateTo('/admin/loginpage')
      } else {
        submitStatus.value = 'ERROR'
        error = username.error
      } */
    }
  }
</script>
