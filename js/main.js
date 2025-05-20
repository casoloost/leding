document.addEventListener("DOMContentLoaded", () => {
  try {
    // Menu Toggle para dispositivos móveis
    const menuToggle = document.querySelector(".menu-toggle")
    const nav = document.querySelector("nav")

    if (menuToggle && nav) {
      menuToggle.addEventListener("click", function () {
        nav.classList.toggle("active")

        // Alternar ícone
        const icon = this.querySelector("i")
        if (icon) {
          if (icon.classList.contains("fa-bars")) {
            icon.classList.remove("fa-bars")
            icon.classList.add("fa-times")
          } else {
            icon.classList.remove("fa-times")
            icon.classList.add("fa-bars")
          }
        }
      })
    }

    // Formulário de contato
    const contactForm = document.getElementById("form-contato")
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault()

        // Simular envio do formulário
        const submitBtn = this.querySelector('button[type="submit"]')
        if (!submitBtn) return

        const originalText = submitBtn.textContent

        submitBtn.disabled = true
        submitBtn.textContent = "Enviando..."

        setTimeout(() => {
          contactForm.reset()
          submitBtn.disabled = false
          submitBtn.textContent = originalText

          // Mostrar mensagem de sucesso
          alert("Mensagem enviada com sucesso! Entraremos em contato em breve.")
        }, 1500)
      })
    }

    // Rolagem suave para links âncora
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()

        const targetId = this.getAttribute("href")
        if (!targetId) return

        const target = document.querySelector(targetId)
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: "smooth",
          })

          // Fechar menu móvel se estiver aberto
          if (nav && nav.classList.contains("active") && menuToggle) {
            nav.classList.remove("active")
            const icon = menuToggle.querySelector("i")
            if (icon) {
              icon.classList.remove("fa-times")
              icon.classList.add("fa-bars")
            }
          }
        }
      })
    })

    // Atualizar ano atual no rodapé
    const anoAtualElement = document.getElementById("ano-atual")
    if (anoAtualElement) {
      anoAtualElement.textContent = new Date().getFullYear()
    }

    // Carregar configurações do site
    loadSiteSettings()

    // Configurar imagens de fundo do site
    setupBackgroundImages()

    // Gerenciar banner de cookies
    setupCookieBanner()

    // Inicializar o detector de visitantes
    initVisitorDetector()

    // Garantir que as imagens se ajustem corretamente
    setupImageFitting()

    // Monitorar redimensionamento da janela para ajustar imagens
    window.addEventListener(
      "resize",
      debounce(() => {
        setupImageFitting()
      }, 250),
    )
  } catch (error) {
    console.error("Erro durante a inicialização:", error)
    // Em caso de erro, garantir que a página ainda seja utilizável
  }
})

// Função para inicializar o detector de visitantes
function initVisitorDetector() {
  // Carregar configurações
  const settings = JSON.parse(localStorage.getItem("siteSettings")) || {}

  // Verificar se o redirecionamento inteligente está ativado
  if (!settings.ativarRedirecionamento) {
    return
  }

  // Configurar o detector de visitantes
  const detectorOptions = {
    redirectUrl: settings.urlRedirecionamento || null,
    redirectDelay: settings.delayRedirecionamento || 1000,
    debugMode: settings.modoDebug || false,
    excludedPaths: ["/painel.html", "/admin.html", "/admin/", "/wp-admin/"],
    cookieDuration: settings.duracaoCookie || 7,
    sensitivityLevel: settings.nivelSensibilidade || "medium",
  }

  // Inicializar o detector
  if (typeof window.VisitorDetector === "function") {
    new window.VisitorDetector(detectorOptions)
  }
}

