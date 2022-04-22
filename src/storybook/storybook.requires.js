/* do not change this file, it is auto generated by storybook. */

import {
  configure,
  addDecorator,
  addParameters,
  addArgsEnhancer,
} from "@storybook/react-native";

import "@storybook/addon-ondevice-actions/register";
import "@storybook/addon-ondevice-controls/register";

import { argsEnhancers } from "@storybook/addon-actions/dist/modern/preset/addArgs";

import { decorators, parameters } from "./preview";

if (decorators) {
  decorators.forEach((decorator) => addDecorator(decorator));
}

if (parameters) {
  addParameters(parameters);
}

argsEnhancers.forEach((enhancer) => addArgsEnhancer(enhancer));

const getStories = () => {
  return [
    require("../app/Components/ArtsyKeyboardAvoidingView.stories.tsx"),
    require("../app/Components/ArtworkGrids/ArtworksFilterHeader.stories.tsx"),
    require("../app/Components/PopoverMessage/PopoverMessage.stories.tsx"),
    require("../app/Components/ReadMore.stories.tsx"),
    require("../palette/atoms/BackButton/BackButton.stories.tsx"),
    require("../palette/atoms/colors.stories.tsx"),
    require("../palette/atoms/space.stories.tsx"),
    require("../palette/atoms/Spacer/Spacer.stories.tsx"),
    require("../palette/elements/Avatar/Avatar.stories.tsx"),
    require("../palette/elements/Banner/Banner.stories.tsx"),
    require("../palette/elements/Button/Button.stories.tsx"),
    require("../palette/elements/Checkbox/Checkbox.stories.tsx"),
    require("../palette/elements/CollapsibleMenuItem/CollapsibleMenuItem.stories.tsx"),
    require("../palette/elements/Dialog/Dialog.stories.tsx"),
    require("../palette/elements/Header/Header.stories.tsx"),
    require("../palette/elements/Histogram/Histogram.stories.tsx"),
    require("../palette/elements/Input/Input.stories.tsx"),
    require("../palette/elements/List/List.stories.tsx"),
    require("../palette/elements/Pill/Pill.stories.tsx"),
    require("../palette/elements/ProgressBar/ProgressBar.stories.tsx"),
    require("../palette/elements/Radio/RadioButton.stories.tsx"),
    require("../palette/elements/Select/Select.stories.tsx"),
    require("../palette/elements/Tabs/Tabs.stories.tsx"),
    require("../palette/elements/Text/Text.stories.tsx"),
    require("../palette/elements/VisualClue/VisualClue.stories.tsx"),
    require("../palette/icons.stories.tsx"),
    require("../palette/organisms/screenStructure/Screen.stories.tsx"),
  ];
};

configure(getStories, module, false);
