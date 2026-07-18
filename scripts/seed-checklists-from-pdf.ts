import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const checklistsData = [
  {
    topicQuery: { title: 'Operating Systems' },
    checklists: [
      {
        title: 'Basics & Processes',
        items: [
          'Process vs Thread',
          'Process states (new, ready, running, waiting, terminated)',
          'Multithreading vs multiprocessing',
          'Thread synchronization basics'
        ]
      },
      {
        title: 'Memory Management',
        items: [
          'Virtual memory concept',
          'Paging and segmentation (high level)',
          'Page replacement algorithms (LRU, FIFO)',
          'Stack vs Heap memory',
          'Memory leaks and prevention'
        ]
      },
      {
        title: 'Concurrency',
        items: [
          'Race conditions',
          'Deadlocks (Necessary conditions, Prevention)',
          'Mutex vs Semaphore',
          'Critical section problem',
          'Producer-consumer problem'
        ]
      },
      {
        title: 'CPU Scheduling & IPC',
        items: [
          'FCFS, Round Robin, Priority scheduling',
          'Context switching overhead',
          'Preemptive vs non-preemptive',
          'Inodes, file permissions',
          'Hard vs soft links',
          'Pipes, shared memory, message queues, sockets'
        ]
      }
    ]
  },
  {
    topicQuery: { title: 'Computer Networks' },
    checklists: [
      {
        title: 'OSI Model & TCP/IP',
        items: [
          '7 layers of OSI',
          'TCP/IP 4-layer model',
          'Protocols at each layer'
        ]
      },
      {
        title: 'HTTP/HTTPS',
        items: [
          'Methods: GET, POST, PUT, DELETE, PATCH',
          'Status codes (200, 201, 400, 401, 403, 404, 500)',
          'Headers (Authorization, Content-Type, Cache-Control)',
          'HTTP vs HTTPS, HTTP/1.1 vs HTTP/2',
          'Cookies, sessions, tokens'
        ]
      },
      {
        title: 'Network Protocols',
        items: [
          'TCP vs UDP Differences and use cases',
          'Three-way handshake',
          'ACK and retransmission',
          'DNS resolution process',
          'DNS record types (A, CNAME, MX)',
          'WebSockets and Server Sent Events'
        ]
      },
      {
        title: 'REST & Security',
        items: [
          'REST principles and statelessness',
          'Resource-based URLs and Idempotency',
          'SSL/TLS basics',
          'JWT tokens',
          'OAuth 2.0 flow',
          'CORS, CSRF, XSS'
        ]
      }
    ]
  },
  {
    topicQuery: { title: 'DBMS & SQL' },
    checklists: [
      {
        title: 'SQL Fundamentals',
        items: [
          'SELECT, JOINs (inner, left, right, full)',
          'GROUP BY, HAVING, aggregate functions',
          'Subqueries, nested queries',
          'Window functions (ROW_NUMBER, RANK, LAG, LEAD)',
          'UNION vs UNION ALL'
        ]
      },
      {
        title: 'Database Design & Indexing',
        items: [
          'Normalization (1NF, 2NF, 3NF)',
          'When to denormalize',
          'Primary, foreign, composite keys',
          'B-tree vs Hash index',
          'Clustered vs non-clustered index',
          'Composite indexes'
        ]
      },
      {
        title: 'Transactions & ACID',
        items: [
          'Atomicity, Consistency, Isolation, Durability',
          'Isolation levels (4 types)',
          'Dirty reads, phantom reads, non-repeatable reads',
          'Commit, rollback, savepoints',
          'Optimistic vs pessimistic locking'
        ]
      },
      {
        title: 'Scaling & NoSQL',
        items: [
          'Replication (master-slave, master-master)',
          'Sharding/partitioning strategies',
          'N+1 query problem',
          'CAP theorem (basic understanding)',
          'NoSQL types: Document, Key-Value, Column, Graph'
        ]
      }
    ]
  },
  {
    topicQuery: { title: 'System Design' },
    checklists: [
      {
        title: 'Scalability & Caching',
        items: [
          'Horizontal vs vertical scaling',
          'Load balancing (round robin, least connections)',
          'Stateless vs stateful services',
          'Cache locations (client, CDN, server, DB)',
          'Invalidation strategies & Eviction policies',
          'Redis and Memcached basics'
        ]
      },
      {
        title: 'Databases at Scale',
        items: [
          'Replication (master-slave, master-master)',
          'Sharding/partitioning',
          'Connection pooling'
        ]
      },
      {
        title: 'Architecture Patterns',
        items: [
          'REST vs GraphQL',
          'Rate limiting and API versioning',
          'Monolith vs Microservices',
          'Serverless, Service Mesh',
          'Event Sourcing, CQRS'
        ]
      }
    ]
  },
  {
    topicQuery: { module: 'DSA' }, // Attach broadly to the first DSA module topic if needed, or specific topic
    checklists: [
      {
        title: 'Core Data Structures',
        items: [
          'Two pointers technique & Sliding window',
          'Prefix sums & Kadane\'s algorithm',
          'Hash Tables collision handling',
          'Linked Lists reversal, cycle detection',
          'Stacks & Queues (Monotonic stack)',
          'Trees (Traversals, BST)',
          'Heaps (Min/Max, Heapify)',
          'Graphs (DFS, BFS, Topological sort)',
          'Tries (Prefix searching)'
        ]
      },
      {
        title: 'Algorithms',
        items: [
          'Sorting Algorithms (Quicksort, Mergesort)',
          'Binary Search on arrays and answer space',
          'Recursion & Backtracking',
          'Dynamic Programming 1D & 2D',
          'Greedy Algorithms',
          'Dijkstra\'s algorithm, Union-Find'
        ]
      }
    ]
  },
  {
    topicQuery: { title: 'AI / ML' },
    checklists: [
      {
        title: 'Machine Learning Basics',
        items: [
          'Supervised vs Unsupervised Learning',
          'Overfitting vs Underfitting (Bias-Variance Tradeoff)',
          'Gradient Descent & Loss Functions',
          'Classification vs Regression metrics (Precision, Recall, F1)'
        ]
      },
      {
        title: 'Deep Learning & Neural Networks',
        items: [
          'Forward and Backward propagation',
          'Activation Functions (ReLU, Sigmoid, Tanh)',
          'CNNs (Convolutions, Pooling) for Computer Vision',
          'RNNs & LSTMs for Sequential Data'
        ]
      },
      {
        title: 'Large Language Models (LLMs) & RAG',
        items: [
          'Transformers Architecture (Self-Attention)',
          'Tokenization and Embeddings',
          'Prompt Engineering & Fine-tuning techniques (LoRA, PEFT)',
          'Retrieval-Augmented Generation (RAG) Architecture',
          'Chunking strategies & Vector Search'
        ]
      },
      {
        title: 'Vector Databases',
        items: [
          'What is a Vector Database? (Pinecone, Milvus, Chroma)',
          'Embeddings (Cosine Similarity, Euclidean distance)',
          'Approximate Nearest Neighbor (ANN) Search',
          'Hybrid Search (Keyword + Semantic)'
        ]
      }
    ]
  }
];

