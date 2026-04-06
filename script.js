document.addEventListener('DOMContentLoaded', () => {
    // 1. Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // 2. Active Section Highlight for Sidebar
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // trigger when 50% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // 3. Command Palette Logic
    const paletteBackdrop = document.getElementById('cmd-palette-backdrop');
    const cmdInput = document.getElementById('cmd-input');
    const cmdResults = document.getElementById('cmd-results');
    
    const commands = [
        { title: 'Go to Home', href: '#home', icon: '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M8.156 1.835a.25.25 0 0 0-.312 0l-5.25 4.2a.75.75 0 0 0-.256.59v6.625c0 .414.336.75.75.75h3.003a.75.75 0 0 0 .75-.75v-2.003a.25.25 0 0 1 .25-.25h2.464a.25.25 0 0 1 .25.25v2.003c0 .414.336.75.75.75h3.003a.75.75 0 0 0 .75-.75V6.625a.75.75 0 0 0-.256-.59l-5.25-4.2Z"></path></svg>' },
        { title: 'Go to About', href: '#about', icon: '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm6.5-.25A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path></svg>' },
        { title: 'Go to Projects', href: '#projects', icon: '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1v9.763c-.056.004-.112.008-.168.008a2.5 2.5 0 0 0-1.082.247V1.5H4.5a1 1 0 0 0-1 1v9.066A1.002 1.002 0 0 0 4.5 12h8.25Z"></path></svg>' },
        { title: 'Go to Skills', href: '#skills', icon: '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M11.28 6.78a.75.75 0 0 0-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l3.5-3.5Z"></path><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0Z"></path></svg>' },
        { title: 'Go to Contact', href: '#contact', icon: '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25v-8.5C0 2.784.784 2 1.75 2ZM1.5 12.251c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V5.809L8.38 9.397a.75.75 0 0 1-.76 0L1.5 5.809v6.442Zm13-8.181v-.32a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v.32L8 7.88Z"></path></svg>' },
        { title: 'Email Me', href: 'mailto:hello@example.com', icon: '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25v-8.5C0 2.784.784 2 1.75 2ZM1.5 12.251c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V5.809L8.38 9.397a.75.75 0 0 1-.76 0L1.5 5.809v6.442Zm13-8.181v-.32a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v.32L8 7.88Z"></path></svg>' },
    ];

    let selectedIndex = 0;
    let filteredCommands = [...commands];

    function openPalette() {
        paletteBackdrop.classList.remove('hidden');
        cmdInput.value = '';
        filterOptions('');
        cmdInput.focus();
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closePalette() {
        paletteBackdrop.classList.add('hidden');
        document.body.style.overflow = '';
    }

    function renderOptions() {
        cmdResults.innerHTML = '';
        if (filteredCommands.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No commands found';
            li.style.cursor = 'default';
            cmdResults.appendChild(li);
            return;
        }

        filteredCommands.forEach((cmd, index) => {
            const li = document.createElement('li');
            li.innerHTML = `${cmd.icon} <span>${cmd.title}</span>`;
            if (index === selectedIndex) {
                li.classList.add('active');
            }
            li.addEventListener('click', () => {
                executeCommand(cmd);
            });
            li.addEventListener('mouseenter', () => {
                selectedIndex = index;
                renderOptions();
            });
            cmdResults.appendChild(li);
        });
        
        // Ensure selected item is in view
        const activeItem = cmdResults.querySelector('.active');
        if (activeItem) {
            activeItem.scrollIntoView({ block: 'nearest' });
        }
    }

    function filterOptions(query) {
        const q = query.toLowerCase();
        filteredCommands = commands.filter(cmd => cmd.title.toLowerCase().includes(q));
        selectedIndex = 0;
        renderOptions();
    }

    function executeCommand(cmd) {
        if (cmd.href.startsWith('#')) {
            document.querySelector(cmd.href).scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.href = cmd.href;
        }
        closePalette();
    }

    // Event Listeners for Command Palette
    document.addEventListener('keydown', (e) => {
        // Toggle with Cmd+K or Ctrl+K
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            if (paletteBackdrop.classList.contains('hidden')) {
                openPalette();
            } else {
                closePalette();
            }
        }
        
        // Close with Escape
        if (e.key === 'Escape' && !paletteBackdrop.classList.contains('hidden')) {
            closePalette();
        }
    });

    paletteBackdrop.addEventListener('click', (e) => {
        if (e.target === paletteBackdrop) {
            closePalette();
        }
    });

    cmdInput.addEventListener('input', (e) => {
        filterOptions(e.target.value);
    });

    cmdInput.addEventListener('keydown', (e) => {
        if (filteredCommands.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % filteredCommands.length;
            renderOptions();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
            renderOptions();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            executeCommand(filteredCommands[selectedIndex]);
        }
    });
});
