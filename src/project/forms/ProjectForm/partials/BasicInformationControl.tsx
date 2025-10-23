import { FileUpload } from "@/shared/components/FileUpload";
import { TextArea } from "@/shared/components/TextArea";
import { TextInput } from "@/shared/components/TextInput";
import classNames from "clsx";
import { Control, Controller, FieldErrors, FieldNamesMarkedBoolean, useFormContext } from "react-hook-form";
import { RiImageAddLine } from "react-icons/ri";
import { ProjectFormValues } from "../ProjectForm.types";

import styles from "../ProjectForm.module.scss";

interface BasicInformationControlProps {
  readonly control: Control<ProjectFormValues>;
  readonly errors: FieldErrors<ProjectFormValues>;
  readonly dirtyFields: FieldNamesMarkedBoolean<ProjectFormValues>;
}

export const BasicInformationControl = ({ control, errors, dirtyFields }: BasicInformationControlProps) => {
  const { watch } = useFormContext<ProjectFormValues>();
  const slug = watch("slug");

  return (
    <div className={classNames(styles.grid, styles.one)}>
      <div className={styles.banner}>
        <Controller
          name="bannerUrl"
          control={control}
          key={"bannerUrl"}
          render={({ field }) => (
            <FileUpload
              name={"bannerUrl"}
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
            key={"photoUrl"}
            render={({ field }) => (
              <FileUpload
                name={"photoUrl"}
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
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Project Name"
              type="text"
              placeholder="Project Name"
              error={errors.name?.message}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Contact Email"
              type="text"
              placeholder="Contact Email"
              error={errors.email?.message}
            />
          )}
        />
      </div>

      <div className={classNames(styles.grid, styles.two)}>
        <Controller
          name="slug"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Project Slug"
              type="text"
              placeholder="Project URLs"
              error={errors.slug?.message}
              note={`${window.location.origin}/project/${slug}`}
            />
          )}
        />
        <Controller
          name="websiteUrl"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Project Website URL"
              type="text"
              placeholder="Project Website URL"
              error={errors.websiteUrl?.message}
            />
          )}
        />
      </div>

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextArea
            {...field}
            label="Project Description"
            placeholder="Write an appropriate and detailed description of your project that is attractive and clear for users. Make sure to include objectives, main features, and any relevant information that may capture the interest of potential users."
            error={dirtyFields.description ? errors.description?.message : undefined}
          />
        )}
      />
    </div>
  );
};
