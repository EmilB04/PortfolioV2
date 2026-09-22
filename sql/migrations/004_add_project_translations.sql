-- Per-language project text. The base `description` / `details` columns stay
-- English; `translations` holds the other languages keyed by i18n code:
--   { "no": { "description": "…", "details": "…" }, "de": { … }, … }
-- Missing languages or fields fall back to the English columns in the client.
alter table projects
add column if not exists translations jsonb not null default '{}'::jsonb;

update projects set translations = jsonb_build_object(
  'no', jsonb_build_object(
    'description', $$PageProbe er et .NET 8-basert webcrawler-bibliotek med åpen kildekode for C#, som gjør det mulig å automatisk hente og overvåke innhold fra statisk genererte nettsider.$$,
    'details', $$PageProbe er et enkelt og utvidbart .NET 8-bibliotek for webcrawling og innholdsuthenting. Det støtter HTML-parsing og håndtering av robots.txt, og kan hente ut data som tekst, metadata, bilder, lenker og multimedia. Resultatene kan eksporteres til CSV, JSON, XML eller Markdown. Biblioteket er laget for å være testbart og enkelt å utvide, noe som gjør det egnet for automatisering, datautvinning og innholdsovervåking på nettsider uten API-er.$$
  ),
  'de', jsonb_build_object(
    'description', $$PageProbe ist eine quelloffene Webcrawler-Bibliothek für C# auf Basis von .NET 8, mit der sich Inhalte statisch generierter Websites automatisiert abrufen und überwachen lassen.$$,
    'details', $$PageProbe ist eine einfache und erweiterbare .NET 8-Bibliothek für Webcrawling und Inhaltsextraktion. Sie unterstützt HTML-Parsing und die Auswertung von robots.txt und kann Daten wie Text, Metadaten, Bilder, Links und Multimedia extrahieren. Die Ergebnisse lassen sich als CSV, JSON, XML oder Markdown exportieren. Die Bibliothek ist testbar und leicht erweiterbar aufgebaut und eignet sich damit für Automatisierung, Data Mining und Inhaltsüberwachung auf Websites ohne API.$$
  ),
  'fr', jsonb_build_object(
    'description', $$PageProbe est une bibliothèque open source de crawling web pour C#, basée sur .NET 8, qui permet de récupérer et de surveiller automatiquement le contenu de sites web générés statiquement.$$,
    'details', $$PageProbe est une bibliothèque .NET 8 simple et extensible pour le crawling web et l'extraction de contenu. Elle prend en charge l'analyse HTML et le fichier robots.txt, et peut extraire des données telles que du texte, des métadonnées, des images, des liens et du multimédia. Les résultats peuvent être exportés en CSV, JSON, XML ou Markdown. Conçue pour être testable et facile à étendre, elle convient à l'automatisation, à l'exploration de données et à la surveillance de contenu sur des sites sans API.$$
  ),
  'es', jsonb_build_object(
    'description', $$PageProbe es una biblioteca de rastreo web de código abierto para C#, basada en .NET 8, que permite obtener y monitorizar automáticamente el contenido de sitios web generados estáticamente.$$,
    'details', $$PageProbe es una biblioteca .NET 8 sencilla y extensible para rastreo web y extracción de contenido. Admite el análisis de HTML y el manejo de robots.txt, y puede extraer datos como texto, metadatos, imágenes, enlaces y multimedia. Los resultados se pueden exportar a CSV, JSON, XML o Markdown. La biblioteca está diseñada para ser comprobable y fácil de ampliar, lo que la hace adecuada para automatización, minería de datos y monitorización de contenido en sitios web sin API.$$
  )
) where id = 0;

update projects set translations = jsonb_build_object(
  'no', jsonb_build_object(
    'description', $$VarsEL er et prosjekt med åpen kildekode som gir en enkel og effektiv måte å se og hente strømpriser i Norge på.$$,
    'details', $$VarsEL er et Java-bibliotek med frontend i Vue og Quasar som gir tilgang til strømpriser i Norge. Det henter data fra hvakosterstrømmen.no og tilbyr et enkelt API for å hente strømpriser for ulike tidsperioder. Prosjektet er laget for å være enkelt å bruke og integrere i andre applikasjoner, og støtter både sanntidsdata og historiske priser.$$
  ),
  'de', jsonb_build_object(
    'description', $$VarsEL ist ein Open-Source-Projekt, mit dem sich Strompreise in Norwegen einfach und effizient anzeigen und abrufen lassen.$$,
    'details', $$VarsEL ist eine Java-Bibliothek mit einem Frontend in Vue und Quasar, die Zugriff auf Strompreise in Norwegen bietet. Sie bezieht ihre Daten von hvakosterstrømmen.no und stellt eine einfache API bereit, um Strompreise für verschiedene Zeiträume abzurufen. Das Projekt ist einfach zu nutzen und in andere Anwendungen zu integrieren und unterstützt sowohl Echtzeitdaten als auch historische Preise.$$
  ),
  'fr', jsonb_build_object(
    'description', $$VarsEL est un projet open source qui offre un moyen simple et efficace de consulter et de récupérer les prix de l'électricité en Norvège.$$,
    'details', $$VarsEL est une bibliothèque Java avec une interface en Vue et Quasar qui donne accès aux prix de l'électricité en Norvège. Elle récupère les données depuis hvakosterstrømmen.no et propose une API simple pour obtenir les prix sur différentes périodes. Le projet est conçu pour être facile à utiliser et à intégrer dans d'autres applications, et prend en charge aussi bien les données en temps réel que les prix historiques.$$
  ),
  'es', jsonb_build_object(
    'description', $$VarsEL es un proyecto de código abierto que ofrece una forma sencilla y eficiente de consultar y obtener los precios de la electricidad en Noruega.$$,
    'details', $$VarsEL es una biblioteca Java con un frontend en Vue y Quasar que da acceso a los precios de la electricidad en Noruega. Obtiene los datos de hvakosterstrømmen.no y ofrece una API sencilla para consultar precios de distintos periodos. El proyecto está pensado para ser fácil de usar e integrar en otras aplicaciones, y admite tanto datos en tiempo real como precios históricos.$$
  )
) where id = 1;

