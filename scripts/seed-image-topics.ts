import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const webDevTopics = [
  "HTML/CSS",
  "JS Basics",
  "JS architecture",
  "Async JS",
  "Node vs Browser JS",
  "HTTP and Express",
  "Databases and Mongo",
  "Postgres + Prisma/drizzle",
  "Typescript",
  "Turborepo",
  "BunJS",
  "React",
  "Tailwind",
  "NextJS",
  "Websockets + WebRTC",
  "Queues/Pubsubs"
]

const devopsTopics = [
  "Bash/Terminal",
  "VMs/Baremetal machines",
  "Process management + Reverse proxies",
  "Certificates and cert management",
  "ASGs/MIGs",
  "Containers and container runtimes",
  "Docker",
  "Kubernetes 1",
  "Kubernetes 2",
  "CI/CD",
  "Monitoring/Observability",
  "iac",
  "CDNs + Object stores",
  "Sandboxing/Firecracker"
]

const aiMlTopics = [
  "Neural networks, Pytorch",
  "Optional extra class - RNNs, LSTMs, Sequential models",
  "Optional extra class - CNNs",
  "Coding simple attention",
  "Vanilla attention to industry -- Coding other variations of attn - Adding Kv cache, MQA, GQA, (Grouped q atn), MLA (multi-head latent attention), DSA",
  "Huggingface end to end - datasets, spaces, models, blogs, courses etc.",
  "Instrumenting LLM calls/observability/tracing",
  "Vector DBs and RAG",
  "Context engineering - Summarization, data collection",
  "Agents from first principles. Building an agent framework.",
  "Agent frameworks",
  "Memory",
  "MCP",
  "Computer use & multimodal agents",
  "What is Finetuning",
  "Finetuning a model for any usecase",
  "RL fine tuning",
  "Evals -- Testing agents",
  "Advance topics",
  "Other tangents --- Voice, image, Video"
]

async function main() {
  console.log("Fixing Backend issues...")
  // Fix System Design
  await prisma.topic.updateMany({
    where: { title: "System Design" },
    data: { module: "System Design" }
  })
  
  // Fix Java
  // Find OOPs topic if it exists
  const oopsTopic = await prisma.topic.findFirst({
    where: { title: { contains: "OOP" } }
  })
  
  if (oopsTopic) {
    await prisma.topic.updateMany({
      where: { title: "Java Core" },
      data: { module: oopsTopic.module, parentId: oopsTopic.id, title: "Java (OOPs)" }
    })
  } else {
    await prisma.topic.updateMany({
      where: { title: "Java Core" },
      data: { module: "Core CS", title: "Java (OOPs)" }
    })
  }
  
  console.log("Seeding Web Dev topics...")
  const webParent = await prisma.topic.create({
    data: {
      title: "Web Development",
      slug: "web-dev-master",
      module: "Web Dev",
      description: "Full Stack Web Development Topics",
    }
  })
  
  for (let i = 0; i < webDevTopics.length; i++) {
    await prisma.topic.create({
      data: {
        title: webDevTopics[i],
        slug: `web-dev-${i}`,
        module: "Web Dev",
        parentId: webParent.id,
      }
    })
  }
  
  console.log("Seeding DevOps topics...")
  const devopsParent = await prisma.topic.create({
    data: {
      title: "DevOps Masterclass",
      slug: "devops-master",
      module: "DevOps",
      description: "DevOps and Cloud Infrastructure",
    }
  })
  
  for (let i = 0; i < devopsTopics.length; i++) {
    await prisma.topic.create({
      data: {
        title: devopsTopics[i],
        slug: `devops-${i}`,
        module: "DevOps",
        parentId: devopsParent.id,
      }
    })
  }
  
  console.log("Seeding AI/ML topics...")
  const aiParent = await prisma.topic.create({
    data: {
      title: "AI & Machine Learning",
      slug: "ai-ml-master",
      module: "AI / ML",
      description: "Machine Learning, LLMs, and AI Agents",
    }
  })
  
  for (let i = 0; i < aiMlTopics.length; i++) {
    await prisma.topic.create({
      data: {
        title: aiMlTopics[i],
        slug: `ai-ml-${i}`,
        module: "AI / ML",
        parentId: aiParent.id,
      }
    })
  }
  
  console.log("Done!")
}

main().catch(console.error).finally(() => prisma.$disconnect())
