// Autor: A. Martín Ramírez Rabelo
// Creación de timelapses en Google Earth Engine
// http://www.gisandbeers.com/crear-timelapses-en-google-earth-engine/

// Llamamos a la colección de imágenes y filtramos fechas de análisis
var MODIS = ee.ImageCollection('MODIS/006/MCD43A4')
  .filterDate('2019-01-01', '2020-01-01');

// Componemos la imagen RGB o generamos un índice para el timelapse
var MODIS_ColorReal = MODIS.select([
  'Nadir_Reflectance_Band1', 'Nadir_Reflectance_Band4',
  'Nadir_Reflectance_Band3']);

// Definimos las coordenadas máximas y mínimas de visualización en el timelapse
//var ZonaAOI = ee.Geometry.Rectangle({
  //coords: [[-20,20], [110,60]]});

// Parametrizamos el timelapse con proyección, resolución, AOI, valores de pixel y frames/seg
var Timelapse = {
  crs: 'EPSG:4326',
  dimensions: '300',
  region: PeninsYuca,
  min: 0.0,
  max: 3500,
  gamma: 1.4,
  framesPerSecond: 15,};

// Creamos la animación con la colección de imagenes y parámetros del timelapses
var Animacion = ui.Thumbnail({
  image: MODIS_ColorReal,
  params: Timelapse,
  style: {
    position: 'bottom-right', //'bottom-right','bottom-right'
    width: '600px'}});
Map.add(Animacion);

// Adicionalmente visualizamos una imagen compuesta del timelapse sobre el visor
var MODIS_Composicion = ee.Image(MODIS_ColorReal.median());
Map.addLayer (MODIS_Composicion, {
  min: 0.0,
  max: 4000.0,
  gamma: 1.4,
  bands: ['Nadir_Reflectance_Band1', 'Nadir_Reflectance_Band4',
  'Nadir_Reflectance_Band3']}, 
  'Imagen MODIS');
Map.centerObject(MODIS_Composicion, 2);
