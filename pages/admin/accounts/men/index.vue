<template>
	<div>
		<adminheader :title="app"></adminheader>
		<span v-if="error" class="text-danger">ERROR: {{ error }}</span>
		<loading v-if="!data" />
		<div v-else>
			<!-- Member type input-->
			<form>
				<div class="form-group row justify-content-center">
					<div class="col-sm-4">
						<b-form-select
							v-model="member_type_id"
							:options="memberTypes"
							value-field="member_type_id"
							text-field="member_type"
							@change="setMember_type_id($event)"
						></b-form-select>
					</div>
				</div>

				<div class="form-group row justify-content-center">
					<div class="col-sm-4">
						<b-form-select
							v-model="alpha"
							:options="alphas"
							@change="setAlpha($event)"
						></b-form-select>
					</div>
				</div>
			</form>

			<div class="row justify-content-center">
				<div class="col-sm-8">
					<lookup-by-email />
				</div>
			</div>

			<render-list
				:data="filteredData"
				:app="app"
				:statusable="statusable"
				:editable="editable"
				:deleteable="deleteable"
				:addable="addable"
				:viewable="viewable"
				@changeStatus="changeStatus"
				@deleteItem="deleteItem"
				@addItem="addItem"
			/>
		</div>
	</div>
</template>

<script>
import loading from '@/components/parts/loading'
import adminheader from '@/components/parts/adminHeader'
import renderList from '@/components/parts/renderList.vue'
import LookupByEmail from '@/components/parts/LookupByEmail'
import { accountService } from '@/services/'
import { getPerms } from '@/helpers'

export default {
	components: {
		adminheader,
		LookupByEmail,
		renderList,
		loading,
	},
	layout: 'admin',
	data() {
		return {
			account: {},
			account_email: 'xxx',
			app: 'accounts/men',
			data: null,
			// filteredData: [],
			editable: false,
			addable: false,
			deleteable: false,
			statusable: false,
			viewable: true,
			error: '',
			member_type_id: '9',
			memberTypes: [],
			alpha: 'a',
			alphas: [
				{ text: 'All', value: 'a' },
				'A',
				'B',
				'C',
				'D',
				'E',
				'F',
				'G',
				'H',
				'I',
				'J',
				'K',
				'L',
				'M',
				'N',
				'O',
				'P',
				'Q',
				'R',
				'S',
				'T',
				'U',
				'V',
				'W',
				'X',
				'Y',
				'Z',
			],
		}
	},
	computed: {
		filteredData() {
			let temp = []
			if (this.alpha !== 'a') {
				temp = this.data.filter(function (d) {
					// eslint-disable-next-line eqeqeq
					return d.member_type_id == this
				}, this.member_type_id)

				return temp.filter(function (d) {
					// eslint-disable-next-line eqeqeq
					return d.member_lastname[0] == this
				}, this.alpha)
			} else {
				temp = this.data.filter(function (d) {
					// eslint-disable-next-line eqeqeq
					return d.member_type_id == this
				}, this.member_type_id)
			}
			return temp
		},
	},

	created() {
		this.getAll()
		getPerms(this)
		accountService.getMemberTypes().then((membertypes) => {
			this.memberTypes = membertypes
		})
		if (this.$store.state.accounts.type) {
			this.member_type_id = this.$store.state.accounts.type
		} else {
			this.member_type_id = '9'
		}
		if (this.$store.state.accounts.alpha) {
			this.alpha = this.$store.state.accounts.alpha
		} else {
			this.alpha = 'a'
		}
	},
	methods: {
		lookupByEmail(email) {
			accountService.lookupByEmail(email).then(
				(data) => {
					this.account = data
				},
				(error) => {
					this.error = error
				}
			)
		},
		setMember_type_id(value) {
			this.member_type_id = value
			this.$store.commit('accounts/savetype', value)
		},
		setAlpha(value) {
			this.alpha = value
			this.$store.commit('accounts/savealpha', value)
		},
		getAll() {
			accountService.getAll().then(
				(data) => {
					this.data = data
				},
				(error) => {
					this.error = error
				}
			)
		},
		addItem() {
			this.$router.push(`/admin/${this.app}/add`)
		},
		deleteItem(id) {
			accountService.deleteOne(id).then()
		},
		changeStatus({ id, status }) {
			const s = status ? '0' : '1'
			accountService.changeStatus(id, s).then()
		},
	},
}
</script>
