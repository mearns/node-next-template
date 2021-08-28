import { useMemo } from "react";

const useRenderer = (child) => {
  return useMemo(() => {
    if (typeof child === "function") {
      return child;
    }
    return () => child;
  }, [child]);
};

export default useRenderer;
