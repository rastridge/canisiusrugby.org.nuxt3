<template>
	<div class="edit">
		<adminheader title="Clubhouse Edit" />
		<p
			v-if="submitStatus === 'ERROR'"
			:class="{ error: submitStatus === 'ERROR' }"
		>
			Please fill the form correctly.
		</p>
		<form class="form-horizontal">
			<div class="form-group">
				<div class="col-sm-offset-2 col-sm-4">
					<submit-cancel :submitstatus="submitStatus" @dispose="dispose" />
				</div>
			</div>

			<!-- Page name input-->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="clubhouse_title"
					>Clubhouse_title:
				</label>
				<div class="col-sm-4">
					<input
						id="clubhouse_title"
						v-model.trim="clubhouse_title"
						type="text"
						class="form-control"
						@input="setClubhouseTitle($event.target.value)"
					/>
					<span v-if="!$v.clubhouse_title.required" class="error"
						>Page Name Field is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-2 control-label" for="clubhouse_description"
					>Description:
				</label>
				<div class="col-sm-10">
					<textarea
						id="clubhouse_description"
						v-model.trim="clubhouse_description"
						type="text"
						rows="3"
						class="form-control"
						@input="setClubhouseDescription($event.target.value)"
					/>
					<span v-if="!$v.clubhouse_description.required" class="error"
						>HTML is required</span
					>
				</div>
			</div>

			<!-- Category Input-->
			<div class="form-group">
				<label class="col-sm-3 control-label" for="clubhouse_category"
					>Category:</label
				>
				<div class="col-sm-3">
					<select
						v-model="clubhouse_category"
						class="form-control"
						@change="setClubhouseCategory($event.target.value)"
					>
						<option value="" disabled>Pick a category</option>
						<option
							v-for="cat in categories"
							:key="cat.text"
							:value="cat.value"
						>
							{{ cat.text }}
						</option>
					</select>
					<span v-if="!$v.clubhouse_category.required" class="error"
						>Category is required
					</span>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-2 control-label" for="clubhouse_owner"
					>Held by:
				</label>
				<div class="col-sm-10">
					<input
						id="clubhouse_owner"
						v-model.trim="clubhouse_owner"
						type="text"
						class="form-control"
						@input="setClubhouseOwner($event.target.value)"
					/>
					<span v-if="!$v.clubhouse_owner.required" class="error"
						>Held by required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-2 control-label" for="clubhouse_category"
					>Category:
				</label>
				<div class="col-sm-10">
					<input
						id="clubhouse_category"
						v-model.trim="clubhouse_category"
						type="text"
						class="form-control"
						@input="setClubhouseDescription($event.target.value)"
					/>
					<span v-if="!$v.clubhouse_category.required" class="error"
						>Category is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-2 control-label" for="clubhouse_date"
					>Year:
				</label>
				<div class="col-sm-4">
					<select
						v-model="clubhouse_date"
						class="form-control"
						@change="setDate($event.target.value)"
					>
						<option disabled value="">Select a year</option>
						<option v-for="yr in years" :key="yr">
							{{ yr }}
						</option>
					</select>
					<span v-if="!$v.clubhouse_date.required" class="error"
						>Year is required</span
					>
				</div>
			</div>

			<!-- image file upload -->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="filepath">Image file</label>
				<div class="col-sm-4">
					<input
						id="filepath"
						ref="file"
						class="form-control-file"
						name="filepath"
						type="file"
						@change="handleFileUpload()"
					/>
				</div>
			</div>

			<!-- image file  -->
			<div class="form-group">
				<div class="col-sm-4">
					<input
						id="clubhouse_filepath"
						name="clubhouse_filepath"
						type="hidden"
					/>
					<span v-if="!$v.clubhouse_filepath.required" class="error"
						>Image file is required
					</span>
					<p>
						Current file {{ clubhouse_filepath }}
						<img :src="clubhouse_filepath" />
					</p>
				</div>
			</div>
			<div class="form-group">
				<div class="col-sm-offset-2 col-sm-4">
					<submit-cancel :submitstatus="submitStatus" @dispose="dispose" />
				</div>
			</div>
		</form>
		<p
			v-if="submitStatus === 'ERROR'"
			:class="{ error: submitStatus === 'ERROR' }"
		>
			Please fill the form correctly.
		</p>
		<p v-if="submitStatus === 'PENDING'">Submitted...</p>
	</div>
