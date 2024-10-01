<template>
	<div>
		<adminheader :title="app"></adminheader>
		<span v-if="error" class="text-danger">ERROR: {{ error }}</span>
		<loading v-if="!data" />
		<div v-else>
			<form>
				<div class="form-group row justify-content-center">
					<div class="col-sm-4">
						<b-form-select
							v-model="year"
							:options="years"
							disabled-field="notEnabled"
							class="form-control"
							@change="setYear($event)"
						></b-form-select>
					</div>
				</div>
			</form>

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
import moment from 'moment'
import loading from '@/components/parts/loading'
import adminheader from '@/components/parts/adminHeader'
import renderList from '@/components/parts/renderList.vue'
import { newsService } from '@/services/'
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
			app: 'news',
			data: null,
			editable: false,
			addable: false,
			deleteable: false,
			statusable: false,
			viewable: true,
			error: '',
			year: 2004,
			years: '',
		}
	},
	computed: {
		filteredData() {
			return this.data.filter(function (d) {
				// eslint-disable-next-line eqeqeq
				return moment(d.dt).format('YYYY') == this.year
			}, this)
		},
	},
	created() {
		this.getAll()
		getPerms(this)
		if (this.$store.state.news.year) {
			this.year = this.$store.state.news.year
		} else {
			// today years
			this.year = parseInt(moment().format('YYYY'))
		}
		this.createYears()
	},
	methods: {
		createYears() {
			const years = []
			const thisyear = parseInt(moment().format('YYYY'))
			for (let year = 2004; year <= thisyear; year++) {
				years.push(year)
			}
			this.years = years
		},
		setYear(value) {
			this.year = value
			this.$store.commit('news/saveyear', value)
		},
		getAll() {
			newsService.getAll().then(
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
			newsService.deleteOne(id).then()
		},
		changeStatus({ id, status }) {
			const s = status ? '0' : '1'
			newsService.changeStatus(id, s).then()
		},
	},
}
</script>
