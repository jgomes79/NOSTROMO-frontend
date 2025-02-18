import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component
 *
 * This component listens for changes in the current location (pathname)
 * and scrolls the window to the top smoothly whenever the pathname changes.
 *
 * @returns {null} This component does not render anything to the DOM.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    const currentPath = pathname.split("/");
    const previousPath = previousPathname.current.split("/");

    if (currentPath[1] !== previousPath[1]) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);

  return null;
};
