const { readFileSync, writeFileSync } = require('fs')

function handleDate(date) {
  const [day, month, year] = date.split('/')

  return `${year}-${month}-${day}`
}

function readJSONFile(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'))
}

function createInsertStatement(...data) {
  const [table, columns, values] = data

  return `INSERT INTO ${table}
  (${columns.join(', ')})
VALUES
  (${values.map(value => `'${value}'`).join(', ')});
`
}

function generateInsertUserQuery(user) {
  const columns = Object.keys(user)
  const values = Object.values(user)

  return createInsertStatement('Clientes', columns, values)
}

function saveQueryToFile(queries) {
  console.log(queries.join('\n'))

  writeFileSync('pessoas.sql', queries.join('\n'))
}

const init = () => {
  const users = readJSONFile('pessoas.json')
  // const queries = users.map(generateInsertUserQuery)
  const queries = users.map(user => {
    const {
      data_nasc,
      nome,
      email,
      cep,
      endereco,
      celular
    } = user

    return generateInsertUserQuery({
      data_nasc: handleDate(data_nasc),
      nome,
      email,
      cep,
      endereco,
      telefone: celular
    })
  })

  saveQueryToFile(queries)
}

init()
