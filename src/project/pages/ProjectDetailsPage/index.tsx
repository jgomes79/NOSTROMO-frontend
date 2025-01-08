import React from "react";
import { useParams } from "react-router-dom";

import classNames from "clsx";
import {
  RiAtLine,
  RiCoinsLine,
  RiDiscordFill,
  RiExternalLinkLine,
  RiGlobalLine,
  RiInstagramLine,
  RiMediumFill,
  RiStockLine,
  RiTelegramFill,
  RiTwitterXFill,
} from "react-icons/ri";

import { formatNumber, formatPrice } from "@/lib/number";
import { Button } from "@/shared/components/Button";
import { Countdown } from "@/shared/components/Countdown";
import { DataLabel } from "@/shared/components/DataLabel";
import { Links } from "@/shared/components/Links";
import { Loader } from "@/shared/components/Loader";
import { Separator } from "@/shared/components/Separator";
import { Typography } from "@/shared/components/Typography";
import { ErrorPage } from "@/shared/pages/ErrorPage";

import styles from "./ProjectDetailsPage.module.scss";
import { ProjectEvaluation } from "../../components/ProjectEvaluation";
import { ProjectRegister } from "../../components/ProjectRegister";
import { useProject } from "../../hooks/useProject";
import { ProjectStates } from "../../project.types";

/**
 * Type representing the parameters for the ProjectDetails component.
 *
 * @property {string} slug - The unique identifier (slug) of the project.
 * @property {ProjectDetailsTabs} tab - The current active tab in the project details.
 */
type ProjectDetailsPageParams = {
  slug: string;
};

export const ProjectDetailsPage: React.FC = () => {
  const { slug } = useParams<ProjectDetailsPageParams>();

  const project = useProject(slug);

  /**
   * Renders the sections of the project details page based on the project state.
   *
   * @returns {React.ReactNode | null} The rendered sections or null if no data is available.
   */
  const renderSections = (): React.ReactNode | null => {
    const { data } = project;

    if (!data) return null;

    switch (data.state) {
      case ProjectStates.DRAFT:
        return <ProjectEvaluation />;

      case ProjectStates.UPCOMING:
        return <ProjectRegister />;

      default:
        return null;
    }
  };

  /**
   * Renders a loader if the project data is still loading.
   *
   * @returns {JSX.Element} The loader component.
   */
  if (project.isLoading && !project.data) {
    return <Loader variant={"full"} size={42} />;
  }

  /**
   * Renders an error page if the project data is not found or unavailable.
   *
   * @returns {JSX.Element} The error page component.
   */
  if ((!project.isLoading && !project.data) || !project.data) {
    return (
      <ErrorPage
        code={"404"}
        title={"Project Not Found"}
        description={"We're sorry, but the project you're looking for is either unavailable or doesn't exist."}
        actions={[<Button key={"home"} caption={"Return Home"} />]}
      />
    );
  }

  return (
    <div className={styles.layout}>
      <div className={styles.banner}>
        <img src={project.data.bannerUrl} width={"100%"} height={500} alt={`${project.data.name} banner`} />

        <div className={styles.bar}>
          <div className={styles.content}>
            {project.data.startDate && (
              <div className={styles.time}>
                <Typography as={"h2"}>REGISTRATION ENDS IN</Typography>
                <Countdown date={project.data.startDate}>
                  {(timeLeft) => (
                    <Typography variant={"heading"} size={"small"}>
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
          {/* Project Description */}
          <div className={styles.inline}>
            <div className={styles.avatar}>
              <img src={project.data.photoUrl} width={48} height={48} alt={`${project.data.name} avatar`} />
            </div>
            <div className={styles.field}>
              <div>
                <div className={classNames(styles.inline, styles.title)}>
                  <Typography as={"h1"} variant={"heading"} size={"large"}>
                    {project.data.name}
                  </Typography>
                  <div className={styles.links}>
                    <Links
                      className={styles.links}
                      data={Object.entries(project.data.social || {})
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
                </div>
                <div className={styles.description}>
                  <Typography as={"p"} variant={"body"} size={"medium"}>
                    <span dangerouslySetInnerHTML={{ __html: project.data.description }} />
                  </Typography>
                </div>
              </div>

              <div className={styles.actions}>
                <Button
                  variant={"solid"}
                  color={"secondary"}
                  caption={"Whitepaper"}
                  size={"small"}
                  iconLeft={<RiExternalLinkLine />}
                />
                <Button
                  variant={"solid"}
                  color={"secondary"}
                  caption={"Tokenomics"}
                  size={"small"}
                  iconLeft={<RiExternalLinkLine />}
                />
                <Button
                  variant={"solid"}
                  color={"secondary"}
                  caption={"Litepaper"}
                  size={"small"}
                  iconLeft={<RiExternalLinkLine />}
                />
              </div>
            </div>
          </div>

          <div className={styles.grid}>
            <DataLabel icon={<RiGlobalLine />} label="Network" value={"QUBIC"} />
            <DataLabel icon={<RiAtLine />} label="Token Name" value={project.data.tokenName} />
            <DataLabel
              icon={<RiStockLine />}
              label="Token Price"
              value={formatPrice(project.data.tokenPrice, project.data.currency.name, 0)}
            />
            <DataLabel
              icon={<RiCoinsLine />}
              label="Token Supply"
              value={formatNumber(project.data.tokensSupply ?? 0, 0)}
            />
          </div>

          <Separator />

          <div className={styles.sections}>{renderSections()}</div>
        </div>
      </div>
    </div>
  );
};
