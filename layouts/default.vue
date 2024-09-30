<template>
  <div class="frontend-body">
    <Head>
      <Title>Welcome to the Canisius University Rugby Club</Title>
    </Head>
    <div class="container-fluid">
      <nav class="navbar justify-content-center bg-dark">
        <a
          class="btn btn-outline-light btn-sm"
          href="mailto:admin@canisisrugby.org"
          >Info</a
        >
        <a
          class="btn btn-outline-light btn-sm"
          href="https://www.facebook.com/groups/57426718803/"
          target="_blank"
          >Active
          <img
            src="~/assets/imgs/social_icons/Facebook.png"
            width="100"
            height="25"
            alt="facebook"
          />
        </a>
        <a
          class="btn btn-outline-light btn-sm"
          href="https://www.facebook.com/groups/1220166308039205/"
          target="_blank"
          >Alumni
          <img
            src="~/assets/imgs/social_icons/Facebook.png"
            width="100"
            height="25"
            alt="facebook"
          />
        </a>
        <a
          class="btn btn-outline-light btn-sm"
          href="https://www.youtube.com/channel/UCqYvbpfEGggXQ_x5FBKPTHg"
          target="_blank"
        >
          <img
            src="~/assets/imgs/social_icons/YouTube.png"
            width="100"
            height="25"
            alt="youtube"
          />
        </a>
        <a
          class="btn btn-outline-light btn-sm"
          href="/register/men"
          >Men Register</a
        >
      </nav>

      <div class="row">
        <div class="col-sm-12">
          <div class="text-center">
            <div class="brand">CANISIUS</div>
            <img
              src="~/assets/imgs/crabbies.png"
              alt="Canisius Rugby"
              class="bflo-logo"
            />
            <div class="brand">RUGBY</div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-12">
          <div class="text-center">
            <div class="address-bar">Home Field Delaware Park</div>
          </div>
        </div>
      </div>

      <!--
      /*************************************************************/
              Menus
      /*************************************************************/
      -->
      <div class="row">
        <div class="col-sm-12">
          <div
            class="justify-content-center"
            style="border: solid thin #000"
          >
            <Navbar expand="md">
              <Container type="fluid">
                <NavbarToggler />
                <NavbarCollapse>
                  <NavbarNavList margin="e-auto b-2 b-lg-0">
                    <!-- About -->
                    <NavItemDropdown>
                      <NavItemDropdownToggle>About</NavItemDropdownToggle>
                      <DropdownMenu>
                        <DropdownItem
                          v-for="item in content"
                          :key="item.content_id"
                        >
                          <nuxt-link :to="`/content/${item.content_id}`">
                            {{ item.content_name }}
                          </nuxt-link>
                        </DropdownItem>

                        <DropdownItem>
                          <nuxt-link to="/officers"> Officers </nuxt-link>
                        </DropdownItem>

                        <dropdown-item>
                          <nuxt-link to="/members">Members</nuxt-link>
                        </dropdown-item>
                        <dropdown-item>
                          <nuxt-link to="/payments"
                            >Payments
                          </nuxt-link></dropdown-item
                        >
                        <dropdown-item v-if="!isLoggedIn">
                          <nuxt-link to="/admin/loginpage">Login </nuxt-link>
                        </dropdown-item>
                      </DropdownMenu>
                    </NavItemDropdown>
                    &nbsp; &nbsp;
                    <!--News-->
                    <NavItemDropdown>
                      <NavItemDropdownToggle>News</NavItemDropdownToggle>
                      <DropdownMenu>
                        <dropdown-item>
                          <nuxt-link to="/news">News</nuxt-link>
                        </dropdown-item>
                        <dropdown-item>
                          <nuxt-link to="/contributions"
                            >Contributions</nuxt-link
                          >
                        </dropdown-item>
                      </DropdownMenu>
                    </NavItemDropdown>

                    <!-- Competition -->

                    <NavItemDropdown>
                      <NavItemDropdownToggle>Competition</NavItemDropdownToggle>
                      <DropdownMenu>
                        <dropdown-item>
                          <nuxt-link to="/schedule">Schedule</nuxt-link>
                        </dropdown-item>

                        <dropdown-item>
                          <nuxt-link to="/stats/player_stats"
                            >Player Stats</nuxt-link
                          >
                        </dropdown-item>

                        <dropdown-item>
                          <nuxt-link to="/stats/team_stats"
                            >Team Record</nuxt-link
                          >
                        </dropdown-item>

                        <dropdown-item>
                          <nuxt-link to="/stats/player_history"
                            >Player History</nuxt-link
                          >
                        </dropdown-item>
                      </DropdownMenu>
                    </NavItemDropdown>

                    <!-- History -->
                    <!--           <b-nav-item-dropdown text="History">
              <b-dropdown-item to="/content/34">Photos</b-dropdown-item>
              <b-dropdown-item to="/video">Videos</b-dropdown-item>
              <b-dropdown-item to="/archive/documents"
                >Document Archives</b-dropdown-item
              >
              <b-dropdown-item to="/archive/newsletters"
                >Newsletter Archives</b-dropdown-item
              >
              <b-dropdown-item to="/archive/news"
                >News Archives</b-dropdown-item
              >
            </b-nav-item-dropdown>
          </b-navbar-nav>
  -->
                  </NavbarNavList>
                </NavbarCollapse>
              </Container>
            </Navbar>

            <!--
			<div class="row">
				<div class="col-sm-12 text-center">
					<p>
						Copyright {{ $moment().format('YYYY') }} &copy; The Canisius University
						Rugby Club - Buffalo New York
					</p>
				</div>
			</div>
			-->
          </div>
        </div>
      </div>
      <!--      <div
        class="surface-400 border-round-lg md:border-round-xl shadow-6 m-0 md:m-2 p-1 md:p-2"
      >
 -->
      <div
        class="surface-400 border-round-lg md:border-round-xl shadow-6 m-0 md:m-2 p-1 md:p-2"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
  // import SponsorAds from '@/components/parts/SponsorAds'

  const isLoggedIn = ref(false)
  const content = ref(null)

  // middleware: 'noauth',

  //
  // Get custom menu items
  //
  const { data } = await useFetch('/content/custommenuitems', {
    method: 'get',
  })
  content.value = data.value
</script>

<style lang="scss">
  @import '~/assets/scss/frontend.scss';
</style>
