/**
 * Sistema de Segurança Avançado
 * Proteção contra cópia, inspeção e download não autorizado
 */

;(() => {
  // Configurações de segurança
  const securityConfig = {
    disableRightClick: true,
    disableDevTools: true,
    disableSelection: true,
    disableDragImages: true,
    disablePrintScreen: true,
    disableSavePage: true,
    disableViewSource: true,
    enableWatermark: false, // Alterado de true para false
    monitorViolationAttempts: true,
    maxViolationAttempts: 3,
    redirectOnViolation: null, // URL para redirecionar após múltiplas violações
    watermarkText: "CONTEÚDO PROTEGIDO", // Texto do watermark
    watermarkOpacity: 0.15, // Opacidade do watermark (0-1)
    enableConsoleWarning: true,
    consoleWarningMessage:
      "⚠️ ALERTA DE SEGURANÇA: Tentativa de acesso não autorizado detectada. Este incidente foi registrado.",
  }

  // Contador de tentativas de violação
  let violationAttempts = 0

  // Registrar tentativa de violação
  function logViolationAttempt(type) {
    violationAttempts++

    if (securityConfig.enableConsoleWarning) {
      console.warn(securityConfig.consoleWarningMessage)
      console.warn(`Tipo de violação: ${type}`)
      console.warn(`Tentativa ${violationAttempts} de ${securityConfig.maxViolationAttempts}`)
    }

    // Enviar para analytics (implementação futura)
    // sendSecurityAnalytics(type);

    // Verificar se excedeu o número máximo de tentativas
    if (
      securityConfig.monitorViolationAttempts &&
      violationAttempts >= securityConfig.maxViolationAttempts &&
      securityConfig.redirectOnViolation
    ) {
      window.location.href = securityConfig.redirectOnViolation
    }
  }

  // 1. Desabilitar clique direito
  if (securityConfig.disableRightClick) {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault()
      logViolationAttempt("right-click")
      return false
    })
  }

  // 2. Desabilitar seleção de texto
  if (securityConfig.disableSelection) {
    document.addEventListener("selectstart", (e) => {
      if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault()
        logViolationAttempt("text-selection")
        return false
      }
    })

    // Adicionar CSS para desabilitar seleção
    const style = document.createElement("style")
    style.textContent = `
            body, p, h1, h2, h3, h4, h5, h6, img, div, section, article, aside, nav, header, footer {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            
            input, textarea {
                -webkit-user-select: text;
                -moz-user-select: text;
                -ms-user-select: text;
                user-select: text;
            }
        `
    document.head.appendChild(style)
  }

  // 3. Desabilitar arrastar imagens
  if (securityConfig.disableDragImages) {
    document.addEventListener("dragstart", (e) => {
      e.preventDefault()
      logViolationAttempt("image-drag")
      return false
    })

    // Adicionar atributo draggable="false" a todas as imagens
    document.querySelectorAll("img").forEach((img) => {
      img.setAttribute("draggable", "false")
      img.style.webkitUserDrag = "none"
    })
  }

  // 4. Desabilitar atalhos de teclado comuns
  document.addEventListener("keydown", (e) => {
    // Ctrl+S (Salvar)
    if (securityConfig.disableSavePage && e.ctrlKey && e.key === "s") {
      e.preventDefault()
      logViolationAttempt("save-page")
      return false
    }

    // Ctrl+U (Ver código fonte)
    if (securityConfig.disableViewSource && e.ctrlKey && e.key === "u") {
      e.preventDefault()
      logViolationAttempt("view-source")
      return false
    }

    // F12 (DevTools)
    if (securityConfig.disableDevTools && (e.key === "F12" || e.keyCode === 123)) {
      e.preventDefault()
      logViolationAttempt("devtools-f12")
      return false
    }

    // Ctrl+Shift+I (DevTools)
    if (securityConfig.disableDevTools && e.ctrlKey && e.shiftKey && (e.key === "i" || e.key === "I")) {
      e.preventDefault()
      logViolationAttempt("devtools-inspect")
      return false
    }

    // Ctrl+Shift+J (Console)
    if (securityConfig.disableDevTools && e.ctrlKey && e.shiftKey && (e.key === "j" || e.key === "J")) {
      e.preventDefault()
      logViolationAttempt("devtools-console")
      return false
    }

    // Ctrl+P (Imprimir)
    if (securityConfig.disablePrintScreen && e.ctrlKey && (e.key === "p" || e.key === "P")) {
      e.preventDefault()
      logViolationAttempt("print-page")
      return false
    }

    // Print Screen
    if (securityConfig.disablePrintScreen && e.key === "PrintScreen") {
      e.preventDefault()
      logViolationAttempt("print-screen")
      return false
    }
  })

  // 5. Detecção e bloqueio de DevTools
  if (securityConfig.disableDevTools) {
    // Método 1: Monitorar redimensionamento da janela (quando DevTools é aberto)
    let devtoolsDetectedByResize = false
    const threshold = 160

    function checkDevToolsByWindowSize() {
      if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
        if (!devtoolsDetectedByResize) {
          devtoolsDetectedByResize = true
          logViolationAttempt("devtools-resize")

          // Adicionar overlay de aviso
          showSecurityWarning("Ferramentas de desenvolvedor detectadas. Por favor, feche-as para continuar.")
        }
      } else {
        if (devtoolsDetectedByResize) {
          devtoolsDetectedByResize = false
          hideSecurityWarning()
        }
      }
    }

    window.addEventListener("resize", checkDevToolsByWindowSize)
    setInterval(checkDevToolsByWindowSize, 1000)

    // Método 2: Detecção via console.clear
    const devToolsDetector = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold = window.outerHeight - window.innerHeight > threshold

      if (widthThreshold || heightThreshold) {
        logViolationAttempt("devtools-open")
        document.body.innerHTML = "Acesso bloqueado. Ferramentas de desenvolvedor detectadas."
        return true
      }
      return false
    }

    // Método 3: Detecção via debugger removida conforme solicitado
    // setInterval(() => {
    //   debugger;
    // }, 100);

    // Método 4: Detecção via console.log timing
    ;(() => {
      const start = new Date()
      console.log("DevTools Detection")
      console.clear()
      const end = new Date()

      if (end - start > 100) {
        logViolationAttempt("devtools-console-timing")
      }
    })()
  }

  // 6. Adicionar watermark dinâmico
  if (securityConfig.enableWatermark) {
    function createWatermark() {
      const watermarkContainer = document.createElement("div")
      watermarkContainer.className = "security-watermark"
      watermarkContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 10000;
                opacity: ${securityConfig.watermarkOpacity};
                user-select: none;
                overflow: hidden;
            `

      // Criar padrão de watermark
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          const watermarkText = document.createElement("div")
          watermarkText.textContent = securityConfig.watermarkText
          watermarkText.style.cssText = `
                        position: absolute;
                        top: ${i * 20}vh;
                        left: ${j * 20}vw;
                        transform: rotate(-45deg);
                        font-size: 16px;
                        color: rgba(0, 0, 0, 0.7);
                        white-space: nowrap;
                        font-family: Arial, sans-serif;
                    `
          watermarkContainer.appendChild(watermarkText)
        }
      }

      document.body.appendChild(watermarkContainer)

      // Atualizar posição do watermark ao rolar
      document.addEventListener("scroll", () => {
        const scrollY = window.scrollY
        watermarkContainer.style.top = `${scrollY}px`
      })
    }

    // Criar watermark quando o DOM estiver pronto
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", createWatermark)
    } else {
      createWatermark()
    }
  }

  // 7. Desabilitar impressão
  if (securityConfig.disablePrintScreen) {
    window.addEventListener("beforeprint", (e) => {
      e.preventDefault()
      logViolationAttempt("print-attempt")
      alert("Impressão não permitida por motivos de segurança.")
      return false
    })
  }

  // 8. Função para mostrar aviso de segurança
  function showSecurityWarning(message) {
    // Verificar se o aviso já existe
    if (document.getElementById("security-warning-overlay")) {
      return
    }

    const warningOverlay = document.createElement("div")
    warningOverlay.id = "security-warning-overlay"
    warningOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 0, 0, 0.9);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            color: white;
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
        `

    const warningIcon = document.createElement("div")
    warningIcon.innerHTML = "⚠️"
    warningIcon.style.cssText = "font-size: 72px; margin-bottom: 20px;"

    const warningText = document.createElement("h2")
    warningText.textContent = message || "Ação não permitida por motivos de segurança"
    warningText.style.cssText = "font-size: 24px; margin-bottom: 20px;"

    const warningSubtext = document.createElement("p")
    warningSubtext.textContent = "Este incidente foi registrado."
    warningSubtext.style.cssText = "font-size: 16px; margin-bottom: 30px;"

    const closeButton = document.createElement("button")
    closeButton.textContent = "Entendi"
    closeButton.style.cssText = `
            padding: 10px 20px;
            background-color: white;
            color: red;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            font-weight: bold;
        `
    closeButton.onclick = hideSecurityWarning

    warningOverlay.appendChild(warningIcon)
    warningOverlay.appendChild(warningText)
    warningOverlay.appendChild(warningSubtext)
    warningOverlay.appendChild(closeButton)

    document.body.appendChild(warningOverlay)
    document.body.style.overflow = "hidden"
  }

  // 9. Função para esconder aviso de segurança
  function hideSecurityWarning() {
    const warningOverlay = document.getElementById("security-warning-overlay")
    if (warningOverlay) {
      warningOverlay.remove()
      document.body.style.overflow = ""
    }
  }

  // 10. Ofuscação de código
  // Esta função auto-invocada já é uma forma básica de ofuscação
  // Para ofuscação avançada, use ferramentas como JavaScript Obfuscator

  // 11. Proteção contra iframe (evitar que o site seja incorporado em outros sites)
  if (window.self !== window.top) {
    window.top.location.href = window.self.location.href
    logViolationAttempt("iframe-embedding")
  }

  // 12. Proteção contra visualização de código-fonte via URL
  if (window.location.href.indexOf("view-source:") !== -1) {
    window.location.href = window.location.href.replace("view-source:", "")
    logViolationAttempt("view-source-url")
  }

  // 13. Proteção contra cópia de texto
  document.addEventListener("copy", (e) => {
    if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault()
      logViolationAttempt("copy-text")

      // Opcional: substituir o texto copiado por uma mensagem personalizada
      e.clipboardData.setData("text/plain", "Cópia não autorizada. Conteúdo protegido.")
      return false
    }
  })

  // 14. Proteção contra corte de texto
  document.addEventListener("cut", (e) => {
    if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault()
      logViolationAttempt("cut-text")
      return false
    }
  })

  // 15. Proteção contra captura de tela (limitada)
  // Nota: Esta é uma proteção limitada, pois não é possível detectar todas as capturas de tela
  document.addEventListener("keyup", (e) => {
    // Detectar Print Screen (não funciona em todos os navegadores)
    if (e.key === "PrintScreen" || e.keyCode === 44) {
      logViolationAttempt("print-screen")
      // Opcional: mostrar aviso
      showSecurityWarning("Captura de tela detectada. Este conteúdo é protegido por direitos autorais.")
    }
  })

  // 16. Inicialização
  function init() {
    console.log("%cSistema de Segurança Ativado", "color: green; font-size: 14px; font-weight: bold;")

    // Verificar se DevTools está aberto na inicialização
    setTimeout(() => {
      checkDevToolsByWindowSize()
    }, 1000)

    // Adicionar listener para quando a página for descarregada
    window.addEventListener("beforeunload", () => {
      // Limpar dados sensíveis antes de sair
      // (implementação futura)
    })
  }

  // Inicializar sistema de segurança
  init()
})()
