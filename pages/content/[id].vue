<template>
  <div>
    <Head>
      <Title
        >Canisius University Rugby Club {{ content_data.content_name }}</Title
      >
    </Head>
    <Common-header :title="content_data.content_name" />
    <div class="">
      <div class="">
        <span v-html="content_data.content_body"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
  //
  // Get content id parameter
  //
  const route = useRoute()
  const content_id = ref(route.params.id)
  //
  // Get custom page content
  //
  const { data: content_data } = await useFetch(
    `/content/${content_id.value}`,
    {
      initialCache: false,
      method: 'get',
    },
  )
  //
  // make any images expand to width of container
  // should i do this when saving to db instead ?
  //
  /* 	content_data.value.content_body = content_data.value.content_body.replace(
	/\<img/g,
	'<img width="100%"'
) */
</script>
