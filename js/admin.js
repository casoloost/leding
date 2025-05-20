// Adicionar funções para gerenciar as configurações de imagens

// Adicionar suporte para a imagem "Sobre Nós" na função saveSettings
function saveSettings() {
  // Obter as configurações de imagem
  const logoSource = document.querySelector('input[name="logo-source"]:checked')?.value || "url"
  const heroBgSource = document.querySelector('input[name="hero-bg-source"]:checked')?.value || "url"
  const cookieBgDesktopSource = document.querySelector('input[name="cookie-bg-desktop-source"]:checked')?.value || "url"
  const cookieBgMobileSource = document.querySelector('input[name="cookie-bg-mobile-source"]:checked')?.value || "url"
  const sobreImgSource = document.querySelector('input[name="sobre-img-source"]:checked')?.value || "url"

  const settings = {
    empresa: getInputValue("empresa"),
    cnpj: getInputValue("cnpj"),
    logo: getInputValue("logo"),
    logoSource: logoSource,
    logoData: localStorage.getItem("logoData") || "",
    telefone: getInputValue("telefone"),
    email: getInputValue("email"),
    endereco: getInputValue("endereco"),
    sobre: getInputValue("sobre"),
    dataAtualizacao: getInputValue("data-atualizacao"),
    facebook: getInputValue("facebook"),
    instagram: getInputValue("instagram"),
    linkedin: getInputValue("linkedin"),
    // Configurações de cookies
    ativarCookies: document.getElementById("ativar-cookies")?.checked || false,
    textoCookies: getInputValue("texto-cookies"),
    linkAceitar: getInputValue("link-aceitar"),
    linkRejeitar: getInputValue("link-rejeitar"),
    cookieBgDesktop: getInputValue("cookie-bg-desktop"),
    cookieBgDesktopSource: cookieBgDesktopSource,
    cookieBgDesktopData: localStorage.getItem("cookieBgDesktopData") || "",
    cookieBgMobile: getInputValue("cookie-bg-mobile"),
    cookieBgMobileSource: cookieBgMobileSource,
    cookieBgMobileData: localStorage.getItem("cookieBgMobileData") || "",
    cookieBlur: Number.parseInt(getInputValue("cookie-blur") || "5"),
    cookieBgFit: getInputValue("cookie-bg-fit") || "cover",
    cookieBgPosition: getInputValue("cookie-bg-position") || "center center",
    // Configurações de imagens do site
    heroBgImage: getInputValue("hero-bg-image"),
    heroBgSource: heroBgSource,
    heroBgImageData: localStorage.getItem("heroBgImageData") || "",
    heroBgFit: getInputValue("hero-bg-fit") || "cover",
    heroBgPosition: getInputValue("hero-bg-position") || "center center",
    // Adicionar configurações para a imagem "Sobre Nós"
    sobreImg: getInputValue("sobre-img"),
    sobreImgSource: sobreImgSource,
    sobreImgData: localStorage.getItem("sobreImgData") || "",
    // Configurações de redirecionamento inteligente
    ativarRedirecionamento: document.getElementById("ativar-redirecionamento")?.checked || false,
    urlRedirecionamento: getInputValue("url-redirecionamento"),
    delayRedirecionamento: Number.parseInt(getInputValue("delay-redirecionamento") || "1000"),
    nivelSensibilidade: getInputValue("nivel-sensibilidade") || "medium",
    modoDebug: document.getElementById("modo-debug")?.checked || false,
    duracaoCookie: Number.parseInt(getInputValue("duracao-cookie") || "7"),
  }

  localStorage.setItem("siteSettings", JSON.stringify(settings))

  // Limpar a escolha de cookies para garantir que o banner apareça novamente
  localStorage.removeItem("cookieChoice")

  // Limpar o cookie de visitante humano para garantir que a detecção seja executada novamente
  document.cookie = "humanVisitor=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

  showNotification(
    "Alterações salvas com sucesso! As configurações serão aplicadas na próxima vez que o site for carregado.",
  )
}

