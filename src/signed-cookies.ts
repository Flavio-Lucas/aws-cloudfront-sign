import { getSignedCookies } from '@aws-sdk/cloudfront-signer';
import { CloudFrontConfig } from './types';
import { extractRelativePath } from './utils';

export function generateSignedCookies(
  outputPath: string,
  config: CloudFrontConfig,
  streamFilename: string = "stream-h264.m3u8"
): string[] | null {
  const relativePath = extractRelativePath(outputPath);
  if (!relativePath) return null;

  const directoryPath = `${config.URL}/${relativePath}`;
  // const streamUrl = `${directoryPath}/${streamFilename}`;

  const cookies = getSignedCookies({
    // url: streamUrl,
    url: directoryPath,
    keyPairId: config.KEY_PAIR_ID,
    privateKey: config.PRIVATE_KEY,
    // dateLessThan: Math.floor(Date.now() / 1000) + config.EXPIRATION_SECONDS,
    policy: JSON.stringify({
      Statement: [{
        Resource: directoryPath,
        Condition: {
          DateLessThan: {
            "AWS:EpochTime": Math.floor(Date.now() / 1000) + config.EXPIRATION_SECONDS
          }
        }
      }]
    })
  });

  return [
    `CloudFront-Policy=${cookies['CloudFront-Policy']}; Path=/; Secure; HttpOnly`,
    `CloudFront-Signature=${cookies['CloudFront-Signature']}; Path=/; Secure; HttpOnly`,
    `CloudFront-Key-Pair-Id=${cookies['CloudFront-Key-Pair-Id']}; Path=/; Secure; HttpOnly`,
  ];
}