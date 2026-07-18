import "dotenv/config"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Extracted from backend_dev_checklist.pdf
const blueprint = [
  {
    module: "Core CS",
    title: "Operating Systems",
    subTopics: [
      {
        title: "Processes & Threads",
        items: [
          "Difference between process and thread",
          "Context switching",
          "Process states (new, ready, running, waiting, terminated)",
          "Multithreading vs multiprocessing",
          "Thread synchronization basics"
        ]
      },
      {
        title: "Memory Management",
        items: [
          "Virtual memory concept",
          "Paging and segmentation (high level)",
          "Page replacement algorithms",
          "LRU, FIFO",
          "Stack vs Heap memory",
          "Memory leaks and prevention"
        ]
      },
      {
        title: "Concurrency",
        items: [
          "Race conditions",
          "Deadlocks",
          "Necessary conditions",
          "Prevention",
          "Mutex vs Semaphore",
          "Critical section problem",
          "Producer-consumer problem"
        ]
      },
      {
        title: "CPU Scheduling",
        items: [
          "FCFS, Round Robin, Priority scheduling",
          "Context switching overhead",
          "Preemptive vs non-preemptive"
        ]
      },
      {
        title: "File Systems & IPC",
        items: [
          "Inodes, file permissions",
          "Hard vs soft links",
          "Pipes, shared memory, message queues, sockets"
        ]
      }
    ]
  },
  {
    module: "Core CS",
    title: "Computer Networks",
    subTopics: [
      {
        title: "OSI Model & TCP/IP",
        items: [
          "7 layers of OSI",
          "TCP/IP 4-layer model",
          "Protocols at each layer"
        ]
      },
      {
        title: "HTTP/HTTPS",
        items: [
          "Methods: GET, POST, PUT, DELETE, PATCH",
          "Status codes (200, 201, 400, 401, 403, 404, 500)",
          "Headers (Authorization, Content-Type, Cache-Control)",
          "HTTP vs HTTPS, HTTP/1.1 vs HTTP/2",
          "Cookies, sessions, tokens"
        ]
      },
      {
        title: "TCP vs UDP",
        items: [
          "Differences and use cases",
          "Three-way handshake",
          "ACK and retransmission"
        ]
      },
      {
        title: "DNS & Real-Time",
        items: [
          "DNS resolution process",
          "DNS record types (A, CNAME, MX)",
          "WebSockets and Server Sent Events"
        ]
      }
    ]
  },
  {
    module: "Backend",
    title: "System Design",
    subTopics: [
      {
        title: "Scalability Basics",
        items: [
          "Horizontal vs vertical scaling",
          "Load balancing (round robin, least connections)",
          "Stateless vs stateful services"
        ]
      },
      {
        title: "Caching",
        items: [
          "Cache locations (client, CDN, server, DB)",
          "Invalidation strategies",
          "Eviction policies (LRU, LFU)",
          "Redis and Memcached basics"
        ]
      },
      {
        title: "Databases at Scale",
        items: [
          "Replication (master-slave, master-master)",
          "Sharding/partitioning",
          "Connection pooling"
        ]
      }
    ]
  },
  {
    module: "DSA",
    title: "Core Data Structures",
    subTopics: [
      {
        title: "Arrays & Strings",
        items: [
          "Two pointers technique",
          "Sliding window",
          "Prefix sums",
          "Kadane's algorithm"
        ]
      },
      {
        title: "Trees",
        items: [
          "Binary trees",
          "Binary Search Trees (BST)",
          "In-order traversal",
          "Level-order traversal"
        ]
      }
    ]
  }
]

function generateSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

async function main() {
  console.log("Seeding database with PDF blueprint...")
  
  for (const module of blueprint) {
    // 1. Create Parent Topic
    const parentTopic = await prisma.topic.upsert({
      where: { slug: generateSlug(module.title) },
      update: {},
      create: {
        title: module.title,
        slug: generateSlug(module.title),
        module: module.module,
        description: `Master topic for ${module.title}`,
      }
    })
    
    console.log(`Created parent topic: ${parentTopic.title}`)

    // 2. Create Sub Topics
    for (const sub of module.subTopics) {
      const subSlug = generateSlug(`${module.title}-${sub.title}`)
      
      const subTopic = await prisma.topic.upsert({
        where: { slug: subSlug },
        update: {},
        create: {
          title: sub.title,
          slug: subSlug,
          module: module.module,
          parentId: parentTopic.id,
          description: `Subtopic of ${module.title}`,
          // Create the interactive checklist automatically
          checklists: {
            create: {
              title: `${sub.title} Master Checklist`,
              items: {
                create: sub.items.map(item => ({
                  content: item
                }))
              }
            }
          }
        }
      })
      console.log(`  - Created subtopic & checklist: ${subTopic.title}`)
    }
  }
  
  console.log("Seeding completed successfully!")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