update projects set translations = jsonb_build_object(
  'no', jsonb_build_object(
    'description', $$ChoreChamp er en mobilapp som hjelper familier med å fordele og organisere husarbeid på en morsom og engasjerende måte.$$,
    'details', $$ChoreChamp er en mobilapplikasjon som skal gjøre det enklere og morsommere for familier å holde styr på husarbeidet. I appen kan man opprette og tildele oppgaver, sette frister og følge med på fremdriften. Et belønningssystem motiverer brukerne og gjør det gøy å fullføre oppgavene. ChoreChamp er tilgjengelig på både iOS og Android, med et brukervennlig grensesnitt for hele familien. Appen er designet i Figma og bygget med React Native og Expo, som sikrer kompatibilitet på tvers av plattformer og en sømløs brukeropplevelse.$$
  ),
  'de', jsonb_build_object(
    'description', $$ChoreChamp ist eine mobile App, mit der Familien Hausarbeiten auf unterhaltsame und motivierende Weise verteilen und organisieren können.$$,
    'details', $$ChoreChamp ist eine mobile Anwendung, die Familien die Organisation von Hausarbeiten erleichtern und angenehmer machen soll. In der App lassen sich Aufgaben erstellen und zuweisen, Fristen setzen und Fortschritte verfolgen. Ein Belohnungssystem motiviert die Nutzer und macht das Erledigen von Aufgaben zum Spaß. ChoreChamp ist für iOS und Android verfügbar und bietet eine benutzerfreundliche Oberfläche für alle Familienmitglieder. Die App wurde in Figma gestaltet und mit React Native und Expo entwickelt, was plattformübergreifende Kompatibilität und ein nahtloses Nutzererlebnis sicherstellt.$$
  ),
  'fr', jsonb_build_object(
    'description', $$ChoreChamp est une application mobile qui aide les familles à répartir et organiser les tâches ménagères de manière ludique et motivante.$$,
    'details', $$ChoreChamp est une application mobile conçue pour rendre la gestion des tâches ménagères plus simple et plus agréable pour les familles. Elle permet de créer et d'attribuer des tâches, de fixer des échéances et de suivre leur avancement. Un système de récompenses motive les utilisateurs et transforme les corvées en jeu. ChoreChamp est disponible sur iOS et Android, avec une interface conviviale pour tous les membres de la famille. L'application a été conçue dans Figma et développée avec React Native et Expo, ce qui garantit la compatibilité multiplateforme et une expérience utilisateur fluide.$$
  ),
  'es', jsonb_build_object(
    'description', $$ChoreChamp es una aplicación móvil que ayuda a las familias a repartir y organizar las tareas del hogar de forma divertida y motivadora.$$,
    'details', $$ChoreChamp es una aplicación móvil pensada para que a las familias les resulte más fácil y agradable gestionar las tareas del hogar. Permite crear y asignar tareas, fijar plazos y seguir el progreso. Incluye un sistema de recompensas que motiva a los usuarios y convierte completar tareas en algo divertido. ChoreChamp está disponible en iOS y Android, con una interfaz fácil de usar para todos los miembros de la familia. Se diseñó en Figma y se desarrolló con React Native y Expo, lo que garantiza compatibilidad multiplataforma y una experiencia de usuario fluida.$$
  )
) where id = 2;

