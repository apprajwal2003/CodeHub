import fs from "fs/promises";
import path from "path";

export async function revertRepo(commitId) {
  try {
    const repoPath = path.resolve(process.cwd(), ".codeHubGit");
    const commitsPath = path.join(repoPath, "commits");

    const parentDir = path.resolve(repoPath, "..");
    const commitDir = path.join(commitsPath, commitId);
    const files = await fs.readdir(commitDir);
    for (const file of files) {
      await fs.copyFile(
        path.join(commitDir, file),
        path.join(parentDir, file),
        file.Body
      );
    }
    console.log(`Reverted to commit: ${commitId}`);
  } catch (error) {
    console.log("Unable to revert!", error);
  }
}
