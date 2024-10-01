<template>
	<div>
		<adminheader title="Edit Contribution" />
		<p
			v-if="submitStatus === 'ERROR'"
			:class="{ error: submitStatus === 'ERROR' }"
		>
			Please fill the form correctly.
		</p>
		<p v-if="submitStatus === 'PENDING'">Submitted...</p>
		<form class="form-horizontal">
			<div class="form-group">
				<div class="col-sm-6 col-md-8">
					<submit-cancel :submitstatus="submitStatus" @dispose="dispose" />
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-4 control-label">
					<div class="frame">
						<span class="subheader">{{ contribution_name }}</span>
					</div></label
				>
			</div>

			<div class="form-group">
				<label class="col-sm-3 control-label" for="contribution_date"
					>Contribution Date:</label
				>
				<div class="col-sm-4">
					<b-form-datepicker
						id="contribution_date"
						v-model="contribution_date"
						class="form-control"
						show-decade-nav
						@input="setDate($event)"
					></b-form-datepicker>
					<span v-if="!$v.contribution_date.required" class="error"
						>Date is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-3 control-label" for="contribution_amount"
					>Amount:</label
				>
				<div class="col-sm-2">
					<input
						id="contribution_amount"
						v-model="contribution_amount"
						type="text"
						name="contribution_amount"
						class="form-control"
					/>
					<span v-if="!$v.contribution_amount.required" class="error"
						>Amount is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<div class="col-sm-offset-3 col-sm-9">
					<div class="checkbox">
						<label
							><input
								id="contribution_name"
								v-model="contribution_showName"
								type="checkbox"
								name="contribution_name"
								value="1"
							/>
							Show Name</label
						>
					</div>
				</div>
			</div>

			<div class="form-group">
				<div class="col-sm-offset-3 col-sm-9">
					<div class="checkbox">
						<label
							><input
								id="contribution_showAmount"
								v-model="contribution_showAmount"
								type="checkbox"
								name="contribution_showAmount"
							/>
							Show Amount</label
						>
					</div>
				</div>
			</div>

			<div id="info"></div>

			<div class="form-group">
				<label class="col-sm-3 control-label" for="contribution_comment"
					>Comment:</label
				>
				<div class="col-sm-9">
					<textarea
						id="contribution_comment"
						v-model="contribution_comment"
						name="contribution_comment"
						rows="10"
						cols="100"
						class="form-control"
					>
					</textarea>
					<span v-if="!$v.contribution_comment.required" class="error">
						Comment is required</span
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
import { required } from 'vuelidate/lib/validators'

import moment from 'moment'
import { contributionService } from '@/services/'
import adminheader from '@/components/parts/adminHeader.vue'
import SubmitCancel from '@/components/parts/SubmitCancel.vue'

export default {
	components: {
		adminheader,
		SubmitCancel
	},
	mixins: [validationMixin],
	layout: 'admin',
	data() {
		return {
			id: this.$route.params.edit,
			contribution_date: moment().format('YYYY-MM-DD'),
			contribution_name: '',
			contribution_amount: '',
			contribution_showName: true,
			contribution_showAmount: true,
			contribution_comment: '',
			error: '',
			submitStatus: 'Ok'
		}
	},
	validations: {
		contribution_date: {
			required
		},
		contribution_amount: {
			required
		},
		contribution_comment: {
			required
		}
	},
	created() {
		this.getOne(this.id) // get contribution info
	},
	methods: {
		getOne(id) {
			contributionService.getOne(id).then((contribution) => {
				this.setInfo(contribution)
			})
		},
		setInfo(c) {
			this.contribution_name = c.contribution_name
			this.contribution_date = c.contribution_date
			this.contribution_amount = c.contribution_amount
			this.contribution_showName = c.contribution_showName
			this.contribution_showAmount = c.contribution_showAmount
			this.contribution_comment = c.contribution_comment
		},
		dispose(e) {
			if (e === 'submit') {
				this.handleSubmit()
			} else if (e === 'cancel') {
				this.returnToList()
			}
		},
		returnToList() {
			this.$router.push('/admin/contributions')
		},
		setDate(value) {
			this.contribution_date = value
			this.$v.contribution_date.$touch()
		},
		setAmount(value) {
			this.amount = value
			this.$v.amount.$touch()
		},
		setComment(value) {
			this.comment = value
			this.$v.comment.$touch()
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
					contribution_date,
					contribution_amount,
					contribution_showName,
					contribution_showAmount,
					contribution_comment
				} = this
				// eslint-disable-next-line no-console
				console.log('id=', id)
				contributionService
					.editOne(
						contribution_date,
						contribution_amount,
						contribution_showName,
						contribution_showAmount,
						contribution_comment,
						id
					)
					.then((contribution) => {
						if (!contribution.error) {
							this.returnToList()
						} else {
							this.submitStatus = 'ERROR'
							this.error = contribution.error
						}
					})
			}
		}
	}
}
</script>
