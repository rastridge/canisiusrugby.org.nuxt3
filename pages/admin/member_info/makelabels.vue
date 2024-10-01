<template>
	<div style="min-height: 600px">
		<adminheader :title="app"></adminheader>
		<span v-if="error" class="text-danger">ERROR: {{ error }}</span>
		<em v-if="!memberTypes">Loading ...</em>
		<div v-else>
			<div class="col-sm-4">
				<b-form-select
					v-model="member_type_id"
					:options="memberTypes"
					class="mb-3"
					value-field="member_type_id"
					text-field="member_type"
					disabled-field="notEnabled"
					@change="setMember_type_id($event)"
				></b-form-select>
			</div>
			<br />
			<br />
			<div class="info-frame" style="width: 240px">
				Select member type of labels. Members must be marked Mail Recipient YES
				for a label to be created.
			</div>
			<br />
			<br />
			<button
				type="button"
				class="btn btn-primary btn-xs"
				@click="makeLabels2($event, '5160', member_type_id)"
			>
				Make 5160 labels
			</button>
			<br />
			<br />
			<br />
			<br />
			<button
				type="button"
				class="btn btn-primary btn-xs"
				@click="makeLabels2($event, '5164', member_type_id)"
			>
				Make 5164 labels
			</button>
		</div>
	</div>
</template>

<script>
import adminheader from '@/components/parts/adminHeader'
import { memberinfoService, accountService } from '@/services/'
import { getPerms } from '@/helpers'

export default {
	components: {
		adminheader,
	},
	layout: 'admin',
	data() {
		return {
			app: 'member_info',
			error: '',
			member_type_id: 3,
			memberTypes: null,
		}
	},
	created() {
		getPerms(this)
		this.getMemberTypes()
	},
	methods: {
		getMemberTypes() {
			accountService.getMemberTypes().then((membertypes) => {
				this.memberTypes = membertypes
			})
		},
		setMember_type_id(value) {
			this.member_type_id = value
		},
		makeLabels2(e, labelType, member_type_id) {
			memberinfoService.makeLabels2(labelType, member_type_id).then(
				(data) => {
					window.open(`${data}`, '_blank')
				},
				(error) => {
					this.error = error
				}
			)
		},
	},
}
</script>
