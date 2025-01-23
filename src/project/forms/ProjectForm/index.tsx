import React, { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "clsx";
import { addMonths } from "date-fns";
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
export const ProjectForm: React.FC<ProjectFormProps> = ({ defaultValues, isLoading, onSubmit }) => {
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
    defaultValues: defaultValues ?? {
      name: "",
      slug: "",
      description: "",
      photo: undefined,
      banner: undefined,
      social: {
        discordUrl: "",
        instagramUrl: "",
        mediumUrl: "",
        xUrl: "",
        telegramUrl: "",
      },
      whitepaper: undefined,
      tokenomics: undefined,
      litepaper: undefined,
      tokenName: "",
      tokenImage: undefined,
      tokensSupply: 0,
      tokenDecimals: 0,
      amountToRaise: 0,
      threshold: 15,
      tokensForSale: 0,
      unlockTokensTGE: 0,
      startDate: addMonths(new Date(), 1),
      TGEDate: addMonths(new Date(), 1),
      cliff: 0,
      vestingDays: 0,
      currency: undefined,
    },
    resolver: zodResolver(ProjectFormSchema),
    reValidateMode: "onChange",
    mode: "all",
  });

  console.log(errors);

  const amountToRaise = watch("amountToRaise"),
    threshold = watch("threshold"),
    tokenName = watch("tokenName"),
    tokenImage = watch("tokenImage"),
    currencyId = watch("currency.id");

  /**
   * An object that checks the completion status of each tab in the project form.
   * Each key corresponds to a tab, and the value is a boolean indicating whether
   * all required fields in that tab are filled and error-free.
   */
  const tabCompletionChecks: Record<ProjectFormTabs, boolean | undefined> = {
    [ProjectFormTabs.BASIC_INFORMATION]:
      !errors.banner &&
      !errors.photo &&
      !errors.name &&
      !errors.slug &&
      !errors.description &&
      dirtyFields.banner &&
      dirtyFields.photo &&
      dirtyFields.name &&
      dirtyFields.slug &&
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
      !errors.amountToRaise &&
      !errors.threshold &&
      !errors.tokensForSale &&
      !errors.startDate &&
      dirtyFields.amountToRaise &&
      dirtyFields.threshold &&
      dirtyFields.tokensForSale &&
      dirtyFields.startDate,
    [ProjectFormTabs.VESTING_OPTIONS]:
      !errors.TGEDate &&
      !errors.cliff &&
      !errors.vestingDays &&
      dirtyFields.TGEDate &&
      dirtyFields.cliff &&
      dirtyFields.vestingDays,
  };

  /**
   * An array of objects representing the current tabs in the project form.
   * Each object contains the tab's id, label, and an optional icon indicating
   * the completion status of the tab.
   */
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
              description={"Specify the number of tokens to be unlocked on the listing date."}
              maxLength={2}
              disabled={!tokenName}
              symbol={tokenName}
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
              name="tokenImage"
              key={"tokenImage"}
              control={control}
              render={({ field }) => (
                <FileUpload
                  name={"tokenImage"}
                  icon={<RiImageAddLine />}
                  title={"Token Image"}
                  maxFiles={1}
                  className={styles.avatarImg}
                  accept="images"
                  value={[tokenImage]}
                  onChange={(files) => field.onChange(files[0])}
                  onRender={(photos, getUrl) => (
                    <div className={styles.imagePreview}>
                      <img src={getUrl(photos[0])} />
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
                      {threshold && threshold > 0 && (
                        <div className={classNames(styles.grid, styles.two, styles.amountToRaise)}>
                          <TextInput
                            label="Minimum Amount"
                            type="string"
                            placeholder="Minimum Amount"
                            symbol={currency?.name ?? ""}
                            value={
                              amountToRaise && amountToRaise > 0
                                ? formatPrice(amountToRaise - (amountToRaise * threshold) / 100)
                                : 0
                            }
                            disabled
                          />
                          <TextInput
                            label="Maximum Amount"
                            type="string"
                            placeholder="Maximum Amount"
                            symbol={currency?.name ?? ""}
                            value={
                              amountToRaise && amountToRaise > 0
                                ? formatPrice(amountToRaise + (amountToRaise * threshold) / 100)
                                : 0
                            }
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
              name="whitepaper"
              control={control}
              key={"whitepaper"}
              render={({ field }) => (
                <FileUpload
                  name={"whitepaper"}
                  icon={<RiFileAddLine />}
                  title={"Whitepaper"}
                  description={"Drag and drop, or click to upload the project whitepaper"}
                  maxFiles={1}
                  accept="documents"
                  value={[field.value]}
                  error={errors.whitepaper?.message}
                  onChange={(files) => field.onChange(files[0])}
                />
              )}
            />
            <Controller
              name="tokenomics"
              control={control}
              key={"tokenomics"}
              render={({ field }) => (
                <FileUpload
                  name={"tokenomics"}
                  icon={<RiFileAddLine />}
                  title={"Tokenomics"}
                  description={"Drag and drop, or click to upload the tokenomics document"}
                  maxFiles={1}
                  accept="documents"
                  value={[field.value]}
                  error={dirtyFields.tokenomics ? errors.tokenomics?.message : undefined}
                  onChange={(files) => field.onChange(files[0])}
                />
              )}
            />
            <Controller
              name="litepaper"
              control={control}
              key={"litepaper"}
              render={({ field }) => (
                <FileUpload
                  name={"litepaper"}
                  icon={<RiFileAddLine />}
                  title={"Litepaper"}
                  description={"Drag and drop, or click to upload the project litepaper"}
                  maxFiles={1}
                  accept="documents"
                  value={[field.value]}
                  error={dirtyFields.litepaper ? errors.litepaper?.message : undefined}
                  onChange={(files) => field.onChange(files[0])}
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
                name="banner"
                control={control}
                key={"banner"}
                render={({ field }) => (
                  <FileUpload
                    name={"banner"}
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
                  key={"photo"}
                  render={({ field }) => (
                    <FileUpload
                      name={"photo"}
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
                placeholder="Project Name"
                error={dirtyFields.name ? errors.name?.message : undefined}
                {...register("name")}
              />
              <TextInput
                label="Project Slug"
                type="text"
                placeholder="Project Slug"
                error={dirtyFields.slug ? errors.slug?.message : undefined}
                {...register("slug")}
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
      setValue("currency", currencies[0]);
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
        <Button type={"reset"} variant={"solid"} color={"red"} caption={"Discard Changes"} />
        <Button type={"submit"} isLoading={isLoading} variant={"solid"} color={"secondary"} caption={"Save Changes"} />
      </div>
    </form>
  );
};

export type { ProjectFormValues, ProjectFormSchema };
