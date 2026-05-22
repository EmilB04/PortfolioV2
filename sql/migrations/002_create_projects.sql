-- Create projects table
create table if not exists projects (
  id integer primary key,
  title text not null,
  languages text [] not null default '{}',
  description text not null,
  details text not null,
  local_path text not null,
  url text not null,
  images text [] not null default '{}',
  videos text [] not null default '{}',
  tags text [] not null default '{}'
);

-- Insert projects with stable ids
insert into
  projects (
    id,
    title,
    languages,
    description,
    details,
    local_path,
    url,
    images,
    videos,
    tags
  )
values
  (
    0,
    'PageProbe',
    array ['.NET', 'C#'],
    'PageProbe is a .NET 8-based open-source web crawler library for C# that enables automated retrieval and monitoring of content from statically generated websites.',
    'PageProbe is a simple and extensible .NET 8 library for web crawling and content extraction. It supports HTML parsing, handling of robots.txt, and can extract data such as text, metadata, images, links, and multimedia. Results can be exported to CSV, JSON, XML, or Markdown. The library is designed to be testable and easy to extend, making it suitable for automation, data mining, and content monitoring on websites without APIs.',
    'pageprobe',
    'https://github.com/EmilB04/Rammeverk-og-.NET/tree/main/Project/PageProbe',
    array [] :: text [],
    array [] :: text [],
    array ['.NET', 'dotnet8', 'C#', 'open-source', 'web-crawler', 'site-crawler', 'html-parsing', 'robots.txt', 'data-extraction', 'content-extraction', 'csv', 'json', 'xml', 'markdown', 'text', 'metadata', 'images', 'links', 'multimedia', 'extensible', 'testable', 'automation', 'data-mining', 'library']
  ),
  (
    1,
    'VarsEL',
    array ['Java', 'Vue', 'Quasar', 'npm'],
    'VarsEL is an open-source project that offers a simple and efficient way to view and retrieve electricity prices in Norway.',
    'VarsEL is a Java library with Vue and Quasar front-end that provides access to electricity prices in Norway. It fetches data from hvakosterstrømmen.no and offers a simple API for retrieving electricity prices for different time periods. The project is designed to be easy to use and integrate into other applications, supporting both real-time data and historical prices.',
    'varsel',
    'https://github.com/EmilB04/VarsEL',
    array [] :: text [],
    array [] :: text [],
    array ['Java', 'Vue', 'Quasar', 'npm', 'open-source', 'electricity-prices', 'Norway', 'API', 'real-time-data', 'historical-prices', 'hvakosterstrømmen.no', 'data-access', 'library', 'integration']
  ),
  (
    2,
    'ChoreChamp',
    array ['React Native', 'JavaScript', 'TypeScript', 'Figma', 'Expo', 'Firebase', 'iOS', 'Android', 'npm'],
    'ChoreChamp is a mobile app that helps families manage and organize household chores in a fun and engaging way.',
    'ChoreChamp is a mobile application designed to make household chore management easier and more enjoyable for families. The app allows users to create and assign chores, set deadlines, and track progress. It features a reward system to motivate users, making chore completion a fun activity. ChoreChamp is available on both iOS and Android platforms, providing a user-friendly interface for all family members. ChoreChamp is designed in Figma and built using React Native with Expo, ensuring cross-platform compatibility and a seamless user experience.',
    'chorechamp',
    'https://github.com/EmilB04/ChoreChamp',
    array [] :: text [],
    array [] :: text [],
    array ['mobile-app', 'iOS', 'Android', 'expo', 'react-native', 'household-chores', 'task-management', 'family-organization', 'reward-system', 'user-friendly', 'cross-platform', 'productivity']
  ),
  (
    3,
    'SkillSwap',
    array [] :: text [],
    'SkillSwap is a web application that enables users to exchange skills and services through a secure platform, supporting both bartering and paid transactions.',
    'SkillSwap is a comprehensive web application designed to connect people who want to exchange skills and services. Users can create detailed profiles, post advertisements for services they offer or need, and engage in either skill swapping or paid transactions. The platform features advanced filtering by categories, search functionality, secure messaging system, and a review system that builds trust within the community. Services range from gardening and home maintenance to web design and professional consulting, creating a diverse marketplace for skill exchange.',
    'skillswap',
    'https://github.com/EmilB04/SkillSwap',
    array [] :: text [],
    array [] :: text [],
    array ['web-application', 'skill-exchange', 'service-marketplace', 'user-profiles', 'advertisement-system', 'filtering', 'search-functionality', 'secure-messaging', 'review-system', 'swap', 'paid-transactions', 'community-platform', 'trust-building', 'diverse-services', 'professional-services']
  ),
  (
    4,
    'Portfolio Website',
    array ['Vue.js', 'HTML', 'CSS', 'Quasar', 'JavaScript', 'TypeScript'],
    'A personal portfolio website to showcase my projects, skills, and experience as a developer.',
    'This portfolio website is built using Vue.js and Quasar Framework, providing a modern and responsive design. It features sections for my projects, skills, experience, and contact information. The website is optimized for multiple devices and accessibility, ensuring a great user experience across all devices. It serves as a platform to highlight my work and connect with potential clients or employers.',
    'portfolio-website',
    'https://github.com/EmilB04/Portfolio',
    array [] :: text [],
    array ['/videos/landing.mp4'],
    array ['Vue.js', 'Quasar', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'portfolio', 'responsive-design', 'web-development', 'personal-website', 'projects-showcase', 'skills', 'experience', 'contact-information', 'accessibility', 'modern-design']
  ),
  (
    5,
    'HangBot',
    array ['React', 'JavaScript', 'Vite', 'Tailwind CSS'],
    'HangBot is an AI-powered hangman game where a bot generates the mystery word and players compete on a persistent leaderboard.',
    'HangBot is a React and Vite-based hangman game inspired by FleetBot''s flow. Players enter a username, choose a difficulty, and try to guess bot-generated mystery words before running out of attempts. The game includes hints, category reveals, difficulty-based scoring, and a persistent leaderboard. It is deployed on Cloudflare Pages and uses a Pages Function with D1 support for storing leaderboard results, with a localStorage fallback when the database binding is unavailable.',
    'hangbot',
    'https://github.com/SpillArena/HangBot',
    array [] :: text [],
    array [] :: text [],
    array ['React', 'Vite', 'Tailwind CSS', 'Cloudflare Pages', 'D1', 'hangman', 'leaderboard', 'game', 'bot-generated', 'difficulty-modes']
  ),
  (
    6,
    'FleetBot',
    array ['React', 'JavaScript', 'CSS', 'HTML'],
    'FleetBot is a Battleship game where you face off against an AI opponent with a global leaderboard powered by Cloudflare D1.',
    'FleetBot is a Battleship game built with React and Cloudflare Pages Functions. The game runs with an AI opponent, and leaderboard data is persisted in Cloudflare D1. User settings are stored in localStorage, and the project is set up to deploy entirely on Cloudflare Pages with an SPA fallback for direct route refreshes. It is a practical example of a cloud-native frontend with a lightweight backend function for shared game state.',
    'fleetbot',
    'https://github.com/SpillArena/FleetBot',
    array [] :: text [],
    array [] :: text [],
    array ['React', 'Cloudflare Pages', 'Pages Functions', 'D1', 'Battleship', 'AI opponent', 'leaderboard', 'game', 'localStorage']
  ) on conflict (id) do
update
set
  title = excluded.title,
  languages = excluded.languages,
  description = excluded.description,
  details = excluded.details,
  local_path = excluded.local_path,
  url = excluded.url,
  images = excluded.images,
  videos = excluded.videos,
  tags = excluded.tags;