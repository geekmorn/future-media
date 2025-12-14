import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { UserEntity, TagEntity, PostEntity } from '../src/entities';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

config({ path: '.env' });
config({ path: '../../.env' });

const POST_COUNT = 500;

const SAMPLE_TAGS = [
  'javascript',
  'typescript',
  'react',
  'nodejs',
  'python',
  'rust',
  'go',
  'docker',
  'kubernetes',
  'aws',
  'database',
  'frontend',
  'backend',
  'devops',
  'testing',
  'security',
  'api',
  'graphql',
  'nextjs',
  'tailwind',
];

const SAMPLE_CONTENTS = [
  'Just discovered an amazing new feature in TypeScript! 🚀',
  'Working on a new project using React and Next.js. Any tips?',
  'Docker makes deployment so much easier. Love containerization!',
  'Finally figured out how to optimize my database queries. Performance boost!',
  'Learning Rust this weekend. The borrow checker is challenging but worth it.',
  'Kubernetes is complex but powerful. Still learning every day.',
  'Testing is not optional. Write tests for your code!',
  'GraphQL vs REST - what do you prefer and why?',
  'Just deployed my first serverless function. AWS Lambda is awesome!',
  'Code review best practices: be kind, be specific, be helpful.',
  'Frontend development has evolved so much in the last few years.',
  'Backend architecture patterns: microservices vs monolith debate.',
  'DevOps culture is about collaboration, not just tools.',
  'Security should be built-in, not bolted on. Think about it early!',
  'API design is an art. RESTful principles help a lot.',
  'Tailwind CSS changed how I think about styling. So productive!',
  'Node.js performance tips: avoid blocking the event loop.',
  'Python is great for scripting and automation tasks.',
  'Go concurrency model is elegant. Goroutines are powerful.',
  'Clean code is not about perfection, it is about communication.',
  'Refactoring legacy code is like archaeology. Fascinating!',
  'Open source contributions are a great way to learn and grow.',
  'Pair programming really helps with knowledge sharing.',
  'Technical debt is real. Pay it off before it compounds.',
  'Documentation is a love letter to your future self.',
  'Debugging is twice as hard as writing the code in the first place.',
  'The best error message is the one that never shows up.',
  'Performance optimization: measure first, optimize second.',
  'Accessibility is not a feature, it is a requirement.',
  'Mobile-first design makes sense for most projects today.',
];

const TEST_USERS = [
  { name: 'alice', color: '#6366f1' },
  { name: 'bob', color: '#ec4899' },
  { name: 'charlie', color: '#10b981' },
  { name: 'diana', color: '#f59e0b' },
  { name: 'eve', color: '#3b82f6' },
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!;
}

function getRandomItems<T>(array: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getRandomDate(daysBack: number): Date {
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.random() * daysBack * 24 * 60 * 60 * 1000);
  return pastDate;
}

async function seed() {
  console.log('🌱 Starting database seed...\n');

  const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: process.env.DATABASE_PATH ?? 'database.sqlite',
    entities: [UserEntity, TagEntity, PostEntity],
    synchronize: true,
  });

  await dataSource.initialize();
  console.log('✅ Database connected\n');

  const userRepository = dataSource.getRepository(UserEntity);
  const tagRepository = dataSource.getRepository(TagEntity);
  const postRepository = dataSource.getRepository(PostEntity);

  // Create test users if they don't exist
  console.log('👤 Creating test users...');
  const users: UserEntity[] = [];

  for (const testUser of TEST_USERS) {
    let user = await userRepository.findOne({ where: { name: testUser.name } });

    if (!user) {
      const passwordHash = await bcrypt.hash('password123', 10);
      user = userRepository.create({
        id: randomUUID(),
        name: testUser.name,
        passwordHash,
        color: testUser.color,
      });
      await userRepository.save(user);
      console.log(`  Created user: ${testUser.name}`);
    } else {
      console.log(`  User exists: ${testUser.name}`);
    }

    users.push(user);
  }

  // Create tags if they don't exist
  console.log('\n🏷️  Creating tags...');
  const tags: TagEntity[] = [];

  for (const tagName of SAMPLE_TAGS) {
    let tag = await tagRepository.findOne({ where: { name: tagName } });

    if (!tag) {
      tag = tagRepository.create({
        id: randomUUID(),
        name: tagName,
      });
      await tagRepository.save(tag);
      console.log(`  Created tag: ${tagName}`);
    } else {
      console.log(`  Tag exists: ${tagName}`);
    }

    tags.push(tag);
  }

  // Create posts
  console.log(`\n📝 Creating ${POST_COUNT} posts...`);
  const posts: PostEntity[] = [];

  for (let i = 0; i < POST_COUNT; i++) {
    const author = getRandomItem(users);
    const postTags = getRandomItems(tags, 0, 4);
    const content = getRandomItem(SAMPLE_CONTENTS);
    const createdAt = getRandomDate(90); // Posts from last 90 days

    const post = postRepository.create({
      id: randomUUID(),
      content: `${content} #${i + 1}`,
      authorId: author.id,
      tags: postTags,
      createdAt,
    });

    posts.push(post);

    if ((i + 1) % 100 === 0) {
      console.log(`  Created ${i + 1} posts...`);
    }
  }

  // Save all posts in batches
  const batchSize = 50;
  for (let i = 0; i < posts.length; i += batchSize) {
    const batch = posts.slice(i, i + batchSize);
    await postRepository.save(batch);
  }

  console.log(`  ✅ Created ${POST_COUNT} posts total`);

  // Summary
  const totalPosts = await postRepository.count();
  const totalUsers = await userRepository.count();
  const totalTags = await tagRepository.count();

  console.log('\n📊 Database summary:');
  console.log(`  Users: ${totalUsers}`);
  console.log(`  Tags: ${totalTags}`);
  console.log(`  Posts: ${totalPosts}`);

  await dataSource.destroy();
  console.log('\n🎉 Seed completed successfully!');
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
