import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export async function PUT(req: Request, { params }: { params: Promise<{id: number}>}) {
    try {
        const { id: corteId } = await params;
        const corteData = await req.json();
        if(!corteData.nome || !corteData.valor || !corteData.categoriaId) {
            throw new Error("Dados imcompletos");
        }

        await prisma.corte.update({
            where: {id: Number(corteId)},
            data: {
                nome: corteData.nome,
                valor: corteData.valor,
                categoriaId: Number(corteData.categoriaId)
            }
        });

        return Response.json({
            error: false,
            message: "Corte de Id: " + corteId + " alterado com sucesso!"
        });

    } catch(e) {
        return Response.json({
            error: true,
            message: (e as Error).message
        }, {
            status: 500
        });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{id: number}>}) {
    try {
        const { id: corteId } = await params;

        await prisma.corte.delete({
            where: {id: Number(corteId)},
        });

        return Response.json({
            error: false,
            message: "Corte de Id: " + corteId + " excluido com sucesso!"
        });

    } catch(e) {
        return Response.json({
            error: true,
            message: (e as Error).message
        }, {
            status: 500
        });
    }
}