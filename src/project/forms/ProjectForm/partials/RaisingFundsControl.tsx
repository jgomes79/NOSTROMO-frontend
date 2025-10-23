import { useCurrencies } from "@/currency/hooks/useCurrencies";
import { formatPrice } from "@/lib/number";
import { ThresholdCalculator } from "@/project/components/ThresholdCalculator";
import { DateInput } from "@/shared/components/DateInput";
import { Loader } from "@/shared/components/Loader";
import { RangeInput } from "@/shared/components/RangeInput";
import { Selector } from "@/shared/components/Selector";
import { TextInput } from "@/shared/components/TextInput";
import { Typography } from "@/shared/components/Typography";
import classNames from "clsx";
import React from "react";
import { Control, Controller, FieldErrors, FieldNamesMarkedBoolean, useFormContext } from "react-hook-form";
import { ProjectFormValues } from "../ProjectForm.types";

import styles from "../ProjectForm.module.scss";

interface RaisingFundsControlProps {
  readonly control: Control<ProjectFormValues>;
  readonly errors: FieldErrors<ProjectFormValues>;
  readonly dirtyFields: FieldNamesMarkedBoolean<ProjectFormValues>;
}

export const RaisingFundsControl = ({ control, errors, dirtyFields }: RaisingFundsControlProps) => {
  const { data: currencies, isLoading: isCurrenciesLoading } = useCurrencies();
  const { watch } = useFormContext<ProjectFormValues>();

  const amountToRaise = watch("amountToRaise");
  const threshold = watch("threshold");
  const tokenName = watch("tokenName");
  const currencyId = watch("currency.id");

  const currency = React.useMemo(
    () => currencies?.find((currency) => currency.id === Number(currencyId)),
    [currencies, currencyId],
  );

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
            <Controller
              name="amountToRaise"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label="Amount to Raise"
                  type="number"
                  placeholder="Amount to Raise"
                  symbol={currency?.name ?? ""}
                  description={
                    "Indicate the amount of funds you need to raise to make your project work. These will be expressed in the currency you select"
                  }
                  error={dirtyFields.amountToRaise ? errors.amountToRaise?.message : undefined}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
                />
              )}
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
        <Controller
          name="tokensForSale"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Token For Sale"
              type="number"
              placeholder={formatPrice(500000, undefined, 0)}
              symbol={tokenName ?? ""}
              description={
                "Indicate the amount of funds you need to raise to make your project work. These will be expressed in the currency you select"
              }
              error={dirtyFields.tokensForSale ? errors.tokensForSale?.message : undefined}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
            />
          )}
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
              placeholder="YYYY-MM-DD HH:mm"
              error={dirtyFields.startDate ? errors.startDate?.message : undefined}
            />
          )}
        />
      </div>
    </div>
  );
};
