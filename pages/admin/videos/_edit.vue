<template>
	<div class="edit">
		<adminheader title="Edit Video" />
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

			<!-- Video name input-->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="video_title"
					>Video Title:
				</label>
				<div class="col-sm-4">
					<input
						id="video_title"
						v-model.trim="video_title"
						type="text"
						class="form-control"
						@input="setVideoTitle($event.target.value)"
					/>
					<span v-if="!$v.video_title.required" class="error"
						>Video Title Field is required</span
					>
				</div>
			</div>

			<!-- Video description input-->
			<div class="form-group">
				<label class="col-sm-2 control-label" for="video_synop"
					>Description:
				</label>
				<div class="col-sm-10">
					<textarea
						id="video_synop"
						v-model.trim="video_synop"
						type="text"
						rows="3"
						class="form-control"
						@input="setVideoSynop($event.target.value)"
					/>
					<span v-if="!$v.video_synop.required" class="error"
						>Description is required</span
					>
				</div>
			</div>

			<!-- Video URL input-->
			<div class="form-group">
				<label class="col-sm-2 control-label" for="video_url">URL: </label>
				<div class="col-sm-10">
					<textarea
						id="video_url"
						v-model.trim="video_url"
						type="text"
						rows="3"
						class="form-control"
						@input="setVideoUrl($event.target.value)"
					/>
					<span v-if="!$v.video_url.required" class="error"
						>URL is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-3 control-label" for="video_event_dt"
					>Event Date:</label
				>
				<div class="col-sm-4">
					<b-form-datepicker
						id="video_event_dt"
						v-model="video_event_dt"
						class="form-control"
						show-decade-nav
						@input="setEventDate($event)"
					></b-form-datepicker>
					<span v-if="!$v.video_event_dt.required" class="error"
						>Event Date is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-3 control-label" for="video_release_dt"
					>Release Date:</label
				>
				<div class="col-sm-4">
					<b-form-datepicker
						id="video_release_dt"
						v-model="video_release_dt"
						class="form-control"
						show-decade-nav
						@input="setReleaseDate($event)"
					></b-form-datepicker>
					<span v-if="!$v.video_release_dt.required" class="error"
						>Release Date is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-3 control-label" for="video_expire_dt"
					>Expire Date:</label
				>
				<div class="col-sm-4">
					<b-form-datepicker
						id="video_expire_dt"
						v-model="video_expire_dt"
						class="form-control"
						show-decade-nav
						@input="setExpireDate($event)"
					></b-form-datepicker>
					<span v-if="!$v.video_expire_dt.required" class="error"
						>Expire Date is required</span
					>
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
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import adminheader from '@/components/parts/adminHeader.vue'
import SubmitCancel from '@/components/parts/SubmitCancel.vue'
import { videoService } from '@/services'

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
			video_title: '',
			video_synop: '',
			video_url: '',
			video_event_dt: '',
			video_release_dt: '',
			video_expire_dt: '',
			status: '',
			deleted: '',
			created_dt: '',
			modified_dt: '',

			reset: false,
			apps: [],
			perms: [],
			error: '',
			submitStatus: 'Ok'
		}
	},
	validations: {
		video_title: {
			required
		},
		video_synop: {
			required
		},
		video_url: {
			required
		},
		video_release_dt: {
			required
		},
		video_expire_dt: {
			required
		},
		video_event_dt: {
			required
		}
	},
	created() {
		videoService.getOne(this.id).then((videos) => {
			this.setInfo(videos)
		})
	},
	methods: {
		dispose(e) {
			if (e === 'submit') {
				this.handleSubmit()
			} else if (e === 'cancel') {
				this.returnToList()
			}
		},
		setInfo(u) {
			this.video_title = u.video_title
			this.video_synop = u.video_synop
			this.video_url = u.video_url
			this.video_release_dt = u.video_release_dt
			this.video_expire_dt = u.video_expire_dt
			this.video_event_dt = u.video_event_dt
		},
		returnToList() {
			this.$router.push('/admin/videos')
		},
		setVideoTitle(value) {
			this.video_title = value
			this.$v.video_title.$touch()
		},
		setVideoSynop(value) {
			this.video_synop = value
			this.$v.video_synop.$touch()
		},
		setVideoUrl(value) {
			this.video_url = value
			this.$v.video_url.$touch()
		},
		setReleaseDate(value) {
			this.video_release_dt = value
			this.$v.video_release_dt.$touch()
		},
		setEventDate(value) {
			this.video_event_dt = value
			this.$v.video_event_dt.$touch()
		},
		setExpireDate(value) {
			this.video_expire_dt = value
			this.$v.video_expire_dt.$touch()
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
					video_title,
					video_synop,
					video_url,
					video_release_dt,
					video_event_dt,
					video_expire_dt
				} = this
				videoService
					.editOne(
						id,
						video_title,
						video_synop,
						video_url,
						video_release_dt,
						video_event_dt,
						video_expire_dt
					)
					.then((video) => {
						if (!video.error) {
							this.returnToList()
						} else {
							this.submitStatus = 'ERROR'
							this.error = video.error
						}
					})
			}
		}
	}
}
</script>
