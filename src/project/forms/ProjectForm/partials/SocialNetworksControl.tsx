import { TextInput } from "@/shared/components/TextInput";
import classNames from "clsx";
import { Control, Controller, FieldErrors, FieldNamesMarkedBoolean } from "react-hook-form";
import { RiDiscordFill, RiInstagramFill, RiMediumFill, RiTelegramFill, RiTwitterXFill } from "react-icons/ri";
import { ProjectFormValues } from "../ProjectForm.types";

import styles from "../ProjectForm.module.scss";

interface SocialNetworksControlProps {
  readonly control: Control<ProjectFormValues>;
  readonly errors: FieldErrors<ProjectFormValues>;
  readonly dirtyFields: FieldNamesMarkedBoolean<ProjectFormValues>;
}

export const SocialNetworksControl = ({ control, errors, dirtyFields }: SocialNetworksControlProps) => {
  return (
    <div className={classNames(styles.grid, styles.two)}>
      <Controller
        name="social.discordUrl"
        control={control}
        render={({ field }) => (
          <TextInput
            {...field}
            label="Discord URL"
            type="text"
            placeholder="https://discord.com/invite..."
            icon={<RiDiscordFill />}
            error={dirtyFields.social?.discordUrl ? errors.social?.discordUrl?.message : undefined}
          />
        )}
      />
      <Controller
        name="social.instagramUrl"
        control={control}
        render={({ field }) => (
          <TextInput
            {...field}
            label="Instagram URL"
            type="text"
            placeholder="https://www.instagram.com/..."
            icon={<RiInstagramFill />}
            error={dirtyFields.social?.instagramUrl ? errors.social?.instagramUrl?.message : undefined}
          />
        )}
      />
      <Controller
        name="social.mediumUrl"
        control={control}
        render={({ field }) => (
          <TextInput
            {...field}
            label="Medium URL"
            type="text"
            placeholder="https://medium.com/@..."
            icon={<RiMediumFill />}
            error={dirtyFields.social?.mediumUrl ? errors.social?.mediumUrl?.message : undefined}
          />
        )}
      />
      <Controller
        name="social.xUrl"
        control={control}
        render={({ field }) => (
          <TextInput
            {...field}
            label="X URL"
            type="text"
            placeholder="https://x.com/..."
            icon={<RiTwitterXFill />}
            error={dirtyFields.social?.xUrl ? errors.social?.xUrl?.message : undefined}
          />
        )}
      />
      <Controller
        name="social.telegramUrl"
        control={control}
        render={({ field }) => (
          <TextInput
            {...field}
            label="Telegram URL"
            type="text"
            placeholder="https://t.me/..."
            icon={<RiTelegramFill />}
            error={dirtyFields.social?.telegramUrl ? errors.social?.telegramUrl?.message : undefined}
          />
        )}
      />
    </div>
  );
};
