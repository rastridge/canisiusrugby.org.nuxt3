<template>
	<div class="add">
		<common-header :title="'Creating new password for ' + user" />
		<p
			v-if="submitStatus === 'ERROR'"
			:class="{ error: submitStatus === 'ERROR' }"
		>
			Please fill the form correctly.
		</p>
		<form class="form">
			<!-- Password input-->
			<div class="form-group">
				<label class="col-sm-6 col-md-8 control-label" for="pass"
					>NEW Password:
				</label>
				<div class="col-sm-6 col-md-8">
					<input
						id="pass"
						v-model.trim="pass"
						type="password"
						class="form-control"
						@input="setPass($event.target.value)"
					/>
					<span v-if="!$v.pass.required" class="error">Field is required</span
					><br />
					<span v-if="!$v.pass.minLength" class="error"
						>Password must have at least
						{{ $v.pass.$params.minLength.min }} letters.</span
					>
				</div>
			</div>

			<!-- SameAs Password input-->
			<div class="form-group">
				<label class="col-sm-6 col-md-8 control-label" for="repeatPass"
					>Repeat Password:
				</label>
				<div class="col-sm-6 col-md-8">
					<input
						id="repeatPass"
						v-model.trim="repeatPass"
						type="password"
						class="form-control"
						@input="setRepeatPass($event.target.value)"
					/>
					<span v-if="!$v.repeatPass.required" class="error"
						>Field is required</span
					>
					<span v-if="!$v.repeatPass.samePass" class="error"
						>Password do not match</span
					>
				</div>
			</div>

			<div class="form-group">
				<div class="col-sm-6 col-md-8">
					<submit-cancel :submitstatus="submitStatus" @dispose="dispose" />
				</div>
			</div>
		</form>
		<p
			v-if="submitStatus === 'ERROR'"
			:class="{ error: submitStatus === 'ERROR' }"
		>
			Please fill the form correctly.
		</p>
		<p v-if="submitStatus === 'PENDING'">Submitted...</p>
	</div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength, sameAs } from 'vuelidate/lib/validators'
import CommonHeader from '@/components/parts/commonHeader.vue'
import SubmitCancel from '@/components/parts/SubmitCancel.vue'
import { userService } from '@/services/'

export default {
	name: 'ResetForm',
	components: {
		SubmitCancel,
		CommonHeader
	},
	mixins: [validationMixin],
	data() {
		return {
			user: this.$route.params.username,
			pass: '',
			repeatPass: '',
			submitStatus: 'Ok',
			error: ''
		}
	},
	validations: {
		pass: {
			required,
			minLength: minLength(8)
		},
		repeatPass: {
			required,
			samePass: sameAs('pass')
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
		setPass(value) {
			this.pass = value
			this.$v.pass.$touch()
		},
		setRepeatPass(value) {
			this.repeatPass = value
			this.$v.repeatPass.$touch()
		},
		handleSubmit(e) {
			this.$v.$touch()
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				// do your submit logic here
				this.submitStatus = 'PENDING'
				const { user, pass } = this

				userService.resetPassword(user, pass).then((user) => {
					if (!user.error) {
						this.returnToList()
					} else {
						this.submitStatus = 'ERROR'
						this.error = user.error
					}
				})
			}
		}
	}
}
</script>
