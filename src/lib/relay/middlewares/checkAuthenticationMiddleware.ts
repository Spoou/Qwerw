import { NativeModules } from "react-native"
import { Middleware } from "react-relay-network-modern/node8"

// This middleware is responsible of signing the user out if his session expired
export const checkAuthenticationMiddleware = (): Middleware => (next) => async (req) => {
  const res = await next(req)
  if (res.errors?.length) {
    NativeModules.ARTemporaryAPIModule.validateAuthCredentialsAreCorrect()
  }
  return res
}
