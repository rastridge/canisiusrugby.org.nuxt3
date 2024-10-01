<template>
	<div>
		<adminheader :title="app"></adminheader>
		<span v-if="error" class="text-danger">ERROR: {{ error }}</span>
		<loading v-if="!data" />
		<div v-else>
			<button type="button" class="btn btn-primary btn-xs" @click="makeLabels">
				Make labels
			</button>
			<br />
			<br />
			<h1>Filter by:</h1>
			<b-form>
				<b-form-group>
					<b-form-radio-group v-model="yes_email" @change.native="setTable">
						Good Email
						<b-form-radio :value="1">Yes </b-form-radio>
						<b-form-radio :value="0">No </b-form-radio>
						<b-form-radio :value="2">NA </b-form-radio>
					</b-form-radio-group>
				</b-form-group>

				<b-form-group>
					<b-form-radio-group
						v-model="yes_marked_for_email"
						@change.native="setTable"
					>
						Marked for emailing
						<b-form-radio :value="1">Yes </b-form-radio>
						<b-form-radio :value="0">No </b-form-radio>
						<b-form-radio :value="2">NA </b-form-radio>
					</b-form-radio-group>
				</b-form-group>

				<b-form-group>
					<b-form-radio-group
						v-model="yes_email_opened"
						@change.native="setTable"
					>
						Email Opened in last 90 days
						<b-form-radio :value="1">Yes </b-form-radio>
						<b-form-radio :value="0">No </b-form-radio>
						<b-form-radio :value="2">NA </b-form-radio>
					</b-form-radio-group>
				</b-form-group>

				<b-form-group>
					<b-form-radio-group v-model="yes_address" @change.native="setTable">
						Good Address
						<b-form-radio :value="1">Yes </b-form-radio>
						<b-form-radio :value="0">No </b-form-radio>
						<b-form-radio :value="2">NA </b-form-radio>
					</b-form-radio-group>
				</b-form-group>

				<b-form-group>
					<b-form-radio-group
						v-model="yes_marked_for_mail"
						@change.native="setTable"
					>
						Marked for mailing
						<b-form-radio :value="1">Yes </b-form-radio>
						<b-form-radio :value="0">No </b-form-radio>
						<b-form-radio :value="2">NA </b-form-radio>
					</b-form-radio-group>
				</b-form-group>

				<b-form-group>
					<b-form-radio-group v-model="yes_donated" @change.native="setTable">
						Donated
						<b-form-radio :value="1">Yes </b-form-radio>
						<b-form-radio :value="0">No </b-form-radio>
						<b-form-radio :value="2">NA </b-form-radio>
					</b-form-radio-group>
				</b-form-group>
			</b-form>
			Alumni only - member_type_id = '3'<br />
			Data count = {{ data.length }}<br />
			<br />

			<b-table
				striped
				hover
				small
				responsive
				dark
				:items="filteredData"
				:fields="fields"
				caption-top
			>
				<template v-slot:table-caption
					><h1 class="text-center">
						{{ filteredData.length }} with selected criteria
					</h1></template
				>
			</b-table>
		</div>
	</div>
</template>

<script>
import loading from '@/components/parts/loading'
import moment from 'moment'
import adminheader from '@/components/parts/adminHeader'
import { memberinfoService } from '@/services/'
import { getPerms } from '@/helpers'

