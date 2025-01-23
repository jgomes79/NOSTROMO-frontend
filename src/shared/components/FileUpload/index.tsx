import React from "react";
import { Accept, DropzoneOptions, useDropzone } from "react-dropzone";

import classNames from "clsx";

import { getFileIcon, formatSize } from "@/lib/file";
import { Typography } from "@/shared/components/Typography";

import styles from "./FileUpload.module.scss";

export type Value = string | File | undefined;

/**
 * Props for the FileUpload component.
 */
interface FileUploadProps {
  /**
   * The name of the file upload.
   */
  readonly name: string;

  /**
   * The icon to display in the upload area.
   */
  readonly icon: React.ReactNode;

  /**
   * The title text to display in the upload area.
   */
  readonly title: string;

  /**
   * The description text to display in the upload area.
   */
  readonly description?: string;

  /**
   * The maximum number of files that can be uploaded.
   */
  readonly maxFiles: number;

  /**
   * The error message to display.
   */
  readonly error?: string;

  /**
   * The current value of the uploaded files.
   */
  readonly value: Value[];

  /**
   * The type of files to accept.
   */
  readonly accept: "images" | "documents";

  /**
   * Additional class names for styling.
   */
  readonly className?: string;

  /**
   * A callback function triggered when files are dropped.
   *
   * @param {Value[]} files - The files that were dropped.
   */
  readonly onChange: (files: Value[]) => void;

  /**
   * A function to render the uploaded files.
   *
   * @param {Value[]} files - The files that were uploaded.
   * @param {function} getUrl - A function to get the URL of a file.
   * @returns {React.ReactNode} The rendered files.
   */
  readonly onRender?: (files: Value[], getUrl: (file: Value) => string) => React.ReactNode;
}

/**
 * A map of accepted formats for file uploads.
 *
 * @type {Record<Required<FileUploadProps>["accept"], Accept>}
 * - images: Accepts PNG, JPEG, and GIF formats.
 * - documents: Accepts PDF format.
 */
const acceptedFormats: Record<Required<FileUploadProps>["accept"], Accept> = {
  images: {
    "image/png": [".png"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/gif": [".gif"],
  },
  documents: {
    "application/pdf": [".pdf"],
  },
};

/**
 * FileUpload component.
 *
 * This component provides a drag-and-drop interface for uploading files.
 *
 * @param {FileUploadProps} props - The properties for the FileUpload component.
 * @param {string} props.name - The name of the file upload.
 * @param {React.ReactNode} props.icon - The icon to display in the upload area.
 * @param {string} props.title - The title text to display in the upload area.
 * @param {string} props.description - The description text to display in the upload area.
 * @param {"images" | "documents"} props.accept - The type of files to accept.
 * @param {number} props.maxFiles - The maximum number of files that can be uploaded.
 * @param {Value[]} props.value - The current value of the uploaded files.
 * @param {function} props.onRender - A function to render the uploaded files.
 * @param {function} props.onChange - A callback function triggered when files are dropped.
 * @param {string} [props.className] - Additional class names for styling.
 * @param {string} [props.error] - The error message to display.
 * @param {React.Ref<HTMLDivElement>} ref - The ref to the root div element.
 *
 * @returns {JSX.Element} The rendered FileUpload component.
 */
export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  ({ name, icon, title, description, accept, maxFiles, value, onRender, onChange, className, error }, ref) => {
    /**
     * Handles the file drop event and triggers the onChange callback.
     *
     * @param {File[]} acceptedFiles - The files dropped by the user.
     */
    const onDrop: NonNullable<DropzoneOptions["onDrop"]> = (acceptedFiles) => {
      onChange(acceptedFiles);
    };

    /**
     * Initializes the useDropzone hook with specified options.
     *
     * @see {@link https://react-dropzone.js.org/ React Dropzone Documentation}
     *
     * @param {DropzoneOptions} options - The dropzone options.
     * @param {Accept} options.accept - The accepted file formats.
     * @param {number} options.maxFiles - The maximum number of files.
     * @param {NonNullable<DropzoneOptions["onDrop"]>} options.onDrop - The function to handle file drops.
     *
     * @return {object} The props and state from useDropzone.
     */
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: acceptedFormats[accept],
      maxFiles,
      onDrop,
    });

    /**
     * Generates a URL for the provided file.
     *
     * @param {Value} file - The file or string URL to generate a URL for.
     * @returns {string} - The generated URL for the file.
     */
    const getURL = (file: Value): string => {
      if (!file) return "";

      if (file instanceof File) {
        return URL.createObjectURL(file).toString();
      }
      return file;
    };

    /**
     * Checks if there are any defined values in the array.
     *
     * @type {boolean}
     */
    const hasValue = value.some((e) => typeof e !== "undefined");

    /**
     * Renders the file attachment component.
     *
     * @param {string} title - The title of the file attachment.
     * @param {React.ReactNode} icon - The icon to display for the file attachment.
     * @param {string} [description] - The optional description of the file attachment.
     * @returns {JSX.Element} The JSX element representing the file attachment.
     */
    const renderFileAttachment = (title: string, icon: React.ReactNode, description?: string): JSX.Element => (
      <>
        <div className={styles.icon}>{icon}</div>
        <div className={styles.container}>
          <Typography variant={"heading"} as={"h3"} size={"medium"} textAlign={"center"}>
            {title}
          </Typography>
          {description && (
            <Typography as={"p"} variant={"body"} size={"small"} textAlign={"center"} className={styles.description}>
              {description}
            </Typography>
          )}
        </div>
      </>
    );

    return (
      <div
        ref={ref}
        {...getRootProps()}
        className={classNames([
          styles.layout,
          className,
          { [styles.isDragActive]: isDragActive, [styles.hasValue]: hasValue && !!onRender },
        ])}
      >
        {hasValue
          ? onRender
            ? onRender(value, getURL)
            : renderFileAttachment(
                (value as File[])[0].name,
                getFileIcon((value as File[])[0].type),
                formatSize((value as File[])[0].size),
              )
          : renderFileAttachment(title, icon, description)}

        <input name={name} {...getInputProps()} />

        {error && (
          <Typography size={"medium"} variant="body" className={styles.error}>
            {error}
          </Typography>
        )}
      </div>
    );
  },
);

FileUpload.displayName = "FileUpload";
