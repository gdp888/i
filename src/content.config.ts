import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const septic = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/septic' }),
  schema: z.object({
    title: z.string(),
    brand: z.string(),
    series: z.string().optional(),
    people: z.number().min(1).max(500),
    volumePerDay: z.number().min(0).describe('л/сутки'),
    price: z.number().min(0).describe('руб. — под ключ с монтажом'),
    priceOld: z.number().optional(),
    type: z.enum(['АОС', 'накопитель', 'септик-отстойник', 'кессон', 'ёмкость']),
    discharge: z.enum(['самотёчный', 'принудительный', 'оба']).optional(),
    power: z.enum(['энергозависимый', 'энергонезависимый']).optional(),
    highWater: z.boolean().default(false).describe('подходит для высоких грунтовых вод'),
    image: z.string().optional().describe('путь к картинке или URL'),
    featured: z.boolean().default(false),
    bestseller: z.boolean().default(false),
    warranty: z.string().optional(),
    shortDescription: z.string(),
    description: z.string(),
    features: z.array(z.string()).default([]),
    specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    icon: z.string().default('wrench'),
    shortDescription: z.string(),
    description: z.string(),
    price: z.string().optional(),
    steps: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    readingTime: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { septic, services, articles };
