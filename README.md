# 📦 Recursos

- Gera presigned URLs para acesso temporário a arquivos específicos.
- Cria signed cookies para acesso a múltiplos arquivos (ideal para streaming HLS).
- Configuração via variáveis de ambiente (.env).
- Suporte a TypeScript e Node.js v20+.

## 🛠 Instalação

### Pré-requisitos

- Node.js v20+
- npm ou yarn
- Chaves de acesso AWS CloudFront (Key Pair ID e Private Key)

### Passo a Passo

Clone o repositório:

```bash
git clone https://github.com/Flavio-Lucas/aws-cloudfront-sign.git
cd aws-cloudfront-sign
```

Instale as dependências:

```bash
npm install
```

Configure o arquivo `.env`:

```env
CLOUDFRONT_KEY_PAIR_ID=APKXXX
CLOUDFRONT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
CLOUDFRONT_URL=https://d123.cloudfront.net
AWS_MEDIA_CONVERT_OUTPUT_BUCKET=your-bucket
```

## 🚀 Como Usar

### Opção 1: Execução Local (Recomendado para desenvolvimento)

```bash
# Presigned URL (um arquivo)
npx ts-node src/cli.ts presigned-url "s3://your-bucket/output/video-id/"

# Signed Cookies (todos os arquivos do diretório)
npx ts-node src/cli.ts signed-cookies "s3://your-bucket/output/video-id/"
```

### Opção 2: Instalação Global

```bash
npm install -g .
aws-cloudfront-sign presigned-url "s3://your-bucket/output/video-id/"
```

## 📌 Exemplos

### Saída de Presigned URL

```bash
https://d123.cloudfront.net/output/video-id/stream-h264.m3u8?Policy=...&Signature=...&Key-Pair-Id=...
```

### Saída de Signed Cookies

```bash
CloudFront-Policy=...; Path=/; Secure; HttpOnly
CloudFront-Signature=...; Path=/; Secure; HttpOnly
CloudFront-Key-Pair-Id=...; Path=/; Secure; HttpOnly
```

## 🧩 Estrutura do Projeto

```
/aws-cloudfront-sign/
  ├── src/
  │   ├── cli.ts            # CLI principal
  │   ├── presigned-url.ts  # Lógica de URLs assinadas
  │   ├── signed-cookies.ts # Lógica de cookies assinados
  │   ├── types.ts          # Tipos compartilhados
  │   └── utils.ts          # Funções auxiliares
  ├── .env.example          # Modelo de configuração
  ├── tsconfig.json         # Configuração do TypeScript
  └── package.json          # Dependências e scripts
```

## ⚠️ Solução de Problemas

### Erro: Invalid private key
Verifique se a chave privada no `.env` usa `\n` para quebras de linha.

### Erro: require is not defined
Certifique-se de que:

- O `package.json` contém `"type": "module"`.
- Os imports usam extensão `.js` (ex.: `./types.js`).

### Comando não encontrado (instalação global)
Adicione o diretório global do npm ao `PATH`:

```bash
npm config get prefix
```

## 🤝 Contribuição

Contribuições são bem-vindas! Siga os passos:

1. Faça um fork do projeto.
2. Crie uma branch (`git checkout -b feature/foo`).
3. Commit suas alterações (`git commit -m 'Add foo'`).
4. Push para a branch (`git push origin feature/foo`).
5. Abra um Pull Request.

## 📄 Licença

MIT © [Seu Nome]

Feito com ❤️ e TypeScript.

## 🔗 Links Úteis

- [AWS CloudFront Signed URLs Docs](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html)
- [Commander.js Documentation](https://github.com/tj/commander.js)

