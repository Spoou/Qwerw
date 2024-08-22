import {
  DAYS_IN_COOLDOWN_PERIOD,
  userShouldBePromptedToCompleteProfile,
} from "app/utils/collectorPromptHelpers"

describe("userShouldBePromptedToCompleteProfile", () => {
  it("returns true if city is null and user has never been prompted", () => {
    expect(
      userShouldBePromptedToCompleteProfile({
        city: null,
        profession: "Profession",
        lastUpdatePromptAt: null,
      })
    ).toEqual(true)
  })

  it("returns true if profession is null and user has never been prompted", () => {
    expect(
      userShouldBePromptedToCompleteProfile({
        city: null,
        profession: "Profession",
        lastUpdatePromptAt: null,
      })
    ).toEqual(true)
  })

  it("returns true if city is null and user has not been prompted in 30 days", () => {
    expect(
      userShouldBePromptedToCompleteProfile({
        city: null,
        profession: "Profession",
        lastUpdatePromptAt: new Date(
          Date.now() - (DAYS_IN_COOLDOWN_PERIOD + 1) * 24 * 60 * 60 * 1000
        ).toISOString(),
      })
    ).toEqual(true)
  })

  it("returns true if profession is null and user has not been prompted in 30 days", () => {
    expect(
      userShouldBePromptedToCompleteProfile({
        city: null,
        profession: "Profession",
        lastUpdatePromptAt: new Date(
          Date.now() - (DAYS_IN_COOLDOWN_PERIOD + 1) * 24 * 60 * 60 * 1000
        ).toISOString(),
      })
    ).toEqual(true)
  })

  it("returns false if city is null and user has been prompted in the last 30 days", () => {
    expect(
      userShouldBePromptedToCompleteProfile({
        city: null,
        profession: "Profession",
        lastUpdatePromptAt: new Date(
          Date.now() - (DAYS_IN_COOLDOWN_PERIOD - 1) * 24 * 60 * 60 * 1000
        ).toISOString(),
      })
    ).toEqual(false)
  })

  it("returns false if profession is null and user has been prompted in the last 30 days", () => {
    expect(
      userShouldBePromptedToCompleteProfile({
        city: "City",
        profession: null,
        lastUpdatePromptAt: new Date(
          Date.now() - (DAYS_IN_COOLDOWN_PERIOD - 1) * 24 * 60 * 60 * 1000
        ).toISOString(),
      })
    ).toEqual(false)
  })

  it("returns false if city and profession are not null and user has never been prompted", () => {
    expect(
      userShouldBePromptedToCompleteProfile({
        city: "City",
        profession: "Profession",
        lastUpdatePromptAt: null,
      })
    ).toEqual(false)
  })

  it("return false if city and profession are not null and user has not been prompted in 30 days", () => {
    expect(
      userShouldBePromptedToCompleteProfile({
        city: "City",
        profession: "Profession",
        lastUpdatePromptAt: new Date(
          Date.now() - (DAYS_IN_COOLDOWN_PERIOD + 1) * 24 * 60 * 60 * 1000
        ).toISOString(),
      })
    ).toEqual(false)
  })

  it("returns false if city and profession are not null and user has been prompted in the last 30 days", () => {
    expect(
      userShouldBePromptedToCompleteProfile({
        city: "City",
        profession: "Profession",
        lastUpdatePromptAt: new Date(
          Date.now() - (DAYS_IN_COOLDOWN_PERIOD - 1) * 24 * 60 * 60 * 1000
        ).toISOString(),
      })
    ).toEqual(false)
  })
})
