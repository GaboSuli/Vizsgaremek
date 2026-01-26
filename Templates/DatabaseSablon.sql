-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Jan 26. 11:01
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `backend`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `alkategoriak`
--

CREATE TABLE `alkategoriak` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `megnevezes` varchar(255) NOT NULL,
  `kategoria_id` bigint(20) UNSIGNED NOT NULL,
  `mennyiseg_tipus_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `alkategoriak`
--

INSERT INTO `alkategoriak` (`id`, `megnevezes`, `kategoria_id`, `mennyiseg_tipus_id`) VALUES
(1, 'Alma', 1, 2),
(2, 'Banán', 1, 2),
(3, 'Narancs', 1, 2),
(4, 'Eper', 1, 2),
(5, 'Paradicsom', 2, 2),
(6, 'Paprika', 2, 2),
(7, 'Hagyma', 2, 2),
(8, 'Burgonya', 2, 2),
(9, 'ASUS Laptop', 3, 1),
(10, 'Dell Laptop', 3, 1),
(11, 'Lenovo Laptop', 3, 1),
(12, 'MacBook Air', 3, 1),
(13, 'Bluetooth fejhallgató', 4, 1),
(14, 'USB pendrive', 4, 1),
(15, 'Monitor', 4, 1),
(16, 'Mosószer', 5, 3),
(17, 'Papírtörlő', 5, 1),
(18, 'Mosogatószer', 5, 3);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `csoportok`
--

CREATE TABLE `csoportok` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `csoport_tipus_id` bigint(20) UNSIGNED NOT NULL,
  `megnevezes` varchar(255) NOT NULL,
  `keszito_felhasznalo_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `csoportok`
--