update projects set translations = jsonb_build_object(
  'no', jsonb_build_object(
    'description', $$SkillSwap er en webapplikasjon der brukere kan bytte ferdigheter og tjenester på en sikker plattform, med støtte for både byttehandel og betalte transaksjoner.$$,
    'details', $$SkillSwap er en omfattende webapplikasjon som kobler sammen folk som vil bytte ferdigheter og tjenester. Brukere kan opprette detaljerte profiler, legge ut annonser for tjenester de tilbyr eller trenger, og velge mellom å bytte ferdigheter eller betale for tjenesten. Plattformen har avansert filtrering etter kategorier, søk, et sikkert meldingssystem og et vurderingssystem som bygger tillit i fellesskapet. Tjenestene spenner fra hagearbeid og vedlikehold av hjemmet til webdesign og profesjonell rådgivning, noe som gir en variert markedsplass for kompetansebytte.$$
  ),
  'de', jsonb_build_object(
    'description', $$SkillSwap ist eine Webanwendung, über die Nutzer auf einer sicheren Plattform Fähigkeiten und Dienstleistungen austauschen können – per Tauschhandel oder gegen Bezahlung.$$,
    'details', $$SkillSwap ist eine umfassende Webanwendung, die Menschen zusammenbringt, die Fähigkeiten und Dienstleistungen austauschen möchten. Nutzer können ausführliche Profile anlegen, Anzeigen für angebotene oder gesuchte Dienstleistungen schalten und wählen, ob sie Fähigkeiten tauschen oder bezahlen möchten. Die Plattform bietet erweiterte Filter nach Kategorien, eine Suchfunktion, ein sicheres Nachrichtensystem und ein Bewertungssystem, das Vertrauen in der Community schafft. Das Angebot reicht von Gartenarbeit und Instandhaltung bis zu Webdesign und professioneller Beratung – ein vielfältiger Marktplatz für den Austausch von Fähigkeiten.$$
  ),
  'fr', jsonb_build_object(
    'description', $$SkillSwap est une application web qui permet aux utilisateurs d'échanger des compétences et des services sur une plateforme sécurisée, par troc ou contre paiement.$$,
    'details', $$SkillSwap est une application web complète qui met en relation des personnes souhaitant échanger des compétences et des services. Les utilisateurs peuvent créer des profils détaillés, publier des annonces pour les services qu'ils proposent ou recherchent, et choisir entre l'échange de compétences et la transaction payante. La plateforme propose un filtrage avancé par catégories, une fonction de recherche, une messagerie sécurisée et un système d'avis qui renforce la confiance au sein de la communauté. Les services vont du jardinage et de l'entretien de la maison à la conception web et au conseil professionnel, pour une place de marché variée.$$
  ),
  'es', jsonb_build_object(
    'description', $$SkillSwap es una aplicación web que permite a los usuarios intercambiar habilidades y servicios en una plataforma segura, tanto mediante trueque como con pagos.$$,
    'details', $$SkillSwap es una aplicación web completa que conecta a personas que quieren intercambiar habilidades y servicios. Los usuarios pueden crear perfiles detallados, publicar anuncios de los servicios que ofrecen o necesitan y elegir entre intercambiar habilidades o pagar por el servicio. La plataforma incluye filtrado avanzado por categorías, búsqueda, un sistema de mensajería seguro y un sistema de valoraciones que genera confianza en la comunidad. Los servicios van desde jardinería y mantenimiento del hogar hasta diseño web y consultoría profesional, creando un mercado variado para el intercambio de habilidades.$$
  )
) where id = 3;

update projects set translations = jsonb_build_object(
  'no', jsonb_build_object(
    'description', $$En personlig porteføljeside som viser frem prosjektene, ferdighetene og erfaringen min som utvikler.$$,
    'details', $$Denne porteføljesiden er bygget med Vue.js og Quasar Framework, med et moderne og responsivt design. Den har egne seksjoner for prosjekter, ferdigheter, erfaring og kontaktinformasjon. Nettsiden er optimalisert for ulike enheter og for tilgjengelighet, slik at brukeropplevelsen er god uansett skjerm. Den fungerer som en plattform for å vise frem arbeidet mitt og komme i kontakt med potensielle kunder og arbeidsgivere.$$
  ),
  'de', jsonb_build_object(
    'description', $$Eine persönliche Portfolio-Website, die meine Projekte, Fähigkeiten und Erfahrung als Entwickler präsentiert.$$,
    'details', $$Diese Portfolio-Website wurde mit Vue.js und dem Quasar Framework erstellt und bietet ein modernes, responsives Design. Sie enthält Bereiche für meine Projekte, Fähigkeiten, Erfahrung und Kontaktdaten. Die Website ist für verschiedene Geräte und Barrierefreiheit optimiert und sorgt so auf jedem Gerät für ein gutes Nutzererlebnis. Sie dient als Plattform, um meine Arbeit zu zeigen und mit potenziellen Kunden oder Arbeitgebern in Kontakt zu kommen.$$
  ),
  'fr', jsonb_build_object(
    'description', $$Un site portfolio personnel qui présente mes projets, mes compétences et mon expérience de développeur.$$,
    'details', $$Ce site portfolio est construit avec Vue.js et le framework Quasar, avec un design moderne et responsive. Il comprend des sections pour mes projets, mes compétences, mon expérience et mes coordonnées. Le site est optimisé pour différents appareils et pour l'accessibilité, afin d'offrir une bonne expérience sur tous les écrans. Il me sert de vitrine pour mettre en avant mon travail et entrer en contact avec de futurs clients ou employeurs.$$
  ),
  'es', jsonb_build_object(
    'description', $$Un sitio web de portafolio personal para mostrar mis proyectos, habilidades y experiencia como desarrollador.$$,
    'details', $$Este portafolio está construido con Vue.js y Quasar Framework, con un diseño moderno y adaptable. Incluye secciones para mis proyectos, habilidades, experiencia e información de contacto. El sitio está optimizado para distintos dispositivos y para la accesibilidad, garantizando una buena experiencia en cualquier pantalla. Sirve como plataforma para dar a conocer mi trabajo y conectar con posibles clientes o empleadores.$$
  )
) where id = 4;

