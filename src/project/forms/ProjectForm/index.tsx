import React, { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "clsx";
import {
  RiDiscordFill,
  RiFileAddLine,
  RiImageAddLine,
  RiInstagramFill,
  RiMediumFill,
  RiTelegramFill,
  RiTwitterXFill,
} from "react-icons/ri";

import { useCurrencies } from "@/currency/hooks/useCurrencies";
import { Button, ButtonProps } from "@/shared/components/Button";
import { Fieldset } from "@/shared/components/Fieldset";
import { FileUpload } from "@/shared/components/FileUpload";
import { Loader } from "@/shared/components/Loader";
import { Selector } from "@/shared/components/Selector";
import { Tabs } from "@/shared/components/Tabs";
import { TextArea } from "@/shared/components/TextArea";
import { TextInput } from "@/shared/components/TextInput";

import styles from "./ProjectForm.module.scss";
import { ProjectFormValues, ProjectFormSchema, ProjectFormProps } from "./ProjectForm.types";

/**
 * Enum representing the different tabs in the project form.
 */
enum ProjectFormTabs {
  BASIC_INFORMATION = "basic-information",
  SOCIAL_NETWORKS = "social-networks",
  DOCUMENTATION = "documentation",
  RAISING_FUNDS = "raising-funds",
  TOKEN_INFORMATION = "token-information",
  VESTING_OPTIONS = "vesting-options",
}

/**
 * Labels for the project form tabs.
 */
const ProjectTabLabels = {
  [ProjectFormTabs.BASIC_INFORMATION]: "Basic information",
  [ProjectFormTabs.SOCIAL_NETWORKS]: "Social Networks",
  [ProjectFormTabs.DOCUMENTATION]: "Documentation",
  [ProjectFormTabs.RAISING_FUNDS]: "Raising Funds",
  [ProjectFormTabs.TOKEN_INFORMATION]: "Token Information",
  [ProjectFormTabs.VESTING_OPTIONS]: "Vesting Options",
};

/**
 * ProjectForm component.
 *
 * @param defaultValues - The default values for the form.
 * @param onSubmit - The function to call when the form is submitted.
 * @returns A JSX element representing the project form.
 */
export const ProjectForm: React.FC<ProjectFormProps> = ({ defaultValues, onSubmit }) => {
  const { data: currencies, isLoading: isCurrenciesLoading } = useCurrencies();

  const [activeTab, setActiveTab] = useState<ProjectFormTabs>(ProjectFormTabs.BASIC_INFORMATION);

  const { register, setValue, handleSubmit, watch } = useForm<ProjectFormValues>({
    defaultValues,
    resolver: zodResolver(ProjectFormSchema),
    reValidateMode: "onBlur",
    mode: "all",
  });

  const photo = watch("photo"),
    banner = watch("banner"),
    whitepaper = watch("whitepaper"),
    litepaper = watch("litepaper"),
    tokenomics = watch("tokenomics"),
    currencyId = watch("currency.id");

  /**
   * Handles the form submission.
   *
   * @param data - The data from the form.
   */
  const onSubmitHandler: SubmitHandler<ProjectFormValues> = (data: ProjectFormValues) => onSubmit(data);

  /**
   * Action buttons for each tab in the project form.
   *
   * This object maps each tab to its corresponding action buttons, which include
   * a left button for navigation or cancellation and a right button for proceeding
   * to the next tab or submitting the form.
   */
  const actionButtons: Record<ProjectFormTabs, { left: ButtonProps; right: ButtonProps }> = {
    [ProjectFormTabs.BASIC_INFORMATION]: {
      left: {
        caption: "Discard and Cancel",
        type: "button",
        onClick: () => setActiveTab(ProjectFormTabs.BASIC_INFORMATION),
      },
      right: { caption: "Continue", type: "button", onClick: () => setActiveTab(ProjectFormTabs.SOCIAL_NETWORKS) },
    },
    [ProjectFormTabs.SOCIAL_NETWORKS]: {
      left: { caption: "Back", type: "button", onClick: () => setActiveTab(ProjectFormTabs.BASIC_INFORMATION) },
      right: { caption: "Continue", type: "button", onClick: () => setActiveTab(ProjectFormTabs.DOCUMENTATION) },
    },
    [ProjectFormTabs.DOCUMENTATION]: {
      left: { caption: "Back", type: "button", onClick: () => setActiveTab(ProjectFormTabs.SOCIAL_NETWORKS) },
      right: { caption: "Continue", type: "button", onClick: () => setActiveTab(ProjectFormTabs.RAISING_FUNDS) },
    },
    [ProjectFormTabs.RAISING_FUNDS]: {
      left: { caption: "Back", type: "button", onClick: () => setActiveTab(ProjectFormTabs.DOCUMENTATION) },
      right: { caption: "Continue", type: "button", onClick: () => setActiveTab(ProjectFormTabs.TOKEN_INFORMATION) },
    },
    [ProjectFormTabs.TOKEN_INFORMATION]: {
      left: { caption: "Back", type: "button", onClick: () => setActiveTab(ProjectFormTabs.RAISING_FUNDS) },
      right: { caption: "Continue", type: "button", onClick: () => setActiveTab(ProjectFormTabs.VESTING_OPTIONS) },
    },
    [ProjectFormTabs.VESTING_OPTIONS]: {
      left: { caption: "Back", type: "button", onClick: () => setActiveTab(ProjectFormTabs.TOKEN_INFORMATION) },
      right: { caption: "Submit for Review", type: "submit" },
    },
  };

  /**
   * Memoized value for the selected currency based on the currencyId.
   *
   * @returns {Currency | undefined} The currency object that matches the currencyId, or undefined if not found.
   */
  const currency = useMemo(
    () => currencies?.find((currency) => currency.id === Number(currencyId)),
    [currencies, currencyId],
  );

  /**
   * Renders the content for the specified tab in the project form.
   *
   * @param {ProjectFormTabs} tab - The current tab to render.
   * @returns {JSX.Element | null} The JSX element representing the tab content, or null if the tab is not recognized.
   */
  const renderTab = (tab: ProjectFormTabs): JSX.Element | null => {
    switch (tab) {
      case ProjectFormTabs.RAISING_FUNDS:
        return (
          <Fieldset title={ProjectTabLabels[tab]}>
            <div className={classNames(styles.grid, styles.three)}>
              {currencies && (
                <Selector
                  label={"Currency"}
                  description={"Select the type of currency with which your project will be funded"}
                  options={currencies.map((currency) => ({
                    label: currency.name,
                    value: currency.id,
                  }))}
                  {...register("currency.id")}
                />
              )}
            </div>
            {isCurrenciesLoading ? (
              <Loader />
            ) : (
              <div className={classNames(styles.grid, styles.two)}>
                <TextInput
                  label="Amount to Raise"
                  type="number"
                  placeholder="Amount to Raise"
                  symbol={currency?.name ?? ""}
                  description={
                    "Indicate the amount of funds you need to raise to make your project work. These will be expressed in the currency you select"
                  }
                  {...register("amountToRaise")}
                />
                <TextInput label="Token Price" type="number" {...register("tokenPrice")} placeholder="Token Price" />
                <TextInput
                  label="Tokens Supply"
                  type="number"
                  {...register("tokensSupply")}
                  placeholder="Tokens Supply"
                />
              </div>
            )}
          </Fieldset>
        );

      case ProjectFormTabs.DOCUMENTATION:
        return (
          <Fieldset title={ProjectTabLabels[tab]}>
            <div className={classNames(styles.grid, styles.three)}>
              <FileUpload
                icon={<RiFileAddLine />}
                title={"Whitepaper"}
                description={"Drag and drop, or click to upload the project whitepaper"}
                maxFiles={1}
                accept="documents"
                value={[whitepaper]}
                onChange={(files) => setValue("whitepaper", files[0])}
                onRender={(photos, getUrl) => (
                  <div className={styles.imagePreview}>
                    <img src={getUrl(photos[0])} />
                  </div>
                )}
              />
              <FileUpload
                icon={<RiFileAddLine />}
                title={"Tokenomics"}
                description={"Drag and drop, or click to upload the tokenomics document"}
                maxFiles={1}
                accept="documents"
                value={[tokenomics]}
                onChange={(files) => setValue("tokenomics", files[0])}
                onRender={(photos, getUrl) => (
                  <div className={styles.imagePreview}>
                    <img src={getUrl(photos[0])} />
                  </div>
                )}
              />
              <FileUpload
                icon={<RiFileAddLine />}
                title={"Litepaper"}
                description={"Drag and drop, or click to upload the project litepaper"}
                maxFiles={1}
                accept="documents"
                value={[litepaper]}
                onChange={(files) => setValue("litepaper", files[0])}
                onRender={(photos, getUrl) => (
                  <div className={styles.imagePreview}>
                    <img src={getUrl(photos[0])} />
                  </div>
                )}
              />
            </div>
          </Fieldset>
        );

      case ProjectFormTabs.SOCIAL_NETWORKS:
        return (
          <Fieldset title={ProjectTabLabels[tab]}>
            <div className={classNames(styles.grid, styles.two)}>
              <TextInput
                label="Discord URL"
                type="text"
                {...register("social.discordUrl")}
                placeholder="https://discord.com/invite..."
                icon={<RiDiscordFill />}
              />
              <TextInput
                label="Instagram URL"
                type="text"
                {...register("social.instagramUrl")}
                placeholder="https://www.instagram.com/..."
                icon={<RiInstagramFill />}
              />
              <TextInput
                label="Medium URL"
                type="text"
                {...register("social.mediumUrl")}
                placeholder="https://medium.com/@..."
                icon={<RiMediumFill />}
              />
              <TextInput
                label="X URL"
                type="text"
                {...register("social.xUrl")}
                placeholder="https://x.com/..."
                icon={<RiTwitterXFill />}
              />
              <TextInput
                label="Telegram URL"
                type="text"
                {...register("social.telegramUrl")}
                placeholder="https://t.me/..."
                icon={<RiTelegramFill />}
              />
            </div>
          </Fieldset>
        );

      case ProjectFormTabs.BASIC_INFORMATION:
        return (
          <Fieldset title={ProjectTabLabels[tab]}>
            <div className={styles.banner}>
              <FileUpload
                icon={<RiImageAddLine />}
                title={"Cover Photo"}
                description={"Drag and drop, or click to upload the cover photo of your project"}
                maxFiles={1}
                accept="images"
                className={styles.bannerImg}
                value={[banner]}
                onChange={(files) => setValue("banner", files[0])}
                onRender={(photos, getUrl) => (
                  <div className={styles.imagePreview}>
                    <img src={getUrl(photos[0])} />
                  </div>
                )}
              />
              <div className={styles.avatar}>
                <FileUpload
                  icon={<RiImageAddLine />}
                  title={"Project Photo"}
                  maxFiles={1}
                  className={styles.avatarImg}
                  accept="images"
                  value={[photo]}
                  onChange={(files) => setValue("photo", files[0])}
                  onRender={(photos, getUrl) => (
                    <div className={styles.imagePreview}>
                      <img src={getUrl(photos[0])} />
                    </div>
                  )}
                />
              </div>
            </div>
            <div className={classNames(styles.grid, styles.two)}>
              <TextInput label="Project Name" type="text" {...register("name")} placeholder="Project Name" />
            </div>

            <TextArea
              label="Project Description"
              {...register("description")}
              placeholder="Write an appropriate and detailed description of your project that is attractive and clear for users. Make sure to include objectives, main features, and any relevant information that may capture the interest of potential users."
            />
          </Fieldset>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    if (!isCurrenciesLoading && currencies && currencies.length > 0) {
      setValue("currency.id", currencies[0].id);
    }
  }, [isCurrenciesLoading, currencies]);

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className={styles.form}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <Tabs
          activeId={activeTab}
          itemClassName={styles.tab}
          tabs={Object.values(ProjectFormTabs).map((tab) => ({
            id: tab,
            label: ProjectTabLabels[tab],
          }))}
          onChange={setActiveTab}
        />
      </div>

      {/* Page Container */}
      {renderTab(activeTab)}

      {/* Actions */}
      <div className={styles.actions}>
        <Button variant={"ghost"} {...actionButtons[activeTab].left} />
        <Button variant={"solid"} {...actionButtons[activeTab].right} />
      </div>
    </form>
  );
};

export type { ProjectFormValues, ProjectFormSchema };
