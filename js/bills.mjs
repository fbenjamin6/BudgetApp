import { convertToArray } from './general.mjs'

export const updateDaysRemaining = (e) => {
  const row = e.target ? e.target.closest('.row') : e.closest('.row')
  const inputDateValue = e.target ? e.target.value : e.value
  console.log(inputDateValue)
  const date = new Date(inputDateValue)
  const dateParsed = Date.parse(date)
  const dateHours = dateParsed / 1000 / 60 / 60

  const dateNow = new Date()
  const dateNowParsed = Date.parse(dateNow)
  const dateNowHours = dateNowParsed / 1000 / 60 / 60

  const dif = date.getTimezoneOffset()
  const remainingHours = dateHours - dateNowHours + dif / 60
  const remainingDays = Math.ceil(remainingHours / 24)
  console.log(remainingHours)

  const paragraph = row.querySelector('.bills-daysRemaining')

  if (remainingDays > 0) {
    let string = ''
    remainingDays === 1 ? string = ' day remaining' : string = ' days remaining'
    paragraph.textContent = remainingDays + string
  }
  if (remainingDays === 0) {
    paragraph.textContent = 'Expires today'
  }
  if (remainingDays < 0) {
    paragraph.textContent = 'Expired'
  }
}

export const updatePendingBills = () => {
  const billsRows = convertToArray(document.querySelectorAll('.bills-table .row'))
  const fragment = document.createDocumentFragment()
  const content = document.querySelector('.dashboard-pendingBills .pendingBills-content')
  content.innerHTML = ''

  const billsRowsFiltered = billsRows.filter((row, index) => {
    if (index === 0) return false
    const date = row.querySelector('input[type="date"]').value
    const price = row.querySelector('input[type="text"]').value
    const daysRemaining = row.querySelector('.bills-daysRemaining').textContent
    if (date !== '' && price !== '' && daysRemaining !== 'Expired' && daysRemaining !== '0 days') return true
    else return false
  })

  if (billsRowsFiltered.length === 0) {
    const paragraph = document.createElement('p')
    paragraph.textContent = 'No pending bills to show'
    paragraph.classList.add('noBillCards')
    content.appendChild(paragraph)
  }

  const billsRowsSorted = billsRowsFiltered.toSorted((rowA, rowB) => {
    const dateA = rowA.querySelector('input[type="date"]').value
    const dateB = rowB.querySelector('input[type="date"]').value
    return Date.parse(dateA) - Date.parse(dateB)
  })

  billsRowsSorted.forEach((row) => {
    const bName = row.querySelector('.bills-name')
    const bImg = row.querySelector('.bills-img')
    const bDays = row.querySelector('.bills-daysRemaining')
    const bPrice = row.querySelector('.bills-inputPrice')
    const card = document.createElement('div')
    const bDaysClone = bDays.cloneNode(true)
    card.classList.add('billCard', 'row')
    // img se va clonado
    const name = document.createElement('p')
    name.textContent = bName.textContent
    name.classList.add('m-0')
    const divNameImg = document.createElement('div')
    divNameImg.appendChild(bImg.cloneNode(true))
    divNameImg.appendChild(name)
    divNameImg.classList.add('d-flex', 'align-items-center', 'gap-1', 'col-5')

    bDaysClone.classList.add('col')
    // days se va clonado
    const price = document.createElement('p')
    price.textContent = bPrice.value
    price.classList.add('col-2', 'text-end')
    // const
    // card.appendChild(bImg.cloneNode(true))
    card.appendChild(divNameImg)
    card.appendChild(bDaysClone)
    card.appendChild(price)
    fragment.appendChild(card)

    content.appendChild(fragment)
  })
}
