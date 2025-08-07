import React, { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import classNames from "clsx";
import { addDays } from "date-fns/addDays";
import { format } from "date-fns/format";

import { useModal } from "@/core/modals/hooks/useModal";
import { ModalsIds } from "@/core/modals/modals.types";
import { ToastIds, useToast } from "@/core/toasts/hooks/useToast";
import { formatPrice } from "@/lib/number";
import { getRoute } from "@/lib/router";
import { ProjectComments } from "@/project/components/ProjectComments";
import { ProjectEvaluation } from "@/project/components/ProjectEvaluation";
import { ProjectInvestment } from "@/project/components/ProjectInvestment";
import { ProjectVoting, Vote } from "@/project/components/ProjectVoting";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { DataLabel } from "@/shared/components/DataLabel";
import { Loader } from "@/shared/components/Loader";
import { Tabs } from "@/shared/components/Tabs";
import { ErrorPage } from "@/shared/pages/ErrorPage";
import { TiersData } from "@/tier/tier.types";
import { useContractProjectByIndex } from "@/wallet/hooks/useContractProjectByIndex";
import { useContractTier } from "@/wallet/hooks/useContractTier";
import { useContractUserVotes } from "@/wallet/hooks/useContractUserVotes";
import { useVote } from "@/wallet/hooks/useVote";
import { useQubicConnect } from "@/wallet/qubic/QubicConnectContext";

import styles from "./ProjectDetailsPage.module.scss";
import { ProjectHeader } from "../../components/ProjectHeader";
import { ProjectRegister } from "../../components/ProjectRegister";
import { ThresholdCalculator } from "../../components/ThresholdCalculator";
import { useProject } from "../../hooks/useProject";
import { PROJECT_ROUTES, ProjectTabLabels } from "../../project.constants";
import { ProjectFormTabs, ProjectStates } from "../../project.types";

/**
 * Type representing the parameters for the ProjectDetails component.
 *
 * @property {string} slug - The unique identifier (slug) of the project.
 * @property {ProjectDetailsTabs} tab - The current active tab in the project details.
 */
type ProjectDetailsPageParams = {
  slug: string;
  tabId?: ProjectFormTabs;
};

/**
 * ProjectDetailsPage component displays detailed information about a specific project.
 *
 * This component fetches and displays project data based on the URL slug parameter.
 * It handles loading states, error cases, and renders the project information
 * with a tabbed interface for different sections of content.
 *
 * @component
 * @returns {JSX.Element} The rendered ProjectDetailsPage component
 */
export const ProjectDetailsPage: React.FC = () => {
  const { slug, tabId } = useParams<ProjectDetailsPageParams>();
  const { wallet } = useQubicConnect();
  const {
    refetch: refetchUserTier,
    data: { tierLevel },
  } = useContractTier();
  const { data, ...project } = useProject(slug);
  const { mutate: voteOnProject } = useVote();
  const { openModal, closeModal } = useModal();
  const { createToast } = useToast();

  console.log("data?.smartContractId", data?.smartContractId);

  const { refetch: refetchUserVotes, isLoading: isLoadingUserVotes } = useContractUserVotes();
  const {
    data: { project: projectContract },
    isLoading: isLoadingProjectByIndex,
  } = useContractProjectByIndex(data?.smartContractId);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentTier = async () => {
      await refetchUserTier();
      await refetchUserVotes();
    };

    fetchCurrentTier();
  }, [wallet?.publicKey]);

  /**
   * Handles the click event for voting on a project.
   *
   * @param {Vote} vote - The vote to be cast.
   * @returns {void}
   */
  const handleClickVote = async (vote: Vote) => {
    const isYes = vote === "yes";
    if (data) {
      const voteType = isYes ? "in favor of" : "against";
      const confirmationTitle = `Vote ${voteType} this project`;
      const confirmationDescription = `Are you sure you want to vote ${voteType} this project?`;

      openModal(ModalsIds.CONFIRMATION, {
        type: isYes ? "success" : "error",
        title: confirmationTitle,
        description: confirmationDescription,
        onConfirm: {
          caption: isYes ? "Vote in favor" : "Vote against",
          action: async (setLoading) => {
            setLoading(true);
            try {
              if (data.smartContractId) {
                await voteOnProject(data.smartContractId, isYes);
                closeModal();
              } else {
                createToast(ToastIds.CONFIRMATION, {
                  type: "error",
                  title: "Invalid operation",
                  description: "This project is not published and cannot be voted on",
                });
              }
            } finally {
              setLoading(false);
            }
          },
        },
        onDecline: {
          caption: "Cancel",
          action: closeModal,
        },
      });
    }
  };

  /**
   * Array of tabs to be excluded from the project details view.
   * @type {ProjectFormTabs[]}
   */
  const excludedTabs = [
    ProjectFormTabs.BASIC_INFORMATION,
    ProjectFormTabs.DOCUMENTATION,
    ProjectFormTabs.SOCIAL_NETWORKS,
    ProjectFormTabs.TOKEN_INFORMATION,
  ];

  /**
   * Array of tab objects for display in the project details interface.
   * Each tab object contains an id and label.
   *
   * @type {Array<{id: ProjectFormTabs, label: string}>}
   * @remarks
   * - Filters out excluded tabs defined in `excludedTabs`
   * - Maps remaining tabs to objects with id and label properties
   * - Labels are retrieved from ProjectTabLabels mapping
   */
  const currentTabs = Object.values(ProjectFormTabs)
    .filter((tab) => !excludedTabs.includes(tab))
    .map((tab) => ({
      id: tab,
      label: ProjectTabLabels[tab],
    }));

  /**
   * Renders an action card based on the current state of the project.
   *
   * @returns {JSX.Element | null} The rendered action card component or null if no matching state is found
   *
   * @remarks
   * - Returns a ProjectEvaluation component if the project state is SENT_TO_REVIEW
   * - Returns null for any other project state
   */
  const renderActionCard = (): JSX.Element | null => {
    if (!data || !wallet) return null;

    switch (data.state) {
      case ProjectStates.FUNDING_PHASE_1:
      case ProjectStates.FUNDING_PHASE_2:
      case ProjectStates.FUNDING_PHASE_3:
        return (
          <ProjectInvestment
            state={data.state}
            investment={{
              current: 14550,
              limitDate: addDays(new Date(), 10),
              max: 50000,
              threshold: 5,
              token: {
                price: 0.34,
                currency: {
                  id: data.currency.id,
                  name: data.currency.name,
                },
              },
            }}
            user={{
              tier: {
                id: tierLevel,
                name: TiersData[tierLevel as keyof typeof TiersData]?.name,
              },
              maxInvestment: 2000,
            }}
            onInvest={() => {}}
            onUpgradeTier={() => {}}
          />
        );

      case ProjectStates.UPCOMING:
        return (
          <ProjectRegister
            registration={{
              limitDate: data.startDate,
              count: 5000,
            }}
            user={{
              tier: {
                id: tierLevel,
                name: TiersData[tierLevel as keyof typeof TiersData]?.name,
              },
              investment: {
                value: TiersData[tierLevel as keyof typeof TiersData]?.stakeAmount,
                max: {
                  value: TiersData[tierLevel as keyof typeof TiersData]?.poolWeight,
                  currency: {
                    name: data.currency.name,
                  },
                },
              },
              isRegistered: false,
            }}
            onClick={() => {}}
            isLoading={false}
          />
        );

      case ProjectStates.READY_TO_VOTE:
        return (
          <ProjectVoting
            config={{
              limitDate: data.startDate,
              count: [projectContract?.numberOfYes ?? 0, projectContract?.numberOfNo ?? 0],
            }}
            myVote={undefined}
            hasOwnership={true} //user?.id === data.owner?.id
            isLoading={isLoadingUserVotes}
            onClick={handleClickVote}
          />
        );

      case ProjectStates.SENT_TO_REVIEW:
        return (
          <ProjectEvaluation
            project={data}
            admin={{
              wallet: wallet.publicKey,
            }}
          />
        );

      case ProjectStates.REQUEST_MORE_INFO:
        return <ProjectComments comments={data.comments ?? ""} />;

      default:
        return null;
    }
  };

  /**
   * Renders the content for a specific project tab based on the tab ID.
   *
   * @param {ProjectFormTabs} tabId - The ID of the tab to render
   * @returns {JSX.Element | null} The rendered tab content component or null if no matching tab is found
   *
   * @example
   * ```tsx
   * renderTab(ProjectFormTabs.TOKEN_INFORMATION)
   * ```
   */
  const renderTab = () => {
    if (!data) return null;

    switch (tabId) {
      case ProjectFormTabs.VESTING_OPTIONS:
        return (
          <Card className={classNames(styles.grid, styles.labels)}>
            <DataLabel
              label={"Token Listing"}
              value={format(new Date(data.TGEDate), "EEEE, MMMM do, yyyy 'at' h:mm a")}
            />
            <DataLabel label={"Tokens Unlocked at TGE"} value={formatPrice(data.unlockTokensTGE, data.tokenName)} />
            <DataLabel label={"Cliff Period"} value={`${data.cliff} days`} />
            <DataLabel label={"Vesting Duration"} value={`${data.vestingDays} days`} />
          </Card>
        );

      case ProjectFormTabs.RAISING_FUNDS:
      default:
        return (
          <Card className={classNames(styles.grid, styles.labels)}>
            <DataLabel label={"Currency"} value={data.currency.name} />
            <DataLabel label={"Token For Sale"} value={formatPrice(data.tokensForSale, data.currency.name)} />
            <DataLabel
              label={"ICO Start date"}
              value={format(new Date(data.startDate), "EEEE, MMMM do, yyyy 'at' h:mm a")}
            />
            <div className={styles.grid}>
              <div className={classNames(styles.grid, styles.two)}>
                <DataLabel label={"Amount to Raise"} value={formatPrice(data.amountToRaise, data.currency.name)} />
                <DataLabel label={"Threshold"} value={`${data.threshold}%`} />
              </div>
              <ThresholdCalculator
                currency={data.currency}
                amountToRaise={data.amountToRaise}
                threshold={data.threshold}
              />
            </div>
          </Card>
        );
    }
  };

  /**
   * Renders a loader if the project data is still loading.
   *
   * @returns {JSX.Element} The loader component.
   */
  if ((project.isLoading && !data) || isLoadingProjectByIndex) {
    return <Loader variant={"full"} size={42} />;
  }

  /**
   * Renders an error page if the project data is not found or unavailable.
   *
   * @returns {JSX.Element} The error page component.
   */
  if (!slug || (!project.isLoading && !data) || !data) {
    return (
      <ErrorPage
        code={"404"}
        title={"Project Not Found"}
        description={"We're sorry, but the project you're looking for is either unavailable or doesn't exist."}
        actions={[<Button key={"home"} caption={"Return Home"} />]}
      />
    );
  }

  /**
   * Redirects to the default project details tab (RAISING_FUNDS) if no tab is specified.
   * This ensures that users always see a valid tab when viewing project details.
   *
   * @returns {JSX.Element} Navigate component redirecting to the default project tab
   */
  if (!tabId) {
    return <Navigate to={getRoute(PROJECT_ROUTES.PROJECT_DETAILS, { slug, tabId: ProjectFormTabs.RAISING_FUNDS })} />;
  }

  return (
    <div className={styles.layout}>
      <ProjectHeader {...data} />

      <div className={styles.container}>
        {renderActionCard()}

        <Tabs<ProjectFormTabs>
          size={"large"}
          tabs={currentTabs}
          activeId={tabId}
          onChange={(tabId) => navigate(getRoute(PROJECT_ROUTES.PROJECT_DETAILS, { slug, tabId }))}
          onRender={renderTab()}
        />
      </div>
    </div>
  );
};
