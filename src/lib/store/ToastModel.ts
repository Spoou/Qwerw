import { action, Action, thunk, Thunk } from "easy-peasy"
import { ToastDetails, ToastOptions, ToastPlacement } from "lib/Components/Toast/types"

export interface ToastModel {
  sessionState: {
    nextId: number
    toasts: Array<Omit<ToastDetails, "positionIndex">>
  }

  add: Action<
    this,
    {
      message: string
      placement: ToastPlacement
      options?: ToastOptions
    }
  >
  remove: Action<this, this["sessionState"]["nextId"]>
  removeOldest: Action<this>
}

export const getToastModel = (): ToastModel => ({
  sessionState: {
    nextId: 0,
    toasts: [],
  },

  add: action((state, newToast) => {
    state.sessionState.toasts.push({
      id: state.sessionState.nextId,
      message: newToast.message,
      placement: newToast.placement,
      ...newToast.options,
    })

    state.sessionState.nextId += 1
  }),
  remove: action((state, toastId) => {
    state.sessionState.toasts = state.sessionState.toasts.filter((toast) => toast.id !== toastId)
  }),
  removeOldest: action((state) => {
    state.sessionState.toasts.shift()
  }),
})
