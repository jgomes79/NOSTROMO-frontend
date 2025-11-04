import type { Dispatch, ReactNode, Reducer } from "react";
import { createContext, useEffect, useReducer } from "react";

import type { MetamaskState, Snap } from "../wallet.types";
import { MetamaskActions } from "../wallet.types";
import { detectSnaps, getSnap, isFlask } from "./utils";

const initialState: MetamaskState = {
  snapsDetected: false,
  isFlask: false,
};

type MetamaskDispatchPayload = {
  [MetamaskActions.SetInstalled]: Snap;
  [MetamaskActions.SetSnapsDetected]: boolean;
  [MetamaskActions.SetIsFlask]: boolean;
  [MetamaskActions.SetError]: Error | undefined;
};

interface MetamaskDispatch<T extends MetamaskActions> {
  type: T;
  payload: MetamaskDispatchPayload[T];
}

const MetaMaskContext = createContext<[MetamaskState, Dispatch<MetamaskDispatch<MetamaskActions>>]>([
  initialState,
  () => {
    /* no op */
  },
]);

const reducer: Reducer<MetamaskState, MetamaskDispatch<MetamaskActions>> = (state, action) => {
  switch (action.type) {
    case MetamaskActions.SetInstalled:
      return {
        ...state,
        installedSnap: action.payload as Snap,
      };

    case MetamaskActions.SetSnapsDetected:
      return {
        ...state,
        snapsDetected: action.payload as boolean,
      };

    case MetamaskActions.SetIsFlask:
      return {
        ...state,
        isFlask: action.payload as boolean,
      };
    case MetamaskActions.SetError:
      return {
        ...state,
        error: action.payload as Error | undefined,
      };
    default:
      return state;
  }
};

/**
 * MetaMask context provider to handle MetaMask and snap status.
 *
 * @param props - React Props.
 * @param props.children - React component to be wrapped by the Provider.
 * @returns JSX.
 */
export const MetaMaskProvider = ({ children }: { readonly children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Find MetaMask Provider and search for Snaps
  // Also checks if MetaMask version is Flask
  useEffect(() => {
    try {
      const setSnapsCompatibility = async () => {
        dispatch({
          type: MetamaskActions.SetSnapsDetected,
          payload: await detectSnaps(),
        });
      };

      setSnapsCompatibility().catch((error: Error) => {
        console.error("Error during initialization:", error);
      });
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, []);

  // Set installed snaps
  useEffect(() => {
    /**
     * Detect if a snap is installed and set it in the state.
     */
    async function detectSnapInstalled() {
      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: await getSnap(),
      });
    }

    const checkIfFlask = async () => {
      dispatch({
        type: MetamaskActions.SetIsFlask,
        payload: await isFlask(),
      });
    };

    if (state.snapsDetected) {
      detectSnapInstalled().catch(console.error);
      checkIfFlask().catch(console.error);
    }
  }, [state.snapsDetected]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (state.error) {
      timeoutId = setTimeout(() => {
        dispatch({
          type: MetamaskActions.SetError,
          payload: undefined,
        });
      }, 10000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [state.error]);

  // TODO check this position
  if (typeof window === "undefined") {
    return <>{children}</>;
  }

  return <MetaMaskContext.Provider value={[state, dispatch]}>{children}</MetaMaskContext.Provider>;
};

export { MetaMaskContext };
