-- Present SpillArena as a growing platform, without individual game names or game counts.
insert into public.projects (
  id, title, languages, description, details, local_path, url, live_url, images, videos, tags, translations
) values (
  11,
  'SpillArena',
  array['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Cloudflare Pages', 'Cloudflare D1']::text[],
  'SpillArena is a platform for browser-based games, with shared player profiles, saved progress, leaderboards and multiplayer experiences.',
  'SpillArena brings web-based games together in a responsive platform. Players can explore categories, search for games and play directly in the browser, either as guests or with a shared account.

Shared player profiles, saved progress, XP, levels and leaderboards connect the gaming experience. The platform includes account recovery and an authenticated administration interface for players, moderation, contact messages and game traffic.

Built with React and TypeScript, with Cloudflare Pages Functions and D1 for backend services and data storage. The interface supports Norwegian and English, light and dark themes, and mobile and desktop layouts.',
  'spillarena',
  'https://github.com/SpillArena/SpillArena',
  'https://spillarena.no/',
  array['spillarena-preview_yif14p']::text[],
  array[]::text[],
  array['web-based-games', 'gaming-platform', 'multiplayer', 'player-profiles', 'progress-tracking', 'leaderboards', 'authentication', 'Cloudflare', 'D1', 'responsive-design', 'i18n']::text[],
  '{
  "no": {
    "description": "SpillArena er en plattform for nettleserbaserte spill, med felles spillerprofiler, lagret fremgang, topplister og flerspilleropplevelser.",
    "details": "SpillArena samler webbaserte spill i en responsiv plattform. Spillere kan utforske kategorier, søke etter spill og spille direkte i nettleseren, enten som gjester eller med en felles konto.\n\nFelles spillerprofiler, lagret fremgang, XP, nivåer og topplister knytter spillopplevelsene sammen. Plattformen har kontogjenoppretting og et innloggingsbeskyttet administrasjonspanel for spillere, moderering, kontakthenvendelser og spilltrafikk.\n\nBygget med React og TypeScript, med Cloudflare Pages Functions og D1 for backend og datalagring. Grensesnittet støtter norsk og engelsk, lyst og mørkt tema, og tilpasser seg mobil og datamaskin."
  },
  "de": {
    "description": "SpillArena ist eine Plattform für Browserspiele mit gemeinsamen Spielerprofilen, gespeichertem Fortschritt, Bestenlisten und Mehrspieler-Erlebnissen.",
    "details": "SpillArena bündelt webbasierte Spiele auf einer responsiven Plattform. Spieler können Kategorien entdecken, nach Spielen suchen und direkt im Browser spielen, als Gäste oder mit einem gemeinsamen Konto.\n\nGemeinsame Spielerprofile, gespeicherter Fortschritt, Erfahrungspunkte, Level und Bestenlisten verbinden die Spielerlebnisse. Die Plattform bietet Kontowiederherstellung und einen geschützten Verwaltungsbereich für Spieler, Moderation, Kontaktanfragen und Spielzugriffe.\n\nEntwickelt mit React und TypeScript sowie Cloudflare Pages Functions und D1 für Backend und Datenspeicherung. Die Oberfläche unterstützt Norwegisch und Englisch, helle und dunkle Designs sowie Mobilgeräte und Computer."
  },
  "fr": {
    "description": "SpillArena est une plateforme de jeux sur navigateur avec profils partagés, progression sauvegardée, classements et expériences multijoueurs.",
    "details": "SpillArena rassemble des jeux web sur une plateforme responsive. Les joueurs peuvent explorer les catégories, rechercher des jeux et jouer directement dans leur navigateur, comme invités ou avec un compte commun.\n\nLes profils partagés, la progression sauvegardée, les points d’expérience, les niveaux et les classements relient les expériences de jeu. La plateforme comprend la récupération de compte et un espace d’administration protégé pour les joueurs, la modération, les messages et la fréquentation des jeux.\n\nDéveloppée avec React et TypeScript, avec Cloudflare Pages Functions et D1 pour le backend et le stockage. L’interface prend en charge le norvégien et l’anglais, les thèmes clair et sombre, les mobiles et les ordinateurs."
  },
  "es": {
    "description": "SpillArena es una plataforma de juegos para navegador con perfiles compartidos, progreso guardado, clasificaciones y experiencias multijugador.",
    "details": "SpillArena reúne juegos web en una plataforma adaptable. Los jugadores pueden explorar categorías, buscar juegos y jugar directamente en el navegador, como invitados o con una cuenta común.\n\nLos perfiles compartidos, el progreso guardado, los puntos de experiencia, los niveles y las clasificaciones conectan las experiencias de juego. La plataforma incluye recuperación de cuentas y un panel de administración protegido para jugadores, moderación, mensajes y tráfico de los juegos.\n\nDesarrollada con React y TypeScript, con Cloudflare Pages Functions y D1 para el backend y el almacenamiento. La interfaz admite noruego e inglés, temas claro y oscuro, móviles y ordenadores."
  }
}'::jsonb
)
on conflict (id) do update set
  title = excluded.title,
  languages = excluded.languages,
  description = excluded.description,
  details = excluded.details,
  local_path = excluded.local_path,
  url = excluded.url,
  live_url = excluded.live_url,
  images = excluded.images,
  videos = excluded.videos,
  tags = excluded.tags,
  translations = excluded.translations
where projects.local_path = 'spillarena';
