import { RiDiscordFill, RiMediumFill, RiTelegramFill, RiTwitterXFill } from "react-icons/ri";

import { LAUNCHPAD_ROUTES } from "@/launchpad/launchpad.constants";

export const MODULE_SHARED = "shared";

/**
 * Navigation menu items for the application.
 * Each item contains a title and a path.
 */
export const navigationMenu = [
  {
    title: "IDO Launchpad",
    path: LAUNCHPAD_ROUTES.MAIN,
  },
];

export const socialNetworks = [
  {
    path: "https://discord.com",
    icon: <RiDiscordFill />,
  },
  {
    path: "https://telegram.com",
    icon: <RiTelegramFill />,
  },
  {
    path: "https://medium.com",
    icon: <RiMediumFill />,
  },
  {
    path: "https://x.com",
    icon: <RiTwitterXFill />,
  },
];
