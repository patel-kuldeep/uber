export const errorHandler = (err, req, res, next) => {
    console.error("🔥 Error:", err);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    /* =====================
       Mongoose Errors
    ===================== */
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    }

    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
    }

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
};
