import { prisma } from "@/lib/prisma";

export async function GET(req: Request, res: Response) {
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