const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function verifyMigration() {
  try {
    // 既存のテーブルのデータ数を確認
    const userCount = await prisma.user.count();
    const userTypeCount = await prisma.userType.count();
    const chatAppCount = await prisma.chatApp.count();

    console.log("Existing data counts:", {
      users: userCount,
      userTypes: userTypeCount,
      chatApps: chatAppCount,
    });

    // 新しいFeedbackテーブルの存在確認
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Feedback'
      );
    `;
    console.log("Feedback table exists:", tableExists);
  } catch (error) {
    console.error("Verification failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyMigration();
