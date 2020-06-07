import { NativeModules } from "react-native"
// @ts-ignore STRICTNESS_MIGRATION
import { errorMiddleware, loggerMiddleware, RelayNetworkLayer, urlMiddleware } from "react-relay-network-modern/node8"
import { Environment, RecordSource, Store } from "relay-runtime"

import { metaphysicsURL } from "./config"
import { cacheMiddleware } from "./middlewares/cacheMiddleware"
import { metaphysicsExtensionsLoggerMiddleware } from "./middlewares/metaphysicsMiddleware"
import { timingMiddleware } from "./middlewares/timingMiddleware"

const Emission = NativeModules.Emission
const Constants = NativeModules.ARCocoaConstantsModule

/// WARNING: Creates a whole new, separate Relay environment. Useful for testing.
/// Use `defaultEnvironment` for production code.
export default function createEnvironment() {
  const network = new RelayNetworkLayer([
    cacheMiddleware(),
    urlMiddleware({
      url: metaphysicsURL,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": Emission.userAgent,
        "X-USER-ID": Emission.userID,
        "X-ACCESS-TOKEN": Emission.authenticationToken,
        "X-TIMEZONE": Constants.LocalTimeZone,
      },
    }),
    loggerMiddleware(),
    errorMiddleware({
      disableServerMiddlewareTip: true,
    }),
    metaphysicsExtensionsLoggerMiddleware(),
    timingMiddleware(),
  ])

  const source = new RecordSource()
  const store = new Store(source)
  return new Environment({
    network,
    store,
  })
}

export const defaultEnvironment = createEnvironment()
