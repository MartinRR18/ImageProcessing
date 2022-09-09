/**
 *Programa para analizar diferentes bandas espectrales satelitales a través de la composición de imágenes y sus diferentes usos en detección de zonas de incendios, zonas agrícolas, estudios del suelo, análisis de vegetación, desarrollos urbanos, etc.
 
 *Autor: A. Martín Ramírez Rabelo.

 * Function to mask clouds using the Sentinel-2 QA band
 * @param {ee.Image} image Sentinel-2 image
 * @return {ee.Image} cloud masked Sentinel-2 image
 */
function maskS2clouds(image) {
  var qa = image.select('QA60');

  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));

  return image.updateMask(mask).divide(10000);
}

// Map the function over one year of data and take the median.
// Load Sentinel-2 TOA reflectance data.
var dataset = ee.ImageCollection('COPERNICUS/S2')
                  .filterDate('2015-01-01', '2021-01-01')
                  // Pre-filter to get less cloudy granules.
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
                  .map(maskS2clouds);
var AgroVis = {
  min: 0.0,
  max: 0.3,
  bands: ['B11', 'B8A', 'B2'],
};
Map.setCenter(-87.905,18.592,8);
//Map.setCenter(-9.1695, 38.6917, 12);
Map.addLayer(dataset.median(), AgroVis, 'Agricola');

var IncenVis = {
  min: 0.0,
  max: 0.3,
  bands: ['B12', 'B8A', 'B4'],
};
Map.setCenter(-87.905,18.592,8);
//Map.setCenter(-9.1695, 38.6917, 12);
Map.addLayer(dataset.median(), IncenVis, 'Incendios');
// modificar script para hacer otras combinaciones de color


var VegeVis = {
  min: 0.0,
  max: 0.3,
  bands: ['B8A', 'B11', 'B2'],
};
Map.setCenter(-87.905,18.592,8);
//Map.setCenter(-9.1695, 38.6917, 12);
Map.addLayer(dataset.median(), VegeVis, 'Vegetacion');
// modificar script para hacer otras combinaciones de color

var UrbanVis = {
  min: 0.0,
  max: 0.3,
  bands: ['B12', 'B11', 'B4'],
};
Map.setCenter(-87.905,18.592,8);
//Map.setCenter(-9.1695, 38.6917, 12);
Map.addLayer(dataset.median(), UrbanVis, 'ZonasUrbanas');
// modificar script para hacer otras combinaciones de color
