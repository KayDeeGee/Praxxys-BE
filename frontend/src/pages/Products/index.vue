<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

const { fetchWithCsrf, fetchPublic } = useApi()

const products = ref([])
const categories = ref([])
const loading = ref(true)
const error = ref(null)

const editDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const selectedProduct = ref(null)
const selectedCategory = ref(null)

const pagination = ref({
  current_page: 1,
  last_page: 1,
})

const editProduct = (product) => {
  selectedProduct.value = { ...product }
  editDialogVisible.value = true
}
const deleteProduct = (product) => {
  selectedProduct.value = product
  deleteDialogVisible.value = true
}

const confirmEdit = async () => {
  try {
    const res = await fetchWithCsrf(`/products/${selectedProduct.value.id}`, {
      method: 'PUT',
      body: JSON.stringify(selectedProduct.value),
    })
    console.log(res)
    loadProducts()
    editDialogVisible.value = false
  } catch (err) {
    console.error(err)
  }
}

const confirmDelete = async () => {
  try {
    const res = await fetchWithCsrf(`/products/${selectedProduct.value.id}`, {
      method: 'DELETE',
    })
    console.log(res)
    loadProducts()
    deleteDialogVisible.value = false
  } catch (err) {
    console.error(err)
  }
}

const loadProducts = async (page = 1) => {
  loading.value = true
  error.value = null
  try {
    const categoryQuery = selectedCategory.value && selectedCategory.value !== 'All' 
      ? `&category=${encodeURIComponent(selectedCategory.value)}`
      : ''

    const res = await fetchPublic(`/products?page=${page}${categoryQuery}`, {
      method: 'GET',
    })

    products.value = res.products.data
    categories.value = ['All', ...res.categories]
    console.log(res, 'wow')

    

    pagination.value = {
      current_page: res.products.current_page,
      last_page: res.products.last_page,
    }
  } catch (err) {
    error.value = err.message || 'Failed to load products'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProducts()
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Product Page</h1>

    <!-- Category Filter -->
    <div class="p-field">
      <Select
        v-model="selectedCategory"
        :options="categories"
        placeholder="Filter By Category"
        class="w-full md:w-14rem"
        @change="loadProducts(1)"
      />
    </div>
    <!-- Loading and Error States -->
    <ProgressSpinner v-if="loading" />
    <Message v-else-if="error" severity="error" :closable="false">{{ error }}</Message>

    <!-- Product Table -->
    <DataTable v-else :value="products" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
      <Column field="name" header="Name"></Column>
      <Column field="category" header="Category"></Column>
      <Column field="description" header="Description"></Column>
      <Column header="Actions">
        <template #body="{ data }">
          <Button label="Edit" @click="editProduct(data)" class="mr-2" />
          <Button label="Delete" severity="danger" @click="deleteProduct(data)" />
        </template>
      </Column>
      <template #paginatorcontainer>
        <div class="flex items-center gap-4 mt-4 justify-center">
          <Button
            icon="pi pi-chevron-left"
            rounded
            text
            :disabled="pagination.current_page === 1"
            @click="loadProducts(pagination.current_page - 1)"
          />

          <div class="text-color font-medium">
            <span>Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
          </div>

          <Button
            icon="pi pi-chevron-right"
            rounded
            text
            :disabled="pagination.current_page === pagination.last_page"
            @click="loadProducts(pagination.current_page + 1)"
          />
        </div>
      </template>
    </DataTable>

    <!-- Edit Modal -->
    <Dialog
      header="Edit Product"
      v-model:visible="editDialogVisible"
      :modal="true"
      :closable="true"
    >
      <div class="flex flex-col gap-3">
        <label>Name</label>
        <InputText v-model="selectedProduct.name" />

        <label>Category</label>
        <InputText v-model="selectedProduct.category" />

        <label>Description</label>
        <Textarea v-model="selectedProduct.description" rows="4" />
      </div>

      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          @click="editDialogVisible = false"
          class="p-button-text"
        />
        <Button label="Save" icon="pi pi-check" @click="confirmEdit" />
      </template>
    </Dialog>

    <!-- Delete Modal -->
    <Dialog
      header="Confirm Delete"
      v-model:visible="deleteDialogVisible"
      :modal="true"
      :closable="true"
    >
      <p>
        Are you sure you want to delete <strong>{{ selectedProduct?.name }}</strong
        >?
      </p>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          @click="deleteDialogVisible = false"
          class="p-button-text"
        />
        <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDelete" />
      </template>
    </Dialog>
  </div>
</template>