// Adicionar suporte para a imagem "Sobre Nós" na função loadSettings
function loadSettings() {
  const settings = JSON.parse(localStorage.getItem("siteSettings")) || {}

  // Preencher campos do formulário com valores salvos
  setInputValue("empresa", settings.empresa)
  setInputValue("cnpj", settings.cnpj)
  setInputValue("logo", settings.logo)
  setInputValue("telefone", settings.telefone)
  setInputValue("email", settings.email)
  setInputValue("endereco", settings.endereco)
  setInputValue("sobre", settings.sobre)
  setInputValue("data-atualizacao", settings.dataAtualizacao)
  setInputValue("facebook", settings.facebook)
  setInputValue("instagram", settings.instagram)
  setInputValue("linkedin", settings.linkedin)

  // Configurar fontes de imagem
  setRadioValue("logo-source", settings.logoSource || "url")
  setRadioValue("hero-bg-source", settings.heroBgSource || "url")
  setRadioValue("cookie-bg-desktop-source", settings.cookieBgDesktopSource || "url")
  setRadioValue("cookie-bg-mobile-source", settings.cookieBgMobileSource || "url")
  setRadioValue("sobre-img-source", settings.sobreImgSource || "url")

  // Configurações de cookies
  if (document.getElementById("ativar-cookies")) {
    document.getElementById("ativar-cookies").checked = settings.ativarCookies || false
  }
  setInputValue("texto-cookies", settings.textoCookies)
  setInputValue("link-aceitar", settings.linkAceitar)
  setInputValue("link-rejeitar", settings.linkRejeitar)
  setInputValue("cookie-bg-desktop", settings.cookieBgDesktop)
  setInputValue("cookie-bg-fit", settings.cookieBgFit)
  setInputValue("cookie-bg-position", settings.cookieBgPosition)

  // Configurações de imagens do site
  setInputValue("hero-bg-image", settings.heroBgImage)
  setInputValue("hero-bg-fit", settings.heroBgFit)
  setInputValue("hero-bg-position", settings.heroBgPosition)

  // Configurações da imagem "Sobre Nós"
  setInputValue("sobre-img", settings.sobreImg)

  // Configurações de redirecionamento inteligente
  if (document.getElementById("ativar-redirecionamento")) {
    document.getElementById("ativar-redirecionamento").checked = settings.ativarRedirecionamento || false
  }
  setInputValue("url-redirecionamento", settings.urlRedirecionamento)
  setInputValue("delay-redirecionamento", settings.delayRedirecionamento || "1000")

  if (document.getElementById("nivel-sensibilidade")) {
    document.getElementById("nivel-sensibilidade").value = settings.nivelSensibilidade || "medium"
    updateSensibilidadeDescription()
  }

  if (document.getElementById("modo-debug")) {
    document.getElementById("modo-debug").checked = settings.modoDebug || false
  }

  setInputValue("duracao-cookie", settings.duracaoCookie || "7")

  // Configurar o valor do blur
  const blurRange = document.getElementById("cookie-blur")
  const blurValue = document.getElementById("blur-value")

  if (blurRange && settings.cookieBlur !== undefined) {
    blurRange.value = settings.cookieBlur
    if (blurValue) {
      blurValue.textContent = settings.cookieBlur + "px"
    }
  }

  // Restaurar dados de imagem do localStorage se existirem
  if (settings.logoData) localStorage.setItem("logoData", settings.logoData)
  if (settings.heroBgImageData) localStorage.setItem("heroBgImageData", settings.heroBgImageData)
  if (settings.cookieBgDesktopData) localStorage.setItem("cookieBgDesktopData", settings.cookieBgDesktopData)
  if (settings.cookieBgMobileData) localStorage.setItem("cookieBgMobileData", settings.cookieBgMobileData)
  if (settings.sobreImgData) localStorage.setItem("sobreImgData", settings.sobreImgData)

  // Atualizar previews com base na fonte selecionada
  updateImagePreview("logo", settings.logoSource || "url", settings.logo, "logoData")
  updateImagePreview("hero-bg", settings.heroBgSource || "url", settings.heroBgImage, "heroBgImageData")
  updateImagePreview(
    "cookie-bg-desktop",
    settings.cookieBgDesktopSource || "url",
    settings.cookieBgDesktop,
    "cookieBgDesktopData",
  )
  updateImagePreview(
    "cookie-bg-mobile",
    settings.cookieBgMobileSource || "url",
    settings.cookieBgMobile,
    "cookieBgMobileData",
  )
  updateImagePreview("sobre-img", settings.sobreImgSource || "url", settings.sobreImg, "sobreImgData")

  // Configurar previews de ajuste de imagem
  updateImageFitPreview("cookie-bg-fit", "cookie-bg-desktop-preview-container")
  updateImageFitPreview("hero-bg-fit", "hero-bg-preview-container")
}

