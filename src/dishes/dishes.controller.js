const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

//Uses the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

//determines if a dish exists using the dish Id
function dishExists(req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if(foundDish){
        res.locals.dish = foundDish;
        return next();
    }
    next({
        status: 404,
        message: `Dish does not exist: ${dishId}.`
    });
};

//the following functions will validate if  dish has the correct name, description, price, and image values
function validateName(req, res, next) {
    const { data: {name} = {} } = req.body;
    if(name && name.length > 0){
        return next();
    }
    next({
        status: 400,
        message: "Dish must include a name",
    });
};

function validateDescripiton(req, res, next) {
    const { data: {description} = {}} = req.body;
    if(description && description.length > 0){
        return next();
    }
    next({
        status: 400,
        message: "Dish must include a description",
    });
};

function validatePrice(req, res, next) {
    const { data: {price} = {} } = req.body;
    if(!price){
        next({
            status: 400,
            message: "Dish must include a price",
        });
    }
    return next();
}

function validatePriceParams(req, res, next){
    const { data: {price} = {} } = req.body;
    const priceNumber = Number(price);
    if(priceNumber > 0 && Number.isInteger(price)){
        return next();
    }
    next({
        status: 400,
        message: "Dish must have a price that is an integer greater than 0",
    });
}

function validateImage(req, res, next) {
    const { data: {image_url} = {} } = req.body;
    if(image_url && image_url.length > 0){
        return next();
    }
    next({
        status: 400,
        message: "Dish must include a image_url",
    });
};

//create a new dish
function newDish(req, res, next){
    const { data: {name, description, price, image_url} = {}} = req.body;
    //calls the nextId function to create a uniqure id for the dish
    const id = nextId();

    //the new dish must have the following parameters, these are validated by the validation functions
    const newDish = {
        id: id,
        name,
        description,
        price,
        image_url
    }

    dishes.push(newDish);
    res.status(201).json({ data: newDish });

}

//updates an existing dish
function updateDish(req, res, next) {
    let dish = res.locals.dish;
    const originalDishId = dish.id;
    const { data: { id, name, description, price, image_url } = {} } = req.body;
    if (id && !(originalDishId === id)) {
        return next({ status: 400, 
            message: `Dish id does not match route id. Dish: ${id}, Route: ${originalDishId}` 
        });

    }
    //removed the ability to update the dish id in the update section
    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image_url = image_url;
    res.json({ data: dish })
}

//returns a single dish
function readDish(req, res, next) {
    res.json({ data: res.locals.dish})
};

//returns a list of all of the dishes
function listDishes(req, res, next) {
    const { orderId } = req.params;
    res.json({ data: dishes.filter(orderId ? dish => dish.id === Number(orderId) : () => true)});
}

module.exports = {
    listDishes,
    read: [dishExists, readDish],
    create: [validateDescripiton, validateImage, validateName, validatePrice, validatePriceParams, newDish],
    update: [dishExists, validateName, validateDescripiton, validateImage, validatePrice, validatePriceParams, updateDish],
}