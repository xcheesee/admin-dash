import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{id: number}>}) {
    try {
        const { id: categoriaId } = await params;
        const categoriaData = await req.json();
        if(!categoriaData.nome) {
            throw new Error("Dados imcompletos");
        }

        await prisma.corte.update({
            where: {id: Number(categoriaId)},
            data: {
                nome: categoriaData.nome,
            }
        });

        return Response.json({
            error: false,
            message: "Categoria de Id: " + categoriaId + " alterado com sucesso!"
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
        const { id: categoriaId } = await params;

        const cortesDaCategoria = await prisma.corte.findFirst({
            where: {categoriaId: categoriaId}
        });

        if(!!cortesDaCategoria) {
            throw new Error("Categoria com cortes vinculados");
        }

        await prisma.corte.delete({
            where: {id: Number(categoriaId)},
        });

        return Response.json({
            error: false,
            message: "Categoria de Id: " + categoriaId + " excluido com sucesso!"
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