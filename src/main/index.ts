import express from "express"
import cors from "cors"
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

//Configuración
const serverApp = express()
const PORT = 3000

serverApp.use(cors({
  origin: '*', // Permitir cualquier origen
  methods: '*', // Permitir cualquier método
  allowedHeaders: '*', // Permitir cualquier header
}));

serverApp.use(express.json());

//Ruta para hacer el fetch
serverApp.post('/api/generate', async (req, res) => {
  const { prompt, model } = req.body

  try {
    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt, model,
        stream: true
      })
    })

    if (!response.ok) {
      res.status(response.status).json({ error: 'Error en la respuesta del servidor remoto' });
    }

    res.setHeader('Content-Type', 'text/plain');
    // Transfiere el contenido del stream de la respuesta al cliente
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    // Función para leer y enviar los datos
    const readStream = async () => {
      while (true) {
        const { done, value } = await reader?.read();
        if (done) break; // Termina si no hay más datos

        const chunk = decoder.decode(value, { stream: true });
        console.log(chunk)
        res.write(chunk); // Envía el chunk al cliente
      }
      res.end(); // Finaliza la respuesta
    };

    await readStream()

  } catch (e) {
    res.json({e})
  }


});


//Abrir el servidor en el puerto
serverApp.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
