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
          { type: 'standard', text: "summary - Career overview" },
          { type: 'standard', text: "experience - Recent roles" },
          { type: 'standard', text: "skills - Technical focus areas" },
          { type: 'standard', text: "achievements - Highlights worth celebrating" },
          { type: 'standard', text: "contact - Reach Aliakbar" },
          { type: 'standard', text: "clear - Purge command history" }
        ];
      }
    },
    summary: {
      description: 'Display summary',
      action: () => [
        { type: 'system', text: 'CAREER SUMMARY:' },
        {
          type: 'standard',
          text: 'Lead Software & Automation Engineer delivering reliable scientific and industrial instrumentation through clean design, embedded expertise, and collaborative workflows.'
        }
      ]
    },
    experience: {
      description: 'Display key experience',
      action: () => [
        { type: 'system', text: 'RECENT ROLES:' },
        {
          type: 'standard',
          text: 'Alemnis AG (2024–Present) — Leading software conception, automation, and CI/CD for advanced instruments.'
        },
        {
          type: 'standard',
          text: 'Forimtech SA (2022–2023) — Built medical firmware, PCB prototypes, and documentation in regulated settings.'
        },
        {
          type: 'standard',
          text: 'GLI Italy B.V. (2017–2021) — Delivered hardware/software testing, code analysis, and QA automation.'
        }
      ]
    },
    skills: {
      description: 'Display technical skills',
      action: () => [
        { type: 'system', text: 'TECHNICAL FOCUS:' },
        { type: 'standard', text: 'Programming — C#, C/C++, LabVIEW, MATLAB, Bash.' },
        { type: 'standard', text: 'Hardware — Microcontrollers, FPGA (Altera), PCB design with Altium/KiCAD/EasyEDA.' },
        { type: 'standard', text: 'Tools & Systems — Git/GitHub, JIRA, Podio, ClickUp, RTOS (QNX), Windows, Linux.' },
        { type: 'standard', text: 'Specialties — Sensors, serial protocols, motors, HMI design.' }
      ]
    },
    achievements: {
      description: 'Display achievements',
      action: () => [
        { type: 'system', text: 'NOTABLE ACHIEVEMENTS:' },
        { type: 'standard', text: 'Automated test evidence workflows, cutting documentation time by 85%.' },
        { type: 'standard', text: 'Redesigned medical firmware with open-source tools, saving CHF 5 000 annually.' },
        { type: 'standard', text: 'Prototyped cost-efficient hardware reducing production cost by 90%.' }
      ]
    },
    contact: {
      description: 'Display contact info',
      action: () => [
        { type: 'system', text: 'CONTACT CHANNELS:' },
        { type: 'standard', text: 'Email: aliakbar.rezapour@outlook.com' },
        { type: 'standard', text: 'Phone: +41 78 213 9524' },
        { type: 'standard', text: 'LinkedIn: linkedin.com/in/arezapour' }
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
