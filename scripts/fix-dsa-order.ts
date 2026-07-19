import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const orderedDsaTopics = [
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

async function fixOrder() {
  for (let i = 0; i < orderedDsaTopics.length; i++) {
    const originalTitle = orderedDsaTopics[i];
    const slug = slugify(originalTitle);
    
    // Pad the number with zero so 01, 02 sorts properly up to 99
    const prefix = String(i + 1).padStart(2, '0');
    const newTitle = `${prefix}. ${originalTitle}`;
    
    await prisma.topic.updateMany({
      where: { slug: slug, module: 'DSA' },
      data: { title: newTitle }
    });
    
    console.log(`Updated: ${newTitle}`);
  }
}

fixOrder().catch(console.error).finally(() => prisma.$disconnect());
