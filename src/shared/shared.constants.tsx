import { RiDiscordFill, /*RiMediumFill, RiTelegramFill,*/ RiTwitterXFill } from "react-icons/ri";

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

/**
 * Array of social network links and their corresponding icons.
 * Used to display social media links in the application.
 *
 * @type {Array<{path: string, icon: JSX.Element}>}
 * @property {string} path - The URL of the social network
 * @property {JSX.Element} icon - React icon component for the social network
 */
export const socialNetworks = [
  {
    path: "https://discord.com/channels/1296427133488336927/1305960771414655036",
    icon: <RiDiscordFill />,
  },
  /*
  {
    path: "https://telegram.com",
    icon: <RiTelegramFill />,
  },
  {
    path: "https://medium.com",
    icon: <RiMediumFill />,
  },
  */
  {
    path: "https://x.com/NostromoPad",
    icon: <RiTwitterXFill />,
  },
];
