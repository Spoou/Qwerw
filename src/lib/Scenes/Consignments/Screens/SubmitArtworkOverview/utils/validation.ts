import * as Yup from "yup"

export const artworkDetailsInitialValues = {
  artist: "",
  artistId: "",
  title: "",
  year: "",
  materials: "",
  rarity: "",
  editionNumber: "",
  editionSizeFormatted: "",
  units: "in",
  height: "",
  width: "",
  depth: "",
  provenance: "",
  location: "",
  state: "DRAFT",
  utmMedium: "",
  utmSource: "",
  utmTerm: "",
}

export const artworkDetailsValidationSchema = Yup.object().shape({
  artist: Yup.string().required().trim(),
  artistId: Yup.string().required(),
  title: Yup.string().required().trim(),
  year: Yup.string().required().trim(),
  materials: Yup.string().required().trim(),
  rarity: Yup.string().required(),
  editionNumber: Yup.string().when("rarity", {
    is: "limited edition",
    then: Yup.string().required().trim(),
  }),
  editionSizeFormatted: Yup.string().when("rarity", {
    is: "limited edition",
    then: Yup.string().required().trim(),
  }),
  units: Yup.string().required(),
  height: Yup.string().required().trim(),
  width: Yup.string().required().trim(),
  depth: Yup.string().trim(),
  provenance: Yup.string().required().trim(),
  location: Yup.string().required(),
  state: Yup.string(),
  utmMedium: Yup.string(),
  utmSource: Yup.string(),
  utmTerm: Yup.string(),
})
