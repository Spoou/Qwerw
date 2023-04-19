import { BottomSheetModal, BottomSheetModalProps } from "@gorhom/bottom-sheet"
import { FC, useEffect, useRef } from "react"

interface AutomountedBottomSheetModalProps extends BottomSheetModalProps {
  visible: boolean
}

// TODO: Pass custom backgrdrop
// TODO: Pass and call `onDismiss`
export const AutomountedBottomSheetModal: FC<AutomountedBottomSheetModalProps> = ({
  visible,
  ...rest
}) => {
  const ref = useRef<BottomSheetModal>(null)

  useEffect(() => {
    if (visible) {
      ref.current?.present()
    }
  }, [visible])

  return (
    <BottomSheetModal ref={ref} enablePanDownToClose keyboardBlurBehavior="restore" {...rest} />
  )
}
