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
							value-field="yr"
							text-field="yr"
							disabled-field="notEnabled"
							class="form-control"
							@change="setDate($event)"
						></b-form-select>
					</div>
				</div>
			</form>
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
import moment from 'moment'
import adminheader from '@/components/parts/adminHeader'
import renderList from '@/components/parts/renderList.vue'
import { contributionService } from '@/services/'
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
			app: 'contributions',
			data: null,
			editable: false,
			addable: false,
			deleteable: false,
			statusable: false,
			viewable: true,
			error: '',
			year: moment().format('YYYY'),
			years: [],
		}
	},
	created() {
		this.getYearContributions(this.year)
		getPerms(this)
		if (this.$store.state.contributions.year) {
			this.year = this.$store.state.contributions.year
		} else {
			// today year
			this.year = moment().format('YYYY')
			this.$store.commit('contributions/saveyear', this.year)
		}
		this.createYears()
	},
	methods: {
		createYears() {
			const years = []
			const thisyear = parseInt(moment().format('YYYY'))
			for (let year = 2012; year <= thisyear; year++) {
				years.push(year)
			}
			this.years = years
		},
		setDate(value) {
			this.year = value
			this.$store.commit('contributions/saveyear', value)
			this.getYearContributions(value)
		},
		getYearContributions(yr) {
			contributionService.getYearContributions(yr).then(
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
			contributionService.deleteOne(id).then()
			// this.getYear(this.year)
		},
		changeStatus({ id, status }) {
			const s = status ? '0' : '1'
			contributionService.changeStatus(id, s).then()
		},
	},
}
</script>
