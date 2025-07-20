import { PrismaClient } from "../src/generated/prisma";
const prisma = new PrismaClient();

const categoriasCortes = [
    { nome: "Cortes de 1ª" },
    { nome: "Cortes de 2ª" },
    { nome: "Espetos" }
];

const cortesDePrimeira = [
    {
        nome: 'Patinho',
        valor: '49,99'
    },
    {
        nome: 'Coxao Mole',
        valor: '49,99'
    },
    {
        nome: 'Coxao Duro',
        valor: '49,99'
    },
    {
        nome: 'Alcatra',
        valor: '49,99'
    },
    {
        nome: 'Maminha',
        valor: '49,99'
    },
];

const cortesDeSegunda = [
    {
        nome: 'Miolo do Acem',
        valor: '49,99'
    },
    {
        nome: 'Musculo',
        valor: '49,99'
    },
    {
        nome: 'Rabo Bovino',
        valor: '49,99'
    },
    {
        nome: 'Fraldinha',
        valor: '49,99'
    },
    {
        nome: 'Costela Gaucha',
        valor: '49,99'
    },
];

const seed = async () => {
    await prisma.corte.deleteMany();
    await prisma.categoriaCorte.deleteMany();
    let catPrimeira = prisma.categoriaCorte.create({
        data: {
            nome: "Cortes de 1ª"
        }
    });

    let catSegunda = prisma.categoriaCorte.create({
        data: {
            nome: "Cortes de 2ª"
        }
    });

    let catEspetos = prisma.categoriaCorte.create({
        data: {
            nome: "Espetos"
        }
    });

    let [catPrimeiraRes, catSegundaRes, catEspetosRes] = await Promise.all([catPrimeira, catSegunda, catEspetos]);

    const cortesDePrimeiraPromise = cortesDePrimeira.map(corte => {
        return prisma.corte.create({
            data: {
                nome: corte.nome,
                valor: corte.valor,
                categoriaId: catPrimeiraRes.id
            }
        });
    });

    const cortesDeSegundaPromise = cortesDeSegunda.map(corte => {
        return prisma.corte.create({
            data: {
                nome: corte.nome,
                valor: corte.valor,
                categoriaId: catSegundaRes.id
            }
        });
    });

    await Promise.all([...cortesDePrimeiraPromise, ...cortesDeSegundaPromise]);
}

seed()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })