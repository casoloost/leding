/**
 * Sistema avançado de detecção de visitantes
 * Diferencia entre visitantes humanos e bots de forma não invasiva
 */

class VisitorDetector {
  constructor(options = {}) {
    this.options = {
      redirectDelay: options.redirectDelay || 1000,
      debugMode: options.debugMode || false,
      redirectUrl: options.redirectUrl || null,
      excludedPaths: options.excludedPaths || [],
      cookieDuration: options.cookieDuration || 7, // dias
      sensitivityLevel: options.sensitivityLevel || "medium", // low, medium, high
      ...options,
    }

    this.botSignatures = [
      { name: "Googlebot", pattern: /googlebot|adsbot-google|mediapartners-google/i },
      { name: "Bingbot", pattern: /bingbot|msnbot/i },
      { name: "Yandex", pattern: /yandex|YandexBot/i },
      { name: "Baidu", pattern: /Baiduspider/i },
      { name: "DuckDuckGo", pattern: /DuckDuckBot/i },
      { name: "Yahoo", pattern: /Yahoo! Slurp/i },
      { name: "Facebook", pattern: /facebookexternalhit/i },
      { name: "Twitter", pattern: /Twitterbot/i },
      { name: "LinkedIn", pattern: /LinkedInBot/i },
      {
        name: "Generic Crawler",
        pattern:
          /crawler|spider|bot|crawl|APIs-Google|AdsBot|Googlebot|mediapartners|Google Favicon|Feedfetcher|Google-Read-Aloud|DuplexWeb-Google|Google Web Preview|Storebot-Google/i,
      },
    ]

    this.botDetectionMethods = [
      this.checkUserAgent.bind(this),
      this.checkWebDriver.bind(this),
      this.checkPluginsAndMimeTypes.bind(this),
      this.checkTouchPoints.bind(this),
      this.checkConnectionRtt.bind(this),
      this.checkScreenDetails.bind(this),
      this.checkMouseMovement.bind(this),
      this.checkDevTools.bind(this),
    ]

    this.isBot = false
    this.botConfidence = 0
    this.detectionComplete = false
    this.mouseMovementDetected = false
    this.redirectAttempted = false

    // Inicializar
    this.init()
  }

  init() {
    // Verificar se estamos em uma página excluída
    if (this.isExcludedPath()) {
      this.log("Página atual está na lista de exclusão, detecção desativada")
      return
    }

    // Verificar se já temos um cookie de visitante humano
    if (this.getHumanCookie()) {
      this.log("Cookie de visitante humano encontrado")
      this.isBot = false
      this.detectionComplete = true
      this.processRedirect()
      return
    }

    // Executar detecções síncronas imediatamente
    this.runSyncDetections()

    // Configurar detecções baseadas em eventos
    this.setupEventBasedDetections()

    // Definir um tempo limite para concluir a detecção
    setTimeout(() => {
      if (!this.detectionComplete) {
        this.finalizeDetection()
      }
    }, 1500)
  }

  isExcludedPath() {
    const currentPath = window.location.pathname
    return this.options.excludedPaths.some(
      (path) => currentPath === path || (path.endsWith("*") && currentPath.startsWith(path.slice(0, -1))),
    )
  }

  runSyncDetections() {
    // Executar métodos de detecção síncronos
    let botPoints = 0
    let totalChecks = 0

    this.botDetectionMethods.forEach((method) => {
      try {
        const result = method()
        if (result !== null) {
          botPoints += result
          totalChecks++
        }
      } catch (e) {
        this.log("Erro ao executar método de detecção:", e)
      }
    })

    // Calcular pontuação inicial
    if (totalChecks > 0) {
      this.botConfidence = botPoints / totalChecks
      this.log(`Confiança inicial de bot: ${this.botConfidence.toFixed(2)}`)
    }

    // Se a confiança for muito alta, finalizar imediatamente
    if (this.botConfidence > 0.8) {
      this.finalizeDetection()
    }
  }

  setupEventBasedDetections() {
    // Detectar movimento do mouse
    document.addEventListener("mousemove", this.handleMouseMovement.bind(this), { once: true })

    // Detectar rolagem
    document.addEventListener("scroll", this.handleScroll.bind(this), { once: true })

    // Detectar cliques
    document.addEventListener("click", this.handleInteraction.bind(this), { once: true })

    // Detectar toques em dispositivos móveis
    document.addEventListener("touchstart", this.handleInteraction.bind(this), { once: true })
  }

  handleMouseMovement(e) {
    this.mouseMovementDetected = true
    this.botConfidence -= 0.3 // Movimento do mouse é um forte indicador de humano
    this.log("Movimento do mouse detectado, confiança ajustada:", this.botConfidence)

    // Se o movimento do mouse for natural (não linear)
    if (this.isNaturalMouseMovement(e)) {
      this.botConfidence -= 0.2
      this.log("Movimento natural do mouse detectado")
    }

    this.checkDetectionCompletion()
  }

  isNaturalMouseMovement(e) {
    // Implementação simplificada - em um sistema real, seria mais complexo
    return true
  }