update projects set translations = jsonb_build_object(
  'no', jsonb_build_object(
    'description', $$HangBot er et AI-drevet hengemannspill der en bot lager det hemmelige ordet og spillerne konkurrerer på en varig toppliste.$$,
    'details', $$HangBot er et hengemannspill bygget med React og Vite, inspirert av flyten i FleetBot. Spillerne skriver inn et brukernavn, velger vanskelighetsgrad og prøver å gjette hemmelige ord generert av boten før forsøkene er brukt opp. Spillet har hint, avsløring av kategori, poeng basert på vanskelighetsgrad og en varig toppliste. Det er publisert på Cloudflare Pages og bruker en Pages Function med D1 for å lagre resultatene på topplisten, med localStorage som reserve når databasekoblingen ikke er tilgjengelig.$$
  ),
  'de', jsonb_build_object(
    'description', $$HangBot ist ein KI-gestütztes Galgenmännchen-Spiel, bei dem ein Bot das geheime Wort erzeugt und Spieler auf einer dauerhaften Bestenliste gegeneinander antreten.$$,
    'details', $$HangBot ist ein Galgenmännchen-Spiel auf Basis von React und Vite, angelehnt an den Ablauf von FleetBot. Spieler geben einen Benutzernamen ein, wählen einen Schwierigkeitsgrad und versuchen, die vom Bot erzeugten Wörter zu erraten, bevor ihre Versuche aufgebraucht sind. Das Spiel bietet Hinweise, das Aufdecken der Kategorie, eine Punktewertung nach Schwierigkeit und eine dauerhafte Bestenliste. Es läuft auf Cloudflare Pages und speichert die Ergebnisse über eine Pages Function in D1, mit localStorage als Ausweichlösung, wenn die Datenbankanbindung nicht verfügbar ist.$$
  ),
  'fr', jsonb_build_object(
    'description', $$HangBot est un jeu du pendu propulsé par l'IA, où un bot génère le mot mystère et où les joueurs s'affrontent sur un classement permanent.$$,
    'details', $$HangBot est un jeu du pendu construit avec React et Vite, inspiré du déroulement de FleetBot. Les joueurs saisissent un pseudo, choisissent une difficulté et tentent de deviner les mots mystères générés par le bot avant d'épuiser leurs essais. Le jeu propose des indices, la révélation de la catégorie, un score selon la difficulté et un classement permanent. Il est déployé sur Cloudflare Pages et utilise une Pages Function avec D1 pour enregistrer les scores, avec un repli sur localStorage lorsque la base de données n'est pas disponible.$$
  ),
  'es', jsonb_build_object(
    'description', $$HangBot es un juego del ahorcado impulsado por IA en el que un bot genera la palabra secreta y los jugadores compiten en una clasificación permanente.$$,
    'details', $$HangBot es un juego del ahorcado creado con React y Vite, inspirado en el flujo de FleetBot. Los jugadores introducen un nombre de usuario, eligen una dificultad e intentan adivinar las palabras secretas generadas por el bot antes de quedarse sin intentos. El juego incluye pistas, revelación de la categoría, puntuación según la dificultad y una clasificación permanente. Está desplegado en Cloudflare Pages y usa una Pages Function con D1 para guardar los resultados, con localStorage como alternativa cuando la base de datos no está disponible.$$
  )
) where id = 5;

