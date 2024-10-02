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
            v-model="username"
            type="text"
            name="username"
            class="form-control"
            @input="setUsername($event.target.value)"
          />
          <span
            v-if="!$v.username.required"
            class="error"
            >Username is required</span
          >
        </div>
        <h3 class="info-frame">
          In a few moments instructions to reset your password will be sent to
          you at the email address associated with this username
        </h3>
        <div class="form-group">
          <div class="col-sm-offset-2 col-sm-4">
            <submit-cancel
              :submitstatus="submitStatus"
              @dispose="dispose"
            />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
    import { validationMixin } from 'vuelidate'
    import { required } from 'vuelidate/lib/validators'
    import { userService } from '@/services'
  import { navigateTo } from 'nuxt/app'

    	mixins: [validationMixin]

    			const username=ref( '')
    			const submitStatus= ref('OK')

    	validations: {
    		username: {
    			required
    		}
    	}
    		const dispose = (e) => {
    			if (e === 'submit') {
    				handleSubmit()
    			} else if (e === 'cancel') {
    				returnToList()
    			}
    		}

    		const returnToList = () => {
    			navigateTo('/admin/loginpage')
    		}

    		const setUsername = (value)=> {
    			username.value = value
    			$v.username.$touch()
    		}

    		const handleSubmit = (e) {
    			submitStatus.vslue = ''
    			$v.$touch()
    			if ($v.$invalid) {
    				submitStatus.vslue = 'ERROR'
    			} else {
    				submitStatus.vslue = 'PENDING'
    				const { username } = this
    				userService.resetRequest(username).then((username) => {
    					if (!username.error) {
    						returnToList()
    					} else {
    						submitStatus.vslue = 'ERROR'
    						error = username.error
    					}
    				})
    			}
    		}
</script>
