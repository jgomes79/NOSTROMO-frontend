import type { Dispatch, ReactNode, Reducer } from "react";
import { createContext, useEffect, useReducer } from "react";

import { detectSnaps, getSnap, isFlask } from "./utils";
import type { Snap } from "../qubic/types";

export interface MetamaskState {
  snapsDetected: boolean;
  isFlask: boolean;
  installedSnap?: Snap;
  error?: Error;
}

const initialState: MetamaskState = {
  snapsDetected: false,
  isFlask: false,
};

interface MetamaskDispatch<T extends MetamaskActions> {
  type: T;
  payload: T extends MetamaskActions.SetInstalled
    ? Snap
    : T extends MetamaskActions.SetSnapsDetected | MetamaskActions.SetIsFlask
      ? boolean
      : T extends MetamaskActions.SetError
        ? Error | undefined
        : never;
}

export const MetaMaskContext = createContext<[MetamaskState, Dispatch<MetamaskDispatch<MetamaskActions>>]>([
  initialState,
  () => {
    /* no op */
  },
]);

export enum MetamaskActions {
  SetInstalled = "SetInstalled",
  SetSnapsDetected = "SetSnapsDetected",
  SetError = "SetError",
  SetIsFlask = "SetIsFlask",
}

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
