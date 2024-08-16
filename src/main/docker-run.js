import { spawn } from 'child_process'

class Docker {
  constructor(python, poetry) {
    this.python = python
    this.poetry = poetry
    this.cmd = this.command()
  }

  command() {
    return [
      'run',
      '-v',
      '/Users/nickmoreton/Sites/afc-wagtail:/app',
      '-w',
      '/app',
      `python:${this.python}`,
      'bash',
      '-c',
      `pip install poetry==${this.poetry} && poetry export --without-hashes`
    ]
  }

  run() {
    const out = []
    const ls = spawn('docker', this.cmd)

    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
      out.push(data)
    })

    ls.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`)
      out.push(data)
    })

    ls.on('close', (code) => {
      console.log(`child process exited with code ${code}`)
      console.log(out.join(''))
    })
  }
}

export default Docker

/**
 * const out = []
    const { spawn } = require('node:child_process')
    // const ls = spawn('ls', ['-lh', '/usr'])
    const ls = spawn('docker', [
      'run',
      '-v',
      '/Users/nickmoreton/Sites/afc-wagtail:/app',
      '-w',
      '/app',
      `python:${python}`,
      'bash',
      '-c',
      `pip install poetry==${poetry} && poetry export --without-hashes`
    ])

    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
      out.push(data)
    })

    ls.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`)
      out.push(data)
    })

    ls.on('close', (code) => {
      console.log(`child process exited with code ${code}`)
      console.log(out.join(''))
    })
    */