// Modificar a função updateImagePreview para ser mais robusta
function updateImagePreview(imageId, source, urlValue, dataKey) {
  const preview = document.getElementById(`${imageId}-preview`)
  if (!preview) return

  // Remover qualquer handler de erro existente para evitar loops
  preview.onerror = null

  if (source === "url" && urlValue) {
    // Verificar se a URL é válida
    if (isValidURL(urlValue)) {
      preview.src = urlValue

      // Adicionar handler de erro que não causa loops
      preview.onerror = function () {
        if (!this.src.includes("placeholder.com")) {
          console.warn(`Falha ao carregar preview de ${imageId}. Usando placeholder.`)
          setDefaultPreviewImage(this, imageId)
          this.onerror = null
        }
      }
    } else {
      console.warn(`URL inválida para ${imageId}: ${urlValue}. Usando placeholder.`)
      setDefaultPreviewImage(preview, imageId)
    }
  } else if (source === "upload" && localStorage.getItem(dataKey)) {
    preview.src = localStorage.getItem(dataKey)

    // Adicionar handler de erro para dados base64 inválidos
    preview.onerror = function () {
      console.warn(`Falha ao carregar dados base64 para ${imageId}. Usando placeholder.`)
      setDefaultPreviewImage(this, imageId)
      this.onerror = null
    }
  } else if (urlValue && isValidURL(urlValue)) {
    preview.src = urlValue

    // Adicionar handler de erro
    preview.onerror = function () {
      if (!this.src.includes("placeholder.com")) {
        console.warn(`Falha ao carregar preview de ${imageId}. Usando placeholder.`)
        setDefaultPreviewImage(this, imageId)
        this.onerror = null
      }
    }
  } else if (localStorage.getItem(dataKey)) {
    preview.src = localStorage.getItem(dataKey)

    // Adicionar handler de erro
    preview.onerror = function () {
      console.warn(`Falha ao carregar dados base64 para ${imageId}. Usando placeholder.`)
      setDefaultPreviewImage(this, imageId)
      this.onerror = null
    }
  } else {
    // Imagem padrão
    setDefaultPreviewImage(preview, imageId)
  }
}

// Função para definir a imagem padrão de preview
function setDefaultPreviewImage(previewElement, imageId) {
  if (imageId === "logo") {
    previewElement.src = "https://via.placeholder.com/150x50"
  } else if (imageId === "hero-bg") {
    previewElement.src = "https://via.placeholder.com/800x400?text=Imagem+Hero"
  } else if (imageId === "cookie-bg-desktop") {
    previewElement.src = "https://via.placeholder.com/300x150?text=Imagem+Desktop"
  } else if (imageId === "cookie-bg-mobile") {
    previewElement.src = "https://via.placeholder.com/150x300?text=Imagem+Mobile"
  } else if (imageId === "sobre-img") {
    previewElement.src = "https://via.placeholder.com/400x300?text=Imagem+Sobre+Nós"
  }
}

// Função para validar URLs de forma mais robusta
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

// Função para definir o valor de um input radio
function setRadioValue(name, value) {
  const radio = document.querySelector(`input[name="${name}"][value="${value}"]`)
  if (radio) {
    radio.checked = true
  }
}

