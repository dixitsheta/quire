import { createServer } from 'net'
import { spawn, execSync } from 'child_process'

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

  const proc = spawn('npx', ['electron-vite', 'dev', '--port', String(port)], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env
    }
  })

  proc.on('exit', (code) => process.exit(code ?? 0))
  proc.on('error', (err) => {
    console.error('Failed to start:', err)
    process.exit(1)
  })
}

main()
