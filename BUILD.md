# 🚀 Guia de Build - RevisApp

Este guia contém instruções completas para gerar tanto o **PWA** quanto o **APK Android** do RevisApp.

---

## 📋 Pré-requisitos

### Para PWA
- Node.js 20.19+ ou 22.12+
- npm ou yarn

### Para APK Android
Além dos requisitos do PWA:
- **Java JDK 17** (recomendado) ou JDK 11+
  - Baixe em: https://adoptium.net/
  - Configure `JAVA_HOME` nas variáveis de ambiente
- **Android Studio** (recomendado) ou **Android SDK Command-line Tools**
  - Baixe em: https://developer.android.com/studio
  - Durante instalação, marque "Android SDK" e "Android SDK Platform"
- **Gradle** (incluído com Android Studio)

### Verificar instalação:
```bash
# Verificar Node
node --version

# Verificar Java
java -version

# Verificar Android SDK (após instalar Android Studio)
# Windows:
$env:ANDROID_HOME

# Deve mostrar caminho como: C:\Users\SeuUsuario\AppData\Local\Android\Sdk
```

---

## 🌐 Gerar PWA (Progressive Web App)

### 1. Instalar dependências
```bash
npm install
```

### 2. Verificar configurações PWA

O projeto já está configurado com:
- ✅ `vite-plugin-pwa` instalado
- ✅ Service Worker configurado
- ✅ Manifest.json completo
- ✅ Ícones nas resoluções necessárias

### 3. Build do PWA
```bash
npm run build
```

Isso irá:
- Compilar o projeto TypeScript/React
- Gerar o Service Worker automaticamente
- Otimizar assets
- Criar a pasta `dist/` com todos os arquivos prontos

### 4. Testar localmente
```bash
npm run preview
```

Acesse `http://localhost:4173` e teste:
- Abra DevTools → Application → Service Workers (deve estar ativo)
- Abra DevTools → Application → Manifest (verifique informações)
- Use Lighthouse para audit PWA (deve ter score alto)

### 5. Deploy do PWA

Você pode fazer deploy em:

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Firebase Hosting:**
```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

**Servidor próprio:**
- Copie todo conteúdo da pasta `dist/` para seu servidor web
- Configure HTTPS (obrigatório para PWA)
- Configure headers para cache do Service Worker

### 6. Instalar PWA no dispositivo

Após deploy:
- **Desktop:** Clique no ícone de instalação na barra de endereços
- **Android:** Chrome → Menu → "Adicionar à tela inicial"
- **iOS:** Safari → Compartilhar → "Adicionar à Tela de Início"

---

## 📱 Gerar APK Android

### 1. Preparar o projeto

```bash
# Instalar dependências
npm install

# Build da aplicação web
npm run build
```

### 2. Sincronizar com Capacitor

```bash
npx cap sync android
```

Isso irá:
- Copiar arquivos da pasta `dist/` para o projeto Android
- Atualizar plugins nativos
- Preparar o projeto para build

### 3. Adicionar ícones (se ainda não tiver)

Veja o arquivo `ICONS.md` para instruções detalhadas sobre como gerar ícones.

Opção rápida:
```bash
# Instalar gerador de assets
npm install -D @capacitor/assets

# Coloque um arquivo icon.png (1024x1024) na raiz e execute:
npx capacitor-assets generate
```

### 4. Abrir no Android Studio

```bash
npx cap open android
```

Isso abrirá o Android Studio com o projeto.

### 5. Configurar para Release (Produção)

#### Opção A: Build via Android Studio (Recomendado para primeira vez)

1. No Android Studio: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Aguarde o build concluir
3. Clique em "locate" na notificação para encontrar o APK
4. APK estará em: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Opção B: Build via linha de comando

```bash
# Navegue até a pasta android
cd android

# Build APK Debug
.\gradlew assembleDebug

