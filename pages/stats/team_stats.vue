<template>
  <div id="team_stats">
    <!--     <Head>
      <Title>Canisius Rugby Club Team Record</Title>
    </Head>
    <div class="topsectioncenter">
      <div class="topsectionitem">
        <common-header title="Team Record" />
      </div>
    </div>
    <div class="my-simple-card-style">
      <table class="nowrap">
        <thead>
          <tr>
            <th class="text-center">Games</th>
            <th class="text-center">Wins</th>
            <th class="text-center">Losses</th>
            <th class="text-center">Ties</th>
            <th class="text-center">Unknown</th>
            <th class="text-center">Win%</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-center">{{ total.game_count }}</td>
            <td class="text-center">{{ total.wins }}</td>
            <td class="text-center">{{ total.losses }}</td>
            <td class="text-center">{{ total.ties }}</td>
            <td class="text-center">{{ total.unknown }}</td>
            <td class="text-center">
              {{
                (
                  (total.wins / (total.game_count - total.unknown)) *
                  100
                ).toFixed(0)
              }}
              %
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="my-simple-card-style">
      <div class="my-datatable-wrapper-style">
        <DataTable
          :value="record"
          class="p-datatable-sm my-text-style"
          row-hover
        >
          <Column
            field="season"
            header="Season"
          />
          <template #body="slotProps">
            {{ slotProps.data.season }}
          </template>
          <Column
            field="game_count"
            header="Games"
          />
          <Column
            field="wins"
            header="Wins"
          />
          <Column
            field="losses"
            header="Losses"
          />
          <Column
            field="ties"
            header="Ties"
          />
          <Column
            field="unknown"
            header="Unknown"
          />
          <Column header="Win%">
            <template #body="slotProps">
              {{
                (
                  (slotProps.data.wins /
                    (slotProps.data.game_count - slotProps.data.unknown)) *
                  100
                ).toFixed(0)
              }}
              %
            </template></Column
          >
        </DataTable>
      </div>
    </div> -->
  </div>
</template>

<script setup>
  //
  // get initial 15s data
  //
  /*   const record = ref([])
  const total = ref([])

  const { data: r } = await useFetch(`/game_player_stats/getteamstats`, {
    method: 'get',
  })
  record.value = r.value
*/
  const { data: s } = await useFetch(`/game_player_stats/getteamstatstotal`, {
    method: 'get',
  })
  total.value = s.value
</script>

<style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid;
    padding: 1rem;
    background-color: white;
  }

  th,
  td {
    text-align: center;
    padding: 0.5rem;
  }
</style>
