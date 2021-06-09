import { SoldBySectionTestsQuery } from "__generated__/SoldBySectionTestsQuery.graphql"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { SoldBySectionFragmentContainer } from "../Components/SoldBySection"

jest.unmock("react-relay")

describe("SoldBySection", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  const TestRenderer = () => (
    <QueryRenderer<SoldBySectionTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query SoldBySectionTestsQuery @relay_test_operation {
          commerceOrder(id: "some-id") {
            ...SoldBySection_soldBy
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.commerceOrder) {
          return <SoldBySectionFragmentContainer soldBy={props.commerceOrder} />
        }
        return null
      }}
    />
  )
  it("renders auction result when auction results are available", () => {
    const tree = renderWithWrappers(<TestRenderer />).root
    mockEnvironmentPayload(mockEnvironment, {
      CommerceOrder: () => ({
        lineItems: {
          edges: [
            {
              node: {
                artwork: {
                  shippingOrigin: "Minsk, Belarus",
                },
                fulfillments: {
                  edges: [
                    {
                      node: {
                        estimatedDelivery: "2021-08-10T03:00:00+03:00",
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      }),
    })

    expect(tree.findByProps({ testID: "delivery" }).props.children).toBe("8/10/2021")
    expect(tree.findByProps({ testID: "shippingOrigin" }).props.children).toBe("Minsk, Belarus")
  })
})
