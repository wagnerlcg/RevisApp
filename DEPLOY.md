# 🌐 Guia de Deploy - RevisApp PWA

Este guia mostra as formas mais simples de publicar seu PWA na web.

---

## 🚀 Opções de Deploy (do mais fácil ao mais complexo)

### 1️⃣ Vercel (Recomendado - Mais Fácil) ⭐

**Por que escolher:**
- ✅ Deploy em 2 minutos
- ✅ HTTPS automático
- ✅ Deploy automático a cada commit (GitHub)
- ✅ Gratuito para projetos pessoais
- ✅ Performance excelente (CDN global)

**Passo a passo:**

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Fazer login (abrirá o navegador)
vercel login

# 3. Deploy! (na pasta do projeto)
vercel
```

Responda as perguntas:
- Set up and deploy? → **Yes**
- Which scope? → Escolha sua conta
- Link to existing project? → **No**
- What's your project's name? → **revisapp** (ou deixe padrão)
- In which directory is your code located? → **./** (enter)
- Want to override the settings? → **No**

Pronto! Sua URL será algo como: `https://revisapp-xxxx.vercel.app`

**Deploy automático com GitHub:**
1. Suba o código para GitHub
2. Acesse https://vercel.com
3. Clique em "Import Project"
4. Conecte seu repositório
5. Vercel detecta automaticamente as configurações
6. Clique em "Deploy"

A cada push no GitHub, deploy automático acontece! 🎉

---

### 2️⃣ Netlify (Muito Fácil)

**Por que escolher:**
- ✅ Interface visual simples
- ✅ HTTPS automático
- ✅ Deploy por drag & drop
- ✅ Formulários integrados
- ✅ Gratuito

**Opção A - Via CLI:**

```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Build do projeto
npm run build

# 3. Login
netlify login

# 4. Deploy
netlify deploy --prod
```

Siga as instruções:
- Create & configure a new site? → **Yes**
- Team: Escolha sua conta
- Site name: **revisapp** (ou deixe gerar)
- Publish directory: **dist**

**Opção B - Drag & Drop (Sem instalar nada):**

1. Build local: `npm run build`
2. Acesse: https://app.netlify.com/drop
3. Arraste a pasta `dist/` para a área de upload
4. Pronto! URL gerada instantaneamente

**Deploy automático com GitHub:**
1. Acesse https://app.netlify.com
2. Clique "Add new site" → "Import an existing project"
3. Conecte GitHub e escolha o repositório
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy!

---

### 3️⃣ GitHub Pages (Gratuito, requer GitHub)

**Por que escolher:**
- ✅ Totalmente gratuito
- ✅ Integrado ao GitHub
- ✅ Bom para projetos open source

**Passo a passo:**

```bash
# 1. Instalar gh-pages
npm install -D gh-pages

# 2. Adicionar script ao package.json (já vou fazer isso)
# "deploy:gh": "npm run build && gh-pages -d dist"

# 3. Deploy
npm run deploy:gh
```

Configure no GitHub:
1. Repositório → Settings → Pages
2. Source: **gh-pages branch**
3. URL será: `https://seu-usuario.github.io/revisapp`

**⚠️ Importante para SPA (React Router):**
Se usar rotas, adicione arquivo `public/404.html` redirecionando para `index.html`.

---

### 4️⃣ Firebase Hosting (Google)

**Por que escolher:**
- ✅ Infraestrutura do Google
- ✅ CDN global
- ✅ Integração com outros serviços Firebase
- ✅ Gratuito (plano Spark)

**Passo a passo:**

```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Inicializar projeto
firebase init hosting

# Respostas:
# - Use existing project ou create new
# - Public directory: dist
# - Single-page app: Yes
# - Set up automatic builds with GitHub: No (por enquanto)
# - Overwrite index.html: No

# 4. Build
npm run build

# 5. Deploy
firebase deploy --only hosting
```

URL será algo como: `https://revisapp-xxxxx.web.app`

---

### 5️⃣ Cloudflare Pages (Alternativa moderna)

