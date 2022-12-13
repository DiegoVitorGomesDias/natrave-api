import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

// import * as dotenvsafe from "dotenv-safe";
// dotenvsafe.config();

import * as bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

export const createUser = async (ctx) =>
{
    const {name, username, email} = ctx.request.body
    const password = await bcrypt.hash(ctx.request.body.password, 10);

    const data =
    {
        name: name,
        username: username,
        email: email,
        password: password,
    }

    try
    {
        const { password , ...user} = await prisma.user.create({ data })
        ctx.body = user;
        ctx.status = 201;
    } 
    catch (error)
    {
        console.error(error);
        ctx.body = error;
        ctx.status = 500;
    }
}

export const getUsers = async (ctx) =>
{
    const usernameFind = ctx.request?.query?.username || false
    try
    {        
        const userFind = usernameFind 
        ? 
            await prisma.user.findUnique({ where: { "username": usernameFind } })
        : 
            await prisma.user.findMany()
        ;

        if(usernameFind !== false)
        {
            const { name, username } = userFind;
            ctx.body = { name, username };
            ctx.status = 200;
        }
        else ctx.body = userFind;
    } 
    catch (error)
    {
        console.error(error);
        ctx.body = error;
        ctx.status = 500;
    }
}

export const login = async (ctx) =>
{
    if (!ctx.headers.authorization) return ctx.status = 401;
    const [ typeCodec, userToken ] = ctx.headers.authorization.split(" ");
    const [ email, decodePassword ] = Buffer.from(userToken, "base64").toString('utf8').split(":");

    const userFind = await prisma.user.findUnique({ where: { email } });
    if (!userFind) return ctx.status = 404;

    const passwordMatch = await bcrypt.compare(decodePassword , userFind.password);
    if ( !passwordMatch ) return ctx.status = 404;

    const { password, ...user } = userFind;

    const serverToken = jsonwebtoken.sign
    (
        { sub: user.id, name: user.name },
        process.env.JWT_SECRET, { expiresIn: "24h" }
    );

    ctx.body = 
    {
        user: user,
        accessToken: serverToken
    };
}

export const deleteUser = async (ctx) =>
{
    if (!ctx.headers.authorization) return ctx.status = 401;
    const [ typeToken, token ] = (ctx.headers.authorization).split(" ");

    try 
    {
        const verifyToken = jsonwebtoken.verify( token, process.env.JWT_SECRET );
        const userId = verifyToken.sub;

        const dataHunch = await prisma.hunch.deleteMany({ where: { userId } });
        const dataUserDelete = await prisma.user.delete({ where: { id: userId } });
        
        return ctx.body = userId, dataHunch, dataUserDelete;        
    } 
    catch (error) { return ctx.status = 400 };    
}