const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

//determines if an order exist by the order id
function orderExists(req, res, next){
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === orderId);
    if(foundOrder) {
        res.locals.order = foundOrder;
        return next();
    }
    next({
        status: 404,
        message: `Order id not found ${orderId}`
    })
};

//the following function validate an order request
//the deliverTo, mobileNumber, dishes, and quantity object in the order array have to abide by specific conditions
function validateDeliverTo(req, res, next) {
    const { data: {deliverTo} = {} } = req.body;
    if(deliverTo && deliverTo.length > 0) {
        return next();
    }
    next({
        status: 400,
        message: "Order must include a deliverTo",
    })
};

function validateMobileNumber(req, res, next) {
    const { data: {mobileNumber} = {} } = req.body;
    if(mobileNumber && mobileNumber.length > 0) {
        return next();
    }
    next({
        status: 400,
        message: "Order must include a mobileNumber",
    })
};

function validateDishes(req, res, next) {
    const  {data: {dishes} = {} } = req.body;
    if(!dishes){
        return next({
            status: 400,
            message: "Order must include a dish",
        });
    }
    else if(dishes.length < 1 || !(Array.isArray(dishes))){
        return next({
            status: 400,
            message: "Order must include at least one dish",
        })
    }

    next();
};

function validateDishQuantity (req, res, next) {
    const {data: {dishes} = {} } = req.body;
    for (index in dishes){
        let dish = dishes[index];
        const quantity  = dish.quantity
        if(!(quantity) || quantity < 1 || !(Number.isInteger(quantity))){
            return next({
                status: 400,
                message: `Dish ${index} must have a quantity that is an integer greater than 0`
            })
        }
    }
    next();
}

//creates a new order
function newOrders (req, res, next) {
    const { data: {deliverTo, mobileNumber, status, dishes} = {} } =  req.body;
    const orderId = nextId();
    const newOrder = {
        id: orderId,
        deliverTo,
        mobileNumber,
        status,
        dishes
    }
    orders.push(newOrder);
    res.status(201).json({ data: newOrder });
}

//updates an order
function updateOrder (req, res, next) {
    let order = res.locals.order;
    const orderId = order.id;
    const { data: {id, deliverTo, mobileNumber, status, dishes} = {} } =  req.body;
    if(id && !(orderId === id)){
        return next ({
            status: 400,
            message: `Order id does not match route id. Order: ${id}, Route: ${orderId}.`,
        })
    }

    else if (!status || status.length < 1 || status === "invalid"){
        return next ({
            status: 400,
            message: "Order must have a status of pending, preparing, out-for-delivery, delivered",
        })
    }

    else if (status === "delivered"){
        return next ({
            status: 400,
            message: "A delivered order cannot be changed",
        })
    }
    //removed the ability to change the order id in the update section
    order.deliverTo = deliverTo;
    order.mobileNumber = mobileNumber;
    order.status = status;
    order.dishes = dishes;
    res.json({ data: order});
}

//to delete an order
function deleteOrder(req, res, next) {
    const { orderId } = req.params;
    const orderToDelete = orders.find((order) => order.id = orderId);
    const index = orders.findIndex((order) => order.id = orderId);
    if(orderToDelete.status !== "pending"){
        return next({
            status: 400,
            message: "You can only delete pending orders"
        })
    }
    else if(index > -1 ) {
        orders.splice(index, 1);
    }
    res.sendStatus(204);
}

//reads a specific order with the ordered dish
function readOrder(req, res, next) {
    res.json({ data: res.locals.order });
}

//shows all of the orders and associated dishes
function listOrders(req, res, next) {
    res.json({ data: orders })
}

module.exports = {
    listOrders,
    read: [orderExists, readOrder],
    create: [validateDeliverTo, validateMobileNumber, validateDishes, validateDishQuantity, newOrders],
    update: [orderExists, validateDeliverTo, validateMobileNumber, validateDishes, validateDishQuantity, updateOrder],
    delete: [orderExists, deleteOrder],
}