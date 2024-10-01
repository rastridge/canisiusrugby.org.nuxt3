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
					<span v-if="!$v.username.required" class="error"
						>Username is required</span
					>
				</div>
				<h3 class="info-frame">
					In a few moments instructions to reset your password will be sent to
					you at the email address associated with this username
				</h3>
				<div class="form-group">
					<div class="col-sm-offset-2 col-sm-4">
						<submit-cancel :submitstatus="submitStatus" @dispose="dispose" />
					</div>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import SubmitCancel from '@/components/parts/SubmitCancel.vue'
import { userService } from '@/services'

export default {
	components: {
		SubmitCancel
	},
	mixins: [validationMixin],
	data() {
		return {
			username: '',
			submitStatus: 'OK'
		}
	},
	validations: {
		username: {
			required
		}
	},
	methods: {
		dispose(e) {
			if (e === 'submit') {
				this.handleSubmit()
			} else if (e === 'cancel') {
				this.returnToList()
			}
		},
		returnToList() {
			this.$router.push('/admin/loginpage')
		},
		setUsername(value) {
			this.username = value
			this.$v.username.$touch()
		},
		handleSubmit(e) {
			this.submitStatus = ''
			this.$v.$touch()
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				this.submitStatus = 'PENDING'
				const { username } = this
				userService.resetRequest(username).then((username) => {
					if (!username.error) {
						this.returnToList()
					} else {
						this.submitStatus = 'ERROR'
						this.error = username.error
					}
				})
			}
		}
	}
}
</script>
