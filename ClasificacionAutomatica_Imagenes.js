//Visualizar la cuenca
var ZonaBajaGrijalva = ee.FeatureCollection('users/cbi2192802478/ZonaBajaGrijalva');
ZonaBajaGrijalva = ZonaBajaGrijalva.geometry();


var styling = {color: 'blue', fillColor: '00000000'};
Map.addLayer(table.style(styling));


// Enmascarar las nubes
function maskL8sr(image) {
// Los bits 3 y 5 son sombra de nube y nube, respectivamente 
var cloudShadowBitMask = 1 << 3;
var cloudsBitMask = 1 << 5;
// Obtenga la banda de control de calidad de píxeles 
var qa = image.select('pixel_qa');
// Ambos indicadores deben ponerse a cero, lo que indica condiciones claras
var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
.and(qa.bitwiseAnd(cloudsBitMask).eq(0));
// Devuelve la imagen enmascarada, escalada a reflectancia, sin las bandas QA. 
return image.updateMask(mask).divide(10000)
.select("B[0-9]*")
.copyProperties(image, ["system:time_start"]);
}


var Landsat16Invernal = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
.filterDate('2016-01-01', '2016-02-28')
.filterBounds(ZonaBajaGrijalva)
.map(maskL8sr);
print(Landsat16Invernal,'Colección Landsat periodo de estudio');

//Calcular el  NDVI y crear una imagen que contenga todas las bandas Landsat 8 y NDVI 2016
var comp16LI = Landsat16Invernal.mean();
var ndvi16LI = comp16LI.normalizedDifference(['B5', 'B4']).rename('NDVI16LI');
var composite16LI = ee.Image.cat(comp16LI,ndvi16LI);


// Agregar imágenes a las capas para mostrarlas
Map.centerObject(ZonaBajaGrijalva, 7);
Map.addLayer(composite16LI, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.2}, 'Landsat16-Invernal');

//Unir categorias
var AEInvierno16=
CuerposaguaI16.merge(ManglarI16).merge(AgriculturaI16).merge(AsentamientoshumanosI16).merge(SuelodesnudoI16).merge(SaturadasvegetacionI16).merge(Selvas);



//_____________________Landsat Invernal 2016_____________________________________________
//Bandas para entrenamiento
var bandsl8I16 = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B10', 'B11', 'NDVI16LI' ];
//var bandsl8 = ['NDVI' ];
var EntrenamientoI16 = composite16LI.select(bandsl8I16).sampleRegions({
collection: AEInvierno16,
properties: ['Landcover'],
scale: 30
});

//Entrenamiento del clasificador
var ClasificadorInv16 =
ee.Classifier.smileRandomForest(10).train({
features:  EntrenamientoI16,
classProperty: 'Landcover',
inputProperties: bandsl8I16
});

//Correr la clasificación
var clasificacionInvierno16 = composite16LI.select(bandsl8I16).classify(ClasificadorInv16);

//Desplegar la clasificación
Map.addLayer(clasificacionInvierno16,
{min: 1, max: 7, palette: ['263aff', '00ff00', 'ff7c37', 'C0C0C0','FFFF00', '00FFFF','d63000']},
'Invernal Landsat 16');


// Crear una matriz de confusión.
print('Invierno16 matriz de error:', ClasificadorInv16.confusionMatrix());
print('Invierno16 exactitud: ', ClasificadorInv16.confusionMatrix().accuracy());


var geometry = ee.Geometry.Rectangle([-94.8, 18.8, -91.5116, 15.0]);

Export.image.toDrive({
 image: clasificacionInvierno16,
 description: "Clasificacion_Baja_L_Invierno16",
  scale: 30,
  maxPixels: 1e10,
  region: geometry,
  fileFormat: "GeoTIFF",
 });



