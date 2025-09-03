<script setup>
import { onMounted, ref } from 'vue'
import { useApi } from '@/composables/useApi'
import { useRouter } from 'vue-router'

const { fetchWithCsrf, fetchPublic } = useApi()
const router = useRouter()

const form = ref({
  name: '',
  category: '',
  description: '',
  images: [],
  date: null,
})

const categories = ref([])
const errors = ref({})

function validateStep1(activateCallback) {
  errors.value = {}

  if (!form.value.name) errors.value.name = 'Name is required.'
  if (!form.value.category) errors.value.category = 'Category is required.'
  if (!form.value.description) errors.value.description = 'Description is required.'

  if (Object.keys(errors.value).length === 0) {
    activateCallback('2')
  }
}

function validateStep2(activateCallback) {
  errors.value = {}
  if (!form.value.images || form.value.images.length === 0) {
    errors.value.images = 'Please upload at least one image.'
  }

  if (Object.keys(errors.value).length === 0) {
    activateCallback('3')
  }
}

function onImageSelect(event) {
  form.value.images = [...event.files]
}

function onImageRemove(event) {
  form.value.images = form.value.images.filter((img) => img !== event.file)
}

function onImageClear() {
  form.value.images = []
}

const validateForm = () => {
  errors.value = {}

  if (!form.value.name) errors.value.name = 'Name is required.'
  if (!form.value.category) errors.value.category = 'Category is required.'
  if (!form.value.description) errors.value.description = 'Description is required.'
  if (!form.value.images.length) errors.value.images = 'Please upload at least one image'
  if (!form.value.date) errors.value.date = 'Date is required'

  return Object.keys(errors.value).length === 0
}

const resetForm = () => {
  form.value = {
    name: '',
    category: '',
    description: '',
    images: [],
    date: null,
  }
  errors.value = {}
}

const formatDateTime = (date) => {
    const dateObj = new Date(date)

      const formattedDate =
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

      return formattedDate
}

const submitForm = async () => {
  if (validateForm()) {
    try {
      const formData = new FormData()

      formData.append('name', form.value.name)
      formData.append('category', form.value.category)
      formData.append('description', form.value.description)
      formData.append('date', formatDateTime(form.value.date))

      form.value.images.forEach((file, index) => {
        formData.append(`images[${index}]`, file)
      })

      const response = await fetchWithCsrf('/products', {
        method: 'POST',
        body: formData,
      })

      resetForm()
      router.push('/products')
    } catch (error) {
      console.error('Submit error:', error)
    }
  } else {
    console.log('Validation failed', errors.value)
  }
}

onMounted(async () => {
  try {
    const response = await fetchPublic('/product-categories')
    console.log(response)
    categories.value = response
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Create Product</h1>

    <Stepper value="1" linear>
      <!-- Step headers -->
      <StepList>
        <Step value="1">Basic Info</Step>
        <Step value="2">Images</Step>
        <Step value="3">Date And Time</Step>
      </StepList>

      <StepPanels class="p-5">
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
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="() => validateStep1(activateCallback)"
            />
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
            <small v-if="errors.images" class="text-red-500">{{ errors.images }}</small>
            <small class="text-gray-500 italic">
              No need to click the upload button, and ignore the pending status. Selected images
              will be submitted with the form.
            </small>
          </div>

          <div class="flex justify-between mt-4">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="activateCallback('1')"
            />
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="() => validateStep2(activateCallback)"
            />
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
          </div>
          <small v-if="errors.date" class="text-red-500">{{ errors.date }}</small>
          <div class="flex justify-between mt-4">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="activateCallback('2')"
            />
            <Button label="Submit" icon="pi pi-check" @click="submitForm" />
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </div>
</template>
