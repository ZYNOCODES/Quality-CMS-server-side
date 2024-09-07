-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 07, 2024 at 08:47 PM
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
(31, 32, 2, '2024-09-06 18:35:32', 'aaa', '', 'ACC240906193532719382'),
(33, 34, 3, '2024-09-06 19:07:11', 'ads', 'asd', 'ACC240906200711717478'),
(34, 35, 3, '2024-09-06 19:11:39', 'Sa', 'S', 'ACC240906201139382092'),
(35, 33, 3, '2024-09-06 19:23:16', 'asd', 'ads', 'ACC240906202316585424'),
(36, 37, 3, '2024-09-06 19:23:45', 'asd', 'asd', 'ACC240906202345469065'),
(37, 36, 3, '2024-09-06 19:24:09', 'asd', 'asd', 'ACC240906202409559675'),
(38, 38, 7, '2024-09-06 19:25:29', 'asdsda', 'asdsda', 'ACC240906202529691449'),
(39, 39, 2, '2024-09-07 17:59:25', 'mesure', 'asd', 'ACC240907185925662624'),
(40, 40, 3, '2024-09-07 18:39:06', 'sdf', 'sdf', 'ACC240907193906768432');

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
(8, 'zino boumrar', 'zino0', '$2b$10$Yz0XBLmnJjcWYSO9//ouW.HV3wgPftDJjRQruMceF.nH/YrraLXru', '0778295267', 'AA240817201652228513', 3),
(9, 'ABDELMOUMEN KHALDI', 'KHALDI26', '$2b$10$2P5L9sXM6OU.sJgk1DuhVea9DhzWkVyGFCmfEIUGZaJ9SVGvoNgO6', '0778295269', 'AA240906192749722560', 3);

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
(27, 32, 3, 'aaa', 'CS240906193535333516'),
(28, 35, 5, 'sad', 'CS240906200553150346'),
(29, 33, 6, 'asd', 'CS240906202320657553'),
(30, 37, 6, 'asd', 'CS240906202349291771'),
(31, 36, 5, 'asd', 'CS240906202413307212'),
(32, 38, 5, 'asdsda', 'CS240906202533344103'),
(33, 34, 5, 'sdf', 'CS240907163201843305'),
(34, 39, 3, 'asd', 'CS240907185930696462'),
(35, 40, 5, 'sdf', 'CS240907193909895683');

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
  `agent` int(11) NOT NULL,
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
  `code` varchar(55) NOT NULL,
  `livraison` tinyint(1) NOT NULL DEFAULT 0,
  `DateLivraison` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `panne`
--

