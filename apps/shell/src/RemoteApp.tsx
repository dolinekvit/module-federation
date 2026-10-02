import { Component, Suspense, lazy, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { RemoteLoader } from "./remoteLoader";

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

interface RemoteAppProps {
  name: string;
  load: RemoteLoader;
}

export function RemoteApp({ name, load }: RemoteAppProps) {
  const [attempt, setAttempt] = useState(0);
  const Remote = useMemo(() => lazy(load), [load, attempt]);

  return (
    <ErrorBoundary
      key={attempt}
      fallback={
        <div className="remote-error" role="alert">
          <p>{name} is unavailable.</p>
          <button type="button" onClick={() => setAttempt((n) => n + 1)}>
            Retry
          </button>
        </div>
      }
    >
      <Suspense fallback={<p className="remote-loading">Loading {name}…</p>}>
        <Remote />
      </Suspense>
    </ErrorBoundary>
  );
}
