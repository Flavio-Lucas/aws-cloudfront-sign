import 'dotenv/config';
import { Command } from 'commander';
import { CloudFrontConfig } from './types';
import { generatePresignedUrl } from './presigned-url';
import { generateSignedCookies } from './signed-cookies';

const program = new Command();

if (!process.env.CLOUDFRONT_KEY_PAIR_ID || !process.env.CLOUDFRONT_PRIVATE_KEY || !process.env.CLOUDFRONT_URL || !process.env.CLOUDFRONT_EXPIRATION_SECONDS) {
  console.error('Missing required environment variables: CLOUDFRONT_KEY_PAIR_ID, CLOUDFRONT_PRIVATE_KEY, CLOUDFRONT_URL or CLOUDFRONT_EXPIRATION_SECONDS');
  process.exit(1);
}

const CLOUDFRONT_CONFIG: CloudFrontConfig = {
  KEY_PAIR_ID: process.env.CLOUDFRONT_KEY_PAIR_ID,
  PRIVATE_KEY: process.env.CLOUDFRONT_PRIVATE_KEY,
  URL: process.env.CLOUDFRONT_URL,
  EXPIRATION_SECONDS: +process.env.CLOUDFRONT_EXPIRATION_SECONDS, // 4 hours
};

// Main CLI configuration
program
  .name('aws-cloudfront-sign')
  .alias('cfs')
  .description('CLI to generate presigned URLs or cookies for CloudFront')
  .version('1.0.0')
  .addHelpText('after', `

Use case exemple:
  $ cfs presigned-url "s3://meu-bucket/output/video-id/"
  $ cfs signed-cookies "s3://meu-bucket/output/video-id/"

Needed configuration:
  Create a .env file with:
  CLOUDFRONT_KEY_PAIR_ID=APKXXX
  CLOUDFRONT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
  CLOUDFRONT_URL=https://d123.cloudfront.net
  `);

// Prsigned URL command
program
  .command('presigned-url <outputPath>')
  .description('Generate a temporary URL to an especific file')
  .addHelpText('after', `
Exemple:
  $ cfs presigned-url "s3://<BucketName>/<ObjectKeyPrefix>/<ObjectKey>"

Output:
  https://d123.cloudfront.net/output/video-id/stream.m3u8?Policy=...`)
  .action((outputPath) => {
    const url = generatePresignedUrl(outputPath, CLOUDFRONT_CONFIG);
    console.log(url);
  });

// Signed cookies command
program
  .command('signed-cookies <outputPath>')
  .description('Generate cookies for access to mutiple files (ideal for HLS files)')
  .addHelpText('after', `
Exemple:
  $ cfs signed-cookies "s3://<BucketName>/<ObjectKeyPrefix>/<ObjectKey>"

Output:
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
  .description('Shows help information')
  .action(() => program.help());

program.parse(process.argv);

// Shows help if no command is provided
if (!process.argv.slice(2).length) {
  program.help();
}