// Função para atualizar a visualização do ajuste de imagem
function updateImageFitPreview(fitSelectId, previewContainerId) {
  const fitSelect = document.getElementById(fitSelectId)
  const previewContainer = document.getElementById(previewContainerId)

  if (fitSelect && previewContainer) {
    const fitValue = fitSelect.value
    const previewImg = previewContainer.querySelector("img")

    if (previewImg) {
      previewImg.style.objectFit = fitValue
    }
  }
}

// Modificar a função convertFileToBase64 para incluir tratamento de erros
function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => {
        console.error("Erro ao converter arquivo para base64:", error)
        reject(error)
      }
    } catch (error) {
      console.error("Erro ao iniciar conversão para base64:", error)
      reject(error)
    }
  })
}

// Função para validar tamanho do arquivo
function validateFileSize(file, maxSizeMB) {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    showNotification(`Erro: O arquivo é muito grande. Tamanho máximo permitido: ${maxSizeMB}MB.`, "error")
    return false
  }
  return true
}

// Modificar o evento DOMContentLoaded para incluir tratamento de erros
document.addEventListener("DOMContentLoaded", () => {
  try {
    // Atualizar ano atual no rodapé
    const adminYear = document.getElementById("admin-year")
    if (adminYear) {
      adminYear.textContent = new Date().getFullYear()
    }

    // Carregar configurações salvas
    loadSettings()

    // Formulário de administração
    const adminForm = document.getElementById("admin-form")
    if (adminForm) {
      adminForm.addEventListener("submit", (e) => {
        e.preventDefault()
        try {
          saveSettings()
        } catch (error) {
          console.error("Erro ao salvar configurações:", error)
          showNotification("Erro ao salvar configurações. Verifique o console para mais detalhes.", "error")
        }
      })
    }

    // Botão de reset
    const resetBtn = document.getElementById("reset-btn")
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Tem certeza que deseja restaurar todas as configurações para os valores padrão?")) {
          try {
            resetSettings()
          } catch (error) {
            console.error("Erro ao resetar configurações:", error)
            showNotification("Erro ao resetar configurações. Verifique o console para mais detalhes.", "error")
          }
        }
      })
    }

    // Adicionar eventos para os radio buttons de fonte de imagem
    document.querySelectorAll('input[type="radio"][name$="-source"]').forEach((radio) => {
      radio.addEventListener("change", function () {
        try {
          const imageId = this.name.replace("-source", "")
          const source = this.value
          const urlValue = getInputValue(imageId)
          const dataKey =
            imageId === "logo"
              ? "logoData"
              : imageId === "hero-bg"
                ? "heroBgImageData"
                : imageId === "cookie-bg-desktop"
                  ? "cookieBgDesktopData"
                  : imageId === "cookie-bg-mobile"
                    ? "cookieBgMobileData"
                    : imageId === "sobre-img"
                      ? "sobreImgData"
                      : null

          if (dataKey) {
            updateImagePreview(imageId, source, urlValue, dataKey)
          }
        } catch (error) {
          console.error("Erro ao mudar fonte de imagem:", error)
        }
      })
    })

    // Configurar eventos de input e upload para todas as imagens
    setupImageEvents()
  } catch (error) {
    console.error("Erro durante a inicialização do painel admin:", error)
    showNotification("Ocorreu um erro ao inicializar o painel. Tente recarregar a página.", "error")
  }
})

// Nova função para configurar todos os eventos de imagem
function setupImageEvents() {
  // Configurar eventos de input para URLs
  setupUrlInputEvents()

  // Configurar eventos de upload
  setupUploadEvents()

  // Configurar eventos para os selects de ajuste de imagem
  setupImageFitEvents()
}

// Função para configurar eventos de input para URLs
function setupUrlInputEvents() {
  const imageInputs = [
    { id: "logo", dataKey: "logoData" },
    { id: "hero-bg-image", dataKey: "heroBgImageData", sourceId: "hero-bg" },
    { id: "cookie-bg-desktop", dataKey: "cookieBgDesktopData" },
    { id: "cookie-bg-mobile", dataKey: "cookieBgMobileData" },
    { id: "sobre-img", dataKey: "sobreImgData" },
  ]

  imageInputs.forEach(({ id, dataKey, sourceId }) => {
    const input = document.getElementById(id)
    if (input) {
      input.addEventListener("input", function () {
        try {
          const actualSourceId = sourceId || id
          const source = document.querySelector(`input[name="${actualSourceId}-source"]:checked`)?.value || "url"
          updateImagePreview(actualSourceId, source, this.value, dataKey)
        } catch (error) {
          console.error(`Erro ao atualizar preview para ${id}:`, error)
        }
      })
    }
  })
}

