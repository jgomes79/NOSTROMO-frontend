import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { RiArrowUpCircleLine } from "react-icons/ri";

import { Button } from "@/shared/components/Button";
import { TextInput } from "@/shared/components/TextInput";
import { Tiers } from "@/tier/tier.types";

import { getDefaultInvestmentFormValues } from "./InvestmentForm.helpers";
import styles from "./InvestmentForm.module.scss";
import { InvestmentFormSchema } from "./InvestmentForm.schema";
import { InvestmentFormProps, InvestmentFormValues } from "./InvestmentForm.types";

/**
 * ProjectForm component.
 *
 * @param defaultValues - The default values for the form.
 * @param onSubmit - The function to call when the form is submitted.
 * @returns A JSX element representing the project form.
 */
export const InvestmentForm: React.FC<InvestmentFormProps> = ({ user, token, isLoading, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<InvestmentFormValues>({
    defaultValues: getDefaultInvestmentFormValues(),
    resolver: zodResolver(InvestmentFormSchema),
    reValidateMode: "onChange",
    mode: "all",
  });

  /**
   * Handles the form submission.
   *
   * @param {InvestmentFormValues} data - The validated form data from the investment form
   * @returns {void} - Calls the onSubmit callback with the form data
   */
  const onSubmitHandler: SubmitHandler<InvestmentFormValues> = (data: InvestmentFormValues) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className={styles.form}>
      <div className={styles.field}>
        <TextInput
          label="Amount"
          type={"number"}
          max={user.maxInvestment}
          symbol={token.currency.name}
          min={0.01}
          error={errors.amount?.message}
          {...register("amount", {
            valueAsNumber: true,
          })}
        />
      </div>
      <div className={styles.actions}>
        <Button caption="Invest" isLoading={isLoading} disabled={!isValid} color="primary" size="small" />
        {user.tier.id < Tiers.TIER_WARRIOR && (
          <Button
            iconLeft={<RiArrowUpCircleLine />}
            caption="Upgrade Tier"
            variant={"solid"}
            color="warning"
            size="small"
          />
        )}
      </div>
    </form>
  );
};

export type { InvestmentFormValues, InvestmentFormSchema };
