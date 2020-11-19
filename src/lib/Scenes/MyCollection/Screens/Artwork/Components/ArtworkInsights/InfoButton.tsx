import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { Flex, InfoCircleIcon, Spacer, Text } from "palette"
import React, { useState } from "react"
import { TouchableOpacity } from "react-native"

interface InfoButtonProps {
  title: string
  modalContent: JSX.Element
  modalTitle?: string
  subTitle?: string
}

export const InfoButton: React.FC<InfoButtonProps> = ({ title, subTitle, modalTitle, modalContent }) => {
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <>
      <Flex flexDirection="row">
        <Text variant="mediumText" mr={0.5}>
          {title}
        </Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <InfoCircleIcon style={{ top: 2 }} color="black60" />
        </TouchableOpacity>
      </Flex>
      {!!subTitle && <Text color="black60">{subTitle}</Text>}
      <FancyModal visible={modalVisible} onBackgroundPressed={() => setModalVisible(false)}>
        <FancyModalHeader onLeftButtonPress={() => setModalVisible(false)}>{modalTitle ?? title}</FancyModalHeader>
        <Spacer my={1} />
        <ScreenMargin>{modalContent}</ScreenMargin>
      </FancyModal>
    </>
  )
}
