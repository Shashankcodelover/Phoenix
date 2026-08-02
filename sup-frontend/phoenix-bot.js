/**
 * Phoenix Copilot Bot — Universal Client Engine v1.0
 * 
 * Provides a floating, context-aware AI assistant widget on every page.
 * Supports natural language chat, voice recognition, quick action chips,
 * and page control actions.
 */

const PhoenixBot = (() => {
  let isDrawerOpen = false;
  let isListening = false;
  let recognition = null;

  function createCopilotDOM() {
    if (document.getElementById('phoenix-copilot-fab')) return;

    // 1. Floating Action Button (FAB)
    const fab = document.createElement('button');
    fab.id = 'phoenix-copilot-fab';
    fab.className = 'copilot-fab';
    fab.setAttribute('aria-label', 'Open Phoenix AI Copilot');
    fab.innerHTML = `
      <span class="copilot-fab-icon">🤖</span>
      <span class="copilot-fab-pulse"></span>
      <span class="copilot-fab-badge">AI</span>
    `;
    document.body.appendChild(fab);

    // 2. Copilot Drawer
    const drawer = document.createElement('div');
    drawer.id = 'phoenix-copilot-drawer';
    drawer.className = 'copilot-drawer';
    drawer.innerHTML = `
      <div class="copilot-header">
        <div class="copilot-header-title">
          <span class="copilot-avatar">🤖</span>
          <div>
            <h3>Phoenix Copilot</h3>
            <span class="copilot-status" id="copilotContextLabel">Ready • Context Loaded</span>
          </div>
        </div>
        <button class="copilot-close-btn" id="copilotCloseBtn">×</button>
      </div>

      <!-- Quick Action Chips -->
      <div class="copilot-chips">
        <button class="copilot-chip" data-cmd="Take me to my Syllabus Roadmap">⚡ Roadmap</button>
        <button class="copilot-chip" data-cmd="Start a Mock Technical Interview">💬 Mock Interview</button>
        <button class="copilot-chip" data-cmd="Find me AI Hackathons">🏆 Hackathons</button>
        <button class="copilot-chip" data-cmd="Show my current XP and Rank">📊 My XP</button>
        <button class="copilot-chip" data-cmd="Toggle design theme">☀️ Toggle Theme</button>
      </div>

      <!-- Chat Messages Container -->
      <div class="copilot-messages" id="copilotMessages">
        <div class="copilot-msg bot">
          <span class="avatar">🤖</span>
          <div class="content">
            Hello! I am your <strong>Phoenix Copilot</strong>. How can I help boost your career velocity today? Type a prompt or click a quick action chip!
          </div>
        </div>
      </div>

      <!-- Input Bar -->
      <form class="copilot-input-area" id="copilotForm">
        <button type="button" class="copilot-voice-btn" id="copilotVoiceBtn" title="Voice Input">🎤</button>
        <input type="text" id="copilotInput" placeholder="Ask Phoenix anything or give a command..." autocomplete="off">
        <button type="submit" class="copilot-send-btn">Send 🚀</button>
      </form>
    `;
    document.body.appendChild(drawer);

    // Event Listeners
    fab.addEventListener('click', toggleDrawer);
    document.getElementById('copilotCloseBtn').addEventListener('click', toggleDrawer);

    document.getElementById('copilotForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('copilotInput');
      const text = input.value.trim();
      if (text) {
        sendMessage(text);
        input.value = '';
      }
    });

    // Chips event listeners
    drawer.querySelectorAll('.copilot-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        sendMessage(cmd);
      });
    });

    // Voice recognition setup
    setupVoice();
  }

  function toggleDrawer() {
    isDrawerOpen = !isDrawerOpen;
    const drawer = document.getElementById('phoenix-copilot-drawer');
    const fab = document.getElementById('phoenix-copilot-fab');
    if (!drawer) return;

    if (isDrawerOpen) {
      drawer.classList.add('active');
      fab.classList.add('active');
      document.getElementById('copilotInput').focus();
    } else {
      drawer.classList.remove('active');
      fab.classList.remove('active');
    }
  }

  function setupVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    const voiceBtn = document.getElementById('copilotVoiceBtn');

    voiceBtn.addEventListener('click', () => {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    });

    recognition.onstart = () => {
      isListening = true;
      voiceBtn.classList.add('listening');
      voiceBtn.textContent = '🎙️';
      Phoenix.Toast.info('Listening... Speak now!');
    };

    recognition.onend = () => {
      isListening = false;
      voiceBtn.classList.remove('listening');
      voiceBtn.textContent = '🎤';
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      document.getElementById('copilotInput').value = transcript;
      sendMessage(transcript);
    };
  }

  function appendMessage(sender, text) {
    const container = document.getElementById('copilotMessages');
    if (!container) return;

    const div = document.createElement('div');
    div.className = `copilot-msg ${sender}`;
    const avatar = sender === 'user' ? '👤' : '🤖';

    div.innerHTML = `
      <span class="avatar">${avatar}</span>
      <div class="content">${formatMarkdown(text)}</div>
    `;

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function formatMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  async function sendMessage(query) {
    appendMessage('user', query);

    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'copilot-msg bot typing';
    typingDiv.id = 'copilotTyping';
    typingDiv.innerHTML = `<span class="avatar">🤖</span><div class="content"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
    document.getElementById('copilotMessages').appendChild(typingDiv);
    document.getElementById('copilotMessages').scrollTop = document.getElementById('copilotMessages').scrollHeight;

    const currentPath = window.location.pathname;
    const userProfile = Phoenix.Auth.getUser();

    try {
      const res = await Phoenix.API.post('/bot/assistant', {
        query,
        currentPath,
        userProfile
      });

      typingDiv.remove();

      if (res.ok && res.data) {
        appendMessage('bot', res.data.text || 'Command processed.');
        if (res.data.action) {
          executeAction(res.data.action);
        }
      } else {
        appendMessage('bot', "I'm experiencing high latency right now. Let me know if you need direct page navigation!");
      }
    } catch (err) {
      typingDiv.remove();
      appendMessage('bot', "Offline fallback active. Please ensure server backend is running!");
    }
  }

  function executeAction(action) {
    if (!action || action.type === 'NONE') return;

    if (action.type === 'NAVIGATE' && action.payload) {
      Phoenix.Toast.info(`Navigating to ${action.payload}...`);
      setTimeout(() => {
        window.location.href = action.payload;
      }, 1000);
    } else if (action.type === 'TOGGLE_THEME') {
      Phoenix.Theme.cycle();
      Phoenix.Toast.success(`Theme switched to ${Phoenix.Theme.current}`);
    } else if (action.type === 'SHOW_STATS') {
      const u = Phoenix.Auth.getUser();
      Phoenix.Toast.info(`User: ${u.name || 'Dev'} | XP: ${u.xp || 0} | Level: ${u.level || 1}`);
    }
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createCopilotDOM);
    } else {
      createCopilotDOM();
    }
  }

  return {
    init,
    toggleDrawer,
    sendMessage
  };
})();

// Auto-expose
window.PhoenixBot = PhoenixBot;
