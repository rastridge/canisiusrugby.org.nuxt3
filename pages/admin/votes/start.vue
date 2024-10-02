<template>
  <div class="start">
    <table>
      <tbody>
        <tr>
          <td>
            <div>
              To vote, please enter your Buffalo Rugby Membership email address
              below. You will receive an email shortly with further instructions
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div>
              If you do not receive the email within 10 minutes email
              <a href="mailto:secretary@buffalorugby.org"
                >secretary@buffalorugby.org</a
              >
              for help
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <br />
    <p
      v-if="submitStatus === 'ERROR'"
      :class="{ error: submitStatus === 'ERROR' }"
    >
      Please fill the form correctly.
    </p>

    <form class="form">
      <div class="form-group">
        <label
          class="col-sm-6 col-md-8 control-label"
          for="email"
          >Email:
        </label>
        <div class="col-sm-6 col-md-8">
          <input
            id="email"
            v-model.trim="email"
            type="text"
            class="form-control"
            @input="setEmail($event.target.value)"
          />
          <span
            v-if="!$v.email.email"
            class="error"
            >Invalid email</span
          ><br />
          <span
            v-if="!$v.email.required"
            class="error"
            >Email Field is required</span
          >
        </div>
      </div>

      <div class="form-group">
        <div class="col-sm-6 col-md-8">
          <submit-cancel
            :submitstatus="submitStatus"
            @dispose="dispose"
          />
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

  import SubmitCancel from '@/components/parts/SubmitCancel.vue'
  import { votesService } from '@/services/'

  export default {
    name: 'Start',
    components: {
      SubmitCancel,
    },
    mixins: [validationMixin],
    data() {
      return {
        email: '',
        submitStatus: 'Ok',
        error: '',
      }
    },
    layout: 'default',
    validations: {
      email: {
        required,
        email,
      },
    },
    methods: {
      dispose(e) {
        if (e === 'submit') {
          this.handleSubmit()
        } else if (e === 'cancel') {
          this.returnToList()
        }
      },
      confirmation() {
        this.$router.push('/admin/votes/confirm')
      },
      setEmail(value) {
        this.email = value
        this.$v.email.$touch()
      },
      handleSubmit(e) {
        this.$v.$touch()
        if (this.$v.$invalid) {
          this.submitStatus = 'ERROR'
        } else {
          // do your submit logic here
          this.submitStatus = 'PENDING'
          const { email } = this
          votesService.sendBallot(email).then((user) => {
            if (!user.error) {
              this.confirmation()
            } else {
              this.submitStatus = 'ERROR'
              this.error = user.error
            }
          })
        }
      },
    },
  }
</script>
