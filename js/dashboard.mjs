import { addColons, convertToArray } from './general.mjs'
import { getCategoriesArray } from './expenses.mjs'

export const getTotalBalances = (type) => {
  const inputs = type === 'income'
    ? document.querySelectorAll('.income-amount')
    : document.querySelectorAll('[data-spend][type="text"]')
  let amount = 0
  inputs.forEach(input => {
    const value = input.value.replace(/\D/g, '')
    if (value === '') return
    amount += parseInt(value)
  })
  const totalBalance = type === 'income'
    ? document.querySelector('.totalIncome')
    : document.querySelector('.totalSpend')
  totalBalance.textContent = '$' + addColons(amount.toString())
}

export const updateLatestIncome = () => {
  const table = document.querySelector('.expenses-income [role="table"]')
  const rows = table.querySelectorAll('.row')
  const rowsArray = convertToArray(rows)
  const filteredArray = rowsArray.filter(row => {
    const incomeName = row.querySelector('.income-name').value
    const incomeAmount = row.querySelector('.income-amount').value
    return incomeName !== '' && incomeAmount !== '' && incomeAmount !== '$'
  })
  const lastSpend = document.querySelector('.lastIncome span')
  const lastIncome = filteredArray[filteredArray.length - 1]
  lastIncome
    ? lastSpend.textContent =
    lastIncome.querySelector('.income-name').value + ' ' +
    lastIncome.querySelector('.income-amount').value
    : lastSpend.textContent = 'No recent income'
}

export const updateLatestSpend = () => {
  const datesArray = convertToArray(document.querySelectorAll('.cost-table [type="date"]'))
  const filteredArray = datesArray.filter(inputDate => isNaN(inputDate.value))
  filteredArray.sort((a, b) => {
    return Date.parse(b.value) - Date.parse(a.value)
  })
  filteredArray.some(input => {
    let boolean = false
    const row = input.closest('.row')
    const category = row.getAttribute('aria-label') === 'bill'
      ? row.querySelector('[aria-label="spendName"]').textContent
      : row.querySelector('[aria-label="spendName"]').value

    const price = row.querySelector('[aria-label="spendAmount"]').value
    if (category !== '' && category !== 'none' && price !== '' && price !== '$') {
      const lastSpend = document.querySelector('.lastSpend span')
      lastSpend.textContent = category + ' ' + price
      boolean = true
    } else {
      const lastSpend = document.querySelector('.lastSpend span')
      lastSpend.textContent = 'No recent spend'
    }
    return boolean
  })
}

