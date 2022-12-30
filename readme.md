# NaTrave Full Stack Challenge Web

Projeto desenvolvido para estudo durante o evento Full Stack Challenge da [Codar.me](https://codar.me/).

## Sobre 

O projeto consiste em uma aplicação de compartilhamento de palpites dos jogos da Copa do Mundo de 2022.

**Routes**: 
``
get("/login");
get("/users");
post("/users");
delete("/users");

get("/hunches"s;
post("/hunches");
delete("/hunches");

get("/games");

get("/:username");
``

### BackEnd

API construída com o framework [KoaJS](https://koajs.com/) utilizando o [Prisma](https://www.prisma.io/) como ORM e [PlanetScale](https://planetscale.com/) como database MySQL.

Vale ressaltar que todo o projeto teve como principal base os vídeos da [Codar.me](https://codar.me/) com leves alterações.

O projeto serviu principalmente para reforçar meu entendimento sobre requisições e responses, tratamento e verificação de dados, uso de data model com Prisma, conexão com o banco de dados na nuvem, como funcionam as variáveis de ambiente e principalmente na realização de logins, logouts, validação do token de acesso criptografia básica.