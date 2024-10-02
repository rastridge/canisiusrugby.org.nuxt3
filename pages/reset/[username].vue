<template>
  <div class="my-form-style">
    <form>
      <input
        v-model="pass"
        type="password"
        name="pass"
        label="Password"
      />
      <input
        v-model="pass_confirm"
        type="password"
        name="pass_confirm"
        label="Confirm password"
      />
      <button
        type="submit"
        @click="submitHandler"
      >
        submit
      </button>
    </form>
  </div>
</template>

<script setup>
  const route = useRoute()
  const user = ref(route.params.username)
  const pass = ref('')
  const pass_confirm = ref('')

  const submitHandler = async () => {
    const password = pass.value
    const username = user.value
    await useFetch('/users/resetpassword', {
      method: 'POST',
      body: { username, password },
    })

    navigateTo('/loginpage')
  }
</script>
