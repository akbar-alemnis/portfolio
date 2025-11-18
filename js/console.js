(function () {
  const consoleOutput = document.querySelector('.console__output');
  const consoleForm = document.querySelector('.console__form');
  const input = document.getElementById('console-input');
  const yearEl = document.getElementById('year');

  if (!consoleOutput || !consoleForm || !input) {
    return;
  }

  const startTime = Date.now();
  const audioPlayer = new Audio();
  const musicFolder = 'music/';
  const musicTracks = [
    // Add your mp3 filenames here, e.g. 'track1.mp3', 'track2.mp3'
    'futuristic-synthwave-track-227035.mp3', 'retro-lounge-389644.mp3', 'retro-vibes-402459.mp3', 'tense-neo-noir-437990.mp3'
  ];

  const motdMessages = [
    'Reboot your brain once a day.',
    'Coffee first, then code.',
    'Today is a good day to ship.',
    'You are root of your destiny.',
    'Trust the process, test the code.'
  ];

  const fortuneCookies = [
    'In code we trust.',
    'Try turning it off and on again.',
    'Undefined is just undiscovered potential.',
    'Errors are opportunities wearing stack traces.',
    'May your commits be clean and your logs verbose.'
  ];

  const exitMessages = [
    'Nice try, but there’s no escape from recursion.',
    'Abort? Retry? Ignore? Never.',
    'System says: you’re already home.',
    'You can log out, but the loop continues.',
    'Escape key disabled for your own safety.'
  ];

  const asciiArt = String.raw`
     /\\\\\\\\\\\\\\\     /\\\\\\\\\     /\\\\\\\\\  
    /\\\/////////\\\ /\\\///////\\\ /\\\///////\\\
    \/\\\       \/\\\ \/\\\     \/\\\ \/\\\     \/\\\
     \/\\\\\\\\\\\\\\  \/\\\\\\\\\\\\\\\\  \/\\\\\\\\\\\\\\\\
      \/\\\/////////\\\ \/\\\/////////\\\ \/\\\/////////\\\
       \/\\\       \/\\\ \/\\\       \/\\\ \/\\\       \/\\\
        \//\\\\\\\\\\\\/  \//\\\\\\\\\\\\/  \//\\\\\\\\\\\\/ 
          \////////////     \////////////     \////////////  
            ALIAKBAR REZAPOUR // MATRIX MODE
  `.trim().split('\n');

  let matrixCanvas;
  let matrixContext;
  let matrixInterval;
  let matrixDrops = [];
  let matrixResizeHandler;

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
          { type: 'standard', text: "clear - Purge command history" },
          { type: 'standard', text: "exit - Friendly reminder you can’t quit recursion" },
          { type: 'standard', text: "uptime - Show how long you’ve been here" },
          { type: 'standard', text: "motd - Message of the day" },
          { type: 'standard', text: "fortune - Random quote" },
          { type: 'standard', text: "ascii art - Render the Matrix-flavored logo" },
          { type: 'standard', text: "matrix - Toggle falling green characters" },
          { type: 'standard', text: "play - Play a random track from /music" },
          { type: 'standard', text: "stop - Stop the current track" }
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
    exit: {
      description: 'Send a playful exit message',
      action: () => [{ type: 'warning', text: exitMessages[Math.floor(Math.random() * exitMessages.length)] }]
    },
    uptime: {
      description: 'Show how long the visitor has been on the site',
      action: () => {
        const diff = Date.now() - startTime;
        const totalSeconds = Math.floor(diff / 1000);
        const minutes = Math.floor(totalSeconds / 60)
          .toString()
          .padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return [{ type: 'system', text: `System stable for ${minutes}m ${seconds}s` }];
      }
    },
    motd: {
      description: 'Message of the day',
      action: () => [{ type: 'standard', text: motdMessages[Math.floor(Math.random() * motdMessages.length)] }]
    },
    fortune: {
      description: 'Random quotes',
      action: () => [{ type: 'standard', text: fortuneCookies[Math.floor(Math.random() * fortuneCookies.length)] }]
    },
    'ascii art': {
      description: 'Display animated ASCII logo',
      action: () => asciiArt.map((line) => ({ type: 'art', text: line }))
    },
    matrix: {
      description: 'Toggle Matrix rain',
      action: () => {
        if (matrixInterval) {
          stopMatrix();
          return [{ type: 'system', text: 'Matrix stream disengaged.' }];
        }
        startMatrix();
        return [{ type: 'system', text: 'Matrix stream engaged. Press "matrix" again to stop.' }];
      }
    },
    play: {
      description: 'Play a random track from /music',
      action: () => {
        if (!musicTracks.length) {
          return [
            {
              type: 'warning',
              text: 'No tracks found. Add mp3 files to /music and update musicTracks in console.js.'
            }
          ];
        }
        const choice = musicTracks[Math.floor(Math.random() * musicTracks.length)];
        audioPlayer.src = `${musicFolder}${choice}`;
        audioPlayer.loop = false;
        audioPlayer.play().catch(() => {});
        return [{ type: 'system', text: `Now playing: ${choice}` }];
      }
    },
    stop: {
      description: 'Stop the song',
      action: () => {
        if (!audioPlayer.src || audioPlayer.paused) {
          return [{ type: 'warning', text: 'No track is currently playing.' }];
        }
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        return [{ type: 'system', text: 'Playback stopped.' }];
      }
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
    if (className === 'art') {
      const pre = document.createElement('pre');
      pre.textContent = content;
      line.appendChild(pre);
    } else {
      const span = document.createElement('span');
      span.textContent = content;
      line.appendChild(span);
    }
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

  const startMatrix = () => {
    matrixCanvas = document.createElement('canvas');
    matrixCanvas.className = 'matrix-canvas';
    matrixContext = matrixCanvas.getContext('2d');
    document.body.appendChild(matrixCanvas);

    matrixResizeHandler = () => {
      matrixCanvas.width = window.innerWidth;
      matrixCanvas.height = window.innerHeight;
      const columns = Math.floor(matrixCanvas.width / 14);
      matrixDrops = new Array(columns).fill(1);
    };

    window.addEventListener('resize', matrixResizeHandler);
    matrixResizeHandler();

    const characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメエレゲゼデベペオォコソトノホモヨョロヲゴゾドボポ0123456789';

    matrixInterval = window.setInterval(() => {
      matrixContext.fillStyle = 'rgba(0, 0, 0, 0.08)';
      matrixContext.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      matrixContext.fillStyle = '#2aff2a';
      matrixContext.font = '16px "Share Tech Mono", monospace';

      matrixDrops.forEach((y, index) => {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        const x = index * 14;
        matrixContext.fillText(text, x, y * 16);
        if (y * 16 > matrixCanvas.height && Math.random() > 0.975) {
          matrixDrops[index] = 0;
        }
        matrixDrops[index] += 0.75;
      });
    }, 75);

    matrixCanvas.dataset.matrixResize = 'true';
  };

  const stopMatrix = () => {
    if (!matrixCanvas) {
      return;
    }
    window.clearInterval(matrixInterval);
    matrixInterval = null;
    if (matrixResizeHandler) {
      window.removeEventListener('resize', matrixResizeHandler);
    }
    matrixCanvas.remove();
    matrixCanvas = null;
    matrixContext = null;
    matrixResizeHandler = null;
    matrixDrops = [];
  };

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }
})();
