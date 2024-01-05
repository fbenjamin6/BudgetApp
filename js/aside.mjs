const asideLinks = document.querySelectorAll('.aside-li a')
asideLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const tag = e.currentTarget.getAttribute('aria-label')
    changeSections(tag)
  })
})

export const changeSections = (tag) => {
  if (tag === null) {
    const dashboardSection = document.querySelector('#dashboard')
    dashboardSection.classList.add('active')
    return
  }
  const sections = document.querySelectorAll('section')
  sections.forEach(section => {
    // desactivamos todas las secciones
    section.classList.remove('active')
    // buscamos y activamos la seccion correcta
    if (section.id === tag) section.classList.add('active')
  })
  asideLinks.forEach(link => {
    link.classList.remove('active')
    if (link.getAttribute('aria-label') === tag) link.classList.add('active')
  })
}
