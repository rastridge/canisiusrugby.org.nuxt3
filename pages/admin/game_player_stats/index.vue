<template>
	<div>
		<adminheader :title="app"></adminheader>
		<span v-if="error" class="text-danger">ERROR: {{ error }}</span>
		<loading v-if="!data" />
		<div v-else>
			<div class="row">
				<div class="col-sm-12">
					<div class="text-center">
						<form>
							<div class="form-group row justify-content-center">
								<div class="col-sm-4">
									<b-form-select
										v-model="season"
										:options="seasons"
										value-field="season"
										text-field="season.season"
										@change="setDate($event)"
									></b-form-select>
								</div>
							</div>
						</form>
					</div>
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
import moment from 'moment'
import adminheader from '@/components/parts/adminHeader'
import renderList from '@/components/parts/renderList.vue'
import { statsService } from '@/services/'
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
			app: 'game_player_stats',
			data: null,
			pageOfData: [],
			editable: false,
			addable: false,
			deleteable: false,
			statusable: false,
			viewable: true,
			error: '',
			season: {},
			seasons: [],
		}
	},
	computed: {
		filteredData() {
			const filtered = this.data.filter(function (d) {
				const year1 = moment(d.date).format('YYYY')
				const year2 = moment(d.date).add(-1, 'year').format('YYYY')
				const consecutive = this === year1 || this === year2
				return consecutive
			}, this.season.year)
			const filtered2 = filtered.filter(function (d) {
				let year1 = moment(this).format('YYYY')
				let year2 = moment(this).add(1, 'year').format('YYYY')
				year1 = year1 + '-08-01'
				year2 = year2 + '-07-31'
				const between = moment(d.date).isBetween(year1, year2, 'day', '[]')
				return between
			}, this.season.year)
			return filtered2.reverse(function (a, b) {
				return a.date - b.date
			})
		},
	},
	created() {
		this.currentSeason()
		this.getYear(this.season.year)
		getPerms(this)
		this.makeSeasons()
	},
	methods: {
		setDate(value) {
			this.season = value
			this.$store.commit('stats/saveseason', value)
			this.getYear(this.season.year)
		},
		getAll() {
			statsService.getAll().then(
				(data) => {
					// this.$store.commit('data/savedata', data)
					this.data = data
				},
				(error) => {
					this.error = error
				}
			)
		},
		getYear(year) {
			statsService.getYear(year).then(
				(data) => {
					// this.$store.commit('data/savedata', data)
					this.data = data
				},
				(error) => {
					this.error = error
				}
			)
		},
		onChangePage(pageOfItems) {
			this.pageOfData = pageOfItems
		},
		currentSeason() {
			if (this.$store.state.stats.season) {
				this.season = this.$store.state.stats.season
			} else {
				const year1 = moment()
				const year2 = moment(year1).add(1, 'year')

				this.season.year = year1.format('YYYY')
				this.season.season = year1.format('YYYY') + '-' + year2.format('YYYY')
			}
		},
		makeSeasons() {
			// eslint-disable-next-line prefer-const
			let seasons = []
			const thisyear = parseInt(moment().format('YYYY'))
			for (let y = thisyear; y >= 1966; y--) {
				const year1 = moment(y.toString())
				const year2 = moment(year1).add(1, 'year')
				seasons.push({
					season: {
						year: year1.format('YYYY'),
						season: year1.format('YYYY') + '-' + year2.format('YYYY'),
					},
				})
			}
			this.seasons = seasons
		},
		addItem() {
			this.$router.push(`/admin/${this.app}/add`)
		},
		deleteItem(id) {
			statsService.deleteOne(id).then(this.getYear(this.season.year))
		},
		changeStatus({ id, status }) {
			const s = status ? '0' : '1'
			statsService.changeStatus(id, s).then()
		},
	},
}
</script>
