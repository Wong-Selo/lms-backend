'use strict'

class Query {
  constructor() {
    this.makeCondition = this.makeCondition.bind(this)
    this.makeUpdateQuery = this.makeUpdateQuery.bind(this)
    this.makeInsertQuery = this.makeInsertQuery.bind(this)
  }

  makeCondition(conditions) {
    let setConditions = []
    for (const condition of conditions) {
      const { column, operator, value } = condition
      setConditions.push(
        `${column} ${operator} '${Array.isArray(value) ? value : value}'`
      )
    }

    setConditions = setConditions.join(' AND ')
    return setConditions
  }

  makeUpdateQuery(tableName, dataObject, conditions) {
    let setTable = []
    let setConditions = this.makeCondition(conditions)

    for (const [key, value] of Object.entries(dataObject)) {
      const dataValue = !value ? 'NULL' : `'${value}'`
      setTable.push(`${key} = ${dataValue}`)
    }
    setTable = setTable.join(', ')

    return `UPDATE ${tableName} SET ${setTable} WHERE ${setConditions}`
  }

  makeInsertQuery(tableName, dataObject) {
    let columns = []
    let values = []
    for (const [key, value] of Object.entries(dataObject)) {
      columns.push(key)
      values.push(!value ? 'NULL' : `'${value}'`)
    }

    columns = columns.join(', ')
    values = values.join(', ')

    return `INSERT INTO ${tableName} (${columns}) VALUES (${values}) `
  }
}

module.exports = Query
