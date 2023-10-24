/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */

const { Client } = require('ssh2')

const compressing = require('compressing')
const path = require('path')
const format = require('date-fns/format')
const fs = require('fs')

const path_resolve = dir => path.join(__dirname, '..', dir)
const conn = new Client()

// 服务器账号
const TestServerInfo = {
  host: '116.80.45.190',
  username: 'centos',
  port: 22,
  privateKey: '',
}
const ProductionServerInfo = {
  host: '164.70.94.68',
  username: 'centos',
  port: 22,
  privateKey: '',
}
let server = ''
let key_path = ''

const TestKeyPath = path.normalize('C:/work/webarena/ssh/ge_inspection.ppk')
const ProductionKeyPath = path.normalize('C:/work/webarena/ssh/greenearth_honban.ppk')
const mode = process.argv.slice(2)[0]
console.log(mode)
if (mode === 'test') {
  // upload to inspection server
  console.log('准备上传到验证服务器')
  key_path = TestKeyPath
  server = TestServerInfo
} else {
  // upload to publish server
  console.log('准备发布到生产环境')
  key_path = ProductionKeyPath
  server = ProductionServerInfo
}
try {
  server.privateKey = fs.readFileSync(key_path, 'utf8')
  console.log('read key success')
} catch (e) {
  console.log(e)
  console.log('ssh key 读取失败！')
}

// 上传到服务器的地址
const remotePath = '/home/centos/'

const publishPath = '/var/www/html/frontend/' // 本番環境

// const publishPath = '/var/www/syanai.greenearth-bandou.com/html/frontend/' // 検証環境

// 本地压缩文件地址
const date = new Date()

// const localPath = 'dist.tar'

const localPath = `${format(date, 'yyMMdd_HHmm')}.zip`

// 连接服务器
async function Connect() {
  return new Promise((resolve, reject) => {
    conn.on('ready', () => {
      console.log('服务器连接成功')
      resolve(conn)
    }).on('error', err => {
      console.log('服务器连接失败')
      reject(err)
    }).on('end', () => {
      console.log('服务器连接关闭')
    }).on('close', had_error => {
    })
      .connect(server)
  })
}

// 执行shell脚本
async function Shell(c, cmd) {
  return new Promise((resolve, reject) => {
    c.exec(cmd, (err, stream) => {
      if (err) {
        console.log(err)
        throw err
      }
      stream.on('close', () => {
        resolve(c)
      }).on('data', data => {

      }).stderr.on('data', data => {
        console.log(cmd, 'shell执行失败')
      })
    })
  })
}

// 上传新文件
function UploadFile(c) {
  console.log('开始上传')

  return new Promise((resolve, reject) => {
    c.sftp((err, sftp) => {
      if (err) {
        reject(err)
      } else {
        sftp.fastPut(localPath, remotePath + localPath, (err, result) => {
          if (err) {
            console.log('上传失败')
            reject(err)
          }
          resolve(c)
        })
      }
    })
  })
}

// 压缩dist目录文件
function compress() {
  return new Promise((resolve, reject) => {
    compressing.zip.compressDir(path.join(__dirname, 'dist/'), localPath)
      .then(() => {
        resolve(true)
        console.log(localPath, '压缩成功')
      })
      .catch(err => {
        reject(err)
        console.error(err)
      })
  })
}

// 启动
(async function start() {
  // console.log(path.join(__dirname, 'dist/'))

  // 压缩文件
  await compress()

  // 获取连接对象
  const c = await Connect()

  // 删除旧文件
  // await Shell(c, `rm -rf ${remotePath + localPath}`)

  // // 上传压缩文件
  await UploadFile(c)

  // 删除本地压缩文件
  console.log('删除本地文件', localPath)
  fs.unlinkSync(localPath)

  // // 清空服务器上文件ls
  await Shell(c, `rm -rf ${publishPath}*`)

  const shellList = [
    // `cd ${remotePath}\n`,
    `unzip -o -d  ${publishPath}  ${remotePath}${localPath}\n `,
    `cd ${publishPath}dist/ \n `,
    `mv ${publishPath}dist/*  ${publishPath}\n `,

    // 'mv * ../ \n',
    `mv ${publishPath}htaccess  ${publishPath}.htaccess \n `,

  ]
  await Shell(c, shellList.join(''))
  c.end()
}())
