import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedDSA() {
  console.log('Clearing old DSA topics...');
  await prisma.topic.deleteMany({
    where: { module: 'DSA' }
  });

  const neetcodeTopics = [
    'Arrays & Hashing',
    'Two Pointers',
    'Sliding Window',
    'Stack',
    'Binary Search',
    'Linked List',
    'Trees',
    'Tries',
    'Heap / Priority Queue',
    'Backtracking',
    'Graphs',
    'Advanced Graphs',
    '1-D Dynamic Programming',
    '2-D Dynamic Programming',
    'Greedy',
    'Intervals',
    'Math & Geometry',
    'Bit Manipulation'
  ];

  const striverSDETopics = [
    'Arrays',
    'Arrays Part-II',
    'Arrays Part-III',
    'Arrays Part-IV',
    'Linked List',
    'Linked List Part-II',
    'Linked List and Arrays',
    'Greedy Algorithm',
    'Recursion',
    'Recursion and Backtracking',
    'Binary Search',
    'Heaps',
    'Stack and Queue',
    'Stack and Queue Part-II',
    'String',
    'String Part-II',
    'Binary Tree',
    'Binary Tree Part-II',
    'Binary Tree Part-III',
    'Binary Search Tree',
    'Binary Search Tree Part-II',
    'Binary Trees[Miscellaneous]',
    'Graph',
    'Graph Part-II',
    'Dynamic Programming',
    'Dynamic Programming Part-II',
    'Trie'
  ];

  const striverAZTopics = [
    'Learn the basics',
    'Learn Important Sorting Techniques',
    'Solve Problems on Arrays',
    'Binary Search [1D, 2D Arrays, Search Space]',
    'Strings',
    'Learn LinkedList',
    'Recursion',
    'Bit Manipulation',
    'Stack and Queues',
    'Sliding Window & Two Pointer',
    'Heaps',
    'Greedy Algorithms',
    'Binary Trees',
    'Binary Search Trees',
    'Graphs',
    'Dynamic Programming',
    'Tries'
  ];

  // We create parent topics for the sheets
  const ncParent = await prisma.topic.create({
    data: {
      title: 'NeetCode 150',
      slug: 'neetcode-150',
      module: 'DSA',
      description: 'The NeetCode 150 problem list.',
      status: 'Not Started',
    }
  });

  const sdeParent = await prisma.topic.create({
    data: {
      title: 'Striver SDE Sheet',
      slug: 'striver-sde-sheet',
      module: 'DSA',
      description: 'Striver\'s 190 SDE Sheet problems.',
      status: 'Not Started',
    }
  });

  const azParent = await prisma.topic.create({
    data: {
      title: 'Striver A-Z Sheet',
      slug: 'striver-a-z-sheet',
      module: 'DSA',
      description: 'Striver\'s complete A-Z preparation sheet.',
      status: 'Not Started',
    }
  });

  // Create Neetcode subtopics
  for (let i = 0; i < neetcodeTopics.length; i++) {
    const t = neetcodeTopics[i];
    await prisma.topic.create({
      data: {
        title: t,
        slug: `nc-${t.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        module: 'DSA',
        parentId: ncParent.id,
        status: 'Not Started',
      }
    });
  }

  // Create Striver SDE subtopics
  for (let i = 0; i < striverSDETopics.length; i++) {
    const t = striverSDETopics[i];
    await prisma.topic.create({
      data: {
        title: `Day ${i + 1}: ${t}`,
        slug: `sde-day-${i + 1}-${t.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        module: 'DSA',
        parentId: sdeParent.id,
        status: 'Not Started',
      }
    });
  }

  // Create Striver A-Z subtopics
  for (let i = 0; i < striverAZTopics.length; i++) {
    const t = striverAZTopics[i];
    await prisma.topic.create({
      data: {
        title: `Step ${i + 1}: ${t}`,
        slug: `az-step-${i + 1}-${t.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        module: 'DSA',
        parentId: azParent.id,
        status: 'Not Started',
      }
    });
  }

  console.log('DSA Topics seeded successfully!');
}

seedDSA().catch(console.error).finally(() => prisma.$disconnect());
