import { NativeModules } from "react-native"
const { Emission } = NativeModules

let metaphysicsURL: string
let gravityURL: string

if (Emission && Emission.gravityURL && Emission.metaphysicsURL) {
  metaphysicsURL = Emission.metaphysicsURL
  gravityURL = Emission.gravityURL
} else {
  metaphysicsURL = "https://metaphysics-production.artsy.net"
  gravityURL = "https://api.artsy.net"
}

export { metaphysicsURL, gravityURL }

// TODO: Not sure if we still need this at all
// if (__DEV__) {
//   // tslint:disable-next-line:no-var-requires
//   require("react-relay/lib/RelayNetworkDebug").init()
// }
