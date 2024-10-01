<template>
	<div class="add">
		<common-header title="Accounts / Men Add" />
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

			<!-- accountname input-->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="member_firstname"
					>First name:
				</label>
				<div class="col-sm-5">
					<b-form-input
						id="member_firstname"
						v-model.trim="member_firstname"
						type="text"
						class="form-control"
						autofocus
						@input="setMember_firstname($event)"
					/>
					<span v-if="!$v.member_firstname.required" class="error"
						>First name Field is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-4 control-label" for="member_lastname"
					>Last name:
				</label>
				<div class="col-sm-5">
					<input
						id="member_lastname"
						v-model.trim="member_lastname"
						type="text"
						class="form-control"
						@input="setMember_lastname($event.target.value)"
					/>
					<span v-if="!$v.member_lastname.required" class="error"
						>Last name Field is required</span
					>
				</div>
			</div>

			<!-- email input-->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="account_email"
					>Email:
				</label>
				<div class="col-sm-6">
					<input
						id="account_email"
						v-model.trim="account_email"
						type="email"
						class="form-control"
						@input="setEmail($event.target.value)"
					/>
					<span v-if="!$v.account_email.email" class="error"
						>Invalid email</span
					>
					<span v-if="!$v.account_email.required" class="error"
						>Email Field is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-4 control-label" for="member_year"
					>Year Joined:
				</label>
				<div class="col-sm-4">
					<b-form-select
						v-model="member_year"
						:options="years"
						class="mb-3"
						value-field="yr"
						text-field="yr"
						disabled-field="notEnabled"
					></b-form-select>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-4 control-label" for="member_nickname"
					>Nickname:
				</label>
				<div class="col-sm-5">
					<input
						id="member_nickname"
						v-model.trim="member_nickname"
						type="text"
						class="form-control"
					/>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-4 control-label" for="member_position"
					>Position(s):
				</label>
				<div class="col-sm-5">
					<input
						id="member_position"
						v-model.trim="member_position"
						type="text"
						class="form-control"
					/>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-4 control-label" for="member_prev_club"
					>Previous club(s):
				</label>
				<div class="col-sm-6">
					<input
						id="member_prev_club"
						v-model.trim="member_prev_club"
						type="text"
						class="form-control"
						@input="setPrevClub($event.target.value)"
					/>
				</div>
			</div>

			<!-- Member type input-->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="member_type_id">
					Member type:</label
				>
				<div class="col-sm-4">
					<b-form-select
						v-model="member_type_id"
						:options="memberTypes"
						class="mb-3"
						value-field="member_type_id"
						text-field="member_type"
						disabled-field="notEnabled"
						@change="setMember_type_id($event)"
					></b-form-select>
					<span v-if="!$v.member_type_id.required" class="error"
						>Field is required</span
					>
				</div>
			</div>

			<!-- Member admin type input-->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="member_admin_type_id">
					Admin Role:</label
				>
				<div class="col-sm-4">
					<b-form-select
						v-model="member_admin_type_id"
						:options="memberAdminTypes"
						value-field="member_admin_type_id"
						text-field="member_admin_type"
						disabled-field="notEnabled"
						class="form-control"
						@change="setMember_admin_type_id($event)"
					></b-form-select>
				</div>
			</div>

			<!-- Member admin type2 input-->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="member_admin_type2_id">
					2nd Admin Role:</label
				>
				<div class="col-sm-4">
					<b-form-select
						v-model="member_admin_type2_id"
						:options="memberAdminTypes"
						value-field="member_admin_type_id"
						text-field="member_admin_type"
						disabled-field="notEnabled"
						class="form-control"
						@change="setMember_admin_type2_id($event)"
					></b-form-select>
				</div>
			</div>

			<!-- street input -->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="account_addr_street"
					>Street:
				</label>
				<div class="col-sm-7">
					<input
						id="account_addr_street"
						v-model.trim="account_addr_street"
						type="text"
						class="form-control"
						@input="setAccount_addr_street($event.target.value)"
					/>
					<span v-if="!$v.account_addr_street.required" class="error"
						>Field is required</span
					>
				</div>
			</div>

			<!-- street ext input -->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="account_addr_street_ext"
					>Street Ext:
				</label>
				<div class="col-sm-7">
					<input
						id="account_addr_street_ext"
						v-model.trim="account_addr_street_ext"
						type="text"
						class="form-control"
					/>
				</div>
			</div>

			<!-- city input -->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="account_addr_city"
					>City:
				</label>
				<div class="col-sm-5">
					<input
						id="account_addr_city"
						v-model.trim="account_addr_city"
						type="text"
						class="form-control"
						@input="setAccount_addr_city($event.target.value)"
					/>
					<span v-if="!$v.account_addr_city.required" class="error"
						>Field is required</span
					>
				</div>
			</div>

			<!-- country input -->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="account_addr_country"
					>Country:
				</label>
				<div class="col-sm-4">
					<country-select
						id="account_addr_country"
						v-model="account_addr_country"
						:country="account_addr_country"
						top-country="US"
						class="form-control"
						@input="setAccount_addr_country($event)"
					/>
					<br />
					<span v-if="!$v.account_addr_country.required" class="error"
						>Country is required</span
					>
				</div>
			</div>

			<!-- state / region input -->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="account_addr_state"
					>Region / State:
				</label>
				<div class="col-sm-4">
					<region-select
						id="account_addr_state"
						v-model="account_addr_state"
						:country="account_addr_country"
						:region="account_addr_state"
						class="form-control"
						@input="setAccount_addr_state($event)"
					/>
					<br />
					<span v-if="!$v.account_addr_state.required" class="error"
						>Region / State Field is required</span
					>
				</div>
			</div>

			<!-- postal input -->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="account_addr_postal"
					>Postal:
				</label>
				<div class="col-sm-4">
					<input
						id="account_addr_postal"
						v-model.trim="account_addr_postal"
						type="text"
						class="form-control"
						@input="setAccount_addr_postal($event.target.value)"
					/>
					<span v-if="!$v.account_addr_postal.required" class="error"
						>Field is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-md-3 control-label" for="account_addr_phone"
					>Phone:
				</label>
				<div class="col-md-6">
					<MazPhoneNumberInput
						default-phone-number=""
						default-country-code="US"
						hint="Use 716 555 1111 if unknown"
						show-code-on-list
						@update="setAccount_addr_phone($event)"
					/>
					<span v-if="!$v.account_addr_phone.required" class="error"
						>Valid Phone Number is required</span
					>
				</div>
			</div>

			<!-- show phone -->
			<div class="form-group">
				<label class="col-md-3 control-label" for="member_show_phone"
					>Show phone:</label
				>
				<div class="col-md-3">
					<select
						id="member_show_phone"
						v-model="member_show_phone"
						class="form-control"
					>
						<option value="1">Yes</option>
						<option value="0">No</option>
					</select>
				</div>
			</div>

			<!-- show address -->
			<div class="form-group">
				<label class="col-md-3 control-label" for="member_show_addr"
					>Show address:</label
				>
				<div class="col-md-3">
					<select
						id="member_show_addr"
						v-model="member_show_addr"
						class="form-control"
					>
						<option value="1">Yes</option>
						<option value="0">No</option>
					</select>
				</div>
			</div>

			<!-- sms recip -->
			<div class="form-group">
				<label class="col-md-3 control-label" for="sms_recipient"
					>Text recipient:</label
				>
				<div class="col-md-3">
					<select
						id="sms_recipient"
						v-model="sms_recipient"
						class="form-control"
					>
						<option value="1">Yes</option>
						<option value="0">No</option>
					</select>
				</div>
			</div>

			<!-- Newsletter recipient input-->
			<div class="form-group">
				<label class="col-md-3 control-label" for="newsletter_recipient">
					Receive Newsletter:</label
				>
				<div class="col-md-3">
					<select v-model="newsletter_recipient" class="form-control">
						<option value="1">Yes</option>
						<option value="0">No</option>
					</select>
				</div>
			</div>

			<!-- mail recipient input-->
			<div class="form-group">
				<label class="col-md-3 control-label" for="mail_recipient">
					Receive mail:</label
				>
				<div class="col-md-3">
					<select v-model="mail_recipient" class="form-control">
						<option value="1">Yes</option>
						<option value="0">No</option>
					</select>
				</div>
			</div>

			<!-- wall of fame year -->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="member_wall_of_fame_year"
					>Wall of Fame Year:
				</label>
				<div class="col-sm-4">
					<b-form-select
						id="member_wall_of_fame_year"
						v-model="member_wall_of_fame_year"
						:options="years"
						class="form-control"
						disabled-field="notEnabled"
					></b-form-select>
				</div>
			</div>

			<!-- image file upload -->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="filepath"
					>Square Image file (not required)</label
				>
				<div class="col-sm-4">
					<input
						id="filepath"
						ref="file"
						class="form-control-file"
						name="filepath"
						type="file"
						@change="handleFileUpload()"
					/>
				</div>
			</div>

			<!-- image file  -->
			<div class="form-group">
				<div class="col-sm-4">
					<input id="member_pic_path" name="member_pic_path" type="hidden" />
					<p>
						Current file {{ member_pic_path }}
						<img :src="member_pic_path" />
					</p>
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
import { required, email } from 'vuelidate/lib/validators'
import moment from 'moment'
import CommonHeader from '@/components/parts/commonHeader.vue'
import SubmitCancel from '@/components/parts/SubmitCancel.vue'
import { accountService, imageService } from '@/services/'
import { MazPhoneNumberInput } from 'maz-ui'

