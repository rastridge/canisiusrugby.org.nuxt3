<template>
	<div class="add">
		<adminheader title="Sponsors Edit" />
		<p
			v-if="submitStatus === 'ERROR'"
			:class="{ error: submitStatus === 'ERROR' }"
		>
			Please fill the form correctly.
		</p>
		<form class="form-horizontal">
			<div class="form-group">
				<div class="col-sm-6 col-md-8">
					<submit-cancel :submitstatus="submitStatus" @dispose="dispose" />
				</div>
			</div>

			<!-- client_name input-->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="client_name"
					>Sponsor Title:
				</label>
				<div class="col-sm-5">
					<b-form-input
						id="client_name"
						v-model.trim="client_name"
						type="text"
						class="form-control"
						autofocus
						@input="setclient_name($event)"
					/>
					<span v-if="!$v.client_name.required" class="error"
						>Sponsor Title Field is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-4 control-label" for="client_contact"
					>Contact name:
				</label>
				<div class="col-sm-5">
					<input
						id="client_contact"
						v-model.trim="client_contact"
						type="text"
						class="form-control"
						@input="setclient_contact($event.target.value)"
					/>
					<span v-if="!$v.client_contact.required" class="error"
						>Last name Field is required</span
					>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-4 control-label" for="client_website"
					>Website:
				</label>
				<div class="col-sm-6">
					<input
						id="client_website"
						v-model.trim="client_website"
						type="text"
						class="form-control"
						@input="setclient_website($event.target.value)"
					/>
					<span v-if="!$v.client_website.required" class="error"
						>Website Field is required</span
					>
				</div>
			</div>

			<!-- email input-->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="client_email">Email: </label>
				<div class="col-sm-6">
					<input
						id="client_email"
						v-model.trim="client_email"
						type="email"
						class="form-control"
						@input="setclient_email($event.target.value)"
					/>
					<span v-if="!$v.client_email.email" class="error">Invalid email</span>
					<span v-if="!$v.client_email.required" class="error"
						>Email Field is required</span
					>
				</div>
			</div>

			<!-- phone input  -->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="client_phone">Phone: </label>
				<div class="col-sm-4">
					<input
						id="client_phone"
						v-model.trim="client_phone"
						type="text"
						class="form-control"
						placeholder="### ### ####"
						@change="setclient_phone($event.target.value)"
					/>
					<span v-if="!$v.client_phone.required" class="error"
						>Phone Field is required</span
					>
				</div>
			</div>

			<!-- ad image file upload -->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="ad_image"
					>Ad image file</label
				>
				<div class="col-sm-4">
					<input
						id="ad_image"
						ref="file"
						class="form-control-file"
						name="ad_image"
						type="file"
						@change="handleFileUpload()"
					/>
				</div>
			</div>

			<!-- image file  -->
			<div class="form-group">
				<div class="col-sm-4">
					<input id="ad_image_path" name="ad_image_path" type="hidden" />
					<span v-if="!$v.ad_image_path.required" class="error"
						>Ad image is required</span
					>
					<p>750w 125h 72dpi</p>
					<p>
						<img :src="ad_image_path" width="100%" />
					</p>
				</div>
			</div>

			<!-- submit  -->
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
	</div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import adminheader from '@/components/parts/adminHeader.vue'
import SubmitCancel from '@/components/parts/SubmitCancel.vue'
import { sponsorService, imageService } from '@/services/'
const phone = require('phone')

export default {
	name: 'Sponsoredit',
	components: {
		adminheader,
		SubmitCancel
	},
	mixins: [validationMixin],
	layout: 'admin',
	data() {
		return {
			id: this.$route.params.edit,
			client_name: '',
			client_contact: '',
			client_email: '',
			client_phone: '',
			client_website: '',
			ad_image_path: '',

			file: '',
			sponsor: [],
			reset: false,
			submitStatus: 'Ok',
			error: ''
		}
	},
	validations() {
		return {
			client_website: {
				required
			},
			client_email: {
				required,
				email
			},
			client_name: {
				required
			},
			client_contact: {
				required
			},
			client_phone: {
				required
			},
			ad_image_path: {
				required
			}
		}
	},
	created() {
		sponsorService.getOne(this.id).then((sponsor) => {
			this.sponsor = sponsor
			this.setInfo(sponsor)
		})
	},
	methods: {
		handleFileUpload() {
			this.file = this.$refs.file.files[0]
			imageService.setAdImage(this.file).then(
				(url) => {
					this.ad_image_path = url.imageUrl
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
		setInfo(u) {
			this.client_name = u.ad_client_name
			this.client_contact = u.ad_client_contact
			this.client_email = u.ad_client_email
			this.client_website = u.ad_client_website
			this.ad_image_path = u.ad_image_path
			this.client_phone = phone(u.ad_client_phone)[0] // convert
		},
		returnToList() {
			this.$router.push('/admin/sponsors')
		},
		setclient_name(value) {
			this.client_name = value
			this.$v.client_name.$touch()
		},
		setclient_contact(value) {
			this.client_contact = value
			this.$v.client_contact.$touch()
		},
		setclient_email(value) {
			this.client_email = value
			this.$v.client_email.$touch()
		},
		setclient_phone(value) {
			this.client_phone = phone(value)[0]
			this.$v.client_phone.$touch()
		},
		handleSubmit(e) {
			this.submitStatus = ''
			this.$v.$touch()
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				// do your submit logic here
				this.submitStatus = 'PENDING'
				const {
					id,
					client_name,
					client_contact,
					client_email,
					client_phone,
					client_website,
					ad_image_path
				} = this
				sponsorService
					.editOne(
						client_name,
						client_contact,
						client_email,
						client_phone,
						client_website,
						ad_image_path,
						id
					)
					.then((sponsor) => {
						if (!sponsor.error) {
							this.returnToList()
						} else {
							this.submitStatus = 'ERROR'
							this.error = sponsor.error
						}
					})
			}
		}
	}
}
</script>
