<template>
	<div class="edit">
		<adminheader title="Admin User Edit" />
		<p
			v-if="submitStatus === 'ERROR'"
			:class="{ error: submitStatus === 'ERROR' }"
		>
			Please fill the form correctly.
		</p>
		<form v-if="user" class="form-horizontal">
			<div class="form-group">
				<div class="col-sm-offset-2 col-sm-4">
					<submit-cancel :submitstatus="submitStatus" @dispose="dispose" />
				</div>
			</div>

			<!-- Username input-->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="user">Username: </label>
				<div class="col-sm-4">
					<input
						id="user"
						v-model.trim="user"
						type="text"
						class="form-control"
						@input="setUser($event.target.value)"
					/>
					<span v-if="!$v.user.required" class="error"
						>User Field is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-4 control-label" for="email">Email: </label>
				<div class="col-sm-7">
					<input
						id="email"
						v-model.trim="email"
						type="text"
						class="form-control"
						@input="setEmail($event.target.value)"
					/>
					<span v-if="!$v.email.email" class="error">Invalid email</span>
					<span v-if="!$v.email.required" class="error"
						>Email Field is required</span
					>
				</div>
			</div>

			<!-- reset password -->
			<div class="form-check">
				<div class="col-sm-4">
					<input
						id="reset"
						v-model="reset"
						type="checkbox"
						class="form-check-input"
						@input="resetPassword()"
					/>
					<label class="form-check-label" for="exampleCheck1"
						><span class="sub-headline">Change password</span></label
					>
				</div>
			</div>
			<br />

			<!-- Password input-->
			<div v-if="reset">
				<div class="form-group">
					<label class="col-sm-4 control-label" for="pass">Password: </label>
					<div class="col-sm-4">
						<input
							id="pass"
							v-model.trim="pass"
							type="password"
							class="form-control"
							@input="setPass($event.target.value)"
						/>
						<span v-if="!$v.pass.requiredIf" class="error"
							>Field is required</span
						>
						<br />
						<span v-if="!$v.pass.minLength" class="error"
							>Password must have at least
							{{ $v.pass.$params.minLength.min }} letters.</span
						>
					</div>
				</div>

				<!-- SameAs Password input-->
				<div class="form-group">
					<label class="col-sm-4 control-label" for="repeatPass"
						>Repeat Password:
					</label>
					<div class="col-sm-4">
						<input
							id="repeatPass"
							v-model.trim="repeatPass"
							type="password"
							class="form-control"
						/>
					</div>
					<span v-if="!$v.repeatPass.samePass" class="error"
						>Passwords do not match</span
					>
				</div>
			</div>

			<!-- permissions -->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="repeatPass"
					>Settings:
				</label>
				<div class="col-sm-8">
					<div class="table-responsive">
						<table
							id="roster-table"
							class="table table-sm text-nowrap">
							<tbody v-if="perms"  id="roster-tbody">
								<tr v-for="(item, index) in apps" :key="item.admin_app_id">
									<td class="text-right">{{ item.admin_app_name }}:</td>
									<td>
										<input
											v-model="perms[index].admin_app_id"
											type="hidden"
											value="item.admin_app_id"
										/>
										<input
											v-model="perms[index].admin_perm"
											type="radio"
											value="3"
											:checked="perms[index].admin_perm > 2"
										/>
										&nbsp;Manage
									</td>
									<td>
										<input
											v-model="perms[index].admin_perm"
											type="radio"
											value="2"
										/>
										&nbsp;Create&nbsp;
									</td>
									<td>
										<input
											v-model="perms[index].admin_perm"
											type="radio"
											value="1"
										/>
										&nbsp;View&nbsp;
									</td>
									<td>
										<input
											v-model="perms[index].admin_perm"
											type="radio"
											value="0"
										/>
										&nbsp;No Access&nbsp;
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<div class="form-group">
				<div class="col-sm-offset-2 col-sm-4">
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
import {
	required,
	email,
	minLength,
	sameAs,
	requiredIf,
} from 'vuelidate/lib/validators'
import adminheader from '@/components/parts/adminHeader.vue'
import SubmitCancel from '@/components/parts/SubmitCancel.vue'
import { userService } from '@/services'

export default {
	components: {
		adminheader,
		SubmitCancel,
	},
	mixins: [validationMixin],
	layout: 'admin',
	data() {
		return {
			id: this.$route.params.edit,
			email: '',
			user: '',
			pass: '',
			repeatPass: '',
			hold_pass: '',
			hold_repeatPass: '',
			reset: false,
			apps: [],
			perms: [],
			error: '',
			submitStatus: 'Ok',
		}
	},
	validations: {
		email: {
			required,
			email,
		},
		user: {
			required,
		},
		pass: {
			requiredIf: requiredIf(function () {
				return this.reset
			}),
			minLength: minLength(8),
		},
		repeatPass: {
			samePass: sameAs('pass'),
		},
	},
	created() {
		userService.getOne(this.id).then((user) => {
			this.setUserInfo(user)
		})
		userService.getApps().then((apps) => {
			this.apps = apps
		})
	},
	methods: {
		dispose(e) {
			if (e === 'submit') {
				this.handleSubmit()
			} else if (e === 'cancel') {
				this.returnToList()
			}
		},
		setUserInfo(u) {
			this.id = u.admin_user_id
			this.user = u.admin_user_name
			this.pass = u.admin_user_remind
			this.repeatPass = u.admin_user_remind
			this.email = u.admin_user_email
			this.perms = u.perms
		},
		returnToList() {
			this.$router.push('/admin/users')
		},
		resetPassword() {
			this.reset = !this.reset
			if (this.reset) {
				this.pass = ''
				this.hold_pass = this.pass
				this.repeatPass = ''
				this.hold_repeatPass = this.repeatPass
			} else {
				this.pass = this.hold_pass
				this.repeatPass = this.hold_repeatPass
			}
		},
		setUser(value) {
			this.user = value
			this.$v.user.$touch()
		},
		setEmail(value) {
			this.email = value
			this.$v.email.$touch()
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
			this.submitStatus = ''
			this.$v.$touch()
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				this.submitStatus = 'PENDING'
				const { id, user, pass, email, perms } = this
				userService.editOne(id, user, pass, email, perms).then((user) => {
					if (!user.error) {
						this.returnToList()
					} else {
						this.submitStatus = 'ERROR'
						this.error = user.error
					}
				})
			}
		},
	},
}
</script>

<style lang="scss" scoped>
#roster-table {
	color: rgb(206, 206, 206);
}
#roster-tbody {
	background-color: rgb(240, 239, 239);
	color: rgb(71, 71, 71);
}
</style>
