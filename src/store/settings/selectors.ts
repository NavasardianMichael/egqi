import { RootState } from "index";

export const selectSettings = (state: RootState) => state.settings
export const selectWeights = (state: RootState) => state.settings.weights
export const selectPercentile = (state: RootState) => state.settings.percentile