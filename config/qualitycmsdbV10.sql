-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 10 oct. 2024 à 15:23
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `qualitycmsdb`
--

-- --------------------------------------------------------

--
-- Structure de la table `action`
--

CREATE TABLE `action` (
  `id` int(11) NOT NULL,
  `name` varchar(55) NOT NULL,
  `code` varchar(55) NOT NULL,
  `duree` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `action`
--

INSERT INTO `action` (`id`, `name`, `code`, `duree`) VALUES
(56, 'Changement Dalle', 'AC0240917185210192222', '1200'),
(57, 'Changement BLU/LED', 'AC1240917185210864701', '1800'),
(58, 'Nettoyage Sheets', 'AC2240917185242115579', '1800'),
(59, 'Ajuster réflecteur', 'AC3240917185242125281', '1800'),
(60, 'Ajuster Sheets', 'AC4240917185242463281', '1800'),
(61, 'Ajuster glass', 'AC5240917185242616184', '1200'),
(62, 'Ajouter une tape', 'AC6240917185242505487', '1200'),
(63, 'Ajuster joint frame', 'AC7240917185242870998', '900'),
(64, 'Changement de la carte graphique', 'AC8240917185242526073', '1200'),
(65, 'RMA (IQC)', 'AC9240917185242871521', '1200'),
(66, 'Nettoyage connecteur/ Nappe FFC', 'AC10240917185242184153', '900'),
(67, 'Réinsertion câbles', 'AC11240917185242144408', '900'),
(68, 'Changement câble LVDS', 'AC12240917185242536260', '900'),
(69, 'Changement nappe FFC', 'AC13240917185242686260', '900'),
(70, 'Accepté (dans les normes)', 'AC14240917185242479889', '300'),
(71, 'Changement Sheets', 'AC15240917185242503270', '1800'),
(72, 'Changement réflecteur', 'AC16240917185242906471', '1800'),
(73, 'Changement diffuseur', 'AC17240917185242737003', '1800'),
(74, 'Changement Carte mère', 'AC18240917185242393683', '1200'),
(75, 'Changement carte alimentation', 'AC19240917185243338287', '1200'),
(76, 'Changement modules WIFI/Bluetooth', 'AC20240917185243414709', '1200'),
(77, 'Changement de la carte WIFI/Bluetooth', 'AC21240917185243827130', '1800'),
(78, 'Correction soudure', 'AC22240917185243290383', '1800'),
(79, 'Elimination CC', 'AC23240917185243511645', '1800'),
(80, 'Nettoyage PCB', 'AC24240917185243795753', '900'),
(81, 'Nettoyage Connecteur', 'AC25240917185243329965', '900'),
(82, 'Changement composant (s)', 'AC26240917185243236210', '1800'),
(83, 'Changement CPU', 'AC27240917185243764039', '3600'),
(84, 'Changement Flash', 'AC28240917185243591243', '3600'),
(85, 'l\'ajout de composant', 'AC29240917185243363791', '1200'),
(86, 'Changement HP', 'AC30240917185243952363', '900'),
(87, 'Changement Cable', 'AC31240917185243295825', '900'),
(88, 'Mise a jours SW', 'AC32240917185243156596', '900'),
(89, 'Update Clé', 'AC33240917185243865204', '600'),
(90, 'Update MAC', 'AC34240917185243630769', '600'),
(91, 'Update plugins', 'AC35240917185243979636', '600'),
(92, 'Update Tools', 'AC36240917185243159786', '1800'),
(93, 'Remise a zéro', 'AC37240917185243119388', '300'),
(94, 'Changement cache', 'AC38240917185243881088', '600'),
(95, 'Arrangement câble (s)', 'AC39240917185243193888', '900'),
(96, 'Réassemblage', 'AC40240917185244642338', '0'),
(97, 'Corrections', 'AC41240917185244716152', '0'),
(98, 'RAS', 'AC42240917185244363242', '600');

-- --------------------------------------------------------

--
-- Structure de la table `actioncorrective`
--

CREATE TABLE `actioncorrective` (
  `id` int(11) NOT NULL,
  `panne` int(11) NOT NULL,
  `action` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `mesure` varchar(55) DEFAULT NULL,
  `resultat` text DEFAULT NULL,
  `code` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `actioncorrective`
--

INSERT INTO `actioncorrective` (`id`, `panne`, `action`, `date`, `mesure`, `resultat`, `code`) VALUES
(100, 125, 65, '2024-10-10 13:43:21', '1', '', 'ACC241010134321281275'),
(101, 124, 68, '2024-10-10 13:55:03', '1', '', 'ACC241010135503448926'),
(102, 127, 67, '2024-10-10 13:55:24', 'A', '', 'ACC241010135524251823'),
(103, 128, 65, '2024-10-10 13:55:44', 'A', '', 'ACC241010135544946410'),
(104, 126, 66, '2024-10-10 13:56:04', 'A', '', 'ACC241010135604734347'),
(105, 131, 64, '2024-10-10 14:16:51', 'q', 'q', 'ACC241010141651956312');

-- --------------------------------------------------------

--
-- Structure de la table `agent`
--

CREATE TABLE `agent` (
  `id` int(11) NOT NULL,
  `fullname` varchar(55) DEFAULT NULL,
  `username` varchar(55) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phoneNumber` varchar(55) NOT NULL,
  `code` varchar(55) NOT NULL,
  `zone` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `agent`
--

INSERT INTO `agent` (`id`, `fullname`, `username`, `password`, `phoneNumber`, `code`, `zone`) VALUES
(12, 'YATTOU DJAZIA', 'YATTOUDJAZIA', '$2b$10$5qKlFqcUm3A3dd5pEIbxZeZ8CBnQIdH5.RNFFlItrVX9n6.nVcz3m', '0522222222', 'AA240917192016522894', 12),
(14, 'AMLAOUI SANAA', 'AMLAOUI', '$2b$10$7qIc0l2yfk/ENYGa8nk.Oe4PNlFt7PJKdbl72q0/T.rGGFWcnRT6i', '0666666666', 'AA240917205241116957', 14);

-- --------------------------------------------------------

--
-- Structure de la table `agent_update_actions`
--

CREATE TABLE `agent_update_actions` (
  `id` int(11) NOT NULL,
  `agent` int(11) NOT NULL,
  `panne` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `agent_update_actions`
--

INSERT INTO `agent_update_actions` (`id`, `agent`, `panne`, `action`, `date`) VALUES
(20, 12, 124, 'Modification des informations de base de la panne', '2024-10-10 11:28:50'),
(21, 12, 124, 'Modification des informations de base de la panne', '2024-10-10 11:34:31');

-- --------------------------------------------------------

--
-- Structure de la table `arrival`
--

CREATE TABLE `arrival` (
  `id` int(11) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `arrival`
--

INSERT INTO `arrival` (`id`, `code`, `name`) VALUES
(5, 'AR0240924232211206985', 'D'),
(6, 'AR1240924232211416464', 'C'),
(7, 'AR2240924232211857832', 'F');

-- --------------------------------------------------------

--
-- Structure de la table `consommation`
--

CREATE TABLE `consommation` (
  `id` int(11) NOT NULL,
  `panne` int(11) NOT NULL,
  `piece` int(11) NOT NULL,
  `quantity` varchar(55) DEFAULT NULL,
  `code` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `consommation`
--

INSERT INTO `consommation` (`id`, `panne`, `piece`, `quantity`, `code`) VALUES
(92, 125, 40, '1', 'CS241010134325309354'),
(93, 124, 40, '2', 'CS241010135508604382'),
(94, 127, 43, 'A', 'CS241010135528906206'),
(95, 128, 42, 'A', 'CS241010135548620711'),
(96, 126, 42, 'A', 'CS241010135607690683'),
(97, 131, 42, 'q', 'CS241010141654641221');

-- --------------------------------------------------------

--
-- Structure de la table `displayer`
--

CREATE TABLE `displayer` (
  `id` int(11) NOT NULL,
  `code` varchar(255) NOT NULL,
  `username` varchar(55) NOT NULL,
  `password` varchar(255) NOT NULL,
  `zone` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `displayer`
--

INSERT INTO `displayer` (`id`, `code`, `username`, `password`, `zone`) VALUES
(9, 'D240917192035250964', 'Displayer1', '$2b$10$3wPiplmSo2Dn/FqtbYLgDOBkIbhRnQuwVhVJ7kvSw.lCbFcU6U5Ge', 12),
(10, 'D240917205439810966', 'Displayer2', '$2b$10$Bh4Yp8rMg539m9gVlDfOVOZafOZq8ftlwHWNvNkHFkyTOxF5MWOHu', 14);

-- --------------------------------------------------------

--
-- Structure de la table `family`
--

CREATE TABLE `family` (
  `id` int(11) NOT NULL,
  `name` varchar(55) NOT NULL,
  `code` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `family`
--

INSERT INTO `family` (`id`, `name`, `code`) VALUES
(14, 'WebOS TV', 'F0240917184714775845'),
(15, 'Android TV', 'F1240917184714900061'),
(16, 'Google TV', 'F2240917184714909822'),
(17, 'Normal TV', 'F3240917184714488960'),
(18, 'LG TV', 'F4240917184714975604'),
(21, 'MiniLED', 'F5240917212130283133');

-- --------------------------------------------------------

--
-- Structure de la table `fournisseur`
--

CREATE TABLE `fournisseur` (
  `id` int(11) NOT NULL,
  `code` varchar(255) NOT NULL,
  `fullname` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `fournisseur`
--

INSERT INTO `fournisseur` (`id`, `code`, `fullname`) VALUES
(2, 'F2409261837408694', 'Expressluck'),
(7, 'F2409281620383307', 'LG'),
(8, 'F2409281620554922', 'LGe'),
(9, 'F2409281621197858', 'TCL');

-- --------------------------------------------------------

--
-- Structure de la table `lot`
--

CREATE TABLE `lot` (
  `id` int(11) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `lot`
--

INSERT INTO `lot` (`id`, `code`, `name`) VALUES
(20, 'L0240928162458217617', '09AL'),
(21, 'L1240928162458150008', '01AL'),
(22, 'L2240928162458250030', '02AL'),
(23, 'L3240928162458237671', '03AL'),
(24, 'L4240928162458199404', '01'),
(25, 'L5240928162458661645', '01DL'),
(26, 'L6240928162458520374', '40'),
(27, 'L7240928162458566314', '01CL'),
(28, 'L8240928162458915394', '38'),
(29, 'L9240928162458422342', '02'),
(30, 'L10240928162458846253', '03'),
(31, 'L11240928162458978421', '04'),
(32, 'L12240928162458728214', '05'),
(33, 'L13240928162458253767', '06'),
(34, 'L14240928162458849962', '07'),
(35, 'L15240928162458313759', '08'),
(36, 'L16240928162458570704', '09'),
(37, 'L17240928162458875746', '10');

-- --------------------------------------------------------

--
-- Structure de la table `manager`
--

CREATE TABLE `manager` (
  `id` int(11) NOT NULL,
  `username` varchar(55) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phoneNumber` varchar(55) NOT NULL,
  `code` varchar(55) NOT NULL,
  `zone` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `manager`
--

INSERT INTO `manager` (`id`, `username`, `password`, `phoneNumber`, `code`, `zone`) VALUES
(8, 'manager1', '$2b$10$PXQXOHD7RioQH6pDdKgMmOI.Q8tnFdEHZfEWIuAjMrxg2NtZTU5v2', '0700000000', 'Mkahdkjasre3829574', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `panne`
--

CREATE TABLE `panne` (
  `id` int(11) NOT NULL,
  `product` int(11) NOT NULL,
  `sn` varchar(255) NOT NULL,
  `arrival` int(11) DEFAULT NULL,
  `fournisseur` int(11) NOT NULL,
  `agent` int(11) NOT NULL,
  `technician` int(11) DEFAULT NULL,
  `workshop` int(11) NOT NULL,
  `dateDeclaration` datetime NOT NULL,
  `ligne` varchar(55) NOT NULL,
  `dateReparation` datetime DEFAULT NULL,
  `source` varchar(55) DEFAULT NULL,
  `etat` varchar(55) DEFAULT NULL,
  `liberation` tinyint(1) NOT NULL DEFAULT 0,
  `tempInitial` datetime DEFAULT NULL,
  `tempFinal` datetime DEFAULT NULL,
  `code` varchar(55) NOT NULL,
  `livraison` tinyint(1) NOT NULL DEFAULT 0,
  `DateLivraison` datetime DEFAULT NULL,
  `reouverture` tinyint(1) DEFAULT 0,
  `isPaused` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `panne`
--

INSERT INTO `panne` (`id`, `product`, `sn`, `arrival`, `fournisseur`, `agent`, `technician`, `workshop`, `dateDeclaration`, `ligne`, `dateReparation`, `source`, `etat`, `liberation`, `tempInitial`, `tempFinal`, `code`, `livraison`, `DateLivraison`, `reouverture`, `isPaused`) VALUES
(124, 170, '21133312', 7, 2, 12, 26, 23, '2024-10-10 11:28:22', '1', '2024-10-10 13:55:12', NULL, NULL, 0, '2024-10-10 13:44:23', '2024-10-10 13:55:12', 'PN241010112822581992', 1, '2024-10-10 13:59:25', 0, 0),
(125, 170, '234234', NULL, 7, 12, 26, 23, '2024-10-10 11:35:01', '1', '2024-10-10 13:43:31', NULL, NULL, 0, '2024-10-10 13:41:47', '2024-10-10 13:43:31', 'PN241010113501343968', 1, '2024-10-10 13:59:25', 0, 0),
(126, 170, '13135', 5, 7, 12, 26, 23, '2024-10-10 13:43:56', '1', '2024-10-10 13:56:11', NULL, NULL, 0, '2024-10-10 13:44:06', '2024-10-10 13:56:11', 'PN241010134356604462', 1, '2024-10-10 13:59:25', 0, 0),
(127, 170, '223', 5, 2, 12, 29, 23, '2024-10-10 13:50:16', '1', '2024-10-10 13:55:33', NULL, NULL, 0, '2024-10-10 13:54:30', '2024-10-10 13:55:33', 'PN241010135016221351', 1, '2024-10-10 13:59:25', 0, 0),
(128, 170, '2222', 6, 8, 12, 27, 23, '2024-10-10 13:52:34', '2', '2024-10-10 13:55:52', NULL, NULL, 0, '2024-10-10 13:54:15', '2024-10-10 13:55:52', 'PN241010135234203184', 1, '2024-10-10 13:59:25', 0, 0),
(129, 170, '231', 6, 7, 12, NULL, 23, '2024-10-10 14:14:25', '1', NULL, NULL, NULL, 0, NULL, NULL, 'PN241010141425737302', 0, NULL, 0, 0),
(130, 170, '213213', 6, 8, 12, 27, 23, '2024-10-10 14:15:59', '1', NULL, NULL, NULL, 0, '2024-10-10 14:16:33', NULL, 'PN241010141559903261', 0, NULL, 0, 0),
(131, 171, '131', 7, 2, 12, 26, 23, '2024-10-10 14:16:19', '2', '2024-10-10 14:16:58', NULL, NULL, 0, '2024-10-10 14:16:25', '2024-10-10 14:16:58', 'PN241010141619857274', 0, NULL, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `pannetypeassignment`
--

CREATE TABLE `pannetypeassignment` (
  `id` int(11) NOT NULL,
  `code` varchar(255) NOT NULL,
  `panne` int(11) NOT NULL,
  `typepanne` int(11) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `pannetypeassignment`
--

INSERT INTO `pannetypeassignment` (`id`, `code`, `panne`, `typepanne`, `date`) VALUES
(97, 'PTP241010112822444685', 124, 99, '2024-10-10 11:28:22'),
(98, 'PTP241010113501441595', 125, 95, '2024-10-10 11:35:01'),
(99, 'PTP241010134356724721', 126, 98, '2024-10-10 13:43:56'),
(100, 'PTP241010135016795171', 127, 95, '2024-10-10 13:50:16'),
(101, 'PTP241010135234469677', 128, 93, '2024-10-10 13:52:34'),
(102, 'PTP241010135234384110', 128, 99, '2024-10-10 13:52:34'),
(103, 'PTP241010135234169385', 128, 101, '2024-10-10 13:52:34'),
(104, 'PTP241010141425876760', 129, 96, '2024-10-10 14:14:25'),
(105, 'PTP241010141559228827', 130, 97, '2024-10-10 14:15:59'),
(106, 'PTP241010141619798001', 131, 94, '2024-10-10 14:16:19'),
(107, 'PTP241010141619331256', 131, 99, '2024-10-10 14:16:19');

-- --------------------------------------------------------

--
-- Structure de la table `piece`
--

CREATE TABLE `piece` (
  `id` int(11) NOT NULL,
  `name` varchar(55) NOT NULL,
  `code` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `piece`
--

INSERT INTO `piece` (`id`, `name`, `code`) VALUES
(31, 'Dalle', 'PC0240917185959428968'),
(32, 'frame dalle', 'PC1240917185959764880'),
(33, 'chassis dalle', 'PC2240917185959905196'),
(34, 'Glass', 'PC3240917185959651564'),
(35, 'Sheets', 'PC4240917185959612751'),
(36, 'BLU/LED BAR', 'PC5240917185959438037'),
(37, 'Diffuseur', 'PC6240917185959544079'),
(38, 'carte graphique', 'PC7240917185959644331'),
(39, 'LVDS', 'PC8240917190000717139'),
(40, 'Nappe FFC', 'PC9240917190000429175'),
(41, 'Carte mère', 'PC10240917190000823094'),
(42, 'carte alimentation', 'PC11240917190000923011'),
(43, 'Module WI-FI/ BL', 'PC12240917190000990351'),
(44, 'IR', 'PC13240917190000341534'),
(45, 'Clavier', 'PC14240917190000586669'),
(46, 'Cable', 'PC15240917190000609989'),
(47, 'Composant', 'PC16240917190000991742'),
(48, 'HP', 'PC17240917190000669435'),
(49, 'Cache HP', 'PC18240917190000435232'),
(50, 'Cache arrière', 'PC19240917190000493355'),
(53, 'Autre', 'PC2409172048566922'),
(54, 'Reflecteur', 'PC2409190847076117');

-- --------------------------------------------------------

--
-- Structure de la table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `marque` varchar(55) NOT NULL,
  `model` varchar(55) NOT NULL,
  `lot` int(11) NOT NULL,
  `tailleLot` int(55) NOT NULL,
  `family` int(11) NOT NULL,
  `zone` int(11) NOT NULL,
  `code` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `product`
--

INSERT INTO `product` (`id`, `marque`, `model`, `lot`, `tailleLot`, `family`, `zone`, `code`) VALUES
(170, 'STREAM', 'FSDF56FSD6', 30, 1000, 16, 12, 'P241010112822813410'),
(171, 'dsfsdfds', 'dsfsdfsd', 31, 10000, 18, 12, 'P241010141021959320');

-- --------------------------------------------------------

--
-- Structure de la table `repairtime`
--

CREATE TABLE `repairtime` (
  `id` int(11) NOT NULL,
  `start` datetime NOT NULL,
  `end` datetime DEFAULT NULL,
  `panne` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `repairtime`
--

INSERT INTO `repairtime` (`id`, `start`, `end`, `panne`) VALUES
(42, '2024-10-10 13:41:47', '2024-10-10 13:43:31', 125),
(43, '2024-10-10 13:44:06', '2024-10-10 13:44:15', 126),
(44, '2024-10-10 13:44:23', '2024-10-10 13:55:12', 124),
(45, '2024-10-10 13:54:15', '2024-10-10 13:55:52', 128),
(46, '2024-10-10 13:54:30', '2024-10-10 13:55:33', 127),
(47, '2024-10-10 13:55:57', '2024-10-10 13:56:11', 126),
(48, '2024-10-10 14:16:25', '2024-10-10 14:16:58', 131),
(49, '2024-10-10 14:16:33', NULL, 130);

-- --------------------------------------------------------

--
-- Structure de la table `technician`
--

CREATE TABLE `technician` (
  `id` int(11) NOT NULL,
  `fullname` varchar(55) NOT NULL,
  `code` varchar(55) NOT NULL,
  `zone` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `technician`
--

INSERT INTO `technician` (`id`, `fullname`, `code`, `zone`) VALUES
(26, 'MAZOUNI ZOUHIR', 'T24091719202852154064', 12),
(27, 'ADJROUT AMINE', 'T24091720532498035408', 12),
(28, 'AMAROUCHE BADREDDINE', 'T24091720533354027972', 12),
(29, 'DEGHIME MOHAMED', 'T24091720534139096966', 12),
(30, 'BOUZARESSAIDI SOFIANE', 'T24091720535069797881', 12),
(31, 'BENSENOUCI LAKHDAR', 'T24091720535921782588', 12),
(32, 'MEZAACHE ANIS', 'T24091720540882910458', 12),
(33, 'LARACHI ALI', 'T24091720541799700591', 12);

-- --------------------------------------------------------

--
-- Structure de la table `typepanne`
--

CREATE TABLE `typepanne` (
  `id` int(11) NOT NULL,
  `code` varchar(55) NOT NULL,
  `name` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `typepanne`
--

INSERT INTO `typepanne` (`id`, `code`, `name`) VALUES
(85, 'PT0240917190201871130', 'Ne démarre pas'),
(86, 'PT1240917190201181489', 'Arrêt après chauffe'),
(87, 'PT2240917190201807454', 'Standby'),
(88, 'PT3240917190201185437', 'Pas d\'affichage (no Picture)'),
(89, 'PT4240917190201706104', 'Retour Standby'),
(90, 'PT5240917190201935704', 'Blocage'),
(91, 'PT6240917190201113914', 'Blocage logo'),
(92, 'PT7240917190201262180', 'Menu'),
(93, 'PT8240917190201256764', 'Reboot'),
(94, 'PT9240917190201403177', 'Bruit du son'),
(95, 'PT10240917190202167133', 'Pas du son'),
(96, 'PT11240917190202689443', 'Ecran noir (BLU)'),
(97, 'PT12240917190202537899', 'Remise a zéro'),
(98, 'PT13240917190202769090', 'SW erroné'),
(99, 'PT14240917190202222274', 'Tools'),
(100, 'PT15240917190202920780', 'Plugins'),
(101, 'PT16240917190202111776', 'clés'),
(102, 'PT17240917190202581842', 'MAC'),
(103, 'PT18240917190202313233', 'Affichage anormal'),
(104, 'PT19240917190202758085', 'Affichage Mosaïque'),
(105, 'PT20240917190202505908', 'Problème de couleur'),
(106, 'PT21240917190202693970', 'Trait Vertical'),
(107, 'PT22240917190202510877', 'Band Vertical'),
(108, 'PT23240917190202975293', 'Trait Horizontal'),
(109, 'PT24240917190202809184', 'Band Horizontal'),
(110, 'PT25240917190202677578', 'Band (trait) H+V'),
(111, 'PT26240917190202925330', 'Demi affichage'),
(112, 'PT27240917190202186096', 'Particule'),
(113, 'PT28240917190202598892', 'Pixel'),
(114, 'PT30240917190202255787', 'Point noir'),
(115, 'PT31240917190202423395', 'Zone contrasté'),
(116, 'PT32240917190202697696', 'Tache sur écran'),
(117, 'PT33240917190202334858', 'Frame/châssis rayé'),
(118, 'PT34240917190202602697', 'Glass rayé'),
(119, 'PT35240917190202986562', 'Glass décollé'),
(120, 'PT36240917190202684271', 'Fuite de lumière'),
(121, 'PT37240917190202912953', 'IR'),
(122, 'PT38240917190203362721', 'Clavier'),
(123, 'PT39240917190203815471', 'Bluetooth'),
(124, 'PT40240917190203647134', 'WI-FI'),
(125, 'PT41240917190203957940', 'WI-FI  .'),
(126, 'PT42240917190203973753', 'Eyes check'),
(127, 'PT43240917190203501771', 'HDMI'),
(128, 'PT44240917190203426125', 'AV'),
(129, 'PT45240917190203602555', 'S-PDIF'),
(130, 'PT46240917190203386555', 'Coaxial'),
(131, 'PT47240917190203781475', 'ATV'),
(132, 'PT50240917190203954212', 'DTV'),
(133, 'PT51240917190203992260', 'DVBS'),
(134, 'PT52240917190203973736', 'Ethernet'),
(135, 'PT53240917190203714303', 'TLC'),
(136, 'PT54240917190203602600', 'PCMCA'),
(137, 'PT55240917190203281989', 'ARC'),
(138, 'PT56240917190203477638', 'USB'),
(139, 'PT57240917190203623253', 'fiche jack'),
(140, 'PT58240917190203995983', 'optique'),
(141, 'PT59240917190203419047', 'tactile'),
(142, 'PT60240917190203873730', 'Problème source inexistant (HDMI, DTV, connexion…)'),
(143, 'PT61240917190203264439', 'Mauvais contact'),
(144, 'PT62240917190203605262', 'logo/sérigraphie'),
(145, 'PT63240917190203218315', 'Emboitement'),
(146, 'PT64240917190203625520', 'Problème d\'assemblage (connectique, cache, vis…etc.)'),
(147, 'PT65240917190204515432', 'Joint frame'),
(153, 'PT2409172048291613', 'Problème de connecteur');

-- --------------------------------------------------------

--
-- Structure de la table `workshop`
--

CREATE TABLE `workshop` (
  `id` int(11) NOT NULL,
  `name` varchar(55) NOT NULL,
  `zone` int(11) NOT NULL,
  `code` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `workshop`
--

INSERT INTO `workshop` (`id`, `name`, `zone`, `code`) VALUES
(23, 'U1', 12, 'W0240917191538176129'),
(24, 'U2', 12, 'W1240917191538351665'),
(28, 'U3', 12, 'W2409172047254873');

-- --------------------------------------------------------

--
-- Structure de la table `zone`
--

CREATE TABLE `zone` (
  `id` int(11) NOT NULL,
  `code` varchar(55) NOT NULL,
  `name` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `zone`
--

INSERT INTO `zone` (`id`, `code`, `name`) VALUES
(12, 'Z0240917191525328015', 'BIRTOUTA'),
(14, 'Z2409172047509859', 'BLIDA');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `action`
--
ALTER TABLE `action`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `actioncorrective`
--
ALTER TABLE `actioncorrective`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_actioncorrective_panne` (`panne`),
  ADD KEY `idx_actioncorrective_action` (`action`);

--
-- Index pour la table `agent`
--
ALTER TABLE `agent`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_agent_zone` (`zone`);

--
-- Index pour la table `agent_update_actions`
--
ALTER TABLE `agent_update_actions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_agentupdateactions_agent` (`agent`),
  ADD KEY `idx_agentupdateactions_panne` (`panne`);

--
-- Index pour la table `arrival`
--
ALTER TABLE `arrival`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `consommation`
--
ALTER TABLE `consommation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_consommation_panne` (`panne`),
  ADD KEY `idx_consommation_piece` (`piece`);

--
-- Index pour la table `displayer`
--
ALTER TABLE `displayer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_displayer_zone` (`zone`);

--
-- Index pour la table `family`
--
ALTER TABLE `family`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `fournisseur`
--
ALTER TABLE `fournisseur`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `lot`
--
ALTER TABLE `lot`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `manager`
--
ALTER TABLE `manager`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_manager_zone` (`zone`);

--
-- Index pour la table `panne`
--
ALTER TABLE `panne`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_panne_product` (`product`),
  ADD KEY `idx_panne_technician` (`technician`),
  ADD KEY `idx_panne_workshop` (`workshop`),
  ADD KEY `idx_panne_dateDeclaration` (`dateDeclaration`),
  ADD KEY `idx_panne_technician_dateReparation` (`technician`,`dateReparation`),
  ADD KEY `idx_panne_dateReparation` (`dateReparation`),
  ADD KEY `idx_panne_agent` (`agent`),
  ADD KEY `idx_panne_fournisseur` (`fournisseur`),
  ADD KEY `idx_panne_arrival` (`arrival`);

--
-- Index pour la table `pannetypeassignment`
--
ALTER TABLE `pannetypeassignment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pannetypeassignment_typepanne` (`typepanne`),
  ADD KEY `idx_pannetypeassignment_panne` (`panne`);

--
-- Index pour la table `piece`
--
ALTER TABLE `piece`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_family` (`family`),
  ADD KEY `idx_product_zone` (`zone`),
  ADD KEY `idx_product_lot` (`lot`);

--
-- Index pour la table `repairtime`
--
ALTER TABLE `repairtime`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_repairtime_panne` (`panne`);

--
-- Index pour la table `technician`
--
ALTER TABLE `technician`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_technician_zone` (`zone`);

--
-- Index pour la table `typepanne`
--
ALTER TABLE `typepanne`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `workshop`
--
ALTER TABLE `workshop`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_workshop_zone` (`zone`);

--
-- Index pour la table `zone`
--
ALTER TABLE `zone`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `action`
--
ALTER TABLE `action`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT pour la table `actioncorrective`
--
ALTER TABLE `actioncorrective`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT pour la table `agent`
--
ALTER TABLE `agent`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `agent_update_actions`
--
ALTER TABLE `agent_update_actions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT pour la table `arrival`
--
ALTER TABLE `arrival`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `consommation`
--
ALTER TABLE `consommation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT pour la table `displayer`
--
ALTER TABLE `displayer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `family`
--
ALTER TABLE `family`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT pour la table `fournisseur`
--
ALTER TABLE `fournisseur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `lot`
--
ALTER TABLE `lot`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT pour la table `manager`
--
ALTER TABLE `manager`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `panne`
--
ALTER TABLE `panne`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=132;

--
-- AUTO_INCREMENT pour la table `pannetypeassignment`
--
ALTER TABLE `pannetypeassignment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT pour la table `piece`
--
ALTER TABLE `piece`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT pour la table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=172;

--
-- AUTO_INCREMENT pour la table `repairtime`
--
ALTER TABLE `repairtime`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT pour la table `technician`
--
ALTER TABLE `technician`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT pour la table `typepanne`
--
ALTER TABLE `typepanne`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=154;

--
-- AUTO_INCREMENT pour la table `workshop`
--
ALTER TABLE `workshop`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT pour la table `zone`
--
ALTER TABLE `zone`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `actioncorrective`
--
ALTER TABLE `actioncorrective`
  ADD CONSTRAINT `fk_actioncorrective_action` FOREIGN KEY (`action`) REFERENCES `action` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_actioncorrective_panne` FOREIGN KEY (`panne`) REFERENCES `panne` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `agent`
--
ALTER TABLE `agent`
  ADD CONSTRAINT `idx_agent_zone` FOREIGN KEY (`zone`) REFERENCES `zone` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `agent_update_actions`
--
ALTER TABLE `agent_update_actions`
  ADD CONSTRAINT `fk_agentupdateactions_agent` FOREIGN KEY (`agent`) REFERENCES `agent` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_agentupdateactions_panne` FOREIGN KEY (`panne`) REFERENCES `panne` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `consommation`
--
ALTER TABLE `consommation`
  ADD CONSTRAINT `fk_consommation_action` FOREIGN KEY (`piece`) REFERENCES `piece` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_consommation_panne` FOREIGN KEY (`panne`) REFERENCES `panne` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `displayer`
--
ALTER TABLE `displayer`
  ADD CONSTRAINT `fk_displayer_zone` FOREIGN KEY (`zone`) REFERENCES `zone` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `manager`
--
ALTER TABLE `manager`
  ADD CONSTRAINT `idx_manager_zone` FOREIGN KEY (`zone`) REFERENCES `zone` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `panne`
--
ALTER TABLE `panne`
  ADD CONSTRAINT `fk_panne_agent` FOREIGN KEY (`agent`) REFERENCES `agent` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_panne_arrival` FOREIGN KEY (`arrival`) REFERENCES `arrival` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_panne_fournisseur` FOREIGN KEY (`fournisseur`) REFERENCES `fournisseur` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `idx_panne_product` FOREIGN KEY (`product`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `idx_panne_technician` FOREIGN KEY (`technician`) REFERENCES `technician` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `idx_panne_workshop` FOREIGN KEY (`workshop`) REFERENCES `workshop` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `pannetypeassignment`
--
ALTER TABLE `pannetypeassignment`
  ADD CONSTRAINT `fk_pannetypeassignment_panne` FOREIGN KEY (`panne`) REFERENCES `panne` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pannetypeassignment_typepanne` FOREIGN KEY (`typepanne`) REFERENCES `typepanne` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `fk_product_lot` FOREIGN KEY (`lot`) REFERENCES `lot` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `idx_product_family` FOREIGN KEY (`family`) REFERENCES `family` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `idx_product_zone` FOREIGN KEY (`zone`) REFERENCES `zone` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `repairtime`
--
ALTER TABLE `repairtime`
  ADD CONSTRAINT `fk_repairtime_panne` FOREIGN KEY (`panne`) REFERENCES `panne` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `technician`
--
ALTER TABLE `technician`
  ADD CONSTRAINT `idx_technician_zone` FOREIGN KEY (`zone`) REFERENCES `zone` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `workshop`
--
ALTER TABLE `workshop`
  ADD CONSTRAINT `idx_workshop_zone` FOREIGN KEY (`zone`) REFERENCES `zone` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