  handleScroll() {
    this.botConfidence -= 0.2
    this.log("Rolagem detectada, confiança ajustada:", this.botConfidence)
    this.checkDetectionCompletion()
  }

  handleInteraction() {
    this.botConfidence -= 0.4 // Interação é um forte indicador de humano
    this.log("Interação detectada, confiança ajustada:", this.botConfidence)
    this.setHumanCookie() // Definir cookie imediatamente após interação
    this.finalizeDetection()
  }

  checkDetectionCompletion() {
    // Se a confiança for baixa o suficiente, finalizar a detecção
    if (this.botConfidence < 0.2) {
      this.finalizeDetection()
    }
  }

  finalizeDetection() {
    if (this.detectionComplete) return

    this.isBot = this.botConfidence > 0.5
    this.detectionComplete = true

    this.log(`Detecção finalizada. Resultado: ${this.isBot ? "Bot" : "Humano"}`)

    if (!this.isBot) {
      this.setHumanCookie()
      this.processRedirect()
    }
  }

  processRedirect() {
    if (this.redirectAttempted || this.isBot || !this.options.redirectUrl) return

    this.redirectAttempted = true
    this.log(`Redirecionando para: ${this.options.redirectUrl}`)

    setTimeout(() => {
      window.location.href = this.options.redirectUrl
    }, this.options.redirectDelay)
  }

  // Métodos de detecção

  checkUserAgent() {
    const ua = navigator.userAgent

    // Verificar assinaturas de bots conhecidos
    for (const bot of this.botSignatures) {
      if (bot.pattern.test(ua)) {
        this.log(`Bot detectado via User-Agent: ${bot.name}`)
        return 1.0 // Alta confiança
      }
    }

    // Verificar inconsistências no user agent
    const uaInconsistencies = this.checkUserAgentInconsistencies(ua)
    if (uaInconsistencies > 0) {
      return 0.7 * uaInconsistencies
    }

    return 0
  }

  checkUserAgentInconsistencies(ua) {
    let inconsistencies = 0

    // Verificar inconsistências comuns em user agents falsos
    if (/Chrome/.test(ua) && !/Safari/.test(ua)) inconsistencies += 0.5
    if (/Safari/.test(ua) && !/Version/.test(ua)) inconsistencies += 0.5
    if (/Firefox/.test(ua) && /Chrome/.test(ua)) inconsistencies += 0.5

    return inconsistencies
  }

  checkWebDriver() {
    // Verificar se o webdriver está ativado (comum em bots)
    if (navigator.webdriver) {
      this.log("WebDriver detectado")
      return 0.9
    }
    return 0
  }

  checkPluginsAndMimeTypes() {
    // Bots geralmente têm zero plugins ou um número inconsistente
    if (navigator.plugins.length === 0) {
      return 0.7
    }

    if (navigator.mimeTypes.length === 0) {
      return 0.5
    }

    return 0
  }

  checkTouchPoints() {
    // Verificar se o dispositivo relata pontos de toque de forma consistente
    if ("maxTouchPoints" in navigator) {
      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)

      // Inconsistência: dispositivo móvel sem pontos de toque
      if (isMobile && navigator.maxTouchPoints === 0) {
        return 0.6
      }

      // Inconsistência: desktop com muitos pontos de toque
      if (!isMobile && navigator.maxTouchPoints > 2 && !this.isWindowsWithTouch()) {
        return 0.4
      }
    }

    return 0
  }

  isWindowsWithTouch() {
    return /Windows NT/.test(navigator.userAgent) && /Touch/.test(navigator.userAgent)
  }

  checkConnectionRtt() {
    // Verificar informações de conexão (bots geralmente não têm isso)
    if (navigator.connection && "rtt" in navigator.connection) {
      if (navigator.connection.rtt === 0) {
        return 0.5
      }
    }

    return null // Não conclusivo
  }

  checkScreenDetails() {
    // Verificar inconsistências na resolução da tela
    if (window.screen) {
      // Tela com dimensões incomuns ou zero
      if (window.screen.width === 0 || window.screen.height === 0) {
        return 0.8
      }

      // Verificar proporções de tela muito estranhas
      const ratio = window.screen.width / window.screen.height
      if (ratio > 5 || ratio < 0.2) {
        return 0.6
      }
    }

    return 0
  }

  checkMouseMovement() {
    // Este método apenas configura a verificação
    // A detecção real acontece no manipulador de eventos
    return null
  }

  checkDevTools() {
    // Verificar se as ferramentas de desenvolvedor estão abertas
    // Bots sofisticados às vezes usam DevTools
    const devtoolsOpen = window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160

    if (devtoolsOpen) {
      return 0.3 // Indicador fraco
    }

    return 0
  }

  // Gerenciamento de cookies

  setHumanCookie() {
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + this.options.cookieDuration)

    document.cookie = `humanVisitor=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`
    this.log("Cookie de visitante humano definido")
  }

  getHumanCookie() {
    const match = document.cookie.match(/humanVisitor=true/)
    return match !== null
  }

  // Utilitários

  log(...args) {
    if (this.options.debugMode) {
      console.log("[Detector de Visitantes]", ...args)
    }
  }
}

// Não inicializar automaticamente - será inicializado pelo script principal
