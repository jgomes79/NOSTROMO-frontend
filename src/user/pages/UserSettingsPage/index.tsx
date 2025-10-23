import { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import classNames from "clsx";

import { getRoute } from "@/lib/router";
import { ProjectsListByState } from "@/project/components/ProjectsListByState";
import { ProjectStates } from "@/project/project.types";
import { Loader } from "@/shared/components/Loader";
import { Separator } from "@/shared/components/Separator";
import { Tabs } from "@/shared/components/Tabs";
import { useAppTitle } from "@/shared/hooks/useAppTitle";
import { useContractTier } from "@/wallet/hooks/useContractTier";
import { useQubicConnect } from "@/wallet/qubic/QubicConnectContext";

import { UserProjects } from "../../components/UserProjects";
import { UserTier } from "../../components/UserTier";
import { USER_ROUTES } from "../../user.constants";
import { UserSettingsTabs } from "../../user.types";
import styles from "./UserSettingsPage.module.scss";

/**
 * Parameters for the UserSettingsLayout component
 * @typedef {Object} UserSettingsLayoutParams
 * @property {UserSettingsTabs} tabId - The ID of the currently selected settings tab
 */
export type UserSettingsPageParams = {
  tabId: UserSettingsTabs;
};

export const UserSettingsPage: React.FC = () => {
  const { wallet } = useQubicConnect();
  const params = useParams<UserSettingsPageParams>();
  const navigate = useNavigate();
  const { data, isLoading: isLoadingTier, refetch } = useContractTier();

  useAppTitle("User settings");

  useEffect(() => {
    const fetchCurrentTier = async () => {
      await refetch();
    };

    fetchCurrentTier();
  }, [wallet?.publicKey]);

  if (!params?.tabId) {
    return <Navigate to={getRoute(USER_ROUTES.SETTINGS, { tabId: UserSettingsTabs.MY_TIER })} />;
  }

  if (!wallet?.publicKey || !params.tabId || isLoadingTier) {
    return (
      <div className={classNames(styles.container, styles.center)}>
        <Loader size={42} className={styles.loader} />
      </div>
    );
  }

  /**
   * Renders the appropriate tab content based on the current tab ID.
   *
   * @returns {JSX.Element} The content of the selected tab.
   */
  const renderTab = () => {
    switch (params.tabId) {
      case UserSettingsTabs.MY_PROJECTS:
        return <UserProjects wallet={wallet.publicKey} />;

      case UserSettingsTabs.CLAIM_TOKENS:
        return <ProjectsListByState state={ProjectStates.CLOSED} />;

      case UserSettingsTabs.MY_TIER:
      default:
        return <UserTier wallet={wallet.publicKey} userTier={data.tierLevel} />;
    }
  };

  return (
    <>
      <div className={styles.tabs}>
        <Tabs<UserSettingsTabs>
          size={"large"}
          tabs={[
            {
              id: UserSettingsTabs.MY_TIER,
              label: "Tier",
            },
            {
              id: UserSettingsTabs.MY_PROJECTS,
              label: "Projects",
            },
            {
              id: UserSettingsTabs.CLAIM_TOKENS,
              label: "Claim Tokens",
            },
          ]}
          activeId={params.tabId}
          onChange={(tabId) => navigate(getRoute(USER_ROUTES.SETTINGS, { tabId }))}
        />
      </div>
      <Separator />
      {renderTab()}
    </>
  );
};
