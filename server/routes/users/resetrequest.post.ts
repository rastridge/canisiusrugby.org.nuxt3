import { usersService } from '~/server/services/usersService'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log('in resetRequest route username = ', body.username)
  return usersService.resetRequest(body)
})
