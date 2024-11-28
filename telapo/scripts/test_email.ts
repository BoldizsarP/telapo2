import { sendPasswordResetEmail } from "@/server/mailer";
async function main() {
  sendPasswordResetEmail({
    email: "boldizsarpal@invenshure.com",
    link: "randomlink.com",
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
