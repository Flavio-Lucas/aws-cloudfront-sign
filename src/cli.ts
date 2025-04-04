import 'dotenv/config';
import { Command } from 'commander';
import { CloudFrontConfig } from './types';
import { generatePresignedUrl } from './presigned-url';
import { generateSignedCookies } from './signed-cookies';

const program = new Command();

const CLOUDFRONT_CONFIG: CloudFrontConfig = {
  KEY_PAIR_ID: process.env.CLOUDFRONT_KEY_PAIR_ID!,
  PRIVATE_KEY: process.env.CLOUDFRONT_PRIVATE_KEY!,
  URL: process.env.CLOUDFRONT_URL!,
  EXPIRATION_SECONDS: 60 * 60 * 4, // 4 horas
};

// Main CLI configuration
program
  .name('aws-cloudfront-sign')
  .alias('cfs')
  .description('CLI para gerar URLs assinadas ou cookies do CloudFront')
  .version('1.0.0')
  .addHelpText('after', `

Exemplos de uso:
  $ cfs presigned-url "s3://meu-bucket/output/video-id/"
  $ cfs signed-cookies "s3://meu-bucket/output/video-id/"

Configuração necessária:
  Crie um arquivo .env com:
  CLOUDFRONT_KEY_PAIR_ID=APKXXX
  CLOUDFRONT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
  CLOUDFRONT_URL=https://d123.cloudfront.net
  `);

// Prsigned URL command
program
  .command('presigned-url <outputPath>')
  .description('Gera uma URL temporária para um arquivo específico')
  .addHelpText('after', `
Exemplo:
  $ cfs presigned-url "s3://<BucketName>/<ObjectKeyPrefix>/<ObjectKey>"

Saída:
  https://d123.cloudfront.net/output/video-id/stream.m3u8?Policy=...`)
  .action((outputPath) => {
    const url = generatePresignedUrl(outputPath, CLOUDFRONT_CONFIG);
    console.log(url);
  });

// Signed cookies command
program
  .command('signed-cookies <outputPath>')
  .description('Gera cookies para acesso a múltiplos arquivos (ideal para HLS)')
  .addHelpText('after', `
Exemplo:
  $ cfs signed-cookies "s3://<BucketName>/<ObjectKeyPrefix>/<ObjectKey>"

Saída:
  CloudFront-Policy=...; Path=/; Secure; HttpOnly
  CloudFront-Signature=...; Path=/; Secure; HttpOnly
  CloudFront-Key-Pair-Id=...; Path=/; Secure; HttpOnly`)
  .action((outputPath) => {
    const cookies = generateSignedCookies(outputPath, CLOUDFRONT_CONFIG);
    if (cookies) {
      console.log('Cookies for aws auth:');
      cookies.forEach(cookie => console.log(cookie));
    } else {
      console.log('Error while generating cookies.');
    }
  });

// Command to show help
program
  .command('help')
  .description('Exibe ajuda detalhada')
  .action(() => program.help());

program.parse(process.argv);

// Shows help if no command is provided
if (!process.argv.slice(2).length) {
  program.help();
}