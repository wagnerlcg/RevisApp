<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# RevisApp - Agendamento de Revisão

Aplicativo para agendamento de revisões de veículos, disponível como PWA e APK Android.

View your app in AI Studio: https://ai.studio/apps/drive/1GBdIQvdmBd9z_p0QTxGODxZyGzkHyRDj

## 🚀 Comandos Rápidos

### Desenvolvimento
```bash
npm install          # Instalar dependências
npm run dev         # Iniciar servidor de desenvolvimento
```

### Build PWA
```bash
npm run build:pwa   # Build e preview do PWA
```

### Build APK Android
```bash
npm run build:android   # Build e abrir no Android Studio
```

### Sincronizar com plataformas nativas
```bash
npm run sync        # Sincronizar todas as plataformas
npm run sync:android # Sincronizar apenas Android
```

## 📚 Documentação Completa

- **[BUILD.md](BUILD.md)** - Guia completo de build para PWA e APK
- **[ICONS.md](ICONS.md)** - Instruções para gerar ícones

## ⚙️ Configuração

**Prerequisites:** Node.js 20.19+ ou 22.12+

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure o `GEMINI_API_KEY` em [.env.local](.env.local)

3. Execute o app:
   ```bash
   npm run dev
   ```

## 🌐 PWA (Progressive Web App)

O projeto está configurado com:
- ✅ Service Worker automático
- ✅ Manifest completo
- ✅ Suporte offline
- ✅ Instalável em qualquer dispositivo

## 📱 Android

Plataforma Android configurada com Capacitor:
- ✅ Build para APK
- ✅ Acesso a recursos nativos
- ✅ Pronto para Google Play Store

## 🛠️ Tecnologias

- React + TypeScript
- Vite
- Capacitor
- PWA (vite-plugin-pwa)
- Gemini AI

