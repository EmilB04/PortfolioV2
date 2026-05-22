-- Create semesters and courses tables
create table if not exists semesters (
  id serial primary key,
  semester text not null
);

create table if not exists courses (
  id serial primary key,
  semester_id integer references semesters(id) on delete cascade,
  name text not null,
  link text,
  code text,
  description text
);

-- Insert semesters with stable ids
insert into semesters (id, semester) values
(1, 'Høst 2023'),
(2, 'Vår 2024'),
(3, 'Høst 2024'),
(4, 'Vår 2025'),
(5, 'Høst 2025'),
(6, 'Vår 2026')
on conflict (id) do nothing;

-- Insert courses and associate with semester_id
-- Høst 2023 (semester_id = 1)
insert into courses (semester_id, name, link, code, description) values
(1, 'Programmering 1', 'https://www.hiof.no/studier/emner/iio/itk/2023/host/itf10219.html', 'ITF10219', 'Kurset gir en innføring i programmering og programmeringsspråket Python.'),
(1, 'Webutvikling', 'https://www.hiof.no/studier/emner/iio/itk/2023/host/itf10511.html', 'ITF10511', 'Kurset gir en innføring i webutvikling og språkene HTML, CSS og SCSS.'),
(1, 'Innføring i design av digitale produkter', 'https://www.hiof.no/studier/emner/iio/itk/2023/host/itf14022.html', 'ITF14022', 'Kurset gir en innføring i design av digitale produkter, brukeropplevelse og arbeidsmetodikk.')
on conflict do nothing;

-- Vår 2024 (semester_id = 2)
insert into courses (semester_id, name, link, code, description) values
(2, 'Programmering 2', 'https://www.hiof.no/studier/emner/iio/itk/2024/var/itf10619.html', 'ITF20219', 'Kurset gir en videreføring i programmering i programmeringsspråket Java.'),
(2, 'Databasesystemer', 'https://www.hiof.no/studier/emner/iio/itk/2024/var/itf10319.html', 'ITF20511', 'Kurset gir en innføring i databasesystemer og språket MySQL.'),
(2, 'Innføring i datasikkerhet', 'https://www.hiof.no/studier/emner/iio/itk/2024/var/itf15019.html', 'ITF24022', 'Kurset gir en innføring i datasikkerhet, sikkerhetsløsninger og skadelig programvare.')
on conflict do nothing;

-- Høst 2024 (semester_id = 3)
insert into courses (semester_id, name, link, code, description) values
(3, 'Innføring i operativsystemer', 'https://www.hiof.no/studier/emner/iio/itk/2024/host/itf22519.html', 'ITF22519', 'Kurset gir en innføring i operativsystemer og C-programmering.'),
(3, 'Diskret matematikk', 'https://www.hiof.no/studier/emner/iio/itk/2024/host/itf10705.html', 'ITF10705', 'Kurset gir en innføring i diskret matematikk og matematiske bevis.'),
(3, 'Software Engineering og testing', 'https://www.hiof.no/studier/emner/iio/itk/2024/host/itf20319.html', 'ITF20319', 'Kurset gir en innføring i software engineering, utvikling, testing og arbeidsmetodikk.')
on conflict do nothing;

-- Vår 2025 (semester_id = 4)
insert into courses (semester_id, name, link, code, description) values
(4, 'Rammeverk og .NET', 'https://www.hiof.no/studier/emner/iio/itk/2025/var/itf20123.html', 'ITF20123', 'Kurset gir en innføring i rammeverk og .NET med programmeringsspråket C#.'),
(4, 'Algoritmer og datastrukturer', 'https://www.hiof.no/studier/emner/iio/itk/2025/var/itf20006.html', 'ITF20006', 'Kurset gir en innføring i algoritmer og datastrukturer.'),
(4, 'Innføring i Generativ AI', 'https://www.hiof.no/studier/emner/iio/itk/2025/var/itf31824.html', 'ITF31824', 'Kurset gir en innføring i generativ AI, og innsikt i etiske probleemstillinger knyttet til bruk av KI.'),
(4, 'Utvikling av interaktive nettsteder', 'https://www.hiof.no/studier/emner/iio/itk/2025/var/itm30617.html', 'ITM30617', 'Kurset er en videreføring av Webutvikling og bygget videre med rammeverket React og språket JavaScript.')
on conflict do nothing;

-- Høst 2025 (semester_id = 5)
insert into courses (semester_id, name, link, code, description) values
(5, 'Mobilprogrammering', 'https://www.hiof.no/studier/emner/iio/itk/2025/host/itf21019.html', 'ITF21019', 'Kurset gir en innføring i mobilprogrammering med fokus på plattformene Android og iOS.'),
(5, 'Webapplikasjoner', 'https://www.hiof.no/studier/emner/iio/itk/2025/host/itf31619.html', 'ITF31619', 'Kurset gir en innføring i webapplikasjoner med fokus på moderne rammeverk og teknologier.'),
(5, 'Kommunikasjonsdesign', 'https://www.hiof.no/studier/emner/iio/itk/2025/host/itm30719.html', 'ITM30719', 'Kurset gir en innføring i kommunikasjonsdesign, brukeropplevelse og designmetodikk.')
on conflict do nothing;

-- Vår 2026 (semester_id = 6)
insert into courses (semester_id, name, link, code, description) values
(6, 'Bacheloroppgave', 'https://www.hiof.no/studier/emner/iio/itk/2026/var/itf32012.html', 'ITF32012', 'Kurset er en bacheloroppgave som avslutter studiet.'),
(6, 'Parallel og distribuert programmering', 'https://www.hiof.no/studier/emner/iio/itk/2026/var/itf23019.html', 'ITF23019', 'Kurset gir en innføring i parallel og distribuert programmering.')
on conflict do nothing;
