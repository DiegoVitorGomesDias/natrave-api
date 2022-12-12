import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

import jsonwebtoken from "jsonwebtoken";
import * as dotenvsafe from "dotenv-safe";
dotenvsafe.config();

export const createHunch = async (ctx) =>
{
    if (!ctx.headers.authorization) return ctx.status = 401;
    const [ typeAuthorization, tokenUser] = (ctx.headers.authorization).split(" ");
    
    const { gameId } = ctx.request.body
    const homeTeamScore = parseInt(ctx.request.body.homeTeamScore);
    const awayTeamScore = parseInt(ctx.request.body.awayTeamScore);
    if ( typeof(homeTeamScore) !== "number" && typeof(awayTeamScore) !== "number" ) return ctx.status = 400;    

    const createHunchFromUser = async (userId) =>
    {
        const [hunch] = await prisma.hunch.findMany({ where: { userId, gameId } })
        return ctx.body = hunch
        ?
            await prisma.hunch.update
            ({ 
                where: { id: hunch.id },
                data: { userId, gameId, homeTeamScore, awayTeamScore },
            })
        :
            await prisma.hunch.create
            ({ 
                data: { userId, gameId, homeTeamScore, awayTeamScore },
            })
        ;
    }

    try 
    {
        const verifyToken = jsonwebtoken.verify( tokenUser, process.env.JWT_SECRET );
        return createHunchFromUser(verifyToken.sub);
    }
    catch (error) { return ctx.status = 400 };
}

export const getHunches = async (ctx) =>
{
    if (!ctx.headers.authorization) return ctx.status = 401;
    const [ typeToken, token ] = (ctx.headers.authorization).split(" ");
    const [url, params] = (ctx.request.url).split("?")
    const urlParams  = new URLSearchParams(params)
    const gameId = urlParams.get("gameId");

    const getHunchesFromUser = async (userId, gameId) =>
    {
        try
        {
            const hunches = gameId 
            ?
                await prisma.hunch.findMany({ where: {userId, gameId} })
            :
                await prisma.hunch.findMany({ where: {userId} })
            ;

            ctx.body = hunches;
            ctx.status = 200;
        } 
        catch (error)
        {
            console.error(error);
            ctx.body = error;
            ctx.status = 500;
        }
    }

    try 
    {
        const verifyToken = jsonwebtoken.verify( token, process.env.JWT_SECRET );
        return getHunchesFromUser(verifyToken.sub, gameId)
    } 
    catch (error) { return ctx.status = 400; }
}

export const getHunchesFromUser = async (ctx) =>
{
    const username = ctx.request.params.username;
    try
    {
        const user = await prisma.user.findUnique({ where: { username } });
        const hunches = await prisma.hunch.findMany({ where: { userId: user.id } });
        ctx.body = hunches;
        ctx.status = 200;
    } 
    catch (error)
    {
        console.error(error);
        ctx.body = error;
        ctx.status = 500;
    }    
}

export const deleteHunch = async (ctx) =>
{
    if (!ctx.headers.authorization) return ctx.status = 401;
    const [ typeToken, token ] = (ctx.headers.authorization).split(" ");
    const { gameId } = ctx.request.body

    try 
    {
        const verifyToken = jsonwebtoken.verify( token, process.env.JWT_SECRET );
        const userId = verifyToken.sub;
        const dataHunch = await prisma.hunch.deleteMany({ where: { userId, gameId } });
        return ctx.body = dataHunch;
    }
    catch (error) { return ctx.status = 400 };
}


