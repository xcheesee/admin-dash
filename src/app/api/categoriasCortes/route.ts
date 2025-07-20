import { prisma } from "@/lib/prisma";

export async function GET(req: Request, res: Response) {
    try {
        const categoriasCortes = await prisma.categoriaCorte.findMany();

        return Response.json({
            error: false,
            message: "dados recuperados com sucesso",
            data: categoriasCortes
        }, { status: 200});
    } catch(e) {
        return Response.json({
            error: true,
            message: (e as Error).message
        }, {
            status: 500
        });
    }
}

export async function POST(req: Request, res: Response) {
    try {
        const resBody = await req.json();
        if(!resBody?.nome) {
            throw new Error("Requisicao com dados incompletos");
        }

        await prisma.categoriaCorte.create({
            data: resBody
        });

        return Response.json({
            error: false,
            message: "Cadastrado com sucesso."
        });
    } catch (e) {
        return Response.json({
            error: true,
            message: (e as Error).message 
        }, {
            status: 400
        });
    }
}