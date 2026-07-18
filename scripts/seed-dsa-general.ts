import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedDSAGeneral() {
  console.log('Seeding DSA General Topics from Notion...');

  const generalTopics = [
    {
      parent: 'Time & Space Complexity',
      subs: ['Asymptotic Notations | Time & Space Complexity']
    },
    {
      parent: 'Sorting & Searching',
      subs: ['Searching', 'Sorting']
    },
    {
      parent: 'Core Data Structures',
      subs: [
        'Arrays', 'Strings', 'Linked Lists', 'Stack', 'Queue', 
        'Trees', 'Binary Search Tree (BST)', 'Heaps / Priority Queue', 
        'Graphs', 'Hashing'
      ]
    },
    {
      parent: 'Algorithms & Techniques',
      subs: [
        'Recursion', 'Backtracking', 'Dynamic Programming (DP)', 
        'Greedy Algorithms', 'Sliding Window', 'Two Pointers', 
        'Bit Manipulation'
      ]
    },
    {
      parent: 'Miscellaneous',
      subs: ['Practice Sheet Tracker']
    }
  ];

  for (const group of generalTopics) {
    const p = await prisma.topic.create({
      data: {
        title: group.parent,
        slug: `dsa-gen-${group.parent.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        module: 'DSA',
        status: 'Not Started',
      }
    });

    for (const sub of group.subs) {
      await prisma.topic.create({
        data: {
          title: sub,
          slug: `dsa-gen-sub-${sub.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          module: 'DSA',
          parentId: p.id,
          status: 'Not Started',
        }
      });
    }
  }

  console.log('DSA General Topics seeded successfully!');
}

seedDSAGeneral().catch(console.error).finally(() => prisma.$disconnect());
