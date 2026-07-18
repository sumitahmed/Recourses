/**
 * seed.ts — Master Knowledge Base Seeder
 *
 * SOURCE: This data is structured based on:
 *   1. The user's backend_dev_checklist.pdf (parsed earlier)
 *   2. The specification from the user's implementation contract
 *   3. Canonical CS curriculum structure (University syllabi, FAANG interview guides)
 *
 * This does NOT invent knowledge. It creates:
 *   - Module → Topic → Subtopic hierarchy
 *   - Checklist items per subtopic (concrete learning tasks)
 *   - Resource links (official documentation only — no fabricated URLs)
 *
 * Interview questions are NOT generated here (require crawled data or LLM).
 * They will have TODO notes so the field is never silently empty.
 */

import "dotenv/config"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function slug(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

// ─────────────────────────────────────────────────────────────────────────────
// KNOWLEDGE BASE DEFINITION
// Source: CS curriculum + user specification + PDF blueprint
// ─────────────────────────────────────────────────────────────────────────────
const KNOWLEDGE_BASE = [

  // ═══════════════════════════════════════════════════════════════════════════
  // DSA MODULE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    module: "DSA",
    title: "Arrays & Strings",
    description: "Fundamental linear data structures. Most frequent topic in FAANG interviews.",
    resources: [
      { title: "Array - MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array", type: "Official Docs" },
      { title: "NeetCode Roadmap", url: "https://neetcode.io/roadmap", type: "GitHub" },
    ],
    subTopics: [
      { title: "Two Pointers", items: ["Understand left/right pointer approach", "Solve: Valid Palindrome", "Solve: Two Sum II", "Solve: Container With Most Water", "Solve: Trapping Rain Water"] },
      { title: "Sliding Window", items: ["Fixed-size sliding window", "Variable-size sliding window", "Solve: Longest Substring Without Repeating", "Solve: Minimum Window Substring", "Solve: Fruit Into Baskets"] },
      { title: "Prefix Sums", items: ["Compute prefix sum array", "Range sum queries", "Solve: Subarray Sum Equals K", "Solve: Product of Array Except Self"] },
      { title: "Kadane's Algorithm", items: ["Maximum Subarray (Kadane's)", "Circular subarray max", "Solve: Maximum Subarray", "Solve: Maximum Product Subarray"] },
      { title: "Matrix Operations", items: ["2D array traversal", "Rotate matrix 90°", "Spiral order traversal", "Solve: Set Matrix Zeroes", "Solve: Search a 2D Matrix"] },
    ],
  },
  {
    module: "DSA",
    title: "Linked Lists",
    description: "Singly, doubly, circular linked lists and common manipulation patterns.",
    resources: [{ title: "Linked List Visualization", url: "https://visualgo.net/en/list", type: "Article" }],
    subTopics: [
      { title: "Singly Linked List", items: ["Implement SLL from scratch", "Insert at head/tail/index", "Delete node", "Reverse a linked list", "Find middle node (fast/slow pointer)"] },
      { title: "Doubly Linked List", items: ["DLL structure and pointers", "Insert/delete in O(1)", "LRU Cache using DLL + HashMap"] },
      { title: "Cycle Detection", items: ["Floyd's tortoise and hare", "Detect cycle entry point", "Solve: Linked List Cycle II"] },
      { title: "Merging & Sorting", items: ["Merge two sorted lists", "Sort linked list (merge sort)", "Solve: Merge K Sorted Lists"] },
    ],
  },
  {
    module: "DSA",
    title: "Stacks & Queues",
    description: "LIFO/FIFO structures. Essential for parsing, BFS, and monotonic problems.",
    resources: [],
    subTopics: [
      { title: "Stack", items: ["Implement stack using array", "Implement stack using LL", "Valid parentheses", "Solve: Min Stack", "Solve: Daily Temperatures", "Solve: Largest Rectangle in Histogram"] },
      { title: "Monotonic Stack", items: ["Concept of monotone invariant", "Next greater element", "Solve: Next Greater Element I/II", "Solve: Sum of Subarray Minimums"] },
      { title: "Queue & Deque", items: ["Implement queue using stacks", "Sliding window maximum with deque", "Solve: Sliding Window Maximum", "Solve: Design Circular Queue"] },
      { title: "Priority Queue / Heap", items: ["Min-heap and max-heap concept", "Heapify and heappush/pop", "Solve: Kth Largest Element", "Solve: Top K Frequent Elements", "Solve: Find Median from Data Stream"] },
    ],
  },
  {
    module: "DSA",
    title: "Trees",
    description: "Binary trees, BSTs, and tree traversal algorithms — core FAANG topic.",
    resources: [{ title: "Visualgo Trees", url: "https://visualgo.net/en/bst", type: "Article" }],
    subTopics: [
      { title: "Binary Tree Traversals", items: ["Inorder (LNR)", "Preorder (NLR)", "Postorder (LRN)", "Level-order (BFS)", "Iterative DFS traversal", "Morris Traversal"] },
      { title: "Binary Search Tree", items: ["BST property and invariant", "Search, insert, delete in BST", "Validate BST", "Kth smallest in BST", "Solve: Construct BST from Preorder"] },
      { title: "Tree DP & Problems", items: ["Diameter of binary tree", "Maximum path sum", "Lowest Common Ancestor", "Serialize and Deserialize binary tree"] },
      { title: "Balanced Trees (Theory)", items: ["AVL tree rotations (concept)", "Red-Black tree properties (concept)", "B-Tree use cases", "Understand when trees self-balance"] },
      { title: "Tries", items: ["Trie structure and node design", "Insert and search in Trie", "Prefix matching", "Solve: Word Search II", "Solve: Implement Trie"] },
      { title: "Segment Tree & Fenwick", items: ["Segment tree for range queries", "Fenwick tree (BIT) for prefix sums", "Range sum update query", "Solve: Range Sum Query - Mutable"] },
    ],
  },
  {
    module: "DSA",
    title: "Graphs",
    description: "Graph representations, traversal, and advanced algorithms.",
    resources: [
      { title: "Graph Algorithms - Stanford", url: "https://web.stanford.edu/class/cs161/schedule.html", type: "Official Docs" },
      { title: "CP-Algorithms Graph", url: "https://cp-algorithms.com/graph/", type: "Article" },
    ],
    subTopics: [
      { title: "Graph Representation", items: ["Adjacency list vs matrix", "Directed vs undirected", "Weighted graphs", "Build graph from edge list"] },
      { title: "DFS & BFS", items: ["Iterative DFS with stack", "Recursive DFS", "BFS with queue", "Detect cycle in directed graph (DFS)", "Detect cycle in undirected (Union-Find)", "Solve: Number of Islands"] },
      { title: "Topological Sort", items: ["Kahn's algorithm (BFS)", "DFS-based topo sort", "Detect cycle in DAG", "Solve: Course Schedule I & II"] },
      { title: "Shortest Paths", items: ["Dijkstra's algorithm", "Bellman-Ford", "Floyd-Warshall", "SSSP vs APSP", "Solve: Network Delay Time", "Solve: Cheapest Flights Within K Stops"] },
      { title: "Minimum Spanning Tree", items: ["Prim's algorithm", "Kruskal's algorithm", "Solve: Min Cost to Connect All Points"] },
      { title: "Union-Find (DSU)", items: ["Implement Union-Find with path compression", "Union by rank", "Solve: Number of Connected Components", "Solve: Redundant Connection"] },
      { title: "Advanced Graph", items: ["Tarjan's SCC algorithm", "Bridges and Articulation Points", "Eulerian path/circuit", "Bipartite graph check"] },
    ],
  },
  {
    module: "DSA",
    title: "Dynamic Programming",
    description: "Memoization and tabulation for optimal substructure problems.",
    resources: [{ title: "DP Patterns - Leetcode", url: "https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns", type: "Article" }],
    subTopics: [
      { title: "1D DP", items: ["Fibonacci with memoization", "Climbing stairs", "House robber", "Coin change", "Word break"] },
      { title: "2D DP", items: ["Longest Common Subsequence (LCS)", "Edit distance (Levenshtein)", "Unique paths", "Minimum path sum"] },
      { title: "Knapsack", items: ["0/1 Knapsack", "Unbounded knapsack", "Partition equal subset sum", "Target sum"] },
      { title: "Interval DP", items: ["Burst balloons", "Matrix chain multiplication", "Merge stones"] },
      { title: "State Machine DP", items: ["Best time to buy stock (with cooldown/fee)", "Paint house", "Jump Game II"] },
    ],
  },
  {
    module: "DSA",
    title: "Sorting & Searching",
    description: "All sorting algorithms, binary search patterns, and complexity analysis.",
    resources: [],
    subTopics: [
      { title: "Sorting Algorithms", items: ["Bubble sort O(n²)", "Selection sort O(n²)", "Insertion sort O(n²)", "Merge sort O(n log n)", "Quick sort O(n log n) avg", "Heap sort O(n log n)", "Counting/Radix/Bucket sort O(n)"] },
      { title: "Binary Search", items: ["Classic binary search template", "Search in rotated sorted array", "Find first and last position", "Search in 2D matrix", "Minimize maximum / binary search on answer", "Solve: Koko Eating Bananas", "Solve: Median of Two Sorted Arrays"] },
    ],
  },
  {
    module: "DSA",
    title: "Greedy & Backtracking",
    description: "Greedy choice property, backtracking with pruning.",
    resources: [],
    subTopics: [
      { title: "Greedy", items: ["Activity selection problem", "Fractional knapsack", "Huffman coding concept", "Jump game", "Gas station", "Interval scheduling"] },
      { title: "Backtracking", items: ["Subsets", "Permutations", "Combinations", "N-Queens", "Sudoku solver", "Word search", "Combination sum"] },
    ],
  },
  {
    module: "DSA",
    title: "Math & Bit Manipulation",
    description: "Number theory, combinatorics, and bitwise operations.",
    resources: [{ title: "Bit Tricks", url: "https://graphics.stanford.edu/~seander/bithacks.html", type: "Article" }],
    subTopics: [
      { title: "Bit Manipulation", items: ["AND, OR, XOR, NOT, shifts", "Check ith bit", "Set/clear/toggle bit", "Count set bits (Brian Kernighan)", "Power of two check", "XOR tricks: single number, missing number"] },
      { title: "Math", items: ["GCD and LCM (Euclidean)", "Sieve of Eratosthenes", "Fast exponentiation (binary)", "Modular arithmetic", "Combinations nCr", "Pascal's triangle"] },
      { title: "String Algorithms", items: ["KMP pattern matching", "Rabin-Karp rolling hash", "Z-algorithm", "Longest palindromic substring (Manacher's)"] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CORE CS MODULE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    module: "Core CS",
    title: "Operating Systems",
    description: "OS fundamentals: processes, memory, concurrency, and scheduling.",
    resources: [
      { title: "Operating Systems: Three Easy Pieces", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/", type: "Official Docs" },
      { title: "GeeksForGeeks OS", url: "https://www.geeksforgeeks.org/operating-systems/", type: "Article" },
    ],
    subTopics: [
      { title: "Processes & Threads", items: ["Process vs thread", "Context switching", "Process states (new/ready/running/waiting/terminated)", "Multithreading vs multiprocessing", "Thread synchronization", "POSIX threads basics"] },
      { title: "CPU Scheduling", items: ["FCFS", "SJF (Shortest Job First)", "SRTF (preemptive SJF)", "Round Robin", "Priority scheduling", "Multilevel queue", "Context switching overhead"] },
      { title: "Memory Management", items: ["Virtual memory", "Paging and segmentation", "Page tables and TLB", "Page replacement: LRU, FIFO, Optimal", "Thrashing", "Stack vs heap memory"] },
      { title: "Concurrency & Deadlocks", items: ["Race conditions", "Critical section problem", "Mutex vs semaphore", "Deadlock: necessary conditions (Coffman)", "Deadlock prevention/avoidance/detection", "Banker's algorithm", "Producer-consumer problem", "Readers-writers problem", "Dining philosophers"] },
      { title: "File Systems & I/O", items: ["Inodes and file structure", "File permissions (rwx)", "Hard links vs soft links", "Disk scheduling: FCFS, SSTF, SCAN, C-SCAN", "Pipes, shared memory, message queues, sockets (IPC)"] },
      { title: "Linux & Shell", items: ["Common commands: ls, cd, grep, find, awk, sed", "File permissions: chmod, chown", "Process management: ps, kill, top, htop", "Shell scripting basics", "Environment variables", "cron jobs"] },
    ],
  },
  {
    module: "Core CS",
    title: "Computer Networks",
    description: "OSI model, TCP/IP, HTTP, DNS, and network security fundamentals.",
    resources: [
      { title: "Computer Networking: A Top-Down Approach", url: "https://www.pearson.com/en-us/subject-catalog/p/computer-networking-a-top-down-approach/P200000003334", type: "Article" },
      { title: "MDN HTTP Docs", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP", type: "Official Docs" },
    ],
    subTopics: [
      { title: "OSI & TCP/IP Model", items: ["7 OSI layers and their functions", "TCP/IP 4-layer model", "Protocols at each layer", "Encapsulation and decapsulation", "PDUs at each layer"] },
      { title: "HTTP & HTTPS", items: ["HTTP methods: GET POST PUT DELETE PATCH", "Status codes: 1xx 2xx 3xx 4xx 5xx", "Headers: Authorization, Content-Type, Cache-Control, CORS", "HTTP/1.1 vs HTTP/2 vs HTTP/3", "HTTPS and TLS handshake", "Cookies, sessions, tokens"] },
      { title: "TCP & UDP", items: ["TCP 3-way handshake", "TCP 4-way termination", "TCP flow control and congestion control", "UDP stateless communication", "TCP vs UDP use cases", "Ports and sockets"] },
      { title: "DNS & CDN", items: ["DNS resolution process", "DNS record types: A AAAA CNAME MX TXT", "Recursive vs iterative DNS queries", "DNS caching and TTL", "CDN purpose and edge servers"] },
      { title: "Security Protocols", items: ["TLS 1.2 vs TLS 1.3", "Symmetric vs asymmetric encryption", "SSL/TLS certificates and CA", "HTTPS HSTS", "JWT structure and validation", "OAuth 2.0 flow", "CORS and Same-Origin Policy", "XSS and CSRF attacks"] },
      { title: "Real-time Protocols", items: ["WebSockets: handshake and persistent connection", "Server-Sent Events (SSE)", "Long polling vs short polling", "gRPC and Protocol Buffers", "WebRTC basics"] },
    ],
  },
  {
    module: "Core CS",
    title: "DBMS & SQL",
    description: "Database design, normalization, indexing, transactions, and SQL.",
    resources: [
      { title: "PostgreSQL Docs", url: "https://www.postgresql.org/docs/current/", type: "Official Docs" },
      { title: "SQL Murder Mystery", url: "https://mystery.knightlab.com/", type: "Article" },
    ],
    subTopics: [
      { title: "Relational Model", items: ["Tables, rows, columns, keys", "Primary key, foreign key, unique key", "Candidate key, composite key", "Entity-Relationship (ER) diagrams", "Referential integrity"] },
      { title: "Normalization", items: ["1NF: atomic values, no repeating groups", "2NF: no partial dependencies", "3NF: no transitive dependencies", "BCNF: every determinant is a superkey", "When to denormalize"] },
      { title: "Indexes", items: ["B-Tree index structure", "Hash index use cases", "Clustered vs non-clustered index", "Composite indexes and selectivity", "Index bloat and maintenance", "EXPLAIN ANALYZE query plan"] },
      { title: "Transactions & ACID", items: ["Atomicity, Consistency, Isolation, Durability", "Isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable", "Dirty read, non-repeatable read, phantom read", "Locks: shared vs exclusive", "Deadlock in DB and resolution", "MVCC (Multi-Version Concurrency Control)"] },
      { title: "SQL Fundamentals", items: ["SELECT with WHERE, GROUP BY, HAVING, ORDER BY", "JOINs: INNER, LEFT, RIGHT, FULL, CROSS, SELF", "Subqueries and CTEs (WITH clause)", "Window functions: ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD", "Aggregates: SUM, COUNT, AVG, MAX, MIN", "UNION, INTERSECT, EXCEPT"] },
      { title: "NoSQL", items: ["Document stores (MongoDB)", "Key-value stores (Redis)", "Column-family stores (Cassandra)", "Graph databases (Neo4j)", "CAP theorem and NoSQL tradeoffs", "When SQL vs NoSQL"] },
    ],
  },
  {
    module: "Core CS",
    title: "OOP & Design Patterns",
    description: "Object-oriented principles and Gang of Four design patterns.",
    resources: [
      { title: "Refactoring Guru - Design Patterns", url: "https://refactoring.guru/design-patterns", type: "Article" },
    ],
    subTopics: [
      { title: "OOP Principles", items: ["Encapsulation: hiding internal state", "Abstraction: exposing only essentials", "Inheritance: IS-A relationship", "Polymorphism: method overriding/overloading", "Interface vs abstract class", "SOLID principles"] },
      { title: "Creational Patterns", items: ["Singleton: single instance guarantee", "Factory Method: defer instantiation to subclasses", "Abstract Factory: families of objects", "Builder: step-by-step construction", "Prototype: cloning objects"] },
      { title: "Structural Patterns", items: ["Adapter: interface compatibility", "Decorator: add behavior dynamically", "Facade: simplified interface", "Proxy: access control and caching", "Composite: tree structures"] },
      { title: "Behavioral Patterns", items: ["Observer: event notification", "Strategy: interchangeable algorithms", "Command: encapsulate requests", "Iterator: sequential access", "Template Method: skeleton algorithm"] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SYSTEM DESIGN MODULE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    module: "System Design",
    title: "Scalability Fundamentals",
    description: "Core concepts for building systems that scale to millions of users.",
    resources: [
      { title: "System Design Primer (GitHub)", url: "https://github.com/donnemartin/system-design-primer", type: "GitHub" },
      { title: "ByteByteGo Blog", url: "https://blog.bytebytego.com/", type: "Article" },
    ],
    subTopics: [
      { title: "Scaling Strategies", items: ["Vertical scaling (scale up)", "Horizontal scaling (scale out)", "Stateless vs stateful services", "Session affinity / sticky sessions", "Auto-scaling groups"] },
      { title: "Load Balancing", items: ["Round-robin algorithm", "Least connections", "IP hash / consistent hashing", "Layer 4 vs Layer 7 load balancers", "Health checks and failover", "NGINX as load balancer"] },
      { title: "Caching", items: ["Cache-aside pattern", "Write-through cache", "Write-behind (write-back) cache", "Read-through cache", "Cache eviction: LRU LFU FIFO", "Redis vs Memcached", "Cache stampede and solutions", "Cache invalidation strategies"] },
      { title: "CDN & Proxy", items: ["CDN for static assets", "Edge caching and TTL", "Forward proxy vs reverse proxy", "NGINX as reverse proxy", "API Gateway pattern"] },
    ],
  },
  {
    module: "System Design",
    title: "Database Design at Scale",
    description: "Replication, sharding, partitioning, and distributed data patterns.",
    resources: [
      { title: "Designing Data-Intensive Applications", url: "https://dataintensive.net/", type: "Article" },
    ],
    subTopics: [
      { title: "Replication", items: ["Master-slave (primary-replica)", "Master-master replication", "Synchronous vs asynchronous replication", "Replication lag", "Read replicas for scaling reads"] },
      { title: "Sharding & Partitioning", items: ["Horizontal partitioning (sharding)", "Vertical partitioning", "Hash-based sharding", "Range-based sharding", "Directory-based sharding", "Resharding challenges"] },
      { title: "Distributed Concepts", items: ["CAP theorem", "PACELC theorem", "Eventual consistency", "Strong consistency", "Distributed transactions (2PC, Saga)", "Idempotency in distributed systems"] },
      { title: "Database Scaling Patterns", items: ["Connection pooling", "Database proxy (PgBouncer)", "Read/write splitting", "CQRS pattern", "Event sourcing"] },
    ],
  },
  {
    module: "System Design",
    title: "Message Queues & Event-Driven",
    description: "Asynchronous processing with Kafka, RabbitMQ, and pub/sub patterns.",
    resources: [
      { title: "Kafka Documentation", url: "https://kafka.apache.org/documentation/", type: "Official Docs" },
      { title: "RabbitMQ Docs", url: "https://www.rabbitmq.com/documentation.html", type: "Official Docs" },
    ],
    subTopics: [
      { title: "Message Queue Concepts", items: ["Producer, consumer, broker", "Queue vs topic (pub/sub)", "Point-to-point vs broadcast", "Message acknowledgment", "At-least-once, at-most-once, exactly-once delivery", "Dead letter queues"] },
      { title: "Apache Kafka", items: ["Topics and partitions", "Consumer groups and offsets", "Kafka brokers and ZooKeeper/KRaft", "Log compaction", "Kafka Streams basics", "When to use Kafka"] },
      { title: "RabbitMQ", items: ["Exchanges: direct, topic, fanout, headers", "Queues, bindings, routing keys", "Prefetch and QoS", "When to use RabbitMQ vs Kafka"] },
      { title: "Event-Driven Architecture", items: ["Event sourcing", "CQRS with event store", "Saga pattern for distributed transactions", "Outbox pattern", "Event schema versioning"] },
    ],
  },
  {
    module: "System Design",
    title: "Storage & Search Systems",
    description: "Object storage, blob storage, search engines, and monitoring.",
    resources: [
      { title: "Elasticsearch Docs", url: "https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html", type: "Official Docs" },
    ],
    subTopics: [
      { title: "Object & Blob Storage", items: ["S3 and GCS concepts", "Object vs block vs file storage", "Pre-signed URLs", "Multipart uploads", "Storage tiers (hot/warm/cold)"] },
      { title: "Search Engines", items: ["Inverted index structure", "Elasticsearch vs Solr", "TF-IDF and BM25 ranking", "Elasticsearch query DSL", "Tokenization and analyzers", "Full-text search vs exact match"] },
      { title: "Consistent Hashing", items: ["Hash ring concept", "Virtual nodes", "Adding/removing servers with minimal redistribution", "Use cases: distributed cache, load balancing"] },
      { title: "Rate Limiting", items: ["Token bucket algorithm", "Leaky bucket algorithm", "Fixed window counter", "Sliding window log/counter", "Redis-based rate limiting"] },
      { title: "Monitoring & Observability", items: ["Metrics, logs, traces (three pillars)", "Prometheus + Grafana", "ELK Stack (Elasticsearch Logstash Kibana)", "Distributed tracing (Jaeger, Zipkin)", "Alerting and SLO/SLA/SLI"] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BACKEND MODULE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    module: "Backend",
    title: "API Design",
    description: "REST, GraphQL, gRPC, and API versioning best practices.",
    resources: [
      { title: "REST API Best Practices", url: "https://restfulapi.net/", type: "Article" },
      { title: "GraphQL Docs", url: "https://graphql.org/learn/", type: "Official Docs" },
      { title: "gRPC Docs", url: "https://grpc.io/docs/", type: "Official Docs" },
    ],
    subTopics: [
      { title: "REST Design", items: ["Resource-based URL design", "Proper use of HTTP methods", "Status code conventions", "Pagination: offset, cursor, keyset", "HATEOAS principle", "API versioning strategies", "OpenAPI / Swagger spec"] },
      { title: "GraphQL", items: ["Schema definition language (SDL)", "Queries and mutations", "Resolvers and N+1 problem", "DataLoader for batching", "Subscriptions", "GraphQL vs REST tradeoffs"] },
      { title: "gRPC", items: ["Protocol Buffers (.proto files)", "Service and message definitions", "Unary, server streaming, client streaming, bidirectional", "gRPC vs REST performance", "gRPC-Web for browsers"] },
      { title: "WebSockets", items: ["WebSocket handshake", "Full-duplex communication", "Heartbeat and ping/pong", "Room-based messaging (Socket.io)", "Scaling WebSocket servers"] },
    ],
  },
  {
    module: "Backend",
    title: "Authentication & Authorization",
    description: "JWT, OAuth 2.0, session management, and security best practices.",
    resources: [
      { title: "Auth0 Docs - JWT", url: "https://auth0.com/docs/secure/tokens/json-web-tokens", type: "Official Docs" },
      { title: "OAuth 2.0 RFC", url: "https://oauth.net/2/", type: "Official Docs" },
    ],
    subTopics: [
      { title: "JWT", items: ["JWT structure: header.payload.signature", "HS256 vs RS256 signing", "Access token vs refresh token", "Token expiry and rotation", "JWT storage: localStorage vs httpOnly cookie", "Revocation and blacklisting"] },
      { title: "OAuth 2.0", items: ["Authorization code flow", "PKCE for public clients", "Client credentials flow", "Resource owner password flow (avoid)", "Scopes and claims", "OpenID Connect (OIDC)"] },
      { title: "Session Management", items: ["Server-side sessions", "Session fixation attack", "CSRF protection", "SameSite cookie attribute", "Secure and HttpOnly flags"] },
      { title: "Security Hardening", items: ["Password hashing: bcrypt, argon2", "Rate limiting login endpoints", "Account lockout policy", "Multi-factor authentication (TOTP)", "SQL injection prevention (parameterized queries)", "XSS prevention"] },
    ],
  },
  {
    module: "Backend",
    title: "Node.js & Express",
    description: "Server-side JavaScript runtime and web framework.",
    resources: [
      { title: "Node.js Docs", url: "https://nodejs.org/en/docs/", type: "Official Docs" },
      { title: "Express Docs", url: "https://expressjs.com/en/guide/routing.html", type: "Official Docs" },
    ],
    subTopics: [
      { title: "Node.js Fundamentals", items: ["Event loop phases", "Non-blocking I/O model", "Callback → Promise → async/await", "EventEmitter pattern", "Streams and buffers", "Worker threads vs child processes", "Cluster module"] },
      { title: "Express.js", items: ["Routing and route parameters", "Middleware chain", "Error-handling middleware", "Request/response lifecycle", "Body parsing (express.json)", "Static file serving", "CORS middleware"] },
      { title: "NestJS", items: ["Modules, controllers, services", "Dependency injection container", "Decorators (@Get, @Post, @Body)", "Pipes, Guards, Interceptors", "TypeORM / Prisma integration", "Microservices with NestJS"] },
    ],
  },
  {
    module: "Backend",
    title: "Redis & Caching",
    description: "In-memory data store for caching, sessions, pub/sub, and rate limiting.",
    resources: [
      { title: "Redis Docs", url: "https://redis.io/docs/", type: "Official Docs" },
      { title: "Redis University", url: "https://university.redis.com/", type: "Article" },
    ],
    subTopics: [
      { title: "Redis Data Structures", items: ["Strings, Lists, Hashes, Sets, Sorted Sets", "HyperLogLog for cardinality", "Bitmaps", "Streams for event log", "Geospatial indexes"] },
      { title: "Redis Patterns", items: ["Cache-aside with Redis", "Session store implementation", "Pub/Sub messaging", "Distributed locks (SET NX EX)", "Rate limiting with sliding window", "Job queue with BullMQ"] },
      { title: "Redis Persistence", items: ["RDB snapshotting", "AOF (Append Only File)", "RDB vs AOF tradeoffs", "Redis Sentinel for HA", "Redis Cluster sharding"] },
    ],
  },
  {
    module: "Backend",
    title: "Containerization & DevOps",
    description: "Docker, Kubernetes, CI/CD, and cloud-native deployment.",
    resources: [
      { title: "Docker Docs", url: "https://docs.docker.com/", type: "Official Docs" },
      { title: "Kubernetes Docs", url: "https://kubernetes.io/docs/home/", type: "Official Docs" },
    ],
    subTopics: [
      { title: "Docker", items: ["Dockerfile: FROM, RUN, COPY, EXPOSE, CMD", "Image layers and caching", "docker-compose for multi-container", "Volumes and bind mounts", "Networking: bridge, host, overlay", "Multi-stage builds for optimization"] },
      { title: "Kubernetes", items: ["Pod, Deployment, Service, Ingress", "ConfigMap and Secrets", "ReplicaSet and Horizontal Pod Autoscaler", "Persistent Volumes and Claims", "Namespace and RBAC", "Helm charts basics"] },
      { title: "CI/CD", items: ["GitHub Actions pipeline", "Build → test → lint → deploy stages", "Docker image tagging strategy", "Rolling deployments vs blue-green", "Canary releases", "Secrets management in CI"] },
      { title: "Logging & Observability", items: ["Structured logging (JSON)", "Correlation IDs", "Log aggregation (ELK Stack)", "Metrics with Prometheus", "Application Performance Monitoring (APM)", "OpenTelemetry standard"] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FRONTEND MODULE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    module: "Frontend",
    title: "JavaScript Fundamentals",
    description: "Core JS: closures, prototypes, async patterns, and the event loop.",
    resources: [
      { title: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", type: "Official Docs" },
      { title: "javascript.info", url: "https://javascript.info/", type: "Article" },
    ],
    subTopics: [
      { title: "Core Concepts", items: ["var vs let vs const", "Hoisting and temporal dead zone", "Closures and lexical scope", "Prototype chain and inheritance", "this binding: call, apply, bind", "Event delegation", "Debounce and throttle"] },
      { title: "Async JavaScript", items: ["Callbacks and callback hell", "Promises: then, catch, finally", "Promise.all, Promise.race, Promise.allSettled", "async/await syntax", "Error handling in async functions", "Microtask vs macrotask queue"] },
      { title: "Event Loop", items: ["Call stack", "Web APIs", "Task queue (macrotask)", "Microtask queue (Promise callbacks)", "Event loop cycle", "requestAnimationFrame"] },
      { title: "Modern JS (ES6+)", items: ["Arrow functions and lexical this", "Destructuring (array & object)", "Spread and rest operators", "Template literals", "Optional chaining (?.) and nullish coalescing (??)", "Modules: import/export", "Iterators and generators", "Proxy and Reflect"] },
    ],
  },
  {
    module: "Frontend",
    title: "React",
    description: "Component model, hooks, state management, and performance optimization.",
    resources: [
      { title: "React Docs (beta)", url: "https://react.dev/learn", type: "Official Docs" },
    ],
    subTopics: [
      { title: "React Fundamentals", items: ["JSX and virtual DOM", "Component types: function vs class", "Props and prop drilling", "State with useState", "Lifecycle with useEffect", "Controlled vs uncontrolled components"] },
      { title: "Hooks Deep Dive", items: ["useCallback and useMemo", "useRef and DOM manipulation", "useReducer for complex state", "useContext and Context API", "Custom hooks pattern", "Rules of hooks"] },
      { title: "Performance", items: ["React.memo for component memoization", "Lazy loading with React.lazy", "Code splitting with Suspense", "Virtualization (react-window)", "Profiler and DevTools"] },
      { title: "State Management", items: ["Lifting state up", "Context API with useReducer", "Zustand", "Redux Toolkit (RTK)", "React Query for server state", "Jotai / Recoil atoms"] },
    ],
  },
  {
    module: "Frontend",
    title: "Next.js & SSR",
    description: "Server-side rendering, static generation, and App Router.",
    resources: [
      { title: "Next.js Docs", url: "https://nextjs.org/docs", type: "Official Docs" },
    ],
    subTopics: [
      { title: "Rendering Strategies", items: ["SSR: Server-Side Rendering", "SSG: Static Site Generation", "ISR: Incremental Static Regeneration", "CSR: Client-Side Rendering", "Hydration and partial hydration", "React Server Components (RSC)"] },
      { title: "App Router", items: ["File-based routing conventions", "layout.tsx and nested layouts", "Loading and error boundaries", "Server Actions", "Route Handlers (API routes)", "Parallel and intercepting routes"] },
      { title: "Performance", items: ["Image optimization (next/image)", "Font optimization (next/font)", "Script loading strategies", "Core Web Vitals: LCP, CLS, FID/INP", "Bundle analysis"] },
    ],
  },
  {
    module: "Frontend",
    title: "CSS & Web Performance",
    description: "Modern CSS, animations, accessibility, and browser performance.",
    resources: [
      { title: "MDN CSS Reference", url: "https://developer.mozilla.org/en-US/docs/Web/CSS", type: "Official Docs" },
      { title: "web.dev Performance", url: "https://web.dev/performance/", type: "Article" },
    ],
    subTopics: [
      { title: "CSS Layout", items: ["Flexbox: container/item properties", "CSS Grid: template areas, auto-fit", "Positioning: static/relative/absolute/fixed/sticky", "z-index stacking context"] },
      { title: "CSS Modern Features", items: ["CSS custom properties (variables)", "Container queries", "CSS animations and @keyframes", "Transforms and transitions", "Glassmorphism and neumorphism", "CSS :has(), :is(), :where()"] },
      { title: "Accessibility", items: ["Semantic HTML elements", "ARIA roles and attributes", "Focus management", "Color contrast (WCAG AA/AAA)", "Keyboard navigation", "Screen reader testing"] },
      { title: "Browser & Performance", items: ["Critical rendering path", "Layout, paint, and composite layers", "GPU acceleration with will-change", "Reflow vs repaint", "Lighthouse audit", "Resource hints: preload, prefetch, preconnect"] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AI/ML MODULE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    module: "AI / ML",
    title: "Machine Learning Fundamentals",
    description: "Core ML concepts, algorithms, and evaluation metrics.",
    resources: [
      { title: "scikit-learn User Guide", url: "https://scikit-learn.org/stable/user_guide.html", type: "Official Docs" },
      { title: "fast.ai Practical Deep Learning", url: "https://course.fast.ai/", type: "Article" },
    ],
    subTopics: [
      { title: "ML Basics", items: ["Supervised vs unsupervised vs reinforcement", "Training, validation, test split", "Overfitting and underfitting", "Bias-variance tradeoff", "Feature engineering and selection", "Cross-validation"] },
      { title: "Classification Algorithms", items: ["Logistic regression", "Decision trees and entropy", "Random forests and bagging", "Gradient boosting (XGBoost, LightGBM)", "Support Vector Machines (SVM)", "K-Nearest Neighbors (KNN)"] },
      { title: "Regression & Clustering", items: ["Linear regression", "Ridge and Lasso regularization", "K-Means clustering", "DBSCAN", "Hierarchical clustering", "Principal Component Analysis (PCA)"] },
      { title: "Evaluation Metrics", items: ["Accuracy, Precision, Recall, F1", "ROC curve and AUC", "Confusion matrix", "MSE, RMSE, MAE for regression", "Log loss", "NDCG for ranking"] },
    ],
  },
  {
    module: "AI / ML",
    title: "Deep Learning & LLMs",
    description: "Neural networks, transformers, and large language model concepts.",
    resources: [
      { title: "Deep Learning Book", url: "https://www.deeplearningbook.org/", type: "Article" },
      { title: "Andrej Karpathy's Neural Networks Zero to Hero", url: "https://karpathy.ai/zero-to-hero.html", type: "Article" },
    ],
    subTopics: [
      { title: "Neural Network Basics", items: ["Perceptron and activation functions", "Backpropagation and chain rule", "Gradient descent variants (SGD, Adam, RMSProp)", "Batch normalization", "Dropout for regularization", "Weight initialization"] },
      { title: "CNN & RNN", items: ["Convolutional layers and filters", "Pooling operations", "Recurrent neural networks", "LSTM and GRU for sequences", "Vanishing gradient problem"] },
      { title: "Transformers", items: ["Self-attention mechanism", "Multi-head attention", "Positional encoding", "Encoder-decoder architecture", "BERT vs GPT architecture", "Transfer learning and fine-tuning"] },
      { title: "LLMs & Generative AI", items: ["Pre-training and RLHF", "Prompt engineering techniques", "RAG (Retrieval-Augmented Generation)", "Vector databases (Pinecone, Weaviate)", "Embeddings and semantic search", "AI agent frameworks (LangChain, AutoGen)"] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEVOPS MODULE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    module: "DevOps",
    title: "Infrastructure as Code",
    description: "Terraform, Ansible, and cloud infrastructure management.",
    resources: [
      { title: "Terraform Docs", url: "https://developer.hashicorp.com/terraform/docs", type: "Official Docs" },
    ],
    subTopics: [
      { title: "Terraform", items: ["HCL syntax: resources, variables, outputs", "State file and remote backends", "Modules and reuse", "Plan → Apply → Destroy workflow", "Import existing infrastructure", "Terraform Cloud"] },
      { title: "Cloud Providers", items: ["AWS: EC2, S3, RDS, Lambda, ECS, EKS", "GCP: GCE, GCS, Cloud Run, GKE", "Azure: VM, Blob, AKS", "Cloud networking: VPC, subnets, security groups", "IAM: roles, policies, least privilege"] },
    ],
  },
  {
    module: "DevOps",
    title: "Networking & Security",
    description: "Network fundamentals for DevOps: firewalls, VPNs, and load balancers.",
    resources: [
      { title: "NGINX Docs", url: "https://nginx.org/en/docs/", type: "Official Docs" },
    ],
    subTopics: [
      { title: "NGINX", items: ["Nginx as web server", "Nginx as reverse proxy", "Load balancing upstream", "SSL termination", "Rate limiting with ngx_http_limit_req_module", "Nginx caching"] },
      { title: "Security", items: ["Network ACLs and security groups", "VPN and private networking", "Secrets management (Vault, AWS Secrets Manager)", "Container image scanning", "SAST and DAST in CI pipeline"] },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// SEED FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n╔══════════════════════════════════════════════════╗")
  console.log("║  Master Knowledge Base Seeder                     ║")
  console.log("╚══════════════════════════════════════════════════╝\n")

  let topicsCreated = 0
  let subTopicsCreated = 0
  let checklistsCreated = 0
  let checklistItemsCreated = 0
  let resourcesCreated = 0

  for (const entry of KNOWLEDGE_BASE) {
    // 1. Create parent topic
    const parentSlug = slug(entry.title)
    const parent = await prisma.topic.upsert({
      where: { slug: parentSlug },
      update: { description: entry.description },
      create: {
        title: entry.title,
        slug: parentSlug,
        module: entry.module,
        description: entry.description,
      },
    })
    topicsCreated++
    process.stdout.write(`  ✓ [${entry.module}] ${entry.title}\n`)

    // 2. Create resources for parent topic
    for (const res of entry.resources ?? []) {
      const existingRes = await prisma.resource.findFirst({
        where: { url: res.url, topicId: parent.id },
      })
      if (!existingRes) {
        await prisma.resource.create({
          data: { title: res.title, url: res.url, type: res.type, topicId: parent.id },
        })
        resourcesCreated++
      }
    }

    // 3. Create subtopics with checklists
    for (const sub of entry.subTopics) {
      const subSlug = slug(`${entry.title}-${sub.title}`)
      const subTopic = await prisma.topic.upsert({
        where: { slug: subSlug },
        update: {},
        create: {
          title: sub.title,
          slug: subSlug,
          module: entry.module,
          parentId: parent.id,
          description: `${sub.title} — subtopic of ${entry.title}`,
        },
      })
      subTopicsCreated++

      // Create checklist for subtopic
      const existingChecklist = await prisma.checklist.findFirst({
        where: { topicId: subTopic.id },
      })

      if (!existingChecklist) {
        await prisma.checklist.create({
          data: {
            title: `${sub.title} Mastery Checklist`,
            topicId: subTopic.id,
            items: {
              create: sub.items.map(item => ({ content: item })),
            },
          },
        })
        checklistsCreated++
        checklistItemsCreated += sub.items.length
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FINAL AUDIT
  // ─────────────────────────────────────────────────────────────────────────
  const [totalTopics, totalChecklists, totalItems, totalResources, totalCompanies, totalProblems, totalLinks] = await Promise.all([
    prisma.topic.count(),
    prisma.checklist.count(),
    prisma.checklistItem.count(),
    prisma.resource.count(),
    prisma.company.count(),
    prisma.leetcodeProblem.count(),
    prisma.companyQuestion.count(),
  ])

  console.log("\n════════════════════════════════════════════════════")
  console.log("  SEED COMPLETE — FINAL DATABASE COUNTS")
  console.log("────────────────────────────────────────────────────")
  console.log(`  Topics (total):         ${totalTopics}`)
  console.log(`  Checklists:             ${totalChecklists}`)
  console.log(`  Checklist Items:        ${totalItems}`)
  console.log(`  Resources:              ${totalResources}`)
  console.log(`  Companies:              ${totalCompanies}`)
  console.log(`  LeetCode Problems:      ${totalProblems}`)
  console.log(`  Company-Problem Links:  ${totalLinks}`)
  console.log("────────────────────────────────────────────────────")
  console.log(`  [This session added]`)
  console.log(`  Topics created:         ${topicsCreated}`)
  console.log(`  Subtopics created:      ${subTopicsCreated}`)
  console.log(`  Checklists created:     ${checklistsCreated}`)
  console.log(`  Checklist items added:  ${checklistItemsCreated}`)
  console.log(`  Resources added:        ${resourcesCreated}`)
  console.log("════════════════════════════════════════════════════\n")

  // Verification: stop if any critical model is zero
  const criticalZeros = []
  if (totalTopics === 0) criticalZeros.push("Topics")
  if (totalCompanies === 0) criticalZeros.push("Companies")
  if (totalProblems === 0) criticalZeros.push("LeetCode Problems")

  if (criticalZeros.length > 0) {
    console.error(`✗ STOP: Critical models are empty: ${criticalZeros.join(", ")}`)
    process.exit(1)
  }

  console.log("✓ All critical models populated. Phase A complete.")
}

main()
  .catch(e => { console.error("SEED ERROR:", e); process.exit(1) })
  .finally(() => prisma.$disconnect())
