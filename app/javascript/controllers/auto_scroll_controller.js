import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="auto-scroll"
export default class extends Controller {
  connect() {
    console.log("auto-scroll connected")
    this.messages = this.element.querySelector("#messages")
    if (!this.messages) {
      console.warn("auto-scroll: #messages not found")
      return
    }

    // Initial scroll to bottom
    this.scrollToBottom({ behavior: "auto" })

    // Observe DOM changes inside #messages (covers ActionCable insertions)
    this.observer = new MutationObserver((mutations) => {
      // Only react when child nodes are added
      const added = mutations.some(m => m.addedNodes && m.addedNodes.length)
      if (added) this.scrollToBottom({ behavior: "smooth" })
    })
    this.observer.observe(this.messages, { childList: true, subtree: false })

    // Also listen to Turbo stream event if Turbo is used
    window.addEventListener("turbo:before-stream-render", this._turboHandler = () => {
      // scroll after the DOM has rendered new content
      requestAnimationFrame(() => this.scrollToBottom({ behavior: "smooth" }))
    })
  }

  disconnect() {
    if (this.observer) this.observer.disconnect()
    if (this._turboHandler) window.removeEventListener("turbo:before-stream-render", this._turboHandler)
  }

  scrollToBottom(opts = { behavior: "auto" }) {
    // guard
    if (!this.messages) return
    try {
      this.messages.scrollTo({
        top: this.messages.scrollHeight,
        behavior: opts.behavior
      })
    } catch (e) {
      // fallback
      this.messages.scrollTop = this.messages.scrollHeight
    }
  }
}
