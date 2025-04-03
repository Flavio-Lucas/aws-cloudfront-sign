require('dotenv').config();
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';

const CLOUDFRONT_CONFIG = {
  KEY_PAIR_ID: process.env.CLOUDFRONT_KEY_PAIR_ID,
  PRIVATE_KEY: process.env.CLOUDFRONT_PRIVATE_KEY,
  URL: process.env.CLOUDFRONT_URL,
  EXPIRATION_SECONDS: 60 * 60 * 4,
};

function getTranscodedUrl(outputPath: string) {
  const extractRelativePath = (outputPath: string) => {
    const match = outputPath.match(/^s3:\/\/[^/]+\/(.*)/);
    return match ? match[1].replace(/\/$/, '') : null;
  };

  const relativePath = extractRelativePath(outputPath);
  if (!relativePath) {
    return null;
  }

  try {
    const resourceUrl = `${CLOUDFRONT_CONFIG.URL}/${relativePath}`;
    const policy = {
      Statement: [{
        Resource: `${resourceUrl}/*`,
        Condition: {
          DateLessThan: {
            "AWS:EpochTime": Math.floor(Date.now() / 1000) + CLOUDFRONT_CONFIG.EXPIRATION_SECONDS
          }
        }
      }]
    };

    return getSignedUrl({
      url: resourceUrl,
      keyPairId: CLOUDFRONT_CONFIG.KEY_PAIR_ID!,
      privateKey: CLOUDFRONT_CONFIG.PRIVATE_KEY!,
      policy: JSON.stringify(policy)
    });
  } catch (error) {
    return null;
  }
}
const fileName = '12_Midnight_to_Noon_e065b2d744'; // https://us-east-1.console.aws.amazon.com/s3/buckets/kyvjxq-prodstrapicontentbucket-output?prefix=output%2F12_Midnight_to_Noon_e065b2d744%2F&region=us-east-1&bucketType=general&tab=objects
const transcodedUrl = getTranscodedUrl(`s3://${process.env.AWS_MEDIA_CONVERT_OUTPUT_BUCKET}/output/${fileName}`);
console.log(transcodedUrl);
