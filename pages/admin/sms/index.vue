<template>
	<div>
		<adminheader :title="app"></adminheader>
		<span v-if="error" class="text-danger">ERROR: {{ error }}</span>
		<loading v-if="!data" />
		<div v-else>
			<render-list
				:data="data"
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
import { smsService } from '@/services/'
import { getPerms } from '@/helpers'

export default {
	components: {
		adminheader,
		renderList,
		loading,
	},
	layout: 'admin',
	data() {
		return {
			app: 'sms',
			data: null,
			editable: true,
			addable: true,
			deleteable: true,
			statusable: true,
			viewable: true,
			error: '',
		}
	},
	created() {
		this.getAll()
		getPerms(this)
	},
	methods: {
		getAll() {
			smsService.getAll().then(
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
			smsService.deleteOne(id).then()
		},
		changeStatus({ id, status }) {
			const s = status ? '0' : '1'
			smsService.changeStatus(id, s).then()
		},
	},
}
</script>
