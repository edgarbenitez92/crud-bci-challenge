import { User } from '../interfaces/user.interface';

export const USERS_MOCK: User[] = [
  {
    id: 1,
    enable: true,
    name: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    region: 'Americas',
    country: 'United States',
    createdAt: new Date('2024-01-15 10:00:00'),
    updatedAt: new Date('2024-01-15 12:00:00')
  },
  {
    id: 2,
    enable: true,
    name: 'Maria',
    lastname: 'García',
    email: 'maria.garcia@example.com',
    region: 'Europe',
    country: 'Spain',
    createdAt: new Date('2024-02-01 09:00:00'),
    updatedAt: new Date('2024-02-10 15:00:00')
  },
  {
    id: 3,
    enable: false,
    name: 'Akiko',
    lastname: 'Tanaka',
    email: 'akiko.tanaka@example.com',
    region: 'Asia',
    country: 'Japan',
    createdAt: new Date('2024-02-15 10:00:00'),
    updatedAt: new Date('2024-02-15 17:00:00')
  },
  {
    id: 4,
    enable: true,
    name: 'Carlos',
    lastname: 'Silva',
    email: 'carlos.silva@example.com',
    region: 'Americas',
    country: 'Brazil',
    createdAt: new Date('2024-03-01 05:00:00'),
    updatedAt: new Date('2024-03-05 21:00:00')
  },
  {
    id: 5,
    enable: false,
    name: 'Sophie',
    lastname: 'Martin',
    email: 'sophie.martin@example.com',
    region: 'Europe',
    country: 'France',
    createdAt: new Date('2024-03-10 10:00:00'),
    updatedAt: new Date('2024-03-10 12:30:00')
  }
]; 