"use server";
import { v4 as uuid } from "uuid";
import { prisma } from "../prisma";
const TWO_HOURS = 2 * 60 * 60 * 1000;
export const generateVerificationToken = async (email: string) => {
  const verificationToken = await prisma.verificationToken.findFirst({
    where: {
      identifier: email,
    },
  });
  if (verificationToken) {
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: verificationToken.token,
        },
      },
    });
  }

  return await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: uuid(),
      expires: new Date(new Date().getTime() + TWO_HOURS),
    },
  });
};