</template>

<script>
import moment from 'moment'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import adminheader from '@/components/parts/adminHeader.vue'
import SubmitCancel from '@/components/parts/SubmitCancel.vue'
import { clubhouseService, imageService } from '@/services'

export default {
	components: {
		adminheader,
		SubmitCancel
	},
	mixins: [validationMixin],
	layout: 'admin',
	data() {
		return {
			id: this.$route.params.edit,
			clubhouse_title: '',
			clubhouse_description: '',
			clubhouse_filepath: '',
			clubhouse_category: '',
			clubhouse_owner: '',
			clubhouse_date: '',
			status: '',
			deleted: '',
			created_dt: '',
			modified_dt: '',

			categories: [
				{ text: 'Trophy', value: 'trophy' },
				{ text: 'Ball', value: 'ball' },
				{ text: 'Plaque', value: 'plaque' },
				{ text: 'Jersey', value: 'jersey' }
			],
			file: '',
			years: [],
			reset: false,
			apps: [],
			perms: [],
			error: '',
			submitStatus: 'Ok'
		}
	},
	validations: {
		clubhouse_title: {
			required
		},
		clubhouse_description: {
			required
		},
		clubhouse_category: {
			required
		},
		clubhouse_owner: {
			required
		},
		clubhouse_date: {
			required
		},
		clubhouse_filepath: {
			required
		}
	},
	created() {
		this.createYears()
		clubhouseService.getOne(this.id).then((clubhouse) => {
			this.setInfo(clubhouse)
		})
	},
	methods: {
		handleFileUpload() {
			this.file = this.$refs.file.files[0]
			imageService.setClubImage(this.file).then(
				(url) => {
					this.clubhouse_filepath = url.imageUrl
				},
				(error) => {
					this.error = error
				}
			)
		},
		createYears() {
			const years = []
			const thisyear = parseInt(moment().format('YYYY'))
			for (let year = 1966; year <= thisyear; year++) {
				years.push(year)
			}
			this.years = years
		},
		dispose(e) {
			if (e === 'submit') {
				this.handleSubmit()
			} else if (e === 'cancel') {
				this.returnToList()
			}
		},
		setInfo(u) {
			this.clubhouse_title = u.clubhouse_title
			this.clubhouse_description = u.clubhouse_description
			this.clubhouse_category = u.clubhouse_category
			this.clubhouse_owner = u.clubhouse_owner
			this.clubhouse_date = u.clubhouse_date
			this.clubhouse_filepath = u.clubhouse_filepath
		},
		returnToList() {
			this.$router.push('/admin/clubhouse')
		},
		setClubhouseTitle(value) {
			this.clubhouse_title = value
			this.$v.clubhouse_title.$touch()
		},
		setClubhouseDescription(value) {
			this.clubhouse_description = value
			this.$v.clubhouse_description.$touch()
		},
		setClubhouseCategory(value) {
			this.clubhouse_category = value
			this.$v.clubhouse_category.$touch()
		},
		setClubhouseOwner(value) {
			this.clubhouse_owner = value
			this.$v.clubhouse_owner.$touch()
		},
		setDate(value) {
			this.clubhouse_date = value
			this.$v.clubhouse_date.$touch()
		},
		handleSubmit(e) {
			this.submitStatus = ''
			this.$v.$touch()
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				this.submitStatus = 'PENDING'
				const {
					id,
					clubhouse_title,
					clubhouse_description,
					clubhouse_filepath,
					clubhouse_category,
					clubhouse_owner,
					clubhouse_date
				} = this
				clubhouseService
					.editOne(
						id,
						clubhouse_title,
						clubhouse_description,
						clubhouse_filepath,
						clubhouse_category,
						clubhouse_owner,
						clubhouse_date
					)
					.then((clubhouse) => {
						if (!clubhouse.error) {
							this.returnToList()
						} else {
							this.submitStatus = 'ERROR'
							this.error = clubhouse.error
						}
					})
			}
		}
	}
}
</script>
