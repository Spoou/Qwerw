import { LoggedInUserInfo_me$data } from "__generated__/LoggedInUserInfo_me.graphql"
import { LoggedInUserInfoQuery } from "__generated__/LoggedInUserInfoQuery.graphql"
import Spinner from "app/Components/Spinner"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { Box, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface MyProfileProps {
  me: LoggedInUserInfo_me$data
}

class MyProfile extends React.Component<MyProfileProps> {
  render() {
    const { me } = this.props
    const loginInfo = !!me.name ? `${me.name} (${me.email})` : me.email
    return <Text variant="sm">Logged in as: {loginInfo}</Text>
  }
}

const MyProfileFragmentContainer = createFragmentContainer(MyProfile, {
  me: graphql`
    fragment LoggedInUserInfo_me on Me {
      name
      email
    }
  `,
})

export const MyProfileQueryRenderer: React.FC = () => (
  <QueryRenderer<LoggedInUserInfoQuery>
    environment={defaultEnvironment}
    query={graphql`
      query LoggedInUserInfoQuery {
        me {
          ...LoggedInUserInfo_me
        }
      }
    `}
    variables={{}}
    render={({ error, props }) => {
      if (error) {
        return null
      } else if (props) {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        return <MyProfileFragmentContainer {...props} />
      } else {
        return (
          <Box mb={1}>
            <Spinner />
          </Box>
        )
      }
    }}
  />
)
