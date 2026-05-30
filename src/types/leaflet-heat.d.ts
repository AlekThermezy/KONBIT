declare module 'leaflet.heat' {
  import * as L from 'leaflet'
  interface HeatMapOptions {
    minOpacity?: number
    maxZoom?: number
    max?: number
    radius?: number
    blur?: number
    maxOpacity?: number
    minOpacity?: number
    scaleRadius?: boolean
    useLocalExtrema?: boolean
    latField?: string
    lngField?: string
    intensityField?: string
  }
  function heatLayer(
    latlngs: Array<[number, number, number?]>,
    options?: HeatMapOptions
  ): L.Layer
  export default heatLayer
}
