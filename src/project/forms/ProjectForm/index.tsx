import React, { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "clsx";
import {
  RiCheckLine,
  RiDiscordFill,
  RiFileAddLine,
  RiImageAddLine,
  RiInstagramFill,
  RiMediumFill,
  RiTelegramFill,
  RiTwitterXFill,
} from "react-icons/ri";

import { useCurrencies } from "@/currency/hooks/useCurrencies";
import { formatPrice } from "@/lib/number";
import { Animatable } from "@/shared/components/Animatable";
import { Button, ButtonProps } from "@/shared/components/Button";
import { DateInput } from "@/shared/components/DateInput";
import { Fieldset } from "@/shared/components/Fieldset";
import { FileUpload } from "@/shared/components/FileUpload";
import { Loader } from "@/shared/components/Loader";
import { RangeInput } from "@/shared/components/RangeInput";
import { Selector } from "@/shared/components/Selector";
import { Tabs } from "@/shared/components/Tabs";
import { TextArea } from "@/shared/components/TextArea";
import { TextInput } from "@/shared/components/TextInput";
import { Typography } from "@/shared/components/Typography";

import styles from "./ProjectForm.module.scss";
import { ProjectFormValues, ProjectFormSchema, ProjectFormProps } from "./ProjectForm.types";

/**
 * Enum representing the different tabs in the project form.
 */
enum ProjectFormTabs {
  BASIC_INFORMATION = "basic-information",
  SOCIAL_NETWORKS = "social-networks",
  DOCUMENTATION = "documentation",
  TOKEN_INFORMATION = "token-information",
  RAISING_FUNDS = "raising-funds",
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

  const {
    control,
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<ProjectFormValues>({
    defaultValues,
    progressive: true,
    resolver: zodResolver(ProjectFormSchema),
    reValidateMode: "onChange",
    mode: "all",
  });

  const whitepaper = watch("whitepaper"),
    litepaper = watch("litepaper"),
    tokenomics = watch("tokenomics"),
    amountToRaise = watch("amountToRaise"),
    threshold = watch("threshold"),
    tokenName = watch("tokenName"),
    tokenImage = watch("tokenImage"),
    currencyId = watch("currency.id");

  const tabCompletionChecks: Record<ProjectFormTabs, boolean | undefined> = {
    [ProjectFormTabs.BASIC_INFORMATION]:
      !errors.banner &&
      !errors.photo &&
      !errors.name &&
      !errors.description &&
      dirtyFields.banner &&
      dirtyFields.photo &&
      dirtyFields.name &&
      dirtyFields.description,
    [ProjectFormTabs.SOCIAL_NETWORKS]:
      !errors.social?.discordUrl &&
      !errors.social?.instagramUrl &&
      !errors.social?.mediumUrl &&
      !errors.social?.xUrl &&
      !errors.social?.telegramUrl &&
      dirtyFields.social?.discordUrl &&
      dirtyFields.social?.instagramUrl &&
      dirtyFields.social?.mediumUrl &&
      dirtyFields.social?.xUrl &&
      dirtyFields.social?.telegramUrl,
    [ProjectFormTabs.DOCUMENTATION]:
      !errors.whitepaper &&
      !errors.tokenomics &&
      !errors.litepaper &&
      dirtyFields.whitepaper &&
      dirtyFields.tokenomics &&
      dirtyFields.litepaper,
    [ProjectFormTabs.TOKEN_INFORMATION]:
      !errors.tokenImage &&
      !errors.tokenName &&
      !errors.tokensSupply &&
      !errors.tokenDecimals &&
      dirtyFields.tokenImage &&
      dirtyFields.tokenName &&
      dirtyFields.tokensSupply &&
      dirtyFields.tokenDecimals,
    [ProjectFormTabs.RAISING_FUNDS]:
      !errors.currency?.id &&
      !errors.amountToRaise &&
      !errors.threshold &&
      !errors.tokensForSale &&
      !errors.startDate &&
      dirtyFields.currency?.id &&
      dirtyFields.amountToRaise &&
      dirtyFields.threshold &&
      dirtyFields.tokensForSale &&
      dirtyFields.startDate,
    [ProjectFormTabs.VESTING_OPTIONS]: false,
  };

  const currentTabs = Object.values(ProjectFormTabs).map((tab) => ({
    id: tab,
    label: ProjectTabLabels[tab],
    iconLeft: tabCompletionChecks[tab] && <RiCheckLine />,
  }));

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
      right: { caption: "Continue", type: "button", onClick: () => setActiveTab(ProjectFormTabs.TOKEN_INFORMATION) },
    },
    [ProjectFormTabs.TOKEN_INFORMATION]: {
      left: { caption: "Back", type: "button", onClick: () => setActiveTab(ProjectFormTabs.DOCUMENTATION) },
      right: { caption: "Continue", type: "button", onClick: () => setActiveTab(ProjectFormTabs.RAISING_FUNDS) },
    },
    [ProjectFormTabs.RAISING_FUNDS]: {
      left: { caption: "Back", type: "button", onClick: () => setActiveTab(ProjectFormTabs.TOKEN_INFORMATION) },
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
      case ProjectFormTabs.TOKEN_INFORMATION:
        return (
          <div className={classNames(styles.grid, styles.twoAlignLeft)}>
            <FileUpload
              icon={<RiImageAddLine />}
              title={"Token Image"}
              maxFiles={1}
              className={styles.avatarImg}
              accept="images"
              value={[tokenImage]}
              onChange={(files) => setValue("tokenImage", files[0])}
              onRender={(photos, getUrl) => (
                <div className={styles.imagePreview}>
                  <img src={getUrl(photos[0])} />
                </div>
              )}
            />
            <div className={classNames(styles.grid, styles.one)}>
              <div className={classNames(styles.grid, styles.two)}>
                <TextInput label="Token Name" placeholder="Tokens Name" {...register("tokenName")} />
              </div>
              <div className={classNames(styles.grid, styles.two, !tokenName && styles.disabled)}>
                <TextInput
                  label="Total Supply"
                  type="number"
                  placeholder={formatPrice(500000)}
                  symbol={tokenName ?? ""}
                  disabled={!tokenName}
                  error={dirtyFields.tokensSupply ? errors.tokensSupply?.message : undefined}
                  {...register("tokensSupply")}
                />

                <TextInput
                  label="Tokens Decimals"
                  type="number"
                  placeholder="Tokens Decimals"
                  maxLength={2}
                  disabled={!tokenName}
                  error={dirtyFields.tokenDecimals ? errors.tokenDecimals?.message : undefined}
                  {...register("tokenDecimals")}
                />
              </div>
            </div>
          </div>
        );

      case ProjectFormTabs.RAISING_FUNDS:
        return (
          <div className={classNames(styles.grid, styles.one)}>
            <div className={classNames(styles.grid, styles.two)}>
              <div className={classNames(styles.grid, styles.one)}>
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

                {isCurrenciesLoading ? (
                  <Loader />
                ) : (
                  <TextInput
                    label="Amount to Raise"
                    type="number"
                    placeholder="Amount to Raise"
                    symbol={currency?.name ?? ""}
                    description={
                      "Indicate the amount of funds you need to raise to make your project work. These will be expressed in the currency you select"
                    }
                    {...register("amountToRaise")}
                    error={dirtyFields.amountToRaise ? errors.amountToRaise?.message : undefined}
                  />
                )}
              </div>
              <div className={classNames(styles.grid, styles.one)}>
                <Controller
                  name="threshold"
                  control={control}
                  render={({ field }) => (
                    <div className={classNames(styles.grid, styles.one, !amountToRaise && styles.disabled)}>
                      <RangeInput
                        label={"Threshold"}
                        description={
                          "Specify the minimum threshold value required for the project to be considered successful. (Minimum 5% and maximum 25%)"
                        }
                        min={5}
                        max={25}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={!amountToRaise}
                        renderValue={(value) => <Typography size={"small"}>{value}%</Typography>}
                      />
                      {threshold > 0 && (
                        <div className={classNames(styles.grid, styles.two, styles.amountToRaise)}>
                          <TextInput
                            label="Minimum Amount"
                            type="number"
                            placeholder="Minimum Amount"
                            symbol={currency?.name ?? ""}
                            value={formatPrice(amountToRaise - (amountToRaise * threshold) / 100)}
                            disabled
                          />
                          <TextInput
                            label="Maximum Amount"
                            type="number"
                            placeholder="Maximum Amount"
                            symbol={currency?.name ?? ""}
                            value={formatPrice(amountToRaise + (amountToRaise * threshold) / 100)}
                            disabled
                          />
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
            <div className={classNames(styles.grid, styles.two)}>
              <TextInput
                label="Token For Sale"
                type="number"
                placeholder={formatPrice(500000, undefined, 0)}
                symbol={currency?.name ?? ""}
                description={
                  "Indicate the amount of funds you need to raise to make your project work. These will be expressed in the currency you select"
                }
                {...register("tokensForSale")}
              />
              <Controller
                name={"startDate"}
                control={control}
                render={({ field }) => (
                  <DateInput
                    {...field}
                    label="ICO Start date"
                    description={"Select the date you want your project to start its initial registration phase."}
                    placeholder="YYYY-MM-DD"
                    error={dirtyFields.startDate ? errors.startDate?.message : undefined}
                  />
                )}
              />
            </div>
          </div>
        );

      case ProjectFormTabs.DOCUMENTATION:
        return (
          <div className={classNames(styles.grid, styles.three)}>
            <FileUpload
              icon={<RiFileAddLine />}
              title={"Whitepaper"}
              description={"Drag and drop, or click to upload the project whitepaper"}
              maxFiles={1}
              accept="documents"
              value={[whitepaper]}
              error={errors.whitepaper?.message}
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
              error={dirtyFields.tokenomics ? errors.tokenomics?.message : undefined}
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
              error={dirtyFields.litepaper ? errors.litepaper?.message : undefined}
              onChange={(files) => setValue("litepaper", files[0])}
              onRender={(photos, getUrl) => (
                <div className={styles.imagePreview}>
                  <img src={getUrl(photos[0])} />
                </div>
              )}
            />
          </div>
        );

      case ProjectFormTabs.SOCIAL_NETWORKS:
        return (
          <div className={classNames(styles.grid, styles.two)}>
            <TextInput
              label="Discord URL"
              type="text"
              {...register("social.discordUrl")}
              placeholder="https://discord.com/invite..."
              icon={<RiDiscordFill />}
              error={dirtyFields.social?.discordUrl ? errors.social?.discordUrl?.message : undefined}
            />
            <TextInput
              label="Instagram URL"
              type="text"
              {...register("social.instagramUrl")}
              placeholder="https://www.instagram.com/..."
              icon={<RiInstagramFill />}
              error={dirtyFields.social?.instagramUrl ? errors.social?.instagramUrl?.message : undefined}
            />
            <TextInput
              label="Medium URL"
              type="text"
              {...register("social.mediumUrl")}
              placeholder="https://medium.com/@..."
              icon={<RiMediumFill />}
              error={dirtyFields.social?.mediumUrl ? errors.social?.mediumUrl?.message : undefined}
            />
            <TextInput
              label="X URL"
              type="text"
              {...register("social.xUrl")}
              placeholder="https://x.com/..."
              icon={<RiTwitterXFill />}
              error={dirtyFields.social?.xUrl ? errors.social?.xUrl?.message : undefined}
            />
            <TextInput
              label="Telegram URL"
              type="text"
              {...register("social.telegramUrl")}
              placeholder="https://t.me/..."
              icon={<RiTelegramFill />}
              error={dirtyFields.social?.telegramUrl ? errors.social?.telegramUrl?.message : undefined}
            />
          </div>
        );

      case ProjectFormTabs.BASIC_INFORMATION:
        return (
          <div className={classNames(styles.grid, styles.one)}>
            <div className={styles.banner}>
              <Controller
                name="banner"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    icon={<RiImageAddLine />}
                    title={"Cover Photo"}
                    description={"Drag and drop, or click to upload the cover photo of your project"}
                    maxFiles={1}
                    accept="images"
                    className={styles.bannerImg}
                    value={[field.value]}
                    error={dirtyFields.banner ? errors.banner?.message : undefined}
                    onChange={(files) => field.onChange(files[0])}
                    onRender={(photos, getUrl) => (
                      <div className={styles.imagePreview}>
                        <img src={getUrl(photos[0])} />
                      </div>
                    )}
                  />
                )}
              />
              <div className={styles.avatar}>
                <Controller
                  name="photo"
                  control={control}
                  render={({ field }) => (
                    <FileUpload
                      icon={<RiImageAddLine />}
                      title={"Project Photo"}
                      maxFiles={1}
                      className={styles.avatarImg}
                      accept="images"
                      value={[field.value]}
                      error={dirtyFields.photo ? errors.photo?.message : undefined}
                      onChange={(files) => field.onChange(files[0])}
                      onRender={(photos, getUrl) => (
                        <div className={styles.imagePreview}>
                          <img src={getUrl(photos[0])} />
                        </div>
                      )}
                    />
                  )}
                />
              </div>
            </div>
            <div className={classNames(styles.grid, styles.two, styles.withPaddingTop)}>
              <TextInput
                label="Project Name"
                type="text"
                {...register("name")}
                placeholder="Project Name"
                error={dirtyFields.name ? errors.name?.message : undefined}
              />
            </div>

            <TextArea
              label="Project Description"
              {...register("description")}
              placeholder="Write an appropriate and detailed description of your project that is attractive and clear for users. Make sure to include objectives, main features, and any relevant information that may capture the interest of potential users."
              error={dirtyFields.description ? errors.description?.message : undefined}
            />
          </div>
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
        <Tabs activeId={activeTab} itemClassName={styles.tab} tabs={currentTabs} onChange={setActiveTab} />
      </div>

      {/* Page Container */}
      <Fieldset title={ProjectTabLabels[activeTab]}>
        <Animatable>{renderTab(activeTab)}</Animatable>
      </Fieldset>

      {/* Actions */}
      <div className={styles.actions}>
        <Button variant={"ghost"} {...actionButtons[activeTab].left} />
        <Button variant={"solid"} {...actionButtons[activeTab].right} />
      </div>
    </form>
  );
};

export type { ProjectFormValues, ProjectFormSchema };
