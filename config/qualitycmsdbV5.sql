-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 10, 2024 at 10:59 PM
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
(8, 'YATTOU DJAZIA', 'YATTOUDJAZIA', '$2b$10$Yz0XBLmnJjcWYSO9//ouW.HV3wgPftDJjRQruMceF.nH/YrraLXru', '0522222222', 'AA240817201652228513', 3),
(10, 'AMLAOUI SANAA', 'AMLAOUISANAA', '$2b$10$ZZtnTsvFAnymdsY7o1QaO.zD9CU5ZEp9u.8VXly0hAhbAIP0.sWIm', '0622222222', 'AA240910125924561731', 5);

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

-- --------------------------------------------------------

--
-- Table structure for table `displayer`
--

CREATE TABLE `displayer` (
  `id` int(11) NOT NULL,
  `code` varchar(255) NOT NULL,
  `username` varchar(55) NOT NULL,
  `password` varchar(255) NOT NULL,
  `zone` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `displayer`
--

INSERT INTO `displayer` (`id`, `code`, `username`, `password`, `zone`) VALUES
(5, 'D240910144319618397', 'Displayer1', '$2b$10$c2l4Utiwg8MtorZ0AKya0uZuPl5PeUUDATeX0AJesp6eUM7rRQxRm', 3),
(7, 'D240910144433348252', 'Displayer2', '$2b$10$HULZWnDV.5YNMOtQEEt28eE54uthGYESSWMT24DGUkGne6CEPZINy', 5);

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
(3, 'WebOS TV', 'F2408122130593213'),
(4, 'Android TV', 'F2408122131087984'),
(5, 'Google TV', 'F2408122139322643'),
(11, 'Normal TV', 'F2409102113577435'),
(12, 'LG TV', 'F2409102114057020'),
(13, 'MiniLED', 'F2409102114137740');

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
(7, 'manager1', '$2b$10$VPA6IE5TYb8ssHni.GEuouG5PQgo8daRPGTiaYFVjWmMJGQkuydn2', '0700000000', 'M240814180153553008', 3);

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

-- --------------------------------------------------------

--
-- Table structure for table `piece`
--

CREATE TABLE `piece` (
  `id` int(11) NOT NULL,
  `name` varchar(55) NOT NULL,
  `code` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
(56, 'LG', 'JGSHDFJHE47853HJ43GJK4', '1001', 5, 3, 'P240910144849836154'),
(57, 'STREAM', 'JGSHDFJSDF54653HJ43GJK4', '1001', 4, 3, 'P240910144915652083'),
(58, 'STREAM', 'ASLDHASKJDHA78643', '1001', 4, 5, 'P240910200321603369'),
(59, 'LG', 'asdasdasd', 'asdas', 4, 3, 'P240910202218425943'),
(60, 'asdsa', 'asdsad', 'asdasdas', 4, 3, 'P240910202230942317');

-- --------------------------------------------------------

--
-- Table structure for table `technician`
--

CREATE TABLE `technician` (
  `id` int(11) NOT NULL,
  `fullname` varchar(55) NOT NULL,
  `code` varchar(55) NOT NULL,
  `zone` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `technician`
--

INSERT INTO `technician` (`id`, `fullname`, `code`, `zone`) VALUES
(14, 'MAZOUNI ZOUHIR', 'T24091013091428656587', 3),
(15, 'ADJROUT AMINE', 'T24091013120672550322', 3),
(16, 'AMAROUCHE BADREDDINE', 'T24091013121523654476', 3),
(19, 'DEGHIME MOHAMED', 'T24091013213446319195', 3),
(20, 'BOUZARESSAIDI SOFIANE', 'T24091013220315004376', 3),
(23, 'BENSENOUCI LAKHDAR', 'T24091021181339598313', 3),
(24, 'MEZAACHE ANIS', 'T24091021182756653581', 3),
(25, 'LARACHI ALI', 'T24091021184238550865', 3);

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
(16, 'U1', 3, 'W2409101447269237'),
(17, 'U2', 3, 'W2409101447334302'),
(19, 'U3', 3, 'W2409102114592343');

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
(5, 'Z2408122147046489', 'BLIDA');

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
-- Indexes for table `displayer`
--
ALTER TABLE `displayer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_displayer_zone` (`zone`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `actioncorrective`
--
ALTER TABLE `actioncorrective`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `agent`
--
ALTER TABLE `agent`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `consommation`
--
ALTER TABLE `consommation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `displayer`
--
ALTER TABLE `displayer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `family`
--
ALTER TABLE `family`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `manager`
--
ALTER TABLE `manager`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `panne`
--
ALTER TABLE `panne`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `piece`
--
ALTER TABLE `piece`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `technician`
--
ALTER TABLE `technician`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `typepanne`
--
ALTER TABLE `typepanne`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `workshop`
--
ALTER TABLE `workshop`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `zone`
--
ALTER TABLE `zone`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

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
-- Constraints for table `displayer`
--
ALTER TABLE `displayer`
  ADD CONSTRAINT `fk_displayer_zone` FOREIGN KEY (`zone`) REFERENCES `zone` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
