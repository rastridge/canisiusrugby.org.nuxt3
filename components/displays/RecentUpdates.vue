<template>
  <div>
    <!-- <div class="my-simple-card-style md:w-6 md:w-4">
      <div class="my-datatable-wrapper-style"> -->

    <div
      class="bg-white border-round-lg md:border-round-xl shadow-6 m-0 md:m-2 p-1 md:p-2"
    >
      <div
        class="p-2 text-md border-blue-700 border-2 border-round-md md:border-round-lg"
      >
        <p class="my-text-style font-semibold text-center">Recent Updates</p>

        <DataTable
          :value="accounts"
          class="p-datatable-sm my-text-style"
        >
          <Column
            field="name"
            header="Name"
          ></Column>
          <Column
            field="modified_dt"
            header="Updated"
          >
            <template #body="slotProps">
              <div>
                {{ $dayjs(slotProps.data.modified_dt).format('MMM D YYYY') }}
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
  const { $dayjs } = useNuxtApp()

  //
  // Get current news
  //
  const { data: accounts } = await useFetch('/accounts/getrecentupdates', {
    method: 'get',
  })
</script>
