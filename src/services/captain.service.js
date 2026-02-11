import Captain from "../models/captain.model.js";

export const registerCaptain = async (data) => {

    const {
        fullName,
        email,
        password,
        phone,
        licenseNumber,
        vehicleType,
        vehicle,
        location,
        profilePicture
    } = data;

    // -------- Duplicate Email --------
    if (await Captain.findOne({ email })) {
        const error = new Error("Email already registered");
        error.statusCode = 409;
        throw error;
    }

    // -------- Duplicate License --------
    if (await Captain.findOne({ licenseNumber })) {
        const error = new Error("License number already registered");
        error.statusCode = 409;
        throw error;
    }

    // -------- Duplicate Plate --------
    if (await Captain.findOne({ "vehicle.plate": vehicle.plate })) {
        const error = new Error("Vehicle plate already registered");
        error.statusCode = 409;
        throw error;
    }

    // -------- Create Captain --------
    const captain = await Captain.create({
        fullName,
        email,
        password,
        phone,
        licenseNumber,
        vehicleType,
        vehicle,
        location,
        profilePicture
    });

    // 🔥 IMPORTANT — fetch real mongoose document
    const captainDoc = await Captain.findById(captain._id);

    // -------- Generate Token --------
    const token = captainDoc.generateAuthToken();

    // remove password
    const safeCaptain = await Captain.findById(captain._id).select("-password");

    return {
        token,
        captain: safeCaptain
    };
};

export const loginCaptain = async (email, password) => {

    const captain = await Captain.findOne({ email }).select("+password");

    if (!captain) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const isPasswordValid = await captain.comparePassword(password);
    if (!isPasswordValid) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    // 🔥 IMPORTANT — fetch real mongoose document
    const captainDoc = await Captain.findById(captain._id);

    // -------- Generate Token --------
    const token = captainDoc.generateAuthToken();

    // remove password
    const safeCaptain = await Captain.findById(captain._id).select("-password");

    return {
        token,
        captain: safeCaptain
    };
};

export default {
    registerCaptain,
    loginCaptain
};
