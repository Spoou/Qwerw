import NavigatorIOS from "lib/utils/__legacy_do_not_use__navigator-ios-shim"
import { isPad } from "lib/utils/hardware"
import React from "react"
import { TouchableWithoutFeedback, ViewProperties } from "react-native"
import { Image } from "../Elements/Image"

interface ContainerWithBackButtonProps extends ViewProperties {
  navigator: NavigatorIOS
}

export class BackButton extends React.Component<ContainerWithBackButtonProps> {
  goBack() {
    this.props.navigator.pop()
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => this.goBack()}>
        <Image
          position="absolute"
          top={isPad() ? "10px" : "14px"}
          left={isPad() ? "20px" : "10px"}
          source={require("../../../../../images/angle-left.png")}
          style={{ zIndex: 10 }} // Here the style prop is intentionally used to avoid making zIndex too handy.
        />
      </TouchableWithoutFeedback>
    )
  }
}