# Build APK Release (não assinado)
.\gradlew assembleRelease
```

APK será gerado em:
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

### 6. Gerar APK Assinado (Para Google Play Store)

Para publicar na Play Store, você precisa assinar o APK:

#### 6.1. Criar Keystore

```bash
keytool -genkey -v -keystore revisapp-release.keystore -alias revisapp -keyalg RSA -keysize 2048 -validity 10000
```

Preencha as informações solicitadas e guarde a senha em local seguro!

#### 6.2. Configurar signing no Android

Crie o arquivo `android/key.properties`:
```properties
storePassword=SUA_SENHA_AQUI
keyPassword=SUA_SENHA_AQUI
keyAlias=revisapp
storeFile=../revisapp-release.keystore
```

⚠️ **Importante:** Adicione `key.properties` ao `.gitignore`!

#### 6.3. Editar `android/app/build.gradle`

Adicione antes de `android {`:
```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Dentro de `android { }`, adicione:
```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
        storePassword keystoreProperties['storePassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

#### 6.4. Build Release Assinado

```bash
cd android
.\gradlew assembleRelease
```

APK assinado estará em: `android/app/build/outputs/apk/release/app-release.apk`

### 7. Instalar APK no dispositivo

**Via USB:**
```bash
# Habilite "Depuração USB" no dispositivo Android
# Conecte o dispositivo via USB

# Instale o APK
npx cap run android
```

**Manualmente:**
- Copie o APK para o dispositivo
- Abra o arquivo APK no dispositivo
- Permita "Instalar de fontes desconhecidas" se solicitado
- Instale o app

### 8. Testar no emulador

```bash
# Inicie o emulador pelo Android Studio ou via:
emulator -avd Nome_Do_Emulador

# Execute o app
npx cap run android
```

---

## 🔧 Comandos Úteis

### Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### Capacitor
```bash
# Sincronizar mudanças com plataformas nativas
npx cap sync

# Atualizar apenas Android
npx cap sync android

# Abrir projeto Android no Android Studio
npx cap open android

# Adicionar plugin
npm install @capacitor/[plugin-name]
npx cap sync
```

### Android
```bash
# Limpar build anterior
cd android
.\gradlew clean

# Build debug
.\gradlew assembleDebug

# Build release
.\gradlew assembleRelease

# Listar dispositivos conectados
adb devices

# Instalar APK via ADB
adb install caminho/para/app.apk

# Ver logs do dispositivo
adb logcat
```

---

## 📝 Checklist de Build

### PWA
- [ ] Código atualizado e testado
- [ ] `npm run build` executado com sucesso
- [ ] Service Worker funcionando (testar offline)
- [ ] Manifest correto (verificar no DevTools)
- [ ] Ícones presentes em todos os tamanhos
- [ ] Lighthouse score > 90 para PWA
- [ ] Deploy realizado
- [ ] HTTPS configurado
- [ ] Testado instalação em dispositivo

### APK Android
- [ ] Java JDK instalado e configurado
- [ ] Android SDK instalado
- [ ] `npm run build` executado
- [ ] `npx cap sync android` executado
- [ ] Ícones Android gerados
- [ ] Projeto abre sem erros no Android Studio
- [ ] APK gerado com sucesso
- [ ] APK testado em dispositivo/emulador
- [ ] (Para produção) Keystore criado e configurado
- [ ] (Para produção) APK assinado gerado

---

## ⚠️ Troubleshooting

### PWA não instala
- Verifique se está usando HTTPS
- Verifique se Service Worker está registrado
- Confirme que manifest.json está acessível
- Use Lighthouse para identificar problemas

### Erro ao sincronizar Capacitor
```bash
# Limpe e reinstale
rm -rf node_modules package-lock.json
npm install
npx cap sync
```

### Android Studio não abre projeto
- Verifique se JAVA_HOME está configurado
- Verifique se Android SDK está instalado
- Tente: File → Invalidate Caches / Restart

### Erro de build Android
```bash
# Limpe o projeto
cd android
.\gradlew clean
cd ..
npx cap sync android
```

### APK não instala no dispositivo
- Verifique se "Fontes desconhecidas" está habilitado
- Verifique se não há outra versão do app instalada com assinatura diferente
- Para debug: `adb install -r caminho/app.apk` (reinstala forçado)

---

## 📚 Recursos Adicionais

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Android Developer Guide](https://developer.android.com/guide)
- [PWA Builder](https://www.pwabuilder.com/)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)

---

## 🎯 Próximos Passos

1. **Para PWA:** Configure analytics, notificações push, e otimize performance
2. **Para Android:** Configure splash screen customizada, ícones adaptive, e publique na Play Store
3. **iOS:** Adicione suporte iOS com `npx cap add ios` (requer macOS)

---

**Dúvidas?** Consulte a documentação oficial ou abra uma issue no repositório.
