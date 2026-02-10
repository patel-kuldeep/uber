import UserModel from "../models/user.model.js";

const createUser = async ({ firstName, lastName, email, password, phone, role }) => {
    try {
        if (!firstName || !lastName || !email || !password) {
            throw new Error("All fields are required");
        }

        const user = await UserModel.create({
            fullName: { firstName, lastName },
            email,
            password,
            phone,
            role
        });

        return user;

    } catch (error) {
        throw new Error(error.message || "Error creating user");
    }
};

export default {
    createUser
};
