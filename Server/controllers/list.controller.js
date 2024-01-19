import List from "../models/list.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const createList = async (req, res, next) => {
    try {
        const list = await List.create(req.body);
        res.status(201).json(list);
    } catch (error) {
        next(error);
    }
};

export const deleteList = async (req, res, next) => {
    try {
        const property = await List.findById(req.params.id);

        if (!property) return next(errorHandler(404, "Property not found"));

        if (req.user.id !== property.userRef) return next(errorHandler(401, "Unauthorized to delete"));

        await List.findByIdAndDelete(req.params.id);
        res.status(200).json("Property deleted successfully");
    } catch (error) {
        next(error);
    }
}

export const updateList = async (req, res, next) => {
    try {
        const property = await List.findById(req.params.id);
        if(!property) return next(errorHandler(404, "Property Not found"));

        if(req.user.id !== property.userRef) return next(errorHandler(401, "Unauthorized to Update"));

        const updatedList = await List.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json(updatedList);
    } catch (error) {
        next(error);
    }
}

export const getList = async (req, res, next) => {
    try {
        const property = await List.findById(req.params.id);
        if(!property) return next(errorHandler(404, "Property Not found"));
        
        res.status(200).json(property);

    } catch (error) {
        next(error);
    }
}