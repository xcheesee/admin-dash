import { Prisma } from "@/generated/prisma";

const corteComCategoria = Prisma.validator<Prisma.CorteDefaultArgs>()({
    include: { categoria: true}
});

type CorteComCategoria = Prisma.CorteGetPayload<typeof corteComCategoria>

export {
    type CorteComCategoria,
}