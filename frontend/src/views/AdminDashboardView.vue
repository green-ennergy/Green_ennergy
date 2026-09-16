<template>
  <!-- <div class="admin-page" v-if="user"> -->
  <div class="admin-page">
    <div class="admin-layout animate-fade-in">
      <aside class="admin-sidebar">
        <div class="sidebar-brand">
          <router-link to="/" class="brand-link">
            <div class="brand-icon"><AdminIcon name="bolt" :size="18" /></div>
            <div>
              <span class="brand-title">ENERGY AGENCY</span>
              <span class="brand-sub">{{ t('admin.console') }}</span>
            </div>
          </router-link>
        </div>

        <nav class="sidebar-nav">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="nav-btn"
            :class="{ active: activeTab === tab.id }"
            @click="switchTab(tab.id)"
          >
            <span class="nav-icon"><AdminIcon :name="tab.icon" :size="18" /></span>
            <span>{{ tab.label }}</span>
            <span v-if="tab.badge" class="nav-badge">{{ tab.badge }}</span>
          </button>
        </nav>

        <div class="sidebar-footer">
          <div class="sidebar-profile">
            <div class="profile-avatar" aria-hidden="true">
              {{ userInitials }}
            </div>
            <div class="profile-meta">
              <span class="admin-name">{{ user?.name || 'Admin' }}</span>
              <span class="admin-role">{{ user?.email || t('admin.console') }}</span>
            </div>
          </div>
          <button type="button" @click="handleLogout" class="logout-btn">
            {{ t('common.signOut') }}
          </button>
        </div>
      </aside>

      <main class="admin-main">
        <!-- Overview -->
        <section v-if="activeTab === 'overview'" class="panel">
          <header class="panel-header">
            <div>
              <h1>{{ t('admin.overview.title') }}</h1>
              <p>{{ t('admin.overview.subtitle') }}</p>
            </div>
            <button class="refresh-btn" @click="loadOverview" :disabled="isLoading">{{ t('common.refresh') }}</button>
          </header>

          <div class="kpi-grid" v-if="stats">
            <div class="kpi-card" v-for="kpi in kpiCards" :key="kpi.label">
              <span class="kpi-value">{{ kpi.value }}</span>
              <span class="kpi-label">{{ kpi.label }}</span>
            </div>
          </div>

          <div class="insights-grid" v-if="stats?.insights?.length">
            <article
              v-for="(insight, i) in stats.insights"
              :key="i"
              class="insight-card"
              :class="`insight-${insight.type}`"
            >
              <h3>{{ insight.title }}</h3>
              <p>{{ insight.message }}</p>
              <button
                v-if="insight.action && insight.action !== 'overview'"
                class="insight-action"
                @click="switchTab(insight.action)"
              >
                {{ t('common.takeAction') }}
              </button>
            </article>
          </div>

          <div class="split-grid" v-if="stats">
            <div class="data-card">
              <h3>{{ t('admin.overview.visits') }}</h3>
              <p class="visit-stat">{{ t('admin.overview.visitsStat', { week: stats.visit_stats?.week || 0, today: stats.totals?.visits_today || 0 }) }}</p>
              <ul class="rank-list" v-if="stats.visit_stats?.top_pages?.length">
                <li v-for="page in stats.visit_stats.top_pages" :key="page.path">
                  <span>{{ page.path }}</span>
                  <strong>{{ page.hits }}</strong>
                </li>
              </ul>
              <p v-else class="empty-note">{{ t('admin.overviewExtra.noPageData') }}</p>
            </div>

            <div class="data-card">
              <h3>{{ t('admin.overviewExtra.lowInterest') }}</h3>
              <ul class="rank-list" v-if="stats.low_interest_products?.length">
                <li v-for="item in stats.low_interest_products" :key="item.id">
                  <span>{{ item.title }}</span>
                  <strong>{{ item.rfq_demand || 0 }} RFQ</strong>
                </li>
              </ul>
              <p v-else class="empty-note">{{ t('admin.overviewExtra.noCatalogData') }}</p>
            </div>

            <div class="data-card">
              <h3>{{ t('admin.overview.topProducts') }}</h3>
              <ul class="rank-list" v-if="stats.top_products?.length">
                <li v-for="item in stats.top_products" :key="item.product_id">
                  <span>{{ item.product?.title || t('admin.overviewExtra.unknownProduct') }}</span>
                  <strong>{{ item.total_qty }} {{ t('admin.overviewExtra.units') }}</strong>
                </li>
              </ul>
              <p v-else class="empty-note">{{ t('admin.overviewExtra.noRfqDemand') }}</p>
            </div>

            <div class="data-card">
              <h3>{{ t('admin.overviewExtra.recentRfqs') }}</h3>
              <ul class="recent-list" v-if="stats.recent_rfqs?.length">
                <li v-for="rfq in stats.recent_rfqs" :key="rfq.id">
                  <div>
                    <strong>{{ rfq.ticket_number }}</strong>
                    <small>{{ rfq.company_name }}</small>
                  </div>
                  <span class="status-pill" :class="rfq.status">{{ rfqStatusLabel(rfq.status) }}</span>
                </li>
              </ul>
              <p v-else class="empty-note">{{ t('admin.overviewExtra.noRfqsYet') }}</p>
            </div>
          </div>
        </section>

        <!-- Orders / RFQ -->
        <section v-if="activeTab === 'orders'" class="panel">
          <header class="panel-header">
            <div>
              <h1>{{ t('admin.orders.title') }}</h1>
              <p>{{ t('admin.orders.subtitle') }}</p>
            </div>
            <select v-model="rfqFilter" @change="loadOrders" class="filter-select">
              <option value="">{{ t('admin.filters.allStatuses') }}</option>
              <option value="review">{{ t('admin.filters.review') }}</option>
              <option value="engineering">{{ t('admin.filters.engineering') }}</option>
              <option value="issued">{{ t('admin.filters.issued') }}</option>
              <option value="dispatched">{{ t('admin.filters.dispatched') }}</option>
            </select>
          </header>

          <div v-if="!rfqs.length && !isLoading" class="empty-state">
            <p>{{ t('admin.orders.empty') }}</p>
          </div>

          <div v-else class="rfq-list">
            <article v-for="rfq in rfqs" :key="rfq.id" class="rfq-card">
              <div class="rfq-card-top">
                <div>
                  <span class="rfq-id">{{ rfq.ticket_number }}</span>
                  <h3>{{ rfq.company_name }}</h3>
                  <p>{{ rfq.email }}<span v-if="rfq.user?.phone"> · {{ rfq.user.phone }}</span></p>
                  <small>{{ formatDate(rfq.created_at) }}</small>
                </div>
                <select
                  class="status-select"
                  :value="rfq.status"
                  @change="handleRfqStatusChange(rfq, $event.target.value)"
                >
                  <option value="review">{{ t('admin.filters.review') }}</option>
                  <option value="engineering">{{ t('admin.filters.engineering') }}</option>
                  <option value="issued">{{ t('admin.filters.issued') }}</option>
                  <option value="dispatched">{{ t('admin.filters.dispatched') }}</option>
                </select>
              </div>

              <div class="rfq-pipeline">
                <span
                  v-for="step in rfqSteps"
                  :key="step.key"
                  class="rfq-step"
                  :class="{ done: isRfqStepDone(rfq.status, step.key), current: rfq.status === step.key }"
                >
                  {{ step.label }}
                </span>
              </div>

              <table class="rfq-mini-table">
                <thead>
                  <tr>
                    <th>{{ t('rfq.table.line') }}</th>
                    <th>{{ t('common.quantity') }}</th>
                    <th>{{ t('common.unit') }}</th>
                    <th>{{ t('common.total') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in rfq.items" :key="item.id">
                    <td>{{ rfqItemLabel(item) }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ item.unit_price != null ? formatMoney(item.unit_price) : '—' }}</td>
                    <td>{{ item.unit_price != null ? formatMoney(rfqLineTotal(item)) : '—' }}</td>
                  </tr>
                </tbody>
              </table>

              <div v-if="rfq.quoted_total" class="quote-summary">
                <strong>{{ t('rfq.table.totalLabel') }} {{ formatMoney(rfqQuoteTotal(rfq)) }}</strong>
                <span v-if="rfq.client_confirmed" class="confirmed-tag">{{ t('admin.orders.clientConfirmed') }}</span>
              </div>

              <div class="rfq-actions">
                <button
                  v-if="canEditQuote(rfq)"
                  type="button"
                  class="primary-btn small"
                  @click="openQuoteDrawer(rfq)"
                >
                  {{ rfq.quoted_total ? t('admin.orders.editQuote') : t('admin.orders.prepareQuote') }}
                </button>
                <button
                  v-if="canDownloadRfqPdf(rfq)"
                  type="button"
                  class="ghost-btn small"
                  :disabled="pdfDownloadingId === rfq.id"
                  @click="handleDownloadQuotePdf(rfq)"
                >
                  {{ pdfDownloadingId === rfq.id ? t('common.generatingPdf') : t('common.downloadPdf') }}
                </button>
              </div>
            </article>
          </div>

          <p v-if="pdfError" class="form-error rfq-pdf-error">{{ pdfError }}</p>

          <div v-if="showQuoteDrawer && quoteRfqTarget" class="drawer-overlay" @click.self="closeQuoteDrawer">
            <aside class="product-drawer quote-drawer">
              <header class="drawer-header">
                <div>
                  <p class="drawer-eyebrow">{{ t('admin.orders.quoteBuilder') }}</p>
                  <h2>{{ quoteRfqTarget.ticket_number }}</h2>
                  <p class="drawer-sub">{{ quoteRfqTarget.company_name }}</p>
                </div>
                <button type="button" class="drawer-close" @click="closeQuoteDrawer">×</button>
              </header>
              <div class="drawer-layout">
                <RfqQuoteEditor
                  :lines="quoteLines"
                  :saving="quoteSaving"
                  @remove-line="removeQuoteLine"
                  @save="handleSendQuote"
                />
              </div>
            </aside>
          </div>
        </section>

        <!-- Marketplace -->
        <section v-if="activeTab === 'marketplace'" class="panel catalog-panel">
          <!-- Full-screen product editor -->
          <div v-if="showProductForm" class="product-editor">
            <header class="product-editor-header">
              <div>
                <button type="button" class="back-catalog-btn" @click="closeProductForm">
                  ← {{ t('admin.marketplace.backToCatalog') }}
                </button>
                <p class="drawer-eyebrow">{{ editingProduct ? t('admin.marketplace.editProduct') : t('admin.marketplace.newProduct') }}</p>
                <h1>{{ editingProduct ? editingProduct.title : t('admin.marketplace.addToCatalog') }}</h1>
              </div>
              <div class="product-editor-actions">
                <button type="button" class="ghost-btn" @click="closeProductForm">{{ t('common.cancel') }}</button>
                <button type="button" class="primary-btn" :disabled="productSaving" @click="handleSaveProduct">
                  {{ productSaving ? t('admin.projects.saving') : (editingProduct ? t('admin.marketplace.saveChanges') : t('admin.marketplace.createProduct')) }}
                </button>
              </div>
            </header>

            <form class="product-editor-form" @submit.prevent="handleSaveProduct">
              <div class="product-editor-grid">
                <aside class="product-editor-media">
                  <div class="media-card">
                    <div class="media-card-header">
                      <h2>{{ t('admin.marketplace.images') }}</h2>
                      <span>{{ productImages.length }} {{ t('admin.marketplace.filesCount') }}</span>
                    </div>

                    <div
                      class="upload-zone upload-zone-lg"
                      :class="{ 'has-image': activeImagePreview }"
                      @dragover.prevent
                      @drop.prevent="handleImageDrop"
                    >
                      <img v-if="activeImagePreview" :src="activeImagePreview" alt="Preview" class="upload-preview" />
                      <div v-else class="upload-placeholder">
                        <AdminIcon name="image" :size="36" />
                        <p>{{ t('admin.marketplace.dropImages') }}</p>
                        <span>{{ t('admin.marketplace.chooseFiles') }}</span>
                      </div>
                      <input type="file" accept="image/*" multiple class="upload-input" @change="handleImagePick" />
                    </div>

                    <div class="image-thumbs">
                      <button
                        v-for="(img, index) in productImages"
                        :key="img.id"
                        type="button"
                        class="image-thumb"
                        :class="{ active: activeImageIndex === index }"
                        @click="activeImageIndex = index"
                      >
                        <img :src="img.preview" :alt="`Image ${index + 1}`" />
                        <span class="thumb-remove" @click.stop="removeProductImage(index)">×</span>
                      </button>
                      <label class="image-thumb add-thumb">
                        <span>+</span>
                        <input type="file" accept="image/*" multiple hidden @change="handleImagePick" />
                      </label>
                    </div>
                  </div>
                </aside>

                <div class="product-editor-fields">
                  <section class="editor-section">
                    <h2>{{ t('admin.marketplace.sectionBasic') }}</h2>
                    <div class="editor-section-grid">
                      <label class="span-2">
                        {{ t('admin.marketplace.productName') }}
                        <input v-model="productForm.title" type="text" required maxlength="50" placeholder="e.g. Atlas Bifacial 550W Panel" />
                      </label>
                      <label>
                        {{ t('admin.marketplace.sku') }}
                        <input v-model="productForm.product_key" type="text" maxlength="50" placeholder="e.g. PV-450W" />
                      </label>
                      <label>
                        {{ t('admin.marketplace.colCategory') }}
                        <select v-model="productForm.category_id" :required="!showNewCategory" :disabled="showNewCategory">
                          <option disabled value="">{{ t('admin.marketplace.selectCategory') }}</option>
                          <option v-for="cat in adminCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                        </select>
                        <button
                          type="button"
                          class="linkish-btn"
                          @click="toggleNewCategory"
                        >
                          {{ showNewCategory ? t('admin.marketplace.useExistingCategory') : t('admin.marketplace.createNewCategory') }}
                        </button>
                      </label>

                      <div v-if="showNewCategory" class="new-category-box span-2">
                        <label>
                          {{ t('admin.marketplace.newCategoryName') }}
                          <input
                            v-model="newCategoryForm.name"
                            type="text"
                            maxlength="255"
                            :placeholder="t('admin.marketplace.newCategoryPlaceholder')"
                          />
                        </label>
                        <label>
                          {{ t('admin.marketplace.newCategoryDescription') }}
                          <input
                            v-model="newCategoryForm.description"
                            type="text"
                            maxlength="1000"
                            :placeholder="t('admin.marketplace.newCategoryDescPlaceholder')"
                          />
                        </label>
                        <div class="new-category-actions">
                          <button
                            type="button"
                            class="primary-btn"
                            :disabled="categorySaving || !newCategoryForm.name.trim()"
                            @click="handleCreateCategory"
                          >
                            {{ categorySaving ? t('admin.projects.saving') : t('admin.marketplace.saveCategory') }}
                          </button>
                        </div>
                        <p v-if="categoryFormError" class="form-error">{{ categoryFormError }}</p>
                      </div>
                      <label>
                        {{ t('admin.marketplace.stock') }}
                        <input v-model.number="productForm.stock" type="number" min="0" required />
                      </label>
                      <label>
                        {{ t('admin.marketplace.rating') }}
                        <input v-model.number="productForm.rating" type="number" min="0" max="5" step="0.1" />
                      </label>
                      <label class="span-2 visibility-toggle">
                        <span class="toggle-row">
                          <input id="product-visible" v-model="productForm.is_visible" type="checkbox" />
                          <span>
                            <strong>{{ t('admin.marketplace.visibleInStore') }}</strong>
                            <small>{{ t('admin.marketplace.visibleInStoreHint') }}</small>
                          </span>
                        </span>
                      </label>
                      <label class="span-2">
                        {{ t('common.description') }}
                        <textarea v-model="productForm.description" rows="3" maxlength="200" :placeholder="t('admin.marketplace.describePlaceholder')"></textarea>
                      </label>
                    </div>
                  </section>

                  <section class="editor-section">
                    <h2>{{ t('admin.marketplace.sectionTechnical') }}</h2>
                    <div class="editor-section-grid">
                      <label>
                        {{ t('admin.marketplace.capacity') }}
                        <input v-model.number="productForm.capacity" type="number" min="0" step="0.01" placeholder="450" />
                      </label>
                      <label>
                        {{ t('admin.marketplace.weight') }}
                        <input v-model.number="productForm.weight_kg" type="number" min="0" step="0.01" placeholder="22.5" />
                      </label>
                      <label>
                        {{ t('admin.marketplace.surface') }}
                        <input v-model.number="productForm.surface" type="number" min="0" step="0.01" placeholder="2.1" />
                      </label>
                      <label class="span-2">
                        {{ t('admin.marketplace.climateInfo') }}
                        <textarea v-model="productForm.climate_info" rows="3" maxlength="250" :placeholder="t('admin.marketplace.climatePlaceholder')"></textarea>
                      </label>
                    </div>
                  </section>

                  <section class="editor-section">
                    <h2>{{ t('admin.marketplace.sectionDetails') }}</h2>
                    <div class="editor-section-grid">
                      <label class="span-2">
                        {{ t('admin.marketplace.highlights') }}
                        <textarea v-model="productForm.highlights_text" rows="4" :placeholder="t('admin.marketplace.highlightsPlaceholder')"></textarea>
                        <small class="field-hint">{{ t('admin.marketplace.kvHint') }}</small>
                      </label>
                      <label class="span-2">
                        {{ t('admin.marketplace.specs') }}
                        <textarea v-model="productForm.specs_text" rows="4" :placeholder="t('admin.marketplace.specsPlaceholder')"></textarea>
                        <small class="field-hint">{{ t('admin.marketplace.kvHint') }}</small>
                      </label>
                    </div>
                  </section>

                  <section class="editor-section">
                    <div class="section-head-row">
                      <h2>{{ t('admin.marketplace.documents') }}</h2>
                      <button type="button" class="ghost-btn small-btn" @click="addDocumentRow">
                        + {{ t('admin.marketplace.addDocument') }}
                      </button>
                    </div>

                    <div v-if="!productDocuments.length" class="docs-empty">
                      {{ t('admin.marketplace.documentsEmpty') }}
                    </div>

                    <div v-else class="document-rows">
                      <div v-for="(doc, index) in productDocuments" :key="doc.id" class="document-row">
                        <label class="doc-name">
                          {{ t('admin.marketplace.documentName') }}
                          <input v-model="doc.name" type="text" maxlength="255" :placeholder="t('admin.marketplace.documentNamePlaceholder')" />
                        </label>
                        <label class="doc-file">
                          {{ t('admin.marketplace.documentFile') }}
                          <div class="doc-file-box">
                            <span class="doc-file-label">
                              {{ doc.file?.name || doc.size || t('admin.marketplace.chooseFile') }}
                            </span>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp,.txt,.csv"
                              @change="handleDocumentFilePick($event, index)"
                            />
                          </div>
                        </label>
                        <button type="button" class="action-btn danger doc-remove" @click="removeDocumentRow(index)" title="Remove">
                          <AdminIcon name="trash" :size="15" />
                        </button>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              <p v-if="productFormError" class="form-error">{{ productFormError }}</p>

              <footer class="product-editor-footer">
                <button type="button" class="ghost-btn" @click="closeProductForm">{{ t('common.cancel') }}</button>
                <button type="submit" class="primary-btn" :disabled="productSaving">
                  {{ productSaving ? t('admin.projects.saving') : (editingProduct ? t('admin.marketplace.saveChanges') : t('admin.marketplace.createProduct')) }}
                </button>
              </footer>
            </form>
          </div>

          <template v-else>
          <header class="catalog-header">
            <div>
              <h1>{{ t('admin.marketplace.title') }}</h1>
              <p>{{ t('admin.marketplace.subtitle') }}</p>
            </div>
            <button class="primary-btn" @click="openProductForm()">
              <AdminIcon name="plus" :size="16" />
              {{ t('admin.marketplace.newProduct') }}
            </button>
          </header>

          <div class="catalog-stats">
            <div class="catalog-stat">
              <span class="stat-value">{{ productSummary.total }}</span>
              <span class="stat-label">{{ t('admin.marketplace.statProducts') }}</span>
            </div>
            <div class="catalog-stat">
              <span class="stat-value">{{ productSummary.inStock }}</span>
              <span class="stat-label">{{ t('admin.marketplace.inStock') }}</span>
            </div>
            <div class="catalog-stat warn">
              <span class="stat-value">{{ productSummary.lowStock }}</span>
              <span class="stat-label">{{ t('admin.marketplace.lowStock') }}</span>
            </div>
            <div class="catalog-stat">
              <span class="stat-value">{{ productSummary.totalSold }}</span>
              <span class="stat-label">{{ t('admin.marketplace.unitsSold') }}</span>
            </div>
          </div>

          <div class="catalog-toolbar">
            <div class="search-wrap">
              <AdminIcon name="search" :size="16" />
              <input
                v-model="productSearch"
                type="search"
                :placeholder="t('admin.marketplace.searchPlaceholder')"
                @input="debouncedProductSearch"
              />
            </div>
            <select v-model="productCategoryFilter" class="filter-select" @change="loadMarketplace">
              <option value="">{{ t('admin.marketplace.allCategories') }}</option>
              <option v-for="cat in adminCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
            <select v-model="productStockFilter" class="filter-select">
              <option value="">{{ t('admin.marketplace.allStock') }}</option>
              <option value="in">{{ t('admin.marketplace.stockIn') }}</option>
              <option value="low">{{ t('admin.marketplace.stockLow') }}</option>
              <option value="out">{{ t('admin.marketplace.stockOut') }}</option>
            </select>
            <select v-model="productVisibilityFilter" class="filter-select">
              <option value="">{{ t('admin.marketplace.allVisibility') }}</option>
              <option value="visible">{{ t('admin.marketplace.onlyVisible') }}</option>
              <option value="hidden">{{ t('admin.marketplace.onlyHidden') }}</option>
            </select>
          </div>

          <div v-if="isLoading && !products.length" class="catalog-loading">{{ t('admin.marketplace.loading') }}</div>

          <div v-else-if="!filteredCatalogProducts.length" class="catalog-empty">
            <AdminIcon name="marketplace" :size="40" />
            <h3>{{ products.length ? t('admin.marketplace.noMatch') : t('admin.marketplace.empty') }}</h3>
            <p>{{ products.length ? t('admin.marketplace.tryFilters') : t('admin.marketplace.createFirst') }}</p>
            <button v-if="!products.length" class="primary-btn" @click="openProductForm()">{{ t('admin.marketplace.addFirst') }}</button>
          </div>

          <div v-else class="catalog-table-wrap">
            <table class="catalog-table">
              <thead>
                <tr>
                  <th>{{ t('admin.marketplace.colProduct') }}</th>
                  <th>{{ t('admin.marketplace.colCategory') }}</th>
                  <th>{{ t('admin.marketplace.colStock') }}</th>
                  <th>{{ t('admin.marketplace.colDemand') }}</th>
                  <th>{{ t('admin.marketplace.colSold') }}</th>
                  <th>{{ t('admin.marketplace.colVisibility') }}</th>
                  <th class="col-actions">{{ t('admin.marketplace.colActions') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="product in filteredCatalogProducts"
                  :key="product.id"
                  :class="{ 'row-hidden': product.is_visible === false }"
                >
                  <td class="col-product">
                    <div class="product-cell">
                      <div class="product-thumb-sm">
                        <img :src="resolveProductImage(product)" :alt="product.title" />
                      </div>
                      <div>
                        <strong>{{ product.title }}</strong>
                        <span class="product-sku">{{ product.product_key }}</span>
                        <p v-if="product.description" class="product-snippet">{{ truncateText(product.description, 72) }}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="category-chip">{{ product.category?.name || '—' }}</span>
                  </td>
                  <td>
                    <div class="stock-control">
                      <button type="button" class="qty-btn" @click="adjustStock(product, -1)" :disabled="product.stock <= 0">−</button>
                      <span class="stock-value" :class="stockLevelClass(product.stock)">{{ product.stock }}</span>
                      <button type="button" class="qty-btn" @click="adjustStock(product, 1)">+</button>
                    </div>
                  </td>
                  <td class="col-num">{{ product.rfq_demand || 0 }}</td>
                  <td class="col-num">{{ product.units_sold || 0 }}</td>
                  <td>
                    <button
                      type="button"
                      class="visibility-pill"
                      :class="product.is_visible === false ? 'hidden' : 'visible'"
                      @click="toggleProductVisibility(product)"
                    >
                      {{ product.is_visible === false ? t('admin.marketplace.hidden') : t('admin.marketplace.visible') }}
                    </button>
                  </td>
                  <td class="col-actions">
                    <div class="row-actions">
                      <button type="button" class="action-btn" title="Edit" @click="openProductForm(product)">
                        <AdminIcon name="edit" :size="15" />
                      </button>
                      <router-link
                        v-if="product.is_visible !== false"
                        :to="`/store/${product.id}`"
                        class="action-btn"
                        title="View in store"
                        target="_blank"
                      >
                        <AdminIcon name="external" :size="15" />
                      </router-link>
                      <button type="button" class="action-btn danger" title="Delete" @click="handleDeleteProduct(product)">
                        <AdminIcon name="trash" :size="15" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          </template>
        </section>

        <!-- Projects -->
        <section v-if="activeTab === 'projects'" class="panel followup-panel">
          <header class="panel-header followup-header">
            <div>
              <h1>{{ t('admin.projects.title') }}</h1>
              <p>{{ t('admin.projects.subtitle') }}</p>
            </div>
            <select v-model="projectFilter" @change="loadProjects" class="filter-select">
              <option value="">{{ t('admin.projects.allPhases') }}</option>
              <option value="premier_contact">{{ t('followup.steps.premier_contact.label') }}</option>
              <option value="data_collection">{{ t('followup.steps.data_collection.label') }}</option>
              <option value="energy_data">{{ t('followup.steps.energy_data.label') }}</option>
              <option value="completed">{{ t('followup.steps.completed.label') }}</option>
              <option value="on_hold">{{ t('followup.status.on_hold') }}</option>
            </select>
          </header>

          <div v-if="projects.length" class="followup-stats">
            <div class="followup-stat">
              <strong>{{ projects.length }}</strong>
              <span>{{ t('admin.projects.active') }}</span>
            </div>
            <div class="followup-stat">
              <strong>{{ followupOnHoldCount }}</strong>
              <span>{{ t('admin.projects.onHold') }}</span>
            </div>
            <div class="followup-stat">
              <strong>{{ followupCompletedCount }}</strong>
              <span>{{ t('admin.projects.completed') }}</span>
            </div>
          </div>

          <div v-if="!projects.length && !isLoading" class="empty-state followup-empty">
            <AdminIcon name="projects" :size="40" />
            <h3>{{ t('admin.projects.emptyTitle') }}</h3>
            <p>{{ t('admin.projects.emptyDesc') }}</p>
            <button type="button" class="ghost-btn" @click="switchTab('orders')">{{ t('admin.projects.goOrders') }}</button>
          </div>

          <div v-else class="followup-grid">
            <FollowupCard
              v-for="project in projects"
              :key="project.id"
              :project="project"
              variant="admin"
            >
              <template #action>
                <button type="button" class="primary-btn followup-btn" @click="openProjectDrawer(project)">
                  {{ t('admin.projects.updateFollowup') }}
                </button>
              </template>
            </FollowupCard>
          </div>

          <div v-if="showProjectDrawer && editingProject" class="drawer-overlay" @click.self="closeProjectDrawer">
            <aside class="product-drawer project-drawer">
              <header class="drawer-header">
                <div>
                  <p class="drawer-eyebrow">{{ t('admin.drawer.followup') }}</p>
                  <h2>{{ editingProject.name }}</h2>
                  <p v-if="editingProject.rfq_ticket" class="drawer-sub">
                    {{ t('admin.drawer.quoteLabel') }} {{ editingProject.rfq_ticket.ticket_number }} · {{ editingProject.user?.company || editingProject.user?.name }}
                  </p>
                </div>
                <button type="button" class="drawer-close" @click="closeProjectDrawer">×</button>
              </header>

              <form class="drawer-form" @submit.prevent="handleSaveProject">
                <div class="drawer-layout">
                  <section v-if="editingOrderLines.length || legacyOrderSummary" class="drawer-section order-recap">
                    <div class="section-head">
                      <div>
                        <h3>{{ t('admin.drawer.confirmedOrder') }}</h3>
                        <p class="section-hint">{{ t('admin.drawer.confirmedOrderHint') }}</p>
                      </div>
                      <span v-if="editingOrderTotal != null" class="order-total">{{ formatMoney(editingOrderTotal) }}</span>
                    </div>
                    <table v-if="editingOrderLines.length" class="order-lines-table">
                      <thead>
                        <tr>
                          <th>{{ t('rfq.table.item') }}</th>
                          <th>{{ t('common.quantity') }}</th>
                          <th>{{ t('common.total') }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in editingOrderLines" :key="item.id">
                          <td>{{ rfqItemLabel(item) }}</td>
                          <td>{{ item.quantity }}</td>
                          <td>{{ item.line_total != null ? formatMoney(item.line_total) : '—' }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <p v-else class="legacy-order-text">{{ legacyOrderSummary }}</p>
                  </section>

                  <section class="drawer-section site-section">
                    <div class="section-head">
                      <div>
                        <h3>{{ t('admin.drawer.installationSite') }}</h3>
                        <p class="section-hint">{{ t('admin.drawer.siteHint') }}</p>
                      </div>
                    </div>
                    <div class="drawer-fields">
                      <label>
                        {{ t('admin.drawer.location') }}
                        <input
                          v-model="projectForm.location"
                          type="text"
                          required
                          :placeholder="t('admin.drawer.locationPlaceholder')"
                        />
                      </label>
                    </div>
                  </section>

                  <section class="drawer-section client-update-section">
                    <div class="section-head">
                      <div>
                        <h3>{{ t('admin.drawer.clientUpdate') }}</h3>
                        <p class="section-hint">{{ t('admin.drawer.clientUpdateHint') }}</p>
                      </div>
                      <span class="visibility-badge">{{ t('admin.drawer.clientVisible') }}</span>
                    </div>
                    <div class="drawer-fields">
                      <label>
                        {{ t('admin.drawer.message') }}
                        <textarea
                          v-model="projectForm.client_message"
                          rows="4"
                          :placeholder="t('admin.drawer.messagePlaceholder')"
                        ></textarea>
                      </label>
                    </div>
                    <div v-if="projectForm.client_message?.trim()" class="client-message-preview">
                      <span class="preview-label">{{ t('admin.drawer.clientPreview') }}</span>
                      <p>{{ projectForm.client_message.trim() }}</p>
                    </div>
                    <p v-else class="empty-client-message">{{ t('admin.drawer.noClientMessage') }}</p>
                  </section>

                  <section class="drawer-section workflow-section">
                    <div class="section-title-row">
                      <h3>{{ t('admin.drawer.workflowPhase') }}</h3>
                      <span class="phase-counter">{{ t('admin.drawer.stepCounter', { current: previewStepNumber, total: projectStepDefs.length }) }}</span>
                    </div>
                    <p class="section-hint">{{ t('admin.drawer.workflowHint') }}</p>

                    <div class="phase-picker">
                      <button
                        v-for="(step, index) in projectStepDefs"
                        :key="step.key"
                        type="button"
                        class="phase-option"
                        :class="{ selected: projectForm.current_phase === step.key && !projectForm.on_hold }"
                        @click="projectForm.current_phase = step.key"
                      >
                        <span class="phase-index">{{ index + 1 }}</span>
                        <span class="phase-copy">
                          <span class="phase-name">{{ step.label }}</span>
                          <span class="phase-hint">{{ step.adminHint }}</span>
                        </span>
                      </button>
                    </div>

                    <ProjectTimeline
                      :project="previewProject"
                      variant="track"
                      audience="admin"
                    />

                    <label class="hold-toggle">
                      <input type="checkbox" v-model="projectForm.on_hold" />
                      <span>{{ t('admin.drawer.putOnHold') }}</span>
                    </label>
                  </section>

                  <section class="drawer-section internal-section">
                    <div class="section-head">
                      <div>
                        <h3>{{ t('admin.drawer.internalNotes') }}</h3>
                        <p class="section-hint">{{ t('admin.drawer.internalHint') }}</p>
                      </div>
                      <span class="team-badge">{{ t('admin.drawer.teamBadge') }}</span>
                    </div>

                    <div class="note-suggestions">
                      <button
                        v-for="suggestion in noteSuggestions"
                        :key="suggestion"
                        type="button"
                        class="note-chip"
                        @click="appendInternalNote(suggestion)"
                      >
                        + {{ suggestion }}
                      </button>
                    </div>

                    <div class="drawer-fields">
                      <label>
                        {{ t('admin.drawer.notes') }}
                        <textarea
                          v-model="projectForm.admin_notes"
                          rows="5"
                          :placeholder="t('admin.drawer.notesPlaceholder')"
                        ></textarea>
                      </label>
                    </div>

                    <div class="trace-panel">
                      <div class="trace-panel-head">
                        <h4>{{ t('admin.drawer.activityLog') }}</h4>
                        <span class="trace-count" v-if="projectTraces.length">{{ projectTraces.length }}</span>
                      </div>
                      <p class="trace-intro">{{ t('admin.drawer.traceIntro') }}</p>

                      <div v-if="tracesLoading" class="trace-empty">{{ t('admin.drawer.loadingActivity') }}</div>
                      <ul v-else-if="projectTraces.length" class="trace-list">
                        <li v-for="trace in projectTraces" :key="trace.id" class="trace-item">
                          <div class="trace-meta">
                            <strong>{{ traceActorLabel(trace) }}</strong>
                            <time>{{ formatDate(trace.created_at) }}</time>
                          </div>
                          <p class="trace-summary">{{ formatTraceSummary(trace) }}</p>
                          <ul v-if="trace.changes?.length" class="trace-changes">
                            <li v-for="(change, index) in trace.changes" :key="index">
                              {{ formatTraceChange(change) }}
                            </li>
                          </ul>
                        </li>
                      </ul>
                      <p v-else class="trace-empty">{{ t('admin.drawer.noTraces') }}</p>
                    </div>
                  </section>
                </div>

                <p v-if="projectSaveSuccess" class="form-success">{{ projectSaveSuccess }}</p>
                <p v-if="projectFormError" class="form-error">{{ projectFormError }}</p>

                <footer class="drawer-footer">
                  <button type="button" class="ghost-btn" @click="closeProjectDrawer">{{ t('common.cancel') }}</button>
                  <button type="submit" class="primary-btn" :disabled="projectSaving">
                    {{ projectSaving ? t('admin.projects.saving') : t('admin.projects.saveFollowup') }}
                  </button>
                </footer>
              </form>
            </aside>
          </div>
        </section>


        <!-- Clients -->
        <section v-if="activeTab === 'clients'" class="panel">
          <header class="panel-header">
            <div>
              <h1>{{ t('admin.clients.title') }}</h1>
              <p>{{ t('admin.clients.subtitle') }}</p>
            </div>
          </header>

          <div class="table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>{{ t('admin.clientsTable.name') }}</th>
                  <th>{{ t('admin.clientsTable.company') }}</th>
                  <th>{{ t('admin.clientsTable.email') }}</th>
                  <th>{{ t('admin.clientsTable.phone') }}</th>
                  <th>{{ t('admin.clientsTable.rfqs') }}</th>
                  <th>{{ t('admin.clientsTable.projects') }}</th>
                  <th>{{ t('admin.clientsTable.joined') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="client in users" :key="client.id">
                  <td>{{ client.name }}</td>
                  <td>{{ client.company }}</td>
                  <td>{{ client.email }}</td>
                  <td>{{ client.phone || '—' }}</td>
                  <td>{{ client.quoteRequests }}</td>
                  <td>{{ client.projects_count }}</td>
                  <td>{{ formatDate(client.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Operations Dispatch -->
        <section v-if="activeTab === 'operations'" class="panel ops-panel">
          <header class="panel-header ops-header">
            <div>
              <h1>{{ t('admin.operations.title') }}</h1>
              <p>{{ t('admin.operations.subtitle') }}</p>
            </div>
            <button class="primary-btn" @click="openCreateTaskModal()">
              <AdminIcon name="plus" size="16" />
              <span>{{ t('admin.operations.assignTaskBtn') }}</span>
            </button>
          </header>

          <!-- Operations KPI Summary -->
          <div class="ops-kpis">
            <div class="ops-kpi-card">
              <div class="kpi-icon-wrap green">
                <AdminIcon name="clients" size="20" />
              </div>
              <div>
                <span class="kpi-num">{{ opsStats.totalOps }}</span>
                <span class="kpi-lbl">{{ t('admin.operations.kpis.totalOps') }}</span>
              </div>
            </div>

            <div class="ops-kpi-card">
              <div class="kpi-icon-wrap blue">
                <AdminIcon name="user-check" size="20" />
              </div>
              <div>
                <span class="kpi-num">{{ opsStats.onDutyOps }}</span>
                <span class="kpi-lbl">{{ t('admin.operations.kpis.onDutyOps') }}</span>
              </div>
            </div>

            <div class="ops-kpi-card">
              <div class="kpi-icon-wrap orange">
                <AdminIcon name="clock" size="20" />
              </div>
              <div>
                <span class="kpi-num">{{ opsStats.inProgress }}</span>
                <span class="kpi-lbl">{{ t('admin.operations.kpis.inProgress') }}</span>
              </div>
            </div>

            <div class="ops-kpi-card">
              <div class="kpi-icon-wrap purple">
                <AdminIcon name="operations" size="20" />
              </div>
              <div>
                <span class="kpi-num">{{ opsStats.totalTasks }}</span>
                <span class="kpi-lbl">{{ t('admin.operations.kpis.totalTasks') }}</span>
              </div>
            </div>
          </div>

          <!-- Operations Navigation Subtabs -->
          <div class="ops-nav-tabs">
            <button
              :class="['ops-subtab-btn', { active: operationsSubtab === 'calendar' }]"
              @click="operationsSubtab = 'calendar'"
            >
              <AdminIcon name="calendar" size="16" />
              <span>{{ t('admin.operations.subtabs.calendar') }}</span>
            </button>
            <button
              :class="['ops-subtab-btn', { active: operationsSubtab === 'operators' }]"
              @click="operationsSubtab = 'operators'"
            >
              <AdminIcon name="clients" size="16" />
              <span>{{ t('admin.operations.subtabs.operators') }}</span>
              <span class="tab-badge">{{ opsOperators.length }}</span>
            </button>
            <button
              :class="['ops-subtab-btn', { active: operationsSubtab === 'tasksQueue' }]"
              @click="operationsSubtab = 'tasksQueue'"
            >
              <AdminIcon name="orders" size="16" />
              <span>{{ t('admin.operations.subtabs.tasksQueue') }}</span>
              <span class="tab-badge">{{ opsTasks.length }}</span>
            </button>
          </div>

          <!-- SUBTAB 1: CALENDAR & SCHEDULE -->
          <div v-if="operationsSubtab === 'calendar'" class="ops-calendar-view">
            <!-- Date Strip Picker -->
            <div class="date-strip">
              <div
                v-for="day in calendarDays"
                :key="day.date"
                :class="['day-chip', { selected: selectedCalendarDate === day.date }]"
                @click="selectedCalendarDate = day.date"
              >
                <span class="day-name">{{ day.dayName }}</span>
                <span class="day-num">{{ day.dayNum }}</span>
                <span class="day-dot" v-if="opsTasks.some(t => t.scheduledDate === day.date)"></span>
              </div>
            </div>

            <!-- Calendar Schedule Content Grid -->
            <div class="calendar-grid-container">
              <div class="schedule-matrix">
                <div class="matrix-header">
                  <div class="op-cell-head">Operator</div>
                  <div class="time-cell-head">Morning (08:00 - 13:00)</div>
                  <div class="time-cell-head">Afternoon (13:00 - 18:00)</div>
                </div>

                <div v-for="op in opsOperators" :key="op.id" class="matrix-row">
                  <div class="op-cell">
                    <div class="op-mini-avatar" :style="{ backgroundColor: op.avatarColor }">
                      {{ op.name.substring(0, 2).toUpperCase() }}
                    </div>
                    <div class="op-mini-info">
                      <strong>{{ op.name }}</strong>
                      <span :class="['duty-dot', getDutyStatusClass(op.dutyStatus)]"></span>
                      <small>{{ getDutyStatusLabel(op.dutyStatus) }}</small>
                    </div>
                  </div>

                  <!-- Morning Slot Tasks -->
                  <div class="slot-cell">
                    <div
                      v-for="t in opsTasks.filter(task => task.operatorId === op.id && task.scheduledDate === selectedCalendarDate && (task.timeSlot.includes('08:') || task.timeSlot.includes('09:') || task.timeSlot.includes('10:') || task.timeSlot.includes('11:')))"
                      :key="t.id"
                      :class="['schedule-card', t.type]"
                      @click="openEditTaskModal(t)"
                    >
                      <div class="sched-card-top">
                        <span class="sched-type-tag">{{ t.type.toUpperCase() }}</span>
                        <span class="sched-time">{{ t.timeSlot }}</span>
                      </div>
                      <h4 class="sched-title">{{ t.title }}</h4>
                      <div class="sched-client">📍 {{ t.client.name }} ({{ t.client.city }})</div>
                    </div>
                    <button class="add-slot-btn" @click="openCreateTaskModal(op.id)">+ Assign</button>
                  </div>

                  <!-- Afternoon Slot Tasks -->
                  <div class="slot-cell">
                    <div
                      v-for="t in opsTasks.filter(task => task.operatorId === op.id && task.scheduledDate === selectedCalendarDate && (task.timeSlot.includes('13:') || task.timeSlot.includes('14:') || task.timeSlot.includes('15:') || task.timeSlot.includes('16:') || task.timeSlot.includes('17:')))"
                      :key="t.id"
                      :class="['schedule-card', t.type]"
                      @click="openEditTaskModal(t)"
                    >
                      <div class="sched-card-top">
                        <span class="sched-type-tag">{{ t.type.toUpperCase() }}</span>
                        <span class="sched-time">{{ t.timeSlot }}</span>
                      </div>
                      <h4 class="sched-title">{{ t.title }}</h4>
                      <div class="sched-client">📍 {{ t.client.name }} ({{ t.client.city }})</div>
                    </div>
                    <button class="add-slot-btn" @click="openCreateTaskModal(op.id)">+ Assign</button>
                  </div>
                </div>
              </div>

              <!-- Selected Day Agenda Summary Sidebar -->
              <div class="day-agenda-sidebar">
                <h3>{{ t('admin.operations.calendarView.selectDay') }}</h3>
                <p class="agenda-date-label">📅 {{ selectedCalendarDate }}</p>

                <div v-if="calendarTasksForSelectedDay.length === 0" class="agenda-empty">
                  {{ t('admin.operations.calendarView.noTasks') }}
                </div>

                <div v-else class="agenda-list">
                  <div
                    v-for="task in calendarTasksForSelectedDay"
                    :key="task.id"
                    class="agenda-card"
                    @click="openEditTaskModal(task)"
                  >
                    <div class="agenda-card-head">
                      <span :class="['type-badge', task.type]">{{ task.type }}</span>
                      <span :class="['status-pill', task.status]">{{ task.status }}</span>
                    </div>
                    <h4>{{ task.title }}</h4>
                    <p class="agenda-op">👤 {{ task.operatorName }}</p>
                    <p class="agenda-time">⏰ {{ task.timeSlot }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- SUBTAB 2: OPERATORS FLEET ROSTER -->
          <div v-if="operationsSubtab === 'operators'" class="ops-roster-view">
            <div class="roster-grid">
              <div v-for="op in opsOperators" :key="op.id" class="op-roster-card">
                <div class="op-card-header">
                  <div class="op-avatar-lg" :style="{ backgroundColor: op.avatarColor }">
                    {{ op.name.substring(0, 2).toUpperCase() }}
                  </div>
                  <div class="op-header-text">
                    <h3>{{ op.name }}</h3>
                    <span class="op-role">{{ op.role }}</span>
                    <div class="op-status-row">
                      <span :class="['duty-badge', getDutyStatusClass(op.dutyStatus)]">
                        ● {{ getDutyStatusLabel(op.dutyStatus) }}
                      </span>
                      <span class="op-rating">⭐ {{ op.rating }}</span>
                    </div>
                  </div>
                </div>

                <div class="op-card-body">
                  <div class="op-detail-item">
                    <span class="lbl">📍 Region:</span>
                    <span class="val">{{ op.city }}</span>
                  </div>
                  <div class="op-detail-item">
                    <span class="lbl">📞 Phone:</span>
                    <span class="val">{{ op.phone }}</span>
                  </div>
                  <div class="op-detail-item">
                    <span class="lbl">⚡ Active Workload:</span>
                    <span class="workload-tag">{{ getOperatorActiveTaskCount(op.id) }} Active Tasks</span>
                  </div>

                  <div class="op-specialties">
                    <span v-for="spec in op.specialties" :key="spec" class="spec-chip">
                      {{ spec }}
                    </span>
                  </div>
                </div>

                <div class="op-card-footer">
                  <button class="primary-btn full" @click="openCreateTaskModal(op.id)">
                    <AdminIcon name="plus" size="14" />
                    <span>Assign Task</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- SUBTAB 3: ALL DISPATCHED TASKS QUEUE -->
          <div v-if="operationsSubtab === 'tasksQueue'" class="ops-queue-view">
            <div class="queue-toolbar">
              <div class="search-wrap">
                <AdminIcon name="search" size="16" />
                <input
                  v-model="opsSearch"
                  type="text"
                  placeholder="Search tasks, clients, or operators..."
                />
              </div>

              <div class="filter-group">
                <select v-model="opsFilterType">
                  <option value="all">All Service Types</option>
                  <option value="installation">Installation</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="delivery">Delivery</option>
                  <option value="study">Electricity Study</option>
                </select>

                <select v-model="opsFilterStatus">
                  <option value="all">All Statuses</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div class="table-wrap">
              <table class="admin-table ops-table">
                <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>Type</th>
                    <th>Title & Client</th>
                    <th>Assigned Operator</th>
                    <th>Schedule</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="t in filteredOpsTasks" :key="t.id">
                    <td><code>{{ t.id }}</code></td>
                    <td>
                      <span :class="['type-badge', t.type]">{{ t.type }}</span>
                    </td>
                    <td>
                      <strong class="ops-task-title">{{ t.title }}</strong>
                      <div class="ops-task-sub">📍 {{ t.client.name }} — {{ t.client.city }}</div>
                    </td>
                    <td>
                      <div class="op-table-cell">
                        👤 {{ t.operatorName }}
                      </div>
                    </td>
                    <td>
                      <div class="time-cell">
                        📅 {{ t.scheduledDate }}<br />
                        ⏰ {{ t.timeSlot }}
                      </div>
                    </td>
                    <td>
                      <span :class="['prio-badge', t.priority]">{{ t.priority }}</span>
                    </td>
                    <td>
                      <span :class="['status-pill', t.status]">{{ t.status }}</span>
                    </td>
                    <td>
                      <div class="action-btns">
                        <button class="ghost-btn small" @click="openEditTaskModal(t)" title="Edit / Reassign">
                          <AdminIcon name="edit" size="14" />
                        </button>
                        <button class="ghost-btn small danger" @click="handleDeleteTask(t.id)" title="Delete">
                          <AdminIcon name="trash" size="14" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="filteredOpsTasks.length === 0">
                    <td colspan="8" class="text-center py-4">No tasks found matching your filters.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- TASK ASSIGNMENT & EDIT MODAL -->
          <div v-if="showTaskModal" class="modal-overlay" @click.self="showTaskModal = false">
            <div class="modal-card ops-modal">
              <header class="modal-header">
                <h3>{{ editingTask ? t('admin.operations.modal.editTitle') : t('admin.operations.modal.createTitle') }}</h3>
                <button class="close-btn" @click="showTaskModal = false">×</button>
              </header>

              <form @submit.prevent="submitTaskForm" class="task-form">
                <div class="form-row">
                  <label>
                    <span>{{ t('admin.operations.modal.taskType') }}</span>
                    <select v-model="taskForm.type" required>
                      <option value="installation">Installation (New Equipment)</option>
                      <option value="maintenance">Maintenance (Diagnostics & Repair)</option>
                      <option value="delivery">Delivery (New Order)</option>
                      <option value="study">Make a Study (Audit & Sizing)</option>
                    </select>
                  </label>

                  <label>
                    <span>{{ t('admin.operations.modal.selectOperator') }}</span>
                    <select v-model="taskForm.operatorId" required>
                      <option v-for="op in opsOperators" :key="op.id" :value="op.id">
                        {{ op.name }} ({{ op.role }})
                      </option>
                    </select>
                  </label>
                </div>

                <div class="form-row">
                  <label class="full-width">
                    <span>{{ t('admin.operations.modal.taskTitle') }}</span>
                    <input
                      v-model="taskForm.title"
                      type="text"
                      placeholder="e.g. 10 kWp Solar Installation & Inverter Commissioning"
                      required
                    />
                  </label>
                </div>

                <div class="form-row">
                  <label>
                    <span>{{ t('admin.operations.modal.priority') }}</span>
                    <select v-model="taskForm.priority">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </label>

                  <label>
                    <span>{{ t('admin.operations.modal.scheduledDate') }}</span>
                    <input v-model="taskForm.scheduledDate" type="date" required />
                  </label>

                  <label>
                    <span>{{ t('admin.operations.modal.timeSlot') }}</span>
                    <select v-model="taskForm.timeSlot">
                      <option value="08:30 - 11:30">08:30 - 11:30</option>
                      <option value="09:00 - 13:00">09:00 - 13:00</option>
                      <option value="10:30 - 12:30">10:30 - 12:30</option>
                      <option value="14:00 - 17:00">14:00 - 17:00</option>
                    </select>
                  </label>
                </div>

                <div class="form-section-title">Client & Location Details</div>

                <div class="form-row">
                  <label>
                    <span>{{ t('admin.operations.modal.clientName') }}</span>
                    <input v-model="taskForm.clientName" type="text" placeholder="Client Name or Business" required />
                  </label>

                  <label>
                    <span>{{ t('admin.operations.modal.clientPhone') }}</span>
                    <input v-model="taskForm.clientPhone" type="text" placeholder="+212 6..." />
                  </label>
                </div>

                <div class="form-row">
                  <label>
                    <span>{{ t('admin.operations.modal.clientAddress') }}</span>
                    <input v-model="taskForm.clientAddress" type="text" placeholder="Full street address..." />
                  </label>

                  <label>
                    <span>{{ t('admin.operations.modal.clientCity') }}</span>
                    <input v-model="taskForm.clientCity" type="text" placeholder="Casablanca, Rabat, etc." />
                  </label>
                </div>

                <div class="form-row">
                  <label class="full-width">
                    <span>{{ t('admin.operations.modal.adminNotes') }}</span>
                    <textarea
                      v-model="taskForm.adminNotes"
                      rows="3"
                      placeholder="Special instructions for field operator, site access notes, equipment instructions..."
                    ></textarea>
                  </label>
                </div>

                <footer class="modal-footer">
                  <button type="button" class="ghost-btn" @click="showTaskModal = false">
                    {{ t('common.cancel') }}
                  </button>
                  <button type="submit" class="primary-btn">
                    {{ editingTask ? t('admin.operations.modal.submitUpdate') : t('admin.operations.modal.submitCreate') }}
                  </button>
                </footer>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth } from '../composables/useAuth'
import { useAdmin } from '../composables/useAdmin'
import { useOperatorAdmin } from '../composables/useOperatorAdmin'
import { useLocale } from '../composables/useLocale'
import { useToast } from '../composables/useToast'
import AdminIcon from '../components/adminDashboard/AdminIcon.vue'
// import LanguageSwitcher from '../components/LanguageSwitcher.vue'
import FollowupCard from '../components/adminDashboard/FollowupCard.vue'
import ProjectTimeline from '../components/adminDashboard/ProjectTimeline.vue'
import { resolveProductImage, resolveMediaUrl } from '../utils/productImage'
import {
  objectToLines,
  linesToObject,
} from '../utils/productDetails'
import RfqQuoteEditor from '../components/adminDashboard/RfqQuoteEditor.vue'
import {
  buildQuoteLinesFromRfq,
  formatMoney,
  formatDate,
  rfqQuoteTotal,
  rfqStatusLabel,
  rfqItemLabel,
  rfqLineTotal,
  canDownloadRfqPdf,
  rfqPdfErrorMessage,
  getRfqStatusSteps
} from '../utils/rfqQuote'

import {
  formatTraceChange,
  formatTraceSummary,
  traceActorLabel
} from '../utils/projectTrace'

import {
  getWorkflowSteps,
  extractClientMessage,
  getCurrentPhase,
  getFollowupStepNumber,
  parseLegacyOrderSummary,
  phaseToCompletedSteps,
  projectStatusLabel
} from '../utils/projectSteps'

const router = useRouter()
const { t } = useI18n()
const { locale } = useLocale()
const { user, isAdmin, logoutUser } = useAuth()
const toast = useToast()
const {
  stats,
  rfqs,
  projects,
  products,
  users,
  isLoading,
  error,
  fetchStats,
  fetchRfqs,
  updateRfqStatus,
  fetchProjects,
  updateProject,
  fetchProjectTraces,
  fetchProducts,
  updateProduct,
  createProduct,
  deleteProduct,
  fetchCategories,
  createCategory,
  fetchUsers,
  quoteRfq
} = useAdmin()

watch(error, (message) => {
  if (!message) return
  toast.error(message)
  error.value = null
})

const activeTab = ref('overview')
const quoteSaving = ref(false)
const showQuoteDrawer = ref(false)
const quoteRfqTarget = ref(null)
const quoteLines = ref([])
const removedLineIds = ref([])
const pdfDownloadingId = ref(null)
const pdfError = ref('')
const rfqFilter = ref('')
const projectFilter = ref('')
const showProjectDrawer = ref(false)
const editingProject = ref(null)
const projectSaving = ref(false)
const projectFormError = ref('')
const projectForm = ref(emptyProjectForm())
const projectTraces = ref([])
const tracesLoading = ref(false)
const projectSaveSuccess = ref('')
const noteSuggestions = computed(() => {
  locale.value
  return [
    t('admin.drawer.noteSuggestions.visit'),
    t('admin.drawer.noteSuggestions.quote'),
    t('admin.drawer.noteSuggestions.waiting'),
    t('admin.drawer.noteSuggestions.study'),
    t('admin.drawer.noteSuggestions.install')
  ]
})
const productSearch = ref('')
const productCategoryFilter = ref('')
const productStockFilter = ref('')
const productVisibilityFilter = ref('')
const showProductForm = ref(false)
const editingProduct = ref(null)
const productSaving = ref(false)
const productFormError = ref('')
const productImages = ref([])
const activeImageIndex = ref(0)
const productDocuments = ref([])
const adminCategories = ref([])
const showNewCategory = ref(false)
const categorySaving = ref(false)
const categoryFormError = ref('')
const newCategoryForm = ref({ name: '', description: '' })
const productForm = ref(emptyProductForm())
let productSearchTimer = null
let mediaIdCounter = 0

function nextMediaId() {
  mediaIdCounter += 1
  return `media-${mediaIdCounter}`
}

function emptyProductForm() {
  return {
    title: '',
    product_key: '',
    category_id: '',
    stock: 10,
    rating: 4.5,
    description: '',
    capacity: null,
    weight_kg: null,
    surface: null,
    climate_info: '',
    highlights_text: '',
    specs_text: '',
    is_visible: true,
  }
}

const activeImagePreview = computed(() => productImages.value[activeImageIndex.value]?.preview || '')


const projectStepDefs = computed(() => {
  locale.value
  return getWorkflowSteps()
})

const previewProject = computed(() => {
  if (!editingProject.value) return null
  return {
    ...editingProject.value,
    status: projectForm.value.on_hold ? 'on_hold' : projectForm.value.current_phase,
    completed_steps: phaseToCompletedSteps(projectForm.value.current_phase),
    progress: Math.round((phaseToCompletedSteps(projectForm.value.current_phase).length / projectStepDefs.value.length) * 100)
  }
})

const previewStepNumber = computed(() => {
  if (!previewProject.value) return 1
  return getFollowupStepNumber(previewProject.value)
})

const followupOnHoldCount = computed(() => projects.value.filter((project) => project.status === 'on_hold').length)

const followupCompletedCount = computed(() => projects.value.filter((project) => project.status === 'completed').length)

const editingOrderLines = computed(() => editingProject.value?.rfq_ticket?.items || [])

const editingOrderTotal = computed(() => {
  const total = editingProject.value?.rfq_ticket?.quoted_total
  return total != null && total !== '' ? Number(total) : null
})

const legacyOrderSummary = computed(() => {
  if (editingOrderLines.value.length) return null
  return parseLegacyOrderSummary(editingProject.value?.description)
})

function emptyProjectForm() {
  return {
    location: '',
    client_message: '',
    current_phase: 'premier_contact',
    on_hold: false,
    admin_notes: ''
  }
}

const {
  tasks: opsTasks,
  operators: opsOperators,
  stats: opsStats,
  createTask: createOpsTask,
  updateTaskStatus: updateOpsTaskStatus,
  reassignTask: reassignOpsTask,
  deleteTask: deleteOpsTask,
  getOperatorActiveTaskCount,
  reloadOperations
} = useOperatorAdmin()

const operationsSubtab = ref('calendar')
const selectedCalendarDate = ref('2026-09-15')
const showTaskModal = ref(false)
const editingTask = ref(null)

const taskForm = ref({
  type: 'installation',
  title: '',
  operatorId: '',
  priority: 'medium',
  scheduledDate: '2026-09-15',
  timeSlot: '09:00 - 12:00',
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  clientAddress: '',
  clientCity: 'Casablanca',
  adminNotes: ''
})

const opsFilterType = ref('all')
const opsFilterStatus = ref('all')
const opsSearch = ref('')

const calendarDays = computed(() => {
  return [
    { date: '2026-09-14', dayName: 'Mon', dayNum: '14' },
    { date: '2026-09-15', dayName: 'Tue', dayNum: '15' },
    { date: '2026-09-16', dayName: 'Wed', dayNum: '16' },
    { date: '2026-09-17', dayName: 'Thu', dayNum: '17' },
    { date: '2026-09-18', dayName: 'Fri', dayNum: '18' },
    { date: '2026-09-19', dayName: 'Sat', dayNum: '19' }
  ]
})

const calendarTasksForSelectedDay = computed(() => {
  return opsTasks.value.filter(t => t.scheduledDate === selectedCalendarDate.value)
})

const filteredOpsTasks = computed(() => {
  return opsTasks.value.filter(task => {
    const matchType = opsFilterType.value === 'all' || task.type === opsFilterType.value
    const matchStatus = opsFilterStatus.value === 'all' || task.status === opsFilterStatus.value
    const matchSearch = !opsSearch.value || 
      task.title.toLowerCase().includes(opsSearch.value.toLowerCase()) ||
      task.id.toLowerCase().includes(opsSearch.value.toLowerCase()) ||
      task.client.name.toLowerCase().includes(opsSearch.value.toLowerCase()) ||
      task.operatorName.toLowerCase().includes(opsSearch.value.toLowerCase())
    return matchType && matchStatus && matchSearch
  })
})

function openCreateTaskModal(opId = null) {
  editingTask.value = null
  taskForm.value = {
    type: 'installation',
    title: '',
    operatorId: opId || (opsOperators.value[0]?.id || ''),
    priority: 'medium',
    scheduledDate: selectedCalendarDate.value || '2026-09-15',
    timeSlot: '09:00 - 12:00',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    clientAddress: '',
    clientCity: 'Casablanca',
    adminNotes: ''
  }
  showTaskModal.value = true
}

function openEditTaskModal(task) {
  editingTask.value = task
  taskForm.value = {
    type: task.type,
    title: task.title,
    operatorId: task.operatorId,
    priority: task.priority,
    scheduledDate: task.scheduledDate,
    timeSlot: task.timeSlot,
    clientName: task.client.name,
    clientPhone: task.client.phone,
    clientEmail: task.client.email,
    clientAddress: task.client.address,
    clientCity: task.client.city,
    adminNotes: task.adminNotes
  }
  showTaskModal.value = true
}

function submitTaskForm() {
  if (!taskForm.value.title || !taskForm.value.operatorId) return
  if (editingTask.value) {
    reassignOpsTask(editingTask.value.id, taskForm.value.operatorId)
    editingTask.value.title = taskForm.value.title
    editingTask.value.type = taskForm.value.type
    editingTask.value.priority = taskForm.value.priority
    editingTask.value.scheduledDate = taskForm.value.scheduledDate
    editingTask.value.timeSlot = taskForm.value.timeSlot
    editingTask.value.client.name = taskForm.value.clientName
    editingTask.value.client.phone = taskForm.value.clientPhone
    editingTask.value.client.email = taskForm.value.clientEmail
    editingTask.value.client.address = taskForm.value.clientAddress
    editingTask.value.client.city = taskForm.value.clientCity
    editingTask.value.adminNotes = taskForm.value.adminNotes
  } else {
    createOpsTask(taskForm.value)
  }
  showTaskModal.value = false
}

function handleDeleteTask(taskId) {
  if (confirm('Are you sure you want to delete this task assignment?')) {
    deleteOpsTask(taskId)
  }
}

function getOpsTypeLabel(type) {
  const map = {
    installation: t('admin.operations.types.installation'),
    maintenance: t('admin.operations.types.maintenance'),
    delivery: t('admin.operations.types.delivery'),
    study: t('admin.operations.types.study')
  }
  return map[type] || type
}

function getDutyStatusLabel(status) {
  if (status === 'onDuty') return 'On Duty'
  if (status === 'onBreak') return 'On Break'
  return 'Off Duty'
}

function getDutyStatusClass(status) {
  if (status === 'onDuty') return 'duty-onduty'
  if (status === 'onBreak') return 'duty-onbreak'
  return 'duty-offduty'
}

const tabs = computed(() => {
  locale.value
  return [
    { id: 'overview', label: t('admin.tabs.overview'), icon: 'overview' },
    { id: 'orders', label: t('admin.tabs.orders'), icon: 'orders', badge: stats.value?.totals?.pending_rfqs || null },
    { id: 'marketplace', label: t('admin.tabs.marketplace'), icon: 'marketplace', badge: stats.value?.totals?.low_stock_count || null },
    { id: 'projects', label: t('admin.tabs.projects'), icon: 'projects' },
    { id: 'clients', label: t('admin.tabs.clients'), icon: 'clients' },
    { id: 'operations', label: t('admin.tabs.operations'), icon: 'operations', badge: opsStats.value?.inProgress || null }
  ]
})

const userInitials = computed(() => {
  const name = user.value?.name?.trim()
  if (!name) return 'A'
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
})

const kpiCards = computed(() => {
  if (!stats.value?.totals) return []
  locale.value
  const totals = stats.value.totals
  return [
    { label: t('admin.kpi.clients'), value: totals.users },
    { label: t('admin.kpi.products'), value: totals.products },
    { label: t('admin.kpi.rfqs'), value: totals.rfqs },
    { label: t('admin.kpi.projects'), value: totals.projects },
    { label: t('admin.kpi.pendingRfqs'), value: totals.pending_rfqs },
    { label: t('admin.kpi.lowStock'), value: totals.low_stock_count }
  ]
})

const productSummary = computed(() => {
  const list = products.value
  return {
    total: list.length,
    inStock: list.filter(p => p.stock > 0).length,
    lowStock: list.filter(p => p.stock > 0 && p.stock < 5).length,
    totalSold: list.reduce((sum, p) => sum + (p.units_sold || 0), 0)
  }
})

const filteredCatalogProducts = computed(() => {
  let list = [...products.value]

  if (productStockFilter.value === 'in') {
    list = list.filter(p => p.stock > 0)
  } else if (productStockFilter.value === 'low') {
    list = list.filter(p => p.stock > 0 && p.stock < 5)
  } else if (productStockFilter.value === 'out') {
    list = list.filter(p => p.stock === 0)
  }

  if (productVisibilityFilter.value === 'visible') {
    list = list.filter(p => p.is_visible !== false)
  } else if (productVisibilityFilter.value === 'hidden') {
    list = list.filter(p => p.is_visible === false)
  }

  return list
})

// onMounted(async () => {
//   if (!user.value || !isAdmin.value) {
//     router.push('/login')
//     return
//   }
//   await loadOverview()
// })

onMounted(async () => {
  await loadOverview()
})

//
const handleLogout = async () => {
  await logoutUser()
  router.push('/login')
}

const switchTab = async (tabId) => {
  activeTab.value = tabId
  if (tabId === 'overview') await loadOverview()
  if (tabId === 'orders') await loadOrders()
  if (tabId === 'marketplace') await loadMarketplace()
  if (tabId === 'projects') await loadProjects()
  if (tabId === 'clients') await loadClients()
}

const loadOverview = async () => {
  await fetchStats()
}

const loadOrders = async () => {
  await fetchRfqs(rfqFilter.value ? { status: rfqFilter.value } : {})
}

const rfqSteps = computed(() => {
  locale.value
  return getRfqStatusSteps()
})

const rfqStepOrder = { review: 1, engineering: 2, issued: 3, dispatched: 4 }

const isRfqStepDone = (status, stepKey) => (rfqStepOrder[status] || 1) >= (rfqStepOrder[stepKey] || 1)

const canEditQuote = (rfq) => {
  if (rfq.client_confirmed) return false
  return ['review', 'engineering', 'issued'].includes(rfq.status)
}

const openQuoteDrawer = (rfq) => {
  quoteRfqTarget.value = rfq
  quoteLines.value = buildQuoteLinesFromRfq(rfq)
  removedLineIds.value = []
  showQuoteDrawer.value = true
}

const closeQuoteDrawer = () => {
  showQuoteDrawer.value = false
  quoteRfqTarget.value = null
  quoteLines.value = []
  removedLineIds.value = []
}

const removeQuoteLine = (index) => {
  const line = quoteLines.value[index]
  if (line?.id && !line.is_catalog) {
    removedLineIds.value.push(line.id)
  }
  quoteLines.value.splice(index, 1)
}

const handleDownloadQuotePdf = async (rfq) => {
  pdfError.value = ''
  pdfDownloadingId.value = rfq.id
  try {
    const { downloadRfqQuotePdf } = await import('../utils/rfqPdf')
    await downloadRfqQuotePdf(rfq)
  } catch (error) {
    pdfError.value = rfqPdfErrorMessage(error)
  } finally {
    pdfDownloadingId.value = null
  }
}

const handleSendQuote = async () => {
  const rfq = quoteRfqTarget.value
  if (!rfq) return

  const lines = quoteLines.value.map(line => ({
    id: line.id,
    label: line.label,
    quantity: Number(line.quantity),
    unit_price: Number(line.unit_price),
    item_type: line.item_type
  }))

  if (!lines.length) {
    toast.error('Add at least one quote line.')
    return
  }

  if (lines.some(line => !line.quantity || line.unit_price <= 0 || (!line.id && !line.label?.trim()))) {
    toast.error('Fill description, quantity and unit price for every line.')
    return
  }

  quoteSaving.value = true
  const result = await quoteRfq(rfq.id, { lines, remove_ids: removedLineIds.value })
  quoteSaving.value = false

  if (result.success) {
    closeQuoteDrawer()
    await loadOrders()
    await loadOverview()
  } else {
    toast.error(result.error || 'Could not send quote')
  }
}

const loadMarketplace = async () => {
  if (!adminCategories.value.length) {
    adminCategories.value = await fetchCategories()
  }
  const filters = {}
  if (productSearch.value) filters.search = productSearch.value
  if (productCategoryFilter.value) filters.category_id = productCategoryFilter.value
  await fetchProducts(filters)
}

const openProductForm = (product = null) => {
  productFormError.value = ''
  editingProduct.value = product
  activeImageIndex.value = 0

  if (product) {
    productForm.value = {
      title: product.title || '',
      product_key: product.product_key || '',
      category_id: product.category_id || '',
      stock: product.stock ?? 0,
      rating: product.rating ?? 4.5,
      description: product.description || '',
      capacity: product.unit_capacity ?? product.capacity ?? null,
      weight_kg: product.unit_weight ?? product.weight_kg ?? null,
      surface: product.unit_area ?? product.surface ?? null,
      climate_info: product.climate_info || '',
      highlights_text: objectToLines(product.highlights),
      specs_text: objectToLines(product.specs),
      is_visible: product.is_visible !== false,
    }

    const gallery = product.images?.length
      ? product.images
      : product.image || product.image_url
        ? [{ path: product.image, url: product.image_url || resolveProductImage(product) }]
        : []

    productImages.value = gallery.map((img) => ({
      id: nextMediaId(),
      path: img.path || null,
      preview: resolveMediaUrl(img.url || img.path),
      file: null,
    }))

    productDocuments.value = (product.documents || []).map((doc) => ({
      id: nextMediaId(),
      name: doc.name || '',
      path: doc.path || null,
      size: doc.size || '',
      url: doc.url || null,
      file: null,
    }))
  } else {
    productForm.value = emptyProductForm()
    productImages.value = []
    productDocuments.value = []
  }

  showProductForm.value = true
}

const closeProductForm = () => {
  showProductForm.value = false
  editingProduct.value = null
  productImages.value = []
  productDocuments.value = []
  activeImageIndex.value = 0
  productFormError.value = ''
  showNewCategory.value = false
  categoryFormError.value = ''
  newCategoryForm.value = { name: '', description: '' }
}

const toggleNewCategory = () => {
  showNewCategory.value = !showNewCategory.value
  categoryFormError.value = ''
  if (!showNewCategory.value) {
    newCategoryForm.value = { name: '', description: '' }
  }
}

const handleCreateCategory = async () => {
  categoryFormError.value = ''
  const name = newCategoryForm.value.name.trim()
  if (!name) {
    categoryFormError.value = t('admin.marketplace.newCategoryRequired')
    return
  }

  categorySaving.value = true
  const result = await createCategory({
    name,
    description: newCategoryForm.value.description.trim() || null,
  })
  categorySaving.value = false

  if (!result.success) {
    categoryFormError.value = result.error || t('admin.marketplace.newCategoryFailed')
    return
  }

  adminCategories.value = [...adminCategories.value, result.category]
    .sort((a, b) => a.name.localeCompare(b.name))
  productForm.value.category_id = result.category.id
  showNewCategory.value = false
  newCategoryForm.value = { name: '', description: '' }
}

const addImageFiles = (files) => {
  const list = Array.from(files || []).filter((file) => file.type.startsWith('image/'))
  if (!list.length) return

  list.forEach((file) => {
    productImages.value.push({
      id: nextMediaId(),
      path: null,
      preview: URL.createObjectURL(file),
      file,
    })
  })
  activeImageIndex.value = productImages.value.length - 1
}

const handleImagePick = (event) => {
  addImageFiles(event.target.files)
  event.target.value = ''
}

const handleImageDrop = (event) => {
  addImageFiles(event.dataTransfer?.files)
}

const removeProductImage = (index) => {
  productImages.value.splice(index, 1)
  if (activeImageIndex.value >= productImages.value.length) {
    activeImageIndex.value = Math.max(0, productImages.value.length - 1)
  }
}

const addDocumentRow = () => {
  productDocuments.value.push({
    id: nextMediaId(),
    name: '',
    path: null,
    size: '',
    url: null,
    file: null,
  })
}

const removeDocumentRow = (index) => {
  productDocuments.value.splice(index, 1)
}

const handleDocumentFilePick = (event, index) => {
  const file = event.target.files?.[0]
  if (!file) return
  const doc = productDocuments.value[index]
  doc.file = file
  doc.size = `${Math.max(1, Math.round(file.size / 1024))} KB`
  if (!doc.name) {
    doc.name = file.name.replace(/\.[^.]+$/, '')
  }
  event.target.value = ''
}

const adjustStock = async (product, delta) => {
  const next = Math.max(0, product.stock + delta)
  if (next === product.stock) return
  await updateProduct(product.id, { stock: next })
  await fetchStats()
}

const toggleProductVisibility = async (product) => {
  const nextVisible = product.is_visible === false
  await updateProduct(product.id, {
    is_visible: nextVisible ? '1' : '0',
  })
}

const stockLevelClass = (stock) => {
  if (stock === 0) return 'out'
  if (stock < 5) return 'low'
  return 'ok'
}

const truncateText = (text, len) => {
  if (!text) return ''
  return text.length > len ? `${text.slice(0, len)}…` : text
}

const handleSaveProduct = async () => {
  productFormError.value = ''
  productSaving.value = true

  const form = productForm.value
  const highlights = linesToObject(form.highlights_text)
  const specs = linesToObject(form.specs_text)

  const existingImages = productImages.value
    .filter((img) => img.path && !img.file)
    .map((img) => img.path)

  const imageFiles = productImages.value
    .filter((img) => img.file)
    .map((img) => img.file)

  const existingDocuments = productDocuments.value
    .filter((doc) => doc.path && !doc.file)
    .map((doc) => ({
      name: doc.name,
      path: doc.path,
      size: doc.size,
    }))

  const documentUploads = productDocuments.value
    .filter((doc) => doc.file)
    .map((doc) => ({
      name: doc.name,
      file: doc.file,
    }))

  const incompleteDoc = productDocuments.value.find((doc) => !doc.name?.trim() || (!doc.file && !doc.path))
  if (incompleteDoc) {
    productSaving.value = false
    productFormError.value = t('admin.marketplace.documentIncomplete')
    return
  }

  const payload = {
    title: form.title,
    product_key: form.product_key || undefined,
    category_id: form.category_id,
    stock: form.stock,
    rating: form.rating,
    description: form.description || '',
    climate_info: form.climate_info || '',
    capacity: form.capacity,
    weight_kg: form.weight_kg,
    surface: form.surface,
    highlights: highlights ? JSON.stringify(highlights) : '',
    specs: specs ? JSON.stringify(specs) : '',
    is_visible: form.is_visible ? '1' : '0',
    existing_images: JSON.stringify(existingImages),
    existing_documents: JSON.stringify(existingDocuments),
  }

  const media = { imageFiles, documentUploads }

  let result
  if (editingProduct.value) {
    result = await updateProduct(editingProduct.value.id, payload, media)
  } else {
    result = await createProduct(payload, media)
  }

  productSaving.value = false

  if (result.success) {
    closeProductForm()
    await fetchStats()
  } else {
    productFormError.value = result.error || 'Could not save product.'
  }
}

const handleDeleteProduct = async (product) => {
  if (!confirm(`Delete "${product.title}" from the catalog?`)) return
  const result = await deleteProduct(product.id)
  if (result.success) {
    await fetchStats()
  }
}

const openProjectDrawer = async (project) => {
  if (!project) return
  projectFormError.value = ''
  projectSaveSuccess.value = ''
  editingProject.value = project
  projectForm.value = {
    location: project.location || '',
    client_message: extractClientMessage(project.description),
    current_phase: getCurrentPhase(project),
    on_hold: project.status === 'on_hold',
    admin_notes: project.admin_notes || ''
  }
  showProjectDrawer.value = true
  tracesLoading.value = true
  projectTraces.value = await fetchProjectTraces(project.id)
  tracesLoading.value = false
}

const closeProjectDrawer = () => {
  showProjectDrawer.value = false
  editingProject.value = null
  projectFormError.value = ''
  projectSaveSuccess.value = ''
  projectTraces.value = []
}

function appendInternalNote(text) {
  const current = projectForm.value.admin_notes?.trim()
  projectForm.value.admin_notes = current ? `${current}\n${text}` : text
}

const buildProjectPayload = () => {
  const form = projectForm.value
  return {
    location: form.location,
    description: form.client_message?.trim() || null,
    admin_notes: form.admin_notes || null,
    completed_steps: phaseToCompletedSteps(form.current_phase),
    on_hold: form.on_hold
  }
}

const handleSaveProject = async () => {
  if (!editingProject.value) return
  projectFormError.value = ''
  projectSaveSuccess.value = ''
  projectSaving.value = true

  const result = await updateProject(editingProject.value.id, buildProjectPayload())
  projectSaving.value = false

  if (result) {
    editingProject.value = result.project
    projectTraces.value = result.traces || []
    projectSaveSuccess.value = t('admin.projects.saved')
    await loadProjects()
    await fetchStats()
  } else {
    projectFormError.value = error.value || 'Could not save follow-up.'
  }
}

const loadProjects = async () => {
  await fetchProjects(projectFilter.value ? { status: projectFilter.value } : {})
}

const loadClients = async () => {
  await fetchUsers()
}

const debouncedProductSearch = () => {
  clearTimeout(productSearchTimer)
  productSearchTimer = setTimeout(loadMarketplace, 350)
}

const handleRfqStatusChange = async (rfq, status) => {
  await updateRfqStatus(rfq.id, status)
  await loadMarketplace()
  await loadOverview()
}

const handleStockChange = async (product, stock) => {
  await updateProduct(product.id, { stock: Number(stock) })
  await fetchStats()
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #eef4f0;
  font-family: 'Outfit', sans-serif;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
}

.live-badge {
  display: none;
}

.brand-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(74, 222, 128, 0.12);
  border: 1px solid rgba(74, 222, 128, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4ade80;
  flex-shrink: 0;
}

.brand-title {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  letter-spacing: 1.5px;
  font-size: 0.88rem;
}

.brand-sub {
  display: block;
  font-size: 0.68rem;
  color: #4ade80;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.admin-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

.admin-sidebar {
  background: #020d07;
  color: #f0fdf4;
  border-right: 1px solid rgba(74, 222, 128, 0.12);
  padding: 1.15rem 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-brand {
  padding: 0.35rem 0.55rem 1rem;
  border-bottom: 1px solid rgba(74, 222, 128, 0.12);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(74, 222, 128, 0.12);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sidebar-profile {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.35rem 0.45rem;
}

.profile-avatar {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: rgba(74, 222, 128, 0.16);
  border: 1px solid rgba(74, 222, 128, 0.28);
  color: #4ade80;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 800;
  flex-shrink: 0;
}

.profile-meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.admin-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: #f0fdf4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.admin-role {
  font-size: 0.72rem;
  color: rgba(240, 253, 244, 0.55);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  width: 100%;
  background: transparent;
  border: 1px solid rgba(240, 253, 244, 0.22);
  color: #f0fdf4;
  padding: 0.55rem 0.9rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
}

.logout-btn:hover {
  background: rgba(240, 253, 244, 0.08);
  border-color: rgba(74, 222, 128, 0.35);
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.75rem 0.9rem;
  border: none;
  background: transparent;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(240, 253, 244, 0.72);
  text-align: left;
}

.nav-btn:hover {
  background: rgba(74, 222, 128, 0.08);
  color: #f0fdf4;
}

.nav-btn.active {
  background: rgba(74, 222, 128, 0.14);
  color: #4ade80;
}

.nav-icon {
  display: flex;
  align-items: center;
  color: inherit;
}

.status-pill.project {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  background: #e5e7eb;
  color: #374151;
  white-space: nowrap;
}

.status-pill.project.completed { background: #dcfce7; color: #15803d; }
.status-pill.project.on_hold { background: #fef3c7; color: #b45309; }
.status-pill.project.premier_contact { background: #dbeafe; color: #1d4ed8; }
.status-pill.project.data_collection { background: #ede9fe; color: #6d28d9; }
.status-pill.project.energy_data { background: #cffafe; color: #0e7490; }

.nav-badge {
  margin-left: auto;
  background: #ef4444;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
}

.admin-main {
  padding: 1.15rem 1.5rem 1.5rem;
  overflow-x: auto;
}

/* Global `section { padding: 7rem 0 }` is for marketing pages — reset in admin */
.admin-main > .panel,
.admin-main .drawer-section {
  padding: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.panel-header h1 {
  font-size: 1.6rem;
  font-weight: 800;
  color: #052e16;
  margin-bottom: 0.25rem;
}

.panel-header p {
  color: #6b7280;
  font-size: 0.95rem;
}

.refresh-btn,
.filter-select,
.search-input {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 0.6rem 0.9rem;
  background: #fff;
  font-size: 0.9rem;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.kpi-card {
  background: #fff;
  border-radius: 14px;
  padding: 1.25rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
}

.kpi-value {
  display: block;
  font-size: 1.8rem;
  font-weight: 800;
  color: #052e16;
}

.kpi-label {
  font-size: 0.82rem;
  color: #6b7280;
  font-weight: 600;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.insight-card {
  background: #fff;
  border-radius: 14px;
  padding: 1.25rem;
  border-left: 4px solid #22c55e;
}

.insight-warning { border-left-color: #f59e0b; }
.insight-action { border-left-color: #3b82f6; }
.insight-info { border-left-color: #6366f1; }
.insight-success { border-left-color: #22c55e; }

.insight-card h3 {
  font-size: 1rem;
  margin-bottom: 0.35rem;
  color: #052e16;
}

.insight-card p {
  font-size: 0.9rem;
  color: #4b5563;
  line-height: 1.5;
}

.insight-action {
  margin-top: 0.75rem;
  background: none;
  border: none;
  color: #16a34a;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}

.split-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.data-card {
  background: #fff;
  border-radius: 14px;
  padding: 1.25rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.data-card h3 {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #052e16;
}

.rank-list,
.recent-list {
  list-style: none;
}

.rank-list li,
.recent-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  gap: 1rem;
}

.recent-list li small {
  display: block;
  color: #6b7280;
  font-size: 0.8rem;
}

.empty-note,
.empty-state {
  color: #6b7280;
  font-size: 0.92rem;
}

.rfq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rfq-card {
  background: #fff;
  border: 1px solid rgba(5, 46, 22, 0.08);
  border-radius: 18px;
  padding: 1.15rem 1.25rem;
  box-shadow: 0 12px 32px rgba(5, 46, 22, 0.05);
}

.rfq-card-top {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 0.85rem;
}

.rfq-card-top h3 {
  margin: 0.45rem 0 0;
  font-size: 1.05rem;
  color: #052e16;
}

.rfq-card-top p {
  margin: 0.2rem 0 0;
  font-size: 0.84rem;
  color: #6b7280;
}

.rfq-card-top small {
  color: #9ca3af;
  font-size: 0.78rem;
}

.rfq-id {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #166534;
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
  border-radius: 999px;
  padding: 0.2rem 0.55rem;
}

.rfq-pipeline {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.85rem;
}

.rfq-step {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  background: #f3f4f6;
  color: #9ca3af;
}

.rfq-step.done {
  background: #ecfdf5;
  color: #15803d;
}

.rfq-step.current {
  background: #052e16;
  color: #fff;
}

.rfq-mini-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.84rem;
  margin-bottom: 0.85rem;
}

.rfq-mini-table th,
.rfq-mini-table td {
  padding: 0.45rem 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  text-align: left;
}

.rfq-mini-table th {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #9ca3af;
}

.rfq-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.quote-drawer {
  width: min(760px, 100vw);
}

.rfq-pdf-error {
  margin-top: 0.75rem;
}

.order-card,
.project-card {
  background: #fff;
  border-radius: 14px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.order-head,
.project-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.order-head h3,
.project-head h3 {
  font-size: 1.05rem;
  color: #052e16;
}

.order-head p,
.project-head p {
  color: #6b7280;
  font-size: 0.88rem;
}

.order-head small {
  color: #9ca3af;
  font-size: 0.8rem;
}

.order-items {
  margin-top: 0.85rem;
  padding-left: 1.1rem;
  color: #374151;
  font-size: 0.9rem;
}

.status-select {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 0.45rem 0.65rem;
  font-size: 0.85rem;
  background: #fff;
}

.status-pill {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  background: #e5e7eb;
  color: #374151;
  white-space: nowrap;
}

.status-pill.review { background: #dbeafe; color: #1d4ed8; }
.status-pill.engineering { background: #fef3c7; color: #b45309; }
.status-pill.issued { background: #dcfce7; color: #15803d; }
.status-pill.dispatched { background: #ede9fe; color: #6d28d9; }

.table-wrap {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th,
.admin-table td {
  padding: 0.85rem 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 0.88rem;
}

.admin-table th {
  background: #f9fafb;
  font-weight: 700;
  color: #374151;
}

.admin-table td small {
  display: block;
  color: #9ca3af;
  font-size: 0.75rem;
}

.stock-input {
  width: 72px;
  padding: 0.35rem 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
}

.link-btn {
  color: #16a34a;
  font-weight: 700;
  font-size: 0.85rem;
}

.progress-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 180px;
}

.progress-wrap label {
  font-size: 0.75rem;
  color: #6b7280;
}

.project-controls {
  margin-top: 0.85rem;
}

@media (max-width: 900px) {
  .admin-layout {
    grid-template-columns: 1fr;
  }

  .admin-sidebar {
    position: static;
    height: auto;
    border-right: none;
    border-bottom: 1px solid rgba(74, 222, 128, 0.12);
  }

  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
    flex: none;
  }

  .nav-btn {
    white-space: nowrap;
    flex-shrink: 0;
  }

  .sidebar-footer {
    flex-direction: row;
    align-items: center;
    margin-top: 0;
  }

  .logout-btn {
    width: auto;
    flex-shrink: 0;
  }

  .admin-main {
    padding: 1rem;
  }

  .order-head,
  .project-head {
    flex-direction: column;
  }
}
.panel-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-form label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
}

.product-form input,
.product-form select,
.product-form textarea {
  padding: 0.6rem 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-family: inherit;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-error {
  color: #b91c1c;
  font-size: 0.85rem;
}

.primary-btn {
  background: #22c55e;
  color: #052e16;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.ghost-btn {
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 0.55rem 0.9rem;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
}

/* ─── Product catalog ─────────────────────────────── */

.catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.catalog-header h1 {
  font-size: 1.6rem;
  font-weight: 800;
  color: #052e16;
  margin-bottom: 0.25rem;
}

.catalog-header p {
  color: #6b7280;
  font-size: 0.95rem;
}

.catalog-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.catalog-stat {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 0.9rem 1rem;
}

.catalog-stat.warn .stat-value {
  color: #b45309;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  color: #052e16;
  line-height: 1.1;
}

.stat-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #6b7280;
}

.catalog-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-bottom: 1rem;
}

.search-wrap {
  flex: 1;
  min-width: 220px;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding: 0 0.85rem;
  color: #9ca3af;
}

.search-wrap input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.65rem 0;
  font-size: 0.9rem;
  font-family: inherit;
  background: transparent;
}

.catalog-loading,
.catalog-empty {
  background: #fff;
  border-radius: 14px;
  border: 1px dashed rgba(0, 0, 0, 0.1);
  padding: 3rem 1.5rem;
  text-align: center;
  color: #6b7280;
}

.catalog-empty svg {
  margin: 0 auto 1rem;
  color: #d1d5db;
}

.catalog-empty h3 {
  color: #052e16;
  margin-bottom: 0.35rem;
}

.catalog-empty p {
  margin-bottom: 1rem;
  font-size: 0.92rem;
}

.catalog-table-wrap {
  background: #fff;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.catalog-table {
  width: 100%;
  border-collapse: collapse;
}

.catalog-table th {
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #6b7280;
  background: #f9fafb;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.catalog-table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  vertical-align: middle;
  font-size: 0.88rem;
}

.catalog-table tbody tr:hover {
  background: #fafdfb;
}

.catalog-table tbody tr:last-child td {
  border-bottom: none;
}

.col-product {
  min-width: 280px;
}

.product-cell {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}

.product-thumb-sm {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f3f4f6;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.product-thumb-sm img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-cell strong {
  display: block;
  color: #052e16;
  font-size: 0.92rem;
  margin-bottom: 0.1rem;
}

.product-sku {
  display: block;
  font-size: 0.72rem;
  color: #9ca3af;
  font-family: ui-monospace, monospace;
}

.product-snippet {
  margin-top: 0.25rem;
  font-size: 0.78rem;
  color: #6b7280;
  line-height: 1.4;
}

.category-chip {
  display: inline-block;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  background: #f0fdf4;
  color: #15803d;
  font-size: 0.75rem;
  font-weight: 700;
}

.stock-control {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: #f9fafb;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 999px;
  padding: 0.2rem;
}

.visibility-pill {
  border: none;
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.visibility-pill.visible {
  background: rgba(34, 197, 94, 0.15);
  color: #15803d;
}

.visibility-pill.hidden {
  background: rgba(107, 114, 128, 0.15);
  color: #4b5563;
}

.row-hidden {
  opacity: 0.62;
}

.row-hidden .product-thumb-sm {
  filter: grayscale(0.35);
}

.visibility-toggle {
  margin-top: 0.15rem;
}

.toggle-row {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.75rem 0.85rem;
  border-radius: 12px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.toggle-row input[type='checkbox'] {
  margin-top: 0.2rem;
  width: 1rem;
  height: 1rem;
  accent-color: #16a34a;
}

.toggle-row strong {
  display: block;
  font-size: 0.88rem;
  color: #052e16;
}

.toggle-row small {
  display: block;
  margin-top: 0.15rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
}

.qty-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: #fff;
  color: #374151;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.qty-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.stock-value {
  min-width: 2rem;
  text-align: center;
  font-weight: 800;
  font-size: 0.88rem;
}

.stock-value.ok { color: #15803d; }
.stock-value.low { color: #b45309; }
.stock-value.out { color: #b91c1c; }

.col-num {
  font-weight: 700;
  color: #374151;
}

.col-actions {
  width: 120px;
  text-align: right;
}

.row-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.35rem;
}

.action-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #fff;
  color: #374151;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
}

.action-btn:hover {
  background: #f3f4f6;
}

.action-btn.danger {
  color: #b91c1c;
}

.action-btn.danger:hover {
  background: #fef2f2;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.followup-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.15rem;
}

.followup-panel .panel-header,
.followup-header {
  margin-bottom: 1rem;
}

.followup-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.15rem;
}

.followup-stat {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  background: linear-gradient(180deg, #f8fcf9, #f3faf6);
  border: 1px solid rgba(34, 197, 94, 0.12);
}

.followup-stat strong {
  font-size: 1.35rem;
  color: #052e16;
  line-height: 1;
}

.followup-stat span {
  font-size: 0.76rem;
  font-weight: 600;
  color: #6b7280;
}

.followup-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  text-align: center;
  padding: 2.5rem 1rem;
}

.empty-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #ecfdf5, #dcfce7);
  border: 1px solid #bbf7d0;
}

.phase-picker {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.phase-option {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.85rem 0.95rem;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #fafafa;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.phase-option:hover {
  border-color: rgba(34, 197, 94, 0.35);
  background: #f8fcf9;
}

.phase-option.selected {
  border-color: #16a34a;
  background: #f0fdf4;
  box-shadow: inset 0 0 0 1px rgba(34, 197, 94, 0.25);
}

.phase-index {
  width: 1.85rem;
  height: 1.85rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 800;
  color: #15803d;
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
  flex-shrink: 0;
}

.phase-option.selected .phase-index {
  background: #052e16;
  border-color: #052e16;
  color: #fff;
}

.phase-copy {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.phase-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: #052e16;
}

.phase-rule {
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #166534;
}

.phase-hint {
  font-size: 0.78rem;
  line-height: 1.45;
  color: #6b7280;
}

.workflow-section {
  gap: 0.85rem;
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.phase-counter {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #15803d;
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
  border-radius: 999px;
  padding: 0.22rem 0.55rem;
  white-space: nowrap;
}

.hold-toggle {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin-top: 0.75rem;
  font-size: 0.86rem;
  font-weight: 600;
  color: #374151;
}

.followup-btn {
  width: 100%;
}

.read-only-block {
  background: #f9fafb;
  border-radius: 12px;
  padding: 0.85rem;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.85rem;
  margin-bottom: 0.85rem;
}

.section-head h3 {
  margin: 0;
}

.order-recap {
  padding: 1rem 1.05rem;
  border-radius: 16px;
  background: linear-gradient(180deg, #fafafa 0%, #f5f7f6 100%);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.order-total {
  flex-shrink: 0;
  font-size: 0.92rem;
  font-weight: 800;
  color: #15803d;
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
  border-radius: 999px;
  padding: 0.3rem 0.65rem;
}

.order-lines-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.84rem;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.order-lines-table th,
.order-lines-table td {
  padding: 0.55rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.order-lines-table th {
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #9ca3af;
  background: #f9fafb;
}

.order-lines-table tbody tr:last-child td {
  border-bottom: none;
}

.order-lines-table td:nth-child(2),
.order-lines-table td:nth-child(3),
.order-lines-table th:nth-child(2),
.order-lines-table th:nth-child(3) {
  width: 4.5rem;
  white-space: nowrap;
}

.legacy-order-text {
  margin: 0;
  padding: 0.85rem 0.95rem;
  border-radius: 12px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  font-size: 0.86rem;
  line-height: 1.55;
  color: #374151;
}

.site-section,
.client-update-section {
  padding: 1rem 1.05rem;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: #fff;
}

.site-section {
  background: linear-gradient(180deg, #fff 0%, #f8fcf9 100%);
}

.rg-tag,
.visibility-badge {
  flex-shrink: 0;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 999px;
  padding: 0.22rem 0.55rem;
}

.rg-tag {
  color: #166534;
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
}

.visibility-badge {
  color: #1e3a8a;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

.client-message-preview {
  margin-top: 0.15rem;
  padding: 0.85rem 0.95rem;
  border-radius: 12px;
  background: #f8fcf9;
  border: 1px dashed rgba(34, 197, 94, 0.35);
}

.preview-label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #16a34a;
}

.client-message-preview p {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.55;
  color: #374151;
}

.empty-client-message {
  margin: 0;
  font-size: 0.82rem;
  color: #9ca3af;
  font-style: italic;
}

.internal-section {
  padding: 1rem 1.05rem;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: linear-gradient(180deg, #fff 0%, #fafafa 100%);
}

.team-badge {
  flex-shrink: 0;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 999px;
  padding: 0.22rem 0.55rem;
  color: #374151;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
}

.note-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}

.note-chip {
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #fff;
  color: #374151;
  border-radius: 999px;
  padding: 0.3rem 0.65rem;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.note-chip:hover {
  border-color: rgba(34, 197, 94, 0.35);
  background: #f8fcf9;
}

.trace-panel {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.trace-panel-head {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.25rem;
}

.trace-panel-head h4 {
  margin: 0;
  font-size: 0.88rem;
  font-weight: 800;
  color: #052e16;
}

.trace-count {
  font-size: 0.68rem;
  font-weight: 800;
  color: #15803d;
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
  border-radius: 999px;
  padding: 0.12rem 0.4rem;
}

.trace-intro {
  margin: 0 0 0.75rem;
  font-size: 0.78rem;
  color: #6b7280;
}

.trace-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  max-height: 260px;
  overflow-y: auto;
}

.trace-item {
  padding: 0.75rem 0.85rem;
  border-radius: 12px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.trace-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.35rem;
}

.trace-meta strong {
  font-size: 0.82rem;
  color: #052e16;
}

.trace-meta time {
  font-size: 0.72rem;
  color: #9ca3af;
  white-space: nowrap;
}

.trace-summary {
  margin: 0 0 0.35rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
}

.trace-changes {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.trace-changes li {
  font-size: 0.76rem;
  line-height: 1.45;
  color: #6b7280;
  padding-left: 0.65rem;
  position: relative;
}

.trace-changes li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #16a34a;
}

.trace-empty {
  margin: 0;
  font-size: 0.82rem;
  color: #9ca3af;
  font-style: italic;
}

.form-success {
  margin: 0 1.5rem;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
  color: #166534;
  font-size: 0.84rem;
  font-weight: 600;
}

.drawer-section .drawer-fields label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: #374151;
}

.drawer-section .drawer-fields input,
.drawer-section .drawer-fields textarea {
  padding: 0.65rem 0.8rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-family: inherit;
  font-size: 0.92rem;
}

.drawer-section .drawer-fields input:focus,
.drawer-section .drawer-fields textarea:focus {
  outline: none;
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
}

.drawer-sub {
  font-size: 0.82rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.project-drawer {
  width: min(680px, 100vw);
}

.drawer-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.drawer-section h3 {
  font-size: 0.95rem;
  font-weight: 800;
  color: #052e16;
  margin: 0;
}

.section-hint {
  font-size: 0.82rem;
  color: #6b7280;
  margin: -0.25rem 0 0;
}

.workflow-timeline {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.timeline-step {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: #fafafa;
  font-size: 0.88rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
}

.timeline-step.done {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #15803d;
}

.timeline-step.on-hold {
  border-style: dashed;
}

.progress-preview {
  font-size: 0.82rem;
  color: #16a34a;
  font-weight: 700;
}

.mini-progress {
  height: 6px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 0.25rem;
  min-width: 80px;
}

.mini-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #16a34a);
}

.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 13, 7, 0.45);
  z-index: 100;
  display: flex;
  justify-content: flex-end;
}

.product-drawer {
  width: min(560px, 100vw);
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.12);
}

.product-editor {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-height: calc(100vh - 8rem);
}

.product-editor-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.product-editor-header h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.4rem, 2.5vw, 1.85rem);
  font-weight: 800;
  color: #052e16;
  margin: 0.15rem 0 0;
}

.back-catalog-btn {
  border: none;
  background: transparent;
  color: #6b7280;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 0;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.back-catalog-btn:hover {
  color: #16a34a;
}

.product-editor-actions {
  display: flex;
  gap: 0.65rem;
  flex-shrink: 0;
}

.product-editor-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1;
}

.product-editor-grid {
  display: grid;
  grid-template-columns: minmax(260px, 340px) 1fr;
  gap: 1.5rem;
  align-items: start;
}

.product-editor-media {
  position: sticky;
  top: 1rem;
}

.media-card {
  background: #f8faf9;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 14px;
  padding: 1rem;
}

.media-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.media-card-header h2 {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #15803d;
}

.media-card-header span {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
}

.upload-zone-lg {
  min-height: 280px;
}

.upload-zone-lg .upload-preview {
  height: 280px;
}

.image-thumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.image-thumb {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid transparent;
  padding: 0;
  background: #eef4f0;
  cursor: pointer;
}

.image-thumb.active {
  border-color: #22c55e;
}

.image-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-remove {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
}

.add-thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(34, 197, 94, 0.4);
  color: #16a34a;
  font-size: 1.4rem;
  font-weight: 700;
}

.section-head-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.9rem;
}

.section-head-row h2 {
  margin: 0;
}

.small-btn {
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
}

.docs-empty {
  padding: 1rem;
  border-radius: 10px;
  background: #fff;
  border: 1px dashed rgba(0, 0, 0, 0.1);
  color: #6b7280;
  font-size: 0.88rem;
}

.document-rows {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.document-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr auto;
  gap: 0.75rem;
  align-items: end;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 0.85rem;
}

.doc-name,
.doc-file {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #374151;
}

.doc-name input {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 0.65rem 0.75rem;
  font: inherit;
  font-weight: 500;
}

.doc-file-box {
  position: relative;
  border: 1px dashed rgba(34, 197, 94, 0.4);
  border-radius: 10px;
  padding: 0.65rem 0.75rem;
  background: #f7fcf9;
  overflow: hidden;
}

.doc-file-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #15803d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.doc-file-box input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.doc-remove {
  margin-bottom: 0.15rem;
}

@media (max-width: 960px) {
  .document-row {
    grid-template-columns: 1fr;
  }
}

.product-editor-fields {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.editor-section {
  background: #f8faf9;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 14px;
  padding: 1.15rem 1.25rem;
}

.editor-section h2 {
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #15803d;
  margin: 0 0 0.9rem;
}

.editor-section-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.9rem 1rem;
}

.editor-section-grid .span-2 {
  grid-column: span 2;
}

.editor-section-grid label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: #374151;
}

.editor-section-grid input,
.editor-section-grid select,
.editor-section-grid textarea {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 0.65rem 0.75rem;
  font: inherit;
  font-weight: 500;
  color: #052e16;
  background: #fff;
}

.editor-section-grid input:focus,
.editor-section-grid select:focus,
.editor-section-grid textarea:focus {
  outline: none;
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
}

.product-editor-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  position: sticky;
  bottom: 0;
  background: #fff;
  padding-bottom: 0.25rem;
}

@media (max-width: 960px) {
  .product-editor-grid {
    grid-template-columns: 1fr;
  }

  .product-editor-media {
    position: static;
  }

  .product-editor-header {
    flex-direction: column;
  }

  .editor-section-grid {
    grid-template-columns: 1fr;
  }

  .editor-section-grid .span-2 {
    grid-column: span 1;
  }
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.drawer-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #16a34a;
  margin-bottom: 0.25rem;
}

.drawer-header h2 {
  font-size: 1.25rem;
  font-weight: 800;
  color: #052e16;
}

.drawer-close {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: #f3f4f6;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  color: #6b7280;
}

.drawer-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.drawer-layout {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.upload-zone {
  position: relative;
  min-height: 200px;
  border: 2px dashed rgba(34, 197, 94, 0.35);
  border-radius: 14px;
  background: #f7fcf9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.upload-zone.has-image {
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.08);
  background: #f3f4f6;
}

.upload-placeholder {
  text-align: center;
  color: #6b7280;
  pointer-events: none;
}

.upload-placeholder p {
  margin-top: 0.5rem;
  font-weight: 700;
  color: #374151;
}

.upload-placeholder span {
  font-size: 0.82rem;
}

.upload-preview {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.upload-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.upload-clear {
  position: absolute;
  top: 0.65rem;
  right: 0.65rem;
  z-index: 2;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 0.35rem 0.65rem;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  color: #b91c1c;
}

.drawer-fields {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  max-height: min(70vh, 640px);
  overflow-y: auto;
  padding-right: 0.25rem;
}

.drawer-row-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.field-hint {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.72rem;
  color: #6b7280;
  font-weight: 500;
}

.linkish-btn {
  margin-top: 0.4rem;
  border: none;
  background: transparent;
  color: #15803d;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0;
  cursor: pointer;
  text-align: left;
}

.linkish-btn:hover {
  color: #166534;
  text-decoration: underline;
}

.new-category-box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem 1rem;
  padding: 0.9rem;
  border-radius: 12px;
  background: #fff;
  border: 1px dashed rgba(34, 197, 94, 0.45);
}

.new-category-box label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #374151;
}

.new-category-box input {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 0.65rem 0.75rem;
  font: inherit;
  font-weight: 500;
}

.new-category-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 960px) {
  .new-category-box {
    grid-template-columns: 1fr;
  }
}

.drawer-fields label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: #374151;
}

.drawer-fields input,
.drawer-fields select,
.drawer-fields textarea {
  padding: 0.65rem 0.8rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-family: inherit;
  font-size: 0.92rem;
}

.drawer-fields input:focus,
.drawer-fields select:focus,
.drawer-fields textarea:focus {
  outline: none;
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
}

.drawer-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: #fafafa;
}

@media (max-width: 900px) {
  .catalog-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .catalog-table-wrap {
    overflow-x: auto;
  }

  .catalog-table {
    min-width: 720px;
  }
}

@media (max-width: 768px) {
  .drawer-row,
  .drawer-row-3 {
    grid-template-columns: 1fr;
  }
}

.step-checklist {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checklist-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.15rem;
}

.step-check {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 0.75rem;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: #f9fafb;
  font-size: 0.88rem;
  color: #374151;
  cursor: pointer;
}

.step-check.done {
  background: rgba(34, 197, 94, 0.08);
  border-color: rgba(34, 197, 94, 0.2);
  color: #15803d;
}

.step-check.on-hold {
  margin-top: 0.35rem;
  background: #fffbeb;
  border-color: #fde68a;
}

.visit-stat {
  font-size: 1.1rem;
  font-weight: 700;
  color: #052e16;
  margin-bottom: 0.75rem;
}

.quote-summary {
  margin-top: 0.75rem;
  font-size: 0.88rem;
  color: #374151;
}

.quote-form {
  margin-top: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.quote-form-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.65rem;
}

.quote-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.quote-row input {
  width: 120px;
  padding: 0.35rem 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.primary-btn.small {
  padding: 0.45rem 0.75rem;
  font-size: 0.82rem;
  margin-top: 0.5rem;
}

.confirmed-tag {
  margin-left: 0.5rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: #15803d;
}

.project-head small {
  display: block;
  margin-top: 0.25rem;
  color: #9ca3af;
  font-size: 0.78rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

/* ─── Operations Dispatch Section ────────────────── */
.ops-panel {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.ops-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ops-kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.ops-kpi-card {
  background: #ffffff;
  border: 1px solid rgba(5, 46, 22, 0.08);
  border-radius: 14px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.kpi-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.kpi-icon-wrap.green { background: #dcfce7; color: #16a34a; }
.kpi-icon-wrap.blue { background: #e0f2fe; color: #0284c7; }
.kpi-icon-wrap.orange { background: #ffedd5; color: #ea580c; }
.kpi-icon-wrap.purple { background: #f3e8ff; color: #9333ea; }

.kpi-num {
  display: block;
  font-size: 1.6rem;
  font-weight: 800;
  color: #052e16;
  line-height: 1.1;
}

.kpi-lbl {
  font-size: 0.78rem;
  font-weight: 600;
  color: #6b7280;
}

.ops-nav-tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.ops-subtab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.1rem;
  border-radius: 10px;
  background: transparent;
  border: none;
  font-weight: 600;
  font-size: 0.9rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.ops-subtab-btn:hover {
  background: rgba(22, 163, 74, 0.06);
  color: #16a34a;
}

.ops-subtab-btn.active {
  background: #052e16;
  color: #4ade80;
}

.tab-badge {
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}

/* Calendar Date Strip */
.date-strip {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.day-chip {
  flex: 1;
  min-width: 80px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 0.75rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.day-chip:hover {
  border-color: #16a34a;
}

.day-chip.selected {
  background: #16a34a;
  color: #ffffff;
  border-color: #16a34a;
  box-shadow: 0 4px 14px rgba(22, 163, 74, 0.3);
}

.day-name {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.8;
}

.day-num {
  font-size: 1.4rem;
  font-weight: 800;
}

.day-dot {
  width: 6px;
  height: 6px;
  background: #3b82f6;
  border-radius: 50%;
  margin-top: 4px;
}
.day-chip.selected .day-dot {
  background: #ffffff;
}

/* Schedule Matrix */
.calendar-grid-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.25rem;
  margin-top: 1rem;
}

.schedule-matrix {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  overflow: hidden;
}

.matrix-header {
  display: grid;
  grid-template-columns: 200px 1fr 1fr;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 700;
  font-size: 0.82rem;
  color: #374151;
  padding: 0.75rem 1rem;
}

.matrix-row {
  display: grid;
  grid-template-columns: 200px 1fr 1fr;
  border-bottom: 1px solid #f3f4f6;
  min-height: 110px;
}

.op-cell {
  padding: 1rem;
  border-right: 1px solid #f3f4f6;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  background: #fafafa;
}

.op-mini-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.85rem;
}

.op-mini-info strong {
  display: block;
  font-size: 0.88rem;
  color: #111827;
}

.duty-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-right: 4px;
}
.duty-onduty { background: #22c55e; }
.duty-onbreak { background: #f59e0b; }
.duty-offduty { background: #9ca3af; }

.slot-cell {
  padding: 0.75rem;
  border-right: 1px solid #f3f4f6;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}

.schedule-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-left: 4px solid #3b82f6;
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.schedule-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.schedule-card.installation { border-left-color: #16a34a; background: #f0fdf4; }
.schedule-card.maintenance { border-left-color: #d97706; background: #fffbeb; }
.schedule-card.delivery { border-left-color: #9333ea; background: #faf5ff; }
.schedule-card.study { border-left-color: #0891b2; background: #ecfeff; }

.sched-card-top {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.sched-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
}

.sched-client {
  font-size: 0.75rem;
  color: #64748b;
}

.add-slot-btn {
  background: transparent;
  border: 1px dashed #cbd5e1;
  color: #64748b;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
  margin-top: auto;
}

.add-slot-btn:hover {
  border-color: #16a34a;
  color: #16a34a;
  background: #f0fdf4;
}

/* Agenda Sidebar */
.day-agenda-sidebar {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  padding: 1.25rem;
}

.day-agenda-sidebar h3 {
  font-size: 1rem;
  font-weight: 800;
  color: #052e16;
  margin-bottom: 0.25rem;
}

.agenda-date-label {
  font-size: 0.82rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.agenda-empty {
  font-size: 0.85rem;
  color: #9ca3af;
  font-style: italic;
  padding: 2rem 0;
  text-align: center;
}

.agenda-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.agenda-card {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.75rem;
  cursor: pointer;
  transition: background 0.15s;
}
.agenda-card:hover { background: #f9fafb; }

.agenda-card-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.35rem;
}

.agenda-card h4 {
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
}

.agenda-op, .agenda-time {
  font-size: 0.75rem;
  color: #4b5563;
  margin: 0;
}

/* Operators Roster Grid */
.roster-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.op-roster-card {
  background: #ffffff;
  border: 1px solid rgba(5, 46, 22, 0.08);
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
}

.op-card-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}

.op-avatar-lg {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.op-header-text h3 {
  font-size: 0.95rem;
  font-weight: 800;
  color: #052e16;
  margin: 0 0 0.15rem 0;
}

.op-role {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.35rem;
}

.op-status-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.duty-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
}
.duty-badge.duty-onduty { background: #dcfce7; color: #15803d; }
.duty-badge.duty-onbreak { background: #fef3c7; color: #b45309; }
.duty-badge.duty-offduty { background: #f3f4f6; color: #4b5563; }

.op-rating {
  font-size: 0.75rem;
  font-weight: 700;
  color: #d97706;
}

.op-card-body {
  border-top: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
  padding: 0.85rem 0;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.op-detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}
.op-detail-item .lbl { color: #6b7280; }
.op-detail-item .val { font-weight: 600; color: #1f2937; }

.workload-tag {
  background: #eff6ff;
  color: #1d4ed8;
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0.1rem 0.45rem;
  border-radius: 6px;
}

.op-specialties {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.35rem;
}

.spec-chip {
  background: #f3f4f6;
  color: #374151;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  text-transform: capitalize;
}

.op-card-footer .full {
  width: 100%;
  justify-content: center;
}

/* Tasks Queue View */
.queue-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  gap: 0.75rem;
}

.filter-group select {
  padding: 0.55rem 0.85rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 0.85rem;
  background: #ffffff;
}

.ops-task-title {
  font-size: 0.88rem;
  color: #0f172a;
}

.ops-task-sub {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.15rem;
}

.type-badge {
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  display: inline-block;
}
.type-badge.installation { background: #dcfce7; color: #15803d; }
.type-badge.maintenance { background: #fef3c7; color: #b45309; }
.type-badge.delivery { background: #f3e8ff; color: #6d28d9; }
.type-badge.study { background: #cff4fc; color: #055160; }

.prio-badge {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: capitalize;
}
.prio-badge.urgent { color: #dc2626; font-weight: 800; }
.prio-badge.high { color: #ea580c; }
.prio-badge.medium { color: #d97706; }
.prio-badge.low { color: #16a34a; }

/* Modal Form Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.ops-modal {
  background: #ffffff;
  border-radius: 18px;
  width: 100%;
  max-width: 650px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.85rem;
  margin-bottom: 1.25rem;
}

.modal-header h3 {
  font-size: 1.1rem;
  font-weight: 800;
  color: #052e16;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #9ca3af;
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-section-title {
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #16a34a;
  margin-top: 0.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
  margin-top: 1rem;
}
</style>

