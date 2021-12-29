import { Aggregations, FilterData, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractPillFromAggregation, extractPills, extractSizeLabel, getNamePlaceholder } from "./helpers"

describe("extractPillFromAggregation", () => {
  it("returns pills", () => {
    const filter: FilterData = {
      displayText: "Acrylic, Canvas",
      paramName: FilterParamName.materialsTerms,
      paramValue: ["acrylic", "canvas"],
    }
    const result = extractPillFromAggregation(filter, aggregations)

    const pills = [
      { label: "Acrylic", value: "acrylic", paramName: FilterParamName.materialsTerms },
      { label: "Canvas", value: "canvas", paramName: FilterParamName.materialsTerms },
    ]

    expect(result).toEqual(pills)
  })

  it("returns undefined for unknown param values", () => {
    const filter: FilterData = {
      displayText: "Acrylic, Canvas",
      paramName: FilterParamName.materialsTerms,
      paramValue: ["acrylic", "canvas", "unknown-value"],
    }
    const result = extractPillFromAggregation(filter, aggregations)

    const pills = [
      { label: "Acrylic", value: "acrylic", paramName: FilterParamName.materialsTerms },
      { label: "Canvas", value: "canvas", paramName: FilterParamName.materialsTerms },
      undefined,
    ]

    expect(result).toEqual(pills)
  })

  it("returns empty array when couldn't get aggregation by param name", () => {
    const filter: FilterData = {
      displayText: "Acrylic, Canvas",
      paramName: FilterParamName.materialsTerms,
      paramValue: ["acrylic", "canvas", "unknown-value"],
    }
    const result = extractPillFromAggregation(filter, [])

    expect(result).toEqual([])
  })
})

describe("extractSizeLabel", () => {
  it("returns correcly label when full range is specified", () => {
    expect(extractSizeLabel("w", "5-10")).toBe("w: 5-10 in")
  })

  it("returns correcly label when only min value is specified", () => {
    expect(extractSizeLabel("w", "5-*")).toBe("w: from 5 in")
  })

  it("returns correcly label when only max value is specified", () => {
    expect(extractSizeLabel("w", "*-10")).toBe("w: to 10 in")
  })

  it("returns specified prefix", () => {
    expect(extractSizeLabel("h", "5-10")).toBe("h: 5-10 in")
  })
})

describe("extractPills", () => {
  it("should correctly extract pills", () => {
    const filters: FilterData[] = [
      {
        displayText: "Acrylic, Canvas",
        paramName: FilterParamName.materialsTerms,
        paramValue: ["acrylic", "canvas"],
      },
      {
        displayText: "$5,000–10,000",
        paramValue: "5000-10000",
        paramName: FilterParamName.priceRange,
      },
      {
        paramName: FilterParamName.attributionClass,
        displayText: "Limited Edition, Open Edition",
        paramValue: ["limited edition", "open edition"],
      },
      {
        displayText: "Make Offer",
        paramValue: true,
        paramName: FilterParamName.waysToBuyMakeOffer,
      },
      {
        displayText: "5-10",
        paramValue: "5-10",
        paramName: FilterParamName.width,
      },
      {
        displayText: "15-*",
        paramValue: "15-*",
        paramName: FilterParamName.height,
      },
    ]
    const result = extractPills(filters, aggregations)

    const pills = [
      {
        label: "Acrylic",
        paramName: FilterParamName.materialsTerms,
        value: "acrylic",
      },
      {
        label: "Canvas",
        paramName: FilterParamName.materialsTerms,
        value: "canvas",
      },
      {
        label: "$5,000–10,000",
        value: "5000-10000",
        paramName: FilterParamName.priceRange,
      },
      {
        paramName: FilterParamName.attributionClass,
        label: "Limited Edition",
        value: "limited edition",
      },
      {
        paramName: FilterParamName.attributionClass,
        label: "Open Edition",
        value: "open edition",
      },
      {
        label: "Make Offer",
        value: true,
        paramName: FilterParamName.waysToBuyMakeOffer,
      },
      {
        label: "w: 5-10 in",
        value: "5-10",
        paramName: FilterParamName.width,
      },
      {
        label: "h: from 15 in",
        value: "15-*",
        paramName: FilterParamName.height,
      },
    ]

    expect(result).toEqual(pills)
  })
})

const aggregations: Aggregations = [
  {
    slice: "MATERIALS_TERMS",
    counts: [
      {
        count: 44,
        name: "Acrylic",
        value: "acrylic",
      },
      {
        count: 30,
        name: "Canvas",
        value: "canvas",
      },
      {
        count: 26,
        name: "Metal",
        value: "metal",
      },
    ],
  },
]

describe("getNamePlaceholder", () => {
  it("returns the singular form for the filter label", () => {
    const pills = [{ label: "One", paramName: FilterParamName.materialsTerms, value: "one" }]
    expect(getNamePlaceholder("artistName", pills)).toBe("artistName • 1 filter")
  })

  it("returns the plural form for the filter label", () => {
    const pills = [
      { label: "One", paramName: FilterParamName.materialsTerms, value: "one" },
      { label: "Two", paramName: FilterParamName.materialsTerms, value: "two" },
    ]
    expect(getNamePlaceholder("artistName", pills)).toBe("artistName • 2 filters")
  })

  it("returns the correct number of filters when artist pill is shown", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableImprovedAlertsFlow: true })
    const pills = [
      { label: "Artist Name", paramName: FilterParamName.artistIDs, value: "artistName" },
      { label: "One", paramName: FilterParamName.materialsTerms, value: "one" },
      { label: "Two", paramName: FilterParamName.materialsTerms, value: "two" },
    ]
    expect(getNamePlaceholder("artistName", pills)).toBe("artistName • 3 filters")
  })
})