INSERT INTO `csoportok` (`id`, `created_at`, `updated_at`, `csoport_tipus_id`, `megnevezes`, `keszito_felhasznalo_id`) VALUES
(1, '2026-01-26 08:43:16', '2026-01-26 08:43:16', 1, 'Családi bevásárlás', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `csoport_tagsag`
--

CREATE TABLE `csoport_tagsag` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `felhasznalo_id` bigint(20) UNSIGNED NOT NULL,
  `csoport_id` bigint(20) UNSIGNED NOT NULL,
  `jogosultsag_szint` int(11) NOT NULL,
  `becenev` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `csoport_tipusok`
--

CREATE TABLE `csoport_tipusok` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `megnevezes` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `csoport_tipusok`
--

INSERT INTO `csoport_tipusok` (`id`, `megnevezes`) VALUES
(1, 'Család'),
(2, 'Munka');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kategoriak`
--

CREATE TABLE `kategoriak` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `megnevezes` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `kategoriak`
--

INSERT INTO `kategoriak` (`id`, `megnevezes`) VALUES
(1, 'Gyümölcs'),
(2, 'Zöldség'),
(3, 'Laptop'),
(4, 'Elektronika'),
(5, 'Háztartás');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kupon`
--

CREATE TABLE `kupon` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `kezdesi_datum` date NOT NULL,
  `lejarasi_datum` date NOT NULL,
  `kod` varchar(255) NOT NULL,
  `kedvezmeny` varchar(255) NOT NULL,
  `megjegyzes` varchar(255) NOT NULL,
  `hasznalasi_hely` varchar(255) NOT NULL,
  `feltolto_kuponos_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `mennyiseg_tipusok`
--

CREATE TABLE `mennyiseg_tipusok` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `mertekegyseg` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `mennyiseg_tipusok`
--

INSERT INTO `mennyiseg_tipusok` (`id`, `mertekegyseg`) VALUES
(1, 'db'),
(2, 'kg'),
(3, 'liter');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_temaks_table', 1),
(2, '0001_01_01_000001_create_users_table', 1),
(3, '0001_01_01_000002_create_cache_table', 1),
(4, '0001_01_01_000003_create_jobs_table', 1),
(5, '0001_01_01_000004_create_kategoriaks_table', 1),
(6, '0001_01_01_000005_create_mennyiseg_tipusoks_table', 1),
(7, '0001_01_01_000006_create_csoport_tipusoks_table', 1),
(8, '0001_01_01_000007_create_alkategoriaks_table', 1),
(9, '0001_01_01_000008_create_csoportoks_table', 1),
(10, '0001_01_01_000009_create_csoport_tagsags_table', 1),
(11, '0001_01_01_000010_create_veves_listas_table', 1),
(12, '0001_01_01_000011_create_veves_objekta_table', 1),
(13, '0001_01_01_000012_create_kupons_table', 1),
(14, '2026_01_15_091029_create_personal_access_tokens_table', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `temak`
--

CREATE TABLE `temak` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `megnevezes` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `temak`
--

INSERT INTO `temak` (`id`, `megnevezes`) VALUES
(1, 'Világos'),
(2, 'Sötét'),
(3, 'Zöld');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nev` varchar(255) NOT NULL,
  `becenev` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `tema_id` bigint(20) UNSIGNED NOT NULL DEFAULT 1,
  `profilkep_url` varchar(255) NOT NULL DEFAULT 'user.png',
  `kuponok` tinyint(1) NOT NULL DEFAULT 1,
  `termekArKovetes` tinyint(1) NOT NULL DEFAULT 1,
  `brokerArKovetes` tinyint(1) NOT NULL DEFAULT 1,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `nev`, `becenev`, `email`, `email_verified_at`, `password`, `tema_id`, `profilkep_url`, `kuponok`, `termekArKovetes`, `brokerArKovetes`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Teszt Elek', 'elek', 'elek@test.hu', NULL, '$2y$10$testhash', 1, 'user.png', 1, 1, 1, NULL, '2026-01-26 08:43:16', '2026-01-26 08:43:16'),
(2, 'Kiss Anna', 'anna', 'anna@test.hu', NULL, '$2y$10$testhash', 2, 'user.png', 1, 1, 1, NULL, '2026-01-26 08:43:16', '2026-01-26 08:43:16');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `veves_lista`
--

CREATE TABLE `veves_lista` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `felhasznalo_id` bigint(20) UNSIGNED NOT NULL,
  `csoport_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `veves_lista`
--

INSERT INTO `veves_lista` (`id`, `created_at`, `updated_at`, `felhasznalo_id`, `csoport_id`) VALUES
(1, '2026-01-04 23:00:00', '2026-01-04 23:00:00', 1, 1),
(2, '2026-02-09 23:00:00', '2026-02-09 23:00:00', 1, 1),
(3, '2026-03-14 23:00:00', '2026-03-14 23:00:00', 1, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `veves_objekt`
--

CREATE TABLE `veves_objekt` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `veves_lista_id` bigint(20) UNSIGNED NOT NULL,
  `alKategoria_id` bigint(20) UNSIGNED NOT NULL,
  `megnevezes` varchar(255) NOT NULL,
  `ar` double NOT NULL,
  `mennyiseg` double NOT NULL,
  `elfogadott_statisztikara` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `veves_objekt`
--

INSERT INTO `veves_objekt` (`id`, `veves_lista_id`, `alKategoria_id`, `megnevezes`, `ar`, `mennyiseg`, `elfogadott_statisztikara`) VALUES
(1, 1, 1, 'Alma', 600, 2, 1),
(2, 1, 2, 'Banán', 750, 1.5, 1),
(3, 1, 5, 'Paradicsom', 680, 1, 1),
(4, 1, 9, 'ASUS Laptop', 320000, 1, 1),
(5, 2, 1, 'Alma', 620, 2.2, 1),
(6, 2, 3, 'Narancs', 700, 1.8, 1),
(7, 2, 10, 'Dell Laptop', 340000, 1, 1),
(8, 2, 14, 'USB pendrive', 4500, 2, 1),
(9, 3, 4, 'Eper', 1200, 0.8, 1),
(10, 3, 6, 'Paprika', 890, 1.3, 1),
(11, 3, 12, 'MacBook Air', 520000, 1, 1),
(12, 3, 16, 'Mosószer', 3800, 3, 1);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `alkategoriak`
--
ALTER TABLE `alkategoriak`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alkategoriak_kategoria_id_foreign` (`kategoria_id`),
  ADD KEY `alkategoriak_mennyiseg_tipus_id_foreign` (`mennyiseg_tipus_id`);

--
-- A tábla indexei `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- A tábla indexei `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- A tábla indexei `csoportok`
--
ALTER TABLE `csoportok`
  ADD PRIMARY KEY (`id`),
  ADD KEY `csoportok_csoport_tipus_id_foreign` (`csoport_tipus_id`),
  ADD KEY `csoportok_keszito_felhasznalo_id_foreign` (`keszito_felhasznalo_id`);

--
-- A tábla indexei `csoport_tagsag`
--
ALTER TABLE `csoport_tagsag`
  ADD PRIMARY KEY (`id`),
  ADD KEY `csoport_tagsag_felhasznalo_id_foreign` (`felhasznalo_id`),
  ADD KEY `csoport_tagsag_csoport_id_foreign` (`csoport_id`);

--
-- A tábla indexei `csoport_tipusok`
--
ALTER TABLE `csoport_tipusok`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- A tábla indexei `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- A tábla indexei `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `kategoriak`
--
ALTER TABLE `kategoriak`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `kupon`
--
ALTER TABLE `kupon`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kupon_feltolto_kuponos_id_foreign` (`feltolto_kuponos_id`);

--
-- A tábla indexei `mennyiseg_tipusok`
--
ALTER TABLE `mennyiseg_tipusok`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- A tábla indexei `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- A tábla indexei `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- A tábla indexei `temak`
--
ALTER TABLE `temak`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_tema_id_foreign` (`tema_id`);

--
-- A tábla indexei `veves_lista`
--
ALTER TABLE `veves_lista`
  ADD PRIMARY KEY (`id`),
  ADD KEY `veves_lista_felhasznalo_id_foreign` (`felhasznalo_id`),
  ADD KEY `veves_lista_csoport_id_foreign` (`csoport_id`);

--
-- A tábla indexei `veves_objekt`
--
ALTER TABLE `veves_objekt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `veves_objekt_veves_lista_id_foreign` (`veves_lista_id`),
  ADD KEY `veves_objekt_alkategoria_id_foreign` (`alKategoria_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `alkategoriak`
--
ALTER TABLE `alkategoriak`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT a táblához `csoportok`
--
ALTER TABLE `csoportok`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `csoport_tagsag`
--
ALTER TABLE `csoport_tagsag`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `csoport_tipusok`
--
ALTER TABLE `csoport_tipusok`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `kategoriak`
--
ALTER TABLE `kategoriak`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `kupon`
--
ALTER TABLE `kupon`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `mennyiseg_tipusok`
--
ALTER TABLE `mennyiseg_tipusok`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT a táblához `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `temak`
--
ALTER TABLE `temak`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `veves_lista`
--
ALTER TABLE `veves_lista`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `veves_objekt`
--
ALTER TABLE `veves_objekt`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `alkategoriak`
--
ALTER TABLE `alkategoriak`
  ADD CONSTRAINT `alkategoriak_kategoria_id_foreign` FOREIGN KEY (`kategoria_id`) REFERENCES `kategoriak` (`id`),
  ADD CONSTRAINT `alkategoriak_mennyiseg_tipus_id_foreign` FOREIGN KEY (`mennyiseg_tipus_id`) REFERENCES `mennyiseg_tipusok` (`id`);

--
-- Megkötések a táblához `csoportok`
--
ALTER TABLE `csoportok`
  ADD CONSTRAINT `csoportok_csoport_tipus_id_foreign` FOREIGN KEY (`csoport_tipus_id`) REFERENCES `csoport_tipusok` (`id`),
  ADD CONSTRAINT `csoportok_keszito_felhasznalo_id_foreign` FOREIGN KEY (`keszito_felhasznalo_id`) REFERENCES `users` (`id`);

--
-- Megkötések a táblához `csoport_tagsag`
--
ALTER TABLE `csoport_tagsag`
  ADD CONSTRAINT `csoport_tagsag_csoport_id_foreign` FOREIGN KEY (`csoport_id`) REFERENCES `csoportok` (`id`),
  ADD CONSTRAINT `csoport_tagsag_felhasznalo_id_foreign` FOREIGN KEY (`felhasznalo_id`) REFERENCES `users` (`id`);

--
-- Megkötések a táblához `kupon`
--
ALTER TABLE `kupon`
  ADD CONSTRAINT `kupon_feltolto_kuponos_id_foreign` FOREIGN KEY (`feltolto_kuponos_id`) REFERENCES `users` (`id`);

--
-- Megkötések a táblához `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_tema_id_foreign` FOREIGN KEY (`tema_id`) REFERENCES `temak` (`id`);

--
-- Megkötések a táblához `veves_lista`
--
ALTER TABLE `veves_lista`
  ADD CONSTRAINT `veves_lista_csoport_id_foreign` FOREIGN KEY (`csoport_id`) REFERENCES `csoportok` (`id`),
  ADD CONSTRAINT `veves_lista_felhasznalo_id_foreign` FOREIGN KEY (`felhasznalo_id`) REFERENCES `users` (`id`);

--
-- Megkötések a táblához `veves_objekt`
--
ALTER TABLE `veves_objekt`
  ADD CONSTRAINT `veves_objekt_alkategoria_id_foreign` FOREIGN KEY (`alKategoria_id`) REFERENCES `alkategoriak` (`id`),
  ADD CONSTRAINT `veves_objekt_veves_lista_id_foreign` FOREIGN KEY (`veves_lista_id`) REFERENCES `veves_lista` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
