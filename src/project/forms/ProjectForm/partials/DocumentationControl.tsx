import { Button } from "@/shared/components/Button";
import { FileUpload } from "@/shared/components/FileUpload";
import classNames from "clsx";
import { Control, Controller, FieldErrors, FieldNamesMarkedBoolean, useFormContext } from "react-hook-form";
import { RiCheckLine, RiDownloadLine, RiFileAddLine } from "react-icons/ri";
import { ProjectFormValues } from "../ProjectForm.types";

import styles from "../ProjectForm.module.scss";

interface DocumentationControlProps {
  readonly control: Control<ProjectFormValues>;
  readonly errors: FieldErrors<ProjectFormValues>;
  readonly dirtyFields: FieldNamesMarkedBoolean<ProjectFormValues>;
}

export const DocumentationControl = ({ control, errors, dirtyFields }: DocumentationControlProps) => {
  const { watch } = useFormContext<ProjectFormValues>();

  const whitepaperUrl = watch("whitepaperUrl");
  const tokenomicsUrl = watch("tokenomicsUrl");
  const litepaperUrl = watch("litepaperUrl");

  return (
    <div className={classNames(styles.grid, styles.three)}>
      <div className={classNames(styles.grid, styles.one)}>
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
        {whitepaperUrl && typeof whitepaperUrl === "string" && (
          <Button
            iconRight={<RiDownloadLine />}
            variant={"solid"}
            caption={"Download File"}
            onClick={() => {
              window.open(whitepaperUrl, "_blank");
            }}
          />
        )}
      </div>

      <div className={classNames(styles.grid, styles.one)}>
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
        {tokenomicsUrl && typeof tokenomicsUrl === "string" && (
          <Button
            iconRight={<RiDownloadLine />}
            caption={"Download File"}
            onClick={() => {
              window.open(tokenomicsUrl, "_blank");
            }}
          />
        )}
      </div>

      <div className={classNames(styles.grid, styles.one)}>
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
        {litepaperUrl && typeof litepaperUrl === "string" && (
          <Button
            iconRight={<RiDownloadLine />}
            caption={"Download File"}
            onClick={() => {
              window.open(litepaperUrl, "_blank");
            }}
          />
        )}
      </div>
    </div>
  );
};
