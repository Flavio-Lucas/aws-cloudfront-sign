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

program
  .name('aws-cloudfront-sign')
  .alias('cfs')
  .description('CLI para gerar URLs assinadas ou cookies do CloudFront')
  .version('1.0.0');

// Comando para presigned URL
program
  .command('presigned-url <outputPath>')
  .description('Gera uma presigned URL para um arquivo HLS')
  .action((outputPath) => {
    const url = generatePresignedUrl(outputPath, CLOUDFRONT_CONFIG);
    console.log('Presigned URL:', url || 'Erro ao gerar URL');
  });

// Comando para signed cookies
program
  .command('signed-cookies <outputPath>')
  .description('Gera cookies assinados para streaming HLS')
  .action((outputPath) => {
    const cookies = generateSignedCookies(outputPath, CLOUDFRONT_CONFIG);
    if (cookies) {
      console.log('Cookies para autenticação:');
      cookies.forEach(cookie => console.log(cookie));
    } else {
      console.log('Erro ao gerar cookies');
    }
  });

program.parse(process.argv);