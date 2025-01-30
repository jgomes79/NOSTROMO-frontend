import classNames from "clsx";
import {
  RiTwitterXFill,
  RiInstagramLine,
  RiTelegramFill,
  RiDiscordFill,
  RiMediumFill,
  RiExternalLinkLine,
  RiGlobalLine,
  RiStockLine,
  RiCoinsLine,
} from "react-icons/ri";

import { formatPrice, formatNumber } from "@/lib/number";
import { Project } from "@/project/project.types";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Countdown } from "@/shared/components/Countdown";
import { DataLabel } from "@/shared/components/DataLabel";
import { Links } from "@/shared/components/Links";
import { Separator } from "@/shared/components/Separator";
import { Typography } from "@/shared/components/Typography";
import useResponsive from "@/shared/hooks/useResponsive";

import styles from "./ProjectHeader.module.scss";

/**
 * Props for the ProjectHeader component
 */
type ProjectHeaderProps = Pick<
  Project,
  | "name"
  | "description"
  | "bannerUrl"
  | "photoUrl"
  | "startDate"
  | "social"
  | "tokenPrice"
  | "currency"
  | "tokenName"
  | "tokensSupply"
  | "whitepaperUrl"
  | "litepaperUrl"
  | "tokenomicsUrl"
  | "tokenImageUrl"
>;

/**
 * ProjectHeader component displays the header section of a project page
 *
 * @component
 * @returns {JSX.Element} The rendered ProjectHeader component
 */
export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  name,
  description,
  photoUrl,
  bannerUrl,
  startDate,
  social,
  tokenPrice,
  currency,
  tokensSupply,
  tokenName,
  tokenImageUrl,
  litepaperUrl,
  tokenomicsUrl,
  whitepaperUrl,
}) => {
  const { isMobile } = useResponsive();

  return (
    <>
      <div className={styles.banner}>
        <img src={bannerUrl} width="100%" height={isMobile ? 250 : 500} alt={`${name} banner`} />

        <div className={styles.bar}>
          <div className={styles.content}>
            {startDate && (
              <div className={styles.time}>
                <Typography as="h2">REGISTRATION ENDS IN</Typography>
                <Countdown date={startDate}>
                  {(timeLeft) => (
                    <Typography variant="heading" size="small">
                      {timeLeft.days}D - {timeLeft.hours}H - {timeLeft.minutes}M - {timeLeft.seconds}S
                    </Typography>
                  )}
                </Countdown>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.stars}>
        <div className={classNames(styles.content, styles.extended)}>
          <div className={styles.inline}>
            <div className={styles.avatar}>
              <img src={photoUrl} width={62} height={62} alt={`${name} avatar`} />
            </div>

            <div className={styles.field}>
              <div>
                <div className={classNames(styles.inline, styles.title)}>
                  <Typography as="h1" variant="heading" size="large">
                    {name}
                  </Typography>
                  {Object.keys(social).length > 0 && (
                    <div className={styles.links}>
                      <Links
                        className={styles.links}
                        data={Object.entries(social)
                          .filter(([, value]) => value)
                          .map(([key, value]) => {
                            const icons = {
                              xUrl: <RiTwitterXFill />,
                              instagramUrl: <RiInstagramLine />,
                              telegramUrl: <RiTelegramFill />,
                              discordUrl: <RiDiscordFill />,
                              mediumUrl: <RiMediumFill />,
                            };
                            return { icon: icons[key as keyof typeof icons], path: value };
                          })}
                      />
                    </div>
                  )}
                </div>

                <div className={styles.description}>
                  <Typography as="p" variant="body" size="medium" textAlign={isMobile ? "center" : "left"}>
                    <span dangerouslySetInnerHTML={{ __html: description }} />
                  </Typography>
                </div>
              </div>

              <div className={styles.actions}>
                <a href={whitepaperUrl} target={"_blank"}>
                  <Button
                    variant="solid"
                    color="secondary"
                    caption="Whitepaper"
                    size="small"
                    iconLeft={<RiExternalLinkLine />}
                  />
                </a>
                <a href={tokenomicsUrl} target={"_blank"}>
                  <Button
                    variant="solid"
                    color="secondary"
                    caption="Tokenomics"
                    size="small"
                    iconLeft={<RiExternalLinkLine />}
                  />
                </a>
                <a href={litepaperUrl} target={"_blank"}>
                  <Button
                    variant="solid"
                    color="secondary"
                    caption="Litepaper"
                    size="small"
                    iconLeft={<RiExternalLinkLine />}
                  />
                </a>
              </div>
            </div>
          </div>
          <div className={styles.grid}>
            <Card className={styles.card}>
              <DataLabel icon={<RiGlobalLine />} label="Network" value="QUBIC" />
            </Card>
            <Card className={styles.card}>
              <DataLabel
                icon={<img width={48} height={48} className={styles.tokenImage} src={tokenImageUrl} />}
                label="Token Name"
                value={tokenName}
              />
            </Card>
            <Card className={styles.card}>
              <DataLabel icon={<RiStockLine />} label="Token Price" value={formatPrice(tokenPrice, currency.name, 0)} />
            </Card>
            <Card className={styles.card}>
              <DataLabel icon={<RiCoinsLine />} label="Token Supply" value={formatNumber(tokensSupply ?? 0, 0)} />
            </Card>
          </div>
          <Separator />
        </div>
      </div>
    </>
  );
};
