<template>
  <div
    id="default"
    class="frontend-body"
  >
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
                          :key="item.id"
                          :to="'/content/' + item.content_id"
                          >{{ item.content_name }}
                        </DropdownItem>
                        <DropdownItem to="/members/officers">
                          Officers
                        </DropdownItem>

                        <dropdown-item to="/members">Members </dropdown-item>
                        <dropdown-item to="/payments">Payments </dropdown-item>
                        <dropdown-item
                          v-if="!isLoggedIn"
                          to="/admin/loginpage"
                          >Login
                        </dropdown-item>
                      </DropdownMenu>
                    </NavItemDropdown>

                    <!-- News -->
                    <!--            <b-nav-item-dropdown text="News">
              <b-dropdown-item
                to="/news"
                exact
                >News</b-dropdown-item
              >
              <b-dropdown-item
                v-b-tooltip.hover
                to="/contributions"
                exact
                title="Current, past, howto"
                >Contributions</b-dropdown-item
              >
            </b-nav-item-dropdown>
            &nbsp; &nbsp;
 -->
                    <!-- Competition -->
                    <!--             <b-nav-item-dropdown text="Competition">
              <b-dropdown-item to="/schedule"
                >Schedule and Results</b-dropdown-item
              >
              <b-dropdown-item
                to="/stats/player_stats"
                exact
                >Player Stats Fifteens</b-dropdown-item
              >
              <b-dropdown-item
                to="/stats/player_stats7s"
                exact
                >Player Stats Sevens</b-dropdown-item
              >
              <b-dropdown-item
                to="/stats/team_stats"
                exact
                >Team Record</b-dropdown-item
              >
              <b-dropdown-item
                to="/stats/player_history"
                exact
                >Player History</b-dropdown-item
              >
            </b-nav-item-dropdown>
 -->
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
						Copyright {{ $moment().format('YYYY') }} &copy; The Canisius College
						Rugby Club - Buffalo New York
					</p>
				</div>
			</div>
			-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  // import { contentService } from "@/services/";
  // import SponsorAds from '@/components/parts/SponsorAds'

  const isLoggedIn = ref(false)
  const content = ref(null)

  // middleware: 'noauth',

  //
  // Get current news
  //
  const { data } = await useFetch('/content/custommenuitems', {
    method: 'get',
  })
  content.value = data.value

  /*       head() {
            title: 'Welcome to the Canisius College Rugby Club',
            bodyAttrs: {
              class: 'frontend-body',
            },
        }, */
</script>

<style lang="scss">
  @import '~/assets/scss/frontend.scss';
</style>
