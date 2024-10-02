<template>
  <div id="loginpage">
    <div class="container">
      <div class="row">
        <div class="col-sm-4 offset-sm-4">
          <div
            v-if="alert.message"
            :class="`alert ${alert.type}`"
          >
            {{ alert.message }}
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12 offset-sm-3 col-sm-6 offset-md-4 col-md-4">
          <div v-if="!auth.isLoggedIn">
            <h3 class="headline">Login Admin User</h3>
            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="username">Username</label>
                <input
                  v-model="username"
                  type="text"
                  name="username"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && !username }"
                />
                <span
                  v-show="submitted && !username"
                  class="error"
                  >Username is required</span
                >
              </div>
              <div class="form-group">
                <label htmlFor="password">Password</label>
                <input
                  v-model="password"
                  type="password"
                  name="password"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && !password }"
                />
                <span
                  v-show="submitted && !password"
                  class="error"
                  >Password is required</span
                >
              </div>
              <div class="form-group">
                <button
                  class="btn btn-primary"
                  :disabled="auth.loggingIn"
                >
                  Login
                </button>
              </div>
            </form>
            <nuxt-link to="/admin/resetpassword">Forgot password?</nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useAuthStore } from '~/stores/authStore'
  import { useAlertStore } from '~/stores/alertStore'
  const auth = useAuthStore()
  const alert = useAlertStore()

  const username = ref('')
  const password = ref('')
  const submitted = ref(false)

  /*     watch(
       	$route(to, from) {
       		// clear alert on location change
       		this.$store.dispatch('alert/clear')
    	) */

  const handleSubmit = async (state) => {
    if (username.value && password.value) {
      auth.login(username.value, password.value) // pinia auth store
    }
  }
</script>
