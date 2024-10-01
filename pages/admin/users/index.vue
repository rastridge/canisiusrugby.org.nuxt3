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
import { userService } from '@/services/'
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
			app: 'users',
			data: null,
			editable: false,
			addable: false,
			deleteable: false,
			statusable: false,
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
			userService.getAll().then(
				(data) => {
					// this.$store.commit('data/savedata', data)
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
			userService.deleteOne(id).then()
			// this.getAll()
		},
		changeStatus({ id, status }) {
			const s = status ? '0' : '1'
			userService.changeStatus(id, s).then()
		},
	},
}
</script>
