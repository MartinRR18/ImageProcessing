/*
Autor: A. Martín Ramírez Rabelo

Descripción: Cálculo del índice de vegatación NDVI para una colección de imágenes filtrada del satélite sentinel 2 en GEE.

*/

var sentinel2 = ee.ImageCollection("COPERNICUS/S2")
.filterDate("2018-01-01","2021-01-01") //Filtro por fecha
.filterBounds(geometry) //filtro por geometría
.filterMetadata("CLOUDY_PIXEL_PERCENTAGE","Less_Than",10)

//Imprimimos propiedades del dataset filtrado en la consola
print(sentinel2)

//Seleccionar la imagen con menor cobertura de nubes
var senti2 = sentinel2.sort("CLOUDY_PIXEL_PERCENTAGE").first()

//Cortamos imagen de acuerdo con el área de estudio
var senti2_c = senti2.clip(geometry);

var rgbvis = {
  max: 4165,
  min: 0,
  gamma: 1.0,
  bands: ["B4","B3","B2"]
  };
  
//Agragamos capa

//Map.setCenter(-96.91, 19.51,11);
Map.centerObject(geometry);
Map.addLayer(senti2_c, rgbvis, 'Senti2_RGB');


//-------Cálculo NDVI-----------

//Opción 1
var ndvi1 = senti2_c.normalizedDifference(["B8","B4"]);

var ndvi_vis = {
  max: 0.7,
  min: -0.5,
  palette: ['FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718',
'74A901', '66A000','529400','3E8601','207401','056201','004C44',
'023B01','012E01','011D01','011301']
};

//Agregar Capa
Map.addLayer(ndvi1,ndvi_vis,"NDVI_1")


//Opción 2

var ndvi2 = senti2_c.expression("(nir-red)/(nir+red)",{
  "nir": senti2_c.select("B8"),
  "red": senti2_c.select("B4")
  });
  
  
//Agregamos Capa
Map.addLayer(ndvi2,ndvi_vis,"NDVI_2")

