<template>
  <div class="add">
    <adminheader title="Game Edit" />
    <p
      v-if="submitStatus === 'ERROR'"
      :class="{ error: submitStatus === 'ERROR' }"
    >
      Please fill the form correctly.
    </p>

    <form class="form">
      <div class="form-group">
        <div class="col-sm-6 col-md-8">
          <submit-cancel
            :submitstatus="submitStatus"
            @dispose="dispose"
          />
        </div>
      </div>

      <!-- opponent input-->
      <div class="form-group">
        <label
          class="col-sm-4 control-label"
          for="opponent"
          >Opponent:
        </label>
        <div class="col-sm-5">
          <b-form-input
            id="opponent"
            v-model.trim="opponent"
            type="text"
            class="form-control"
            autofocus
            @input="setOpponent($event)"
          />
          <span
            v-if="!$v.opponent.required"
            class="error"
            >Opponent is required</span
          >
        </div>
      </div>

      <!-- referee input-->
      <div class="form-group">
        <label
          class="col-sm-4 control-label"
          for="referee"
          >Referee name:
        </label>
        <div class="col-sm-5">
          <input
            id="referee"
            v-model.trim="referee"
            type="text"
            class="form-control"
          />
        </div>
      </div>

      <!-- venue input-->
      <div class="form-group">
        <label
          class="col-sm-4 control-label"
          for="venue"
          >Venue:
        </label>
        <div class="col-sm-6">
          <input
            id="venue"
            v-model.trim="venue"
            type="text"
            class="form-control"
            @input="setVenue($event.target.value)"
          />
          <span
            v-if="!$v.venue.required"
            class="error"
            >Venue is required</span
          >
        </div>
      </div>

      <!-- comment input-->
      <div class="form-group">
        <label
          class="col-sm-4 control-label"
          for="comment"
          >Comment:
        </label>
        <div class="col-sm-4">
          <input
            id="comment"
            v-model.trim="comment"
            type="text"
            class="form-control"
          />
        </div>
      </div>

      <!-- date input-->
      <div class="form-group">
        <label
          class="col-sm-4 control-label"
          for="date"
          >Date:
        </label>
        <div class="col-sm-4">
          <b-form-datepicker
            id="date"
            v-model="date"
            class="form-control"
            show-decade-nav
            @input="setDate($event)"
          ></b-form-datepicker>
          <span
            v-if="!$v.date.required"
            class="error"
            >Date is required</span
          >
        </div>
      </div>

      <!-- KO Time input-->
      <div class="form-group">
        <label
          class="col-sm-4 control-label"
          for="KO_time"
        >
          KO Time:</label
        >
        <div class="col-sm-4">
          <b-form-timepicker
            id="KO_time"
            v-model="KO_time"
            locale="en"
            no-close-button
            class="form-control"
            @input="setKO_time($event)"
          >
          </b-form-timepicker>
          <span
            v-if="!$v.KO_time.required"
            class="error"
            >KO Time is required</span
          >
        </div>
      </div>

      <!-- Game type input-->
      <div class="form-group">
        <label
          class="col-sm-4 control-label"
          for="game_type_id"
        >
          Game type:</label
        >
        <div class="col-sm-4">
          <select
            v-model="game_type_id"
            class="form-control"
            @change="setGameTypeId($event.target.value)"
          >
            <option
              disabled
              value=""
            >
              Select game type
            </option>
            <option
              v-for="option in gameTypes"
              :key="option.game_type_id"
              :value="option.game_type_id"
            >
              {{ option.game_type }}
            </option>
          </select>
          <br />
          <span
            v-if="!$v.game_type_id.required"
            class="error"
            >Game Type is required</span
          >
        </div>
      </div>

      <!-- game level  -->
      <div class="form-group">
        <label
          class="col-sm-4 control-label"
          for="game_level"
        >
          Game level:</label
        >
        <div class="col-sm-4">
          <select
            v-model="game_level"
            class="form-control"
            @change="setGameLevel($event.target.value)"
          >
            <option
              disabled
              value=""
            >
              Select game level
            </option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
          <span
            v-if="!$v.game_level.required"
            class="error"
            >Game level is required</span
          >
        </div>
      </div>

      <!-- points for -->
      <div class="form-group">
        <label
          class="col-sm-4 control-label"
          for="ptsFor"
        >
          Points for:</label
        >
        <div class="col-sm-2">
          <input
            id="ptsFor"
            v-model="ptsFor"
            type="text"
            class="form-control"
          />
        </div>
      </div>

      <!-- points against -->
      <div class="form-group">
        <label
          class="col-sm-4 control-label"
          for="ptsAgn"
        >
          Points against:</label
        >
        <div class="col-sm-2">
          <input
            id="ptsAgn"
            v-model="ptsAgn"
            type="text"
            class="form-control"
          />
        </div>
      </div>

      <!-- image -->
      <div class="form-group">
        <label
          class="col-sm-4 control-label"
          for="image"
        >
          Select less than or equal to 800px 630px Image File::</label
        >
        <div class="col-sm-6">
          <input
            id="image"
            name="image"
            type="file"
            class="form-control"
          />
        </div>
      </div>
      <div class="form-group">
        <label
          class="col-sm-4 control-label"
          for="game_image"
        >
          Current game_image file name:</label
        >
        <div class="col-sm-6">
          <input
            id="game_image"
            name="game_image"
            type="text"
            class="form-control"
          />
        </div>
      </div>

      <!-- Select previous game for autofill -->
      <div class="form-group">
        <label
          class="col-sm-6 control-label"
          for="reset"
          ><div class="info-frame">
            If you want to select roster from a previous game? All current game
            info will be replaced.<span v-if="!date"
              >You must first set a date for this game</span
            >
          </div>
        </label>
        <div
          v-if="date"
          class="col-sm-2"
        >
          Check here
          <input
            v-if="date"
            id="reset"
            v-model="reset"
            type="checkbox"
            @input="resetPlayers()"
          />
        </div>
      </div>
      <br />
      <div v-if="reset && date">
        <div class="form-group">
          <label
            class="col-sm-4 control-label"
            for="previous_game"
          >
            Select roster - Uncheck to cancel
          </label>
          <div class="col-sm-6">
            <select
              v-model="previous_game_id"
              class="form-control"
              @change="setPreviousGameId($event.target.value)"
            >
              <option
                disabled
                value=""
              >
                None
              </option>
              <option
                v-for="option in previousgames"
                :key="option.game_id"
                :value="option.game_id"
              >
                {{ option.dt }} {{ option.opponent }} {{ option.game_level }}
              </option>
            </select>
            <div class="help-block info-frame">
              Selecting another roster will replace existing players on this
              roster!
            </div>
          </div>
        </div>
      </div>

      <!-- ------------ players --------------------------->
      <div class="table-responsive">
        <table
          id="roster-table"
          class="table table-borderless table-sm text-nowrap"
        >
          <tbody>
            <tr>
              <th>Pos</th>
              <th>Player</th>
              <th>Tries</th>
              <th>Assts</th>
              <th>Conv</th>
              <th>PenK</th>
              <th>DrpG</th>
              <th>Yel</th>
              <th>Red</th>
              <th>Replaced by</th>
            </tr>
          </tbody>

          <tbody id="roster-tbody">
            <tr
              v-for="(item, index) in players"
              :key="item.position_id"
            >
              <td>
                {{ index + 1 }}
              </td>
              <td>
                <auto-complete
                  :init="item.pln + ', ' + item.pfn"
                  :items="suggestions"
                  @setId="setPlayerId($event, index)"
                />
              </td>
              <td>
                <input
                  v-model="players[index].tries"
                  size="2px"
                  type="text"
                  value="item.tries"
                />
              </td>
              <td>
                <input
                  v-model="players[index].assists"
                  size="2px"
                  type="text"
                  value="item.assists"
                />
              </td>
              <td>
                <input
                  v-model="players[index].conv"
                  size="2px"
                  type="text"
                  value="item.conv"
                />
              </td>
              <td>
                <input
                  v-model="players[index].penk"
                  size="2px"
                  type="text"
                  value="item.penk"
                />
              </td>
              <td>
                <input
                  v-model="players[index].dgoal"
                  size="2px"
                  type="text"
                  value="item.dgoal"
                />
              </td>
              <td>
                <input
                  v-model="players[index].yellow"
                  size="2px"
                  type="text"
                  value="item.yellow"
                />
              </td>
              <td>
                <input
                  v-model="players[index].red"
                  size="2px"
                  type="text"
                  value="item.red"
                />
              </td>
              <td>
                <auto-complete
                  :init="item.rln + ', ' + item.rfn"
                  :items="suggestions"
                  @setId="setReplacedById($event, index)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- submit  -->
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
  import { required } from 'vuelidate/lib/validators'
  import SubmitCancel from '@/components/parts/SubmitCancel.vue'
  import adminheader from '@/components/parts/adminHeader.vue'
  import { statsService, accountService } from '@/services/'
  import AutoComplete from '@/components/parts/AutoComplete.vue'

  export default {
    name: 'Gameadd',
    components: {
      adminheader,
      SubmitCancel,
      AutoComplete,
    },
    mixins: [validationMixin],
    layout: 'admin',
    data() {
      return {
        id: this.$route.params.edit,
        game: [],
        opponent: '',
        venue: '',
        referee: '',
        KO_time: '',
        comment: '',
        date: '',
        game_type_id: '',
        game_level: '',
        ptsFor: '',
        ptsAgn: '',
        game_image: '',
        players: [],
        gameTypes: [],
        suggestions: [],
        previousgames: [],
        previous_game_id: '',
        reset: false,
        init: '',
        submitStatus: 'Ok',
        error: '',
      }
    },
    validations: {
      opponent: {
        required,
      },
      venue: {
        required,
      },
      date: {
        required,
      },
      KO_time: {
        required,
      },
      game_type_id: {
        required,
      },
      game_level: {
        required,
      },
    },
    created() {
      this.getPlayers(this.id) // get game info for players
      this.getOne(this.id) // get game info
      this.getGameTypes()
      this.getAll() // names and ids for autocompletes
    },
    methods: {
      returnToList() {
        this.$router.push('/admin/game_player_stats')
      },
      getAll() {
        accountService.getAll().then(
          (data) => {
            this.suggestions = data
          },
          (error) => {
            this.error = error
          },
        )
      },
      getOne(id) {
        statsService.getOne(id).then((game) => {
          this.setGame(game)
        })
      },
      setGame(g) {
        this.opponent = g.opponent
        this.venue = g.venue
        this.referee = g.referee
        this.KO_time = g.KO_time
        this.comment = g.comment
        this.date = g.dt
        this.game_type_id = g.game_type_id
        this.game_level = g.game_level
        this.ptsFor = g.ptsFor
        this.ptsAgn = g.ptsAgn
        this.game_image = g.game_image
      },
      getGameTypes() {
        statsService.getGameTypes().then((gametypes) => {
          this.gameTypes = gametypes
        })
      },
      getPlayers(id) {
        statsService.getPlayers(id).then((players) => {
          this.setPlayers(players)
        })
      },

      setPreviousGameId(value) {
        this.previous_game_id = value
        this.getReplacePlayers(this.previous_game_id)
      },
      getPreviousGames() {
        // date = moment(this.date).format('YYYY-MM-D')
        statsService.getPreviousGames(this.date).then(
          (data) => {
            this.previousgames = data
          },
          (error) => {
            this.error = error
          },
        )
      },
      getReplacePlayers(id) {
        statsService.getPlayers(id).then((players) => {
          this.replacePlayers(players)
        })
      },
      replacePlayers(p) {
        let i
        this.players = []
        for (i = 0; i < 23; i++) {
          const plr = p[i]
          this.players.push({
            position_id: plr.position_id,
            player_id: plr.player_id,
            pfn: plr.pfn ? plr.pfn : '',
            pln: plr.pln ? plr.pln : '',
            rfn: plr.rfn ? plr.pln : '',
            rln: plr.rln ? plr.rln : '',
            tries: '0',
            assists: '0',
            conv: '0',
            penk: '0',
            dgoal: '0',
            yellow: '0',
            red: '0',
            replaced_by: plr.replaced_by,
          })
        }
      },
      resetPlayers() {
        this.reset = !this.reset
        if (this.reset) {
          this.getPreviousGames()
        }
      },
      setPlayers(p) {
        let i
        for (i = 0; i < 23; i++) {
          const plr = p[i]
          this.players.push({
            position_id: plr.position_id,
            player_id: plr.player_id,
            pfn: plr.pfn ? plr.pfn : '',
            pln: plr.pln ? plr.pln : '',
            rfn: plr.rfn ? plr.rfn : '',
            rln: plr.rln ? plr.rln : '',
            tries: plr.tries,
            assists: plr.assists,
            conv: plr.conv,
            penk: plr.penk,
            dgoal: plr.dgoal,
            yellow: plr.yellow,
            red: plr.red,
            replaced_by: plr.replaced_by,
          })
        }
      },

      setPlayerId(id, index) {
        this.players[index].player_id = id
      },
      setReplacedById(id, index) {
        this.players[index].replaced_by = id
      },
      setOpponent(value) {
        this.opponent = value
        this.$v.opponent.$touch()
      },
      setVenue(value) {
        this.venue = value
        this.$v.venue.$touch()
      },
      setDate(value) {
        this.date = value
        this.$v.date.$touch()
      },
      setKO_time(value) {
        this.KO_time = value
        this.$v.KO_time.$touch()
      },
      setGameTypeId(value) {
        this.game_type_id = value
        this.$v.game_type_id.$touch()
      },
      setGameLevel(value) {
        this.game_level = value
        this.$v.game_level.$touch()
      },
      dispose(e) {
        if (e === 'submit') {
          this.handleSubmit()
        } else if (e === 'cancel') {
          this.returnToList()
        }
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
            opponent,
            referee,
            venue,
            comment,
            date,
            KO_time,
            game_type_id,
            game_level,
            ptsFor,
            ptsAgn,
            game_image,
            players,
          } = this

          statsService
            .editOne(
              id,
              opponent,
              referee,
              venue,
              comment,
              date,
              KO_time,
              game_type_id,
              game_level,
              ptsFor,
              ptsAgn,
              game_image,
              players,
            )
            .then((account) => {
              if (!account.error) {
                this.returnToList()
              } else {
                this.submitStatus = 'ERROR'
                this.error = account.error
              }
            })
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  #roster-table {
    color: rgb(206, 206, 206);
  }
  #roster-tbody {
    background-color: rgb(240, 239, 239);
    color: rgb(71, 71, 71);
  }
</style>
