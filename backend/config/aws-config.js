import AWS from "aws-sdk";

AWS.config.update({ region: "us-east-1" });

const s3 = new AWS.S3();
const S3_BUCKET = "codehub-git";

export { s3, S3_BUCKET };
