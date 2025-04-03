import { getSignedCookies } from '@aws-sdk/cloudfront-signer';
import { CloudFrontConfig } from './types';
import { extractRelativePath } from './utils';

export function generateSignedCookies(
  outputPath: string,
  config: CloudFrontConfig
): string[] | null {
  const relativePath = extractRelativePath(outputPath);
  if (!relativePath) return null;

  const directoryPath = `${config.URL}/${relativePath}`;
  const cookies = getSignedCookies({
    url: `${directoryPath}/*`,
    keyPairId: config.KEY_PAIR_ID,
    privateKey: config.PRIVATE_KEY,
    dateLessThan: new Date(Date.now() + config.EXPIRATION_SECONDS * 1000).getDate(),
  });

  return [
    `CloudFront-Policy=${cookies['CloudFront-Policy']}; Path=/; Secure; HttpOnly`,
    `CloudFront-Signature=${cookies['CloudFront-Signature']}; Path=/; Secure; HttpOnly`,
    `CloudFront-Key-Pair-Id=${cookies['CloudFront-Key-Pair-Id']}; Path=/; Secure; HttpOnly`,
  ];
}