INSERT INTO `panne` (`id`, `product`, `fournisseur`, `sn`, `agent`, `technician`, `workshop`, `panne`, `dateDeclaration`, `ligne`, `dateReparation`, `source`, `etat`, `liberation`, `dateLibiration`, `tempInitial`, `tempFinal`, `dureeDintervention`, `code`, `livraison`, `DateLivraison`) VALUES
(32, 48, 'aa', 'aa', 8, 3, 4, 1, '2024-09-06 18:20:44', 'aa', '2024-09-06 18:35:39', NULL, NULL, 0, NULL, '2024-09-06 18:24:19', '2024-09-06 18:35:39', 680000, 'PN240906192044421084', 1, '2024-09-06 18:35:49'),
(33, 49, 'fff', 'ff', 9, 3, 11, 8, '2024-09-06 18:31:02', 'fff', '2024-09-06 19:23:23', '1111', '2222', 0, NULL, '2024-09-06 19:19:01', '2024-09-06 19:23:23', 262000, 'PN240906193102890349', 1, '2024-09-06 19:24:22'),
(34, 50, 'asdsad', 'asd', 8, 10, 4, 2, '2024-09-06 18:43:40', 'asdas', '2024-09-07 15:32:05', NULL, NULL, 0, NULL, '2024-09-06 18:44:33', '2024-09-07 15:32:05', 74852000, 'PN240906194340293298', 1, '2024-09-07 17:59:50'),
(35, 51, 'asdsa', 'asd', 9, 3, 12, 9, '2024-09-06 18:46:01', 'asdas', '2024-09-06 19:11:42', 'sdadsa', 'asddas', 0, NULL, '2024-09-06 18:47:02', '2024-09-06 19:11:42', 1480000, 'PN240906194601925498', 1, '2024-09-06 19:14:03'),
(36, 52, 'asdasd', 'adsasd', 9, 11, 13, 9, '2024-09-06 19:19:15', 'asdasd', '2024-09-06 19:24:15', NULL, NULL, 0, NULL, '2024-09-06 19:19:39', '2024-09-06 19:24:15', 276000, 'PN240906201915526741', 0, NULL),
(37, 53, 'asddas', 'ads', 9, 3, 7, 2, '2024-09-06 19:23:00', 'asd', '2024-09-06 19:23:52', 'asd', 'asda', 0, NULL, '2024-09-06 19:23:32', '2024-09-06 19:23:52', 20000, 'PN240906202300227112', 0, NULL),
(38, 52, 'asdasd', 'asd', 9, 3, 11, 7, '2024-09-06 19:24:33', 'asdsda', '2024-09-06 19:26:10', 'asddsa', 'asd', 0, NULL, '2024-09-06 19:24:40', '2024-09-06 19:26:10', 90000, 'PN240906202433713072', 0, NULL),
(39, 54, 'sefsef', 'sefsef', 8, 3, 7, 7, '2024-09-07 15:31:10', 'sefse', '2024-09-07 17:59:33', NULL, NULL, 0, NULL, '2024-09-07 15:32:13', '2024-09-07 17:59:33', 8840000, 'PN240907163110902811', 1, '2024-09-07 18:40:57'),
(40, 55, 'sdfdfs', 'dfsdf', 8, 3, 11, 15, '2024-09-07 18:38:35', 'sdfsdf', '2024-09-07 18:39:12', NULL, NULL, 0, NULL, '2024-09-07 18:38:59', '2024-09-07 18:39:12', 13000, 'PN240907193835538330', 0, NULL),
(41, 55, 'sdffds', 'sdf', 8, 3, 4, 9, '2024-09-07 18:38:45', 'sfdsdf', NULL, NULL, NULL, 0, NULL, '2024-09-07 18:39:18', NULL, NULL, 'PN240907193845467322', 0, NULL),
(42, 55, 'sdffds', 'sfdsdf', 8, NULL, 7, 2, '2024-09-07 18:38:55', 'sdfsdf', NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'PN240907193855710261', 0, NULL);

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
(43, 'sdfsdf', 'dsfsdf', 'sdfsdf', 4, 3, 'P240901145020108748'),
(44, 'adsads', 'adasd', 'asdsad', 3, 3, 'P240904204700323492'),
(45, 'qqqqqqqqqqqqqqqqqqq', 'qqqqqqqqqq', 'qqqqqqqq', 3, 3, 'P240904214313568379'),
(46, 'aaaaaaaaaaaa', 'aaaa', 'aa', 4, 3, 'P240904214325138111'),
(47, 'aaa', 'aaa', 'aaa', 3, 3, 'P240904215643444683'),
(48, 'aa', 'aaaaaaaaaaaaaaaaaaaaaaaa', 'aa', 4, 3, 'P240906192044847622'),
(49, 'ffffffffff', 'ffff', 'fff', 5, 3, 'P240906193102951060'),
(50, 'sdaasdasd', 'assdad', 'asdasd', 5, 3, 'P240906194340461104'),
(51, 'adsad', 'asdas', 'dasda', 3, 3, 'P240906194601407381'),
(52, 'asdas', 'asdasd', 'asdasd', 4, 3, 'P240906201915672605'),
(53, 'asdasd', 'dsasda', 'dasdas', 4, 3, 'P240906202300289389'),
(54, 'esdfes', 'sefse', 'fsefse', 4, 3, 'P240907163110412155'),
(55, 'sdfsdf', 'sdfsdf', 'sdfsdf', 3, 3, 'P240907193835141001');

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
  `name` varchar(55) NOT NULL,
  `duree` varchar(55) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `typepanne`
--

INSERT INTO `typepanne` (`id`, `code`, `name`, `duree`) VALUES
(1, 'PT2408211725488099', 'TYPE1', '120'),
(2, 'PT2408211727092607', 'TYPE2', '18000'),
(6, 'PT2408212030495995', 'TYPE3', '172800'),
(7, 'PT2408212031195341', 'TYPE4', '8820'),
(8, 'PT2408212031254323', 'TYPE5', '0'),
(9, 'PT2408212031328369', 'TYPE6', '0'),
(14, 'PT2409071746572516', 'TYPE11', '300'),
(15, 'PT2409071802362293', 'TYPE13', '60'),
(16, 'PT2409071802495798', 'TYPE14', '86400');

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
  ADD KEY `idx_panne_typepanne` (`panne`),
  ADD KEY `idx_panne_agent` (`agent`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `agent`
--
ALTER TABLE `agent`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `consommation`
--
ALTER TABLE `consommation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `piece`
--
ALTER TABLE `piece`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `technician`
--
ALTER TABLE `technician`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `typepanne`
--
ALTER TABLE `typepanne`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

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
  ADD CONSTRAINT `fk_panne_agent` FOREIGN KEY (`agent`) REFERENCES `agent` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
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
