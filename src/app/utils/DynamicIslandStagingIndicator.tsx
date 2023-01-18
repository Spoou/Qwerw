import { useIsStaging } from "app/store/GlobalStore"
import { SystemDeviceInfo } from "app/system/SystemDeviceInfo"
import { Flex } from "palette"

export const DynamicIslandStagingIndicator = () => {
  const isStaging = useIsStaging()

  if (!isStaging || !SystemDeviceInfo.hasDynamicIsland()) {
    return null
  }

  let rect: { top: number; left: number } | undefined

  switch (SystemDeviceInfo.getDeviceNameSync()) {
    case "iPhone 14 Pro":
      rect = { top: 9.5, left: 132 }
      break
    case "iPhone 14 Pro Max":
      rect = { top: 9.5, left: 150.5 }
      break
    default:
      console.warn("No rect for this device")
  }

  if (rect === undefined) {
    return null
  }

  return (
    <Flex
      backgroundColor="devpurple"
      position="absolute"
      width={129}
      height={40}
      top={rect.top}
      left={rect.left}
      borderRadius={40}
      overflow="hidden"
      alignItems="center"
      justifyContent="center"
    >
      <Flex backgroundColor="white" width={127} height={37.5} borderRadius={40} overflow="hidden" />
    </Flex>
  )
}
