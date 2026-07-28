/* ==========================================================================
   EstateMind 3D - AI Real Estate Copilot & Chat Engine
   ========================================================================== */

class AIAssistantEngine {
  constructor(messagesContainerId, inputId, sendBtnId) {
    this.container = document.getElementById(messagesContainerId);
    this.input = document.getElementById(inputId);
    this.sendBtn = document.getElementById(sendBtnId);

    if (!this.container || !this.input || !this.sendBtn) return;

    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  appendMessage(text, sender = 'ai', provider = '') {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;

    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedText = formattedText.replace(/\n/g, '<br>');

    bubble.innerHTML = formattedText;

    if (provider) {
      const tag = document.createElement('div');
      tag.style.fontSize = '0.7rem';
      tag.style.opacity = '0.6';
      tag.style.marginTop = '4px';
      tag.innerText = `Powered by ${provider}`;
      bubble.appendChild(tag);
    }

    this.container.appendChild(bubble);
    this.container.scrollTop = this.container.scrollHeight;
  }

  async sendMessage(customQuery = '') {
    const query = customQuery || this.input.value.trim();
    if (!query) return;

    this.appendMessage(query, 'user');
    if (!customQuery) this.input.value = '';

    // Typing indicator
    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-bubble ai';
    typingBubble.innerHTML = '<i class="fas fa-spinner fa-spin"></i> EstateMind AI is thinking...';
    this.container.appendChild(typingBubble);
    this.container.scrollTop = this.container.scrollHeight;

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, context: { city: 'Bangalore', locality: 'Indiranagar' } })
      });

      const data = await response.json();
      this.container.removeChild(typingBubble);

      if (data.success) {
        this.appendMessage(data.response, 'ai', data.provider);
      } else {
        this.appendMessage("Sorry, I encountered an issue processing your query.", 'ai');
      }
    } catch (err) {
      this.container.removeChild(typingBubble);
      this.appendMessage("Network error. Please try again.", 'ai');
    }
  }
}

window.AIAssistantEngine = AIAssistantEngine;