async function seedChecklists() {
  console.log('Seeding checklists...');
  
  // Wipe existing checklists to avoid duplicates
  await prisma.checklist.deleteMany({});
  console.log('Cleared existing checklists.');

  for (const group of checklistsData) {
    // Find a matching topic
    const topic = await prisma.topic.findFirst({
      where: group.topicQuery
    });

    if (!topic) {
      console.log(`Topic not found for query: ${JSON.stringify(group.topicQuery)}, skipping...`);
      // Fallback: create if missing?
      if (group.topicQuery.title === 'AI / ML') {
        const newTopic = await prisma.topic.create({
          data: {
            title: 'AI / ML',
            slug: 'ai-ml-core',
            module: 'AI / ML',
            status: 'Not Started'
          }
        });
        console.log(`Created AI / ML topic.`);
        for (const cl of group.checklists) {
          await prisma.checklist.create({
            data: {
              title: cl.title,
              topicId: newTopic.id,
              items: {
                create: cl.items.map(item => ({ content: item }))
              }
            }
          });
        }
      }
      continue;
    }

    for (const cl of group.checklists) {
      await prisma.checklist.create({
        data: {
          title: cl.title,
          topicId: topic.id,
          items: {
            create: cl.items.map(item => ({ content: item }))
          }
        }
      });
      console.log(`Added checklist: ${cl.title} to ${topic.title}`);
    }
  }

  console.log('Checklist seeding complete!');
}

seedChecklists()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
