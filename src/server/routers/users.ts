import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/lib/trpc/trpc";
import { registerSchema, updateProfileSchema, updateCoachProfileSchema } from "@/lib/validations/user";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.user.findUnique({ where: { email: input.email } });
      if (existing) throw new TRPCError({ code: "CONFLICT", message: "Email already registered." });

      let isMinor = false;
      let age: number | null = null;
      if (input.dateOfBirth) {
        const dob = new Date(input.dateOfBirth);
        age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        isMinor = age < 18;
        if (age < 13 && !input.parentEmail) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Parent email required for users under 13." });
        }
      }

      const hash = await bcrypt.hash(input.password, 12);
      const user = await ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hash,
          role: input.role,
          dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
          isMinor,
          parentEmail: input.parentEmail,
          city: input.city,
          state: input.state,
          // Under-13 accounts require parental consent before activation
          consentGrantedAt: age !== null && age < 13 ? null : new Date(),
        },
      });

      return { id: user.id, email: user.email, role: user.role };
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: { coachProfile: true, playerProfile: true },
    });
    if (!user) throw new TRPCError({ code: "NOT_FOUND" });
    const { password: _pw, ...safe } = user;
    return safe;
  }),

  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: input,
        select: { id: true, name: true, city: true, state: true, zipCode: true, image: true },
      });
    }),

  updateCoachProfile: protectedProcedure
    .input(updateCoachProfileSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "COACH") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only coaches can update a coach profile." });
      }
      return ctx.db.coachProfile.upsert({
        where: { userId: ctx.session.user.id },
        create: { userId: ctx.session.user.id, ...input },
        update: input,
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
        select: {
          id: true, name: true, image: true, role: true, city: true, state: true,
          coachProfile: true, playerProfile: true, createdAt: true,
        },
      });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });
      return user;
    }),
});
