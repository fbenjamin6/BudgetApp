import { formatPrice, deleteRow, convertToArray } from './general.mjs'
import { updateLatestIncome, getTotalBalances, updateLatestSpend } from './dashboard.mjs'

const addBtn = document.querySelector('.createCategoryButton')

addBtn.addEventListener('click', () => {
  const categoryName = document.querySelector('.createCategory-text').value
  const categoryColor = document.querySelector('.createCategory-color').value
  const id = createRandomId()
  if (categoryName !== '') createCategory(id, categoryName, categoryColor)
})

export const createRandomId = () => Math.random().toString(16).slice(2)

export const getCategoriesArray = () => {
  const categories = document.querySelectorAll('.category-li')
  const categoryArray = []
  categories.forEach(category => {
    const id = category.id
    const name = category.getAttribute('name')
    const color = category.getAttribute('color')
    categoryArray.push([id, name, color])
  })
  return categoryArray
}

export const createIncomeRow = (name, amount) => {
  const table = document.querySelector("[role='table']")
  const newRow = document.createElement('div')
  newRow.classList.add('row', 'px-1')

  const inputName = inputSelectMaker('input', 'income-name', 'text')
  // inputName.classList.add('col')
  inputName.setAttribute('placeholder', 'New income')
  inputName.dataset.income = ''
  inputName.addEventListener('change', updateLatestIncome)

  const inputNumber = inputSelectMaker('input', 'income-amount', 'text')
  inputNumber.setAttribute('placeholder', '$0')
  inputNumber.dataset.income = ''
  inputNumber.addEventListener('change', () => {
    updateLatestIncome()
    getTotalBalances('income')
  })
  inputNumber.addEventListener('keyup', formatPrice)

  const deleteBtn = document.createElement('button')
  deleteBtn.classList.add('deleteRowBtn')
  const img = document.createElement('img')
  img.src = '../imgs/borrar.png'
  deleteBtn.appendChild(img)
  deleteBtn.addEventListener('click', deleteRow)

  const div = document.createElement('div')
  div.classList.add('d-flex', 'col', 'justify-content-end')

  div.appendChild(inputNumber)
  div.appendChild(deleteBtn)

  newRow.appendChild(inputName)
  newRow.appendChild(div)

  table.appendChild(newRow)

  if (name) { inputName.value = name }

  if (amount) { inputNumber.value = amount }
}

const deleteCategory = (btn) => {
  btn.addEventListener('click', e => {
    const category = e.target.closest('.category-li')
    const categoryId = category.id
    category.remove()

    const options = document.querySelectorAll('.cost-option')
    options.forEach(option => {
      const optionAria = option.getAttribute('aria-labelledby')

      if (optionAria === categoryId) {
        const selectedOption = option.closest('.cost-select').selectedOptions[0]
        if (optionAria === selectedOption.getAttribute('aria-labelledby')) {
          option.closest('.row').style = 'background: transparent'
          option.closest('.row').removeAttribute('aria-labelledby')
        }
        option.remove()
      }
    })
  })
}

const editCategory = (btn) => {
  btn.addEventListener('click', e => {
    const category = e.target.closest('.category-li')
    const editButton = category.querySelector('[aria-label=edit]')
    const confirmButton = category.querySelector('[aria-label=confirm]')
    const input = category.querySelector('.category-li-input')

    input.disabled = false
    editButton.hidden = true
    confirmButton.hidden = false
  })
}

const confirmCategory = (btn) => {
  btn.addEventListener('click', e => {
    const category = e.target.closest('.category-li')
    const editButton = category.querySelector('[aria-label=edit]')
    const confirmButton = category.querySelector('[aria-label=confirm]')
    const input = category.querySelector('.category-li-input')

    const newName = input.value
    const categoryId = category.id
    category.setAttribute('name', input.value)
    input.style = `width: ${newName.length + 0.1}ch`

    const options = document.querySelectorAll('.cost-option')
    options.forEach(option => {
      if (option.getAttribute('aria-labelledby') === categoryId) {
        option.value = newName
        option.textContent = newName
      }
    })

    input.disabled = true
    editButton.hidden = false
    confirmButton.hidden = true
  })
}

export const createCategory = (id, name, color) => {
  const input = document.createElement('Input')
  input.classList.add('category-li-input')
  input.setAttribute('type', 'text')
  input.setAttribute('disabled', true)
  input.style = `width: ${name.length + 0.1}ch`
  input.value = name
  input.addEventListener('keypress', (e) => {
    input.style = `width: ${e.target.value.length + 1.1}ch`
  })

  const edit = document.createElement('img')
  edit.classList.add('mx-1')
  edit.ariaLabel = 'edit'
  edit.src = './imgs/lapiz.png'
  editCategory(edit)

  const confirm = document.createElement('img')
  confirm.classList.add('mx-1')
  confirm.ariaLabel = 'confirm'
  confirm.src = './imgs/confirm.png'
  confirm.hidden = true
  confirmCategory(confirm)

  const deleteBtn = document.createElement('img')
  deleteBtn.ariaLabel = 'delete'
  deleteBtn.src = './imgs/eliminar.png'
  deleteCategory(deleteBtn)

  const li = document.createElement('LI')
  li.classList.add('category-li')
  li.id = id
  li.setAttribute('color', color)
  li.setAttribute('name', name)
  li.style = `background: ${color};`
  li.appendChild(input)
  li.appendChild(confirm)
  li.appendChild(edit)
  li.appendChild(deleteBtn)

  const ul = document.querySelector('.category-ul')
  ul.appendChild(li)

  const selects = document.querySelectorAll('.cost-select')
  selects.forEach(select => {
    const option = createOption(id, name, color)
    select.appendChild(option)
  })
}

