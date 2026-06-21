import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

const register = async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await prisma.user.findUnique({
        where: { email: email },
    });
    if (userExists)
        return res
            .status(400)
            .json({ error: "User already exists with this email" });

    //auth/hashing using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    //create user, other fields have default values
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashed,
        },
    });

    //JWT token
    const token = await generateToken(user.id, res);
    console.log(token);

    //response
    res.status(200).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                email: email,
            },
            token,
        },
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { email: email },
    });

    if (!user) return res.status(401).json({ error: "No user found." });

    const isPwValid = await bcrypt.compare(password, user.password);
    if (!isPwValid) {
        return res.status(401).json({ error: "Invalid email/password" });
    }

    const token = generateToken(user.id, res);

    //response
    res.status(200).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                email: email,
            },
            token,
        },
    });
};

const logout = async (req, res) => {
    res.cookie("jwt", "", {
        expires: new Date(0), //expires right now
        httpOnly: true,
    });

    res.status(200).json({
        status: "success",
        message: "logged out",
    });
};

export { register, login, logout };
