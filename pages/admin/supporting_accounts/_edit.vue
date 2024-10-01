<template>
	<div class="add">
		<adminheader title="Supporting Accounts Edit" />
		<p
			v-if="submitStatus === 'ERROR'"
			:class="{ error: submitStatus === 'ERROR' }"
		>
			Please fill the form correctly.
		</p>
		<form class="form-horizontal">
			<div class="form-group">
				<div class="col-sm-6 col-md-8">
					<submit-cancel :submitstatus="submitStatus" @dispose="dispose" />
				</div>
			</div>

			<!-- supportingApp_name input-->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="supportingApp_name"
					>Account name:
				</label>
				<div class="col-sm-5">
					<b-form-input
						id="supportingApp_name"
						v-model.trim="supportingApp_name"
						type="text"
						class="form-control"
						autofocus
						@input="setsupportingApp_name($event)"
					/>
					<span v-if="!$v.supportingApp_name.required" class="error"
						>Account Name Field is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-4 control-label" for="supportingApp_description"
					>Description:
				</label>
				<div class="col-sm-5">
					<textarea
						id="supportingApp_description"
						v-model.trim="supportingApp_description"
						type="text"
						rows="3"
						class="form-control"
						@input="setsupportingApp_description($event.target.value)"
					/>
					<span v-if="!$v.supportingApp_description.required" class="error"
						>Account Descrption is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-4 control-label" for="supportingApp_url"
					>Website:
				</label>
				<div class="col-sm-6">
					<input
						id="supportingApp_url"
						v-model.trim="supportingApp_url"
						type="text"
						class="form-control"
						@input="setsupportingApp_url($event.target.value)"
					/>
					<span v-if="!$v.supportingApp_url.required" class="error"
						>Website Field is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-4 control-label" for="supportingApp_owner"
					>Owner:
				</label>
				<div class="col-sm-6">
					<input
						id="supportingApp_owner"
						v-model.trim="supportingApp_owner"
						type="text"
						class="form-control"
						@input="setsupportingApp_owner($event.target.value)"
					/>
					<span v-if="!$v.supportingApp_owner.required" class="error"
						>Owner Field is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-4 control-label" for="supportingApp_username"
					>Username:
				</label>
				<div class="col-sm-6">
					<input
						id="supportingApp_username"
						v-model.trim="supportingApp_username"
						type="text"
						class="form-control"
						@input="setsupportingApp_username($event.target.value)"
					/>
					<span v-if="!$v.supportingApp_username.required" class="error"
						>Username is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-4 control-label" for="supportingApp_password"
					>Password:
				</label>
				<div class="col-sm-6">
					<input
						id="supportingApp_password"
						v-model.trim="supportingApp_password"
						type="text"
						class="form-control"
						@input="setsupportingApp_password($event.target.value)"
					/>
					<span v-if="!$v.supportingApp_password.required" class="error"
						>Password is required</span
					>
				</div>
			</div>

			<!-- submit  -->
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
import { required } from 'vuelidate/lib/validators'
import adminheader from '@/components/parts/adminHeader.vue'
import SubmitCancel from '@/components/parts/SubmitCancel.vue'
import { supportingaccountsService } from '@/services/'

export default {
	name: 'Sponsoredit',
	components: {
		adminheader,
		SubmitCancel
	},
	mixins: [validationMixin],
	layout: 'admin',
	data() {
		return {
			id: this.$route.params.edit,
			supportingApp_name: '',
			supportingApp_description: '',
			supportingApp_url: '',
			supportingApp_owner: '',
			supportingApp_username: '',
			supportingApp_password: '',
			supportingaccounts: [],
			reset: false,
			submitStatus: 'Ok',
			error: ''
		}
	},
	validations() {
		return {
			supportingApp_name: {
				required
			},
			supportingApp_description: {
				required
			},
			supportingApp_url: {
				required
			},
			supportingApp_owner: {
				required
			},
			supportingApp_username: {
				required
			},
			supportingApp_password: {
				required
			}
		}
	},
	created() {
		supportingaccountsService.getOne(this.id).then((data) => {
			this.supportingaccounts = data
			this.setInfo(data)
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
		setInfo(u) {
			this.supportingApp_name = u.supportingApp_name
			this.supportingApp_description = u.supportingApp_description
			this.supportingApp_owner = u.supportingApp_owner
			this.supportingApp_url = u.supportingApp_url
			this.supportingApp_username = u.supportingApp_username
			this.supportingApp_password = u.supportingApp_password
		},
		returnToList() {
			this.$router.push('/admin/supporting_accounts')
		},
		setsupportingApp_name(value) {
			this.supportingApp_name = value
			this.$v.supportingApp_name.$touch()
		},
		setsupportingApp_description(value) {
			this.supportingApp_description = value
			this.$v.supportingApp_description.$touch()
		},
		setsupportingApp_url(value) {
			this.supportingApp_url = value
			this.$v.supportingApp_url.$touch()
		},
		setsupportingApp_owner(value) {
			this.supportingApp_owner = value
			this.$v.supportingApp_owner.$touch()
		},
		setsupportingApp_username(value) {
			this.supportingApp_username = value
			this.$v.supportingApp_username.$touch()
		},
		setsupportingApp_password(value) {
			this.supportingApp_password = value
			this.$v.supportingApp_password.$touch()
		},
		handleSubmit(e) {
			this.submitStatus = ''
			this.$v.$touch()
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				// do your submit logic here
				this.submitStatus = 'PENDING'
				const {
					id,
					supportingApp_name,
					supportingApp_description,
					supportingApp_url,
					supportingApp_owner,
					supportingApp_username,
					supportingApp_password
				} = this
				supportingaccountsService
					.editOne(
						id,
						supportingApp_name,
						supportingApp_description,
						supportingApp_url,
						supportingApp_owner,
						supportingApp_username,
						supportingApp_password
					)
					.then((supportingaccounts) => {
						if (!supportingaccounts.error) {
							this.returnToList()
						} else {
							this.submitStatus = 'ERROR'
							this.error = supportingaccounts.error
						}
					})
			}
		}
	}
}
</script>
