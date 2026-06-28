import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';
import { User, UserRole } from '../models/User';
import { Profile } from '../models/Profile';
import { Project } from '../models/Project';
import { Blog } from '../models/Blog';
import { connectDB } from '../config/database';

dotenv.config();

const seedDatabase = async () => {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ Seeding is not allowed in production environment.');
    process.exit(1);
  }

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log('⚠️ SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD missing. Skipping seed.');
    process.exit(0);
  }

  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Project.deleteMany({});
    await Blog.deleteMany({});

    console.log('Seeding initial Super Admin user...');
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const adminUser = await User.create({
      email: email,
      name: 'Abhijeet Rai',
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      forcePasswordChange: true,
    });

    console.log(`✅ Super Admin created: ${adminUser.email}`);

    console.log('Seeding initial Profile...');
    await Profile.create({
      name: 'Abhijeet Rai',
      title: 'Full Stack AI Developer',
      headline: 'Building intelligent scalable applications',
      bio: 'I specialize in Next.js, Node.js, and AI integrations.',
      location: 'Remote',
      email: 'hello@abhijeetrai.dev',
      availabilityStatus: 'AVAILABLE',
      techStack: ['React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB'],
    });
    console.log(`✅ Profile created`);

    console.log('Seeding initial Project...');
    const projectTitle = 'Portfolio AI Engine';
    await Project.create({
      title: projectTitle,
      slug: slugify(projectTitle, { lower: true, strict: true }),
      shortDescription: 'An AI-powered portfolio management system.',
      fullDescription: 'A complete system featuring CMS, Resume parsing, and RAG capabilities.',
      category: 'WEB',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      featured: true,
      technologies: ['Next.js', 'Express', 'MongoDB', 'AI'],
    });
    console.log(`✅ Project created`);

    console.log('Seeding initial Blog...');
    const blogTitle = 'Why I Built My Portfolio with Next.js and Express';
    await Blog.create({
      title: blogTitle,
      slug: slugify(blogTitle, { lower: true, strict: true }),
      excerpt: 'A deep dive into my tech stack choices.',
      content: 'Here is why I chose Next.js for the frontend and Express for the backend...',
      categories: ['Engineering'],
      status: 'PUBLISHED',
      publishedAt: new Date(),
      author: adminUser._id,
      readingTime: 5,
    });
    console.log(`✅ Blog created`);

    console.log('Database seeding completed successfully.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
