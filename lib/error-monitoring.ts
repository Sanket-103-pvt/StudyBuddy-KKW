// Error monitoring with Sentry (free plan). It is switched on only when NEXT_PUBLIC_SENTRY_DSN is set,
// and the SDK is loaded lazily, so visitors pay nothing when it is off. This SDK version sends no IP or user details by default.

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

type SentryModule = typeof import("@sentry/browser");
let loading: Promise<SentryModule | null> | null = null;

function load(): Promise<SentryModule | null> {
  if (!DSN || typeof window === "undefined") return Promise.resolve(null);
  if (!loading) {
    loading = import("@sentry/browser")
      .then((Sentry) => {
        Sentry.init({
          dsn: DSN,
          environment: process.env.NODE_ENV,
          tracesSampleRate: 0, // errors only
          ignoreErrors: ["ResizeObserver loop limit exceeded", "ResizeObserver loop completed with undelivered notifications"],
        });
        return Sentry;
      })
      .catch(() => null);
  }
  return loading;
}

/** Start listening for uncaught errors and unhandled promise rejections. */
export function initErrorMonitoring(): void {
  void load();
}

/** Report an error that React caught (error boundaries). Never throws. */
export function reportError(error: unknown): void {
  void load().then((Sentry) => Sentry?.captureException(error));
}
