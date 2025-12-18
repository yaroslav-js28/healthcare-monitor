import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const prisma = new PrismaClient(
  {
    adapter: new PrismaMariaDb({
      host: process.env['DATABASE_HOST'],
      port: +(process.env['DATABASE_PORT'] || 3306),
      connectionLimit: 5,
      user: process.env['DATABASE_USER'],
      password: process.env['DATABASE_PASSWORD'],
      database: process.env['DATABASE_NAME'],
    })
  }
);

const BIOMARKER_TEMPLATES = [
  { name: 'Fasting Glucose', category: 'Metabolic', unit: 'mg/dL', min: 70, max: 99 },
  { name: 'Hemoglobin A1c', category: 'Metabolic', unit: '%', min: 4.0, max: 5.6 },
  { name: 'Vitamin D (25-OH)', category: 'Metabolic', unit: 'ng/mL', min: 30, max: 100 },
  { name: 'Calcium', category: 'Metabolic', unit: 'mg/dL', min: 8.5, max: 10.2 },
  { name: 'Sodium', category: 'Metabolic', unit: 'mEq/L', min: 135, max: 145 },

  { name: 'Total Cholesterol', category: 'Cardiovascular', unit: 'mg/dL', min: 125, max: 200 },
  { name: 'LDL Cholesterol', category: 'Cardiovascular', unit: 'mg/dL', min: 0, max: 100 },
  { name: 'HDL Cholesterol', category: 'Cardiovascular', unit: 'mg/dL', min: 40, max: 60 },
  { name: 'Triglycerides', category: 'Cardiovascular', unit: 'mg/dL', min: 0, max: 150 },
  { name: 'hs-CRP', category: 'Cardiovascular', unit: 'mg/L', min: 0, max: 3.0 },

  { name: 'TSH', category: 'Hormonal', unit: 'mIU/L', min: 0.4, max: 4.0 },
  { name: 'Free T4', category: 'Hormonal', unit: 'ng/dL', min: 0.8, max: 1.8 },
  { name: 'Cortisol (AM)', category: 'Hormonal', unit: 'mcg/dL', min: 10, max: 20 },
  { name: 'Testosterone Total', category: 'Hormonal', unit: 'ng/dL', min: 300, max: 1000 },
  { name: 'Estradiol', category: 'Hormonal', unit: 'pg/mL', min: 15, max: 350 },
];

const PATIENT_NAMES = [
  { first: 'John', last: 'Doe', dob: '1980-05-15' },
  { first: 'Jane', last: 'Smith', dob: '1992-08-22' },
  { first: 'Robert', last: 'Johnson', dob: '1975-03-10' },
  { first: 'Emily', last: 'Davis', dob: '1988-11-30' },
  { first: 'Michael', last: 'Wilson', dob: '1965-07-04' },
];

function generateValue(min: number, max: number) {
  const isNormal = Math.random() > 0.2;

  if (isNormal) {
    return Number((Math.random() * (max - min) + min).toFixed(2));
  } else {
    const isHigh = Math.random() > 0.5;
    const padding = (max - min) * 0.3;
    if (isHigh) return Number((max + Math.random() * padding).toFixed(2));
    else return Number((min - Math.random() * padding).toFixed(2));
  }
}

function determineStatus(val: number, min: number, max: number) {
  if (val < min) return 'Low';
  if (val > max) return 'High';
  return 'Normal';
}

async function main() {
  console.log('🌱 Starting seed...');

  await prisma.biomarker.deleteMany();
  await prisma.patient.deleteMany();

  for (const p of PATIENT_NAMES) {
    const patient = await prisma.patient.create({
      data: {
        name: `${p.first} ${p.last}`,
        dateOfBirth: new Date(p.dob),
        lastVisit: new Date(),
        biomarkers: {
          create: BIOMARKER_TEMPLATES.map((t) => {
            const val = generateValue(t.min, t.max);
            return {
              name: t.name,
              category: t.category,
              unit: t.unit,
              rangeMin: t.min,
              rangeMax: t.max,
              value: val,
              status: determineStatus(val, t.min, t.max),
            };
          }),
        },
      },
    });
    console.log(`✅ Created ${p.first} ${p.last} with 15 biomarkers.`);
  }

  console.log('🏁 Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
