import { Text, TextProps } from "palette"

interface AuctionResultsMidEstimateProps {
  value: string
  shortDescription?: string
  textVariant?: TextProps["variant"]
}

type ArrowDirections = "up" | "down"

export const AuctionResultsMidEstimate: React.FC<AuctionResultsMidEstimateProps> = ({
  value,
  textVariant = "xs",
  shortDescription,
}) => {
  const prefix: ArrowDirections = value[0] !== "-" ? "up" : "down"

  const color = ratioColor(value)

  return (
    <Text variant={textVariant} color={color} fontWeight="500">
      ({prefix === "up" ? "+" : "-"}
      {new Intl.NumberFormat().format(Number(value.replace(/%|-/gm, "")))}%
      {!!shortDescription && ` ${shortDescription}`})
    </Text>
  )
}

export const ratioColor = (ratioString: string) => {
  const ratio = Number(ratioString.replace("%", ""))
  if (ratio >= 5) {
    return "green100"
  }
  if (ratio <= -5) {
    return "red100"
  }

  return "black60"
}
