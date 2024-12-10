import { useState, useCallback } from "react";

export const useLaunchpadController = () => {
  const [isHowToBuyIdoOpen, setIsHowToBuyIdoOpen] = useState<boolean>(false);

  /**
   * Toggles the state to open the "How to Buy IDO" section.
   */
  const toggleHowToBuyIdo = useCallback(() => {
    setIsHowToBuyIdoOpen((prev) => !prev);
  }, []);

  return { isHowToBuyIdoOpen, toggleHowToBuyIdo };
};
