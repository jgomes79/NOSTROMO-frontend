import React from "react";
import { Link } from "react-router-dom";
import { useWindowScroll } from "react-use";

import classNames from "clsx";
import { motion } from "framer-motion";
import { RiDiscordFill, RiMediumFill, RiTelegramFill, RiTwitterXFill } from "react-icons/ri";

import useResponsive from "@/shared/hooks/useResponsive";
import { WalletAccount } from "@/wallet/components/WalletAccount";

import styles from "./AppBar.module.scss";
import logo from "../../assets/images/logotype.png";
import { Links } from "../../components/Links";

export const AppBar: React.FC = () => {
  const { isMobile } = useResponsive();
  const { y: scrollY } = useWindowScroll();
  const headerHeight = scrollY > 20 ? "70px" : "90px";

  return (
    <motion.header
      className={classNames(styles.header, { [styles.visible]: scrollY > 20 })}
      style={{
        height: headerHeight,
        transition: "height 0.3s ease-in-out",
      }}
    >
      <div className={styles.container}>
        <img src={logo} alt="nostromo" width={140} />
        {!isMobile && (
          <>
            <nav className={styles.navigator}>
              <Link to={"/"}>IDO Launchpad</Link>
              <Link to={"/"}>Stake / Farm</Link>
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
