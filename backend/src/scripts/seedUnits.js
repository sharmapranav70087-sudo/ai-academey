import mongoose from "mongoose";
import dotenv from "dotenv";
import Module from "../models/Module.js";
import Content from "../models/Content.js";
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

const moduleConfig = [
  {
    title: "Introduction to LLM",
    units: 10
  },
  {
    title: "Basics of Prompting",
    units: 12
  },
  {
    title: "Deep Dive into LLM Integration",
    units: 15
  },
  {
    title: "Advanced LLM Concepts and Agentic AI",
    units: 17
  }
];

async function seedLearningUnits() {

  for (const mod of moduleConfig) {

    const moduleDoc = await Module.findOne({
      title: mod.title
    });

    if (!moduleDoc) {
      console.log(`❌ Module not found: ${mod.title}`);
      continue;
    }

    console.log(`🚀 Creating units for ${mod.title}`);

    for (let i = 1; i <= mod.units; i++) {

      const exists = await Content.findOne({
        moduleId: moduleDoc._id,
        unitNumber: i
      });

      if (exists) {
        console.log(`⚠ Unit ${i} already exists`);
        continue;
      }

      await Content.create({

        title: `${mod.title} - Learning Unit ${i}`,

        unitNumber: i,

        moduleId: moduleDoc._id,

        items: [

          {
            type: "text",

            value: `
# ${mod.title} - Unit ${i}

This is the learning content for unit ${i}.

Topics:
- Core concepts
- Examples
- Best practices
- Summary
            `
          },

          {
            type: "video",

            value: "Video content placeholder"
          }

        ]
      });

      console.log(`✅ Created Unit ${i}`);
    }
  }

  console.log("🎉 All learning units created");

  process.exit();
}

seedLearningUnits();