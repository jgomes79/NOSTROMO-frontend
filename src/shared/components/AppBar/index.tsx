import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useLockBodyScroll, useWindowScroll } from "react-use";

import classNames from "clsx";
import { motion } from "framer-motion";
import { RiMenuFill } from "react-icons/ri";

import useResponsive from "@/shared/hooks/useResponsive";
import { navigationMenu, socialNetworks } from "@/shared/shared.constants";
import { WalletAccount } from "@/wallet/components/WalletAccount";

import styles from "./AppBar.module.scss";
import logo from "../../assets/images/logotype.png";
import { Links } from "../../components/Links";
import { IconButton } from "../IconButton";
import { MobileMenu } from "../MobileMenu";

export const AppBar: React.FC = () => {
  const { isMobile } = useResponsive();
  const { y: scrollY } = useWindowScroll();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const headerHeight = scrollY > 5 ? "70px" : "90px";

  useLockBodyScroll(isMenuOpen);

  return (
    <motion.header
      className={classNames(styles.header, { [styles.visible]: scrollY > 20 })}
      style={{
        height: headerHeight,
        transition: "height 0.3s ease-in-out",
      }}
    >
      <div className={styles.container}>
        <Link to={"/"}>
          <img src={logo} alt="nostromo" width={140} />
        </Link>

        {isMenuOpen && isMobile && <MobileMenu onClose={() => setIsMenuOpen(false)} />}

        {isMobile && (
          <IconButton
            size={"small"}
            variant={"ghost"}
            icon={<RiMenuFill />}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        )}

        {!isMobile && (
          <>
            <nav className={styles.navigator}>
              {navigationMenu.map(({ title, path }) => (
                <NavLink key={path} to={path} className={({ isActive }) => (isActive ? styles.isActive : undefined)}>
                  {title}
                </NavLink>
              ))}
            </nav>
            <div className={styles.row}>
              <Links data={socialNetworks} />
              <WalletAccount />
            </div>
          </>
        )}
      </div>
    </motion.header>
  );
};
