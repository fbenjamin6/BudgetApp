import { updateLatestIncome, updateLatestSpend } from './dashboard.mjs'
import { createCategory, createCostRow, createIncomeRow, createRandomId } from './expenses.mjs'
import { formatPrice } from './general.mjs'
import { updateDaysRemaining } from './bills.mjs'

const categories =
[[createRandomId(), 'Groceries', '#c0e5f2'],
  [createRandomId(), 'Other', '#d6d6d6'],
  [createRandomId(), 'Clothing', '#d7c3fe'],
  [createRandomId(), 'Fuel', '#dec6af'],
  [createRandomId(), 'Shopping', '#afdec8']]

const names = ['David', 'Noah', 'Sebastian', 'Emma', 'Maria']

const resetBtn = document.querySelector('#resetData')
const testModeBtn = document.querySelector('#testMode')

const deleteAllData = () => {
  const categories = document.querySelectorAll('.category-li')
  categories.forEach(category => category.remove())

  const incomeRows = document.querySelectorAll('.expenses-income .row')
  incomeRows.forEach(row => row.remove())
  createIncomeRow()

  const costRows = document.querySelectorAll('.cost-table .row')
  costRows.forEach(row => row.remove())
  createCostRow()

  const billRows = document.querySelectorAll('.bills-table .row')
  billRows.forEach((row, index) => {
    if (index === 0) return
    const date = row.querySelector('.bills-inputDate')
    const price = row.querySelector('.bills-inputPrice')
    const daysRemaining = row.querySelector('.bills-daysRemaining')
    date.value = ''
    price.value = ''
    daysRemaining.textContent = '0 days'
  })

  updateLatestIncome()
  updateLatestSpend()
}

resetBtn.addEventListener('click', deleteAllData)

const createRandomData = () => {
  deleteAllData()
  categories.forEach(([id, name, color]) => {
    createCategory(id, name, color)
  })

  createIncomeRow('Salary', '$3,500')
  createIncomeRow(names[Math.floor(Math.random() * 5)] + '\'s rent', '$800')
  document.querySelector('.expenses-income .row').remove()
  createIncomeRow()

  for (let i = 20; i >= 1; i--) {
    const msDay = 86400000 * (i * 1.5)
    const date = new Date(Date.now() - msDay)
    const dd = date.getDate() + 1 < 10 ? '0' + (date.getDate() + 1).toString() : (date.getDate() + 1).toString()
    const mm = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()
    const yy = date.getFullYear().toString()
    const finalDate = yy + '-' + mm + '-' +  dd
    const id = categories[Math.floor(Math.random() * 5)][0]
    const price = formatPrice((Math.floor(Math.random() * 50) * 5).toString()) 
    createCostRow(finalDate, id, price)
  }

  const billRows = document.querySelectorAll(`.bills-table .row`)
  for (let i = 1; i <= 4; i++) {
    const row = billRows[i];
    const inputDate = row.querySelector(`input[type="date"]`)
    const inputPrice = row.querySelector(`input[type="text"]`)

    const msDay = 86400000 * (Math.floor(Math.random()*10))
    const date = new Date(Date.now() + msDay)
    const dd = date.getDate() + 1 < 10 ? '0' + (date.getDate() + 1).toString() : (date.getDate() + 1).toString()
    const mm = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()
    const yy = date.getFullYear().toString()
    const finalDate = yy + '-' + mm + '-' +  dd
    inputDate.value = finalDate

    inputPrice.value = formatPrice((Math.floor(Math.random() * 50 + 50) * 5).toString()) 
    updateDaysRemaining(inputDate)
  }


  document.querySelector('.cost-table .row').remove()
  createCostRow()
}

testModeBtn.addEventListener('click', createRandomData)
