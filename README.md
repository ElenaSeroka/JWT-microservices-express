# JWT-microservices-express

System overview

The image service was already deployed previously.
![image](https://github.com/ElenaSeroka/OAuth-JWT-microservices/assets/70527748/928498e7-7a76-4c76-9b8b-158ae0215456)
Flow chart
![image](https://github.com/ElenaSeroka/OAuth-JWT-microservices/assets/70527748/3dd49e20-907e-425e-8128-06dc6a99766b)

In this project, a system was created consisting of two services (Auth and Resource) that needed to be developed and one existing service (Image).
From the consumer's perspective, the API has a single entry point even though it consists of multiple back-end services.
The system handled images (called "resources") in a Restful manner through the use of three "microservices." No client application needed to be developed. 

The client tried to contact the resource service but got a 403 back.
The client registered an account and logged in to the system. It received a JWT upon successful login.
Using the JWT as a Bearer token, the client could add, update, and delete resources in the system.
When the client did a C- U- or D-request, the Resource service sent a request to the Image-service to add, delete or update an image. The Resource service stored the resources together with image "metadata." The Resource service responded to the client with the created document.
The client could request the image from the URL provided by the resource service.

Auth service
The Auth service was a service that authenticated users and handed out JWT on login. The JWT handed out by the Auth-service was validated and trusted by the Resource-service to use account information stored in the JWT without contacting the Auth-service.


Resource service
This service handled the resources in the overall application. In this case, this included things like the user's image-URLs, image-descriptions, and image-title. The images were not stored in this service, though. Instead, an external image service was used to store the images.

Image service (existing)
This service stored all images that the application needed. This service was already deployed, and could be found at:
https://courselab.lnu.se/xxxxxxxxxx/v1/
In its documentation, there was information on how to communicate with the service. Some things to note:

Image data needed to be sent as a Base64-encoded string.
The service communicated using an Access token. You could find the token in your "Secrets"-project.
The service had a public interface on which it served the images. Only the image URL was needed to be stored in the resource service.
The payload sent to the server could not exceed 500kb.


