import { createServer } from 'net'
import { spawn, execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const electronViteBin = resolve(__dirname, '..', 'node_modules', '.bin', 'electron-vite')

function getRandomPort() {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.listen(0, () => {
      const port = server.address().port
      server.close(() => resolve(port))
    })
    server.on('error', reject)
  })
}

function killExisting() {
  try {
    execSync('pkill -f "electron-vite dev" 2>/dev/null', { stdio: 'ignore' })
  } catch {}
}

async function main() {
  killExisting()
  await new Promise(r => setTimeout(r, 600))

  const port = await getRandomPort()
  console.log(`\n  Starting dev server on random port: ${port}\n`)

  const proc = spawn(electronViteBin, ['dev'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      VITE_DEV_SERVER_PORT: String(port)
    }
  })

  proc.on('exit', (code) => process.exit(code ?? 0))
  proc.on('error', (err) => {
    console.error('Failed to start:', err)
    process.exit(1)
  })
}

main()
