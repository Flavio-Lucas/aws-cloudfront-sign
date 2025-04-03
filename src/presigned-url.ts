import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { CloudFrontConfig } from './types';
import { extractRelativePath } from './utils';

export function generatePresignedUrl(
  outputPath: string,
  config: CloudFrontConfig,
  streamFilename: string = "stream-h264.m3u8"
): string | null {
  const relativePath = extractRelativePath(outputPath);
  if (!relativePath) return null;

  const directoryPath = `${config.URL}/${relativePath}`;
  const streamUrl = `${directoryPath}/${streamFilename}`;

  return getSignedUrl({
    url: streamUrl,
    keyPairId: config.KEY_PAIR_ID,
    privateKey: config.PRIVATE_KEY,
    policy: JSON.stringify({
      Statement: [{
        Resource: `${directoryPath}/*`,
        Condition: {
          DateLessThan: {
            "AWS:EpochTime": Math.floor(Date.now() / 1000) + config.EXPIRATION_SECONDS
          }
        }
      }]
    })
  });
}