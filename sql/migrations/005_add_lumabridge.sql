-- LumaBridge: copy and screenshot based on ../../LumaBridge/README.md and docs/images/app-lighting.png.
-- Screenshot uploaded unchanged as portfolio/projects/lumabridge/preview.
alter table public.projects add column if not exists live_url text;

insert into public.projects (
  id, title, languages, description, details, local_path, url, live_url, images, videos, tags, translations
) values (
  10,
  'LumaBridge',
  array['C++', 'Dear ImGui', 'Direct3D 11', 'CMake', 'Windows']::text[],
  'LumaBridge is a native Windows app that combines game-driven RGB lighting, live hardware monitoring and a 3D view of your PC and desk.',
  'LumaBridge brings game lighting to RGB hardware across brands through official game data feeds and compatible lighting SDKs. Auto mode follows supported games, while Manual mode provides custom colors, gradients and animated effects.

The native Windows interface combines live CPU, GPU, memory, power and cooling readings with an interactive 3D view of the PC and desk, including connected devices, moving fans and airflow. Integrations include ASUS Aura, Logitech LIGHTSYNC, Razer Chroma, OpenRGB and Windows LampArray. ROG Azoth OLED controls include animation previews, wired GIF uploads and a Counter-Strike 2 bomb countdown.

Built in C++ with Dear ImGui, Direct3D 11 and CMake. The portable core also has tests that run on Linux.',
  'lumabridge',
  'https://github.com/EmilB04/LumaBridge',
  null,
  array['portfolio/projects/lumabridge/preview']::text[],
  array[]::text[],
  array['C++', 'Windows', 'RGB', 'game-lighting', 'hardware-monitoring', '3D', 'Dear ImGui', 'Direct3D 11', 'ASUS Aura', 'Logitech LIGHTSYNC', 'HID', 'open-source']::text[],
  '{
  "no": {
    "description": "LumaBridge er en Windows-app som samler spillstyrt RGB-belysning, maskinvareovervåking og en interaktiv 3D-visning av PC-en og skrivebordet.",
    "details": "LumaBridge kobler spill til RGB-maskinvare på tvers av produsenter gjennom offisielle spilldata og kompatible belysnings-SDK-er. Auto-modus følger støttede spill, mens manuell modus gir egne farger, gradienter og animerte effekter.\n\nWindows-grensesnittet kombinerer sanntidsmålinger av CPU, GPU, minne, strøm og kjøling med en interaktiv 3D-visning av PC-en og skrivebordet, med tilkoblede enheter, roterende vifter og luftstrøm. Integrasjonene omfatter ASUS Aura, Logitech LIGHTSYNC, Razer Chroma, OpenRGB og Windows LampArray. ROG Azoth OLED-kontrollene inkluderer animasjonsforhåndsvisninger, GIF-opplasting over USB og bombenedtelling i Counter-Strike 2.\n\nBygget i C++ med Dear ImGui, Direct3D 11 og CMake. Den portable kjernen har også tester som kjører på Linux."
  },
  "de": {
    "description": "LumaBridge ist eine Windows-App für spielgesteuerte RGB-Beleuchtung, Live-Hardwareüberwachung und eine interaktive 3D-Ansicht von PC und Schreibtisch.",
    "details": "LumaBridge verbindet Spiele über offizielle Spieldaten und kompatible Beleuchtungs-SDKs mit RGB-Hardware verschiedener Hersteller. Der Auto-Modus folgt unterstützten Spielen; im manuellen Modus stehen eigene Farben, Farbverläufe und animierte Effekte zur Verfügung.\n\nDie native Windows-Oberfläche kombiniert Live-Werte zu CPU, GPU, Arbeitsspeicher, Stromverbrauch und Kühlung mit einer interaktiven 3D-Ansicht von PC und Schreibtisch samt Geräten, drehenden Lüftern und Luftstrom. Zu den Integrationen gehören ASUS Aura, Logitech LIGHTSYNC, Razer Chroma, OpenRGB und Windows LampArray. Die OLED-Steuerung für die ROG Azoth bietet Animationsvorschauen, GIF-Uploads über USB und einen Bomben-Countdown für Counter-Strike 2.\n\nEntwickelt in C++ mit Dear ImGui, Direct3D 11 und CMake. Tests für den portablen Kern laufen auch unter Linux."
  },
  "fr": {
    "description": "LumaBridge est une application Windows qui réunit éclairage RGB piloté par les jeux, suivi matériel en direct et vue 3D interactive du PC et du bureau.",
    "details": "LumaBridge relie les jeux au matériel RGB de différentes marques grâce aux données officielles des jeux et à des SDK d’éclairage compatibles. Le mode Auto suit les jeux pris en charge ; le mode manuel permet de choisir ses couleurs, dégradés et effets animés.\n\nL’interface Windows native associe les mesures en direct du processeur, du GPU, de la mémoire, de la consommation et du refroidissement à une vue 3D interactive du PC et du bureau, avec les périphériques, les ventilateurs en mouvement et le flux d’air. Les intégrations comprennent ASUS Aura, Logitech LIGHTSYNC, Razer Chroma, OpenRGB et Windows LampArray. Les commandes OLED du ROG Azoth proposent des aperçus d’animations, l’envoi de GIF par USB et un compte à rebours de bombe pour Counter-Strike 2.\n\nDéveloppé en C++ avec Dear ImGui, Direct3D 11 et CMake. Les tests du cœur portable fonctionnent également sous Linux."
  },
  "es": {
    "description": "LumaBridge es una aplicación Windows que combina iluminación RGB controlada por juegos, monitorización de hardware y una vista 3D del PC y el escritorio.",
    "details": "LumaBridge conecta juegos con hardware RGB de distintas marcas mediante datos oficiales de los juegos y SDK de iluminación compatibles. El modo Auto sigue los juegos compatibles; el modo manual permite elegir colores, degradados y efectos animados.\n\nLa interfaz nativa de Windows combina mediciones en directo de CPU, GPU, memoria, consumo y refrigeración con una vista 3D interactiva del PC y el escritorio, incluidos los periféricos, los ventiladores en movimiento y el flujo de aire. Las integraciones incluyen ASUS Aura, Logitech LIGHTSYNC, Razer Chroma, OpenRGB y Windows LampArray. Los controles OLED del ROG Azoth ofrecen vistas previas de animaciones, carga de GIF por USB y una cuenta atrás de bomba para Counter-Strike 2.\n\nDesarrollado en C++ con Dear ImGui, Direct3D 11 y CMake. Las pruebas del núcleo portable también se ejecutan en Linux."
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
where projects.local_path = 'lumabridge';