let chart
export const createChart = () => {
  const canvas = document.querySelector('#chart')
  const [labels, dataPrice, colors] = updateChart()

  const data = {
    labels,
    datasets: [{
      label: [],
      data: dataPrice,
      backgroundColor: colors,
      hoverOffset: 4
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {

      tooltip: {
        enabled: true

      },

      legend: {
        position: 'right',
        labels: {

          font: {
            size: window.innerWidth <= 768 ? 18 : 20,
            family: 'Poppins'
          }
        }

      }
    }
  }

  const config = {
    type: 'pie',
    data,
    options
  }

  chart = new Chart(canvas, config)
}

export const updateChart = () => {
  const chartSelector = document.querySelector('#chartSelector').value
  const labels = []
  const colors = []
  const dataPrice = []

  if (chartSelector === 'total') {
    const incomesInput = document.querySelectorAll('.income-amount')
    const spendsInput = document.querySelectorAll('[data-spend][type="text"]')
    let totalIncome = 0
    let totalSpend = 0
    incomesInput.forEach(input => {
      const amount = input.value.replace(/\D/g, '')
      if (amount === '' || isNaN(amount)) return
      totalIncome += parseInt(amount)
    })
    spendsInput.forEach(input => {
      const amount = input.value.replace(/\D/g, '')
      if (amount === '' || isNaN(amount)) return
      totalSpend += parseInt(amount)
    })

    labels.push('Income')
    labels.push('Spendings')
    dataPrice.push(totalIncome)
    dataPrice.push(totalSpend)
    colors.push('#32a5dd')
    colors.push('#e54848')
  }

  if (chartSelector === 'expenses') {
    const categories = getCategoriesArray()
    const categoryId = []
    categories.forEach(([id, name, color]) => {
      if (id === undefined && name === undefined && color === undefined) return

      const inputPrices = convertToArray(document.querySelectorAll(`.row[aria-labelledby="${id}"] [aria-label="spendAmount"]`))
      const isEmpty = inputPrices.every(input => {
        return input.value === ''
      })
      if (isEmpty) return

      labels.push(name)
      categoryId.push(id)
      colors.push(color)
    })

    categoryId.forEach(id => {
      const inputPrices = document.querySelectorAll(`.row[aria-labelledby="${id}"] [aria-label="spendAmount"]`)
      let price = 0
      inputPrices.forEach(input => {
        const priceClean = parseInt(input.value.replace(/\D/g, ''))
        if (priceClean === '' || isNaN(priceClean)) return
        price += priceClean
      })
      dataPrice.push(price)
    })
  }

  if (chartSelector === 'bills') {
    const billsRows = document.querySelectorAll('.bills-table .row')

    billsRows.forEach((row, index) => {
      if (index === 0) return
      const name = row.querySelector('[aria-label="spendName"]')
      const color = name.getAttribute('color')
      const price = row.querySelector('[aria-label="spendAmount"]')
      const priceClean = parseInt(price.value.replace(/\D/g, ''))
      if (priceClean === '' || isNaN(priceClean)) return
      dataPrice.push(priceClean)
      labels.push(name.textContent)
      colors.push(color)
    })
  }

  if (chart === undefined) {
    return [labels, dataPrice, colors]
  }

  chart.data.labels = labels
  chart.data.datasets[0].data = dataPrice
  chart.data.datasets[0].backgroundColor = colors
  chart.update()
}

let scaleChart
export const createScaleChart = () => {
  const canvas = document.querySelector('#scaleChart')
  const [labels, datasets] = updateScaleChart()
  const data = {
    labels,
    datasets

  }

  const options = {
    layout: {
      padding: 15

    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {

      tooltip: {
        enabled: true

      },

      legend: {
        position: 'top',
        labels: {

          font: {
            size: window.innerWidth <= 768 ? 18 : 20,
            family: 'Poppins'
          },
          borderRadius: 50
          // padding: 10
        }

      }
    },
    scales: {
      x: {
        type: 'time'
      }
    }
  }

  const config = {
    type: 'line',
    data,
    options
  }

  scaleChart = new Chart(canvas, config)
}

export const updateScaleChart = () => {
  const chartSelector = document.querySelector('#scaleChartSelector').value
  const labels = []
  const datasets = []
  const msDay = 86400000
  const dif = new Date(Date.now()).getTimezoneOffset()
  let finalDif = 0
  dif > 0
    ? finalDif = dif * 60 * 1000
    : finalDif = -dif * 60 * 1000

  const todayDate = new Date(Date.now())
  let beforeDate
  if (chartSelector === 'week') {
    beforeDate = new Date(Date.now() - msDay * 7 + finalDif)
  } else if (chartSelector === 'month') {
    beforeDate = new Date(Date.now() - msDay * 30 + finalDif)
  }
  labels.push(beforeDate, todayDate)

  const costRows = convertToArray(document.querySelectorAll('.cost-table .row'))

  const categories = getCategoriesArray()
  categories.forEach(([id, name, color]) => {
    const rowsFiltered = costRows.filter(row => {
      const categorySelected = row.querySelector('select').value
      const date = row.querySelector('input[type=\'date\']').value
      const dateParsed = Date.parse(date)
      const dateIsOk = dateParsed > Date.parse(labels[0]) && dateParsed < Date.parse(labels[1])
      return categorySelected === name && dateIsOk
    })

    if (rowsFiltered.length === 0) return

    const data = {
      label: name,
      backgroundColor: color,
      borderColor: color,
      fill: false,
      data: []
    }

    const rowsSorted = rowsFiltered.toSorted((rowA, rowB) => {
      const dateA = rowA.querySelector('input[type="date"]').value
      const dateB = rowB.querySelector('input[type="date"]').value
      return Date.parse(dateA) - Date.parse(dateB)
    })

    rowsSorted.forEach(row => {
      const object = {}

      const date = row.querySelector('input[type="date"]').value
      if (date === '') return

      const newDate = new Date(Date.parse(date) + finalDif)
      object.x = newDate

      const price = row.querySelector('[aria-label="spendAmount"]').value
      const priceClean = parseInt(price.replace(/\D/g, ''))
      if (isNaN(priceClean)) return
      object.y = priceClean
      data.data.push(object)
    })

    datasets.push(data)
  })

  if (scaleChart === undefined) return [labels, datasets]

  scaleChart.data.labels = labels
  scaleChart.data.datasets = datasets
  scaleChart.update()
}

export const responsiveChartFont = () => {
  if (window.innerWidth < 768) {
    chart.config.options.plugins.legend.labels.font.size = 18
    scaleChart.config.options.plugins.legend.labels.font.size = 18
  } else if (window.innerWidth > 768) {
    chart.config.options.plugins.legend.labels.font.size = 20
    scaleChart.config.options.plugins.legend.labels.font.size = 20
  }
  chart.update()
  scaleChart.update()
}
