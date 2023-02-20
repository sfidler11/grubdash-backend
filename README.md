## Grubdash | Backend API

This repository is the backend API for the "Grubdash" application. Please find the front end [here](https://github.com/Thinkful-Ed/starter-grub-dash-front-end).

This backend API follows RESTful design principles to complete HTTP requests. This application allows the user to create, read, and update both dishes and orders through the front end application. It also allows the user to delete orders that they place.

## Installation

1. Fork and clone this repository
2. Run `npm install` to install local dependencies
3. Run `npm run start` to start the application

## Technologies

Javascript, Express.js

![javascript logo](/images/JavaScript.png)
![express logo](/images/express.png)

## Routes

| Request Type | Route | Description |
| -- | -- | -- |
| Get | `/orders` | Returns all orders currently in the database |
| Post | `/orders` | Creates an order to add to the database |
| Get | `/orders/:orderId` | Returns an order based on a order ID |
| Put | `/orders/:orderId` | Updates and returns an order |
| Delete | `/orders/:orderId` | Deletes an order from the database |
| Get | `/dishes` | Returns all dishes currently in the database |
| Post | `/dishes` | Creates a dish to add to the database |
| Get | `/dishes/:dishId` | Returns a dish based on a dish ID |
| Put | `/dishes/:dishId` | Updates and returns a dish |
