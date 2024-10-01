<template>
	<div class="smsedit">
		<adminheader title="SMS Edit" />
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

			<div class="col-sm-offset-2 col-sm-4">
				<div class="info-frame">
					Last sent {{ $moment(sms_sent).format('MMM DD YYYY HH:mm a') }}<br />
					Recipient Count {{ sms_recp_cnt }}
				</div>
			</div>

			<!-- Member type input-->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="sms_member_type_id">
					Recipient Member type:</label
				>
				<div class="col-sm-4">
					<b-form-select
						v-model="sms_member_type_id"
						:options="memberTypes"
						class="mb-3"
						value-field="member_type_id"
						text-field="member_type"
						disabled-field="notEnabled"
						@change="setMember_type_id($event)"
					></b-form-select>
					<span v-if="!$v.sms_member_type_id.required" class="error"
						>Field is required</span
					>
				</div>
			</div>

			<!-- sms_subject input-->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="sms_subject"
					>Text subject:
				</label>
				<div class="col-sm-4">
					<input
						id="sms_subject"
						v-model.trim="sms_subject"
						type="text"
						class="form-control"
						@input="setsms_subject($event.target.value)"
					/>
					<span v-if="!$v.sms_subject.required" class="error"
						>Text subject Field is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-2 control-label" for="sms_body_text"
					>Message:
				</label>
				<div class="col-sm-10">
					<textarea
						id="sms_body_text"
						v-model.trim="sms_body_text"
						type="text"
						rows="3"
						class="form-control"
						@input="setBody($event.target.value)"
					/>
					<span v-if="!$v.sms_body_text.required" class="error"
						>Message is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<div class="col-sm-offset-2 col-sm-4">
					<submit-cancel :submitstatus="submitStatus" @dispose="dispose" />
				</div>
			</div>
		</form>
		<!--  now later cancel modal template from vue-js-modal-->
		<v-dialog />
	</div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
// import { twilio } from 'twilio'
import adminheader from '@/components/parts/adminHeader.vue'
import SubmitCancel from '@/components/parts/SubmitCancel.vue'
import { smsService, accountService } from '@/services'

export default {
	components: {
		SubmitCancel,
		adminheader
	},
	mixins: [validationMixin],
	layout: 'admin',
	data() {
		return {
			id: this.$route.params.edit,
			sms_member_type_id: '',
			sms_subject: '',
			sms_body_text: '',
			sms_recp_cnt: '',
			sms_sent: '',
			status: '',
			deleted: '',
			created_dt: '',
			modified_dt: '',

			memberTypes: [],
			perms: [],
			error: '',
			submitStatus: 'Ok'
		}
	},
	validations: {
		sms_subject: {
			required
		},
		sms_body_text: {
			required
		},
		sms_member_type_id: {
			required
		}
	},
	created() {
		smsService.getOne(this.id).then((sms) => {
			this.setInfo(sms)
		})
		accountService.getMemberTypes().then((membertypes) => {
			this.memberTypes = membertypes
		})
		this.getAllAccounts()
	},
	methods: {
		dispose(e) {
			if (e === 'submit') {
				this.handleSubmit()
			} else if (e === 'cancel') {
				this.returnToList()
			}
		},
		getAllAccounts() {
			accountService.getAll().then(
				(accts) => {
					this.accounts = accts
				},
				(error) => {
					this.error = error
				}
			)
		},
		setInfo(u) {
			this.sms_member_type_id = u.sms_member_type_id
			this.sms_body_text = u.sms_body_text
			this.sms_subject = u.sms_subject
			this.sms_recp_cnt = u.sms_recp_cnt
			this.sms_sent = u.sms_sent
		},
		returnToList() {
			this.$router.push('/admin/sms')
		},
		setBody(value) {
			this.sms_body_text = value
			this.$v.sms_body_text.$touch()
		},
		setMember_type_id(value) {
			this.sms_member_type_id = value
			this.$v.sms_member_type_id.$touch()
		},
		setsms_subject(value) {
			this.sms_subject = value
			this.$v.sms_subject.$touch()
		},
		handleSubmit(e) {
			this.submitStatus = ''
			this.$v.$touch()
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				// do your submit logic here
				this.submitStatus = 'PENDING'
				this.openModal()
			}
		},
		openModal() {
			this.$modal.show('dialog', {
				title: 'Do you want to send now or later?',
				text: '',
				buttons: [
					{
						title: 'Save and Send Now',
						handler: () => {
							this.editSMS('sendNow')
						}
					},
					{
						title: 'Save and Send Later',
						default: true, // Will be triggered by default if 'Enter' pressed.
						handler: () => {
							this.editSMS('sendLater')
						} // Button click handler
					},

					{
						title: 'Cancel',
						handler: () => {
							this.submitStatus = ''
							this.$modal.hide('dialog')
						}
					}
				]
			})
		},
		editSMS(send) {
			const { id, sms_member_type_id, sms_subject, sms_body_text } = this
			smsService
				.editOne(id, sms_member_type_id, sms_subject, sms_body_text)
				.then((sms) => {
					if (!sms.error) {
						if (send === 'sendNow') {
							this.sendSMS()
						}
						this.returnToList()
					} else {
						this.submitStatus = 'ERROR'
						this.error = sms.error
					}
				})
		},
		sendSMS() {
			/* function  filterItems - only send email to Status = 1 Deleted = 0 member_type_id */
			function filterItems(accounts, member_type_id) {
				return accounts.filter(function(e) {
					return (
						e.status && e.sms_recipient && e.member_type_id === member_type_id
					)
				})
			}

			const filteredAccounts = filterItems(
				this.accounts,
				this.sms_member_type_id
			)

			const { id, sms_body_text } = this
			smsService.sendSMS(id, sms_body_text, filteredAccounts).then((sms) => {
				if (!sms.error) {
					this.returnToList()
				} else {
					this.submitStatus = 'ERROR'
					this.error = sms.error
				}
			})
		}
	}
}
</script>
