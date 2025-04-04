import { getSignedCookies } from '@aws-sdk/cloudfront-signer';
import { CloudFrontConfig } from './types';
import { extractRelativePath } from './utils';

export function generateSignedCookies(
  outputPath: string,
  config: CloudFrontConfig
): string[] | null {
  const relativePath = extractRelativePath(outputPath);
  if (!relativePath) return null;

  // Correção 1: Usar a URL base do CloudFront diretamente
  const baseUrl = config.URL;

  // Correção 2: Construir o caminho relativo corretamente formatado
  const resourcePath = `/${relativePath.replace(/^\/|\/$/g, '')}/*`;

  console.log(baseUrl, resourcePath);

  const cookies = getSignedCookies({
    url: baseUrl,
    keyPairId: config.KEY_PAIR_ID,
    privateKey: config.PRIVATE_KEY,
    policy: JSON.stringify({
      Statement: [{
        Resource: resourcePath,
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