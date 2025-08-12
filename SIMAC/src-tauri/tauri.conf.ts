export default {
  build: {
    beforeBuildCommand: "npm run build",
    beforeDevCommand: "npm run dev",
    devPath: "http://localhost:1420",
    distDir: "dist"
  },
  package: {
    productName: "simac",
    version: "0.1.0"
  },
  tauri: {
    windows: [
      {
        title: "Sistema de Control de Mantenimiento Coboce",
        width: 1400,
        height: 900,
        resizable: false,
        fullscreen: false,
        center: true
      }
    ],
    security: {
      csp: null
    },
    allowlist: {
      shell: {
        all: true,
        scope: ["node", "../../backend"]
      }
    },
    systemTray: {
      iconPath: "icons/icon.png"
    },
    updater: {
      active: false
    },
    embeddedServer: {
      active: true,
      window: true
    },
    bundle: {
      active: true,
      targets: ["msi"],
      identifier: "com.simac.app",
      resources: ["../backend/**/*"] // Copia todo el backend a la app empaquetada
    },
    identifier: "BelenGonzalezGalvez"
  },
  plugins: {
    fs: {
      enabled: true
    },
    shell: { }
  }
};
