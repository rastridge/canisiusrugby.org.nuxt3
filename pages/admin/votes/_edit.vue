<template>
	<div class="edit">
		<adminheader title="Edit vote" />
		<p
			v-if="submitStatus === 'ERROR'"
			:class="{ error: submitStatus === 'ERROR' }"
		>
			Please fill the form correctly.
		</p>
		<form class="form-horizontal">
			<div class="form-group">
				<div class="col-sm-4">
					<submit-cancel :submitstatus="submitStatus" @dispose="dispose" />
				</div>
			</div>

			<div class="form-group">
				<div class="offset-sm-1 col-sm-4">
					<div class="info-frame">Voted on {{ vote_vote_cnt }} times</div>
				</div>
			</div>

			<!-- vote name input-->
			<div class="form-group">
				<label class="col-sm-2 control-label" for="vote_question"
					>Question:
				</label>
				<div class="col-sm-8">
					<input
						id="vote_question"
						v-model.trim="vote_question"
						type="text"
						class="form-control"
						@input="setVoteQuestion($event.target.value)"
					/>
					<span v-if="!$v.vote_question.required" class="error"
						>Vote Question Field is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<div class="offset-sm-1 col-sm-4">
					<div class="info-frame">
						Enter choices consecutively. Leave un-used choices blank
					</div>
				</div>
			</div>

			<!-- vote choice input-->
			<div v-for="(item, index) in choices" :key="index" class="form-group">
				<label class="offset-sm-1 col-sm-4" control-label
					>Choice: {{ index + 1 }} &nbsp;&nbsp;&nbsp;Selected
					{{ choices[index].vote_choice_cnt }} times
				</label>
				<div class="offset-sm-1 col-sm-6">
					<input
						v-model.trim="choices[index].vote_choice"
						type="text"
						class="form-control"
					/>
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
import { votesService } from '@/services'

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
			vote_question: '',
			choices: [],
			status: '',
			deleted: '',
			created_dt: '',
			modified_dt: '',

			votes: [],
			reset: false,
			apps: [],
			perms: [],
			error: '',
			submitStatus: 'Ok'
		}
	},
	validations: {
		vote_question: {
			required
		}
	},
	created() {
		votesService.getOne(this.id).then((vote) => {
			this.vote_question = vote.vote_question
			this.vote_vote_cnt = vote.vote_vote_cnt
		})
		votesService.getAllChoices(this.id).then((choices) => {
			this.choices = choices
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
		returnToList() {
			this.$router.push('/admin/votes')
		},
		setVoteQuestion(value) {
			this.vote_question = value
			this.$v.vote_question.$touch()
		},
		handleSubmit(e) {
			this.submitStatus = ''
			this.$v.$touch()
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				this.submitStatus = 'PENDING'
				const { id, vote_question, choices } = this
				votesService.editOne(id, vote_question, choices).then((vote) => {
					if (!vote.error) {
						this.submitStatus = 'ERROR'
						this.returnToList()
					} else {
						this.error = vote.error
					}
				})
			}
		}
	}
}
</script>
