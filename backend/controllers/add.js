import fs from "fs/promises";
import path from "path";

export async function addRepo(filePath) {
  const repoPath = path.resolve(process.cwd(), ".codeHubGit");
  const stagingPath = path.join(repoPath, "stagingPath");

  try {
    await fs.mkdir(stagingPath, { recursive: true });
    const fileName = path.basename(filePath);
    await fs.copyFile(filePath, path.join(stagingPath, fileName));
    console.log(`File ${fileName} is added to staging area!`);
  } catch (error) {
    console.error("Failed to add file", error);
  }
}
