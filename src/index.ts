import hotkeys, {KeyHandler} from "hotkeys-js";
import {useCallback, useEffect, useMemo} from "react";

type AvailableTags = 'INPUT' | 'TEXTAREA' | 'SELECT';

export type Options = {
  filter?: typeof hotkeys.filter;
  enableOnTags?: AvailableTags[];
  splitKey?: string;
  scope?: string;
  keyup?: boolean;
  keydown?: boolean;
  memoiseCallback?: boolean;
};

export function useHotkeys(keys: string, callback: KeyHandler, options?: Options): void;
export function useHotkeys(keys: string, callback: KeyHandler, deps?: any[]): void;
export function useHotkeys(keys: string, callback: KeyHandler, options?: Options, deps?: any[]): void;
export function useHotkeys(keys: string, callback: KeyHandler, options?: any[] | Options, deps?: any[]): void {
  if (options instanceof Array) {
    deps = options;
    options = undefined;
  }

  const {enableOnTags, filter, memoiseCallback = true} = options || {};

  const keyHandlerCallback = memoiseCallback ? useCallback(callback, deps || []) : callback;

  useEffect(() => {
    if (options && (options as Options).enableOnTags) {
      hotkeys.filter = ({target, srcElement}) => {
        // @ts-ignore
        const targetTagName = (target && target.tagName) || (srcElement && srcElement.tagName);

        return Boolean(targetTagName && enableOnTags && enableOnTags.includes(targetTagName as AvailableTags));
      };
    }

    if (filter) hotkeys.filter = filter;

    hotkeys(keys, (options as Options) || {}, keyHandlerCallback);

    return () => hotkeys.unbind(keys, keyHandlerCallback);
  }, [keyHandlerCallback, options]);
}
