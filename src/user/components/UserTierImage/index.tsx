import classNames from "clsx";

import { UserTiers } from "@/user/user.types";

import styles from "./UserTierImage.module.scss";
import ChestburstImage from "../../assets/images/chestburst.svg";
import DogImage from "../../assets/images/dog.svg";
import FacehuggerImage from "../../assets/images/facehugger.svg";
import WarriorImage from "../../assets/images/warrior.svg";
import XenomorphImage from "../../assets/images/xenomorph.svg";

/**
 * Props interface for the UserTierImage component
 * @interface UserTierImageProps
 * @property {UserTiers} tier - The user's tier level that determines which image to display
 */
interface UserTierImageProps {
  tier: UserTiers;
  size?: number;
}

/**
 * Component that displays an image based on the user's tier level
 * @component
 * @param {UserTierImageProps} props - Component props
 * @param {UserTiers} props.tier - The user's tier level
 * @returns {JSX.Element} A div containing the appropriate tier image
 */
export const UserTierImage: React.FC<UserTierImageProps> = ({ tier, size = 62 }) => {
  const images = {
    [UserTiers.TIER_0]: <FacehuggerImage />,
    [UserTiers.TIER_1]: <ChestburstImage />,
    [UserTiers.TIER_2]: <DogImage />,
    [UserTiers.TIER_3]: <WarriorImage />,
    [UserTiers.TIER_4]: <XenomorphImage />,
  };

  return (
    <div className={classNames(styles.container, styles[tier])} style={{ width: `${size}px`, height: `${size}px` }}>
      <div className={styles.image}>{images[tier]}</div>
    </div>
  );
};