update projects set translations = jsonb_build_object(
  'no', jsonb_build_object(
    'description', $$FleetBot er et senke slagskip-spill der du møter en AI-motstander, med en global toppliste drevet av Cloudflare D1.$$,
    'details', $$FleetBot er et senke slagskip-spill bygget med React og Cloudflare Pages Functions. Du spiller mot en AI-motstander, og topplistedata lagres i Cloudflare D1. Brukerinnstillinger lagres i localStorage, og prosjektet er satt opp for å kjøre helt på Cloudflare Pages, med SPA-fallback slik at direkte oppdatering av ruter fungerer. Det er et praktisk eksempel på en skybasert frontend med en lett backend-funksjon for delt spilltilstand.$$
  ),
  'de', jsonb_build_object(
    'description', $$FleetBot ist ein Schiffe-versenken-Spiel gegen einen KI-Gegner mit einer globalen Bestenliste auf Basis von Cloudflare D1.$$,
    'details', $$FleetBot ist ein Schiffe-versenken-Spiel, entwickelt mit React und Cloudflare Pages Functions. Man spielt gegen einen KI-Gegner, und die Bestenliste wird in Cloudflare D1 gespeichert. Benutzereinstellungen liegen im localStorage, und das Projekt läuft vollständig auf Cloudflare Pages, mit einem SPA-Fallback, damit auch das direkte Neuladen von Routen funktioniert. Es ist ein praktisches Beispiel für ein Cloud-natives Frontend mit einer schlanken Backend-Funktion für gemeinsamen Spielstand.$$
  ),
  'fr', jsonb_build_object(
    'description', $$FleetBot est un jeu de bataille navale contre un adversaire IA, avec un classement mondial reposant sur Cloudflare D1.$$,
    'details', $$FleetBot est un jeu de bataille navale développé avec React et Cloudflare Pages Functions. On y affronte un adversaire IA, et les données du classement sont stockées dans Cloudflare D1. Les paramètres utilisateur sont enregistrés dans localStorage, et le projet est entièrement déployé sur Cloudflare Pages, avec un repli SPA pour que le rechargement direct des routes fonctionne. C'est un exemple concret de frontend cloud-native avec une fonction backend légère pour l'état de jeu partagé.$$
  ),
  'es', jsonb_build_object(
    'description', $$FleetBot es un juego de hundir la flota en el que te enfrentas a un oponente con IA, con una clasificación global basada en Cloudflare D1.$$,
    'details', $$FleetBot es un juego de hundir la flota creado con React y Cloudflare Pages Functions. Se juega contra un oponente con IA y los datos de la clasificación se guardan en Cloudflare D1. Los ajustes del usuario se almacenan en localStorage, y el proyecto se despliega por completo en Cloudflare Pages, con un fallback SPA para que las rutas funcionen al recargar directamente. Es un ejemplo práctico de frontend nativo en la nube con una función backend ligera para el estado compartido del juego.$$
  )
) where id = 6;

