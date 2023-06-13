import {
  Flex,
  FlexProps,
  TextProps,
  useColor,
  useScreenDimensions,
  useSpace,
  useTheme,
} from "@artsy/palette-mobile"
import { merge } from "lodash"
import RenderHtml, { MixedStyleRecord } from "react-native-render-html"

interface HTMLProps extends FlexProps {
  html: string
  variant?: TextProps["variant"]
  tagStyles?: MixedStyleRecord
}

const FONTS = {
  regular: "Unica77LL-Regular",
  italic: "Unica77LL-Italic",
  medium: "Unica77LL-Medium",
  mediumItalic: "Unica77LL-MediumItalic",
}

export const HTML: React.FC<HTMLProps> = ({
  html,
  tagStyles = {},
  variant = "sm",
  ...flexProps
}) => {
  const color = useColor()
  const space = useSpace()
  const { width } = useScreenDimensions()
  const { theme } = useTheme()

  const variantStyles = theme.textTreatments[variant]
  const contentWidth = width - space(4)

  return (
    <Flex {...flexProps} width={contentWidth}>
      <RenderHtml
        contentWidth={contentWidth}
        source={{ html }}
        systemFonts={[FONTS.regular, FONTS.italic, FONTS.medium, FONTS.mediumItalic]}
        tagsStyles={merge(
          {
            a: {
              textDecorationLine: "underline",
              textDecorationColor: color("black100"),
              color: color("black100"),
            },
            p: {
              fontFamily: FONTS.regular,
              ...variantStyles,
            },
            em: {
              fontFamily: FONTS.italic,
            },
          },
          tagStyles
        )}
      />
    </Flex>
  )
}
