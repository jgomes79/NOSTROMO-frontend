import React from "react";

import styles from "./Banner.module.scss";
import useResponsive from "../../hooks/useResponsive";
import { Button } from "../Button";
import { Typography } from "../Typography";

/**
 * Props for the Banner component.
 */
interface BannerProps {
  /**
   * The title of the banner.
   */
  readonly title: string;

  /**
   * The description of the banner.
   */
  readonly description: string;

  /**
   * The image URL for the banner.
   */
  readonly imageUrl: string;

  /**
   * The button properties for the banner.
   */
  readonly button: {
    /**
     * The caption of the button.
     */
    caption: string;

    /**
     * The icon to be displayed on the button.
     */
    icon: React.ReactNode;
  };
}

/**
 * A Banner component that displays a title, description, and a button.
 *
 * @param {BannerProps} props - The props for the Banner component.
 * @returns {JSX.Element} The rendered Banner component.
 */
export const Banner: React.FC<BannerProps> = ({ title, description, button, imageUrl }) => {
  const { isMobile } = useResponsive();
  return (
    <div className={styles.application} style={{ backgroundImage: `url(${imageUrl})` }}>
      <div className={styles.inner}>
        <div className={styles.column}>
          <Typography
            variant={"heading"}
            size={isMobile ? "medium" : "large"}
            as={"h2"}
            textAlign={isMobile ? "center" : "left"}
          >
            {title}
          </Typography>
          <Typography variant={"heading"} size={isMobile ? "small" : "large"} textAlign={isMobile ? "center" : "left"}>
            {description}
          </Typography>
        </div>
        <Button caption={button.caption} iconRight={button.icon} size={isMobile ? "small" : "large"} />
      </div>
    </div>
  );
};
