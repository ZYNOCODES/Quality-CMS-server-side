-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 01, 2024 at 03:54 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `qualitycmsdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `action`
--

CREATE TABLE `action` (
  `id` int(11) NOT NULL,
  `name` varchar(55) NOT NULL,
  `code` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `action`
--

INSERT INTO `action` (`id`, `name`, `code`) VALUES
(2, 'PDR', 'AC2408122141091701'),
(3, 'FGT', 'AC2408122141294944'),
(7, 'DWJ', 'AC2408171718555219'),
(9, 'AXC', 'AC2408171723071862');

-- --------------------------------------------------------

--
-- Table structure for table `actioncorrective`
--

CREATE TABLE `actioncorrective` (
  `id` int(11) NOT NULL,
  `panne` int(11) NOT NULL,
  `action` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `mesure` varchar(55) DEFAULT NULL,
  `resultat` text DEFAULT NULL,
  `code` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `actioncorrective`
--

INSERT INTO `actioncorrective` (`id`, `panne`, `action`, `date`, `mesure`, `resultat`, `code`) VALUES
(14, 16, 2, '2024-08-21 17:11:23', 'mesure', '', 'ACC240821181123641699'),
(15, 16, 3, '2024-08-21 17:11:48', 'mesure 3', '', 'ACC240821181148380315'),
(16, 16, 9, '2024-08-21 17:12:26', 'mesure 4', 'resultat 4', 'ACC240821181226270254'),
(17, 17, 2, '2024-08-21 17:29:55', 'mesure', '', 'ACC240821182955355918'),
(18, 18, 7, '2024-08-21 17:40:17', 'mesure', '', 'ACC240821184017608635'),
(19, 19, 9, '2024-08-21 17:41:04', 'mesure', 'resultat', 'ACC240821184104321182'),
(20, 20, 2, '2024-08-21 18:04:37', 'mesure', '', 'ACC240821190437134031'),
(21, 21, 7, '2024-08-21 18:43:39', 'mesure', '', 'ACC240821194339299876'),
(22, 22, 2, '2024-08-21 18:46:01', 'mesure', '', 'ACC240821194601720935'),
(23, 23, 2, '2024-08-21 19:42:01', 'mesure', '', 'ACC240821204201214617'),
(24, 23, 9, '2024-08-21 19:42:09', 'mesure', 'resultat 4', 'ACC240821204209582749'),
(25, 24, 3, '2024-08-21 19:50:05', 'ASAS', 'ASAS', 'ACC240821205005548056'),
(26, 25, 2, '2024-09-01 13:48:59', 'mesure', '', 'ACC240901144859486076'),
(27, 26, 3, '2024-09-01 13:50:35', 'asdasd', '', 'ACC240901145035792183'),
(28, 27, 9, '2024-09-01 13:51:02', '', 'fsdfs', 'ACC240901145102950343');

-- --------------------------------------------------------

--
-- Table structure for table `agent`
--

CREATE TABLE `agent` (
  `id` int(11) NOT NULL,
  `fullname` varchar(55) DEFAULT NULL,
  `username` varchar(55) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phoneNumber` varchar(55) NOT NULL,
  `code` varchar(55) NOT NULL,
  `zone` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `agent`
--

INSERT INTO `agent` (`id`, `fullname`, `username`, `password`, `phoneNumber`, `code`, `zone`) VALUES
(8, 'zino boumrar', 'zino0', '$2b$10$Yz0XBLmnJjcWYSO9//ouW.HV3wgPftDJjRQruMceF.nH/YrraLXru', '0778295267', 'AA240817201652228513', 3);

-- --------------------------------------------------------

--
-- Table structure for table `consommation`
--

