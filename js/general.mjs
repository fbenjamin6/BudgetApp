export const convertToArray = (iterableObject) => {
  const array = []
  iterableObject.forEach(item => array.push(item))
  return array
}

export function formatPrice (e) {
  console.log(e.target) 
  const input = e.target ? e.target : e
  if(input.value === ``) return
  let price = input.value ?  input.value.replace(/\D/g, '') : input.replace(/\D/g, '') 
  price = addColons(price)

  if (!price.startsWith('$')) {
    price = '$' + price
  }
  if (price.length === 1 && price === '$') {
    price = ''
  }

  if(e.target) input.value = price
  else return price 
}

export function addColons (price) {
  const reversed = price.split('').reverse().join('')
  const formatted = reversed.replace(/(\d{3})(?=\d)/g, '$1,')
  return formatted.split('').reverse().join('')
}

export const deleteRow = (e) => {
  const row = e.target.closest('.row')

  const table = e.target.closest("[role='table']")
  const rows = table.querySelectorAll('.row')
  const lastRow = rows[rows.length - 1]
  row.remove()
  if (table.getAttribute('aria-label') === 'income') {
    if (row === lastRow) { createIncomeRow() }
    getTotalBalances('income')
    updateLatestIncome()
  } else {
    if (row === lastRow) { createCostRow() }
    getTotalBalances('spend')
    updateLatestSpend()
  }
}
