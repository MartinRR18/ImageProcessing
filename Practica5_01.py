from PIL import Image as im
import matplotlib.pyplot as plt
import numpy as np

I = im.open("alpes.png")
I2 = im.open("kurt.jpg")
I3 = im.open("Hawaii.jpg")
I22 = I2.convert("L")
I33 = I3.convert("L")
I.show()
I3.show()
I33.show()

#Mostrará en la pantalla la imagen seleccionada con los siguientes comandos, se imprimirá en la pantalla de la consola, las características de cada imagen, como la resolución en pixeles, el tipo de escala de color que tiene, siendo L para escala a grises y RGB a color, y el path o formato de imagen.

print("alpes.png -> ", I.size, I.mode, I.format)
print("kurt.jpg -> ", I2.size, I2.mode, I2.format)
print("Hawaii.jpg -> ", I3.size, I3.mode, I3.format)

#Convertimos las imágenes en arrays de datos #(a,dtype,order,like)

a = np.asarray(I, dtype = np.uint8)
b = np.asarray(I2, dtype = np.uint8)
c = np.asarray(I3, dtype = np.uint8)
d = a[251:500, 300:800] #Tomamos un segmento de la imagen.

#Creación de matriz de imágenes por medio de la librería matplotlib

plt.figure() #Crea una figura nueva

plt.subplot(221) #Agrega un eje a la figura actual
plt.imshow(a,cmap="gray", interpolation='nearest')
#Muestralos datos como imagen o como un raster en 2D
plt.title("Alpes") #Agregamos un título a la imagen

plt.subplot(222)
plt.imshow(d,cmap="gray", interpolation='nearest')
plt.title("Alpes Forest")

plt.subplot(223)
plt.imshow(b,cmap="gray", interpolation='nearest')
plt.title("Kurt")

plt.subplot(224)
plt.imshow(c,cmap="gray", interpolation='nearest')
plt.title("Hawaii")

plt.show() #Muestra todas las gráficas/imágenes abiertas o creadas
