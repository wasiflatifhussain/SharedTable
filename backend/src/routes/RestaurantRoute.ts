import express from "express";
import { param } from "express-validator";
import RestaurantController from "../controllers/RestaurantController";

const router = express.Router();

router.get("/search/:area", 
    param("area")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Area parameter must be a valid string8"),
        RestaurantController.searchRestaurant
);

router.get("/:restaurantId",
    param("restaurantId")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("RestaurantId parameter must be a valid string8"),  
        RestaurantController.getRestaurant
)

export default router;