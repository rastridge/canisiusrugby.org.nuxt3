<template>
	<div>
		<adminheader title="Add News" />
		<p
			v-if="submitStatus === 'ERROR'"
			:class="{ error: submitStatus === 'ERROR' }"
		>
			Please fill the form correctly.
		</p>
		<p v-if="submitStatus === 'PENDING'">Submitted...</p>
		<form class="form-horizontal">
			<div class="form-group">
				<div class="col-sm-6 col-md-8">
					<submit-cancel :submitstatus="submitStatus" @dispose="dispose" />
				</div>
			</div>

			<!-- News title input-->
			<div class="form-group">
				<label class="col-sm-2 control-label" for="title">Title: </label>
				<div class="col-sm-8">
					<input
						id="title"
						v-model.trim="title"
						type="text"
						class="form-control"
						@input="setNewsTitle($event.target.value)"
					/>
					<span v-if="!$v.title.required" class="error">Field is required</span>
				</div>
			</div>

			<!-- News synop input-->
			<div class="form-group">
				<label class="col-sm-2 control-label" for="synop">Synopsis: </label>
				<div class="col-sm-8">
					<textarea
						id="synop"
						v-model.trim="synop"
						class="form-control"
						rows="2"
						@input="setNewsSynopsis($event.target.value)"
					>
					</textarea>
					<span v-if="!$v.synop.required" class="error">Field is required</span>
				</div>
			</div>

			<!-- News article-->
			<div class="form-group">
				<label class="col-sm-2 control-label" for="article">Story: </label>
				<div class="col-sm-8">
					<image-instructions />
					<vue-editor
						v-model.trim="article"
						use-custom-image-handler
						@image-added="handleImageAdded"
						@change="setNewsArticle($event)"
					/>
					<span v-if="!$v.article.required" class="error"
						>Field is required</span
					>
				</div>
			</div>

			<!-- News event date input-->
			<div class="form-group">
				<label class="col-sm-2 control-label" for="event_dt"
					>Event Date:
				</label>
				<div class="col-sm-4">
					<b-form-datepicker
						id="event_dt"
						v-model="event_dt"
						show-decade-nav
						@input="setEventDate($event)"
					>
					</b-form-datepicker>
					<span v-if="!$v.event_dt.required" class="error"
						>Field is required</span
					>
				</div>
			</div>

			<!-- News rel dt input-->
			<div class="form-group">
				<label class="col-sm-2 control-label" for="release_dt"
					>Release Date:
				</label>
				<div class="col-sm-4">
					<b-form-datepicker
						id="release_dt"
						v-model="release_dt"
						show-decade-nav
						@input="setReleaseDate($event)"
					>
					</b-form-datepicker>
					<span v-if="!$v.release_dt.required" class="error"
						>Field is required</span
					>
				</div>
			</div>

			<!-- News Expire date input-->
			<div class="form-group">
				<label class="col-sm-2 control-label" for="expire_dt"
					>Expire Date:
				</label>
				<div class="col-sm-4">
					<b-form-datepicker
						id="expire_dt"
						v-model="expire_dt"
						show-decade-nav
						@input="setExpireDate($event)"
					>
					</b-form-datepicker>
					<span v-if="!$v.expire_dt.required" class="error"
						>Field is required</span
					><br />
					<span v-if="!$v.expire_dt.isAfterReleaseDate" class="error"
						>Must be after release date</span
					><br />
					<span v-if="!$v.expire_dt.isAfterEventDate" class="error"
						>Must be after event date</span
					>
				</div>
			</div>

			<div class="form-group">
				<div class="col-sm-6 col-md-8">
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

		<!-- my-modal_progress -->
		<b-modal
			id="my-modal_progress"
			size="sm"
			centered
			hide-footer
			title="File processing"
		>
			<b-progress
				:value="uploadPercentage"
				:max="100"
				show-progress
				variant="warning"
			></b-progress>
		</b-modal>

		<!-- my-modal_localfile -->
		<b-modal id="my-modal_localfile" size="xl" centered>
			<template v-slot:modal-header>
				<h5>Select file from your computer</h5>
			</template>
			<div class="card border-0">
				<input
					id="filepath"
					ref="file"
					class="form-control-file"
					name="filepath"
					type="file"
					@change="handleLocalFile()"
				/>
			</div>
			<template v-slot:modal-footer>
				<div class="w-100">
					<b-button
						variant="primary"
						size="sm"
						class="float-left"
						@click="$bvModal.hide('my-modal_localfile')"
					>
						Done
					</b-button>
				</div>
				<div class="w-50">
					<b-button
						variant="default"
						size="sm"
						class="float-right"
						@click="$bvModal.hide('my-modal_imageurl')"
					>
						Cancel
					</b-button>
				</div>
			</template>
		</b-modal>

		<!-- my-modal_imageurl -->
		<b-modal id="my-modal_imageurl" size="xl" centered>
			<template v-slot:modal-header>
				<h5>Copy/Paste, Type image location</h5>
				<p>for example: 'https://www.google.com/images/logo.jpg'</p>
			</template>
			<div class="card border-0">
				<input
					id="imageurl"
					v-model="imageurl"
					class="form-control"
					name="imageurl"
					type="text"
					@change="handleExternalFile()"
				/>
			</div>
			<template v-slot:modal-footer>
				<div class="w-50">
					<b-button
						variant="primary"
						size="sm"
						class="float-left"
						@click="$bvModal.hide('my-modal_imageurl')"
					>
						Done
					</b-button>
					<b-button
						variant="default"
						size="sm"
						class="float-right"
						@click="$bvModal.hide('my-modal_imageurl')"
					>
						Cancel
					</b-button>
				</div>
			</template>
		</b-modal>

		<!--  now later cancel -->
		<v-dialog />
	</div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, helpers } from 'vuelidate/lib/validators'
