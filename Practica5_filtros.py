from PIL import Image as im
import matplotlib.pyplot as plt
import cv2

#APLICAREMOS DIFERENTES TIPOS DE FILTROS A UNA MISMA IMAGEN
img = im.open("frutas1.jpeg")
gray = cv2.imread("frutas1.jpeg", 0)
laplacian = cv2.Laplacian(gray, cv2.CV_8U)
sobely = cv2.Sobel(gray, cv2.CV_8U, 1, 0, ksize = 3)
sobelx = cv2.Sobel(gray, cv2.CV_8U, 0, 1, ksize = 3)
sobelxy = cv2.Sobel(gray, cv2.CV_8U, 1, 1, ksize = 3)
gauss = cv2.GaussianBlur(gray, (5, 5), 0)
edges_det = cv2.Canny(gray, 50, 100)
gauss = cv2.GaussianBlur(gray, (5, 5), 0)
canny = cv2.Canny(gauss, 50, 100)



#Forma corta para desplegar imágenes
#Creamos una lista que contenga a los objetos imagen creados
images = [img, gray, sobelx, sobely, sobelxy, gauss, laplacian,
edges_det, canny]
#creamos una lista con las posiciones respectivas que llevaran las imágenes
location = [331, 332, 333, 334, 335, 336, 337, 338, 339]
#creamos una lista con los títulos de cada objeto-imagen creado
titles = ["Original", "Gray" , "Sobel X", "Sobel Y", "Sobel XY",
"Gaussiano", "Laplaciano", "Extractor de Bordes", "Canny = gray + Gauss + edge"]
#creamos los identificadores loc, filtrado, title para recorrer cada una de las listas creadas con los objetos correspondientes. La asignación es uno a uno, lo que quiere decir que se asignarán los identificadores en el orden que encuentren las listas
#loc -> location, filtrado -> images, title -> titles
for loc, filtrado, title in zip(location, images, titles):
	plt.subplot(loc)
#indicamos en donde vamos a graficar
	plt.imshow(filtrado, cmap = 'gray') #a quien vamos a graficar
	plt.title(title)
#el título del objeto en cuestión
	plt.xticks([])
	plt.yticks([])
plt.show()
