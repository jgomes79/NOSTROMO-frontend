import classNames from "clsx";
import React from "react";
import { Control, Controller, FieldErrors, FieldNamesMarkedBoolean, useFormContext } from "react-hook-form";

import { DateInput } from "@/shared/components/DateInput";
import { TextInput } from "@/shared/components/TextInput";

import styles from "../ProjectForm.module.scss";

import { ProjectFormValues } from "../ProjectForm.types";

interface VestingOptionsControlProps {
  readonly control: Control<ProjectFormValues>;
  readonly errors: FieldErrors<ProjectFormValues>;
  readonly dirtyFields: FieldNamesMarkedBoolean<ProjectFormValues>;
}

/**
 * VestingOptionsControl component.
 *
 * @param control - The control object from useForm.
 * @param errors - The errors object from useForm.
 * @param dirtyFields - The dirtyFields object from useForm.
 * @returns The VestingOptionsControl component.
 */
export const VestingOptionsControl = ({ control, errors, dirtyFields }: VestingOptionsControlProps) => {
  const { watch } = useFormContext<ProjectFormValues>();
  const tokenName = watch("tokenName");

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
            placeholder="YYYY-MM-DD HH:mm"
            error={dirtyFields.startDate ? errors.startDate?.message : undefined}
          />
        )}
      />
      <Controller
        name="unlockTokensTGE"
        control={control}
        render={({ field }) => (
          <TextInput
            {...field}
            label="Tokens Unlocked at TGE"
            type="number"
            placeholder="Tokens Unlocked at TGE"
            description={"Specify the percentage of tokens to be unlocked on the listing date."}
            maxLength={2}
            symbol={"%"}
            error={dirtyFields.unlockTokensTGE ? errors.unlockTokensTGE?.message : undefined}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
          />
        )}
      />
      <Controller
        name="cliff"
        control={control}
        render={({ field }) => (
          <TextInput
            {...field}
            label="Cliff Period"
            type="number"
            placeholder="Cliff Period"
            description={"Enter the number of days required before tokens can be released."}
            maxLength={2}
            disabled={!tokenName}
            error={dirtyFields.cliff ? errors.cliff?.message : undefined}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
          />
        )}
      />
      <Controller
        name="vestingDays"
        control={control}
        render={({ field }) => (
          <TextInput
            {...field}
            label="Vesting Duration"
            type="number"
            placeholder="Vesting Duration"
            maxLength={2}
            description={"Specify the number of days over which the token vesting will occur."}
            disabled={!tokenName}
            error={dirtyFields.vestingDays ? errors.vestingDays?.message : undefined}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
          />
        )}
      />
    </div>
  );
};
