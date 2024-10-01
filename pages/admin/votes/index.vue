<template>
	<div>
		<adminheader :title="app"></adminheader>
		<span v-if="error" class="text-danger">ERROR: {{ error }}</span>
		<loading v-if="!data" />
		<div v-else>
			<div class="info-frame">
				<p>1. Change status of old votes to inactive</p>
				<p>2. Create new voting questions</p>
				<p>
					3. Send newsletter to voters containing this link:
					"/admin/votes/start"
				</p>
			</div>
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
import { votesService } from '@/services/'
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
			app: 'votes',
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
			votesService.getAll().then(
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
			votesService.deleteOne(id).then()
			// this.getAll()
		},
		changeStatus({ id, status }) {
			const s = status ? '0' : '1'
			votesService.changeStatus(id, s).then()
		},
	},
}
</script>