// Modificar a função setupCookieBanner para ser mais robusta
function setupCookieBanner() {
  try {
    const cookieOverlay = document.getElementById("cookie-overlay")
    if (!cookieOverlay) return

    const cookieBackground = document.querySelector(".cookie-background")
    const acceptBtn = document.getElementById("accept-cookies")
    const rejectBtn = document.getElementById("reject-cookies")
    const cookieText = document.getElementById("cookie-text")

    // Verificar se o banner de cookies está ativado nas configurações
    const settings = JSON.parse(localStorage.getItem("siteSettings")) || {}

    // Se o banner não estiver ativado, não mostrar
    if (!settings.ativarCookies) {
      return
    }

    // Atualizar o texto do banner se estiver definido
    if (cookieText && settings.textoCookies) {
      cookieText.textContent = settings.textoCookies
    }

    // Configurar imagem de fundo com base no tamanho da tela
    if (cookieBackground) {
      // Verificar se é um dispositivo móvel
      const isMobile = window.innerWidth <= 768
      let cookieImageUrl = ""

      // Determinar qual fonte de imagem usar
      if (isMobile) {
        if (settings.cookieBgMobileSource === "url" && settings.cookieBgMobile) {
          cookieImageUrl = settings.cookieBgMobile
        } else if (settings.cookieBgMobileSource === "upload" && settings.cookieBgMobileData) {
          cookieImageUrl = settings.cookieBgMobileData
        } else if (settings.cookieBgMobile) {
          cookieImageUrl = settings.cookieBgMobile
        } else if (settings.cookieBgMobileData) {
          cookieImageUrl = settings.cookieBgMobileData
        }
      } else {
        if (settings.cookieBgDesktopSource === "url" && settings.cookieBgDesktop) {
          cookieImageUrl = settings.cookieBgDesktop
        } else if (settings.cookieBgDesktopSource === "upload" && settings.cookieBgDesktopData) {
          cookieImageUrl = settings.cookieBgDesktopData
        } else if (settings.cookieBgDesktop) {
          cookieImageUrl = settings.cookieBgDesktop
        } else if (settings.cookieBgDesktopData) {
          cookieImageUrl = settings.cookieBgDesktopData
        }
      }

      // Verificar se a URL é válida antes de aplicá-la
      if (cookieImageUrl && (cookieImageUrl.startsWith("data:image") || isValidURL(cookieImageUrl))) {
        cookieBackground.style.backgroundImage = `url('${cookieImageUrl}')`
      } else {
        // Usar uma cor de fundo padrão se a URL não for válida
        cookieBackground.style.backgroundColor = "rgba(0, 0, 0, 0.8)"
        cookieBackground.style.backgroundImage = "none"
      }

      cookieBackground.style.backgroundSize = settings.cookieBgFit || "cover"
      cookieBackground.style.backgroundPosition = settings.cookieBgPosition || "center center"

      // Aplicar o efeito de blur configurado
      const blurValue = settings.cookieBlur !== undefined ? settings.cookieBlur : 5
      cookieBackground.style.filter = `blur(${blurValue}px)`
    }

    // Mostrar o banner com um pequeno atraso
    setTimeout(() => {
      if (cookieOverlay) {
        cookieOverlay.classList.add("show")
      }
    }, 1000)

    // Configurar botões
    if (acceptBtn) {
      acceptBtn.addEventListener("click", () => {
        // Registrar a escolha do usuário
        localStorage.setItem("cookieChoice", "accepted")

        // Esconder o banner
        cookieOverlay.classList.remove("show")

        // Redirecionar se um link estiver definido
        if (settings.linkAceitar) {
          window.location.href = settings.linkAceitar
        } else {
          // Se não houver redirecionamento, mostrar o banner novamente após um tempo
          setTimeout(() => {
            cookieOverlay.classList.add("show")
          }, 60000) // Mostrar novamente após 1 minuto
        }
      })
    }

    if (rejectBtn) {
      rejectBtn.addEventListener("click", () => {
        // Registrar a escolha do usuário
        localStorage.setItem("cookieChoice", "rejected")

        // Esconder o banner
        cookieOverlay.classList.remove("show")

        // Redirecionar se um link estiver definido
        if (settings.linkRejeitar) {
          window.location.href = settings.linkRejeitar
        } else {
          // Se não houver redirecionamento, mostrar o banner novamente após um tempo
          setTimeout(() => {
            cookieOverlay.classList.add("show")
          }, 60000) // Mostrar novamente após 1 minuto
        }
      })
    }
  } catch (error) {
    console.error("Erro ao configurar banner de cookies:", error)
    // Em caso de erro, não fazer nada para evitar loops infinitos
  }
}

// Função para pré-carregar imagens
function preloadImages() {
  const settings = JSON.parse(localStorage.getItem("siteSettings")) || {}

  // Lista de imagens para pré-carregar
  const imagesToPreload = []

  if (settings.logo) imagesToPreload.push(settings.logo)
  if (settings.heroBgImage) imagesToPreload.push(settings.heroBgImage)
  if (settings.cookieBgDesktop) imagesToPreload.push(settings.cookieBgDesktop)
  if (settings.cookieBgMobile) imagesToPreload.push(settings.cookieBgMobile)

  // Pré-carregar imagens
  imagesToPreload.forEach((src) => {
    if (src && src.trim() !== "") {
      const img = new Image()
      img.src = src
    }
  })
}

