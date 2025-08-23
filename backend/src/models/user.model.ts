import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, UserRole } from "../shared/Authtypes";

export interface IUserDocument extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    resetOtp?: string;
    resetOtpExpiry?: Date;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUserDocument> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.Student,
        },
        resetOtp: { type: String },
        resetOtpExpiry: { type: Date },
    },
    {
        timestamps: true,
    }
);

UserSchema.pre<IUserDocument>("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
});

UserSchema.methods.matchPassword = async function (
    enteredPassword: string
): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password as string);
};

const UserModel = mongoose.model<IUserDocument>("User", UserSchema);
export default UserModel;
