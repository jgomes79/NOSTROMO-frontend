import React, { useEffect, useRef } from "react";

import styles from "./TVNoise.module.scss";

/**
 * Props for the TVNoise component.
 *
 * @property {React.ReactNode} children - The child elements to be displayed within the TVNoise component.
 * @property {string} [className] - Optional className for additional styling.
 * @property {string} [opacity] - The opacity of the noise effect.
 */
interface TVNoiseProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly opacity?: string;
}

/**
 * TVNoise component that renders a canvas with a static noise effect
 * and displays any children elements on top of it.
 *
 * @param {TVNoiseProps} props - The props for the TVNoise component.
 * @returns {JSX.Element} The rendered TVNoise component.
 */
export const TVNoise: React.FC<TVNoiseProps> = ({ children, className, opacity = "0.2" }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const layoutRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const layout = layoutRef.current;
    if (!canvas || !layout) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = layout.clientWidth;
      canvas.height = layout.clientHeight;
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    canvas.style.opacity = opacity;

    const falloutGreenEffect = (ctx: CanvasRenderingContext2D) => {
      const w = ctx.canvas.width;
      const h = ctx.canvas.height;
      const d = ctx.createImageData(w, h);
      const b = new Uint32Array(d.data.buffer);
      const len = b.length;

      for (let i = 0; i < len; i++) {
        b[i] = (((255 * Math.random()) | 0) << 24) | 0xc7d2be;
      }

      ctx.putImageData(d, 0, 0);
    };

    const animate = () => {
      falloutGreenEffect(ctx);
      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  return (
    <div className={`${styles.layout} ${className || ""}`} ref={layoutRef}>
      <canvas ref={canvasRef} className={styles.monitor} />
      {children}
    </div>
  );
};
