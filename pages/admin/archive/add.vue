<template>
	<div class="edit">
		<adminheader title="Add Archive" />
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

			<!-- archive name input-->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="archive_title"
					>Document Source:
				</label>
				<div class="col-sm-4">
					<input
						id="archive_title"
						v-model.trim="archive_title"
						type="text"
						class="form-control"
						@input="setArchiveTitle($event.target.value)"
					/>
					<span v-if="!$v.archive_title.required" class="error"
						>Document Source is required</span
					>
				</div>
			</div>

			<!-- archive description input-->
			<div class="form-group">
				<label class="col-sm-2 control-label" for="archive_description"
					>Document Description:
				</label>
				<div class="col-sm-10">
					<textarea
						id="archive_description"
						v-model.trim="archive_description"
						type="text"
						rows="3"
						class="form-control"
						@input="setArchiveDescription($event.target.value)"
					/>
					<span v-if="!$v.archive_description.required" class="error"
						>Document Description is required</span
					>
				</div>
			</div>

			<!-- doc file upload -->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="filepath"
					>Document file</label
				>
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

			<!-- doc file path -->
			<div class="form-group">
				<div class="col-sm-4">
					<input id="archive_filepath" name="archive_filepath" type="hidden" />
					<span v-if="!$v.archive_filepath.required" class="error"
						>Document file is required
					</span>
					<p>Current file {{ archive_filepath }}</p>
				</div>
			</div>

			<div class="col-sm-4">
				<label for="example-input">Document date</label>
				<b-input-group class="mb-3">
					<b-form-input
						id="archive_date"
						v-model="archive_date"
						type="text"
						placeholder="YYYY-MM-DD"
						autocomplete="off"
					></b-form-input>
					<b-input-group-append>
						<b-form-datepicker
							v-model="archive_date"
							button-only
							right
							show-decade-nav
							@input="setArchiveDate($event)"
						></b-form-datepicker>
					</b-input-group-append>
				</b-input-group>
				<p v-if="!$v.archive_date.required" class="error">
					Doc Date is required
				</p>
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
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import adminheader from '@/components/parts/adminHeader.vue'
import SubmitCancel from '@/components/parts/SubmitCancel.vue'
import { archiveService } from '@/services'

export default {
	components: {
		adminheader,
		SubmitCancel,
	},
	mixins: [validationMixin],
	layout: 'admin',
	data() {
		return {
			archive_title: '',
			archive_description: '',
			archive_filepath: '',
			archive_date: '',

			file: '',
			// years: [],
			error: '',
			submitStatus: 'Ok',
		}
	},
	validations: {
		archive_title: {
			required,
		},
		archive_description: {
			required,
		},
		archive_filepath: {
			required,
		},
		archive_date: {
			required,
		},
	},

	methods: {
		handleFileUpload() {
			this.file = this.$refs.file.files[0]
			archiveService.setDoc(this.file).then(
				(url) => {
					this.archive_filepath = url.archive_filepath
				},
				(error) => {
					this.error = error
				}
			)
		},

		dispose(e) {
			if (e === 'submit') {
				this.handleSubmit()
			} else if (e === 'cancel') {
				this.returnToList()
			}
		},
		returnToList() {
			this.$router.push('/admin/archive')
		},
		setArchiveTitle(value) {
			this.archive_title = value
			this.$v.archive_title.$touch()
		},
		setArchiveDescription(value) {
			this.archive_description = value
			this.$v.archive_description.$touch()
		},
		setArchiveFilepath(value) {
			this.archive_filepath = value
			this.$v.archive_filepath.$touch()
		},
		setArchiveDate(value) {
			this.archive_date = value
			this.$v.archive_date.$touch()
		},
		handleSubmit(e) {
			this.submitStatus = ''
			this.$v.$touch()
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				this.submitStatus = 'PENDING'
				const {
					archive_title,
					archive_description,
					archive_filepath,
					archive_date,
				} = this
				archiveService
					.addOne(
						archive_title,
						archive_description,
						archive_filepath,
						archive_date
					)
					.then((archive) => {
						if (!archive.error) {
							this.returnToList()
						} else {
							this.submitStatus = 'ERROR'
							this.error = archive.error
						}
					})
			}
		},
	},
}
</script>
