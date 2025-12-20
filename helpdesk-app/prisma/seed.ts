import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@helpdesk.com";
  const adminPassword = "AdminPassword123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  console.log("Starting seeding process...");

  
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword, role: "ADMIN" },
    create: {
      name: "System Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      isVerified: true,
    },
  });

 
  await prisma.ticket.deleteMany({});
  console.log("Cleaned up old tickets.");

  
  const ticketsData = [
    { title: "VPN connection dropping", description: "The VPN disconnects every 10 minutes when working from home.", priority: "HIGH", status: "OPEN" },
    { title: "New monitor request", description: "Employee needs a second monitor for the marketing department.", priority: "LOW", status: "CLOSED" },
    { title: "Email sync issue", description: "Outlook is not syncing with the mobile app on iOS.", priority: "MEDIUM", status: "IN_PROGRESS" },
    { title: "Printer jammed on floor 2", description: "The main Xerox printer has a paper jam in Tray 3.", priority: "MEDIUM", status: "OPEN" },
    { title: "Slack workspace access", description: "New intern needs access to the #dev-team channel.", priority: "LOW", status: "IN_PROGRESS" },
    { title: "Critical: Database slow", description: "Production DB is responding very slowly to queries.", priority: "HIGH", status: "OPEN" },
    { title: "Zoom audio problems", description: "User cannot hear audio in Zoom meetings after the last OS update.", priority: "MEDIUM", status: "CLOSED" },
    { title: "Keyboard replacement", description: "The 'E' key is stuck on a laptop keyboard.", priority: "LOW", status: "OPEN" },
    { title: "WIFI password change", description: "Guest WIFI password needs to be rotated for security compliance.", priority: "MEDIUM", status: "CLOSED" },
    { title: "Software License renewal", description: "Adobe Creative Cloud license is expiring in 3 days.", priority: "HIGH", status: "IN_PROGRESS" },
    { title: "Broken office chair", description: "Adjustable height lever is broken on chair #402.", priority: "LOW", status: "OPEN" },
    { title: "Chrome crashing on startup", description: "Google Chrome closes immediately after being opened on Windows 11.", priority: "MEDIUM", status: "OPEN" },
  ] as const;

  console.log(`Creating ${ticketsData.length} tickets...`);


  for (const t of ticketsData) {
    await prisma.ticket.create({
      data: {
        ...t,
        userId: admin.id,
      },
    });
  }

  console.log("Seeding complete! You now have 12 tickets.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });