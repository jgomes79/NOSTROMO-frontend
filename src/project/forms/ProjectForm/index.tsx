import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useCurrencies } from "@/currency/hooks/useCurrencies";
import { isSameObject } from "@/lib/object";
import { generateSlugOf } from "@/lib/string";
import { Button } from "@/shared/components/Button";
import { Fieldset } from "@/shared/components/Fieldset";
import { Tabs } from "@/shared/components/Tabs";
import { Typography } from "@/shared/components/Typography";
import { BasicInformationControl } from "./partials/BasicInformationControl";
import { DocumentationControl } from "./partials/DocumentationControl";
import { RaisingFundsControl } from "./partials/RaisingFundsControl";
import { SocialNetworksControl } from "./partials/SocialNetworksControl";
import { TokenInformationControl } from "./partials/TokenInformationControl";
import { VestingOptionsControl } from "./partials/VestingOptionsControl";

import { ProjectTabLabels } from "../../../project/project.constants";
import { ProjectFormTabs } from "../../../project/project.types";
import { getDefaultProjectFormValues } from "./ProjectForm.helpers";
import styles from "./ProjectForm.module.scss";
import { EntryFormSchema, OptionalFormSchema, ProjectFormSchema } from "./ProjectForm.schema";
import { ProjectFormProps, ProjectFormValues } from "./ProjectForm.types";

/**
 * ProjectForm component.
 *
 * @param defaultValues - The default values for the form.
 * @param onSubmit - The function to call when the form is submitted.
 * @returns A JSX element representing the project form.
 */
export const ProjectForm: React.FC<ProjectFormProps> = ({ defaultValues, isLoading, comments, onSubmit }) => {
  const { data: currencies, isLoading: isCurrenciesLoading } = useCurrencies();
  const [activeTab, setActiveTab] = useState<ProjectFormTabs>(ProjectFormTabs.BASIC_INFORMATION);

  const formMethods = useForm<ProjectFormValues>({
    defaultValues: defaultValues ?? getDefaultProjectFormValues(),
    resolver: zodResolver(defaultValues?.id ? OptionalFormSchema : EntryFormSchema),
    reValidateMode: "onChange",
    mode: "all",
  });

  const {
    watch,
    reset,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isDirty, isValid, errors, dirtyFields },
  } = formMethods;

  const name = watch("name");

  /**
   * Memoized value that determines if the form is ready to be published.
   * A form is considered ready for publishing when:
   * 1. All required fields pass schema validation
   * 2. The form is not in a dirty state (no unsaved changes)
   *
   * @returns True if the form is valid and not dirty, false otherwise
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
  const onSubmitHandler: SubmitHandler<ProjectFormValues> = () => {
    onSubmit(isPublishing, getValues());
  };

  /**
   * Renders the content for the specified tab in the project form.
   *
   * @returns {JSX.Element | null} The JSX element representing the tab content, or null if the tab is not recognized.
   */
  const renderTab = (): JSX.Element | null => {
    switch (activeTab) {
      case ProjectFormTabs.VESTING_OPTIONS:
        return <VestingOptionsControl control={control} errors={errors} dirtyFields={dirtyFields} />;

      case ProjectFormTabs.TOKEN_INFORMATION:
        return <TokenInformationControl control={control} errors={errors} dirtyFields={dirtyFields} />;

      case ProjectFormTabs.RAISING_FUNDS:
        return <RaisingFundsControl control={control} errors={errors} dirtyFields={dirtyFields} />;

      case ProjectFormTabs.DOCUMENTATION:
        return <DocumentationControl control={control} errors={errors} dirtyFields={dirtyFields} />;

      case ProjectFormTabs.SOCIAL_NETWORKS:
        return <SocialNetworksControl control={control} errors={errors} dirtyFields={dirtyFields} />;

      case ProjectFormTabs.BASIC_INFORMATION:
        return <BasicInformationControl control={control} errors={errors} dirtyFields={dirtyFields} />;

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
   * - Returns a "Send to review" primary button if form is valid but not dirty
   * - Returns a "Save Changes" secondary button if form is dirty
   * - Returns null if form is not dirty and invalid
   */
  const renderSubmitButton = () => {
    if (isPublishing) {
      return (
        <Button type={"submit"} isLoading={isLoading} variant={"solid"} color={"primary"} caption={"Send to review"} />
      );
    }

    if (!isDirty) {
      return null;
    }

    return (
      <Button
        type={"submit"}
        isLoading={isLoading}
        variant={"solid"}
        disabled={!isValid}
        color={"secondary"}
        caption={"Save Changes"}
      />
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
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmitHandler)} className={styles.form}>
        {comments && (
          <Fieldset title={"Review Comments"} variant={"warning"}>
            <div className={styles.comments}>
              <Typography size={"small"}>{comments}</Typography>
            </div>
          </Fieldset>
        )}

        {/* Tabs */}
        <div className={styles.tabs}>
          <Tabs<ProjectFormTabs>
            activeId={activeTab}
            itemClassName={styles.tab}
            tabs={currentTabs}
            onChange={(tabId) => setActiveTab(tabId)}
          />
        </div>

        {/* Page Container */}
        <Fieldset title={ProjectTabLabels[activeTab]}>{renderTab()}</Fieldset>

        {/* Actions */}
        <div className={styles.actions}>{renderSubmitButton()}</div>
      </form>
    </FormProvider>
  );
};

export type { ProjectFormSchema, ProjectFormValues };
