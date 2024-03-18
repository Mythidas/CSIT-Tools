import { DependencyList, EffectCallback, useEffect, useRef } from "react";

export function useEffectOnce(effect: EffectCallback, deps?: DependencyList) {
  const isExecuted = useRef(false);
  const prevDeps = useRef(deps);

  useEffect(() => {
    if (!isExecuted.current) {
      effect();
      isExecuted.current = true;
    } else if (!isEqual(prevDeps.current, deps)) {
      effect();
      prevDeps.current = deps;
    }
  }, deps || []);
}

function isEqual(a: DependencyList | undefined, b: DependencyList | undefined): boolean {
  if (a === b) return true; // Basic reference equality
  if (a?.length !== b?.length) return false;
  if (!a || !b) return false;

  for (let i = 0; i < a?.length; i++) {
    if (a[i] !== b[i]) return false;  
  }

  return true;
}