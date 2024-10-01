<template>
	<div>
		<adminheader title="Add Contribution" />
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
				<label class="col-sm-3 control-label" for="pick"
					>Member, Last Name first</label
				>
				<div class="col-sm-6">
					<auto-complete
						v-model="account_id"
						dark
						:items="suggestions"
						@setId="setAccountId($event)"
					/>
					<span v-if="!$v.account_id.required" class="error"
						>Member is required</span
					>
				</div>
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
				<label class="col-sm-3 control-label" for="amount">Amount:</label>
				<div class="col-sm-2">
					<input
						id="amount"
						v-model="amount"
						type="text"
						name="amount"
						class="form-control"
					/>
					<span v-if="!$v.amount.required" class="error"
						>Amount is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<div class="col-sm-offset-3 col-sm-9">
					<div class="checkbox">
						<label
							><input
								id="ShowName"
								v-model="showName"
								type="checkbox"
								name="ShowName"
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
								id="ShowAmount"
								v-model="showAmount"
								type="checkbox"
								name="ShowAmount"
							/>
							Show Amount</label
						>
					</div>
				</div>
			</div>
			<div v-if="previous">
				<h3>Previous Donations</h3>
				<div class="form-group">
					<div class="col-sm-4">
						<div class="table-responsive">
							<table class="table table-sm text-nowrap lightondark">
								<tbody>
									<tr v-for="(item, index) in previous" :key="index">
										<td>{{ item.name }}</td>
										<td>{{ item.contribution_amount }}</td>
										<td>
											{{ $moment(item.dt).format('MMM DD YYYY') }}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-3 control-label" for="comment">Comment:</label>
				<div class="col-sm-9">
					<textarea
						id="comment"
						v-model="comment"
						name="comment"
						rows="10"
						cols="100"
						class="form-control"
					>
					</textarea>
					<span v-if="!$v.comment.required" class="error">
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
import { contributionService, accountService } from '@/services/'
import adminheader from '@/components/parts/adminHeader.vue'
import SubmitCancel from '@/components/parts/SubmitCancel.vue'
import AutoComplete from '@/components/parts/AutoComplete.vue'

export default {
	components: {
		adminheader,
		AutoComplete,
		SubmitCancel,
	},
	mixins: [validationMixin],
	layout: 'admin',
	data() {
		return {
			account_id: '',
			contribution_date: moment().format('YYYY-MM-DD'),
			amount: '',
			showName: true,
			showAmount: true,
			comment: '',
			suggestions: [],
			previous: null,
			error: '',
			submitStatus: 'Ok',
		}
	},
	validations: {
		account_id: {
			required,
		},
		contribution_date: {
			required,
		},
		amount: {
			required,
		},
		comment: {
			required,
		},
	},
	created() {
		this.getAll()
	},
	methods: {
		getAll() {
			accountService.getAll().then(
				(data) => {
					this.suggestions = data
				},
				(error) => {
					this.error = error
				}
			)
		},
		getPrevious(id) {
			contributionService.getPrevious(id).then(
				(data) => {
					this.previous = data
				},
				(error) => {
					this.error = error
				}
			)
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
		setAccountId(value) {
			this.account_id = value
			this.$v.account_id.$touch()
			this.getPrevious(value)
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
					account_id,
					contribution_date,
					amount,
					showName,
					showAmount,
					comment,
				} = this
				contributionService
					.addOne(
						account_id,
						contribution_date,
						amount,
						showName,
						showAmount,
						comment
					)
					.then((news) => {
						if (!news.error) {
							this.returnToList()
						} else {
							this.submitStatus = 'ERROR'
							this.error = news.error
						}
					})
			}
		},
	},
}
</script>
