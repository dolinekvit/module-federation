import {
  getInstance,
  loadRemote,
  registerRemotes,
} from "@module-federation/runtime";
import type { ComponentType } from "react";

export interface RemoteModule {
  default: ComponentType;
}

export type RemoteLoader = () => Promise<RemoteModule>;

function findRegisteredRemote(alias: string) {
  const remote = getInstance()?.options.remotes.find(
    (candidate) => candidate.alias === alias,
  );

  if (!remote || !("entry" in remote)) {
    throw new Error(`Remote "${alias}" is not registered`);
  }

  return remote;
}

function withCacheBuster(entry: string): string {
  const url = new URL(entry, window.location.href);

  url.searchParams.set("retry", String(Date.now()));

  return url.toString();
}

async function loadFromFreshEntry(alias: string): Promise<RemoteModule> {
  const remote = findRegisteredRemote(alias);
  const freshRemote = { ...remote, entry: withCacheBuster(remote.entry) };

  registerRemotes([freshRemote], { force: true });

  const module = await loadRemote<RemoteModule>(`${alias}/App`);

  if (!module) {
    throw new Error(`Remote "${alias}" did not provide a module`);
  }

  return module;
}

export function createRemoteLoader(
  alias: string,
  loadFirstTime: RemoteLoader,
): RemoteLoader {
  let pending: Promise<RemoteModule> | undefined;
  let hasFailedBefore = false;

  const startLoading = () =>
    hasFailedBefore ? loadFromFreshEntry(alias) : loadFirstTime();

  const rememberFailure = (error: unknown): never => {
    hasFailedBefore = true;
    pending = undefined;
    throw error;
  };

  return () => {
    pending ??= startLoading().catch(rememberFailure);

    return pending;
  };
}