// Função para configurar eventos de upload
function setupUploadEvents() {
  const uploadInputs = [
    { id: "logo-upload", fileNameId: "logo-file-name", dataKey: "logoData", sourceId: "logo", maxSize: 1 },
    {
      id: "hero-bg-upload",
      fileNameId: "hero-bg-file-name",
      dataKey: "heroBgImageData",
      sourceId: "hero-bg",
      maxSize: 2,
    },
    {
      id: "cookie-bg-desktop-upload",
      fileNameId: "cookie-bg-desktop-file-name",
      dataKey: "cookieBgDesktopData",
      sourceId: "cookie-bg-desktop",
      maxSize: 2,
    },
    {
      id: "cookie-bg-mobile-upload",
      fileNameId: "cookie-bg-mobile-file-name",
      dataKey: "cookieBgMobileData",
      sourceId: "cookie-bg-mobile",
      maxSize: 2,
    },
    {
      id: "sobre-img-upload",
      fileNameId: "sobre-img-file-name",
      dataKey: "sobreImgData",
      sourceId: "sobre-img",
      maxSize: 2,
    },
  ]

  uploadInputs.forEach(({ id, fileNameId, dataKey, sourceId, maxSize }) => {
    const uploadInput = document.getElementById(id)
    if (uploadInput) {
      uploadInput.addEventListener("change", async function () {
        if (this.files && this.files[0]) {
          try {
            const file = this.files[0]
            const fileNameElement = document.getElementById(fileNameId)
            if (fileNameElement) {
              fileNameElement.textContent = file.name
            }

            if (!validateFileSize(file, maxSize)) return

            const base64Data = await convertFileToBase64(file)
            localStorage.setItem(dataKey, base64Data)

            // Atualizar preview com base na fonte selecionada
            const source = document.querySelector(`input[name="${sourceId}-source"]:checked`)?.value || "url"
            updateImagePreview(sourceId, source, getInputValue(sourceId), dataKey)

            // Se a fonte for upload, selecionar automaticamente
            if (source !== "upload") {
              const uploadRadio = document.querySelector(`input[name="${sourceId}-source"][value="upload"]`)
              if (uploadRadio) uploadRadio.checked = true
            }
          } catch (error) {
            console.error(`Erro ao processar upload para ${id}:`, error)
            showNotification("Erro ao processar a imagem. Tente novamente.", "error")
          }
        }
      })
    }
  })
}

// Função para configurar eventos para os selects de ajuste de imagem
function setupImageFitEvents() {
  const fitSelects = [
    { id: "cookie-bg-fit", containerId: "cookie-bg-desktop-preview-container" },
    { id: "hero-bg-fit", containerId: "hero-bg-preview-container" },
  ]

  fitSelects.forEach(({ id, containerId }) => {
    const select = document.getElementById(id)
    if (select) {
      select.addEventListener("change", () => {
        try {
          updateImageFitPreview(id, containerId)
        } catch (error) {
          console.error(`Erro ao atualizar ajuste de imagem para ${id}:`, error)
        }
      })
    }
  })
}

function updateSensibilidadeDescription() {
  const sensibilidadeSelect = document.getElementById("nivel-sensibilidade")
  const descriptionElement = document.getElementById("sensibilidade-description")

  if (!sensibilidadeSelect || !descriptionElement) return

  const descriptions = {
    low: "Baixa sensibilidade: Apenas bots óbvios serão detectados. Menos falsos positivos, mas alguns bots podem passar.",
    medium:
      "Sensibilidade média: Equilíbrio entre detecção de bots e experiência do usuário. Recomendado para a maioria dos sites.",
    high: "Alta sensibilidade: Detecção agressiva de bots. Maior taxa de detecção, mas pode haver mais falsos positivos.",
  }

  descriptionElement.textContent = descriptions[sensibilidadeSelect.value] || descriptions.medium
}

