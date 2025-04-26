import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function initRepo() {
  const repoPath = path.resolve(process.cwd(), ".codeHubGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitsPath, { recursive: true });
    await fs.writeFile(
      path.join(repoPath, "config.json"),
      JSON.stringify({ bucket: "s3 bucket" })
    );

    if (process.platform === "win32") {
      await execPromise(`attrib +h "${repoPath}"`);
    }

    console.log("Repository initialised");
  } catch (err) {
    console.error("Failed to initialise repository", err);
  }
}
