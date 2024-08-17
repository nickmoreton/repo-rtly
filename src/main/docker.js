import { spawn } from 'child_process'
import path from 'path'

class Docker {
  constructor(python, poetry, folder) {
    this.python = `python:${python}`
    this.poetry = `${poetry}`
    this.folder = `${folder}`
  }

  run() {
    // const out = []
    // const ls = spawn('docker', ['run', '-t', '--rm', ''])
  }

  build() {
    const out = []
    const ls = spawn('docker', [
      'build',
      '--build-arg',
      `PYTHON_VERSION=${this.python}`,
      '--build-arg',
      `POETRY_VERSION=${this.poetry}`,
      '--build-arg',
      `REPO_PATH=${this.folder}`,
      '-t',
      'repo-rtly',
      '-f',
      path.resolve(path.resolve(__dirname, '../..'), 'src/main/Dockerfile.base'),
      `${this.folder}`
    ])

    ls.stdout.on('data', (data) => {
      console.log(`${data}`)
      out.push(data)
    })

    ls.stderr.on('data', (data) => {
      console.error(`${data}`)
      out.push(data)
    })

    ls.on('close', (code) => {
      console.log(`${code}`)
      console.log(out.join(''))
    })
  }
}

export default Docker
