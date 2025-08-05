import React from "react";
import { Accept, DropzoneOptions, useDropzone } from "react-dropzone";

import classNames from "clsx";

import { getFileIcon, formatSize } from "@/lib/file";
import { Typography } from "@/shared/components/Typography";
import { shortHex } from "@/wallet/wallet.helpers";

import styles from "./FileUpload.module.scss";

export type Value = File | string | undefined | null;

/**
 * Props for the FileUpload component.
 */
interface FileUploadProps {
  /**
   * The name of the file upload.
   */
  readonly name: string;
  /**
   * The icon of the file upload.
   */
  readonly icon: React.ReactNode;
  /**
   * The title of the file upload.
   */
  readonly title: string;
  /**
   * The description of the file upload.
   */
  readonly description?: string;
  /**
   * The attachment labels of the file upload.
   */
  readonly attachmentLabels?: {
    /**
     * The icon of the attachment labels.
     */
    icon: React.ReactNode;
    /**
     * The title of the attachment labels.
     */
    title: string;
    /**
     * The description of the attachment labels.
     */
    description?: string;
  };
  /**
   * The error of the file upload.
   */
  readonly error?: string;
  /**
   * The value of the file upload.
   */
  readonly value: Value;
  /**
   * The accepted formats of the file upload.
   */
  readonly accept: "images" | "documents";
  /**
   * The class name of the file upload.
   */
  readonly className?: string;
  /**
   * The onChange handler of the file upload.
   */
  readonly onChange: (file: Value) => void;
  /**
   * The onRender handler of the file upload.
   */
  readonly onRender?: (file: Value, getUrl: (file: Value) => string) => React.ReactNode;
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
    "image/webp": [".webp"],
    "image/avif": [".avif"],
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
 * @param {Value} props.value - The current value of the uploaded file.
 * @param {function} props.onRender - A function to render the uploaded file.
 * @param {function} props.onChange - A callback function triggered when a file is dropped.
 * @param {string} [props.className] - Additional class names for styling.
 * @param {string} [props.error] - The error message to display.
 * @param {React.Ref<HTMLDivElement>} ref - The ref to the root div element.
 *
 * @returns {JSX.Element} The rendered FileUpload component.
 */
export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  ({ name, icon, title, description, accept, value, attachmentLabels, onRender, onChange, className, error }, ref) => {
    /**
     * Handles the file drop event and triggers the onChange callback.
     *
     * @param {File[]} acceptedFiles - The files dropped by the user.
     */
    const onDrop: NonNullable<DropzoneOptions["onDrop"]> = (acceptedFiles) => {
      onChange(acceptedFiles[0]);
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
      maxFiles: 1,
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
     * Checks if there is a defined value.
     *
     * @type {boolean}
     */
    const hasValue = !!value;

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
            {shortHex(title, 10)}
          </Typography>
          {description && (
            <Typography as={"p"} variant={"body"} size={"small"} textAlign={"center"} className={styles.description}>
              {description}
            </Typography>
          )}
        </div>
      </>
    );

    /**
     * Renders the input component based on the current value and provided props.
     *
     * @returns {React.ReactNode} The rendered input component.
     */
    const renderInput = (): React.ReactNode => {
      if (hasValue) {
        if (onRender) {
          return onRender(value, getURL);
        }

        if (attachmentLabels) {
          return renderFileAttachment(attachmentLabels.title, attachmentLabels.icon, attachmentLabels.description);
        }

        if (value instanceof File) {
          return renderFileAttachment(value.name, getFileIcon(value.type), formatSize(value.size));
        }
      }
      return renderFileAttachment(title, icon, description);
    };

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
        {renderInput()}

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
