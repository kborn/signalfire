import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const topics = [
    {
        slug: "democracy",
        name: "Democracy",
        description:
            "Issues related to democratic institutions, voting rights, election integrity, and civic participation in government.",
    },
    {
        slug: "consumer-activism",
        name: "Consumer Activism",
        description:
            "Actions focused on influencing corporate behavior through consumer choices such as boycotts, ethical purchasing, and corporate accountability campaigns.",
    },
    {
        slug: "climate",
        name: "Climate",
        description:
            "Issues related to climate change, environmental protection, sustainability, and policies affecting the planet’s ecological systems.",
    },
    {
        slug: "civil-rights",
        name: "Civil Rights",
        description:
            "Issues involving the protection and advancement of equal rights and liberties, including racial justice, gender equality, LGBTQ+ rights, and disability rights.",
    },
    {
        slug: "economic-justice",
        name: "Economic Justice",
        description:
            "Issues related to economic fairness, inequality, labor conditions, housing affordability, wages, and access to economic opportunity.",
    },
    {
        slug: "education",
        name: "Education",
        description:
            "Issues involving public education systems, school policy, curriculum debates, student rights, and education funding.",
    },
    {
        slug: "local-community",
        name: "Local Community",
        description:
            "Community-level civic engagement including local organizing, mutual aid, neighborhood initiatives, and grassroots participation.",
    },
];

async function main() {
    for (const topic of topics) {
        await prisma.topic.upsert({
            where: { slug: topic.slug },
            update: {
                name: topic.name,
                description: topic.description,
            },
            create: topic,
        });
    }
}
main()
    .then(async () => {
        await prisma.$disconnect();
        pool.end()
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        pool.end()
        process.exit(1);
    });