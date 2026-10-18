
import { prisma } from '../lib/prisma.js'

async function main() {
    const organization = await prisma.organization.upsert({
        where: {
            slug: 'salesflow-development',
        },
        update: {},
        create: {
            name: 'SalesFlow Development',
            slug: 'salesflow-development',
        },
    })

    const company = await prisma.company.create({
        data: {
            name: 'Database Connection Test',
            industry: 'Technology',
            organizationId: organization.id,
        },
    })

    const savedCompany = await prisma.company.findUnique({
        where: {
            id: company.id,
        },
        include: {
            organization: true,
        },
    })

    console.log('Database read/write successful:')
    console.log(JSON.stringify(savedCompany, null, 2))

    // Remove the temporary test company.
    await prisma.company.delete({
        where: {
            id: company.id,
        },
    })
}

main()
    .catch((error: unknown) => {
        console.error('Database check failed:', error)
        process.exitCode = 1
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
