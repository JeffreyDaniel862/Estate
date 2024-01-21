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
        if (!property) return next(errorHandler(404, "Property Not found"));

        if (req.user.id !== property.userRef) return next(errorHandler(401, "Unauthorized to Update"));

        const updatedList = await List.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedList);
    } catch (error) {
        next(error);
    }
}

export const getList = async (req, res, next) => {
    try {
        const property = await List.findById(req.params.id);
        if (!property) return next(errorHandler(404, "Property Not found"));

        res.status(200).json(property);

    } catch (error) {
        next(error);
    }
}

export const getAllList = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer;

        if (offer === undefined || offer === "false") {
            offer = { $in: [false, true] }
        }

        let furnished = req.query.furnished;

        if (furnished === undefined || furnished === "false") {
            furnished = { $in: [false, true] }
        }

        let parking = req.query.parking

        if (parking === undefined || parking === "false") {
            parking = { $in: [false, true] }
        }

        let type = req.query.type;

        if (type === undefined || type === "all") {
            type = { $in: ["sale", "rent"] }
        }

        const searchTerm = req.query.searchTerm || "";
        const sorts = req.query.sorts || "createdAt";
        const order = req.query.order || "desc";

        const lists = await List.find({
            name: { $regex: searchTerm, $options: "i" },
            type,
            furnished,
            parking,
            offer
        }).sort({ [sorts]: order }).limit(limit).skip(startIndex);

        return res.status(200).json(lists);

    } catch (error) {
        next(error);
    }
}