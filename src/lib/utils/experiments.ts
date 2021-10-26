export interface ExperimentDescriptor {
  /**
   * Provide a split name to allow this feature to be toggled via split.io.
   */
  readonly splitName?: string
  /**
   * This refers to the value we show to the user in case something goes wrong with the client
   * initiation or when we no longer use split.io
   */
  readonly defaultTreatment: string
}

// Helper function to get good typings and intellisense
function defineExperiments<T extends string>(expirmentMap: { readonly [experimentName in T]: ExperimentDescriptor }) {
  return expirmentMap
}

export const experiments = defineExperiments({
  HomeScreenWorksForYouVsWorksByArtistsYouFollow: {
    splitName: "HomeScreenWorksForYouVsWorksByArtistsYouFollow",
    defaultTreatment: "worksByArtistsYouFolow",
  },
})
export type EXPERIMENT_NAME = keyof typeof experiments
