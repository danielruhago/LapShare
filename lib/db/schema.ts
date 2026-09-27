import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  university: text('university'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

export const listings = pgTable('listings', {
  id: serial('id').primaryKey(),
  ownerId: text('ownerId').notNull(),
  title: text('title').notNull(),
  brand: text('brand').notNull(),
  cpu: text('cpu').notNull(),
  ram: text('ram').notNull(),
  storage: text('storage').notNull(),
  screen: text('screen').notNull(),
  gpu: text('gpu'),
  os: text('os').notNull(),
  condition: text('condition').notNull(),
  description: text('description').notNull(),
  pickupLocation: text('pickupLocation').notNull(),
  university: text('university').notNull(),
  dailyPrice: integer('dailyPrice').notNull(),
  weeklyPrice: integer('weeklyPrice').notNull(),
  monthlyPrice: integer('monthlyPrice').notNull(),
  imageUrl: text('imageUrl'),
  available: boolean('available').notNull().default(true),
  category: text('category'),
  category: text('category'),
  status: text('status').notNull().default('Available'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const rentalRequests = pgTable('rental_requests', {
  id: serial('id').primaryKey(),
  listingId: integer('listingId').notNull(),
  renterId: text('renterId').notNull(),
  ownerId: text('ownerId').notNull(),
  plan: text('plan').notNull(),
  duration: integer('duration').notNull().default(1),
  startDate: date('startDate').notNull(),
  rentalPrice: integer('rentalPrice').notNull(),
  serviceFee: integer('serviceFee').notNull(),
  deposit: integer('deposit').notNull(),
  total: integer('total').notNull(),
  message: text('message'),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export type Listing = typeof listings.$inferSelect
export type RentalRequest = typeof rentalRequests.$inferSelect
