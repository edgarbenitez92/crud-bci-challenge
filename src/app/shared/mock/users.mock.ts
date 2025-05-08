import { User } from '../interfaces/user.interface';

export const USERS_MOCK: User[] = [
  {
    id: 1,
    enable: true,
    name: 'John',
    lastname: 'Doe',
    region: 'Americas',
    country: 'United States',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 2,
    enable: true,
    name: 'Maria',
    lastname: 'García',
    region: 'Europe',
    country: 'Spain',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: 3,
    enable: false,
    name: 'Akiko',
    lastname: 'Tanaka',
    region: 'Asia',
    country: 'Japan',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: 4,
    enable: true,
    name: 'Carlos',
    lastname: 'Silva',
    region: 'Americas',
    country: 'Brazil',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-05')
  },
  {
    id: 5,
    enable: true,
    name: 'Sophie',
    lastname: 'Martin',
    region: 'Europe',
    country: 'France',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10')
  }
]; 