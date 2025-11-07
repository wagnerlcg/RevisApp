# Guia de Ícones para RevisApp

## Ícones Necessários

Para que o app funcione corretamente tanto como PWA quanto APK Android, você precisa dos seguintes ícones:

### PWA (já configurados em public/icons/)
- `icon-192x192.png` - Ícone pequeno para PWA
- `icon-512x512.png` - Ícone grande para PWA e splash screen
- `apple-touch-icon.png` - Ícone para dispositivos iOS (180x180px)

### Android (pasta android/app/src/main/res/)
Os ícones Android seguem o padrão de adaptive icons e precisam estar nas seguintes pastas:

```
android/app/src/main/res/
├── mipmap-hdpi/
│   ├── ic_launcher.png (72x72)
│   └── ic_launcher_foreground.png (72x72)
├── mipmap-mdpi/
│   ├── ic_launcher.png (48x48)
│   └── ic_launcher_foreground.png (48x48)
├── mipmap-xhdpi/
│   ├── ic_launcher.png (96x96)
│   └── ic_launcher_foreground.png (96x96)
├── mipmap-xxhdpi/
│   ├── ic_launcher.png (144x144)
│   └── ic_launcher_foreground.png (144x144)
└── mipmap-xxxhdpi/
    ├── ic_launcher.png (192x192)
    └── ic_launcher_foreground.png (192x192)
```

## Como Gerar os Ícones

### Opção 1: Ferramenta Online (Recomendado)
Use ferramentas gratuitas como:
- [Icon Kitchen](https://icon.kitchen/) - Gera todos os tamanhos automaticamente
- [App Icon Generator](https://www.appicon.co/)
- [Capacitor Asset Generator](https://github.com/capacitor-community/assets)

### Opção 2: Usando @capacitor/assets (CLI)

1. Instale o pacote:
```bash
npm install -D @capacitor/assets
```

2. Crie uma imagem `icon.png` de pelo menos 1024x1024px na raiz do projeto

3. Crie uma imagem `splash.png` de 2732x2732px (opcional)

4. Execute:
```bash
npx capacitor-assets generate --iconBackgroundColor '#ffffff' --iconBackgroundColorDark '#000000' --splashBackgroundColor '#ffffff' --splashBackgroundColorDark '#000000'
```

### Opção 3: Manual usando ferramenta de imagem

Se você tiver uma imagem de alta resolução (1024x1024), pode redimensioná-la manualmente:

**Para PWA:**
- 192x192px → `public/icons/icon-192x192.png`
- 512x512px → `public/icons/icon-512x512.png`
- 180x180px → `public/icons/apple-touch-icon.png`

**Para Android:**
Use um editor como GIMP, Photoshop ou online tools para redimensionar para cada tamanho necessário.

## Adaptive Icons (Android)

Os adaptive icons do Android têm duas camadas:
- **Foreground**: O ícone principal (pode ter transparência)
- **Background**: Cor sólida ou imagem de fundo

O arquivo `android/app/src/main/res/values/ic_launcher_background.xml` define a cor de fundo:
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#FFFFFF</color>
</resources>
```

## Verificação

Após adicionar os ícones, verifique se estão corretos:

1. Para PWA: Acesse o site e use DevTools (Lighthouse) para verificar
2. Para Android: Build o app e instale no dispositivo/emulador

## Ícones Atuais

Se você ainda não tem ícones, comece criando pelo menos:
1. Um ícone principal de 1024x1024px com fundo transparente
2. Use uma ferramenta de geração automática para criar todos os tamanhos
