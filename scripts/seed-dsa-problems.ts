import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const neetcode150 = {
  'nc-arrays-hashing': ['Contains Duplicate', 'Valid Anagram', 'Two Sum', 'Group Anagrams', 'Top K Frequent Elements', 'Encode and Decode Strings', 'Product of Array Except Self', 'Valid Sudoku', 'Longest Consecutive Sequence'],
  'nc-two-pointers': ['Valid Palindrome', 'Two Sum II', '3Sum', 'Container With Most Water', 'Trapping Rain Water'],
  'nc-sliding-window': ['Best Time to Buy and Sell Stock', 'Longest Substring Without Repeating Characters', 'Longest Repeating Character Replacement', 'Permutation in String', 'Minimum Window Substring', 'Sliding Window Maximum'],
  'nc-stack': ['Valid Parentheses', 'Min Stack', 'Evaluate Reverse Polish Notation', 'Generate Parentheses', 'Daily Temperatures', 'Car Fleet', 'Largest Rectangle in Histogram'],
  'nc-binary-search': ['Binary Search', 'Search a 2D Matrix', 'Koko Eating Bananas', 'Find Minimum in Rotated Sorted Array', 'Search in Rotated Sorted Array', 'Time Based Key-Value Store', 'Median of Two Sorted Arrays'],
  'nc-linked-list': ['Reverse Linked List', 'Merge Two Sorted Lists', 'Reorder List', 'Remove Nth Node From End of List', 'Copy List with Random Pointer', 'Add Two Numbers', 'Linked List Cycle', 'Find the Duplicate Number', 'LRU Cache', 'Merge k Sorted Lists', 'Reverse Nodes in k-Group'],
  'nc-trees': ['Invert Binary Tree', 'Maximum Depth of Binary Tree', 'Diameter of Binary Tree', 'Balanced Binary Tree', 'Same Tree', 'Subtree of Another Tree', 'Lowest Common Ancestor of a BST', 'Binary Tree Level Order Traversal', 'Binary Tree Right Side View', 'Count Good Nodes in Binary Tree', 'Validate Binary Search Tree', 'Kth Smallest Element in a BST', 'Construct Binary Tree from Preorder and Inorder Traversal', 'Binary Tree Maximum Path Sum', 'Serialize and Deserialize Binary Tree'],
  'nc-tries': ['Implement Trie (Prefix Tree)', 'Design Add and Search Words Data Structure', 'Word Search II'],
  'nc-heap-priority-queue': ['Kth Largest Element in a Stream', 'Last Stone Weight', 'K Closest Points to Origin', 'Kth Largest Element in an Array', 'Task Scheduler', 'Design Twitter', 'Find Median from Data Stream'],
  'nc-backtracking': ['Subsets', 'Combination Sum', 'Permutations', 'Subsets II', 'Combination Sum II', 'Word Search', 'Palindrome Partitioning', 'Letter Combinations of a Phone Number', 'N-Queens'],
  'nc-graphs': ['Number of Islands', 'Max Area of Island', 'Clone Graph', 'Walls and Gates', 'Rotting Oranges', 'Pacific Atlantic Water Flow', 'Surrounded Regions', 'Course Schedule', 'Course Schedule II', 'Graph Valid Tree', 'Number of Connected Components in an Undirected Graph', 'Word Ladder'],
  'nc-advanced-graphs': ['Reconstruct Itinerary', 'Min Cost to Connect All Points', 'Network Delay Time', 'Swim in Rising Water', 'Alien Dictionary', 'Cheapest Flights Within K Stops'],
  'nc-1-d-dynamic-programming': ['Climbing Stairs', 'Min Cost Climbing Stairs', 'House Robber', 'House Robber II', 'Longest Palindromic Substring', 'Palindromic Substrings', 'Decode Ways', 'Coin Change', 'Maximum Product Subarray', 'Word Break', 'Longest Increasing Subsequence', 'Partition Equal Subset Sum'],
  'nc-2-d-dynamic-programming': ['Unique Paths', 'Longest Common Subsequence', 'Best Time to Buy and Sell Stock with Cooldown', 'Coin Change II', 'Target Sum', 'Interleaving String', 'Longest Increasing Path in a Matrix', 'Distinct Subsequences', 'Edit Distance', 'Burst Balloons', 'Regular Expression Matching'],
  'nc-greedy': ['Maximum Subarray', 'Jump Game', 'Jump Game II', 'Gas Station', 'Hand of Straights', 'Merge Triplets to Form Target Triplet', 'Partition Labels', 'Valid Parenthesis String'],
  'nc-intervals': ['Insert Interval', 'Merge Intervals', 'Non-Overlapping Intervals', 'Meeting Rooms', 'Meeting Rooms II', 'Minimum Interval to Include Each Query'],
  'nc-math-geometry': ['Rotate Image', 'Spiral Matrix', 'Set Matrix Zeroes', 'Happy Number', 'Plus One', 'Pow(x, n)', 'Multiply Strings', 'Detect Squares'],
  'nc-bit-manipulation': ['Single Number', 'Number of 1 Bits', 'Counting Bits', 'Reverse Bits', 'Missing Number', 'Sum of Two Integers', 'Reverse Integer']
};