// Modificar a função loadSiteSettings para ser mais robusta
function loadSiteSettings() {
  try {
    const settings = JSON.parse(localStorage.getItem("siteSettings")) || {}

    // Determinar qual fonte de logo usar
    let logoUrl = ""
    if (settings.logoSource === "url" && settings.logo) {
      logoUrl = settings.logo
    } else if (settings.logoSource === "upload" && settings.logoData) {
      logoUrl = settings.logoData
    } else if (settings.logo) {
      logoUrl = settings.logo
    } else if (settings.logoData) {
      logoUrl = settings.logoData
    }

    // Atualizar elementos do site com as configurações salvas
    updateElement("logo", "src", logoUrl)
    updateElement("footer-logo", "src", logoUrl)

    // Determinar qual fonte de imagem "Sobre Nós" usar
    let sobreImgUrl = ""
    if (settings.sobreImgSource === "url" && settings.sobreImg) {
      sobreImgUrl = settings.sobreImg
    } else if (settings.sobreImgSource === "upload" && settings.sobreImgData) {
      sobreImgUrl = settings.sobreImgData
    } else if (settings.sobreImg) {
      sobreImgUrl = settings.sobreImg
    } else if (settings.sobreImgData) {
      sobreImgUrl = settings.sobreImgData
    }

    // Atualizar a imagem da seção "Sobre Nós"
    const sobreImgElement = document.querySelector("#sobre .image img")
    if (sobreImgElement) {
      // Remover qualquer handler de erro existente para evitar loops
      sobreImgElement.onerror = null

      if (sobreImgUrl && (sobreImgUrl.startsWith("data:image") || isValidURL(sobreImgUrl))) {
        sobreImgElement.src = sobreImgUrl

        // Adicionar handler de erro que não causa loops
        sobreImgElement.onerror = function () {
          if (!this.src.includes("placeholder.com")) {
            console.warn("Falha ao carregar imagem 'Sobre Nós'. Usando placeholder.")
            this.src = "https://via.placeholder.com/400x300"
            this.onerror = null
          }
        }
      } else {
        sobreImgElement.src = "https://via.placeholder.com/400x300"
      }
    }

    // Atualizar outros elementos de texto
    updateElement("empresa-nome", "textContent", settings.empresa)
    updateElement("footer-empresa-nome", "textContent", settings.empresa)
    updateElement("cnpj", "textContent", settings.cnpj)
    updateElement("telefone", "textContent", settings.telefone)
    updateElement("footer-telefone", "textContent", settings.telefone)
    updateElement("email", "textContent", settings.email)
    updateElement("footer-email", "textContent", settings.email)
    updateElement("endereco", "textContent", settings.endereco)
    updateElement("footer-endereco", "textContent", settings.endereco)
    updateElement("sobre-texto", "textContent", settings.sobre)
    updateElement("data-atualizacao", "textContent", formatDate(settings.dataAtualizacao))

    // Atualizar título da página
    if (settings.empresa) {
      document.title = settings.empresa + " - Verificada"
    }
  } catch (error) {
    console.error("Erro ao carregar configurações:", error)
    // Em caso de erro, não fazer nada para evitar loops infinitos
  }
}

// Modificar a função setupBackgroundImages para ser mais robusta
function setupBackgroundImages() {
  const settings = JSON.parse(localStorage.getItem("siteSettings")) || {}

  // Configurar imagem de fundo do hero
  const heroSection = document.querySelector(".hero")
  if (heroSection) {
    let heroImageUrl = ""

    // Determinar qual fonte de imagem usar
    if (settings.heroBgSource === "url" && settings.heroBgImage) {
      heroImageUrl = settings.heroBgImage
    } else if (settings.heroBgSource === "upload" && settings.heroBgImageData) {
      heroImageUrl = settings.heroBgImageData
    } else if (settings.heroBgImage) {
      heroImageUrl = settings.heroBgImage
    } else if (settings.heroBgImageData) {
      heroImageUrl = settings.heroBgImageData
    }

    // Verificar se a URL é válida antes de aplicá-la
    if (heroImageUrl && (heroImageUrl.startsWith("data:image") || isValidURL(heroImageUrl))) {
      // Aplicar a imagem de fundo diretamente no elemento
      heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${heroImageUrl}')`
    } else {
      // Usar uma imagem padrão se a URL não for válida
      heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://via.placeholder.com/1920x1080')`
    }

    heroSection.style.backgroundSize = settings.heroBgFit || "cover"
    heroSection.style.backgroundPosition = settings.heroBgPosition || "center center"

    // Remover o pseudo-elemento ::before que pode estar causando conflitos
    const style = document.createElement("style")
    style.textContent = `
      .hero::before {
        display: none;
      }
    `
    document.head.appendChild(style)
  }

  // Configurar imagem de fundo do cookie overlay
  const cookieOverlay = document.getElementById("cookie-overlay")
  const cookieBackground = document.querySelector(".cookie-background")

  if (cookieBackground && cookieOverlay) {
    // Verificar se é um dispositivo móvel
    const isMobile = window.innerWidth <= 768
    let cookieImageUrl = ""

    // Determinar qual fonte de imagem usar para o dispositivo atual
    if (isMobile) {
      if (settings.cookieBgMobileSource === "url" && settings.cookieBgMobile) {
        cookieImageUrl = settings.cookieBgMobile
      } else if (settings.cookieBgMobileSource === "upload" && settings.cookieBgMobileData) {
        cookieImageUrl = settings.cookieBgMobileData
      } else if (settings.cookieBgMobile) {
        cookieImageUrl = settings.cookieBgMobile
      } else if (settings.cookieBgMobileData) {
        cookieImageUrl = settings.cookieBgMobileData
      }
    } else {
      if (settings.cookieBgDesktopSource === "url" && settings.cookieBgDesktop) {
        cookieImageUrl = settings.cookieBgDesktop
      } else if (settings.cookieBgDesktopSource === "upload" && settings.cookieBgDesktopData) {
        cookieImageUrl = settings.cookieBgDesktopData
      } else if (settings.cookieBgDesktop) {
        cookieImageUrl = settings.cookieBgDesktop
      } else if (settings.cookieBgDesktopData) {
        cookieImageUrl = settings.cookieBgDesktopData
      }
    }

    // Verificar se a URL é válida antes de aplicá-la
    if (cookieImageUrl && (cookieImageUrl.startsWith("data:image") || isValidURL(cookieImageUrl))) {
      cookieBackground.style.backgroundImage = `url('${cookieImageUrl}')`
    } else {
      // Usar uma cor de fundo padrão se a URL não for válida
      cookieBackground.style.backgroundColor = "rgba(0, 0, 0, 0.8)"
      cookieBackground.style.backgroundImage = "none"
    }

    // Garantir que outras propriedades estejam definidas
    cookieBackground.style.backgroundSize = settings.cookieBgFit || "cover"
    cookieBackground.style.backgroundPosition = settings.cookieBgPosition || "center center"

    // Aplicar o efeito de blur configurado
    const blurValue = settings.cookieBlur !== undefined ? settings.cookieBlur : 5
    cookieBackground.style.filter = `blur(${blurValue}px)`
  }
}

