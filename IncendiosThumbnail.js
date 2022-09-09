/*
Autor: A. Martín Ramírez Rabelo

Descripción: Programa para analizar las zonas de incendios diferenciando entre los falsos positivos y creación de una animación o timelapse de incendios en la región de la península de méxico en un año.
*/


//Visualizar la República con sus divisiones estatales.
var RepEdos = ee.FeatureCollection('users/cbi2192802478/destdv1mg');
RepEdos = RepEdos.geometry();

var styling = {color: 'green', fillColor: '00000000'};
Map.addLayer(table.style(styling));




//Agregamos capa de firmas de calor en un intervalo de tiempo.
var collectionImages=ee.ImageCollection("FIRMS")
                        .filterDate('2019-01-04','2020-01-01');
                        
      var confianzaMaxima = collectionImages.map(function(image)
                              {
                             var confianza = image.select('confidence').gte(90);
                           return confianza;
                              }                                          
                                            );
      
      Map.addLayer(confianzaMaxima,{palette:['Yellow','Black']},'Incendios Forestales 2');
      Map.addLayer(collectionImages,{},'Incendios Forestales ');      
            

//Generamos animación mediante funcion de interfaz de usuario ui.Thumbnail.
var generaAnimacion = function(coleccionImagenes,AreaInteres,framesPorSegundo)
                    {    
                       var params = {
                                     crs: 'EPSG:3857', //Mercator
                                     dimension: 400,   
                                     region: AreaInteres,
                                     framsPerSecond: framesPorSegundo,
                                     };
  
                      //Crea un video Thumbnail(En miniatura) y lo agrega al mapa. 
                       var miniatura = ui.Thumbnail(coleccionImagenes,params);
                       return miniatura;
                       
                     };
                     
print(generaAnimacion(collectionImages,PeninsYuca2,10));  


