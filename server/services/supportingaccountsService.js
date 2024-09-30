const { doDBQueryCanisiusrugby } = useQuery()
export const supportingaccountsService = {
  getAll,
  getAllCurrent,
  getOne,
  editOne,
  addOne,
  deleteOne,
  changeStatus,
}

async function getAll() {
  const sql = `SELECT
									supportingApp_id,
									supportingApp_id as id,
									supportingApp_name,
									supportingApp_name as title,
									supportingApp_description,
									supportingApp_url,
									supportingApp_owner,
									supportingApp_username,
									supportingApp_password,
									status,
									deleted,
									deleted_dt,
									modified_dt,
									modified_dt as dt
                FROM can_supportingaccts
                WHERE deleted = 0
                ORDER BY title ASC`

  const supportingaccounts = await doDBQueryCanisiusrugby(sql)
  return supportingaccounts
}

async function getAllCurrent() {
  const sql = `SELECT
								supportingApp_id,
								supportingApp_id as id,
								supportingApp_name,
								supportingApp_name as title,
								supportingApp_description,
								supportingApp_url,
								supportingApp_owner,
								supportingApp_username,
								supportingApp_password,
								status,
								deleted,
								deleted_dt,
								modified_dt,
								modified_dt as dt
							FROM can_supportingaccts
							WHERE
								deleted = 0
								AND
								STATUS = 1`

  const supportingaccounts = await doDBQueryCanisiusrugby(sql)
  return supportingaccounts
}

async function getOne(id) {
  const sql = `SELECT
									supportingApp_id,
									supportingApp_id as id,
									supportingApp_name,
									supportingApp_name as title,
									supportingApp_description,
									supportingApp_url,
									supportingApp_owner,
									supportingApp_username,
									supportingApp_password
							FROM
								can_supportingaccts
							WHERE
								supportingApp_id=${id}`

  const supportingaccounts = await doDBQueryCanisiusrugby(sql)
  return supportingaccounts[0]
}

async function addOne({
  supportingApp_name,
  supportingApp_description,
  supportingApp_url,
  supportingApp_owner,
  supportingApp_username,
  supportingApp_password,
}) {
  const sql = `INSERT INTO
								can_supportingaccts
              SET
								supportingApp_name = ?,
								supportingApp_description = ?,
								supportingApp_url = ?,
								supportingApp_owner = ?,
								supportingApp_username = ?,
								supportingApp_password = ?,
								STATUS = 1,
								deleted = 0,
								created_dt = NOW(),
								modified_dt = NOW()`

  let inserts = []
  inserts.push(
    supportingApp_name,
    supportingApp_description,
    supportingApp_url,
    supportingApp_owner,
    supportingApp_username,
    supportingApp_password,
  )
  const supportingaccounts = await doDBQueryCanisiusrugby(sql, inserts)
  return supportingaccounts
}

async function editOne({
  supportingApp_name,
  supportingApp_description,
  supportingApp_url,
  supportingApp_owner,
  supportingApp_username,
  supportingApp_password,
  id,
}) {
  const sql = `UPDATE can_supportingaccts SET
									supportingApp_name = ?,
									supportingApp_description = ?,
									supportingApp_url = ?,
									supportingApp_owner = ?,
									supportingApp_username = ?,
									supportingApp_password = ?,
									modified_dt= NOW()
								WHERE supportingApp_id = ?`
  let inserts = []

  inserts.push(
    supportingApp_name,
    supportingApp_description,
    supportingApp_url,
    supportingApp_owner,
    supportingApp_username,
    supportingApp_password,
    id,
  )
  const supportingaccounts = await doDBQueryCanisiusrugby(sql, inserts)
  return supportingaccounts
}

async function deleteOne(id) {
  const sql = `UPDATE can_supportingaccts SET deleted=1, deleted_dt=NOW() WHERE supportingApp_id=${id}`
  const supportingaccounts = await doDBQueryCanisiusrugby(sql)
  return supportingaccounts
}

async function changeStatus({ id, status }) {
  const sql =
    `UPDATE can_supportingaccts SET STATUS = "` +
    status +
    `" WHERE supportingApp_id  = ` +
    id
  const supportingaccounts = await doDBQueryCanisiusrugby(sql)
  return supportingaccounts
}
