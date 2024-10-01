<template>
	<div class="add">
		<adminheader title="Accounts / Men Edit" />
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
					<label class="form-check-label" for="reset">Change password</label>
				</div>
			</div>
			<br />

			<!-- Password input-->
			<div v-if="reset">
				<div class="form-group">
					<label class="col-sm-4 control-label" for="account_remind"
						>Password:
					</label>
					<div class="col-sm-4">
						<input
							id="account_remind"
							v-model.trim="account_remind"
							type="password"
							class="form-control"
							@input="setPass($event.target.value)"
						/>
						<span v-if="!$v.account_remind.requiredIf" class="error"
							>Field is required</span
						>
						<br />
						<span v-if="!$v.account_remind.minLength" class="error"
							>Password must have at least
							{{ $v.account_remind.$params.minLength.min }} letters.</span
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
							@input="setRepeatPass($event.target.value)"
						/>
						<span v-if="!$v.repeatPass.samePass" class="error"
							>Passwords do not match</span
						>
					</div>
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

			<!-- Member type2 input-->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="member_type2_id">
					Member type 2:</label
				>
				<div class="col-sm-4">
					<b-form-select
						v-model="member_type2_id"
						:options="memberTypes"
						class="mb-3"
						value-field="member_type_id"
						text-field="member_type"
						disabled-field="notEnabled"
						@change="setMember_type2_id($event)"
					></b-form-select>
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
						>Field is required</span
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
						>Field is required</span
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

			<!-- phone input

			<div class="form-group">
				<label class="col-sm-4 control-label" for="account_addr_phone"
					>Phone:
				</label>
				<div class="col-sm-4">
					<input
						id="account_addr_phone"
						v-model.trim="account_addr_phone"
						type="text"
						class="form-control"
						@change="setAccount_addr_phone($event.target.value)"
					/>
					<small class="form-text text-muted">With area code</small>
					<br />
					<span v-if="!$v.account_addr_phone.required" class="error"
						>Field is required</span
					>
				</div>
			</div>
  -->
			<!-- phone input -->
			<div class="form-group">
				<label class="col-md-3 control-label" for="account_addr_phone"
					>Phone:
				</label>
				<div class="col-md-6">
					<MazPhoneNumberInput
						:default-phone-number="account_addr_phone"
						@update="setAccount_addr_phone($event)"
					/>
					<span v-if="!$v.account_addr_phone.required" class="error"
						>Valid Phone Number is required</span
					>
				</div>
			</div>
			<!--
			<div class="form-group">
				<label class="col-md-3 control-label" for="account_addr_phone"
					>Phone:
				</label>
				<div class="col-md-6">
					<vue-tel-input
						v-model="account_addr_phone"
						v-bind="bindProps"
						@input="setAccount_addr_phone($event)"
					></vue-tel-input>
					<span v-if="!$v.account_addr_phone.required" class="error"
						>Field is required</span
					>
				</div>
				account_addr_phone {{ account_addr_phone }}
			</div>
			-->
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

			<div class="col-sm-4">
				<div class="info-frame">
					Last Text Delivered:
					{{ $moment(account_textmsg_opening).format('YYYY-MM-DD h:mm a') }}
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

			<div class="col-sm-4">
				<div class="info-frame">
					Last Newsletter Opening:
					{{ $moment(account_email_opening).format('YYYY-MM-DD h:mm a') }}
				</div>
			</div>

			<!-- Mail recipient input-->
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
					>Image file (not required)</label
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
import moment from 'moment'
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
import { accountService, imageService } from '@/services/'
import { MazPhoneNumberInput } from 'maz-ui'
// const phone = require('phone')

