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
import { isSameObject } from "@/lib/object";
import { generateSlugOf } from "@/lib/string";
import { ThresholdCalculator } from "@/project/components/ThresholdCalculator";
import { Animatable } from "@/shared/components/Animatable";
import { Button } from "@/shared/components/Button";
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

import { getDefaultProjectFormValues } from "./ProjectForm.helpers";
import styles from "./ProjectForm.module.scss";
import { OptionalFormSchema, ProjectFormSchema } from "./ProjectForm.schema";
import { ProjectFormValues, ProjectFormProps } from "./ProjectForm.types";
import { ProjectTabLabels } from "../../../project/project.constants";
import { ProjectFormTabs } from "../../../project/project.types";

/**
 * ProjectForm component.
 *
 * @param defaultValues - The default values for the form.
 * @param onSubmit - The function to call when the form is submitted.
 * @returns A JSX element representing the project form.
 */
export const ProjectForm: React.FC<ProjectFormProps> = ({ defaultValues, isLoading, onSubmit }) => {
  const { data: currencies, isLoading: isCurrenciesLoading } = useCurrencies();
  const [activeTab, setActiveTab] = useState<ProjectFormTabs>(ProjectFormTabs.BASIC_INFORMATION);

  const {
    watch,
    reset,
    control,
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { isDirty, errors, dirtyFields },
  } = useForm<ProjectFormValues>({
    defaultValues: defaultValues ?? getDefaultProjectFormValues(),
    resolver: zodResolver(OptionalFormSchema),
    reValidateMode: "onChange",
    mode: "all",
  });

  const name = watch("name"),
    amountToRaise = watch("amountToRaise"),
    threshold = watch("threshold"),
    tokenName = watch("tokenName"),
    tokenImage = watch("tokenImageUrl"),
    currencyId = watch("currency.id");

  /**
   * Memoized value that determines if the form is ready to be published.
   * A form is considered ready for publishing when:
   * 1. All required fields pass schema validation
   * 2. The form is not in a dirty state (no unsaved changes)
   *
   * @returns {boolean} True if the form is valid and not dirty, false otherwise
   */
  const isPublishing = useMemo(
    () => ProjectFormSchema.safeParse(getValues()).success && !isDirty,
    [isDirty, getValues],
  );

  /**
   * An array of objects representing the current tabs in the project form.
   * Each object contains the tab's id, label, and an optional icon indicating
   * the completion status of the tab.
   */
  const currentTabs = Object.values(ProjectFormTabs).map((tab) => ({
    id: tab,
    label: ProjectTabLabels[tab],
  }));

  /**
   * Handles the form submission.
   *
   * @param data - The data from the form.
   */
  const onSubmitHandler: SubmitHandler<ProjectFormValues> = (data: ProjectFormValues) => onSubmit(isPublishing, data);

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
      case ProjectFormTabs.VESTING_OPTIONS:
        return (
          <div className={classNames(styles.grid, styles.two)}>
            <Controller
              name={"TGEDate"}
              control={control}
              key={"TGEDate"}
              render={({ field }) => (
                <DateInput
                  {...field}
                  label="Token Listing Date"
                  description={"Select the date when your token will be listed."}
                  placeholder="YYYY-MM-DD"
                  error={dirtyFields.startDate ? errors.startDate?.message : undefined}
                />
              )}
            />
            <TextInput
              label="Tokens Unlocked at TGE"
              type="number"
              placeholder="Tokens Unlocked at TGE"
              description={"Specify the percentage of tokens to be unlocked on the listing date."}
              maxLength={2}
              symbol={"%"}
              error={dirtyFields.unlockTokensTGE ? errors.unlockTokensTGE?.message : undefined}
              {...register("unlockTokensTGE", { valueAsNumber: true })}
            />
            <TextInput
              label="Cliff Period"
              type="number"
              placeholder="Cliff Period"
              description={"Enter the number of days required before tokens can be released."}
              maxLength={2}
              disabled={!tokenName}
              error={dirtyFields.cliff ? errors.cliff?.message : undefined}
              {...register("cliff", { valueAsNumber: true })}
            />
            <TextInput
              label="Vesting Duration"
              type="number"
              placeholder="Vesting Duration"
              maxLength={2}
              description={"Specify the number of days over which the token vesting will occur."}
              disabled={!tokenName}
              error={dirtyFields.vestingDays ? errors.vestingDays?.message : undefined}
              {...register("vestingDays", { valueAsNumber: true })}
            />
          </div>
        );

      case ProjectFormTabs.TOKEN_INFORMATION:
        return (
          <div className={classNames(styles.grid, styles.twoAlignLeft)}>
            <Controller
              name="tokenImageUrl"
              key={"tokenImageUrl"}
              control={control}
              render={({ field }) => (
                <FileUpload
                  name={"tokenImage"}
                  icon={<RiImageAddLine />}
                  title={"Token Image"}
                  className={styles.avatarImg}
                  accept="images"
                  value={tokenImage}
                  onChange={(file) => field.onChange(file)}
                  onRender={(photo, getUrl) => (
                    <div className={styles.imagePreview}>
                      <img src={getUrl(photo)} />
                    </div>
                  )}
                />
              )}
            />
            <div className={classNames(styles.grid, styles.one)}>
              <div className={classNames(styles.grid, styles.two)}>
                <TextInput label="Token Name" placeholder="Tokens Name" upperCase={true} {...register("tokenName")} />
              </div>
              <div className={classNames(styles.grid, styles.two, !tokenName && styles.disabled)}>
                <TextInput
                  label="Total Supply"
                  type="number"
                  placeholder={formatPrice(500000)}
                  symbol={tokenName ?? ""}
                  disabled={!tokenName}
                  error={dirtyFields.tokensSupply ? errors.tokensSupply?.message : undefined}
                  {...register("tokensSupply", { valueAsNumber: true })}
                />

                <TextInput
                  label="Tokens Decimals"
                  type="number"
                  placeholder="Tokens Decimals"
                  maxLength={2}
                  disabled={!tokenName}
                  error={dirtyFields.tokenDecimals ? errors.tokenDecimals?.message : undefined}
                  {...register("tokenDecimals", { valueAsNumber: true })}
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
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <Selector
                        label={"Currency"}
                        description={"Select the type of currency with which your project will be funded"}
                        options={currencies.map((currency) => ({
                          label: currency.name,
                          value: currency.id,
                        }))}
                        value={field.value?.id}
                        onChange={(e) =>
                          field.onChange(currencies.find((currency) => currency.id === Number(e.target.value)))
                        }
                      />
                    )}
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
                    error={dirtyFields.amountToRaise ? errors.amountToRaise?.message : undefined}
                    {...register("amountToRaise", { valueAsNumber: true })}
                  />
                )}
              </div>
              <div className={classNames(styles.grid, styles.one)}>
                <Controller
                  name="threshold"
                  control={control}
                  key={"threshold"}
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
                        disabled={!amountToRaise}
                        renderValue={(value) => <Typography size={"small"}>{value}%</Typography>}
                      />
                      {currency && amountToRaise && (
                        <ThresholdCalculator threshold={threshold} currency={currency} amountToRaise={amountToRaise} />
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
                symbol={tokenName ?? ""}
                description={
                  "Indicate the amount of funds you need to raise to make your project work. These will be expressed in the currency you select"
                }
                error={dirtyFields.tokensForSale ? errors.tokensForSale?.message : undefined}
                {...register("tokensForSale", { valueAsNumber: true })}
              />
              <Controller
                name={"startDate"}
                control={control}
                key={"startDate"}
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
            <Controller
              name="whitepaperUrl"
              control={control}
              key={"whitepaperUrl"}
              render={({ field }) => (
                <FileUpload
                  name={"whitepaper"}
                  icon={<RiFileAddLine />}
                  title={"Whitepaper"}
                  description={"Drag and drop, or click to upload the project whitepaper"}
                  accept="documents"
                  value={field.value}
                  error={errors.whitepaperUrl?.message}
                  onChange={(file) => field.onChange(file)}
                  {...(typeof field.value === "string" && {
                    attachmentLabels: {
                      icon: <RiCheckLine />,
                      title: "Whitepaper Uploaded",
                      description: "The whitepaper has been uploaded successfully",
                    },
                  })}
                />
              )}
            />
            <Controller
              name="tokenomicsUrl"
              control={control}
              key={"tokenomicsUrl"}
              render={({ field }) => (
                <FileUpload
                  name={"tokenomics"}
                  icon={<RiFileAddLine />}
                  title={"Tokenomics"}
                  description={"Drag and drop, or click to upload the tokenomics document"}
                  accept="documents"
                  value={field.value}
                  error={dirtyFields.tokenomicsUrl ? errors.tokenomicsUrl?.message : undefined}
                  onChange={(file) => field.onChange(file)}
                  {...(typeof field.value === "string" && {
                    attachmentLabels: {
                      icon: <RiCheckLine />,
                      title: "Tokenomics Uploaded",
                      description: "The tokenomics has been uploaded successfully",
                    },
                  })}
                />
              )}
            />
            <Controller
              name="litepaperUrl"
              control={control}
              key={"litepaperUrl"}
              render={({ field }) => (
                <FileUpload
                  name={"litepaper"}
                  icon={<RiFileAddLine />}
                  title={"Litepaper"}
                  description={"Drag and drop, or click to upload the project litepaper"}
                  accept="documents"
                  value={field.value}
                  error={dirtyFields.litepaperUrl ? errors.litepaperUrl?.message : undefined}
                  onChange={(file) => field.onChange(file)}
                  {...(typeof field.value === "string" && {
                    attachmentLabels: {
                      icon: <RiCheckLine />,
                      title: "Litepaper Uploaded",
                      description: "The litepaper has been uploaded successfully",
                    },
                  })}
                />
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
                name="bannerUrl"
                control={control}
                key={"bannerUrl"}
                render={({ field }) => (
                  <FileUpload
                    name={"banner"}
                    icon={<RiImageAddLine />}
                    title={"Cover Photo"}
                    description={"Drag and drop, or click to upload the cover photo of your project"}
                    accept="images"
                    className={styles.bannerImg}
                    value={field.value}
                    error={dirtyFields.bannerUrl ? errors.bannerUrl?.message : undefined}
                    onChange={(file) => field.onChange(file)}
                    onRender={(photo, getUrl) => (
                      <div className={styles.imagePreview}>
                        <img src={getUrl(photo)} />
                      </div>
                    )}
                  />
                )}
              />
              <div className={styles.avatar}>
                <Controller
                  name="photoUrl"
                  control={control}
                  key={"photo"}
                  render={({ field }) => (
                    <FileUpload
                      name={"photo"}
                      icon={<RiImageAddLine />}
                      title={"Project Photo"}
                      className={styles.avatarImg}
                      accept="images"
                      value={field.value}
                      error={dirtyFields.photoUrl ? errors.photoUrl?.message : undefined}
                      onChange={(file) => field.onChange(file)}
                      onRender={(photo, getUrl) => (
                        <div className={styles.imagePreview}>
                          <img src={getUrl(photo)} />
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
                placeholder="Project Name"
                error={dirtyFields.name ? errors.name?.message : undefined}
                {...register("name")}
              />
              <TextInput
                label="Email"
                type="text"
                placeholder="Project email"
                error={dirtyFields.email ? errors.email?.message : undefined}
                {...register("email")}
              />
            </div>

            <TextArea
              label="Project Description"
              {...register("description")}
              placeholder="Write an appropriate and detailed description of your project that is attractive and clear for users. Make sure to include objectives, main features, and any relevant information that may capture the interest of potential users."
              error={dirtyFields.description ? errors.description?.message : undefined}
            />

            <div className={classNames(styles.grid, styles.two, styles.withPaddingTop)}>
              <TextInput
                label="Project Slug"
                type="text"
                placeholder="Project Slug"
                error={dirtyFields.slug ? errors.slug?.message : undefined}
                {...register("slug")}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  /**
   * Renders the submit button for the form based on form state.
   *
   * @returns {JSX.Element | null} A Button component with appropriate styling and text,
   * or null if the form is not dirty and invalid
   *
   * - Returns a "Publish Project" primary button if form is valid but not dirty
   * - Returns a "Save Changes" secondary button if form is dirty
   * - Returns null if form is not dirty and invalid
   */
  const renderSubmitButton = () => {
    if (isPublishing) {
      return (
        <Button type={"submit"} isLoading={isLoading} variant={"solid"} color={"primary"} caption={"Publish Project"} />
      );
    }

    if (!isDirty) {
      return null;
    }

    return (
      <Button type={"submit"} isLoading={isLoading} variant={"solid"} color={"secondary"} caption={"Save Changes"} />
    );
  };

  /**
   * Sets the default currency value when currencies are loaded.
   *
   * @param {boolean} isCurrenciesLoading - Indicates if the currencies are still loading.
   * @param {Array} currencies - The list of available currencies.
   */
  useEffect(() => {
    if (!isCurrenciesLoading && currencies && currencies.length > 0) {
      setValue("currency", currencies[0]);
    }
  }, [isCurrenciesLoading, currencies]);

  /**
   * Generates and sets the slug value based on the project name.
   *
   * @param {string} name - The name of the project.
   */
  useEffect(() => {
    if (name) {
      setValue("slug", generateSlugOf(name));
    }
  }, [name]);

  useEffect(() => {
    if (defaultValues && !isSameObject(defaultValues, getValues())) {
      reset(defaultValues);
    }
  }, [defaultValues]);

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className={styles.form}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <Tabs<ProjectFormTabs>
          activeId={activeTab}
          itemClassName={styles.tab}
          tabs={currentTabs}
          onChange={setActiveTab}
        />
      </div>

      {/* Page Container */}
      <Fieldset title={ProjectTabLabels[activeTab]}>
        <Animatable>{renderTab(activeTab)}</Animatable>
      </Fieldset>

      {/* Actions */}
      <div className={styles.actions}>{renderSubmitButton()}</div>
    </form>
  );
};

export type { ProjectFormValues, ProjectFormSchema };
