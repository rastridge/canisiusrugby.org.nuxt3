<template>
  <div id="officers">
    <Head>
      <Title>Canisius University Rugby Club Officers</Title>
    </Head>
    <div class="center-content">
      <common-header title="Officers" />
    </div>

    <div
      class="bg-white border-round-lg md:border-round-xl shadow-6 m-0 md:m-2 p-1 md:p-2"
    >
      <div
        class="p-2 text-md border-blue-700 border-2 border-round-md md:border-round-lg"
      >
        <DataTable
          :value="officers"
          class="p-datatable-sm text-xs sm:text-sm md:text-md lg:text-lg"
        >
          <Column
            field="title"
            header=""
          ></Column>
          <Column
            field="office"
            header="Office 1"
          ></Column>
          <Column
            field="office2"
            header="Office 2"
          ></Column>
          <Column
            field="account_email"
            header="Email"
          >
            <template #body="slotProps">
              <div style="width: 5rem">
                <expose-email :email="slotProps.data.account_email" />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
  //
  // Get current news
  //
  const { data: officers } = await useFetch('/accounts/getofficers', {
    method: 'get',
  })
</script>

<style scoped>
  p-datatable {
    border: solid 2px black;
  }
</style>