// Função para garantir que as imagens se ajustem corretamente
function setupImageFitting() {
  const settings = JSON.parse(localStorage.getItem("siteSettings")) || {}

  // Ajustar todas as imagens para cobrir seus contêineres
  const images = document.querySelectorAll('img:not([class*="preview"])')
  images.forEach((img) => {
    // Verificar se a imagem está dentro de um contêiner específico
    const isLogo = img.id === "logo" || img.id === "footer-logo"

    if (!isLogo) {
      // Garantir que a imagem cubra todo o espaço disponível
      img.style.width = "100%"
      img.style.height = "100%"
      img.style.objectFit = "cover"
    } else {
      // Logos devem manter suas proporções
      img.style.width = "auto"
      img.style.height = "100%"
      img.style.objectFit = "contain"
    }
  })

  // Ajustar contêineres de imagem para ocupar todo o espaço disponível
  const imageContainers = document.querySelectorAll(".image")
  imageContainers.forEach((container) => {
    container.style.overflow = "hidden"
  })
}

// Modificar a função updateElement para evitar loops infinitos
function updateElement(id, property, value) {
  const element = document.getElementById(id)
  if (!element) return

  if (property === "src") {
    // Remover qualquer handler de erro existente para evitar loops
    element.onerror = null

    if (value && (value.startsWith("data:image") || isValidURL(value))) {
      // Definir o src e adicionar um handler de erro que não causa loops
      element.src = value
      element.onerror = function () {
        // Verificar se já estamos usando um placeholder para evitar loops
        if (!this.src.includes("placeholder.com")) {
          console.warn(`Falha ao carregar imagem para ${id}. Usando placeholder.`)
          this.src = id.includes("logo") ? "https://via.placeholder.com/150x50" : "https://via.placeholder.com/400x300"
          // Remover o handler após usar para evitar loops
          this.onerror = null
        }
      }
    } else {
      // Usar placeholder diretamente se o valor não for válido
      element.src = id.includes("logo") ? "https://via.placeholder.com/150x50" : "https://via.placeholder.com/400x300"
    }
  } else if (value) {
    // Para outras propriedades, simplesmente definir o valor
    element[property] = value
  }
}

// Modificar a função isValidURL para ser mais robusta e evitar loops infinitos
function isValidURL(string) {
  if (!string) return false

  // Se for uma string base64, é válida
  if (string.startsWith("data:image")) return true

  // Se for um caminho relativo, é válido
  if (string.startsWith("/")) return true

  // Verificar se é uma URL HTTP/HTTPS válida
  try {
    const url = new URL(string)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch (_) {
    // Se não for uma URL válida, verificar se pelo menos começa com http:// ou https://
    return /^https?:\/\//i.test(string)
  }
}

// Função para formatar data
function formatDate(dateString) {
  if (!dateString) return "01/05/2023"

  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR")
}

// Função de debounce para evitar múltiplas chamadas durante o redimensionamento
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
