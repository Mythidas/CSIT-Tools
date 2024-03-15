import { DependencyList, EffectCallback, useEffect, useRef } from "react";

export function useEffectOnce(effect: EffectCallback, deps?: DependencyList) {
  const isExecuted = useRef(false);

  useEffect(() => {
    if (isExecuted.current) {
      return;
    }

    effect();

    isExecuted.current = true;
  }, deps || []);
}
