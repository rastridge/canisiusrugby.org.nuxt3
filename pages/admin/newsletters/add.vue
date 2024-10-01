<template>
	<div>
		<adminheader title="Add Newsletter" />
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

			<!-- recipient type input-->
			<div class="form-group">
				<label class="col-sm-2 control-label" for="newsletter_recipient_type_id"
					>Recipient type:</label
				>
				<div class="col-sm-4">
					<b-form-select
						v-model="newsletter_recipient_type_id"
						:options="recipientTypes"
						class="mb-3"
						value-field="newsletter_recipient_type_id"
						text-field="newsletter_recipient_type"
						disabled-field="notEnabled"
						@change="setNewsletterRecipient_type_id($event)"
					></b-form-select>
					<p>
						<span v-if="!$v.newsletter_recipient_type_id.required" class="error"
							>Field is required</span
						>
					</p>
				</div>
			</div>

			<!-- Newsletter subject input-->
			<div class="form-group">
				<label class="col-sm-2 control-label" for="newsletter_subject"
					>Subject:</label
				>
				<div class="col-sm-8">
					<input
						id="subject"
						v-model.trim="subject"
						type="text"
						class="form-control"
						@input="setNewsletterSubject($event.target.value)"
					/>
					<span v-if="!$v.subject.required" class="error"
						>Field is required</span
					>
				</div>
			</div>

			<!-- Newsletter body_html input with Quill -->

			<div class="form-group">
				<label class="col-sm-2 control-label" for="body_html"
					>Newsletter Body:</label
				>
				<div class="col-sm-10">
					<vue-editor
						v-model.lazy.trim="body_html"
						use-custom-image-handler
						@image-added="handleImageAdded"
						@change="setNewsletterBodyHTML($event)"
					/>
					<span v-if="!$v.body_html.required" class="error"
						>Field is required</span
					>
				</div>
			</div>

			<!-- Newsletter body_inspect -->
			<div class="form-group">
				<label class="col-sm-2 control-label" for="body_html"
					>Inspect Body HTML:</label
				>
				<div class="col-sm-8">
					<textarea
						id="body_html"
						v-model="body_html"
						class="form-control"
						rows="6"
						disabled
					></textarea>
				</div>
			</div>

			<!-- Submit -->
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
import { required } from 'vuelidate/lib/validators'
import { VueEditor, Quill } from '@/my_modules/vue2-editor/vue2-editor.esm.js'
import axios from 'axios'
import FormData from 'form-data'
import { newsletterService, accountService } from '@/services/'
import adminheader from '@/components/parts/adminHeader.vue'
import SubmitCancel from '@/components/parts/SubmitCancel.vue'
import { API } from '@/config.json'

