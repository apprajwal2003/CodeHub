import fs from "fs/promises";
import path from "path";
import { s3, S3_BUCKET } from "../config/aws-config.js";

export async function pushRepo(params) {
  const repoPath = path.resolve(process.cwd(), ".codeHubGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commits = await fs.readdir(commitsPath);
    for (const commit of commits) {
      const commitPath = path.join(commitsPath, commit);
      const files = await fs.readdir(commitPath);
      for (const file of files) {
        const filePath = path.join(commitPath, file);
        const fileContent = await fs.readFile(filePath);
        const params = {
          Bucket: S3_BUCKET,
          Key: `commits/${commit}/${file}`,
          Body: fileContent,
        };
        await s3.upload(params).promise();
      }
    }
    console.log("All commits are pushed to S3 successfully!");
  } catch (error) {
    console.error("Failed to push commits!", error);
  }
}
