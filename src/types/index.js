"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkingHoursSchema = exports.StaffSchema = exports.LiveTicketSchema = exports.BookingSchema = exports.ServiceSchema = exports.BusinessSchema = void 0;
const zod_1 = require("zod");
exports.BusinessSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().nullish(),
    address: zod_1.z.string().nullish(),
    phone: zod_1.z.string().nullish(),
    email: zod_1.z.string().nullish(),
    avatarUrl: zod_1.z.string().nullish(),
    work_hours: zod_1.z.string().nullish(),
    punctuality: zod_1.z.number().nullish(),
}).passthrough();
exports.ServiceSchema = zod_1.z.object({
    id: zod_1.z.string(),
    businessId: zod_1.z.string().nullish(),
    name: zod_1.z.string(),
    durationMinutes: zod_1.z.number().nullish(),
    price: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).nullish(),
    description: zod_1.z.string().nullish(),
}).passthrough();
exports.BookingSchema = zod_1.z.object({
    id: zod_1.z.string(),
    businessId: zod_1.z.string().nullish(),
    business_id: zod_1.z.string().nullish(),
    serviceId: zod_1.z.string().nullish(),
    service_id: zod_1.z.string().nullish(),
    serviceName: zod_1.z.string().nullish(),
    service_name: zod_1.z.string().nullish(),
    customerId: zod_1.z.string().nullish(),
    clientId: zod_1.z.string().nullish(),
    client_id: zod_1.z.string().nullish(),
    staffId: zod_1.z.string().nullish(),
    staff_id: zod_1.z.string().nullish(),
    staffName: zod_1.z.string().nullish(),
    staff_name: zod_1.z.string().nullish(),
    startTime: zod_1.z.string().nullish(),
    endTime: zod_1.z.string().nullish(),
    time: zod_1.z.string().nullish(),
    date: zod_1.z.string().nullish(),
    delayMinutes: zod_1.z.number().nullish(),
    delay_minutes: zod_1.z.number().nullish(),
    queueOrder: zod_1.z.number().nullish(),
    queue_order: zod_1.z.number().nullish(),
    isGuest: zod_1.z.boolean().nullish(),
    is_guest: zod_1.z.boolean().nullish(),
    isGuestCheckout: zod_1.z.boolean().nullish(),
    guestName: zod_1.z.string().nullish(),
    guest_name: zod_1.z.string().nullish(),
    guestPhone: zod_1.z.string().nullish(),
    guest_phone: zod_1.z.string().nullish(),
    rating: zod_1.z.number().nullish(),
    reviewText: zod_1.z.string().nullish(),
    status: zod_1.z.enum(["pending", "confirmed", "cancelled", "completed", "in_progress", "done", "waiting", "upcoming"]).catch("pending"),
}).passthrough();
exports.LiveTicketSchema = zod_1.z.object({
    id: zod_1.z.string(),
    bookingId: zod_1.z.string(),
    queuePosition: zod_1.z.number().catch(0),
    estimatedWaitTime: zod_1.z.number().catch(0),
    status: zod_1.z.enum(["waiting", "serving", "done", "no_show"]).catch("waiting"),
}).passthrough();
exports.StaffSchema = zod_1.z.object({
    id: zod_1.z.string(),
    businessId: zod_1.z.string().nullish(),
    name: zod_1.z.string(),
    avatarUrl: zod_1.z.string().nullish(),
    role: zod_1.z.string().nullish(),
    initials: zod_1.z.string().nullish(),
    isActive: zod_1.z.boolean().nullish(),
}).passthrough();
exports.WorkingHoursSchema = zod_1.z.object({
    id: zod_1.z.string().nullish(),
    businessId: zod_1.z.string().nullish(),
    staffId: zod_1.z.string().nullish(),
    dayOfWeek: zod_1.z.number().min(0).max(6).nullish(),
    startTime: zod_1.z.string(),
    endTime: zod_1.z.string(),
    isActive: zod_1.z.boolean().default(true),
}).passthrough();
