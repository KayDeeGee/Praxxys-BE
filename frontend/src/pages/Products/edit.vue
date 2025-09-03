<script setup>
import { onMounted, ref } from 'vue'
import { useApi } from '@/composables/useApi'
import { useRouter, useRoute } from 'vue-router'

const { fetchWithCsrf, fetchPublic } = useApi()
const router = useRouter()
const route = useRoute() 
const id = route.params.id

const form = ref({
  name: '',
  category: '',
  description: '',
  images: [],
  existingImages: [],
  date: null,
})
const categories = ref([])
const errors = ref({})

function validateStep1(activateCallback) {
  errors.value = {}
  if (!form.value.name) errors.value.name = 'Name is required.'
  if (!form.value.category) errors.value.category = 'Category is required.'
  if (!form.value.description) errors.value.description = 'Description is required.'
  if (Object.keys(errors.value).length === 0) activateCallback('2')
}

function validateStep2(activateCallback) {
  errors.value = {}
  if (!form.value.images.length && !form.value.existingImages.length) {
    errors.value.images = 'Please upload at least one image.'
  }
  if (Object.keys(errors.value).length === 0) activateCallback('3')
}

function onImageSelect(event) {
  form.value.images = [...form.value.images, ...event.files]
}
function onImageRemove(event) {
  form.value.images = form.value.images.filter((img) => img !== event.file)
}
function onImageClear() {
  form.value.images = []
}
function removeExistingImage(url) {
  form.value.existingImages = form.value.existingImages.filter(img => img !== url)
}

const validateForm = () => {
  errors.value = {}
  if (!form.value.name) errors.value.name = 'Name is required.'
  if (!form.value.category) errors.value.category = 'Category is required.'
  if (!form.value.description) errors.value.description = 'Description is required.'
  if (!form.value.images.length && !form.value.existingImages.length) errors.value.images = 'Please upload at least one image'
  if (!form.value.date) errors.value.date = 'Date is required'
  return Object.keys(errors.value).length === 0
}

const formatDateTime = (date) => {
  const dateObj = new Date(date)
  return (
    dateObj.getFullYear() +
    '-' +
    String(dateObj.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(dateObj.getDate()).padStart(2, '0') +
    ' ' +
    String(dateObj.getHours()).padStart(2, '0') +
    ':' +
    String(dateObj.getMinutes()).padStart(2, '0') +
    ':' +
    String(dateObj.getSeconds()).padStart(2, '0')
  )
}

const submitForm = async () => {
  if (!validateForm()) return
  try {
    const formData = new FormData()
    formData.append('_method', 'PUT'); 
    formData.append('name', form.value.name)
    formData.append('category', form.value.category)
    formData.append('description', form.value.description)
    formData.append('date', formatDateTime(form.value.date))

    form.value.images.forEach((file, index) => {
      formData.append(`images[${index}]`, file)
    })

    form.value.existingImages.forEach((url) => {
      formData.append('existing_images[]', url)
    })

    await fetchWithCsrf(`/products/${id}`, {method: 'POST', body: formData })
    router.push('/products')
  } catch (error) {
    console.error('Update error:', error)
  }
}

onMounted(async () => {
  try {
    const categoriesRes = await fetchPublic('/product-categories')
    categories.value = categoriesRes

    const productRes = await fetchPublic(`/products/${id}`)
    form.value.name = productRes.name
    form.value.category = productRes.category
    form.value.description = productRes.description
    form.value.date = new Date(productRes.date)
    form.value.existingImages = productRes.images || []
  } catch (error) {
    console.error('Failed to fetch product data:', error)
  }
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Edit Product</h1>

    <Stepper value="1" linear>
      <StepList>
        <Step value="1">Basic Info</Step>
        <Step value="2">Images</Step>
        <Step value="3">Date And Time</Step>
      </StepList>

      <StepPanels>
        <!-- STEP 1 -->
        <StepPanel v-slot="{ activateCallback }" value="1">
          <div class="flex flex-col gap-4">
            <InputText v-model="form.name" placeholder="Product Name" />
            <small v-if="errors.name" class="text-red-500">{{ errors.name }}</small>
            <Select v-model="form.category" :options="categories" placeholder="Select Category" />
            <small v-if="errors.category" class="text-red-500">{{ errors.category }}</small>
            <Editor v-model="form.description" editorStyle="height:200px" />
            <small v-if="errors.description" class="text-red-500">{{ errors.description }}</small>
          </div>

          <div class="flex justify-end mt-4">
            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="() => validateStep1(activateCallback)" />
          </div>
        </StepPanel>

        <!-- STEP 2 -->
        <StepPanel v-slot="{ activateCallback }" value="2">
          <div class="flex flex-col gap-4">
            <FileUpload
              mode="advanced"
              customUpload
              :multiple="true"
              accept="image/*"
              :maxFileSize="2000000"
              @select="onImageSelect"
              @remove="onImageRemove"
              @clear="onImageClear"
              :auto="false"
            >
              <template #empty>
                <span>Drag and drop images here or click to browse.</span>
              </template>
            </FileUpload>
            <div class="flex gap-2 mt-2">
              <div
                v-for="img in form.existingImages"
                :key="img"
                class="relative"
              >
                <img :src="`http://localhost:8000/storage/${img}`"  class="w-20 h-20 object-cover rounded" />
                <Button
                  icon="pi pi-times"
                  class="absolute top-0 right-0 p-1 text-red-600"
                  @click="() => removeExistingImage(img)"
                />
              </div>
            </div>
            <small v-if="errors.images" class="text-red-500">{{ errors.images }}</small>
          </div>

          <div class="flex justify-between mt-4">
            <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('1')" />
            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="() => validateStep2(activateCallback)" />
          </div>
        </StepPanel>

        <!-- STEP 3 -->
        <StepPanel v-slot="{ activateCallback }" value="3">
          <div class="flex flex-col gap-4">
            <DatePicker
              v-model="form.date"
              showIcon
              showTime
              hourFormat="24"
              dateFormat="yy-mm-dd"
              :manualInput="false"
            />
            <small v-if="errors.date" class="text-red-500">{{ errors.date }}</small>
          </div>

          <div class="flex justify-between mt-4">
            <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('2')" />
            <Button label="Submit" icon="pi pi-check" @click="submitForm" />
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </div>
</template>
