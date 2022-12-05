import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { ModalStack } from "app/navigation/ModalStack"
import { createEnvironment } from "app/relay/createEnvironment"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { act, ReactTestRenderer } from "react-test-renderer"
import useInterval from "react-use/lib/useInterval"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { BottomTabs } from "./BottomTabs"
import { BottomTabsButton } from "./BottomTabsButton"

jest.mock("react-use/lib/useInterval")
jest.unmock("react-relay")
jest.mock("app/relay/createEnvironment", () => {
  let env = require("relay-test-utils").createMockEnvironment()
  const mock = {
    createEnvironment: () => env,
    __reset() {
      env = require("relay-test-utils").createMockEnvironment()
    },
  }
  return mock
})
let mockRelayEnvironment = {} as ReturnType<typeof createMockEnvironment>
beforeEach(() => {
  require("app/relay/createEnvironment").__reset()
  mockRelayEnvironment = createEnvironment() as any
})

function resolveUnreadConversationCountQuery(
  unreadConversationCount: number,
  unreadNotificationsCount: number
) {
  expect(mockRelayEnvironment.mock.getMostRecentOperation().request.node.operation.name).toBe(
    "BottomTabsModelFetchAllNotificationsCountsQuery"
  )
  mockRelayEnvironment.mock.resolveMostRecentOperation((op) =>
    MockPayloadGenerator.generate(op, {
      Me() {
        return {
          unreadConversationCount,
          unreadNotificationsCount,
        }
      },
    })
  )
}

const TestWrapper: React.FC<{}> = ({}) => {
  return (
    <GlobalStoreProvider>
      <ModalStack>
        <BottomTabs />
      </ModalStack>
    </GlobalStoreProvider>
  )
}

type ButtonProps = React.ComponentProps<typeof BottomTabsButton>

describe(BottomTabs, () => {
  it(`displays the current unread notifications count`, async () => {
    __globalStoreTestUtils__?.injectState({
      bottomTabs: { sessionState: { unreadCounts: { unreadConversationCount: 4 } } },
    })
    const tree = renderWithWrappersLEGACY(<TestWrapper />)

    const inboxButton = tree.root
      .findAllByType(BottomTabsButton)
      .find((button) => (button.props as ButtonProps).tab === "inbox")
    expect((inboxButton!.props as ButtonProps).badgeCount).toBe(4)

    // need to prevent this test's requests from leaking into the next test
    await act(async () => {
      await flushPromiseQueue()
    })
  })

  it(`displays a blue dot on home icon if there are unread notifications`, async () => {
    __globalStoreTestUtils__?.injectState({
      bottomTabs: { sessionState: { displayUnreadActivityPanelIndicator: true } },
    })
    const tree = renderWithWrappersLEGACY(<TestWrapper />)

    const homeButton = tree.root
      .findAllByType(BottomTabsButton)
      .find((button) => (button.props as ButtonProps).tab === "home")
    expect((homeButton!.props as ButtonProps).forceDisplayVisualClue).toBe(true)

    // need to prevent this test's requests from leaking into the next test
    await act(async () => {
      await flushPromiseQueue()
    })
  })

  it(`doesn't display a blue dot on home icon if there are no unread notifications`, async () => {
    __globalStoreTestUtils__?.injectState({
      bottomTabs: { sessionState: { unreadCounts: { unreadActivityPanelNotificationsCount: 0 } } },
    })
    const tree = renderWithWrappersLEGACY(<TestWrapper />)

    const homeButton = tree.root
      .findAllByType(BottomTabsButton)
      .find((button) => (button.props as ButtonProps).tab === "home")
    expect((homeButton!.props as ButtonProps).forceDisplayVisualClue).toBe(false)

    // need to prevent this test's requests from leaking into the next test
    await act(async () => {
      await flushPromiseQueue()
    })
  })

  it(`fetches the current unread conversation / notifications count on mount`, async () => {
    const tree = renderWithWrappersLEGACY(<TestWrapper />)

    await act(async () => {
      await flushPromiseQueue()
    })

    expect(mockRelayEnvironment.mock.getAllOperations()).toHaveLength(1)

    resolveUnreadConversationCountQuery(5, 1)

    await act(async () => {
      await flushPromiseQueue()
    })

    const inboxButton = tree.root
      .findAllByType(BottomTabsButton)
      .find((button) => (button.props as ButtonProps).tab === "inbox")

    expect((inboxButton!.props as ButtonProps).badgeCount).toBe(5)

    const homeButton = tree.root
      .findAllByType(BottomTabsButton)
      .find((button) => (button.props as ButtonProps).tab === "home")

    expect((homeButton!.props as ButtonProps).forceDisplayVisualClue).toBe(true)
  })

  it(`sets the application icon badge count`, async () => {
    renderWithWrappersLEGACY(<TestWrapper />)

    await act(async () => {
      await flushPromiseQueue()
    })

    expect(mockRelayEnvironment.mock.getAllOperations()).toHaveLength(1)
    resolveUnreadConversationCountQuery(9, 0)

    await act(async () => {
      await flushPromiseQueue()
    })

    expect(
      LegacyNativeModules.ARTemporaryAPIModule.setApplicationIconBadgeNumber
    ).toHaveBeenCalledWith(9)
  })

  it(`fetches the current unread conversation / notifications count once in a while`, async () => {
    let tree: ReactTestRenderer | null = null
    act(() => {
      tree = renderWithWrappersLEGACY(<TestWrapper />)
    })

    expect(useInterval).toHaveBeenCalledWith(expect.any(Function), expect.any(Number))

    await act(async () => {
      await flushPromiseQueue()
    })

    resolveUnreadConversationCountQuery(1, 1)

    const intervalCallback = (useInterval as jest.Mock).mock.calls[0][0]

    await act(async () => {
      await flushPromiseQueue()
    })

    expect(mockRelayEnvironment.mock.getAllOperations()).toHaveLength(0)
    act(() => intervalCallback())

    await act(async () => {
      await flushPromiseQueue()
    })

    expect(mockRelayEnvironment.mock.getAllOperations()).toHaveLength(1)

    resolveUnreadConversationCountQuery(3, 1)

    await act(async () => {
      await flushPromiseQueue()
    })
    // @ts-ignore
    const inboxButton = tree.root
      .findAllByType(BottomTabsButton)
      // @ts-ignore
      .find((button) => (button.props as ButtonProps).tab === "inbox")

    expect((inboxButton!.props as ButtonProps).badgeCount).toBe(3)

    // @ts-ignore
    const homeButton = tree.root
      .findAllByType(BottomTabsButton)
      // @ts-ignore
      .find((button) => (button.props as ButtonProps).tab === "home")

    expect((homeButton!.props as ButtonProps).forceDisplayVisualClue).toBe(true)
  })
})
