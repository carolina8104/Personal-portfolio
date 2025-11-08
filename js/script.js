const colors = ["#1B64CB", "#FFA7E1", "#EE1321", "#FFCB09", "#F6700F", "#02A054"];
const selectionColor = () => {
  const color = colors[Math.floor(Math.random() * colors.length)];
  document.documentElement.style.setProperty("--selection-color", color);
};
document.addEventListener("selectionchange", selectionColor);

const carousel = document.querySelector('.reel');
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');
const scrollAmount = carousel?.querySelector('.card')?.offsetWidth || 320;

next?.addEventListener('click', () => carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
prev?.addEventListener('click', () => carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));


if (document.getElementById('word1')) {
  const getWord = async (topic, fallback) => {
    try {
      const res = await fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(topic)}&max=40`)
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      if (!data || data.length === 0) return fallback
      return data[Math.floor(Math.random() * data.length)].word
    } catch {
      return fallback
    }
  }

  const updateWords = async () => {
    const word1 = await getWord('creative', 'creative')
    const word2 = await getWord('design', 'technology')
    document.getElementById('word1').textContent = word1
    document.getElementById('word2').textContent = word2
  }

  updateWords()
  setInterval(updateWords, 5000)
}

if (document.getElementById("hello")) {
  const langs = ['pt', 'en', 'fr', 'de', 'it', 'sv', 'pl', 'fi', 'da', 'es', 'no']
  const word = 'Olá'
  const helloEl = document.getElementById('hello')
  let i = 0

  function showNext() {
    const lang = langs[i]

    if (lang === 'pt') {
      helloEl.textContent = 'Olá'
      i = (i + 1) % langs.length
      return
    }

    fetch(`https://api.mymemory.translated.net/get?q=${word}&langpair=pt|${lang}`)
      .then(res => res.json())
      .then(data => {
        let text = data.responseData.translatedText

        // se a API retornar aviso ou texto inválido, usa "Hello!"
        if (!text || text.includes('MYMEMORY WARNING')) {
          text = 'Hello!'
        }

        helloEl.textContent = text
        i = (i + 1) % langs.length
      })
      .catch(() => {
        // fallback em caso de erro de rede
        helloEl.textContent = 'Hello!'
        i = (i + 1) % langs.length
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








const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
const drawBtn = document.getElementById('drawToggle');
const clearBtn = document.getElementById('clearDrawing');
const getBlockedSections = () => document.querySelectorAll('.content, nav, footer, .carousel-section');
let drawingEnabled = false, isDrawing = false, currentColor = colors[0];

 const pageKey = 'savedDrawing_' + window.location.pathname;

const resizeCanvas = () => {
  canvas.width = document.documentElement.scrollWidth;
  canvas.height = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    window.innerHeight
  );
};
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const saveDrawing = () => localStorage.setItem(pageKey, canvas.toDataURL('image/png'));

const loadDrawing = () => {
  const saved = localStorage.getItem(pageKey);
  if (!saved) return;
  const img = new Image();
  img.onload = () => ctx.drawImage(img, 0, 0);
  img.src = saved;
};

clearBtn.onclick = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  localStorage.removeItem(pageKey);
};

const inBlockedZone = (x, y) => {
  const blockedSections = document.querySelectorAll('.content, nav, footer, .carousel-section');
  return [...blockedSections].some(sec => {
    const r = sec.getBoundingClientRect();
    const t = r.top + window.scrollY, l = r.left;
    return x >= l && x <= r.right && y >= t && y <= r.bottom;
  });
};

drawBtn.onclick = () => {
  drawingEnabled = !drawingEnabled;
  drawBtn.textContent = drawingEnabled ? '✖' : '✎';
  canvas.style.pointerEvents = drawingEnabled ? 'auto' : 'none';
  document.body.style.cursor = drawingEnabled
    ? 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\'><text y=\'24\' font-size=\'28\'>✎</text></svg>") 0 24, auto'
    : 'auto';
};

canvas.onmousedown = e => {
  if (!drawingEnabled || inBlockedZone(e.pageX, e.pageY)) return;
  currentColor = colors[Math.floor(Math.random() * colors.length)];
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.pageX, e.pageY);
};

canvas.onmousemove = e => {
  if (!isDrawing) {
    if (drawingEnabled) {
      document.body.style.cursor = inBlockedZone(e.pageX, e.pageY)
        ? 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'-10 -10 68 68\' width=\'30\' height=\'30\'><text x=\'8\' y=\'36\' font-size=\'38\' fill=\'white\' stroke=\'black\' stroke-width=\'1.5\'>⃠</text></svg>") 0 24, auto'
        : 'url("data:image/svg+xml;utf8,<svg class=\'cursor\' xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\'><text y=\'24\' font-size=\'28\' fill=\'white\' stroke=\'black\'>✎</text></svg>") 0 24, auto';
    }
    return;
  }

  if (inBlockedZone(e.pageX, e.pageY)) return (isDrawing = false);
  ctx.lineTo(e.pageX, e.pageY);
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.stroke();
};

canvas.onmouseup = () => {
  isDrawing = false;
  saveDrawing();
};

loadDrawing();


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

      if (key === "text1") 
      return `<p>${value}</p>`

      if (key.startsWith("img")) 
      return `<img src="${value}" alt="Project Image">`

      if (key === "video") 
      return `<video controls autoplay muted loop><source src="${value}" type="video/mp4"></video>`
    };

    Object.keys(selectedProject).forEach(key => {
      if (key === "decor") return
      const html = renderContent(key)
      if (html) contentContainer.innerHTML += `<section class="section">${html}</section>`
    })

    if (selectedProject.decor?.length)
      contentContainer.innerHTML += `<section class="section"><div class="decor">${selectedProject.decor.join("")}</div></section>`
    resizeCanvas?.()
  }
}
