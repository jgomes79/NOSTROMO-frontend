import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useLockBodyScroll, useWindowScroll } from "react-use";

import classNames from "clsx";
import { motion } from "framer-motion";
import { RiMenuFill } from "react-icons/ri";

import { getRoute } from "@/lib/router";
import useResponsive from "@/shared/hooks/useResponsive";
import { navigationMenu, socialNetworks } from "@/shared/shared.constants";
import { USER_ROUTES } from "@/user/user.constants";
import { WalletAccount } from "@/wallet/components/WalletAccount";
import { useQubicConnect } from "@/wallet/qubic/QubicConnectContext";

import styles from "./AppBar.module.scss";
import isotype from "../../assets/images/isotype.png";
import logo from "../../assets/images/logotype.png";
import { Links } from "../../components/Links";
import { IconButton } from "../IconButton";
import { MobileMenu } from "../MobileMenu";

export const AppBar: React.FC = () => {
  const { isMobile, isTabletVertical } = useResponsive();
  const { wallet } = useQubicConnect();
  const { y: scrollY } = useWindowScroll();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const headerHeight = scrollY > 5 ? "70px" : "90px";

  useLockBodyScroll(isMenuOpen);

  const isMobileOrTabletVertical = isMobile || isTabletVertical;

  /**
   * Combines the base navigation menu with conditional user settings route
   * @remarks
   * This array concatenates the base navigation menu items with an additional
   * "User Settings" route if a wallet account address exists
   * @returns An array of navigation items containing title and path properties
   */
  const navigationItems = [
    ...navigationMenu,
    ...(wallet?.publicKey
      ? [
          {
            title: "User Settings",
            path: getRoute(USER_ROUTES.MAIN),
          },
        ]
      : []),
  ];

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
          <img
            src={isMobileOrTabletVertical ? isotype : logo}
            alt="nostromo"
            width={isMobileOrTabletVertical ? 100 : 140}
          />
        </Link>

        {isMenuOpen && isMobile && <MobileMenu onClose={() => setIsMenuOpen(false)} />}

        {isMobile && (
          <IconButton
            size={"large"}
            variant={"ghost"}
            icon={<RiMenuFill />}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        )}

        {!isMobile && (
          <>
            <nav className={styles.navigator}>
              {navigationItems.map(({ title, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) => {
                    return isActive ? styles.isActive : undefined;
                  }}
                >
                  {title}
                </NavLink>
              ))}
            </nav>
            <div className={styles.row}>
              <Links data={socialNetworks} className={styles.links} />
              <WalletAccount />
            </div>
          </>
        )}
      </div>
    </motion.header>
  );
};
