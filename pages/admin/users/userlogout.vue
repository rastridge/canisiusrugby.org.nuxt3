<template>
	<div class="logout"></div>
</template>

<script>
export default {
	created() {
		this.$store.dispatch('authentication/logout')
		this.$router.push('/')
	}
}
</script>