import moment from 'moment'
import axios from 'axios'
import FormData from 'form-data'
import { newsService } from '@/services/'
import adminheader from '@/components/parts/adminHeader.vue'
import SubmitCancel from '@/components/parts/SubmitCancel.vue'
import { API } from '@/config.json'
import imageInstructions from '@/components/parts/imageInstructions.vue'
import { VueEditor, Quill } from '@/my_modules/vue2-editor/vue2-editor.esm.js'
const currentDate = moment(new Date()).startOf('day') // 00:00:00
const isAfter = (dt_key) =>
	helpers.withParams({ type: 'sameAs', after: dt_key }, (value, parentVm) =>
		moment(helpers.ref(dt_key, this, parentVm)).isBefore(value)
	)

export default {
	components: {
		adminheader,
		imageInstructions,
		VueEditor,
		SubmitCancel,
	},
	mixins: [validationMixin],
	layout: 'admin',
	data() {
		return {
			title: '',
			synop: '',
			article: '',
			event_dt: '',
			release_dt: '',
			expire_dt: '',
			error: '',
			submitStatus: 'Ok',
			result: {},
			today: currentDate,
			uploadPercentage: 0,
			imageurl: '',
			cursorLocation: '',
			Editor: '',
		}
	},
	validations: {
		title: {
			required,
		},
		synop: {
			required,
		},
		event_dt: {
			required,
		},
		article: {
			required,
		},
		expire_dt: {
			isAfterEventDate: isAfter('event_dt'),
			isAfterReleaseDate: isAfter('release_dt'),
			required,
		},
		release_dt: {
			required,
		},
	},
	mounted() {
		const Image = Quill.import('formats/image')
		Image.className = 'img-fluid'
		Quill.register(Image, true)
	},
	created() {
		this.initDates()
	},
	methods: {
		dispose(e) {
			if (e === 'submit') {
				this.handleSubmit()
			} else if (e === 'cancel') {
				this.returnToList()
			}
		},
		returnToList() {
			this.$router.push('/admin/news')
		},
		initDates() {
			const today = new Date()
			this.release_dt = today
			const e = new Date()
			e.setDate(today.getDate() + 7)
			this.event_dt = e
			const ex = new Date()
			ex.setDate(today.getDate() + 60)
			this.expire_dt = ex
		},
		setNewsTitle(value) {
			this.title = value
			this.$v.title.$touch()
		},
		setNewsSynopsis(value) {
			this.synop = value
			this.$v.synop.$touch()
		},
		setNewsArticle(value) {
			this.article = value
			this.$v.article.$touch()
		},
		setEventDate(value) {
			this.event_dt = value
			this.$v.event_dt.$touch()
		},
		setReleaseDate(value) {
			this.release_dt = value
			this.$v.release_dt.$touch()
		},
		setExpireDate(value) {
			this.expire_dt = value
			this.$v.expire_dt.$touch()
		},
		handleImageAdded(Editor, cursorLocation) {
			this.Editor = Editor
			this.cursorLocation = cursorLocation
			this.openModal()
		},
		openModal() {
			this.$modal.show('dialog', {
				title: 'Where will the image come from?',
				text: '',
				buttons: [
					{
						title: 'My Computer',
						handler: () => {
							this.$modal.hide('dialog')
							this.selectInternal()
						},
					},
					{
						title: 'The Web',
						default: true, // Will be triggered by default if 'Enter' pressed.
						handler: () => {
							this.$modal.hide('dialog')
							this.selectExternal()
						},
					},
					{
						title: 'Cancel',
						handler: () => {
							this.submitStatus = ''
							this.$modal.hide('dialog')
						},
					},
				],
			})
		},
		selectInternal() {
			this.showModal('my-modal_localfile')
		},

		/*
		handleLocalFile() {
			const file = this.$refs.file.files[0]
			const Editor = this.Editor
			const cursorLocation = this.cursorLocation
			const formData = new FormData()
			formData.append('file', file)
			axios.post(`${API}/image/news-newsletters`, formData).then((result) => {
				Editor.insertEmbed(cursorLocation, 'image', result.data.imageUrl)
			})
		},

 */

		handleLocalFile() {
			this.hideModal('my-modal_localfile')
			const formData = new FormData()
			formData.append('file', this.$refs.file.files[0])
			axios
				.post(`${API}/image/news-newsletters`, formData, {
					onUploadProgress: function (progressEvent) {
						this.uploadPercentage = parseInt(
							Math.round((progressEvent.loaded / progressEvent.total) * 100)
						)
						if (this.uploadPercentage !== 0) {
							this.showModal('my-modal_progress')
						}
						if (this.uploadPercentage === 100) {
							this.hideModal('my-modal_progress')
						}
					}.bind(this),
				})
				.then((result) => {
					this.Editor.insertEmbed(
						this.cursorLocation,
						'image',
						result.data.imageUrl
					)
				})
		},

		selectExternal() {
			this.showModal('my-modal_imageurl')
		},
		handleExternalFile() {
			const Editor = this.Editor
			const cursorLocation = this.cursorLocation
			const imageurl = this.imageurl
			// eslint-disable-next-line no-console
			// console.log({ cursorLocation, imageurl })
			Editor.insertEmbed(cursorLocation, 'image', imageurl)
		},
		hideModal(id) {
			this.$bvModal.hide(id)
		},
		showModal(id) {
			this.$bvModal.show(id)
		},
		handleSubmit(e) {
			this.submitStatus = ''
			this.$v.$touch()
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				// do your submit logic here
				this.submitStatus = 'PENDING'

				const { title, synop, article, event_dt, release_dt, expire_dt } = this
				newsService
					.addOne(title, synop, article, event_dt, release_dt, expire_dt)
					.then((news) => {
						if (!news.error) {
							this.returnToList()
						} else {
							this.submitStatus = 'ERROR'
							this.error = news.error
						}
					})
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.quillWrapper {
	background-color: rgb(255, 255, 255);
	color: rgb(0, 0, 0);
}
</style>
