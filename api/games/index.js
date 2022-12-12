import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

export const getGames = async (ctx) =>
{
    const gameTime = ctx.request.query.gameTime;
    let where;
    
    if (gameTime)
    {
        // 2022-11-21T16:00:00Z => 2022-11-21T00:00:00Z and 2022-11-21T24:00:00Z //startsWith and endWith
        const startGameTime = gameTime.slice(0, 11 ) + "00:00:00Z";
        const endGameTime = gameTime.slice(0, 11 ) + "23:59:00Z";
        where = { gameTime: { gt: startGameTime, lt: endGameTime } }
    }
    else where = {};

    try
    {
        const games = await prisma.game.findMany(
        { where: where });

        ctx.body = games;
        ctx.status = 200;
    } 
    catch (error)
    {
        console.error(error);
        ctx.body = error;
        ctx.status = 500;
    }    
}