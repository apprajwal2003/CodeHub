import fs from "fs/promises";
import path from "path";
import { s3, S3_BUCKET } from "../config/aws-config.js";

export async function pullRepo(params) {
  const repoPath = path.resolve(process.cwd(), ".codeHubGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    //get all commits
    const data = await s3
      .listObjectsV2({
        Bucket: S3_BUCKET,
        Prefix: "commits/",
      })
      .promise();
    const objects = data.Contents;
    for (const object of objects) {
      const Key = object.Key;
      const commitDir = path.join(
        commitsPath,
        path.dirname(Key).split("/").pop()
      );
      //create directories to store the pulled data
      await fs.mkdir(commitDir, { recursive: true });
      const params = {
        Bucket: S3_BUCKET,
        Key: Key,
      };
      //download and store the data in specific locations
      const file = await s3.getObject(params).promise();
      await fs.writeFile(path.join(repoPath, Key), file.Body);
    }
    console.log("Successfully pulled repositories!");
  } catch (error) {
    console.error("Unable to pull Repository", error);
  }
}
