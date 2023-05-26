import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { ModalStack } from "app/system/navigation/ModalStack"
import { NavStack } from "app/system/navigation/NavStack"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { RelayEnvironmentProvider } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { BottomTabsNavigator } from "./BottomTabsNavigator"

jest.unmock("app/NativeModules/LegacyNativeModules")

describe(BottomTabsNavigator, () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    require("app/system/relay/createEnvironment").reset()
    mockEnvironment = getMockRelayEnvironment()
  })

  it("shows the current tab content", async () => {
    const tree = renderWithWrappersLEGACY(
      <RelayEnvironmentProvider environment={mockEnvironment}>
        <ModalStack>
          <BottomTabsNavigator />
        </ModalStack>
      </RelayEnvironmentProvider>
    )

    expect(
      tree.root.findAll((node) => node.type === NavStack && node.props.id === "home")
    ).toHaveLength(1)

    expect(
      tree.root.findAll((node) => node.type === NavStack && node.props.id === "search")
    ).toHaveLength(0)

    await act(() => {
      LegacyNativeModules.ARScreenPresenterModule.switchTab("search")
    })

    expect(
      tree.root.findAll((node) => node.type === NavStack && node.props.id === "search")
    ).toHaveLength(1)
  })
})
