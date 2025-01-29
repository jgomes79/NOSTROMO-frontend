import classNames from "clsx";

import { Tiers } from "@/tier/tier.types";

import styles from "./TierImage.module.scss";
import ChestburstImage from "../../assets/images/chestburst.svg";
import DogImage from "../../assets/images/dog.svg";
import FacehuggerImage from "../../assets/images/facehugger.svg";
import WarriorImage from "../../assets/images/warrior.svg";
import XenomorphImage from "../../assets/images/xenomorph.svg";

/**
 * Interface for the TierImage component props
 * @interface TierImageProps
 * @property {Tiers} [tier] - The tier level that determines which image to display
 * @property {number} [size=62] - The size of the image container in pixels
 */
interface TierImageProps {
  tier?: Tiers;
  size?: number;
}

/**
 * Displays an image corresponding to a specific tier level
 * @component
 * @param {TierImageProps} props - Component properties
 * @param {Tiers} [props.tier] - The tier level to display
 * @param {number} [props.size=62] - The dimensions of the image container in pixels
 * @returns {JSX.Element | null} A container with the tier image, or null if no tier is specified
 *
 * @example
 * ```tsx
 * <TierImage tier={Tiers.TIER_FACEHUGGER} size={80} />
 * ```
 */
export const TierImage: React.FC<TierImageProps> = ({ tier, size = 62 }) => {
  if (!tier) return null;

  const images = {
    [Tiers.TIER_NONE]: null,
    [Tiers.TIER_FACEHUGGER]: <FacehuggerImage />,
    [Tiers.TIER_CHESTBURST]: <ChestburstImage />,
    [Tiers.TIER_DOG]: <DogImage />,
    [Tiers.TIER_XENOMORPH]: <WarriorImage />,
    [Tiers.TIER_WARRIOR]: <XenomorphImage />,
  };

  return (
    <div
      className={classNames(styles.container, styles[`tier_${tier}`])}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <div className={styles.image}>{images[tier]}</div>
    </div>
  );
};
