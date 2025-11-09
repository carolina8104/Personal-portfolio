const colors = ["#1B64CB", "#FFA7E1", "#EE1321", "#FFCB09", "#F6700F", "#02A054"]
document.addEventListener("selectionchange", () => {
  const color = colors[Math.floor(Math.random() * colors.length)]
  document.documentElement.style.setProperty("--selection-color", color)
})

const carousel = document.querySelector('.reel')
const next = document.querySelector('.next')
const prev = document.querySelector('.prev')
const scrollAmount = carousel?.querySelector('.card')?.offsetWidth || 320

next?.addEventListener('click', () => carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' }))
prev?.addEventListener('click', () => carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' }))


const word1El = document.getElementById('word1')
const word2El = document.getElementById('word2')

if (word1El && word2El) {
const getWord = (topic, fallback) =>
  fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(topic)}&max=40`)
    .then(res => (res.ok ? res.json() : []))
    .then(data => data.length ? data[Math.floor(Math.random() * data.length)].word : fallback)
    .catch(() => fallback)

  const updateWords = async () => {
    const [word1, word2] = await Promise.all([
      getWord('creative', 'creative'),
      getWord('design', 'technology')
    ])
    word1El.textContent = word1
    word2El.textContent = word2
  }

  updateWords()
  setInterval(updateWords, 5000)
}

const helloEl = document.getElementById("hello")
if (helloEl) {
  const langs = ['pt', 'en', 'fr', 'de', 'it', 'sv', 'pl', 'fi', 'da', 'es', 'no']
  const word = 'Olá'
  let i = 0

  function showNext() {
    const lang = langs[i]
    i = (i + 1) % langs.length

    if (lang === 'pt') {
      helloEl.textContent = word
      return
    }

    fetch(`https://api.mymemory.translated.net/get?q=${word}&langpair=pt|${lang}`)
      .then(res => res.json())
      .then(data => {
        const text = data?.responseData?.translatedText
        helloEl.textContent =
          !text || text.includes('MYMEMORY WARNING') ? 'Hello!' : text
      })
      .catch(() => {
        helloEl.textContent = 'Hello!'
      })
  }

  showNext()
  setInterval(showNext, 1500)
}


const toggleButton = document.getElementById("theme-toggle")
const body = document.body

const savedTheme = localStorage.getItem("theme")
if (savedTheme === "light") {
  body.classList.add("light-mode")
  toggleButton.textContent = "⏾"
}

toggleButton.addEventListener("click", () => {
  body.classList.toggle("light-mode")
  const isLight = body.classList.contains("light-mode")
  toggleButton.textContent = isLight ? "⏾" : "☀︎"
  localStorage.setItem("theme", isLight ? "light" : "dark")
})

document.addEventListener("click", function(event) {
  if (event.target.classList.contains("scroll-down")) {
    window.scrollBy({
      top: 700,
      behavior: "smooth"
    })
  }
  if (event.target.classList.contains("scroll-up")) {
    window.scrollBy({
      top: -700,
      behavior: "smooth"
    })
  }
})

let isDrawingEnabled = false
let isCurrentlyDrawing = false
let currentColor = colors[0]
const storageKey = `savedDrawing_${window.location.pathname}`

const drawCanvas = document.getElementById('drawCanvas')
const drawOverlay = document.getElementById('drawOverlay')
const drawContext = drawCanvas.getContext('2d')
const toggleDraw_Button = document.getElementById('drawToggle')
const clearDraw_Button = document.getElementById('clearDrawing')

const resizeCanvasAndOverlay = () => {
  const width = document.documentElement.scrollWidth
  const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, window.innerHeight)
  const previousDrawing = drawCanvas.toDataURL()

  drawCanvas.width = width
  drawCanvas.height = height
  Object.assign(drawOverlay.style, { width: `${width}px`, height: `${height}px` })

  const img = new Image()
  img.onload = () => drawContext.drawImage(img, 0, 0)
  img.src = previousDrawing
}