export default {
	components: {
		adminheader,
		SubmitCancel,
		VueEditor,
	},
	mixins: [validationMixin],
	layout: 'admin',
	data() {
		return {
			accounts: [],

			id: '',
			newsletter_recipient_type_id: '',
			admin_user_id: '',
			subject: '',
			body_text: 'plain text',
			body_html: '',

			sent: '',
			send: '',
			send_complete: '',
			send_status: '',
			recipientTypes: [],
			error: '',
			submitStatus: 'Ok',
			result: {},
			uploadPercentage: 0,
			imageurl: '',
			cursorLocation: '',
			Editor: '',
		}
	},
	validations: {
		subject: {
			required,
		},
		body_html: {
			required,
		},
		newsletter_recipient_type_id: {
			required,
		},
	},
	mounted() {
		const Image = Quill.import('formats/image')
		Image.className = 'img-fluid'
		Quill.register(Image, true)
	},
	created() {
		newsletterService.getRecipientTypes().then((recipienttypes) => {
			this.recipientTypes = recipienttypes
		})
		this.getAllAccounts()
		this.admin_user_id = this.$store.state.authentication.user.admin_user_id
	},
	methods: {
		dispose(e) {
			if (e === 'submit') {
				this.handleSubmit()
			} else if (e === 'cancel') {
				this.returnToList()
			}
		},
		getAllAccounts() {
			accountService.getAll().then(
				(accts) => {
					this.accounts = accts
				},
				(error) => {
					this.error = error
				}
			)
		},
		returnToList() {
			this.$router.push('/admin/newsletters')
		},
		setNewsletterSubject(value) {
			this.subject = value
			this.$v.subject.$touch()
		},
		setNewsletterBodyHTML(value) {
			this.body_html = value
			this.$v.body_html.$touch()
		},
		setNewsletterRecipient_type_id(value) {
			this.newsletter_recipient_type_id = value
			this.$v.newsletter_recipient_type_id.$touch()
		},
		handleImageAdded(Editor, cursorLocation) {
			this.Editor = Editor
			this.cursorLocation = cursorLocation
			this.openModal()
		},
		openModal() {
			this.$modal.show('dialog', {
				title: 'Where will the image come from>?',
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
				this.openSendModal()
			}
		},
		openSendModal() {
			this.$modal.show('dialog', {
				title: 'Do you want to send now or later?',
				text: '',
				buttons: [
					{
						title: 'Save and Send Now',
						handler: () => {
							this.addNewsletter('sendNow')
						},
					},
					{
						title: 'Save and Send Later',
						default: true, // Will be triggered by default if 'Enter' pressed.
						handler: () => {
							this.addNewsletter('sendLater')
						}, // Button click handler
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
		addNewsletter(send) {
			const {
				newsletter_recipient_type_id,
				admin_user_id,
				subject,
				body_text,
				body_html,
				sent,
				send_complete,
				send_status,
			} = this
			newsletterService
				.addOne(
					newsletter_recipient_type_id,
					admin_user_id,
					subject,
					body_text,
					body_html,
					sent,
					send,
					send_complete,
					send_status
				)
				.then((newsletter) => {
					if (!newsletter.error) {
						this.id = newsletter.insertId
						if (send === 'sendNow') {
							this.sendNewsletter()
						}
						this.returnToList()
					} else {
						this.submitStatus = 'ERROR'
						this.error = newsletter.error
					}
				})
		},
		sendNewsletter() {
			/* function  filterItems - only send newsletter to Status = 1 Deleted = 0 recipient = 1 and ingroup */
			function filterItems(accounts, recipient_type_id) {
				function newsletterTypeFilter(id) {
					id = parseInt(id)
					let set = []
					if (id === 1) {
						// All
						set = [2, 3, 5, 6]
					} else if (id === 2) {
						// active
						set = [2]
					} else if (id === 3) {
						// alumni
						set = [4]
					} else if (id === 4) {
						// sponsor
						set = [4]
					} else if (id === 5) {
						// special
						set = [5]
					} else if (id === 6) {
						// development
						set = [6]
					} else if (id === 7) {
						// locals in zipcode 14???
						set = [7]
						// const filter = " in (3,6) AND account_addr_postal like '14%' "
					} else if (id === 9) {
						// pending
						set = [9]
					} else if (id === 10) {
						// other
						set = [10]
					} else if (id === 13) {
						// testing
						set = [13]
					}
					return set
				}
				let ingroup = false
				return accounts.filter(function (el) {
					ingroup = newsletterTypeFilter(recipient_type_id).includes(
						el.member_type_id
					)

					return el.status && el.newsletter_recipient && ingroup
				})
			}
			const filteredAccounts = filterItems(
				this.accounts,
				this.newsletter_recipient_type_id
			)

			const { id, subject, body_html } = this
			newsletterService
				.sendNewsletter(id, subject, body_html, filteredAccounts)
				.then((newsletter) => {
					if (!newsletter.error) {
						this.returnToList()
					} else {
						this.submitStatus = 'ERROR'
						this.error = newsletter.error
					}
				})
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
