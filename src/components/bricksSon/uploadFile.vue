<template>
  <div class="uploadImage">
    <div id="upload-house-photos">
      <ul class="img-box clearfix">
        <template v-for="(image, index) in images">
          <li v-if="image.status === 'available'">
            <img :src="image.imgPath" alt="">
            <p class="del-msk" @click.stop="delImage(index)"><i class="del-img"></i></p>
            <p class="cover" :class="{loading: image.state < 3}"></p>
            <span v-if="image.state != 9" class="notice trans" :class="{success: image.state===3, error: image.state===4}">
                {{uploadState[image.state]}}
              </span>
          </li>
        </template>
        <!--<div class="upload-area" v-if="pathList.length < options.maxLength">-->
        <div class="upload-area" v-if="imgCount < options.maxLength">
          <input v-if="newInput"
            type="file"
            class="profileinfopanel-upload"
            @change="uploadAvatar($event)"
            ref="inpute"
            name="uploadFile"
            accept="image/*"
            v-bind="{multiple: !isAndroid}"
          />
          <p class="upload-notice" :class="{'overMaxLength': overMaxLength}">上传图片已超过{{options.maxLength}}张，无法上传</p>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
  import EXIF from 'exif-js'
  import { isAndroid } from '../../assets/js/config'
  export default {
    name: 'uploadFile',
    data () {
      return {
        options: {
          isBase64: false, // 上传给后台的数据默认base64，false是上传的Blob
          maxLength: 6, // 最大上传数量
          url: '', // 上传的接口链接
          compressWidth: 900, // 压缩到指定宽度压缩
          maxsize: 100 * 1024, // 小于1M的不进行压缩
          sendData: { // 图片上传所需的文件名，文件夹名，id，uploadData为图片压缩吐出来的base64
            fileName: '123', // 文件名
            folder: 'report', // 文件夹名字
            id: '3213'
//            uploadData: ''
          }
        },
        uploadKey: 'uploadData',
        formData: '',
        isAndroid,
        images: [], // 图片预览数组
        pathList: [], // 后台返回图片数组
        photo: '',
        newInput: true,
        orientation: '',
        uploadState: {0: '图片读取中', 1: '图片处理中', 2: '图片上传中', 3: '上传成功', 4: '上传失败'},
        imgCount: 0,
        overMaxLength: false
      }
    },
//    props: ['options'],
    watch: {
      pathList () {
        let data = this.pathList
        console.log(data)
        let array = Object.keys(data).map(key => data[key]['filePath'])
        this.photo = array.join(',')
      },
      photo (val) {
        this.$emit('uploads-change', val)
      }
    },
    created () {},
    mounted () {
      let send = this.options.sendData
      let formData = new FormData()
      for (let k in send) {
        formData.append(k, send[k])
      }
      this.formData = formData
    },
    methods: {
      delImage (i) {
        let images = this.images
        // 屏蔽选择删除的图片
        images[i].status = 'forbidden'
//        images.splice(i, 1)
        // 删除后台返回的图片路径数组
        let pathList = this.pathList
        this.imgCount --
        this.overMaxLength = false
        for (let k = 0; k < pathList.length; k++) {
          if (images[i].dataMark === pathList[k].dataMark) {
            pathList.splice(k, 1)
          }
        }
      },
      uploadMoreImages (everyMark, uploadIdx) {
        let myVue = this
//        console.log(UPLOAD_BASE_PORT)
        myVue.images[uploadIdx].state = 2
        // 此处为模拟上传成功start
        setTimeout(function () {
          myVue.images[uploadIdx].state = 3
        }, 2000)
        setTimeout(function () {
          myVue.images[uploadIdx].state = 9
        }, 4000)
        // 此处为模拟上传成功end
//        this.post({
//          url: this.options.url,
//          sendData: this.options.sendData,
//          success (data) {
//            myVue.images[uploadIdx].state = 3
//            myVue.pathList.push({dataMark: everyMark, filePath: data.filePath})
//            setTimeout(function () {
//              myVue.images[uploadIdx].state = 9
//            }, 2000)
//          },
//          failed () {
//            myVue.images[uploadIdx].state = 4
//          },
//          error (x, h, r) {
//            myVue.images[uploadIdx].state = 4
//          }
//        })
      },
      uploadAvatar ($event) {
        let myVue = this
        this.newInput = false
        setTimeout(s => {
          myVue.newInput = true
        }, 10)
        let selfFiles = $event.target.files
        let currentCount = this.pathList.length
        let maxLength = this.options.maxLength
        console.log(myVue.imgCount)
        if (selfFiles.length > maxLength || (selfFiles.length + currentCount) > maxLength) {
          this.overMaxLength = true
          console.log('上传图片已超过' + maxLength + '张，无法上传')
          return
        }
        if (selfFiles.length > maxLength || (myVue.imgCount + selfFiles.length) > maxLength) {
          this.overMaxLength = true
          console.log('上传图片已超过' + maxLength + '张，无法上传')
          return
        }
        for (let i = 0; i < selfFiles.length; i++) {
//          用于标记要删除的图片
          myVue.imgCount ++
          let everyMark = new Date().getTime() + 'm' + i
          let reader = new FileReader()
//          {0: '图片读取中', 1: '图片处理中', 2: '图片上传中', 3: '上传成功', 4: '上传失败'}
          let uploadState = 0
          let item = {dataMark: everyMark, imgPath: '', status: 'available', state: uploadState}
          myVue.images.push(item)
          let itemIdx = myVue.images.indexOf(item)
          reader.readAsDataURL(selfFiles[i])
          reader.onload = function () {
            let result = this.result
            let img = new Image()
            img.src = result
            img.onload = function () {
              item.state = 1
              let imgWidth = img.naturalWidth
              let imgHeight = img.naturalHeight
              let scale = imgWidth / imgHeight  // 用于判断图片的胖瘦，且是图片的缩放比例因数
              if (result.length < myVue.options.maxsize) { // 小于1M的不进行压缩
                myVue.denominateFileName(scale, ['bold', 'light'])
                if (!myVue.options.isBase64) {
                  let blob = myVue.dataURLtoBlob(result)
                  let url = URL.createObjectURL(blob)
                  myVue.options.sendData.uploadData = blob
                  item.imgPath = url
                } else {
                  myVue.options.sendData.uploadData = result
                  item.imgPath = result
                }
                myVue.uploadMoreImages(everyMark, itemIdx)
              } else {
                EXIF.getData(this, function () {
                  myVue.orientation = EXIF.getTag(this, 'Orientation')
                })
                let newBase64 = myVue.compressImage(img, myVue.options.compressWidth, scale)
                if (!myVue.options.isBase64) {
                  let blob = myVue.dataURLtoBlob(newBase64)
                  myVue.formData.append(myVue.uploadKey, blob)
                  let url = URL.createObjectURL(blob)
                  myVue.options.sendData = myVue.formData
                  item.imgPath = url
                } else {
                  myVue.options.sendData.uploadData = newBase64
                  item.imgPath = newBase64
                }
                myVue.uploadMoreImages(everyMark, itemIdx)
              }
            }
          }
        }
      },
      dataURLtoBlob (dataUrl) {
        let arr = dataUrl.split(',')
        let mime = arr[0].match(/:(.*?);/)[1]
        let bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], {type: mime})
      },
      denominateFileName (scale, arr) {
        if (!scale) {
          alert('请传入比例值')
          return false
        }
        let flag = arr instanceof Array
        if (!flag) {
          alert('参数格式错误')
          return false
        }
//        根据图片的比例和翻转信息决定图片的胖瘦命名
        if (scale > 1) {
          this.options.sendData.fileName = arr[0] + '_H5_' + this.options.folder + '_' + new Date().getTime()
        } else if (scale < 1) {
          this.options.sendData.fileName = arr[1] + '_H5_' + this.options.folder + '_' + new Date().getTime()
        } else {
          // 正常的图片
          this.options.sendData.fileName = 'normal_H5_' + this.options.folder + '_' + new Date().getTime()
        }
      },
      compressImage (img, compressWidth, scale) {
        // 处理f翻转
        let self = this
        self.canvas = document.createElement('canvas')
        self.ctx = self.canvas.getContext('2d')
        let ctxImgHeight
        if (self.orientation === 8) {
          ctxImgHeight = compressWidth * scale
          self.canvas.width = compressWidth
          self.canvas.height = ctxImgHeight
          self.ctx.clearRect(0, 0, ctxImgHeight, compressWidth)
          self.ctx.fillStyle = '#fff'
          self.ctx.fillRect(0, 0, ctxImgHeight, compressWidth)
          self.ctx.rotate(270 * Math.PI / 180)
          self.ctx.drawImage(img, 0, 0, -ctxImgHeight, compressWidth)
          self.denominateFileName(scale, ['light', 'bold'])
        } else if (self.orientation === 6) {
          ctxImgHeight = compressWidth * scale
          self.canvas.width = compressWidth
          self.canvas.height = ctxImgHeight
          self.ctx.clearRect(0, 0, ctxImgHeight, compressWidth)
          self.ctx.fillStyle = '#fff'
          self.ctx.fillRect(0, 0, ctxImgHeight, compressWidth)
          self.ctx.rotate(90 * Math.PI / 180)
          self.ctx.drawImage(img, 0, 0, ctxImgHeight, -compressWidth)
          self.denominateFileName(scale, ['light', 'bold'])
        } else if (self.orientation === 3) {
          ctxImgHeight = compressWidth / scale
          self.canvas.width = compressWidth
          self.canvas.height = ctxImgHeight
          self.ctx.clearRect(0, 0, compressWidth, ctxImgHeight)
          self.ctx.fillStyle = '#fff'
          self.ctx.fillRect(0, 0, compressWidth, ctxImgHeight)
          self.ctx.rotate(180 * Math.PI / 180)
          self.ctx.drawImage(img, 0, 0, -compressWidth, -ctxImgHeight)
          self.denominateFileName(scale, ['bold', 'light'])
        } else {
          ctxImgHeight = compressWidth / scale
          self.canvas.width = compressWidth
          self.canvas.height = ctxImgHeight
          self.ctx.clearRect(0, 0, compressWidth, ctxImgHeight)
          self.ctx.fillStyle = '#fff'
          self.ctx.fillRect(0, 0, compressWidth, ctxImgHeight)
          self.ctx.drawImage(img, 0, 0, compressWidth, ctxImgHeight)
          self.denominateFileName(scale, ['bold', 'light'])
        }
        var base64 = self.canvas.toDataURL('image/jpeg', 0.98)
        return base64
      }
    }
  }
