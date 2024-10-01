/* eslint-disable vue/no-v-html */
<template>
	<div class="edit">
		<adminheader title="Payments Add" />
		<p
			v-if="submitStatus === 'ERROR'"
			:class="{ error: submitStatus === 'ERROR' }"
		>
			Please fill the form correctly.
		</p>
		<form class="form-horizontal">
			<div class="form-group">
				<div class="col-sm-offset-2 col-sm-4">
					<submit-cancel :submitstatus="submitStatus" @dispose="dispose" />
				</div>
			</div>

			<!-- Page payment_title input-->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="payment_title"
					>Payment Title:
				</label>
				<div class="col-sm-4">
					<input
						id="payment_title"
						v-model.trim="payment_title"
						type="text"
						class="form-control"
						@input="setpayment_title($event.target.value)"
					/>
					<span v-if="!$v.payment_title.required" class="error"
						>Payment Title Field is required</span
					>
				</div>
			</div>

			<!-- Page payment Desc input-->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="payment_description"
					>Payment Description:
				</label>
				<div class="col-sm-6">
					<input
						id="payment_description"
						v-model.trim="payment_description"
						type="text"
						class="form-control"
						@input="setpayment_description($event.target.value)"
					/>
					<span v-if="!$v.payment_description.required" class="error"
						>Payment Description Field is required</span
					>
				</div>
			</div>

			<!-- Page paypal button input-->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="payment_paypal_button"
					>Paypal Code:
				</label>
				<div class="col-sm-12">
					<textarea
						id="payment_paypal_button"
						v-model.trim="payment_paypal_button"
						type="text"
						rows="16"
						class="form-control"
						@input="setpayment_paypal_button($event.target.value)"
					/>
					<span v-if="!$v.payment_paypal_button.required" class="error"
						>Payment Code is required</span
					>
				</div>
			</div>

			<p>What it will look like</p>
			<div
				class="frame"
				style="color:black;width:66%;"
				v-html="payment_paypal_button"
			></div>
			<br />
			<div class="form-group">
				<label class="col-sm-3 control-label" for="release_dt"
					>Release Date:</label
				>
				<div class="col-sm-4">
					<b-form-datepicker
						id="release_dt"
						v-model="release_dt"
						show-decade-nav
						class="form-control"
						@input="setReleaseDate($event)"
					></b-form-datepicker>
					<span v-if="!$v.release_dt.required" class="error"
						>Date is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-3 control-label" for="expire_dt"
					>Expire Date:</label
				>
				<div class="col-sm-4">
					<b-form-datepicker
						id="expire_dt"
						v-model="expire_dt"
						class="form-control"
						show-decade-nav
						@input="setExpireDate($event)"
					></b-form-datepicker>
					<span v-if="!$v.expire_dt.required" class="error"
						>Date is required</span
					>
				</div>
			</div>
			<div class="form-group">
				<div class="col-sm-offset-2 col-sm-4">
					<submit-cancel :submitstatus="submitStatus" @dispose="dispose" />
				</div>
			</div>
		</form>
		payment_title {{ payment_title }}
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
import { paymentsService } from '@/services'

export default {
	components: {
		adminheader,
		SubmitCancel
	},
	mixins: [validationMixin],
	layout: 'admin',
	data() {
		return {
			payment_title: '',
			payment_description: '',
			payment_paypal_button: '',
			release_dt: '',
			expire_dt: '',

			reset: false,
			apps: [],
			perms: [],
			error: '',
			submitStatus: 'Ok'
		}
	},
	validations: {
		payment_title: {
			required
		},
		payment_description: {
			required
		},
		release_dt: {
			required
		},
		expire_dt: {
			required
		},
		payment_paypal_button: {
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
			this.$router.push('/admin/payments')
		},
		setpayment_title(value) {
			this.payment_title = value
			this.$v.payment_title.$touch()
		},
		setpayment_description(value) {
			this.payment_description = value
			this.$v.payment_description.$touch()
		},
		setpayment_paypal_button(value) {
			this.payment_paypal_button = value
			this.$v.payment_paypal_button.$touch()
		},
		setReleaseDate(value) {
			this.release_dt = value
			this.$v.release_dt.$touch()
		},
		setExpireDate(value) {
			this.expire_dt = value
			this.$v.expire_dt.$touch()
		},
		handleSubmit(e) {
			this.submitStatus = ''
			this.$v.$touch()
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				this.submitStatus = 'PENDING'
				const {
					payment_title,
					payment_description,
					payment_paypal_button,
					release_dt,
					expire_dt
				} = this
				paymentsService
					.addOne(
						payment_title,
						payment_description,
						payment_paypal_button,
						release_dt,
						expire_dt
					)
					.then((content) => {
						if (!content.error) {
							this.returnToList()
						} else {
							this.submitStatus = 'ERROR'
							this.error = content.error
						}
					})
			}
		}
	}
}
</script>