['resize', 'load'].forEach(event => window.addEventListener(event, resizeCanvasAndOverlay))
resizeCanvasAndOverlay()

const saveDrawing = () => localStorage.setItem(storageKey, drawCanvas.toDataURL('image/png'))
const loadDrawing = () => {
  const saved = localStorage.getItem(storageKey)
  if (!saved) return
  const img = new Image()
  img.onload = () => drawContext.drawImage(img, 0, 0)
  img.src = saved
}
loadDrawing()

clearDraw_Button.addEventListener('click', () => {
  drawContext.clearRect(0, 0, drawCanvas.width, drawCanvas.height)
  localStorage.removeItem(storageKey)
})

toggleDraw_Button.addEventListener('click', () => {
  isDrawingEnabled = !isDrawingEnabled
  toggleDraw_Button.textContent = isDrawingEnabled ? '✖' : '✎'
  drawOverlay.style.pointerEvents = isDrawingEnabled ? 'auto' : 'none'
  drawOverlay.style.cursor = isDrawingEnabled
    ? 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\'><text y=\'24\' font-size=\'28\' fill=\'black\' stroke=\'white\'>✎</text></svg>") 0 24, auto'
    : 'auto'
})

const getPointerPos = e => ({ x: e.pageX, y: e.pageY })
const startDrawing = e => {
  if (!isDrawingEnabled) return
  e.preventDefault()
  currentColor = colors[Math.floor(Math.random() * colors.length)]
  const { x, y } = getPointerPos(e)
  isCurrentlyDrawing = true
  drawContext.beginPath()
  drawContext.moveTo(x, y)
}

const drawLine = e => {
  if (!isCurrentlyDrawing) return
  const { x, y } = getPointerPos(e)
  drawContext.lineTo(x, y)
  drawContext.strokeStyle = currentColor
  drawContext.lineWidth = 8
  drawContext.lineCap = 'round'
  drawContext.stroke()
}

const endDrawing = () => {
  if (!isCurrentlyDrawing) return
  isCurrentlyDrawing = false
  saveDrawing()
}

[['mousedown', startDrawing], ['mousemove', drawLine], ['mouseup', endDrawing]]
  .forEach(([eventName, handler]) => drawOverlay.addEventListener(eventName, handler))



const contentContainer = document.getElementById("content")
if (contentContainer && Array.isArray(projects)) {
  const urlId = new URLSearchParams(window.location.search).get("id")
  const selectedProjectId = urlId !== null ? Number(urlId) : undefined
  const selectedProject = projects.find(project => project.id === selectedProjectId)

  if (!selectedProject) contentContainer.innerHTML = "<h2>Project not found</h2>"
  else {
    const renderContent = key => {
      const value = selectedProject[key]
      if (!value) 
      return ""

      if (key === "title") 
      return `<h1>${value}</h1>`

      if (key.startsWith("text")) 
      return `<p>${value}</p>`

      if (key.startsWith("img")) 
      return `<img src="${value}" alt="Project Image">`

      if (key === "video") 
      return `<video controls autoplay muted loop><source src="${value}" type="video/mp4"></video>`
    }
  
    for (const key of Object.keys(selectedProject)) {
      if (key === "decor") continue
      const html = renderContent(key)
      if (html) contentContainer.innerHTML += `<section class="section">${html}</section>`
    }

    if (selectedProject.decor?.length)
      contentContainer.innerHTML += `<section class="section"><div class="decor">${selectedProject.decor.join("")}</div></section>`
      resizeAll?.()
  }
}


const menuToggle = document.createElement("button");
menuToggle.id = "menu-toggle";
menuToggle.textContent = "☰";

// adiciona o botão hamburger antes do botão de tema
const nav = document.querySelector("nav");
const themeButton = document.getElementById("theme-toggle");
nav.insertBefore(menuToggle, themeButton);

// seleciona o <ul> dentro do nav
const navMenu = nav.querySelector("ul");

// evento para mostrar/esconder o menu
menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});