export default {
	components: {
		adminheader,
		loading,
	},
	layout: 'admin',
	data() {
		return {
			app: 'member_info',
			data: null,
			filteredData: [],
			fields: [
				{
					key: 'name',
					label: '',
				},
				{
					key: 'dt',
					label: 'Modified',
					formatter: (value) => {
						return moment(value).format('YYYY MMM D')
					},
				},
				{
					key: 'account_addr_phone',
					label: 'Phone',
				},
				{
					key: 'account_email',
					label: 'Email',
				},
				{
					key: 'account_email_opening',
					label: 'Email Opened',
					formatter: (value) => {
						return moment(value).format('YYYY MMM D h:mm a')
					},
				},
				{
					key: 'newsletter_recipient',
					label: 'Newsltr',
					formatter: (value) => {
						return value ? 'Y' : 'N'
					},
				},
				{
					key: 'account_addr_street',
					label: 'Street',
				},
				{
					key: 'mail_recipient',
					label: 'US Email',
					formatter: (value) => {
						return value ? 'Y' : 'N'
					},
				},
			],
			yes_email: '2',
			yes_marked_for_email: '2',
			yes_address: '2',
			yes_email_opened: '2',
			yes_donated: '2',
			yes_marked_for_mail: '2',
			member_type_id: '3',
			error: '',
		}
	},
	created() {
		this.getAll()
		getPerms(this)
		this.setTable()
	},
	methods: {
		makeLabels() {
			this.$router.push('/admin/member_info/makelabels')
		},
		setTable() {
			this.filteredData = []
			let temp = this.data
			temp = temp.filter((d) => this.memberType(d.member_type_id))
			/* **********  yes email ************* */
			if (this.yes_email !== '2') {
				// eslint-disable-next-line eqeqeq
				if (this.yes_email == '1') {
					temp = temp.filter((d) => this.yesEmail(d.account_email))
					// eslint-disable-next-line eqeqeq
				} else if (this.yes_email == '0') {
					temp = temp.filter((d) => this.noEmail(d.account_email))
				}
			} else {
				// eslint-disable-next-line no-self-assign
				// temp = temp.filter((d) => this.noEmail(d.newsletter_recipient))
			}

			/* **********  marked_for_email ************* */
			if (this.yes_marked_for_email !== '2') {
				// eslint-disable-next-line eqeqeq
				if (this.yes_marked_for_email == '1') {
					temp = temp.filter((d) =>
						this.yesMarkedforemail(d.newsletter_recipient)
					)
					// eslint-disable-next-line eqeqeq
				} else if (this.yes_marked_for_email == '0') {
					temp = temp.filter((d) =>
						this.noMarkedforemail(d.newsletter_recipient)
					)
				}
			} else {
				// eslint-disable-next-line no-self-assign
				// temp = temp
			}

			/* **********  yes address ************* */
			if (this.yes_address !== '2') {
				// eslint-disable-next-line eqeqeq
				if (this.yes_address == '1') {
					temp = temp.filter((d) => this.yesAddress(d.account_addr_street))
					// eslint-disable-next-line eqeqeq
				} else if (this.yes_address == '0') {
					temp = temp.filter((d) => this.noAddress(d.account_addr_street))
				}
			} else {
				// eslint-disable-next-line no-self-assign
				// temp = temp.filter((d) => this.noaddress(d.newsletter_recipient))
			}

			/* **********  marked_for_Mail ************* */
			if (this.yes_marked_for_mail !== '2') {
				// eslint-disable-next-line eqeqeq
				if (this.yes_marked_for_mail == '1') {
					temp = temp.filter((d) => this.yesMarkedformail(d.mail_recipient))
					// eslint-disable-next-line eqeqeq
				} else if (this.yes_marked_for_mail == '0') {
					temp = temp.filter((d) => this.noMarkedformail(d.mail_recipient))
				}
			} else {
				// eslint-disable-next-line no-self-assign
				// temp = temp
			}

			/* **********  yes_email_opened ************* */
			if (this.yes_email_opened !== '2') {
				// eslint-disable-next-line eqeqeq
				if (this.yes_email_opened == '1') {
					temp = temp.filter((d) =>
						this.yesEmailopenedlately(d.account_email_opening)
					)
					// eslint-disable-next-line eqeqeq
				} else if (this.yes_email_opened == '0') {
					temp = temp.filter((d) =>
						this.noEmailopenedlately(d.account_email_opening)
					)
				}
			} else {
				// eslint-disable-next-line no-self-assign
				// temp = temp
			}

			/* **********  yes_donated ************* */
			if (this.yes_donated !== '2') {
				// eslint-disable-next-line eqeqeq
				if (this.yes_donated == '1') {
					temp = temp.filter((d) => this.yesDonated(d.donation_cnt))
					// eslint-disable-next-line eqeqeq
				} else if (this.yes_donated == '0') {
					temp = temp.filter((d) => this.noDonated(d.donation_cnt))
				}
			} else {
				// eslint-disable-next-line no-self-assign
				// temp = temp
			}
			this.filteredData = temp
		},
		memberType(member_type_id) {
			// eslint-disable-next-line eqeqeq
			return member_type_id == this.member_type_id
		},
		yesEmail(account_email) {
			return !(
				/\bnon/i.test(account_email) ||
				/\non./i.test(account_email) ||
				/\bbad/i.test(account_email) ||
				/local/i.test(account_email) ||
				!/[@]/i.test(account_email) ||
				account_email === ''
			)
		},
		noEmail(account_email) {
			return (
				/\bnon/i.test(account_email) ||
				/\non./i.test(account_email) ||
				/\bbad/i.test(account_email) ||
				/local/i.test(account_email) ||
				!/[@]/i.test(account_email) ||
				account_email === ''
			)
		},
		yesAddress(account_addr_street) {
			// `account_addr_street` NOT LIKE 'bad%' and `account_addr_street` NOT LIKE ''
			// eslint-disable-next-line eqeqeq
			return !(/\bbad/i.test(account_addr_street) || account_addr_street === '')
		},
		noAddress(account_addr_street) {
			// eslint-disable-next-line eqeqeq
			return /\bbad/i.test(account_addr_street) || account_addr_street === ''
		},
		yesMarkedformail(mail_recipient) {
			// eslint-disable-next-line eqeqeq
			return mail_recipient == 1
		},
		noMarkedformail(mail_recipient) {
			// eslint-disable-next-line eqeqeq
			return mail_recipient == 0
		},
		yesMarkedforemail(newsletter_recipient) {
			// eslint-disable-next-line eqeqeq
			return newsletter_recipient == 1
		},
		noMarkedforemail(newsletter_recipient) {
			// eslint-disable-next-line eqeqeq
			return newsletter_recipient == 0
		},
		yesDonated(donation_cnt) {
			return donation_cnt > 0
		},
		noDonated(donation_cnt) {
			// eslint-disable-next-line eqeqeq
			return donation_cnt == 0
		},
		yesEmailopenedlately(account_email_opening) {
			const days = moment().diff(moment(account_email_opening), 'days')
			return days < 90
		},
		noEmailopenedlately(account_email_opening) {
			const days = moment().diff(moment(account_email_opening), 'days')
			return days >= 90
		},
		getAll() {
			memberinfoService.getAll().then(
				(data) => {
					// this.$store.commit('data/savedata', data)
					this.data = data
				},
				(error) => {
					this.error = error
				}
			)
		},
	},
}
</script>
