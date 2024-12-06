import React from "react";
import { Link } from "react-router-dom";

import { RiDiscordFill, RiMediumFill, RiTelegramFill, RiTwitterXFill } from "react-icons/ri";

import useResponsive from "@/shared/hooks/useResponsive";
import { WalletAccount } from "@/wallet/components/WalletAccount";

import styles from "./AppBar.module.scss";
import logo from "../../assets/images/logotype.png";
import { Links } from "../../components/Links";
import { Typography } from "../../components/Typography";

export const AppBar: React.FC = () => {
  const { isMobile } = useResponsive();

  return (
    <header className={styles.header}>
      <Typography className={styles.logotype}>
        <img src={logo} alt="nostromo" width={180} />
      </Typography>
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
    </header>
  );
};
