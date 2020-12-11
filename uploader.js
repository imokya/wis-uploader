import config from './config.js'
import request from 'request-promise'
import FormData from 'form-data'

import fs from 'fs'


class Uploader {

  constructor() {
    this._init()
  }

  async _init() {
    console.log('序列图上传生成中....')
    const st = new Date().getTime()
    this.accessToken = await this._getAccessToken()
    await this._getLocalFiles()
    await this._uploadFiles()
    this._outputFile()
    const elapse = (new Date().getTime() - st) / 1000
    const total = this._uploadFiles.length
    console.log(`共${total}张图片 耗时: ${elapse}s`)
    console.log('序列图生成完毕!')
  }

  _outputFile() {
    let fos = '', values = ''
    const total = this._uploadFiles.length
    for(let i = 0; i < total; i++) {
      const url = this._uploadFiles[i]
      const offsetX = i * 1000
      const translateX = -(i+1) * 1000
      const suffix = i == total - 1 ? '' : ';'
      const value = `${translateX} 0;${translateX} 0${suffix}`  
      const fo = `
              <foreignObject x="${offsetX}" y="0" width="800" height="1100">
                <svg style="background-image:url(${url});background-size:100%;background-repeat:no-repeat;" viewBox="0 0 800 1100"></svg>
              </foreignObject>
            `
      fos += fo;
      values += value
    }
    const output = `
      <section style="overflow:hidden;margin:0 auto;">
        <svg viewBox="0 0 800 1100" style="width:100%;display:inline-block;">
          <g>
            <g>
              ${fos}
            </g>
            <animateTransform attributeName="transform" type="translate" values="${values}" restart="never" fill="freeze" dur="5s" calcMode="discrete" begin="click"></animateTransform>
          </g>
        </svg>
      </section>
    `

    let template = fs.readFileSync('template.html', {
      encoding: 'utf8'
    })
    template = template.replace('{placehoder}', output)
    fs.writeFileSync('index.html', template, {
      encoding: 'utf8'
    })
    
  }

  async _uploadFiles() {
    this._uploadFiles = []
    await this._uploadFile()
  }

  async _uploadFile() {
    const file = this.files.shift()
    const fileStream = fs.createReadStream(`img/${file}`)
    const url = await this._upload(this.accessToken, fileStream) 
    this._uploadFiles.push(url)
    if(this.files.length) {
      await this._uploadFile()
    }
  }

  _getLocalFiles() {
    this.files = fs.readdirSync('img')
    this.files.sort((a, b) => {
      return parseInt(a) - parseInt(b)
    })
  }

  async _upload(accessToken, file) {

    let form = {
      media: file
    }

    const url = `https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=${accessToken}`
    const res = await request({
      url: url,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      formData: form,
      json: true
    })
    return res.url
  }

  async _getAccessToken() {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appid}&secret=${config.secret}`
    const res = await request.get(url, {
      json: true
    })
    return res['access_token']
  }

}


export default Uploader