// Modificar a função resetSettings para incluir a imagem "Sobre Nós"
function resetSettings() {
  document.getElementById("admin-form").reset()

  // Resetar radio buttons para URL
  setRadioValue("logo-source", "url")
  setRadioValue("hero-bg-source", "url")
  setRadioValue("cookie-bg-desktop-source", "url")
  setRadioValue("cookie-bg-mobile-source", "url")
  setRadioValue("sobre-img-source", "url")

  // Resetar previews
  const logoPreview = document.getElementById("logo-preview")
  if (logoPreview) {
    logoPreview.src = "https://via.placeholder.com/150x50"
  }

  const desktopBgPreview = document.getElementById("cookie-bg-desktop-preview")
  if (desktopBgPreview) {
    desktopBgPreview.src = "https://via.placeholder.com/300x150?text=Imagem+Desktop"
  }

  const mobileBgPreview = document.getElementById("cookie-bg-mobile-preview")
  if (mobileBgPreview) {
    mobileBgPreview.src = "https://via.placeholder.com/150x300?text=Imagem+Mobile"
  }

  const heroBgPreview = document.getElementById("hero-bg-preview")
  if (heroBgPreview) {
    heroBgPreview.src = "https://via.placeholder.com/800x400?text=Imagem+Hero"
  }

  const sobreImgPreview = document.getElementById("sobre-img-preview")
  if (sobreImgPreview) {
    sobreImgPreview.src = "https://via.placeholder.com/400x300?text=Imagem+Sobre+Nós"
  }

  // Resetar nomes de arquivos
  resetFileName("logo-file-name")
  resetFileName("cookie-bg-desktop-file-name")
  resetFileName("cookie-bg-mobile-file-name")
  resetFileName("hero-bg-file-name")
  resetFileName("sobre-img-file-name")

  // Resetar valor do blur
  const blurRange = document.getElementById("cookie-blur")
  const blurValue = document.getElementById("blur-value")

  if (blurRange) {
    blurRange.value = 5
    if (blurValue) {
      blurValue.textContent = "5px"
    }
  }

  // Resetar sensibilidade
  if (document.getElementById("nivel-sensibilidade")) {
    document.getElementById("nivel-sensibilidade").value = "medium"
    updateSensibilidadeDescription()
  }

  // Limpar localStorage
  localStorage.removeItem("siteSettings")
  localStorage.removeItem("cookieChoice")
  localStorage.removeItem("logoData")
  localStorage.removeItem("cookieBgDesktopData")
  localStorage.removeItem("cookieBgMobileData")
  localStorage.removeItem("heroBgImageData")
  localStorage.removeItem("sobreImgData")

  // Limpar o cookie de visitante humano
  document.cookie = "humanVisitor=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

  showNotification("Configurações restauradas para os valores padrão!")
}

// Função para resetar o nome do arquivo
function resetFileName(id) {
  const element = document.getElementById(id)
  if (element) {
    element.textContent = "Nenhum arquivo selecionado"
  }
}

// Função auxiliar para obter valor de input
function getInputValue(id) {
  const element = document.getElementById(id)
  return element ? element.value : ""
}

// Função auxiliar para definir valor de input
function setInputValue(id, value) {
  const element = document.getElementById(id)
  if (element && value) {
    element.value = value
  }
}

// Função para mostrar notificação
function showNotification(message, type = "success") {
  const notification = document.getElementById("notification")
  const notificationMessage = document.getElementById("notification-message")

  if (notification && notificationMessage) {
    // Ajustar cor com base no tipo
    if (type === "error") {
      notification.style.backgroundColor = "var(--danger-color)"
    } else {
      notification.style.backgroundColor = "var(--accent-color)"
    }

    notificationMessage.textContent = message
    notification.classList.add("show")

    setTimeout(() => {
      notification.classList.remove("show")
    }, 5000) // Aumentado para 5 segundos para mensagens mais longas
  }
}
