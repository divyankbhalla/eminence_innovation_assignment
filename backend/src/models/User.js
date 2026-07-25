import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import ROLES from "../constants/roles.js";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            minlength: 3,
            maxlength: 30,
            index: true
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false,
        },

        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.EMPLOYEE,
        },

        manager: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        teamLead: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.set("toJSON", {
    transform: (_, returnedObject) => {
        delete returnedObject.password;
        return returnedObject;
    },
});

const User = mongoose.model("User", userSchema);

export default User;