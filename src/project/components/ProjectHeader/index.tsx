import classNames from "clsx";
import {
  RiTwitterXFill,
  RiInstagramLine,
  RiTelegramFill,
  RiDiscordFill,
  RiMediumFill,
  RiExternalLinkLine,
  RiGlobalLine,
  RiAtLine,
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
>;

/**
 * ProjectHeader component displays the header section of a project page
 *
 * @component
 * @param {ProjectHeaderProps} props - The component props
 * @param {string} props.name - The name of the project
 * @param {string} props.description - HTML description of the project
 * @param {string} props.photoUrl - URL of the project's avatar image
 * @param {string} props.bannerUrl - URL of the project's banner image
 * @param {Date} props.startDate - The registration end date
 * @param {Object} props.social - Social media links for the project
 * @param {number} props.tokenPrice - Price of the project's token
 * @param {Object} props.currency - Currency information for token price
 * @param {number} props.tokensSupply - Total supply of tokens
 * @param {string} props.tokenName - Name of the project's token
 *
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
}) => {
  return (
    <>
      <div className={styles.banner}>
        <img src={bannerUrl} width="100%" height={500} alt={`${name} banner`} />

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
              <img src={photoUrl} width={48} height={48} alt={`${name} avatar`} />
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
                  <Typography as="p" variant="body" size="medium">
                    <span dangerouslySetInnerHTML={{ __html: description }} />
                  </Typography>
                </div>
              </div>

              <div className={styles.actions}>
                <Button
                  variant="solid"
                  color="secondary"
                  caption="Whitepaper"
                  size="small"
                  iconLeft={<RiExternalLinkLine />}
                />
                <Button
                  variant="solid"
                  color="secondary"
                  caption="Tokenomics"
                  size="small"
                  iconLeft={<RiExternalLinkLine />}
                />
                <Button
                  variant="solid"
                  color="secondary"
                  caption="Litepaper"
                  size="small"
                  iconLeft={<RiExternalLinkLine />}
                />
              </div>

              <Separator />

              <div className={styles.grid}>
                <Card className={styles.card}>
                  <DataLabel icon={<RiGlobalLine />} label="Network" value="QUBIC" />
                </Card>
                <Card className={styles.card}>
                  <DataLabel icon={<RiAtLine />} label="Token Name" value={tokenName} />
                </Card>
                <Card className={styles.card}>
                  <DataLabel
                    icon={<RiStockLine />}
                    label="Token Price"
                    value={formatPrice(tokenPrice, currency.name, 0)}
                  />
                </Card>
                <Card className={styles.card}>
                  <DataLabel icon={<RiCoinsLine />} label="Token Supply" value={formatNumber(tokensSupply ?? 0, 0)} />
                </Card>
              </div>

              <Separator />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
