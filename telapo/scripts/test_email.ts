import { sendPasswordResetEmail } from "@/server/mailer";
async function main() {
  const basePath = process.env.NEXTAUTH_URL ?? "random.link";
  sendPasswordResetEmail({
    email: "boldizsarpal@invenshure.com",
    link: basePath,
    displayName: "Your Balls",
  });
}

main()
  .then(async () => {
    // await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    // await prisma.$disconnect();
    process.exit(1);
  });
