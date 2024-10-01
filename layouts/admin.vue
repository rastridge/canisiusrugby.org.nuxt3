<template>
  <div id="adminhome">
    <b-sidebar
      id="sidebar-backdrop"
      title="CRC Admin Menu"
      backdrop
      shadow
    >
      <div class="px-3 py-2">
        <b-nav
          vertical
          class="w-35"
        >
          <!-- 					<b-nav-item v-if="checkPerm('clubhouse')" to="/admin/clubhouse" exact
						>Clubhouse</b-nav-item
					>
 -->

          <b-nav-item v-if="checkPerm('contributions')">
            <nuxt-link to="/admin/contributions">Contributions </nuxt-link>
          </b-nav-item>

          <b-nav-item v-if="checkPerm('content')">
            <nuxt-link to="/admin/content">Custom Pages </nuxt-link>
          </b-nav-item>

          <b-nav-item v-if="checkPerm('archive')">
            <nuxt-link to="/admin/archive">Document Archive </nuxt-link>
          </b-nav-item>

          <b-nav-item v-if="checkPerm('accounts/men')">
            <nuxt-link to="/admin/accounts/men">Members </nuxt-link>
          </b-nav-item>

          <!-- 					<b-nav-item
						v-if="checkPerm('member_info')"
						to="/admin/member_info"
						exact
						>Member Info</b-nav-item
					>
 -->

          <b-nav-item v-if="checkPerm('news')">
            <nuxt-link to="/admin/news">News </nuxt-link>
          </b-nav-item>

          <b-nav-item v-if="checkPerm('newsletters')">
            <nuxt-link to="/admin/newsletters">Newsletters </nuxt-link>
          </b-nav-item>

          <b-nav-item v-if="checkPerm('payments')">
            <nuxt-link to="/admin/payments">Payments </nuxt-link>
          </b-nav-item>

          <b-nav-item v-if="checkPerm('game_player_stats')">
            <nuxt-link to="/admin/game_player_stats">Stats </nuxt-link>
          </b-nav-item>

          <!-- 					<b-nav-item v-if="checkPerm('sponsors')" to="/admin/sponsors" exact
						>Sponsors</b-nav-item
					>
 -->

          <!-- <b-nav-item
						v-if="checkPerm('supporting_accounts')"
						to="/admin/supporting_accounts"
						exact
						>Supporting Accounts</b-nav-item
					>
 -->

          <b-nav-item
            v-if="checkPerm('sms')"
            to="/admin/sms"
            exact
          >
            Text Msgs
          </b-nav-item>

          <b-nav-item
            v-if="checkPerm('users')"
            to="/admin/users"
            exact
          >
            Admin Users
          </b-nav-item>

          <b-nav-item
            v-if="checkPerm('videos')"
            to="/admin/videos"
            exact
          >
            Videos
          </b-nav-item>

          <b-nav-item
            v-if="checkPerm('votes')"
            to="/admin/votes"
            exact
          >
            Votes
          </b-nav-item>

          <b-nav-item
            to="/admin/users/userlogout"
            exact
            >Log out</b-nav-item
          >
        </b-nav>
      </div>
    </b-sidebar>

    <div class="content-area">
      <b-button
        v-b-toggle.sidebar-backdrop
        variant="outline-primary"
      >
        Admin Menu
      </b-button>

      <!-- Content start here -->

      <nuxt />

      <!-- Content end here -->
    </div>
  </div>
</template>

<script setup>
  // middleware: 'auth'

  const checkPerm = (app) => {
    const user = JSON.parse(sessionStorage.getItem('auth'))
    const temp = user.perms
    // const perms = temp.find((u) => u.admin_app_name === app)
    const perms = temp.find(function (u) {
      // eslint-disable-next-line no-console
      // console.log(u.admin_app_name, app, u.admin_app_name === app)
      return u.admin_app_name === app
    })

    return perms.admin_perm
  }

  useHead({
    title: 'Canisius College Rugby Club Admin',
    bodyAttrs: {
      class: 'admin-body',
    },
  })
</script>

<style lang="scss" scoped>
  @import '@/assets/css/layout/admin.scss';
</style>
