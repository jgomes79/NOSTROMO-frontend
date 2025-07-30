import React from "react";

import classNames from "clsx";

import { formatPrice } from "@/lib/number";
import { Button } from "@/shared/components/Button";
import { Fieldset } from "@/shared/components/Fieldset";
import { Skeleton } from "@/shared/components/Skeleton";
import { Typography } from "@/shared/components/Typography";
import useResponsive from "@/shared/hooks/useResponsive";

import styles from "./TierSelector.module.scss";
import { Tier, Tiers, TiersDataArray } from "../../tier.types";
import { TierImage } from "../TierImage";

/**
 * Props interface for the TierSelector component
 * @interface TierSelectorProps
 * @property {boolean} isLoading - Flag indicating whether the component is in a loading state
 * @property {() => void} onSelectTier - Callback function triggered when a tier is selected
 */
interface TierSelectorProps {
  readonly currentTierId?: Tier["id"];
  readonly isLoading?: boolean;
  readonly onSelectTier: (tier: Tier) => void;
}

/**
 * TierSelector component displays a list of available tiers with upgrade options
 * @component
 * @param {TierSelectorProps} props - Component props
 * @returns {React.ReactElement} Rendered TierSelector component
 */
export const TierSelector: React.FC<TierSelectorProps> = ({ currentTierId, isLoading, onSelectTier }) => {
  const { isMobile, isTabletVertical } = useResponsive();

  const isMobileOrTabletVertical = isMobile || isTabletVertical;

  /**
   * Renders an individual tier card
   * @param {Tier} tier - Tier data to render
   * @returns {React.ReactElement} Rendered tier card
   */
  const renderTier = (tier: Tier) => (
    <div
      className={classNames(styles.tier, styles[`tier_${tier.id}`], {
        ...(currentTierId && { [styles.disabled]: tier.id < currentTierId }),
      })}
    >
      <div className={styles.image}>
        <TierImage tier={tier.id} size={128} />
        {currentTierId === tier.id && (
          <Typography variant={"body"} size={"xsmall"} className={styles.current} textAlign={"center"}>
            Current Tier
          </Typography>
        )}
      </div>
      <div className={styles.data}>
        <div className={classNames(styles.data, styles.title)}>
          <Typography variant={"heading"} size={"large"} textAlign={isMobileOrTabletVertical ? "center" : "left"}>
            {tier.name}
          </Typography>
          <Typography
            variant={"body"}
            size={"medium"}
            textAlign={isMobileOrTabletVertical ? "center" : "left"}
            className={styles.description}
          >
            {tier.description}
          </Typography>
        </div>

        <Fieldset title={"Benefits"} className={styles.fieldset}>
          <Typography variant={"body"} size={"medium"}>
            <p dangerouslySetInnerHTML={{ __html: tier.benefits }} />
          </Typography>
        </Fieldset>

        {!currentTierId || (currentTierId && tier.id > currentTierId) ? (
          <div className={styles.actions}>
            <Button
              variant={"solid"}
              size={"medium"}
              caption={`Stake ${formatPrice(tier.stakeAmount, "QUBIC", 0)}`}
              className={styles.button}
              isLoading={isLoading}
              onClick={() => onSelectTier(tier)}
            />
          </div>
        ) : null}
      </div>
    </div>
  );

  const renderItem = (tier: Tier, index: number) => (
    <React.Fragment key={index}>{index > Tiers.TIER_NONE && renderTier(tier)}</React.Fragment>
  );

  return (
    <Skeleton count={5} orientation={"vertical"} gap={22} height={128} width={"full"} isLoading={false}>
      <div className={styles.layout}>{TiersDataArray?.map((tier, index) => renderItem(tier, index))}</div>
    </Skeleton>
  );
};