CREATE TABLE `consommation` (
  `id` int(11) NOT NULL,
  `panne` int(11) NOT NULL,
  `piece` int(11) NOT NULL,
  `quantity` varchar(55) DEFAULT NULL,
  `code` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `consommation`
--

INSERT INTO `consommation` (`id`, `panne`, `piece`, `quantity`, `code`) VALUES
(12, 16, 5, '10', 'CS240821181130740817'),
(13, 16, 6, '22', 'CS240821181137244699'),
(14, 17, 3, '10', 'CS240821183005818864'),
(15, 18, 5, '1', 'CS240821184024699224'),
(16, 19, 8, '2', 'CS240821184112850361'),
(17, 20, 6, '3', 'CS240821190442153322'),
(18, 21, 5, '56', 'CS240821194344923516'),
(19, 22, 3, '1', 'CS240821194607116458'),
(20, 23, 3, '111', 'CS240821204214279395'),
(21, 24, 3, 'ASAS', 'CS240821205009896355'),
(22, 25, 3, '10', 'CS240901144903744926'),
(23, 26, 6, '22', 'CS240901145041457058'),
(24, 27, 8, '56', 'CS240901145107227115');

-- --------------------------------------------------------

--
-- Table structure for table `family`
--

CREATE TABLE `family` (
  `id` int(11) NOT NULL,
  `name` varchar(55) NOT NULL,
  `code` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `family`
--

INSERT INTO `family` (`id`, `name`, `code`) VALUES
(3, 'OS', 'F2408122130593213'),
(4, 'ANDROID', 'F2408122131087984'),
(5, 'TVSMART', 'F2408122139322643'),
(7, 'SSD', 'F2408172046331245'),
(8, 'HDD', 'F2408172046421752');

-- --------------------------------------------------------

--
-- Table structure for table `manager`
--

CREATE TABLE `manager` (
  `id` int(11) NOT NULL,
  `username` varchar(55) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phoneNumber` varchar(55) NOT NULL,
  `code` varchar(55) NOT NULL,
  `zone` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `manager`
--

INSERT INTO `manager` (`id`, `username`, `password`, `phoneNumber`, `code`, `zone`) VALUES
(5, 'manager', '$2b$10$VPA6IE5TYb8ssHni.GEuouG5PQgo8daRPGTiaYFVjWmMJGQkuydn2', '0778295266', 'M240814180153553008', 3);

-- --------------------------------------------------------

--
-- Table structure for table `panne`
--

CREATE TABLE `panne` (
  `id` int(11) NOT NULL,
  `product` int(11) NOT NULL,
  `fournisseur` varchar(55) NOT NULL,
  `sn` varchar(55) NOT NULL,
  `technician` int(11) DEFAULT NULL,
  `workshop` int(11) NOT NULL,
  `panne` int(11) NOT NULL,
  `dateDeclaration` datetime NOT NULL,
  `ligne` varchar(55) NOT NULL,
  `dateReparation` datetime DEFAULT NULL,
  `source` varchar(55) DEFAULT NULL,
  `etat` varchar(55) DEFAULT NULL,
  `liberation` tinyint(1) NOT NULL DEFAULT 0,
  `dateLibiration` datetime DEFAULT NULL,
  `tempInitial` datetime DEFAULT NULL,
  `tempFinal` datetime DEFAULT NULL,
  `dureeDintervention` int(11) DEFAULT NULL,
  `code` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `panne`
--

INSERT INTO `panne` (`id`, `product`, `fournisseur`, `sn`, `technician`, `workshop`, `panne`, `dateDeclaration`, `ligne`, `dateReparation`, `source`, `etat`, `liberation`, `dateLibiration`, `tempInitial`, `tempFinal`, `dureeDintervention`, `code`) VALUES
(16, 33, 'ZYNOCODES', 'SN1', 3, 4, 1, '2024-08-21 16:43:29', 'A', '2024-08-21 17:12:33', 'souce1', 'etat1', 1, '2024-08-22 00:00:00', '2024-08-21 16:48:31', '2024-08-21 17:12:33', 1442000, 'PN240821174329792097'),
(17, 34, 'ZYNOCODES', 'SN1', 3, 7, 1, '2024-08-21 17:01:36', 'A', '2024-08-21 17:35:05', 'souce22', NULL, 0, NULL, '2024-08-21 17:12:39', '2024-08-21 17:35:05', 1346000, 'PN240821180136340270'),
(18, 35, 'ZYNOCODES', 'SN1', 3, 4, 1, '2024-08-21 17:02:08', 'A', '2024-08-21 17:40:27', NULL, NULL, 0, NULL, '2024-08-21 17:35:10', '2024-08-21 17:40:27', 317000, 'PN240821180208623217'),
(19, 34, 'ZYNOCODES', 'SN1', 10, 4, 2, '2024-08-21 17:02:46', 'B', '2024-08-21 17:41:14', NULL, NULL, 1, '2024-08-21 00:00:00', '2024-08-21 17:35:46', '2024-08-21 17:41:14', 328000, 'PN240821180246239169'),
(20, 36, 'ZYNOCODES', 'SN2', 3, 11, 1, '2024-08-21 17:04:13', 'C', '2024-08-21 18:04:47', NULL, NULL, 0, NULL, '2024-08-21 17:40:32', '2024-08-21 18:04:47', 1455000, 'PN240821180413764813'),
(21, 37, 'ZYNOCODES', 'SN2', 10, 7, 2, '2024-08-21 18:03:17', 'C', '2024-08-21 18:43:50', NULL, NULL, 0, NULL, '2024-08-21 18:04:18', '2024-08-21 18:43:50', 2372000, 'PN240821190317417179'),
(22, 38, 'ZYNOCODES', 'SN3', 11, 4, 1, '2024-08-21 18:44:50', 'B', '2024-08-21 18:46:13', NULL, NULL, 0, NULL, '2024-08-21 18:45:54', '2024-08-21 18:46:13', 19000, 'PN240821194450716377'),
(23, 39, 'ZYNOCODES', 'SN5', 3, 4, 8, '2024-08-21 19:33:13', 'B', '2024-08-21 19:42:18', 'souce1', NULL, 1, '2024-08-21 00:00:00', '2024-08-21 19:34:04', '2024-08-21 19:42:18', 494000, 'PN240821203313665009'),
(24, 40, 'ZYNOCODES', 'SN', 3, 7, 9, '2024-08-21 19:33:46', 'A', '2024-08-21 19:50:43', 'souce1', '2222', 1, '2024-08-22 00:00:00', '2024-08-21 19:42:22', '2024-08-21 19:50:43', 501000, 'PN240821203346848046'),
(25, 41, 'ZYNOCODES', 'SN', 3, 7, 9, '2024-08-21 19:49:07', 'A', '2024-09-01 13:49:06', NULL, NULL, 0, NULL, '2024-08-21 19:50:55', '2024-09-01 13:49:06', 928691000, 'PN240821204907958448'),
(26, 42, 'sdfsd', 'sdfds', 11, 4, 1, '2024-09-01 13:50:08', 'sdf', '2024-09-01 13:50:44', NULL, NULL, 0, NULL, '2024-09-01 13:50:29', '2024-09-01 13:50:44', 15000, 'PN240901145008418605'),
(27, 43, 'sdfsd', 'sdfdsf', 11, 7, 2, '2024-09-01 13:50:20', 'fdsfs', '2024-09-01 13:51:11', NULL, NULL, 0, NULL, '2024-09-01 13:50:50', '2024-09-01 13:51:11', 21000, 'PN240901145020833755');

-- --------------------------------------------------------

--
-- Table structure for table `piece`
--

CREATE TABLE `piece` (
  `id` int(11) NOT NULL,
  `name` varchar(55) NOT NULL,
  `code` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `piece`
--

INSERT INTO `piece` (`id`, `name`, `code`) VALUES
(3, 'PIECE1', 'PC2408122145038235'),
(5, 'PIECE3', 'PC2408122145094635'),
(6, 'PIECE4', 'PC2408122145123410'),
(8, 'PIECE5', 'PC2408171719361862');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `marque` varchar(55) NOT NULL,
  `model` varchar(55) NOT NULL,
  `lot` varchar(55) NOT NULL,
  `family` int(55) DEFAULT NULL,
  `zone` int(11) DEFAULT NULL,
  `code` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `marque`, `model`, `lot`, `family`, `zone`, `code`) VALUES
(33, 'STREAM', 'FDKJSAHGFKJSE7834', '1001L', 3, 3, 'P240821174329776550'),
(34, 'LG', 'KSDJHFKJEWSR8734', '1001L', 4, 3, 'P240821180136907294'),
(35, 'LG', 'LASDGHAKJDF78A3', '1002L', 3, 3, 'P240821180208492864'),
(36, 'STREAM', 'SDFGHSKLJ78435SDF', '1002L', 5, 3, 'P240821180413484834'),
(37, 'STREAM', 'SDAFSDKUJF8943', '1001L', 5, 3, 'P240821190317134799'),
(38, 'LG', 'SDFSKDLJF98435HTY643', '101l', 4, 3, 'P240821194450108535'),
(39, 'STREAM', 'DSFLH47893GHFIU43', '1001L', 4, 3, 'P240821203313160982'),
(40, 'LG', 'SADASDVASD238946982WEV', '1002L', 3, 3, 'P240821203346219289'),
(41, 'STREAM', 'SDFISUOLV KHN475983', '1001L', 3, 3, 'P240821204907359009'),
(42, 'dsdfsdfsd', 'sdfdsfsdfsd', 'dsfsd', 3, 3, 'P240901145008576657'),
(43, 'sdfsdf', 'dsfsdf', 'sdfsdf', 4, 3, 'P240901145020108748');

-- --------------------------------------------------------

--
-- Table structure for table `technician`
--

CREATE TABLE `technician` (
  `id` int(11) NOT NULL,
  `username` varchar(55) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullname` varchar(55) DEFAULT NULL,
  `phoneNumber` varchar(55) NOT NULL,
  `code` varchar(55) NOT NULL,
  `zone` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `technician`
--

INSERT INTO `technician` (`id`, `username`, `password`, `fullname`, `phoneNumber`, `code`, `zone`) VALUES
(3, 'zineeddineBoumrar', '$2b$10$utaiWZK6vCQxerIcvFlEOO5nBC..C4cO7Fh626raLoesMlxRh19.m', 'Zineeddine boumrar', '0778295268', 'T240814180116958352', 3),
(10, 'abdallahDekkiche1', '$2b$10$TibwfVNCZlvkbJOBHoKrPumgZrss3BXuUkttVMPG2Cgw4SoZYDVla', 'Abddallah Dekkiche', '0778295278', 'T240817195306453575', 3),
(11, 'MohamedMehani', '$2b$10$z.WZgCYCXOap7q32N3gGYuI2Oc/9qLB7yhYd8OEh.enR7ipwOOrS2', 'Mohamed mehani', '0778295288', 'T240817195706654107', 3),
(12, 'Hamza', '$2b$10$4qSZSPCFhs2Dj0smamvwqOX1pGorcehrqDQfhFJf6i7VySPkbCjs2', 'Hamza ', '0778295298', 'T240817201228757355', 5);

-- --------------------------------------------------------

--
-- Table structure for table `typepanne`
--

CREATE TABLE `typepanne` (
  `id` int(11) NOT NULL,
  `code` varchar(55) NOT NULL,
  `name` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `typepanne`
--

INSERT INTO `typepanne` (`id`, `code`, `name`) VALUES
(1, 'PT2408211725488099', 'TYPE1'),
(2, 'PT2408211727092607', 'TYPE2'),
(6, 'PT2408212030495995', 'TYPE3'),
(7, 'PT2408212031195341', 'TYPE4'),
(8, 'PT2408212031254323', 'TYPE5'),
(9, 'PT2408212031328369', 'TYPE6');

-- --------------------------------------------------------

--
-- Table structure for table `workshop`
--

CREATE TABLE `workshop` (
  `id` int(11) NOT NULL,
  `name` varchar(55) NOT NULL,
  `zone` int(11) NOT NULL,
  `code` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `workshop`
--

INSERT INTO `workshop` (`id`, `name`, `zone`, `code`) VALUES
(4, 'U1', 3, 'W2408122149504431'),
(6, 'U1', 5, 'W2408122151041467'),
(7, 'U2', 3, 'W2408122152409113'),
(8, 'U2', 5, 'W2408161718054254'),
(11, 'U4', 3, 'W2408161724208287'),
(12, 'U5', 3, 'W2408161724484010'),
(13, 'U6', 3, 'W2408161725225114'),
(14, 'U4', 5, 'W2408161726511561');

-- --------------------------------------------------------

--
-- Table structure for table `zone`
--

CREATE TABLE `zone` (
  `id` int(11) NOT NULL,
  `code` varchar(55) NOT NULL,
  `name` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `zone`
--

INSERT INTO `zone` (`id`, `code`, `name`) VALUES
(3, 'Z2408122146157750', 'BIRTOUTA'),
(5, 'Z2408122147046489', 'BLIDA'),
(7, 'Z2408172025506895', 'MEDEA');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `action`
--
ALTER TABLE `action`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `actioncorrective`
--
ALTER TABLE `actioncorrective`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_actioncorrective_panne` (`panne`),
  ADD KEY `idx_actioncorrective_action` (`action`);

--
-- Indexes for table `agent`
--
ALTER TABLE `agent`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_agent_zone` (`zone`);

--
-- Indexes for table `consommation`
--
ALTER TABLE `consommation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_consommation_panne` (`panne`),
  ADD KEY `idx_consommation_piece` (`piece`);

--
-- Indexes for table `family`
--
ALTER TABLE `family`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `manager`
--
ALTER TABLE `manager`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_manager_zone` (`zone`);

--
-- Indexes for table `panne`
--
ALTER TABLE `panne`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_panne_product` (`product`),
  ADD KEY `idx_panne_technician` (`technician`),
  ADD KEY `idx_panne_workshop` (`workshop`),
  ADD KEY `idx_panne_dateDeclaration` (`dateDeclaration`),
  ADD KEY `idx_panne_technician_dateReparation` (`technician`,`dateReparation`),
  ADD KEY `idx_panne_dateReparation` (`dateReparation`),
  ADD KEY `idx_panne_dureeDintervention` (`dureeDintervention`),
  ADD KEY `idx_panne_typepanne` (`panne`);

--
-- Indexes for table `piece`
--
ALTER TABLE `piece`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_family` (`family`),
  ADD KEY `idx_product_zone` (`zone`);

--
-- Indexes for table `technician`
--
ALTER TABLE `technician`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_technician_zone` (`zone`);

--
-- Indexes for table `typepanne`
--
ALTER TABLE `typepanne`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `workshop`
--
ALTER TABLE `workshop`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_workshop_zone` (`zone`);

--
-- Indexes for table `zone`
--
ALTER TABLE `zone`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `action`
--
ALTER TABLE `action`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `actioncorrective`
--
ALTER TABLE `actioncorrective`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `agent`
--
ALTER TABLE `agent`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `consommation`
--
ALTER TABLE `consommation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `family`
--
ALTER TABLE `family`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `manager`
--
ALTER TABLE `manager`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `panne`
--
ALTER TABLE `panne`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `piece`
--
ALTER TABLE `piece`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `technician`
--
ALTER TABLE `technician`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `typepanne`
--
ALTER TABLE `typepanne`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `workshop`
--
ALTER TABLE `workshop`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `zone`
--
ALTER TABLE `zone`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `actioncorrective`
--
ALTER TABLE `actioncorrective`
  ADD CONSTRAINT `fk_actioncorrective_action` FOREIGN KEY (`action`) REFERENCES `action` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_actioncorrective_panne` FOREIGN KEY (`panne`) REFERENCES `panne` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `agent`
--
ALTER TABLE `agent`
  ADD CONSTRAINT `idx_agent_zone` FOREIGN KEY (`zone`) REFERENCES `zone` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `consommation`
--
ALTER TABLE `consommation`
  ADD CONSTRAINT `fk_consommation_action` FOREIGN KEY (`piece`) REFERENCES `piece` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_consommation_panne` FOREIGN KEY (`panne`) REFERENCES `panne` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `manager`
--
ALTER TABLE `manager`
  ADD CONSTRAINT `idx_manager_zone` FOREIGN KEY (`zone`) REFERENCES `zone` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `panne`
--
ALTER TABLE `panne`
  ADD CONSTRAINT `fk_panne_typepanne` FOREIGN KEY (`panne`) REFERENCES `typepanne` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `idx_panne_product` FOREIGN KEY (`product`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `idx_panne_technician` FOREIGN KEY (`technician`) REFERENCES `technician` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `idx_panne_workshop` FOREIGN KEY (`workshop`) REFERENCES `workshop` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `idx_product_family` FOREIGN KEY (`family`) REFERENCES `family` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `idx_product_zone` FOREIGN KEY (`zone`) REFERENCES `zone` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `technician`
--
ALTER TABLE `technician`
  ADD CONSTRAINT `idx_technician_zone` FOREIGN KEY (`zone`) REFERENCES `zone` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `workshop`
--
ALTER TABLE `workshop`
  ADD CONSTRAINT `idx_workshop_zone` FOREIGN KEY (`zone`) REFERENCES `zone` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
