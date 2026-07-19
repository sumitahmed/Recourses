import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const dsaTopics = [
  "Introduction to C++",
  "Introduction to Java",
  "Loops and Pattern Printing",
  "Arrays / 2D Arrays",
  "Strings",
  "Sorting and Searching",
  "Pointers / Pass by val, ref & add",
  "Time and Space Complexity",
  "Sets and Maps",
  "Prefix Sums / Sliding Window / Contribution",
  "Bit Manipulation",
  "Number Theory Basics",
  "Recursion and Backtracking",
  "Two Pointers",
  "Linked List",
  "Stack / Queue / Deque",
  "Binary Tree / BST",
  "Priority Queue / Heap",
  "Trie",
  "Greedy",
  "Dynamic Programming",
  "Graphs",
  "Segment Tree / Ordered Set"
];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function seedDsaTopics() {
  console.log('Seeding DSA Topics...');

  for (const title of dsaTopics) {
    const slug = slugify(title);
    
    // Check if it already exists to avoid duplicates
    const existing = await prisma.topic.findUnique({
      where: { slug }
    });

    if (!existing) {
      await prisma.topic.create({
        data: {
          title,
          slug,
          module: 'DSA',
          description: `Master ${title} through theory, interview questions, and practice.`
        }
      });
      console.log(`Created topic: ${title}`);
    } else {
      console.log(`Topic already exists: ${title}`);
    }
  }

  console.log('Finished seeding DSA topics!');
}

seedDsaTopics()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
