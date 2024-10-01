/* eslint-disable vue/no-v-html */
<template>
	<div class="Supporting Accounts">
		<adminheader :title="app"></adminheader>
		<span v-if="error" class="text-danger">ERROR: {{ error }}</span>
		<loading v-if="!data" />
		<div v-else>
			<b-button size="md" variant="primary" class="mb-4" @click="returnToList">
				Return to Supporting Accounts Management
			</b-button>

			<div class="row">
				<div class="col-sm-12">
					<div v-if="data">
						<b-table
							hover
							striped
							dark
							outlined
							small
							responsive
							text-nowrap
							:fields="fields"
							:items="data"
						>
							<!-- A custom formatted column -->
							<template #cell(supportingApp_url)="data">
								<a :href="data.value" target="_blank">{{ data.value }}</a>
							</template></b-table
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import loading from '@/components/parts/loading'
import adminheader from '@/components/parts/adminHeader'
import { supportingaccountsService } from '@/services/'

export default {
	name: 'Supporting',
	components: {
		adminheader,
		loading,
	},
	layout: 'admin',
	data() {
		return {
			app: 'supporting_accounts',
			data: null,
			error: '',
			fields: [
				{
					key: 'title',
					label: 'Title',
					sortable: true,
					sortDirection: 'desc',
				},
				{
					key: 'supportingApp_description',
					label: 'Description',
				},
				{
					key: 'supportingApp_url',
					label: 'URL',
				},
				{
					key: 'supportingApp_owner',
					label: 'Owner',
				},
				{
					key: 'supportingApp_username',
					label: 'Username',
				},
				{
					key: 'supportingApp_password',
					label: 'Password',
				},
			],
		}
	},
	created() {
		this.getAllCurrent()
	},
	methods: {
		getAllCurrent() {
			supportingaccountsService.getAllCurrent().then(
				(data) => {
					this.data = data
				},
				(error) => {
					this.error = error
				}
			)
		},
		returnToList() {
			this.$router.push('/admin/supporting_accounts/')
		},
	},
}
</script>
