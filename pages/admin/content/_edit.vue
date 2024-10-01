<template>
	<div class="edit">
		<adminheader title="Custom Pages Edit" />
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

			<!-- Page content_name input-->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="content_name"
					>Page Name:
				</label>
				<div class="col-sm-4">
					<input
						id="content_name"
						v-model.trim="content_name"
						type="text"
						class="form-control"
						@input="setName($event.target.value)"
					/>
					<span v-if="!$v.content_name.required" class="error"
						>Page Name Field is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-2 control-label" for="content_body">HTML: </label>
				<div class="col-sm-10">
					<textarea
						id="content_body"
						v-model.trim="content_body"
						type="text"
						rows="30"
						class="form-control"
						@input="setBody($event.target.value)"
					/>
					<span v-if="!$v.content_body.required" class="error"
						>HTML is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-3 control-label" for="content_release_dt"
					>Release Date:</label
				>
				<div class="col-sm-4">
					<b-form-datepicker
						id="content_release_dt"
						v-model="content_release_dt"
						class="form-control"
						show-decade-nav
						@input="setReleaseDate($event)"
					></b-form-datepicker>
					<span v-if="!$v.content_release_dt.required" class="error"
						>Date is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-3 control-label" for="content_expire_dt"
					>Expire Date:</label
				>
				<div class="col-sm-4">
					<b-form-datepicker
						id="content_expire_dt"
						v-model="content_expire_dt"
						show-decade-nav
						class="form-control"
						@input="setExpireDate($event)"
					></b-form-datepicker>
					<span v-if="!$v.content_expire_dt.required" class="error"
						>Date is required</span
					>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-4 control-label" for="content_order"
					>Menu Placement:
				</label>
				<div class="col-sm-2">
					<input
						id="content_order"
						v-model.trim="content_order"
						type="text"
						class="form-control"
						@input="setMenu_order($event.target.value)"
					/>
					<p>Zero = Not in Menu</p>
					<span v-if="!$v.content_order.required" class="error"
						>Menu order is required</span
					>
					<span v-if="!$v.content_order.numeric" class="error"
						>Integer is required</span
					>
					<p v-if="error" class="text-danger">ERROR: {{ error }}</p>
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
import { required, integer } from 'vuelidate/lib/validators'
import adminheader from '@/components/parts/adminHeader.vue'
import SubmitCancel from '@/components/parts/SubmitCancel.vue'
import { contentService } from '@/services'

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
			content_name: '',
			content_body: '',
			content_order: '',
			content_release_dt: '',
			content_expire_dt: '',
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
		content_name: {
			required
		},
		content_body: {
			required
		},
		content_release_dt: {
			required
		},
		content_expire_dt: {
			required
		},
		content_order: {
			required,
			integer
		}
	},
	created() {
		contentService.getOne(this.id).then((content) => {
			this.setInfo(content)
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
			this.id = u.id
			this.content_name = u.content_name
			this.content_body = u.content_body
			this.content_order = u.content_order
			this.content_release_dt = u.content_release_dt
			this.content_expire_dt = u.content_expire_dt
		},
		returnToList() {
			this.$router.push('/admin/content')
		},
		setName(value) {
			this.content_name = value
			this.$v.content_name.$touch()
		},
		setBody(value) {
			this.content_body = value
			this.$v.content_body.$touch()
		},
		setMenu_order(value) {
			this.content_order = value
			this.$v.content_order.$touch()
		},
		setReleaseDate(value) {
			this.content_release_dt = value
			this.$v.content_release_dt.$touch()
		},
		setExpireDate(value) {
			this.content_expire_dt = value
			this.$v.content_expire_dt.$touch()
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
					content_name,
					content_body,
					content_order,
					content_release_dt,
					content_expire_dt
				} = this
				contentService
					.editOne(
						id,
						content_name,
						content_body,
						content_order,
						content_release_dt,
						content_expire_dt
					)
					.then((content) => {
						if (!content.error) {
							this.returnToList()
						} else {
							this.submitStatus = 'ERROR'
							this.error = content.error
						}
					})
			}
		}
	}
}
</script>
