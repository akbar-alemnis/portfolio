(function () {
  const consoleOutput = document.querySelector('.console__output');
  const consoleForm = document.querySelector('.console__form');
  const input = document.getElementById('console-input');
  const yearEl = document.getElementById('year');

  if (!consoleOutput || !consoleForm || !input) {
    return;
  }

  const commands = {
    help: {
      description: 'Display available commands',
      action: () => {
        return [
          { type: 'system', text: 'AVAILABLE COMMANDS:' },
          { type: 'standard', text: "help - Display available commands" },
          { type: 'standard', text: "about - Learn more about the pilot" },
          { type: 'standard', text: "projects - Showcase of deployed missions" },
          { type: 'standard', text: "contact - Transmission protocols" },
          { type: 'standard', text: "clear - Purge command history" }
        ];
      }
    },
    about: {
      description: 'Display biography',
      action: () => [
        { type: 'system', text: 'BIO:' },
        { type: 'standard', text: 'Full-stack developer with a love for synthwave palettes, .NET tooling, and immersive UI.' }
      ]
    },
    projects: {
      description: 'Display project list',
      action: () => [
        { type: 'system', text: 'ACTIVE MISSIONS:' },
        { type: 'standard', text: '1. Synthwave Dashboard — Real-time telemetry interface.' },
        { type: 'standard', text: '2. Temporal Explorer — Blazor WebAssembly narrative.' },
        { type: 'standard', text: '3. Neon Narrative Engine — C# interactive fiction system.' }
      ]
    },
    contact: {
      description: 'Display contact info',
      action: () => [
        { type: 'system', text: 'CONTACT CHANNELS:' },
        { type: 'standard', text: 'Email: you@example.com' },
        { type: 'standard', text: 'LinkedIn: linkedin.com/in/yourprofile' }
      ]
    },
    clear: {
      description: 'Clear console output',
      action: () => {
        consoleOutput.innerHTML = '';
        return [];
      }
    }
  };

  const renderLine = (content, className = 'standard') => {
    const line = document.createElement('div');
    line.className = `console__line console__line--${className}`;
    line.innerHTML = `<span>${content}</span>`;
    consoleOutput.appendChild(line);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  };

  const renderResponse = (response) => {
    response.forEach(({ type, text }) => renderLine(text, type));
  };

  const greet = () => {
    renderLine('INITIALIZING RETRO OS...', 'system');
    renderLine('Type "help" to view available commands.');
  };

  consoleForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const command = (input.value || '').trim().toLowerCase();
    if (!command) {
      return;
    }

    renderLine(`> ${command}`, 'input');

    const handler = commands[command];
    if (handler) {
      const response = handler.action();
      if (response.length) {
        renderResponse(response);
      }
    } else {
      renderLine('Command not recognized. Type "help" for assistance.', 'warning');
    }

    input.value = '';
    input.focus();
  });

  greet();

  window.setTimeout(() => input.focus(), 100);

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }
})();
