# 📦 Resources

- Generate presigned URLs for temporary access to an especific file.
- Generate Signed cookies for access to multiples files (ideal for streaming HLS).
- Configuration throght environment variables (.env).
- TypeScript & Node.js v20+.

## 🛠 Installation

### Prerequisites

- Node.js v20+
- npm or yarn
- AWS CloudFront access keys (Key Pair ID and Private Key)

### Step by step

Clone the repository:

```bash
git clone https://github.com/Flavio-Lucas/aws-cloudfront-sign.git
cd aws-cloudfront-sign
```

Install dependencies:

```bash
npm install
```

Configure the `.env` file:

```env
CLOUDFRONT_KEY_PAIR_ID=APKXXX
CLOUDFRONT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
CLOUDFRONT_URL=https://d123.cloudfront.net
CLOUDFRONT_EXPIRATION_SECONDS=14400 # 4 hours
```

## 🚀 How to use it

### Option 1: Local Execution (Recommended to development)

```bash
# Presigned URL (One file)
npx tsx src/cli.ts presigned-url "s3://<BucketName>/<ObjectKeyPrefix>/<ObjectKey>"

# Signed Cookies (all the files from a directory)
npx tsx src/cli.ts signed-cookies "s3://<BucketName>/<ObjectKeyPrefix>"
```

### Option 2: Global Installation

```bash
npm install -g .
aws-cloudfront-sign presigned-url "s3://<BucketName>/<ObjectKeyPrefix>/<ObjectKey>"
```
alias:
```bash
cfs presigned-url "s3://<BucketName>/<ObjectKeyPrefix>/<ObjectKey>"
```

## 📌 Exemplos

### Output for Presigned URL

```bash
https://d123.cloudfront.net/video-id/stream-h264.m3u8?Policy=...&Signature=...&Key-Pair-Id=...
```

### Output for Signed Cookies

```bash
CloudFront-Policy=...; Path=/; Secure; HttpOnly
CloudFront-Signature=...; Path=/; Secure; HttpOnly
CloudFront-Key-Pair-Id=...; Path=/; Secure; HttpOnly
```

## 🧩 Project structure

```
/aws-cloudfront-sign/
  ├── src/
  │   ├── cli.ts            # Main CLI
  │   ├── presigned-url.ts  # Logic for Presigned URLs
  │   ├── signed-cookies.ts # Logic for Presigned Cookies
  │   ├── types.ts          # Shared Types
  │   └── utils.ts          # Auxiliar functions
  ├── .env.example          # Model for configuration of '.env' file
  ├── tsconfig.json         # TypeScript configurations
  └── package.json          # Dependence and scripts
```

## ⚠️ Problem solving

### Erro: Invalid private key
Make sure the private key in `.env` uses `\n` for line breaks.

### Erro: require is not defined
Make sure:

- `package.json` contains `"type": "module"`.

### Command not found (global installation)
Add the global npm directory to your `PATH`:

```bash
npm config get prefix
```

## 📄 Feel free to fork this project

Feito com ❤️ e TypeScript.

## 🔗 Useful Links

- [AWS CloudFront Signed URLs Docs](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html)
- [Commander.js Documentation](https://github.com/tj/commander.js)

