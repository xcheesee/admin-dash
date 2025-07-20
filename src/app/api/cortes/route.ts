import { Corte } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { CorteComCategoria } from "@/lib/types";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const cortes = await prisma.corte.findMany({
            include: {
                categoria: true
            }
        });

        return Response.json({
            error: false,
            message: "dados recuperados com sucesso",
            data: cortes
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
        if(!resBody?.nome || !resBody?.valor || !resBody.categoriaId) {
            throw new Error(resBody.nome);
        }

        await prisma.corte.create({
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