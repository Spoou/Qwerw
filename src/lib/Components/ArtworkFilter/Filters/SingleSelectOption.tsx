import { ParamListBase } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { FilterData } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { TouchableRow } from "lib/Components/TouchableRow"
import { Flex, RadioDot, Text } from "palette"
import React from "react"
import { FlatList } from "react-native"
import styled from "styled-components/native"

interface SingleSelectOptionScreenProps {
  navigation: StackNavigationProp<ParamListBase>
  filterHeaderText: string
  onSelect: (any: any) => void
  selectedOption: FilterData
  filterOptions: Array<FilterData | JSX.Element>
  ListHeaderComponent?: JSX.Element
  withExtraPadding?: boolean
}

const isFilterData = (item: any): item is FilterData => {
  return "paramValue" in item
}

export const SingleSelectOptionScreen: React.FC<SingleSelectOptionScreenProps> = ({
  filterHeaderText,
  selectedOption,
  onSelect,
  filterOptions,
  navigation,
  ListHeaderComponent,
  withExtraPadding = false,
}) => {
  const handleBackNavigation = () => {
    navigation.goBack()
  }

  return (
    <Flex flexGrow={1}>
      <FancyModalHeader onLeftButtonPress={handleBackNavigation}>{filterHeaderText}</FancyModalHeader>

      <Flex flexGrow={1}>
        <FlatList
          style={{ flex: 1 }}
          initialNumToRender={100}
          ListHeaderComponent={ListHeaderComponent}
          keyExtractor={(_item, index) => String(index)}
          data={filterOptions}
          ItemSeparatorComponent={null}
          renderItem={({ item }) => {
            if (isFilterData(item)) {
              return (
                <ListItem
                  item={item}
                  selectedOption={selectedOption}
                  onSelect={onSelect}
                  withExtraPadding={withExtraPadding}
                />
              )
            }

            // Otherwise just return JSX.Element
            return item
          }}
        />
      </Flex>
    </Flex>
  )
}

const ListItem = ({
  item,
  onSelect,
  selectedOption,
  withExtraPadding,
}: {
  item: FilterData
  onSelect: (any: any) => void
  selectedOption: FilterData
  withExtraPadding: boolean
}) => {
  const selected = item.displayText === selectedOption.displayText

  return (
    <TouchableRow onPress={() => onSelect(item)}>
      <OptionListItem>
        <InnerOptionListItem px={withExtraPadding && item.displayText !== "All" ? 3 : 2}>
          <Text color="black100" variant="caption">
            {item.displayText}
            {!!item.count && (
              <Text color="black60" variant="caption">
                {" "}
                ({item.count})
              </Text>
            )}
          </Text>
          <RadioDot selected={selected} />
        </InnerOptionListItem>
      </OptionListItem>
    </TouchableRow>
  )
}

export const InnerOptionListItem = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  flex-grow: 1;
  align-items: center;
  height: 60px;
`

export const OptionListItem = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`
