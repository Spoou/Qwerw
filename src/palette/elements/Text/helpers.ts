import { useTheme } from "palette"
import { isThemeV3 } from "palette/Theme"
import { TextV3Props } from "."

export const useFontFamilyFor = ({
  italic,
  weight,
}: {
  italic: TextV3Props["italic"]
  weight: TextV3Props["weight"]
}) => {
  const { theme } = useTheme()
  if (!isThemeV3(theme)) {
    return "no-font"
  }
  const { fonts } = theme

  if (italic && weight === "medium") {
    return fonts.sans.mediumItalic
  }

  if (italic) {
    return fonts.sans.italic
  }

  if (weight === "medium") {
    return fonts.sans.medium
  }

  return fonts.sans.regular
}
