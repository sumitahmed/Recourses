import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const dsaQuestions = {
  'dsa-gen-sub-arrays': [
    {
      question: 'What is the time complexity of accessing an element in an array?',
      idealAnswer: 'The time complexity is O(1) because arrays provide random access using the index.',
      difficulty: 'Easy'
    },
    {
      question: 'Explain the difference between a dynamic array and a static array.',
      idealAnswer: 'A static array has a fixed size determined at compile time, whereas a dynamic array can grow or shrink in size during execution (like ArrayList in Java or vector in C++).',
      difficulty: 'Medium'
    }
  ],
  'dsa-gen-sub-linked-lists': [
    {
      question: 'How is a Linked List different from an Array?',
      idealAnswer: 'Arrays are stored in contiguous memory locations and have fixed size (typically). Linked Lists consist of nodes where each node contains data and a reference to the next node, allowing dynamic memory allocation and easier insertions/deletions, but they lack O(1) random access.',
      difficulty: 'Medium'
    },
    {
      question: 'What is a doubly linked list?',
      idealAnswer: 'A doubly linked list is a type of linked list where each node contains three fields: data, a pointer to the next node, and a pointer to the previous node. This allows traversal in both directions.',
      difficulty: 'Easy'
    }
  ],
  'dsa-gen-sub-stack': [
    {
      question: 'What data structure is used to implement recursion?',
      idealAnswer: 'The Stack data structure is used internally by the system to manage function calls and implement recursion (Call Stack).',
      difficulty: 'Easy'
    },
    {
      question: 'How do you evaluate a postfix expression?',
      idealAnswer: 'Using a stack: traverse the expression from left to right. Push operands to the stack. When an operator is encountered, pop the top two elements, apply the operator, and push the result back. The final result is the only element left in the stack.',
      difficulty: 'Medium'
    }
  ],
  'dsa-gen-sub-queue': [
    {
      question: 'What is the difference between a Queue and a Stack?',
      idealAnswer: 'A Stack follows Last-In-First-Out (LIFO) principle, whereas a Queue follows First-In-First-Out (FIFO) principle.',
      difficulty: 'Easy'
    },
    {
      question: 'What is a Circular Queue?',
      idealAnswer: 'A Circular Queue is a linear data structure that uses a single, fixed-size buffer as if it were connected end-to-end. It efficiently utilizes space that would otherwise be wasted in a standard array-based queue when elements are dequeued.',
      difficulty: 'Medium'
    }
  ],
  'dsa-gen-sub-trees': [
    {
      question: 'What is a Binary Tree?',
      idealAnswer: 'A binary tree is a tree data structure in which each node has at most two children, referred to as the left child and the right child.',
      difficulty: 'Easy'
    },
    {
      question: 'Explain the difference between Inorder, Preorder, and Postorder traversal.',
      idealAnswer: 'Inorder: Left, Root, Right. Preorder: Root, Left, Right. Postorder: Left, Right, Root.',
      difficulty: 'Medium'
    }
  ],
  'dsa-gen-sub-binary-search-tree-bst': [
    {
      question: 'What is the defining property of a Binary Search Tree?',
      idealAnswer: 'For any given node, all elements in its left subtree must be less than the node\'s value, and all elements in its right subtree must be greater than the node\'s value.',
      difficulty: 'Easy'
    },
    {
      question: 'What is the worst-case time complexity for search in a BST?',
      idealAnswer: 'O(n) - This occurs when the tree is entirely skewed (either all left children or all right children), essentially degrading into a linked list. Balanced BSTs like AVL or Red-Black trees prevent this.',
      difficulty: 'Medium'
    }
  ],
  'dsa-gen-sub-graphs': [
    {
      question: 'What is the difference between BFS and DFS in a graph?',
      idealAnswer: 'Breadth-First Search (BFS) explores the graph layer by layer using a Queue. Depth-First Search (DFS) explores as far as possible along each branch before backtracking, typically using a Stack (or recursion).',
      difficulty: 'Medium'
    },
    {
      question: 'How do you represent a graph in memory?',
      idealAnswer: 'Graphs are usually represented using either an Adjacency Matrix (a 2D array of V x V) or an Adjacency List (an array of lists/vectors).',
      difficulty: 'Easy'
    }
  ],
  'dsa-gen-sub-dynamic-programming-dp': [
    {
      question: 'What is the difference between Memoization and Tabulation?',
      idealAnswer: 'Memoization is a Top-Down approach that caches the results of recursive calls. Tabulation is a Bottom-Up approach that solves smaller subproblems iteratively and builds up to the final solution.',
      difficulty: 'Medium'
    },
    {
      question: 'What are the two key properties a problem must have to use Dynamic Programming?',
      idealAnswer: '1. Overlapping Subproblems: The problem can be broken down into subproblems which are reused several times.\n2. Optimal Substructure: The optimal solution to the problem can be constructed from optimal solutions of its subproblems.',
      difficulty: 'Hard'
    }
  ]
};

async function seedInterviewQuestions() {
  console.log('Seeding typical IndiaBix-style interview questions into DSA Topics...');
  
  for (const [slug, questions] of Object.entries(dsaQuestions)) {
    const topic = await prisma.topic.findUnique({ where: { slug } });
    if (topic) {
      for (const q of questions) {
        // Check if question already exists
        const existing = await prisma.interviewQuestion.findFirst({
          where: { topicId: topic.id, question: q.question }
        });

        if (!existing) {
          await prisma.interviewQuestion.create({
            data: {
              question: q.question,
              idealAnswer: q.idealAnswer,
              difficulty: q.difficulty,
              type: 'General',
              topicId: topic.id
            }
          });
        }
      }
      console.log(`Seeded ${questions.length} interview questions for ${topic.title}`);
      
      // Also add the specific Indiabix resource link for this topic as requested
      const topicName = topic.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const url = `https://www.indiabix.com/data-structures/${topicName}/`;
      
      const existingResource = await prisma.resource.findFirst({
        where: { topicId: topic.id, url }
      });
      
      if (!existingResource) {
          await prisma.resource.create({
              data: {
                  title: `IndiaBix: ${topic.title} Questions`,
                  url: 'https://www.indiabix.com/',
                  type: 'IndiaBix',
                  topicId: topic.id
              }
          })
      }
    }
  }

  console.log('Done!');
}

seedInterviewQuestions().catch(console.error).finally(() => prisma.$disconnect());