</script>

<style scoped>
  .upload-area{
    width:calc(33.3% - .1rem - .1rem/3 );
    width:-webkit-calc(33.3% - .1rem - .1rem/3 );
    width:-moz-calc(33.3% - .1rem - .1rem/3 );
    height: 2.2rem;
    margin: 0 0 .2rem 0.1rem;
    background: url('../../assets/img/upload-add.png') no-repeat center center;
    -webkit-background-size: 100% 100%;
    background-size: 100% 100%;
    overflow:hidden;
    position: relative;
    float: left;
  }
  .upload-area input {
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0
  }
  .upload-area .upload-notice {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: #ff5658;
    display: none;
    font-size: .3rem;
    padding:.1rem 0;
  }
  .upload-area .overMaxLength{
    display: block;
  }
  .img-box>li>img{
    width:100%;
    height: 100%;
  }
  .img-box>li .del-img {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    width: 40%;
    height: 1.1rem;
    background: url(../../assets/img/del-img-list-d96484099c.png) center center no-repeat;
    z-index: 9999
  }
  .img-box>li>.cover,.img-box>li>.del-msk {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0
  }
  .img-box>li>.cover {
    left: 0;
    z-index: 999;
    background: url(../../assets/img/loading.gif) center center no-repeat rgba(0,0,0,.45);
    -webkit-background-size: contain;
    background-size: contain;
    display:none;
  }
  .img-box>li>.del-msk {
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
    background-color: rgba(0,0,0,.3);
    right: -120%
  }
  .img-box>li>.notice {
    position: absolute;
    width: auto;
    bottom: 0;
    left: 50%;
    opacity: 1;
    -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    background: #ff5658;
    z-index: 999;
    -ms-word-break: keep-all;
    -moz-word-break: keep-all;
    -o-word-break: keep-all;
    -webkit-word-break: keep-all;
    word-break: keep-all;
    padding: 2px .1rem;
    cursor: pointer;
  }
  .img-box>li>.notice.success {
    background-color: #1ab394;
    display: block;
  }
  .img-box>li>.notice.error {
    background-color: #ff5658;
    display: block;
  }
  .img-box>li:hover .del-msk {
    right: 0
  }
  #upload-house-photos{
    height: auto;
    width:100%;
    background: #fff;
    margin:0;
  }
  .img-box{
    padding-top:.4rem;
  }
  .img-box > li{
    width:calc(33.3% - .1rem - .1rem/3 );
    width:-webkit-calc(33.3% - .1rem - .1rem/3 );
    width:-moz-calc(33.3% - .1rem - .1rem/3 );
    height: 2.2rem;
    margin: 0 0 .2rem .1rem;
    overflow: hidden;
    float: left;
    position: relative;
  }
  .img-box > li .notice{
    width:100%;
    text-align: center;
    font-size: .2rem;
  }
  .img-box > li .del-img{
    width:48%;
  }
  .img-box>li>.loading{
    display: block;
  }
  .hide{
    display: none;
  }
</style>
