window.onload = start;

function start() {
  let brand = document.querySelector('.header_left');
  brand.addEventListener('click', () => {
    window.location.href = 'https://zheng-bote.github.io/cake-planner-frontends/';
  });

  toggleTheme();

  document.addEventListener('DOMContentLoaded', () => {
    const shareBtn = document.getElementById('share-btn');

    // Prüfen, ob Web Share API unterstützt wird
    if (navigator.share && shareBtn) {
      // Button sichtbar machen (inline-flex wegen CSS Klasse)
      shareBtn.style.display = 'inline-flex';

      shareBtn.addEventListener('click', async () => {
        try {
          await navigator.share({
            title: document.title,
            text:
              document.querySelector('meta[name="description"]')?.content ||
              'Check out CakePlanner!',
            url: window.location.href,
          });
        } catch (err) {
          // Fehler abfangen (z.B. wenn User Dialog abbricht)
          console.debug('Share cancelled or failed', err);
        }
      });
    }
  });
}

function toggleTheme() {
  const toggleSwitch = document.querySelector('#checkbox');
  const currentTheme = localStorage.getItem('theme');

  // 1. Check: Gibt es eine gespeicherte Einstellung?
  if (currentTheme) {
    document.documentElement.style.colorScheme = currentTheme;
    if (currentTheme === 'dark') {
      toggleSwitch.checked = true;
    }
  } else {
    // 2. Fallback: System-Einstellung prüfen
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      toggleSwitch.checked = true;
      // Wir setzen es nicht hart, damit der User noch wechseln kann,
      // aber der Switch muss visuell stimmen.
    }
  }

  toggleSwitch.addEventListener('change', switchTheme, false);
}
// 3. Event Listener für den Switch
function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.style.colorScheme = 'dark';
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.style.colorScheme = 'light';
    localStorage.setItem('theme', 'light');
  }
}
