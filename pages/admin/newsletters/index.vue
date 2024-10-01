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
import moment from 'moment'
import adminheader from '@/components/parts/adminHeader'
import renderList from '@/components/parts/renderList.vue'
import { newsletterService } from '@/services/'
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
			app: 'newsletters',
			data: null,
			editable: false,
			addable: false,
			deleteable: false,
			statusable: false,
			viewable: true,
			error: '',
			year: 2004,
			years: [],
		}
	},
	computed: {
		filteredData() {
			return this.data.filter(function (d) {
				// eslint-disable-next-line eqeqeq
				return moment(d.dt).format('YYYY') == this
			}, this.year)
		},
	},
	created() {
		this.getAll()
		getPerms(this)
		if (this.$store.state.newsletters.year) {
			this.year = this.$store.state.newsletters.year
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
			this.$store.commit('newsletters/saveyear', value)
		},
		getAll() {
			newsletterService.getAll().then(
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
			newsletterService.deleteOne(id).then()
		},
		changeStatus({ id, status }) {
			const s = status ? '0' : '1'
			newsletterService.changeStatus(id, s).then()
		},
	},
}
</script>
