<template>
	<div class="edit">
		<template v-if="haveQuestions">
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

				<!-- vote question-->
				<div v-for="(i, ix) in questions" :key="i.vote_id" class="frame">
					<b-form-group>
						<label class="col-sm-10 control-label" for="vote_question"
							>{{ i.vote_question }}
						</label>
						<b-form-radio-group v-model="answers[ix].vote_answer_id">
							<!-- selecting choice affects same choice in other qestions -->
							<div v-for="(item, index) in i.choices" :key="index">
								<b-form-radio :value="item.vote_choice_id"
									>{{ item.vote_choice }}
								</b-form-radio>
							</div>
						</b-form-radio-group>
					</b-form-group>
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
		</template>
		<template v-else>
			<h1 class="headline">You have no unanswered questions</h1>
		</template>
	</div>
</template>

<script>
import SubmitCancel from '@/components/parts/SubmitCancel.vue'
import { votesService } from '@/services'

export default {
	components: {
		SubmitCancel
	},
	data() {
		return {
			account_email: this.$route.query.account_email,
			questions: [],
			choices: [],
			answers: [],
			haveQuestions: 0,
			error: '',
			submitStatus: 'Ok'
		}
	},
	created() {
		votesService.getQuestions(this.account_email).then((questions) => {
			let qs = []
			qs = questions // get questions

			votesService.getUsedChoices().then((choices) => {
				const cs = choices // get choices
				qs.forEach((q) => {
					q.choices = [] // make choices arry in each question
				})

				qs.forEach((q) => {
					cs.forEach((c) => {
						if (c.vote_id === q.vote_id) {
							q.choices.push(c) // fill choices array
						}
					})
				})

				this.questions = qs
				this.haveQuestions = this.questions.length
				this.initAnswers() // initialize answers
			})
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
		initAnswers() {
			this.questions.forEach((q) => {
				this.answers.push({ vote_id: q.vote_id, vote_answer_id: '0' })
			})
		},
		returnToList() {
			this.$router.push('/admin/votes/thankyou')
		},
		handleSubmit(e) {
			this.submitStatus = 'PENDING'
			const { account_email, answers } = this
			votesService.registerBallot(account_email, answers).then((vote) => {
				if (!vote.error) {
					this.submitStatus = 'OK'
					this.returnToList()
				} else {
					this.submitStatus = 'ERROR'
					this.error = vote.error
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.headline {
	font-size: 1.5rem;
	text-align: center;
}
</style>
