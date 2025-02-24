import classNames from "clsx";

import styles from "./Image.module.scss";

type BaseProps = React.ImgHTMLAttributes<HTMLImageElement>;

/**
 * Props for the Image component.
 *
 * @param {string} url - The URL of the image to display.
 * @param {number} [size=100] - The size of the image (width and height).
 */
interface ImageProps extends Omit<BaseProps, "width" | "height" | "className" | "src" | "onError"> {
  url: string;
  size?: number;
  className?: string;
  borderRadius?: number;
}

/**
 * Image component that displays an image with a specified URL and size.
 *
 * @param {ImageProps} props - The props for the component.
 * @returns {JSX.Element} The rendered image element.
 */
export const Image: React.FC<ImageProps> = ({ url, alt, className, size = 100, borderRadius = 0, ...props }) => {
  return (
    <img
      alt={alt}
      width={size}
      height={size}
      style={{ borderRadius }}
      className={classNames(styles.layout, className)}
      src={url || "/invalid-image.png"}
      onError={(e) => {
        e.currentTarget.src = "/invalid-image.png";
      }}
      {...props}
    />
  );
};
