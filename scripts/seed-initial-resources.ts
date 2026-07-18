import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedInitialResources() {
  console.log('Seeding initial user requested resources...');

  // 1. Backend / Java
  let javaTopic = await prisma.topic.findUnique({ where: { slug: 'backend-java' } });
  if (!javaTopic) {
    javaTopic = await prisma.topic.create({
      data: {
        title: 'Java Core',
        slug: 'backend-java',
        module: 'Backend',
        description: 'Core Java concepts and Interview Q&A'
      }
    });
  }

  // Add Java Resources
  await prisma.resource.createMany({
    data: [
      {
        title: 'Java Q&A GitHub Repository',
        url: 'https://github.com/sumitahmed/java-codes/blob/main/JAVA_qa.md',
        type: 'GitHub',
        topicId: javaTopic.id
      },
      {
        title: 'Debanjan Sir Java Q&A',
        url: 'https://app.notion.com/p/Debanjan-Sir-java-Q-A-24e35b99f24c808da7b8c0cd1b8fb500',
        type: 'Notion',
        topicId: javaTopic.id
      }
    ]
  });

  // 2. Core CS / DBMS
  let dbmsTopic = await prisma.topic.findUnique({ where: { slug: 'corecs-dbms' } });
  if (!dbmsTopic) {
    dbmsTopic = await prisma.topic.create({
      data: {
        title: 'DBMS',
        slug: 'corecs-dbms',
        module: 'Core CS',
        description: 'Database Management Systems and Interview Q&A'
      }
    });
  }

  // Add DBMS Resource
  await prisma.resource.create({
    data: {
      title: 'DBSM Sir Q&A',
      url: 'https://app.notion.com/p/DBSM-sir-Q-A-35635b99f24c8094826ed8869a128b0c',
      type: 'Notion',
      topicId: dbmsTopic.id
    }
  });

  // 3. Core CS (General)
  let generalCSTopic = await prisma.topic.findUnique({ where: { slug: 'corecs-general' } });
  if (!generalCSTopic) {
    generalCSTopic = await prisma.topic.create({
      data: {
        title: 'General CS Concepts',
        slug: 'corecs-general',
        module: 'Core CS',
      }
    });
  }

  // Add Sanfoundry Resource
  await prisma.resource.create({
    data: {
      title: 'Sanfoundry',
      url: 'https://www.sanfoundry.com/',
      type: 'Website',
      topicId: generalCSTopic.id
    }
  });

  console.log('Done seeding resources!');
}

seedInitialResources().catch(console.error).finally(() => prisma.$disconnect());