export const createCostRow = (date, categoryId, price) => {
  const table = document.querySelector('.cost-table')
  const newRow = document.createElement('div')
  newRow.classList.add('row', 'mx-0', 'rounded-1', 'justify-content-evenly', 'position-relative')

  const div1 = document.createElement('div')
  div1.classList.add('inputDiv', 'd-flex', 'justify-content-center')
  const div2 = document.createElement('div')
  div2.classList.add('inputDiv', 'd-flex', 'justify-content-center')
  const div3 = document.createElement('div')
  div3.classList.add('inputDiv', 'd-flex', 'justify-content-center')

  const inputDate = inputSelectMaker('input', 'cost-input', 'date')
  inputDate.dataset.spend = ''
  inputDate.addEventListener('change', updateLatestSpend)

  const select = inputSelectMaker('select', 'cost-input')
  select.setAttribute('aria-label', 'spendName')
  select.addEventListener('change', updateLatestSpend)

  const inputNumber = inputSelectMaker('input', 'cost-input', 'text')
  inputNumber.setAttribute('placeholder', '$0')
  inputNumber.setAttribute('aria-label', 'spendAmount')
  inputNumber.dataset.spend = ''
  inputNumber.addEventListener('keyup', formatPrice)
  inputNumber.addEventListener('change', () => {
    getTotalBalances('spend')
    updateLatestSpend()
  })

  const deleteBtn = document.createElement('button')
  deleteBtn.classList.add('deleteRowBtn')
  const img = document.createElement('img')
  img.src = '../imgs/borrar.png'
  deleteBtn.appendChild(img)
  deleteBtn.addEventListener('click', deleteRow)

  div1.appendChild(inputDate)
  div2.appendChild(select)
  div3.appendChild(inputNumber)

  newRow.appendChild(div1)
  newRow.appendChild(div2)
  newRow.appendChild(div3)
  newRow.appendChild(deleteBtn)

  table.appendChild(newRow)

  if (date) { inputDate.value = date }

  if (price) { inputNumber.value = price }

  if (categoryId) {
    const categories = getCategoriesArray()
    const index = categories.findIndex(([id]) => {
      return id === categoryId
    })
    const [id, name, color] = categories[index]
    select.value = name
    select.closest('.row').style = `background: ${color}`
    select.closest('.row').setAttribute('aria-labelledby', id)
  }
}

const createOption = (id, name, color) => {
  const option = document.createElement('option')
  option.value = name
  option.textContent = name
  option.style = `background: ${color};`
  option.setAttribute('aria-labelledby', id)
  option.setAttribute('color', color)
  option.classList.add('cost-option')
  return option
}

export const selectColorChange = (select) => {
  select.addEventListener('change', (e) => {
    const row = e.target.closest('.row')
    const color = select.selectedOptions[0].getAttribute('color')
    row.style = `background: ${color}`
    const id = select.selectedOptions[0].getAttribute('aria-labelledby')
    row.setAttribute('aria-labelledby', id)
  })
}

const addRowListener = (e) => {
  const table = e.target.closest("[role='table']")
  const lastRow = table.lastElementChild
  const inputs = lastRow.querySelectorAll("[role='inputData']")
  const inputsArray = convertToArray(inputs)

  const areInputsFilled = inputsArray.every(input => input.value !== '')

  if (areInputsFilled) {
    inputsArray.forEach(input => input.removeEventListener('change', addRowListener))
    table.getAttribute('aria-label') === 'income'
      ? createIncomeRow()
      : createCostRow()
  }
}

const inputSelectMaker = (element, newClass, type) => {
  if (element === 'input') {
    const input = document.createElement('input')
    input.classList.add(newClass)
    input.setAttribute('type', type)
    input.setAttribute('role', 'inputData')
    input.addEventListener('change', addRowListener)
    return input
  }

  if (element === 'select') {
    const categories = getCategoriesArray()
    const select = document.createElement('select')
    select.classList.add(newClass, 'cost-select')
    select.setAttribute('role', 'inputData')
    const hiddenOption = document.createElement('option')
    hiddenOption.value = ''
    hiddenOption.textContent = 'none'
    hiddenOption.hidden = true
    select.appendChild(hiddenOption)
    categories.forEach(([id, name, color]) => {
      const option = createOption(id, name, color)
      select.appendChild(option)
    })
    selectColorChange(select)
    select.addEventListener('change', addRowListener)
    return select
  }
}