export default {
	name: 'Accountedit',
	components: {
		adminheader,
		SubmitCancel,
		MazPhoneNumberInput,
	},
	mixins: [validationMixin],
	layout: 'admin',
	data() {
		return {
			id: this.$route.params.edit,
			account_email: '',
			account_email_opening: '',
			account_textmsg_opening: '',
			account_remind: '',
			repeatPass: '',
			member_firstname: '',
			member_lastname: '',
			member_nickname: '',
			member_position: '',
			member_prev_club: '',
			member_year: '',
			account_addr_street: '',
			account_addr_street_ext: '',
			account_addr_city: '',
			account_addr_state: '',
			account_addr_country: '',
			account_addr_postal: '',
			account_addr_phone: '',

			member_show_phone: '',
			member_show_addr: '',
			newsletter_recipient: '',
			mail_recipient: '',
			sms_recipient: '',
			member_wall_of_fame_year: '',
			member_pic_path: '',

			member_type_id: '',
			member_type2_id: '',
			member_admin_type_id: '',
			member_admin_type2_id: '',

			file: '',
			years: [],
			account: [],
			memberTypes: [],
			memberAdminTypes: [],
			reset: false,
			submitStatus: 'Ok',
			error: '',
			bindProps: {
				mode: 'international',
				defaultCountry: 'US',
				disabledFetchingCountry: false,
				disabled: false,
				disabledFormatting: false,
				placeholder: 'Enter a phone number',
				required: false,
				enabledCountryCode: false,
				enabledFlags: true,
				preferredCountries: ['US', 'FR', 'AU', 'BR'],
				onlyCountries: [],
				ignoredCountries: [],
				autocomplete: 'off',
				name: 'telephone',
				maxLen: 25,
				wrapperClasses: '',
				inputClasses: 'form-control',
				dropdownOptions: {
					disabledDialCode: false,
				},
				inputOptions: {
					showDialCode: false,
				},
			},
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
			account_remind: {
				requiredIf: requiredIf(function () {
					return this.reset
				}),
				minLength: minLength(8),
			},
			repeatPass: {
				samePass: sameAs('account_remind'),
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
		accountService.getOne(this.id).then((account) => {
			this.account = account
			this.setInfo(account)
		})
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
		setInfo(u) {
			this.member_firstname = u.member_firstname
			this.member_lastname = u.member_lastname
			this.account_email = u.account_email
			this.account_email_opening = u.account_email_opening
			this.account_textmsg_opening = u.account_textmsg_opening
			this.member_year = u.member_year
			this.member_nickname = u.member_nickname
			this.member_position = u.member_position
			this.member_prev_club = u.member_prev_club
			this.account_addr_street = u.account_addr_street
			this.account_addr_street_ext = u.account_addr_street_ext
			this.account_addr_city = u.account_addr_city
			this.account_addr_state = u.account_addr_state
			this.account_addr_country = u.account_addr_country
			this.account_addr_postal = u.account_addr_postal
			// this.account_addr_phone = phone(u.account_addr_phone)[0] // convert - add +1 remove spaces?
			this.account_addr_phone = u.account_addr_phone
			this.member_show_phone = u.member_show_phone
			this.member_show_addr = u.member_show_addr
			this.newsletter_recipient = u.newsletter_recipient
			this.mail_recipient = u.mail_recipient
			this.sms_recipient = u.sms_recipient
			this.member_pic_path = u.member_pic_path
			this.member_wall_of_fame_year = u.member_wall_of_fame_year

			this.member_type_id = u.member_type_id
			this.member_type2_id = u.member_type2_id
			this.member_admin_type_id = u.member_admin_type_id
			this.member_admin_type2_id = u.member_admin_type2_id
		},
		returnToList() {
			this.$router.push('/admin/accounts/men')
		},
		resetPassword() {
			this.reset = !this.reset
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
		setMember_type2_id(value) {
			this.member_type2_id = value
		},
		setMember_admin_type_id(value) {
			this.member_admin_type_id = value
		},
		setMember_admin_type2_id(value) {
			this.member_admin_type2_id = value
		},
		setPass(value) {
			this.account_remind = value
			this.$v.account_remind.$touch()
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
				// do your submit logic here
				this.submitStatus = 'PENDING'
				const {
					id,
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
				accountService
					.editOne(
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

						id
					)
					.then((account) => {
						if (!account.error) {
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
