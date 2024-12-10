import React from "react";
import { Link } from "react-router-dom";

import { RiDiscordFill, RiMediumFill, RiTelegramFill, RiTwitterXFill } from "react-icons/ri";

import styles from "./Footer.module.scss";
import logo from "../../assets/images/isotype.png";
import { Links } from "../../components/Links";
import { Typography } from "../../components/Typography";

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.brand}>
        <Typography variant={"heading"} size={"small"}>
          The Company
        </Typography>
        <nav className={styles.links}>
          <Link to={"#"}>
            <Typography variant={"body"} size={"small"}>
              Terms of Service
            </Typography>
          </Link>
          <Link to={"#"}>
            <Typography variant={"body"} size={"small"}>
              Privacy Policy
            </Typography>
          </Link>
          <Link to={"#"}>
            <Typography variant={"body"} size={"small"}>
              Careers
            </Typography>
          </Link>
        </nav>
      </div>
      <div className={styles.logotype}>
        <img src={logo} alt="nostromo" width={120} />
      </div>
      <div className={styles.brand}>
        <Typography>Follow us on</Typography>
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
      </div>
    </footer>
  );
};
