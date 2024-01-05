import { changeSections } from './aside.mjs'
import { updateLatestIncome, updateLatestSpend, createChart, updateChart, updateScaleChart, createScaleChart, responsiveChartFont, getTotalBalances } from './dashboard.mjs'
import { getCategoriesArray, createCategory, createIncomeRow, createCostRow, selectColorChange } from './expenses.mjs'
import { updatePendingBills, updateDaysRemaining } from './bills.mjs'
import { formatPrice } from './general.mjs'
import {} from './setttings.mjs'

const localStorage = window.localStorage

window.addEventListener('beforeunload', () => {
  const expensesIncome = document.querySelector('.expenses-income')
  const incomeTable = expensesIncome.querySelector("[role='table']")
  const incomeRows = incomeTable.querySelectorAll('.row')
  const incomeRowsArray = []
  incomeRows.forEach(row => {
    const [inputName, inputNumber] = row.querySelectorAll("[role='inputData']")
    const nameData = inputName.value
    const numberData = inputNumber.value
    incomeRowsArray.push([nameData, numberData])
  })
  localStorage.setItem('incomeRows', JSON.stringify(...[incomeRowsArray]))

  const categories = getCategoriesArray()
  localStorage.setItem('categories', JSON.stringify(categories))

  const expenesesCost = document.querySelector('.expenses-costs')
  const costTable = expenesesCost.querySelector("[role='table']")
  const costRows = costTable.querySelectorAll('.row')
  const costRowsArray = []
  costRows.forEach((row) => {
    const [inputDate, select, inputNumber] = row.querySelectorAll('.cost-input')
    const dateData = inputDate.value
    const categoryData = select.selectedOptions[0].getAttribute('aria-labelledby')
    const numberData = inputNumber.value
    costRowsArray.push([dateData, categoryData, numberData])
  })
  localStorage.setItem('rows', JSON.stringify(...[costRowsArray]))

  const bills = document.querySelector('.expenses-bills')
  const billsRows = bills.querySelectorAll('.row')
  const arrayOfBillsRows = []
  billsRows.forEach((row, index) => {
    if (index === 0) return
    const date = row.querySelector('.bills-inputDate').value
    const price = row.querySelector('.bills-inputPrice').value
    arrayOfBillsRows.push([date, price])
  })
  console.log(arrayOfBillsRows)
  localStorage.setItem('billsRows', JSON.stringify(...[arrayOfBillsRows]))

  const activeSection = document.querySelector('section.active')
  localStorage.setItem('activeSection', activeSection.id)
})

window.addEventListener('load', () => {
  const activeSection = localStorage.getItem('activeSection')
  changeSections(activeSection)

  const incomeRows = JSON.parse(localStorage.getItem('incomeRows')) || []
  if (incomeRows.length >= 1) {
    incomeRows.forEach(([name, amount]) => {
      createIncomeRow(name, amount)
    })

    const lastIncomeRow = incomeRows[incomeRows.length - 1]
    const [name, amount] = lastIncomeRow
    if (name !== '' && amount !== '') { createIncomeRow() }
  } else createIncomeRow()

  const categories = JSON.parse(localStorage.getItem('categories')) || []
  if (categories.length >= 1) {
    categories.forEach(([id, name, color]) => {
      createCategory(id, name, color)
    })
  }

  const costRows = JSON.parse(localStorage.getItem('rows')) || []
  if (costRows.length >= 1) {
    costRows.forEach(([date, category, price]) => {
      createCostRow(date, category, price)
    })
    const lastCostRow = costRows[costRows.length - 1]
    const [date, category, price] = lastCostRow
    if (date !== '' && category !== '' && price !== '') { createCostRow() }
  } else createCostRow()

  const billsInputDate = document.querySelectorAll('.bills-inputDate')
  billsInputDate.forEach(input => input.addEventListener('change', e => {
    updateDaysRemaining(e)
    updateLatestIncome()
  }))

  const billsInputPrice = document.querySelectorAll('.bills-inputPrice')
  billsInputPrice.forEach(input => {
    input.addEventListener('keyup', formatPrice)
    input.addEventListener('change', updateLatestIncome)
    input.addEventListener('change', () => {
      getTotalBalances('spend')
    })
  })

  const billsRows = JSON.parse(localStorage.getItem('billsRows')) || []
  billsRows.forEach(([date, price], index) => {
    billsInputDate[index].value = date
    billsInputPrice[index].value = price
    updateDaysRemaining(billsInputDate[index])
  })

  const selects = document.querySelectorAll('.cost-select')
  selects.forEach(select => {
    selectColorChange(select)
  })

  getTotalBalances('income')
  getTotalBalances('spend')
  updateLatestIncome()
  updateLatestSpend()

  createChart()
  const dashboardA = document.querySelector('.aside-li[aria-label="dashboard"] a')
  dashboardA.addEventListener('click', () => {
    getTotalBalances('spend')
    getTotalBalances('income')
    updateChart()
    updateScaleChart()
    updatePendingBills()
    updateLatestIncome()
    updateLatestSpend()
  })
  const chartSelector = document.querySelector('#chartSelector')
  chartSelector.addEventListener('change', updateChart)

  createScaleChart()
  const scaleChartSelector = document.querySelector('#scaleChartSelector')
  scaleChartSelector.addEventListener('change', updateScaleChart)

  updatePendingBills()

  window.addEventListener('resize', responsiveChartFont)
})
