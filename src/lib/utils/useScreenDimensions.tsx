import { SafeAreaInsets } from "lib/types/SafeAreaInsets"
import { createContext, useContext, useEffect, useState } from "react"
import React from "react"
import { Dimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export type ScreenOrientation = "landscape" | "portrait"

export interface ScreenDimensions {
  width: number
  height: number
  orientation: ScreenOrientation
}

export interface ScreenDimensionsWithSafeAreas extends ScreenDimensions {
  safeAreaInsets: SafeAreaInsets
}

export const ScreenDimensionsContext = createContext<ScreenDimensionsWithSafeAreas>(
  null as any /* STRICTNESS_MIGRATION */
)

function getCurrentDimensions(): ScreenDimensions {
  const { width, height } = Dimensions.get("window")
  return {
    width,
    height,
    orientation: width > height ? "landscape" : "portrait",
  }
}

export const ProvideScreenDimensions: React.FC = ({ children }) => {
  const safeAreaInsets = useSafeAreaInsets()
  const [dimensions, setDimensions] = useState<ScreenDimensions>(getCurrentDimensions())

  useEffect(() => {
    const onChange = () => {
      setDimensions(getCurrentDimensions())
    }
    Dimensions.addEventListener("change", onChange)
    return () => {
      Dimensions.removeEventListener("change", onChange)
    }
  }, [])

  return (
    <ScreenDimensionsContext.Provider value={{ ...dimensions, safeAreaInsets }}>
      {children}
    </ScreenDimensionsContext.Provider>
  )
}

/**
 * Call during render to be notified whenever `screenDimensions` changes
 */
export function useScreenDimensions() {
  return useContext(ScreenDimensionsContext)
}
