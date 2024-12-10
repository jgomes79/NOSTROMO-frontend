import { useEffect, useRef } from "react";

import CardIcon from "@/shared/assets/icons/card-icon.svg";
import CoinsIcon from "@/shared/assets/icons/coins-icon.svg";
import VerifyIcon from "@/shared/assets/icons/verify-icon.svg";
import { Globe } from "@/shared/components/Globe";
import { Stepper } from "@/shared/components/Stepper";
import { Typography } from "@/shared/components/Typography";

import styles from "./HowToJoinSection.module.scss";

export const HowToJoinSection: React.FC = () => {
  // CRT effect setup
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

    // Set initial canvas dimensions and update on resize
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    canvas.style.opacity = "0.2"; // Increase opacity to make noise more visible

    const falloutGreenEffect = (ctx: CanvasRenderingContext2D) => {
      const w = ctx.canvas.width;
      const h = ctx.canvas.height;
      const d = ctx.createImageData(w, h);
      const b = new Uint32Array(d.data.buffer);
      const len = b.length;

      for (let i = 0; i < len; i++) {
        b[i] = (((255 * Math.random()) | 0) << 24) | 0x2e8b57; // Fallout 4 green color
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
    <div className={styles.layout} ref={layoutRef}>
      <canvas ref={canvasRef} className={styles.monitor} />
      <Globe />
      <div className={styles.field}>
        <Typography
          variant={"heading"}
          size={"large"}
          textAlign={"center"}
          textTransform={"uppercase"}
          as={"h1"}
          className={styles.title}
        >
          How to Join top trier web
        </Typography>
        <Typography variant={"body"} size={"large"} textAlign={"center"} className={styles.description}>
          Only three steps are needed for you to start enjoying all the advantages of NOSTROMO
        </Typography>
      </div>
      <div className={styles.steps}>
        <Stepper
          steps={[
            {
              icon: <CardIcon />,
              title: "Purchase $SFUND Tokens",
              description:
                "$SFUND is QUBIC token that enables its holders to participate in IDOs, INOs, stake and farm for passive income",
            },
            {
              icon: <CoinsIcon />,
              title: "Stake or farm your $SFUND ",
              description: "Add your $FUND to one of our staking or farming pools and earn passive income",
            },
            {
              icon: <VerifyIcon />,
              title: "You are all set!",
              description: "Now you can participate in the sales for tokens and NFTs of the best blockchain projects",
            },
          ]}
        />
      </div>
    </div>
  );
};
