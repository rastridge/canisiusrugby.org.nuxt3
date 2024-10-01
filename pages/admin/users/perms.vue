<template>
	<div id="userpermissions">
		<div class="row">
			<div class="col-sm-12">
				<form class="form">
					<table>
						<tr>
							<td><div class="formlabel">User Name:</div></td>
							<td>
								<input
									v-model="username"
									type="text"
									name="user"
									class="textfield"
								/>
							</td>
						</tr>
						<tr>
							<td><div class="formlabel">Email:</div></td>
							<td>
								<input
									v-model="email"
									type="text"
									name="email"
									class="textfield"
								/>
							</td>
						</tr>
					</table>

					<div v-if="apps" class="table-responsive table-box">
						<table class="table table-sm text-nowrap">
							<tbody>
								<tr v-for="(item, index) in apps" :key="item.admin_app_id">
									<td>{{ item.admin_app_name }}</td>
									<td v-if="apps">
										<input type="radio" />
										&nbsp;Manage {{ index }}&nbsp;
									</td>
									<td>
										<input type="radio" />
										&nbsp;Create&nbsp;
									</td>
									<td>
										<input type="radio" />
										&nbsp;View&nbsp;
									</td>
									<td>
										<input type="radio" />
										&nbsp;No Access&nbsp;
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</form>
				<button
					type="submit"
					class="btn btn-primary"
					:disabled="submitStatus === 'PENDING'"
					@click.prevent="handleSubmit"
				>
					Submit
				</button>
				<button class="btn btn-default" @click.prevent="returnToList">
					Cancel
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { userService } from '@/services/'

export default {
	data() {
		return {
			apps: [],
			userdata: [],
			perms: [],
			username: '',
			email: '',
			permissons: '',
			error: false,
			submitStatus: 'Ok'
		}
	},
	layout: 'admin',
	computed: {
		id() {
			return this.$store.state.authentication.user.admin_user_id
		},
		isLoggedIn() {
			return !!this.$store.state.authentication.user
		},
		perm() {
			return this.$store.state.authentication.user.admin_user_perm
		}
	},
	created() {
		userService
			.getOne(this.id) // not using the store !
			.then((user) => {
				this.userdata = user
				this.username = user.admin_user_name
				this.email = user.admin_user_email
				this.perms = user.perms
				this.permissons = user.admin_user_perms
			})
		/*		*/
		userService
			.getApps() // not using the store !
			.then((apps) => {
				this.apps = apps
			})
	},
	methods: {
		returnToList() {
			this.$router.push('/admin/users')
		},
		setPerm(value) {
			this.admin_user_perm = value
		},
		handleSubmit(e) {
			this.$v.$touch()
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				// do your submit logic here
				this.submitStatus = 'PENDING'
				const { id, user, pass, email, admin_user_perm, perms } = this

				userService
					.editOne(id, user, pass, email, admin_user_perm, perms)
					.then((user) => {
						if (!user.error) {
							this.returnToList()
						} else {
							this.submitStatus = 'ERROR'
							this.error = user.error
						}
					})
			}
		}
	}
}
</script>
