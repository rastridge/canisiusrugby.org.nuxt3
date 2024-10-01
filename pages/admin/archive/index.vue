<template>
	<div>
		<adminheader :title="app"></adminheader>

		<span v-if="error" class="text-danger">ERROR: {{ error }}</span>

		<div class="form-group">
			<label class="col-sm-4 control-label" for="year"></label>
			<div class="col-sm-4">
				<b-form-select
					v-model="year"
					:options="years"
					disabled-field="notEnabled"
					class="form-control"
					@change="setYear($event)"
				></b-form-select>
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
import loading from "@/components/parts/loading";
import moment from "moment";
import adminheader from "@/components/parts/adminHeader";
import renderList from "@/components/parts/renderList.vue";
import { archiveService } from "@/services/";
import { getPerms } from "@/helpers";

export default {
	components: {
		adminheader,
		renderList,
		loading,
	},
	layout: "admin",
	data() {
		return {
			app: "archive",
			data: [],
			editable: true,
			addable: true,
			deleteable: true,
			statusable: true,
			viewable: true,
			year: 1987,
			years: [],
			error: "",
		};
	},
	computed: {
		filteredData() {
			if (this.data.length > 0) {
				return this.data.filter(function (d) {
					// eslint-disable-next-line eqeqeq
					// return moment(d.archive_date).format("YYYY") == this;
					return d.archive_date == this;
				}, this.year);
			} else return [];
		},
	},
	created() {
		this.getAll();
		getPerms(this);
		this.createYears();
		if (this.$store.state.archive.year) {
			this.year = this.$store.state.archive.year;
		}
	},
	methods: {
		setYear(value) {
			this.year = value;
			this.$store.commit("archive/saveyear", value);
		},
		createYears() {
			const years = [];
			const thisyear = parseInt(moment().format("YYYY"));
			for (let year = 1987; year <= thisyear; year++) {
				years.push(year);
			}
			this.years = years;
		},
		getAll() {
			archiveService.getAll().then(
				(data) => {
					// this.$store.commit('data/savedata', data)
					this.data = data;
				},
				(error) => {
					this.error = error;
				}
			);
		},
		addItem() {
			this.$router.push(`/admin/${this.app}/add`);
		},
		deleteItem(id) {
			archiveService.deleteOne(id).then();
		},
		changeStatus({ id, status }) {
			const s = status ? "0" : "1";
			archiveService.changeStatus(id, s).then();
		},
	},
};
</script>