const striverSDE = {
  'sde-day-1-arrays': ['Set Matrix Zeroes', 'Pascal\'s Triangle', 'Next Permutation', 'Kadane\'s Algorithm', 'Sort an array of 0\'s, 1\'s and 2\'s', 'Stock Buy and Sell'],
  'sde-day-2-arrays-part-ii': ['Rotate Matrix', 'Merge Overlapping Subintervals', 'Merge two sorted Arrays without extra space', 'Find the duplicate in an array of N+1 integers', 'Repeat and Missing Number', 'Inversion of Array (Pre-req: Merge Sort)'],
  'sde-day-3-arrays-part-iii': ['Search in a 2D matrix', 'Pow(X,n)', 'Majority Element (>N/2 times)', 'Majority Element (>N/3 times)', 'Grid Unique Paths', 'Reverse Pairs (Leetcode)'],
  'sde-day-4-arrays-part-iv': ['2-Sum-Problem', '4-sum-Problem', 'Longest Consecutive Sequence', 'Largest Subarray with 0 sum', 'Count number of subarrays with given XOR', 'Longest Substring without repeat'],
  'sde-day-5-linked-list': ['Reverse a LinkedList', 'Find the middle of LinkedList', 'Merge two sorted Linked List (use method used in mergeSort)', 'Remove N-th node from back of LinkedList', 'Add two numbers as LinkedList', 'Delete a given Node when a node is given'],
  'sde-day-6-linked-list-part-ii': ['Find intersection point of Y LinkedList', 'Detect a cycle in Linked List', 'Reverse a LinkedList in groups of size k', 'Check if a LinkedList is palindrome or not', 'Find the starting point of the Loop of LinkedList', 'Flattening of a LinkedList'],
  'sde-day-7-linked-list-and-arrays': ['Rotate a LinkedList', 'Clone a Linked List with random and next pointer', '3 sum', 'Trapping rainwater', 'Remove Duplicate from Sorted array', 'Max consecutive ones']
};

async function seedProblems() {
  console.log('Seeding NeetCode 150 Checklist Problems...');
  for (const [slug, problems] of Object.entries(neetcode150)) {
    const topic = await prisma.topic.findUnique({ where: { slug } });
    if (topic) {
      // Create checklist
      await prisma.checklist.create({
        data: {
          title: 'Problem List',
          topicId: topic.id,
          items: {
            create: problems.map(p => ({ content: p }))
          }
        }
      });
      console.log(`Seeded ${problems.length} problems for ${topic.title}`);
    }
  }

  console.log('Seeding Striver SDE Checklist Problems (Days 1-7 preview)...');
  for (const [slug, problems] of Object.entries(striverSDE)) {
    const topic = await prisma.topic.findUnique({ where: { slug } });
    if (topic) {
      await prisma.checklist.create({
        data: {
          title: 'Day Problems',
          topicId: topic.id,
          items: {
            create: problems.map(p => ({ content: p }))
          }
        }
      });
      console.log(`Seeded ${problems.length} problems for ${topic.title}`);
    }
  }

  // Also add the Notion resource link to all DSA General parent topics
  console.log('Adding Notion Resource link to DSA General Topics...');
  const dsaTopics = await prisma.topic.findMany({
    where: { module: 'DSA', title: { not: { contains: 'Sheet' } } }
  });

  const generalParentTopics = dsaTopics.filter(t => t.slug.startsWith('dsa-gen-'));

  for (const topic of generalParentTopics) {
    // Only add if it doesn't already have this link
    const existing = await prisma.resource.findFirst({
      where: { topicId: topic.id, url: 'https://chatter-tail-e98.notion.site/DSA-2d335b99f24c80478324c7e81bbe1a1b' }
    });

    if (!existing) {
      await prisma.resource.create({
        data: {
          title: 'Master DSA Notion Hub',
          url: 'https://chatter-tail-e98.notion.site/DSA-2d335b99f24c80478324c7e81bbe1a1b',
          type: 'Notion',
          topicId: topic.id
        }
      });
    }
  }
  
  console.log('Done!');
}

seedProblems().catch(console.error).finally(() => prisma.$disconnect());
