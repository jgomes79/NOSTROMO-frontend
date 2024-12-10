import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useWindowScroll } from "react-use";

import classNames from "clsx";
import { motion } from "framer-motion";
import { RiDiscordFill, RiMediumFill, RiTelegramFill, RiTwitterXFill } from "react-icons/ri";

import { LAUNCHPAD_ROUTES } from "@/launchpad/launchpad.constants";
import useResponsive from "@/shared/hooks/useResponsive";
import { WalletAccount } from "@/wallet/components/WalletAccount";

import styles from "./AppBar.module.scss";
import logo from "../../assets/images/logotype.png";
import { Links } from "../../components/Links";

export const AppBar: React.FC = () => {
  const { isMobile } = useResponsive();
  const { y: scrollY } = useWindowScroll();
  const headerHeight = scrollY > 5 ? "70px" : "90px";

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
        {!isMobile && (
          <>
            <nav className={styles.navigator}>
              <NavLink
                to={LAUNCHPAD_ROUTES.MAIN}
                className={({ isActive }) => (isActive ? styles.isActive : undefined)}
              >
                IDO Launchpad
              </NavLink>
              <NavLink to={"/"} className={({ isActive }) => (isActive ? styles.isActive : undefined)}>
                Stake / Farm
              </NavLink>
            </nav>
            <div className={styles.row}>
              <Links
                data={[
                  {
                    path: "https://discord.com",
                    icon: <RiDiscordFill />,
                  },
                  {
                    path: "https://telegram.com",
                    icon: <RiTelegramFill />,
                  },
                  {
                    path: "https://medium.com",
                    icon: <RiMediumFill />,
                  },
                  {
                    path: "https://x.com",
                    icon: <RiTwitterXFill />,
                  },
                ]}
              />
              <WalletAccount />
            </div>
          </>
        )}
      </div>
    </motion.header>
  );
};
