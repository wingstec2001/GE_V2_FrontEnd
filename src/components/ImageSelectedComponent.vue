<template>
  <div>
    <v-row>
      <v-col
        style="text-align:right"
        cols="12"
        md="3"
      >
        <file-upload
          ref="upload"
          style="width:100%"
          :multiple="true"
          @input-filter="inputFilter"
        >
          <v-btn
            color="#BDBDBD"
            width="100%"
            outlined
          >
            <v-icon>{{ icons.mdiPlus }}</v-icon>
          </v-btn>
        </file-upload>
      </v-col>
    </v-row>
    <v-row id="imgList">
      <v-col
        v-if="fileUrls.length === 0"
        style="height:100px"
      ></v-col>
      <v-col
        v-for="url in fileUrls"
        :key="url"
        cols="4"
        md="2"
      >
        <v-hover draggable="true">
          <template v-slot:default="{ hover }">
            <v-card height="100px">
              <v-img
                :src="url"
                height="100px"
                contain
              ></v-img>
              <v-fade-transition>
                <v-overlay
                  v-if="hover"
                  absolute
                >
                  <v-btn
                    drak
                    icon
                    color="#ffffff"
                    @click="openImagePreview(url)"
                  >
                    <v-icon>{{ icons.mdiMagnifyPlusOutline }}</v-icon>
                  </v-btn>
                  <v-btn
                    drak
                    icon
                    color="#ffffff"
                    @click.prevent="remove(url)"
                  >
                    <v-icon>{{ icons.mdiTrashCanOutline }}</v-icon>
                  </v-btn>
                </v-overlay>
              </v-fade-transition>
            </v-card>
          </template>
        </v-hover>
      </v-col>
    </v-row>
    <image-preview
      ref="imagePreview"
      :url="previewUrl"
    ></image-preview>
  </div>
</template>

<script>
import {
  mdiPlus,
  mdiTrashCanOutline,
  mdiMagnifyPlusOutline,
} from '@mdi/js'
import FileUpload from 'vue-upload-component'
import Sortable from 'sortablejs'
import ImagePreview from './ImagePreviewComponent.vue'

export default {
  components: {
    FileUpload,
    ImagePreview,
  },
  model: {
    prop: 'fileList',
    event: 'change',
  },
  props: ['fileList'],
  data: () => ({
    icons: {
      mdiPlus,
      mdiTrashCanOutline,
      mdiMagnifyPlusOutline,
    },
    files: [],
    fileUrls: [],
    imageFiles: [],
    previewUrl: '',
  }),
  watch: {
    fileList(newValue) {
      if (this.fileUrls.length === 0 && newValue.length !== 0) {
        this.fileUrls = [...newValue]
        this.imageFiles = [...newValue]
      }
    },
    imageFiles(newV) {
      this.$emit('change', newV)
    },

  },
  mounted() {
    this.sortImageList()
  },
  methods: {
    initData() {
      this.fileUrls = this.fileList
      this.files = this.fileList
    },
    inputFilter(newFile) {
      this.imageFiles.push(newFile.file)
      this.fileUrls.push(URL.createObjectURL(newFile.file))
    },
    remove(url) {
      const index = this.fileUrls.indexOf(url)
      this.fileUrls.splice(index, 1)
      this.imageFiles.splice(index, 1)
    },
    openImagePreview(url) {
      this.previewUrl = url
      this.$refs.imagePreview.openDailog()
    },
    sortImageList() {
      const el = document.getElementById('imgList')
      Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        sort: true,
        filter: '.ignore',
        animation: 150,
        group: {
          name: 'imgList',
          pull: false,
          put: false,
        },
        setData(dataTransfer, dragEl) {
          dataTransfer.setData('Text', dragEl.textContent)
        },
        onEnd: evt => {
          const item = this.imageFiles[evt.oldIndex]
          this.imageFiles.splice(evt.oldIndex, 1)
          this.imageFiles.splice(evt.newIndex, 0, item)

          const URLitem = this.fileUrls[evt.oldIndex]
          this.fileUrls.splice(evt.oldIndex, 1)
          this.fileUrls.splice(evt.newIndex, 0, URLitem)
        },

      })
    },
  },
}
</script>
