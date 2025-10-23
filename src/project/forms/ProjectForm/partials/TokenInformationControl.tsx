import classNames from "clsx";
import React from "react";
import { Control, Controller, useFormContext, FieldErrors, FieldNamesMarkedBoolean } from "react-hook-form";
import { RiImageAddLine } from "react-icons/ri";
import { ProjectFormValues } from "../ProjectForm.types";
import { FileUpload } from "@/shared/components/FileUpload";
import { TextInput } from "@/shared/components/TextInput";
import { formatPrice } from "@/lib/number";

import styles from "../ProjectForm.module.scss";

interface TokenInformationControlProps {
  readonly control: Control<ProjectFormValues>;
  readonly errors: FieldErrors<ProjectFormValues>;
  readonly dirtyFields: FieldNamesMarkedBoolean<ProjectFormValues>;
}

export const TokenInformationControl = ({ control, errors, dirtyFields }: TokenInformationControlProps) => {
  const { watch } = useFormContext<ProjectFormValues>();
  const tokenImage = watch("tokenImageUrl");
  const tokenName = watch("tokenName");

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
          <Controller
            name="tokenName"
            control={control}
            render={({ field }) => (
              <TextInput {...field} label="Token Name" placeholder="Tokens Name" upperCase={true} />
            )}
          />
        </div>
        <div className={classNames(styles.grid, styles.two, !tokenName && styles.disabled)}>
          <Controller
            name="tokensSupply"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                label="Total Supply"
                type="number"
                placeholder={formatPrice(500000)}
                symbol={tokenName ?? ""}
                disabled={!tokenName}
                error={dirtyFields.tokensSupply ? errors.tokensSupply?.message : undefined}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};
