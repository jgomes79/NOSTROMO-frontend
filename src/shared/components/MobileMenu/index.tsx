import React, { useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { RiCloseFill } from "react-icons/ri";

import { getRoute } from "@/lib/router";
import { navigationMenu } from "@/shared/shared.constants";
import { USER_ROUTES } from "@/user/user.constants";
import { useQubicConnect } from "@/wallet/qubic/QubicConnectContext";

import styles from "./MobileMenu.module.scss";
import logo from "../../assets/images/logotype.png";
import { IconButton } from "../IconButton";

/**
 * Props for the MobileMenu component.
 * @property {() => void} onClose - Function to be called when the mobile menu should be closed.
 */
interface MobileMenuProps {
  readonly onClose: () => void;
}

/**
 * MobileMenu component that displays a navigation menu for mobile devices.
 *
 * @param {MobileMenuProps} props - The props for the MobileMenu component.
 * @returns {JSX.Element} The rendered MobileMenu component.
 */
export const MobileMenu: React.FC<MobileMenuProps> = ({ onClose }) => {
  const location = useLocation();
  const { wallet } = useQubicConnect();
  const initialLocation = React.useRef(location);

  /**
   * Combines the base navigation menu with conditional user settings route
   * @remarks
   * This array concatenates the base navigation menu items with an additional
   * "User Settings" route if a wallet account address exists
   * @returns An array of navigation items containing title and path properties
   */
  const navigationItems = [
    ...navigationMenu,
    ...(wallet?.publicKey
      ? [
          {
            title: "User Settings",
            path: getRoute(USER_ROUTES.MAIN),
          },
        ]
      : []),
  ];

  /**
   * Effect hook that checks for changes in the URL using react-router-dom's useLocation hook.
   * When the URL changes and is different from the original location when the component was rendered,
   * the onClose function is called to close the mobile menu.
   */
  useEffect(() => {
    if (location !== initialLocation.current) {
      onClose();
    }
  }, [location, onClose]);

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <Link to={"/"}>
          <img src={logo} alt="nostromo" width={140} />
        </Link>

        <IconButton size={"large"} variant={"ghost"} icon={<RiCloseFill />} onClick={onClose} />
      </div>
      <div className={styles.container}>
        <nav className={styles.navigator}>
          {navigationItems.map(({ title, path }) => (
            <NavLink key={path} to={path} className={({ isActive }) => (isActive ? styles.isActive : undefined)}>
              {title}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};