**Por que escolher:**
- ✅ CDN super rápida
- ✅ Deploy automático com Git
- ✅ Gratuito e ilimitado
- ✅ Analytics inclusos

**Passo a passo:**

1. Acesse: https://pages.cloudflare.com
2. Conecte repositório GitHub/GitLab
3. Configure build:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Deploy!

---

## 🎯 Qual escolher?

| Serviço | Facilidade | Performance | Recomendado para |
|---------|-----------|-------------|------------------|
| **Vercel** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **Deploy rápido, melhor opção geral** |
| **Netlify** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Interface visual, drag & drop |
| **GitHub Pages** | ⭐⭐⭐ | ⭐⭐⭐ | Projetos open source, grátis |
| **Firebase** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Integração com Firebase services |
| **Cloudflare** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Melhor CDN, analytics |

**Minha recomendação: 🏆 Vercel** - Deploy mais rápido e simples!

---

## ⚙️ Configurações Importantes

### Variáveis de Ambiente

Se você usar API keys (como Gemini), configure-as no serviço de deploy:

**Vercel:**
```bash
vercel env add GEMINI_API_KEY
```
Ou no dashboard: Settings → Environment Variables

**Netlify:**
Site settings → Build & deploy → Environment variables

**Firebase:**
```bash
firebase functions:config:set gemini.key="SUA_KEY"
```

### Base Path (se não usar domínio raiz)

Se o site não for na raiz (ex: `usuario.github.io/revisapp`), configure em `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/revisapp/', // nome do repositório
  // ... resto da config
})
```

---

## 🔒 HTTPS Obrigatório para PWA

Todos os serviços acima fornecem HTTPS automaticamente. Isso é **obrigatório** para:
- Service Workers funcionarem
- PWA ser instalável
- APIs modernas (geolocalização, câmera, etc.)

---

## 📊 Verificar Deploy

Após deploy, teste:

1. **Acesse a URL** gerada
2. **Abra DevTools** (F12)
3. **Application → Service Workers** - deve estar ativo
4. **Application → Manifest** - verifique informações
5. **Lighthouse** (DevTools) - rode audit PWA
6. **Teste instalação** - botão na barra de endereço

---

## 🚨 Troubleshooting

### Service Worker não funciona
- Verifique se está usando HTTPS
- Limpe cache do navegador (Ctrl+Shift+Delete)
- Veja console para erros

### Build falha no deploy
- Verifique Node version no serviço (deve ser 20.19+)
- Confira se `npm run build` funciona localmente
- Veja logs de build no dashboard do serviço

### PWA não instala
- Service Worker deve estar registrado
- Manifest.json deve estar acessível
- Use Lighthouse para verificar requisitos

---

## 🎨 Domínio Customizado (Opcional)

Todos os serviços permitem usar domínio próprio:

**Exemplo Vercel:**
1. Compre domínio (ex: Namecheap, GoDaddy)
2. Vercel → Settings → Domains
3. Adicione seu domínio
4. Configure DNS no registrador (Vercel mostra instruções)

---

## 🔄 Workflow Recomendado

Para desenvolvimento profissional:

1. **Desenvolvimento:** `npm run dev` (local)
2. **Preview:** Push para branch → Preview deploy automático
3. **Produção:** Merge para main → Deploy automático

Configurável em Vercel/Netlify automaticamente!

---

## 📝 Checklist Pré-Deploy

- [ ] `npm run build` funciona sem erros
- [ ] Testado localmente com `npm run preview`
- [ ] Variáveis de ambiente configuradas
- [ ] Ícones PWA presentes
- [ ] Service Worker funcionando
- [ ] Lighthouse score > 90 (PWA)
- [ ] Testado em diferentes navegadores
- [ ] SEO básico configurado (meta tags)

---

## 📚 Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [GitHub Pages](https://pages.github.com/)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)

---

**Dica:** Comece com Vercel para deploy rápido. Se precisar de mais controle depois, migre para Firebase ou Cloudflare.

**Boa sorte com o deploy! 🚀**
