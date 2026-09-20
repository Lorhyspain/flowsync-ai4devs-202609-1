#!/usr/bin/env node
// Hook PostToolUse (Write|Edit): formatea con Prettier el archivo recién escrito,
// pero solo si vive dentro de frontend/. El backend tiene su propio Prettier vía
// `npm run format`, y este hook no lo toca.
//
// Recibe el payload del hook como JSON por stdin. Va en Node y no en shell porque
// esta máquina no tiene jq y el hook tiene que funcionar igual en Windows y en POSIX.
// Sale siempre con código 0: un formateo fallido no debe romper la edición.

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
const frontendDir = path.join(projectDir, 'frontend')
const prettierBin = path.join(frontendDir, 'node_modules', 'prettier', 'bin', 'prettier.cjs')

function bail(message) {
  if (message) process.stdout.write(JSON.stringify({ systemMessage: message }))
  process.exit(0)
}

let payload
try {
  payload = JSON.parse(readFileSync(0, 'utf8'))
} catch {
  bail()
}

const filePath = payload?.tool_response?.filePath ?? payload?.tool_input?.file_path
if (!filePath) bail()

const absolute = path.resolve(projectDir, filePath)
const relative = path.relative(frontendDir, absolute)

// Fuera de frontend/, o dentro de sus dependencias: no es cosa nuestra.
if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) bail()
if (relative.split(path.sep)[0] === 'node_modules') bail()
if (!existsSync(absolute)) bail()

if (!existsSync(prettierBin)) {
  bail(
    'Prettier no está instalado en frontend/. Ejecuta `cd frontend && npm install` para que el hook de formateo funcione.'
  )
}

try {
  // --ignore-unknown: Prettier ignora en silencio las extensiones que no sabe formatear.
  execFileSync(process.execPath, [prettierBin, '--write', '--ignore-unknown', absolute], {
    cwd: frontendDir,
    stdio: 'ignore',
  })
} catch {
  bail()
}