update projects set translations = jsonb_build_object(
  'no', jsonb_build_object(
    'description', $$En Stream Deck-plugin som viser batterinivået til automatisk oppdagede trådløse enheter – headset, mus, tastaturer, kontrollere og sammenkoblede Bluetooth-enheter – rett på en tast.$$,
    'details', $$Stream Deck Battery Monitor er en Windows-plugin for Elgato Stream Deck som skanner maskinen etter trådløse enheter og viser batterinivået live på en tast. Ingen enhetsmodeller er hardkodet – et sett med providere lister hver for seg opp det de kan se (HeadsetControl for rundt 100 headsetmodeller, Logitech HID++ 2.0, Asus ROGs reverse-engineerte mottakerprotokoll, PlayStation DualSense/DualShock over USB og Bluetooth, Xbox-kontrollere over Bluetooth og Windows' Bluetooth PnP-batteriegenskap), og resultatene slås sammen, dedupliseres og mellomlagres. Pollingen tilpasser seg det batteriet gjør (oftere under lading eller ved lavt nivå, sjeldnere ved stabil avlesning) i stedet for å belaste maskinvaren med et fast intervall. I tillegg til hovedhandlingen Device Battery finnes en Lowest Battery-handling som viser enheten som er nærmest å gå tom, og en Device Renaming-handling for å rette opp enheter med lite hjelpsomme navn. Tasteutseendet kan tilpasses fullt ut – batteristolpe, ring eller bare prosent, egne farger og terskler, håndtering av frakoblede enheter og sist kjente nivå, og estimert gjenværende tid – alt tegnet som SVG. Bygget med TypeScript og det offisielle @elgato/streamdeck-SDK-et, testet med node:test, og strukturert slik at en ny enhetsfamilie bare krever én ny provider-fil.$$
  ),
  'de', jsonb_build_object(
    'description', $$Ein Stream-Deck-Plugin, das den Akkustand automatisch erkannter kabelloser Geräte – Headsets, Mäuse, Tastaturen, Controller und gekoppelte Bluetooth-Geräte – direkt auf einer Taste anzeigt.$$,
    'details', $$Stream Deck Battery Monitor ist ein Windows-Plugin für das Elgato Stream Deck, das den Rechner nach kabellosen Geräten durchsucht und deren Akkustand live auf einer Taste anzeigt. Gerätemodelle sind nicht fest einprogrammiert – mehrere Provider listen jeweils auf, was sie erkennen (HeadsetControl für rund 100 Headset-Modelle, Logitech HID++ 2.0, das per Reverse Engineering entschlüsselte Empfängerprotokoll von Asus ROG, PlayStation DualSense/DualShock über USB und Bluetooth, Xbox-Controller über Bluetooth sowie die Bluetooth-PnP-Akkueigenschaft von Windows), und die Ergebnisse werden zusammengeführt, dedupliziert und zwischengespeichert. Die Abfrage passt sich dem Akkuverhalten an (häufiger beim Laden oder niedrigem Stand, seltener bei stabilen Werten), statt die Hardware in festen Abständen zu belasten. Neben der zentralen Aktion Device Battery gibt es die Aktion Lowest Battery, die das Gerät mit dem niedrigsten Akkustand anzeigt, und Device Renaming, um Geräte mit wenig hilfreichen Namen umzubenennen. Die Tastenansicht ist vollständig anpassbar – Balken, Ring oder nur Prozentanzeige, eigene Farben und Schwellenwerte, Umgang mit Offline-Geräten und dem letzten bekannten Stand sowie eine geschätzte Restlaufzeit – alles als SVG gerendert. Entwickelt mit TypeScript und dem offiziellen @elgato/streamdeck-SDK, getestet mit node:test und so aufgebaut, dass eine neue Gerätefamilie nur eine neue Provider-Datei braucht.$$
  ),
  'fr', jsonb_build_object(
    'description', $$Un plugin Stream Deck qui affiche directement sur une touche le niveau de batterie des périphériques sans fil détectés automatiquement : casques, souris, claviers, manettes et appareils Bluetooth appairés.$$,
    'details', $$Stream Deck Battery Monitor est un plugin Windows pour l'Elgato Stream Deck qui recherche les périphériques sans fil connectés à la machine et affiche leur niveau de batterie en direct sur une touche. Aucun modèle n'est codé en dur : plusieurs providers recensent chacun ce qu'ils détectent (HeadsetControl pour une centaine de modèles de casques, Logitech HID++ 2.0, le protocole de récepteur Asus ROG obtenu par rétro-ingénierie, les manettes PlayStation DualSense/DualShock en USB et Bluetooth, les manettes Xbox en Bluetooth et la propriété de batterie Bluetooth PnP de Windows), puis les résultats sont fusionnés, dédupliqués et mis en cache. La fréquence d'interrogation s'adapte au comportement de la batterie (plus rapide en charge ou à faible niveau, plus lente lorsque la valeur est stable) au lieu de solliciter le matériel à intervalle fixe. En plus de l'action principale Device Battery, le plugin propose une action Lowest Battery qui met en avant l'appareil le plus proche de s'éteindre, et une action Device Renaming pour renommer les appareils aux noms peu parlants. L'affichage de la touche est entièrement personnalisable : barre, anneau ou pourcentage seul, couleurs et seuils configurables, gestion des appareils hors ligne et du dernier niveau connu, et estimation de l'autonomie restante, le tout rendu en SVG. Développé en TypeScript avec le SDK officiel @elgato/streamdeck, testé avec node:test et structuré pour qu'une nouvelle famille d'appareils ne nécessite qu'un seul nouveau fichier provider.$$
  ),
  'es', jsonb_build_object(
    'description', $$Un plugin para Stream Deck que muestra en una tecla el nivel de batería de los periféricos inalámbricos detectados automáticamente: auriculares, ratones, teclados, mandos y dispositivos Bluetooth emparejados.$$,
    'details', $$Stream Deck Battery Monitor es un plugin de Windows para Elgato Stream Deck que busca periféricos inalámbricos en el equipo y muestra su nivel de batería en tiempo real en una tecla. No hay modelos de dispositivo codificados de forma fija: varios providers enumeran lo que cada uno detecta (HeadsetControl para unos 100 modelos de auriculares, Logitech HID++ 2.0, el protocolo del receptor de Asus ROG obtenido mediante ingeniería inversa, mandos PlayStation DualSense/DualShock por USB y Bluetooth, mandos Xbox por Bluetooth y la propiedad de batería Bluetooth PnP de Windows), y los resultados se combinan, se deduplican y se almacenan en caché. La frecuencia de consulta se adapta a lo que hace la batería (más rápida al cargar o con nivel bajo, más lenta con lecturas estables) en lugar de sobrecargar el hardware con un intervalo fijo. Además de la acción principal Device Battery, incluye una acción Lowest Battery que muestra el dispositivo más cerca de agotarse y una acción Device Renaming para corregir dispositivos con nombres poco útiles. El aspecto de la tecla es totalmente personalizable: barra, anillo o solo porcentaje, colores y umbrales configurables, gestión de dispositivos desconectados y del último nivel conocido, y una estimación del tiempo restante, todo renderizado en SVG. Creado con TypeScript y el SDK oficial @elgato/streamdeck, probado con node:test y estructurado para que una nueva familia de dispositivos solo necesite un nuevo archivo de provider.$$
  )
) where id = 7;

update projects set translations = jsonb_build_object(
  'no', jsonb_build_object(
    'description', $$Perceivo er en selvbygd WCAG-tilgjengelighetsskanner som sjekker URL-er, rå HTML eller live sider mot 40 egenutviklede WCAG-regler, med retteveiledninger i klarspråk.$$,
    'details', $$Perceivo er en selvbygd skanner for universell utforming på nett. Lim inn en URL, last opp eller lim inn rå HTML, eller pek den mot en live side, og få tilbake WCAG-funn gruppert etter suksesskriterium – hver med en retteveiledning i klarspråk i stedet for bare en regel-ID. Alt som avgjør bestått eller ikke bestått er egen kode, uten axe-core eller en lånt regelmotor. En skanning legges i kø i Postgres og plukkes opp av en worker som kjører 40 WCAG-regler på tvers av alle fire POUR-prinsippene og lagrer resultatet, mens grensesnittet følger fremdriften live over SSE og viser en rapport med utvidbare retteveiledninger. Monorepoet er delt i en React-frontend, en Fastify-backend med en SSRF-beskyttet og sandkassebasert skanneløype, og delte pakker for regelprimitiver, den Playwright-baserte kjøreren og retteveiledningene. Perceivo skanner også sin egen frontend som en del av CI, og bygget feiler hvis den ikke består sine egne sjekker.$$
  ),
  'de', jsonb_build_object(
    'description', $$Perceivo ist ein selbst entwickelter WCAG-Barrierefreiheitsscanner, der URLs, reines HTML oder Live-Seiten anhand von 40 eigenen WCAG-Regeln prüft und verständliche Anleitungen zur Behebung liefert.$$,
    'details', $$Perceivo ist ein selbst entwickelter Scanner für Web-Barrierefreiheit. URL einfügen, HTML hochladen oder einfügen oder auf eine Live-Seite zeigen – zurück kommen WCAG-Befunde, gruppiert nach Erfolgskriterium und jeweils mit einer verständlichen Anleitung zur Behebung statt nur einer Regel-ID. Alles, was über Bestehen oder Nichtbestehen entscheidet, ist eigener Code – ohne axe-core oder eine fremde Regel-Engine. Ein Scan wird in Postgres eingereiht und von einem Worker abgearbeitet, der 40 WCAG-Regeln über alle vier POUR-Prinzipien ausführt und das Ergebnis speichert, während die Oberfläche den Fortschritt live per SSE verfolgt und einen Bericht mit aufklappbaren Anleitungen anzeigt. Das Monorepo besteht aus einem React-Frontend, einem Fastify-Backend mit SSRF-geschützter, in einer Sandbox laufender Scan-Pipeline sowie gemeinsamen Paketen für Regel-Primitive, den Playwright-basierten Runner und die Behebungsanleitungen. Perceivo scannt außerdem sein eigenes Frontend in der CI – der Build schlägt fehl, wenn es die eigenen Prüfungen nicht besteht.$$
  ),
  'fr', jsonb_build_object(
    'description', $$Perceivo est un scanner d'accessibilité WCAG développé de A à Z, qui vérifie des URL, du HTML brut ou des pages en ligne selon 40 règles WCAG originales, avec des guides de correction en langage clair.$$,
    'details', $$Perceivo est un scanner d'accessibilité web développé de A à Z. Collez une URL, importez ou collez du HTML brut, ou pointez-le vers une page en ligne, et obtenez des résultats WCAG regroupés par critère de succès, chacun accompagné d'un guide de correction en langage clair plutôt que d'un simple identifiant de règle. Tout ce qui décide de la réussite ou de l'échec est du code original, sans axe-core ni moteur de règles emprunté. Une analyse est mise en file d'attente dans Postgres puis prise en charge par un worker qui exécute 40 règles WCAG couvrant les quatre principes POUR et enregistre le résultat, tandis que l'interface suit la progression en direct via SSE et affiche un rapport avec des guides de correction dépliables. Le monorepo se compose d'un frontend React, d'un backend Fastify avec un pipeline d'analyse protégé contre les SSRF et isolé en sandbox, et de paquets partagés pour les primitives de règles, le runner basé sur Playwright et les guides de correction. Perceivo analyse aussi son propre frontend dans la CI : le build échoue s'il ne réussit pas ses propres contrôles.$$
  ),
  'es', jsonb_build_object(
    'description', $$Perceivo es un escáner de accesibilidad WCAG desarrollado desde cero que analiza URL, HTML sin procesar o páginas en vivo con 40 reglas WCAG propias y guías de corrección en lenguaje claro.$$,
    'details', $$Perceivo es un escáner de accesibilidad web desarrollado desde cero. Pega una URL, sube o pega HTML sin procesar, o apúntalo a una página en vivo, y obtén resultados WCAG agrupados por criterio de conformidad, cada uno con una guía de corrección en lenguaje claro en lugar de solo un identificador de regla. Todo lo que decide si algo pasa o falla es código propio, sin axe-core ni motores de reglas prestados. Cada análisis se pone en cola en Postgres y lo recoge un worker que ejecuta 40 reglas WCAG de los cuatro principios POUR y guarda el resultado, mientras la interfaz sigue el progreso en tiempo real mediante SSE y muestra un informe con guías de corrección desplegables. El monorepo se divide en un frontend en React, un backend en Fastify con un pipeline de análisis protegido contra SSRF y aislado en sandbox, y paquetes compartidos para las primitivas de reglas, el runner basado en Playwright y las guías de corrección. Perceivo también analiza su propio frontend como parte de la CI, y el build falla si no supera sus propias comprobaciones.$$
  )
) where id = 8;

update projects set translations = jsonb_build_object(
  'no', jsonb_build_object(
    'description', $$README Studio er en moderne og svært tilpassbar README-generator for GitHub, med en modulær blokkbygger og live forhåndsvisning, som kjører helt i nettleseren.$$,
    'details', $$README Studio er en README-generator for GitHub bygget rundt en modulær blokkbygger med live forhåndsvisning. Blokkene dekker animerte skrivemaskin-overskrifter, gradient- og bølgebannere, live GitHub-statistikkmerker, ikoner for teknologistakken, streak- og språkkort samt lenker til sosiale medier og støtte – hver med full kontroll over skrift, farger og layout. Det finnes ingen backend og ingen kontoer; alt kjører i nettleseren og lagres automatisk der. Merke-, statistikk- og animasjonsblokker genereres som URL-er mot tjenester som shields.io, readme-typing-svg, capsule-render, github-readme-stats og skillicons.dev, så ingen ressurser pakkes med. Bygget med Next.js App Router og TypeScript, stylet med Tailwind CSS, med byggerens tilstand lagret via Zustand og den GitHub-lignende forhåndsvisningen tegnet med react-markdown.$$
  ),
  'de', jsonb_build_object(
    'description', $$README Studio ist ein moderner, umfassend anpassbarer README-Generator für GitHub mit modularem Block-Builder und Live-Vorschau, der vollständig im Browser läuft.$$,
    'details', $$README Studio ist ein README-Generator für GitHub, der auf einem modularen Block-Builder mit Live-Vorschau aufbaut. Die Blöcke umfassen animierte Schreibmaschinen-Überschriften, Verlaufs- und Wellenbanner, Live-GitHub-Statistik-Badges, Tech-Stack-Icons, Streak- und Sprachkarten sowie Social- und Support-Links – jeweils mit voller Kontrolle über Schrift, Farben und Layout. Es gibt kein Backend und keine Konten; alles läuft im Browser und wird dort automatisch gespeichert. Badge-, Statistik- und Animationsblöcke werden als URLs für Dienste wie shields.io, readme-typing-svg, capsule-render, github-readme-stats und skillicons.dev erzeugt, sodass keine Assets mitgeliefert werden. Entwickelt mit dem Next.js App Router und TypeScript, gestaltet mit Tailwind CSS, mit per Zustand gespeichertem Builder-Zustand und einer mit react-markdown gerenderten Live-Vorschau im GitHub-Stil.$$
  ),
  'fr', jsonb_build_object(
    'description', $$README Studio est un générateur de README GitHub moderne et très personnalisable, avec un éditeur modulaire par blocs et un aperçu en direct, fonctionnant entièrement côté client.$$,
    'details', $$README Studio est un générateur de README GitHub construit autour d'un éditeur modulaire par blocs avec aperçu en direct. Les blocs couvrent les titres animés façon machine à écrire, les bannières en dégradé ou en vague, les badges de statistiques GitHub en direct, les icônes de stack technique, les cartes de séries et de langages, ainsi que les liens sociaux et de soutien, chacun avec un contrôle complet de la police, des couleurs et de la mise en page. Il n'y a ni backend ni compte : tout fonctionne dans le navigateur, avec sauvegarde automatique. Les blocs de badges, de statistiques et d'animations sont générés sous forme d'URL vers des services comme shields.io, readme-typing-svg, capsule-render, github-readme-stats et skillicons.dev, si bien qu'aucune ressource n'est embarquée. Développé avec Next.js App Router et TypeScript, stylisé avec Tailwind CSS, avec l'état de l'éditeur persisté via Zustand et l'aperçu au format GitHub rendu avec react-markdown.$$
  ),
  'es', jsonb_build_object(
    'description', $$README Studio es un generador de README para GitHub moderno y muy personalizable, con un editor modular por bloques y vista previa en directo, que funciona completamente en el navegador.$$,
    'details', $$README Studio es un generador de README para GitHub construido en torno a un editor modular por bloques con vista previa en directo. Los bloques incluyen encabezados animados tipo máquina de escribir, banners con degradado u ondas, insignias de estadísticas de GitHub en directo, iconos del stack tecnológico, tarjetas de rachas y lenguajes, y enlaces sociales y de apoyo, cada uno con control total de tipografía, colores y diseño. No hay backend ni cuentas; todo se ejecuta en el navegador y se guarda automáticamente. Los bloques de insignias, estadísticas y animaciones se generan como URL de servicios como shields.io, readme-typing-svg, capsule-render, github-readme-stats y skillicons.dev, por lo que no se empaqueta ningún recurso. Creado con Next.js App Router y TypeScript, con estilos de Tailwind CSS, el estado del editor persistido mediante Zustand y la vista previa al estilo de GitHub renderizada con react-markdown.$$
  )
) where id = 9;
