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
import { Project, ProjectStates } from "@/project/project.types";
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
  | "websiteUrl"
  | "state"
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
  websiteUrl,
  state,
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

  const stateLabels = {
    [ProjectStates.ALL]: { title: "", banner: "", footer: "" },
    [ProjectStates.DRAFT]: { title: "Draft", banner: "", footer: "" },
    [ProjectStates.SENT_TO_REVIEW]: { title: "Sent to Review", banner: "", footer: "" },
    [ProjectStates.REJECTED]: { title: "Rejected", banner: "", footer: "" },
    [ProjectStates.CLOSED]: { title: "Closed", banner: "Claim tokens in", footer: "" },
    [ProjectStates.FAILED]: { title: "Failed", banner: "", footer: "" },
    [ProjectStates.FUNDING_PHASE_1]: { title: "Funding Phase 1", banner: "Phase 1 ends in", footer: "" },
    [ProjectStates.FUNDING_PHASE_2]: { title: "Funding Phase 2", banner: "Phase 2 ends in", footer: "" },
    [ProjectStates.FUNDING_PHASE_3]: { title: "Funding Phase 3", banner: "Phase 3 ends in", footer: "" },
    [ProjectStates.READY_TO_VOTE]: { title: "Ready to Vote", banner: "Voting ends in", footer: "" },
    [ProjectStates.REQUEST_MORE_INFO]: { title: "More Info Requested", banner: "", footer: "" },
    [ProjectStates.UPCOMING]: { title: "Upcoming", banner: "Registration ends in", footer: "" },
  };

  return (
    <div className={styles.layout}>
      <div className={styles.stars} />
      <div className={styles.banner}>
        <img src={bannerUrl} width="100%" height={isMobile ? 250 : 250} alt={`${name} banner`} />

        <div className={styles.bar}>
          <div className={styles.content}>
            {startDate && stateLabels[state].banner !== "" && (
              <div className={styles.time}>
                <Typography as="h2">{stateLabels[state].banner.toUpperCase()}</Typography>
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

      <div className={classNames(styles.content, styles.extended)}>
        <div className={styles.inline}>
          <div className={styles.avatar}>
            <img src={photoUrl} width={62} height={62} alt={`${name} avatar`} />
          </div>

          <div className={classNames(styles.field, styles.toBottom)}>
            <div>
              <div className={classNames(styles.inline, styles.title)}>
                <Typography as="h1" variant="heading" size="large">
                  {name}
                </Typography>
                {Object.keys(social).length > 0 && Object.values(social).some((value) => value === undefined) && (
                  <div className={styles.links}>
                    <Links
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
            </div>

            <div className={styles.actions}>
              <a href={websiteUrl} target={"_blank"}>
                <Button
                  variant="solid"
                  color="primary"
                  caption="Website"
                  size="small"
                  iconLeft={<RiExternalLinkLine />}
                />
              </a>
              <a href={whitepaperUrl} target={"_blank"}>
                <Button
                  variant="outline"
                  color="primary"
                  caption="Whitepaper"
                  size="small"
                  iconLeft={<RiExternalLinkLine />}
                />
              </a>
              <a href={tokenomicsUrl} target={"_blank"}>
                <Button
                  variant="outline"
                  color="primary"
                  caption="Tokenomics"
                  size="small"
                  iconLeft={<RiExternalLinkLine />}
                />
              </a>
              <a href={litepaperUrl} target={"_blank"}>
                <Button
                  variant="outline"
                  color="primary"
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
              icon={
                <img
                  width={48}
                  height={48}
                  className={styles.tokenImage}
                  src={tokenImageUrl || "/invalid-image.png"}
                  onError={(e) => {
                    e.currentTarget.src = "/invalid-image.png";
                  }}
                />
              }
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
  );
};
