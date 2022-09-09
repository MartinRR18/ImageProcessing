// Código que se puede implementar en la API de java script the GEE para clasificación automática de Imágenes del satélite Sentinel1
// Autor: Ángel MArtín Ramírez Rabelo.

//Visualizar la cuenca
var ZonaBajaGrijalva = ee.FeatureCollection('users/cbi2192802478/ZonaBajaGrijalva');
ZonaBajaGrijalva = ZonaBajaGrijalva.geometry();

var styling = {color: 'blue', fillColor: '00000000'};
Map.addLayer(table.style(styling));

//Cargar imágenes sentinel VV
var Sentinel16Invernal = ee.ImageCollection('COPERNICUS/S1_GRD')
.filter(ee.Filter.eq('instrumentMode', 'IW'))
.filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
.filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
.filterMetadata('resolution_meters', 'equals' , 10)
.filterBounds(ZonaBajaGrijalva)
.select('VV');
print(Sentinel16Invernal, 'Sentinel 1 Invernal 2016'); 

//Filtro por fecha
var Sentinel16Inv = Sentinel16Invernal.filterDate('2016-01-01', '2016-02-28').mosaic();


//Aplicar filtro de Speckle
var SMOOTHING_RADIUS = 50;
var Sentinel16InvFiltered = Sentinel16Inv.focal_mean(SMOOTHING_RADIUS, 'circle', 'meters');

//Desplegar las imágenes filtradas
Map.addLayer(Sentinel16InvFiltered, {min:-15,max:0}, '16SF-Invernal',0);


// Unir áreas de entrenamiento
var AEInvierno16=
CuerposaguaI16.merge(ManglarI16).merge(AgriculturaI16).merge(AsentamientoshumanosI16).merge(SuelodesnudoI16).merge(SaturadasvegetacionI16);

//Definir Sentinel para entrenamiento de clasificación
var SentinelInvierno16 = ee.Image.cat(Sentinel16InvFiltered);
var Bandas_SentinelInvierno16 = ['VV'];
var Entrenamiento_SentinelInvierno16 = SentinelInvierno16.select(Bandas_SentinelInvierno16).sampleRegions({
collection: AEInvierno16,
properties: ['Landcover'],
scale: 10 });

//Entrenamiento del clasificador
var ClasificadorSentinelInvierno16 =
ee.Classifier.smileRandomForest(10).train({
features: Entrenamiento_SentinelInvierno16,
classProperty: 'Landcover',
inputProperties: Bandas_SentinelInvierno16});

//Correr la clasificación
var ClasificacionSentinelInvierno16 = 
SentinelInvierno16.select(Bandas_SentinelInvierno16)
.classify(ClasificadorSentinelInvierno16);

//Visualizar la clasificación
Map.addLayer(ClasificacionSentinelInvierno16,
{min: 1, max: 7, palette: ['263aff', '00ff00', 'ff7c37', 'C0C0C0',
'FFFF00', '00FFFF','d63000']},
'Invernal Sentinel 16');

print('Clasificación Sentinel 1 Invierno 16 matriz de error:', ClasificadorSentinelInvierno16.confusionMatrix());
print('Clasificación Sentinel Invierno 16 exactitud: ', ClasificadorSentinelInvierno16.confusionMatrix().accuracy());

var geometry = ee.Geometry.Rectangle([-94.8, 18.8, -91.5116, 15.0]);
Export.image.toDrive({
 image: ClasificacionSentinelInvierno16,
 description: "Clasificacion_Baja_L_Invierno16",
  scale: 10,
  maxPixels: 1e10,
  region: geometry,
  fileFormat: "GeoTIFF",
 });