export default {
	name: 'Accountadd',
	components: {
		CommonHeader,
		SubmitCancel,
		MazPhoneNumberInput,
	},
	mixins: [validationMixin],
	layout: 'admin',
	data() {
		return {
			account_email: '',
			account_remind: 'canisiusrugby1987',
			member_firstname: '',
			member_lastname: '',
			member_year: moment().format('YYYY'),
			member_nickname: '',
			member_position: '',
			member_prev_club: '',
			account_addr_street: '',
			account_addr_street_ext: '',
			account_addr_city: '',
			account_addr_state: '',
			account_addr_country: '',
			account_addr_postal: '',
			account_addr_phone: '',
			member_show_phone: '1',
			member_show_addr: '1',
			newsletter_recipient: '1',
			mail_recipient: '0',
			sms_recipient: '1',
			member_pic_path: '',
			member_wall_of_fame_year: '',
			member_type_id: '9',
			member_type2_id: '',
			member_admin_type_id: '0',
			member_admin_type2_id: '0',

			file: '',
			years: [],
			memberTypes: [],
			memberAdminTypes: [],
			submitStatus: 'Ok',
			error: '',
			results: '',
		}
	},
	validations() {
		return {
			account_email: {
				required,
				email,
			},
			member_firstname: {
				required,
			},
			member_lastname: {
				required,
			},
			account_addr_street: {
				required,
			},
			account_addr_city: {
				required,
			},
			account_addr_state: {
				required,
			},
			account_addr_country: {
				required,
			},
			account_addr_phone: {
				required,
			},
			account_addr_postal: {
				required,
			},
			newsletter_recipient: {
				required,
			},
			mail_recipient: {
				required,
			},
			member_type_id: {
				required,
			},
		}
	},
	created() {
		accountService.getMemberTypes().then((membertypes) => {
			this.memberTypes = membertypes
		})
		accountService.getMemberAdminTypes().then((memberadmintypes) => {
			this.memberAdminTypes = memberadmintypes
		})
		this.createYears()
	},
	methods: {
		handleFileUpload() {
			this.file = this.$refs.file.files[0]
			imageService.getWofImage(this.file).then(
				(url) => {
					this.member_pic_path = url.imageUrl
				},
				(error) => {
					this.error = error
				}
			)
		},
		createYears() {
			const years = []
			const thisyear = parseInt(moment().format('YYYY'))
			for (let year = 1966; year <= thisyear; year++) {
				years.push(year)
			}
			this.years = years
		},
		dispose(e) {
			if (e === 'submit') {
				this.handleSubmit()
			} else if (e === 'cancel') {
				this.returnToList()
			}
		},
		returnToList() {
			this.$router.push('/admin/accounts/men')
		},
		setMember_firstname(value) {
			this.member_firstname = value
			this.$v.member_firstname.$touch()
		},
		setMember_lastname(value) {
			this.member_lastname = value
			this.$v.member_lastname.$touch()
		},
		setEmail(value) {
			this.account_email = value
			this.$v.account_email.$touch()
		},
		setPrevClub(value) {
			this.member_prev_club = value
		},
		setAccount_addr_street(value) {
			this.account_addr_street = value
			this.$v.account_addr_street.$touch()
		},
		setAccount_addr_city(value) {
			this.account_addr_city = value
			this.$v.account_addr_city.$touch()
		},
		setAccount_addr_state(value) {
			this.account_addr_state = value
			this.$v.account_addr_state.$touch()
		},
		setAccount_addr_country(value) {
			this.account_addr_country = value
			this.$v.account_addr_country.$touch()
		},
		setAccount_addr_postal(value) {
			this.account_addr_postal = value
			this.$v.account_addr_postal.$touch()
		},
		setAccount_addr_phone(value) {
			if (value.isValid) {
				this.account_addr_phone = value.e164
			} else {
				this.account_addr_phone = ''
			}
			this.$v.account_addr_phone.$touch()
		},
		setNewsletter_recipient(value) {
			this.newsletter_recipient = value
			this.$v.newsletter_recipient.$touch()
		},
		setMail_recipient(value) {
			this.mail_recipient = value
			this.$v.mail_recipient.$touch()
		},
		setMember_type_id(value) {
			this.member_type_id = value
			this.$v.member_type_id.$touch()
		},
		setMember_admin_type_id(value) {
			this.member_admin_type_id = value
		},
		setMember_admin_type2_id(value) {
			this.member_admin_type2_id = value
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
					account_email,
					account_remind,
					member_firstname,
					member_lastname,
					member_year,
					member_nickname,
					member_position,
					member_prev_club,
					account_addr_street,
					account_addr_street_ext,
					account_addr_city,
					account_addr_state,
					account_addr_country,
					account_addr_postal,
					account_addr_phone,
					member_show_addr,
					member_show_phone,
					newsletter_recipient,
					mail_recipient,
					sms_recipient,
					member_pic_path,
					member_wall_of_fame_year,

					member_type_id,
					member_type2_id,
					member_admin_type_id,
					member_admin_type2_id,
				} = this
				// eslint-disable-next-line no-console
				/*
				console.log({
					account_email,
					account_remind,
					member_firstname,
					member_lastname,
					member_year,
					member_nickname,
					member_position,
					member_prev_club,
					account_addr_street,
					account_addr_street_ext,
					account_addr_city,
					account_addr_state,
					account_addr_country,
					account_addr_postal,
					account_addr_phone,
					member_show_addr,
					member_show_phone,
					newsletter_recipient,
					mail_recipient,
					sms_recipient,
					member_pic_path,
					member_wall_of_fame_year,

					member_type_id,
					member_type2_id,
					member_admin_type_id,
					member_admin_type2_id,
				})
				*/
				accountService
					.addOne(
						account_email,
						account_remind,
						member_firstname,
						member_lastname,
						member_nickname,
						member_position,
						member_prev_club,
						member_year,
						account_addr_street,
						account_addr_street_ext,
						account_addr_city,
						account_addr_state,
						account_addr_country,
						account_addr_postal,
						account_addr_phone,
						member_show_addr,
						member_show_phone,
						newsletter_recipient,
						mail_recipient,
						sms_recipient,
						member_pic_path,
						member_wall_of_fame_year,

						member_type_id,
						member_type2_id,
						member_admin_type_id,
						member_admin_type2_id
					)
					.then((account) => {
						if (!account.error) {
							this.submitStatus = 'OK'
							this.returnToList()
						} else {
							this.submitStatus = 'ERROR'
							this.error = account.error
						}
					})
			}
		},
	},
}
</script>
