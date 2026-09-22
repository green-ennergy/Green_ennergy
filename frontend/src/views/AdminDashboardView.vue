<template>
  <!-- <div class="admin-page" v-if="user"> -->
  <div class="admin-page">
    <div class="admin-layout">
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
          <template v-for="tab in tabs" :key="tab.id">
            <button
              class="nav-btn"
              :class="{ active: activeTab === tab.id, open: tab.children && missionMenuOpen }"
              @click="tab.children ? toggleMissionMenu() : switchTab(tab.id)"
            >
              <span class="nav-icon"><AdminIcon :name="tab.icon" :size="18" /></span>
              <span>{{ tab.label }}</span>
              <span v-if="tab.badge" class="nav-badge">{{ tab.badge }}</span>
              <span v-if="tab.children" class="nav-caret" :class="{ open: missionMenuOpen }" aria-hidden="true"></span>
            </button>
            <div v-if="tab.children && missionMenuOpen" class="nav-sub">
              <button
                v-for="child in tab.children"
                :key="child.id"
                type="button"
                class="nav-sub-btn"
                :class="{ active: activeTab === tab.id && opsSection === child.id }"
                @click="openOpsSection(child.id)"
              >
                {{ child.label }}
              </button>
            </div>
          </template>
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
        <section v-if="activeTab === 'orders'" class="panel orders-panel">
          <header class="panel-header orders-header">
            <div>
              <h1>{{ t('admin.orders.title') }}</h1>
              <p>{{ t('admin.orders.subtitle') }}</p>
            </div>
            <div class="orders-header-tools">
              <div class="orders-view-tabs" role="tablist">
                <button
                  type="button"
                  class="orders-view-tab"
                  :class="{ active: ordersView === 'new' }"
                  @click="ordersView = 'new'"
                >
                  {{ t('admin.orders.newSection') }}
                  <span v-if="newRfqs.length" class="orders-count">{{ newRfqs.length }}</span>
                </button>
                <button
                  type="button"
                  class="orders-view-tab"
                  :class="{ active: ordersView === 'active' }"
                  @click="ordersView = 'active'"
                >
                  {{ t('admin.orders.activeSection') }}
                  <span v-if="activeRfqs.length" class="orders-count muted">{{ activeRfqs.length }}</span>
                </button>
                <button
                  type="button"
                  class="orders-view-tab"
                  :class="{ active: ordersView === 'all' }"
                  @click="ordersView = 'all'"
                >
                  {{ t('admin.orders.allSection') }}
                </button>
              </div>
              <select v-model="rfqFilter" @change="loadOrders" class="filter-select">
                <option value="">{{ t('admin.filters.allStatuses') }}</option>
                <option value="review">{{ t('admin.filters.review') }}</option>
                <option value="engineering">{{ t('admin.filters.engineering') }}</option>
                <option value="issued">{{ t('admin.filters.issued') }}</option>
                <option value="dispatched">{{ t('admin.filters.dispatched') }}</option>
              </select>
            </div>
          </header>

          <div class="orders-summary">
            <div class="orders-stat new">
              <strong>{{ newRfqs.length }}</strong>
              <span>{{ t('admin.orders.statNew') }}</span>
            </div>
            <div class="orders-stat">
              <strong>{{ activeRfqs.length }}</strong>
              <span>{{ t('admin.orders.statActive') }}</span>
            </div>
            <div class="orders-stat">
              <strong>{{ rfqs.length }}</strong>
              <span>{{ t('admin.orders.statTotal') }}</span>
            </div>
          </div>

          <div v-if="!visibleOrdersRfqs.length && !isLoading" class="empty-state orders-empty">
            <p>{{ ordersEmptyMessage }}</p>
          </div>

          <template v-else>
            <div
              v-for="section in ordersDisplaySections"
              :key="section.id"
              class="orders-section"
            >
              <header v-if="section.showHead" class="orders-section-head">
                <h2>{{ section.title }}</h2>
                <span>{{ section.hint }}</span>
              </header>

              <div class="rfq-list">
                <article
                  v-for="rfq in section.items"
                  :key="section.id + '-' + rfq.id"
                  class="rfq-card"
                  :class="{ 'rfq-card--new': rfq.status === 'review' }"
                >
                  <div class="rfq-card-top">
                    <div class="rfq-card-identity">
                      <div class="rfq-id-row">
                        <span class="rfq-id">{{ rfq.ticket_number }}</span>
                        <span v-if="rfq.status === 'review'" class="rfq-new-badge">{{ t('admin.orders.newBadge') }}</span>
                      </div>
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

                  <div class="rfq-card-meta">
                    <span>{{ t('admin.orders.linesCount', { n: rfq.items?.length || 0 }) }}</span>
                    <span v-if="rfq.quoted_total">{{ formatMoney(rfqQuoteTotal(rfq)) }}</span>
                    <span v-if="rfq.client_confirmed" class="confirmed-tag">{{ t('admin.orders.clientConfirmed') }}</span>
                  </div>

                  <details class="rfq-details">
                    <summary>{{ t('admin.orders.showLines') }}</summary>
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
                  </details>

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
            </div>
          </template>

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
            <div class="header-actions">
              <select v-model="projectFilter" @change="loadProjects" class="filter-select">
                <option value="">{{ t('admin.projects.allPhases') }}</option>
                <option value="quote_confirmed">{{ t('followup.steps.quote_confirmed.label') }}</option>
                <option value="order_prep">{{ t('followup.steps.order_prep.label') }}</option>
                <option value="installation">{{ t('followup.steps.installation.label') }}</option>
                <option value="completed">{{ t('followup.steps.completed.label') }}</option>
                <option value="on_hold">{{ t('followup.status.on_hold') }}</option>
              </select>
              <button type="button" class="primary-btn" @click="openCreateProject">
                <AdminIcon name="plus" size="16" />
                <span>{{ t('admin.projects.newProject') }}</span>
              </button>
            </div>
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
                <button type="button" class="ghost-btn followup-btn" @click="openProjectDrawer(project)">
                  {{ t('admin.projects.updateFollowup') }}
                </button>
              </template>
            </FollowupCard>
          </div>

          <div v-if="showProjectDrawer && editingProject" class="project-workspace">
            <header class="project-workspace-header">
              <div class="project-workspace-title">
                <button type="button" class="pw-back" @click="closeProjectDrawer">
                  ← {{ t('admin.projects.backToList') }}
                </button>
                <div class="pw-title-row">
                  <h2>{{ editingProject.name }}</h2>
                  <span class="pw-status" :class="editingProject.status">
                    {{ projectStatusLabel(editingProject.status) }}
                  </span>
                </div>
                <div class="pw-meta">
                  <span v-if="editingProject.user" class="pw-chip">
                    {{ editingProject.user.company || editingProject.user.name }}
                  </span>
                  <span
                    v-for="ticket in editingQuotes"
                    :key="ticket.id"
                    class="pw-chip"
                  >{{ ticket.ticket_number }}</span>
                  <span class="pw-chip muted">
                    {{ t('admin.drawer.stepCounter', { current: previewStepNumber, total: projectStepDefs.length }) }}
                  </span>
                </div>
              </div>
            </header>

            <form class="project-workspace-form" @submit.prevent="handleSaveProject">
              <div class="project-workspace-layout">
                <aside class="pw-rail">
                  <section class="drawer-section workflow-section">
                    <div class="wf-head">
                      <div>
                        <p class="wf-kicker">{{ t('admin.drawer.workflowPhase') }}</p>
                        <h3 class="wf-title">
                          {{ projectForm.on_hold ? t('followup.onHoldTitle') : (projectStepDefs[previewStepNumber - 1]?.label || '') }}
                        </h3>
                      </div>
                      <span class="phase-counter">{{ previewStepNumber }}/{{ projectStepDefs.length }}</span>
                    </div>

                    <div class="wf-progress" aria-hidden="true">
                      <span
                        class="wf-progress-fill"
                        :style="{ width: `${(previewStepNumber / projectStepDefs.length) * 100}%` }"
                      />
                    </div>

                    <ol class="wf-steps">
                      <li
                        v-for="(step, index) in projectStepDefs"
                        :key="step.key"
                        class="wf-step"
                        :class="{
                          done: !projectForm.on_hold && index + 1 < previewStepNumber,
                          current: !projectForm.on_hold && projectForm.current_phase === step.key,
                          muted: projectForm.on_hold || index + 1 > previewStepNumber
                        }"
                      >
                        <button
                          type="button"
                          class="wf-step-btn"
                          @click="projectForm.current_phase = step.key; projectForm.on_hold = false"
                        >
                          <span class="wf-dot" aria-hidden="true">
                            <span v-if="!projectForm.on_hold && index + 1 < previewStepNumber" class="wf-check">✓</span>
                            <span v-else>{{ index + 1 }}</span>
                          </span>
                          <span class="wf-step-copy">
                            <span class="wf-step-name">{{ step.label }}</span>
                            <span
                              v-if="projectForm.current_phase === step.key && !projectForm.on_hold"
                              class="wf-step-hint"
                            >{{ step.adminHint }}</span>
                          </span>
                        </button>
                      </li>
                    </ol>

                    <label class="hold-toggle" :class="{ active: projectForm.on_hold }">
                      <input type="checkbox" v-model="projectForm.on_hold" />
                      <span>{{ t('admin.drawer.putOnHold') }}</span>
                    </label>
                  </section>

                  <section class="drawer-section site-section">
                    <h3>{{ t('admin.drawer.installationSite') }}</h3>
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

                  <section class="drawer-section">
                    <h3>{{ t('admin.projects.assignQuotes') }}</h3>
                    <div class="quote-picks">
                      <label v-for="quote in clientQuotes" :key="quote.id">
                        <input v-model="selectedQuoteIds" type="checkbox" :value="quote.id" />
                        <span>{{ quote.ticket_number }}</span>
                        <small>{{ quote.company || '—' }}</small>
                      </label>
                      <p v-if="!clientQuotes.length" class="thread-empty">{{ t('admin.projects.noQuotes') }}</p>
                    </div>
                  </section>
                </aside>

                <div class="pw-main">
                  <section v-for="ticket in editingQuotes" :key="ticket.id" class="drawer-section order-recap">
                    <div class="section-head">
                      <div>
                        <p class="pw-kicker">{{ t('admin.drawer.followup') }}</p>
                        <h3>{{ ticket.ticket_number }}</h3>
                      </div>
                      <span v-if="ticket.quoted_total != null" class="order-total">{{ formatMoney(ticket.quoted_total) }}</span>
                    </div>
                    <table v-if="ticket.items?.length" class="order-lines-table">
                      <thead>
                        <tr>
                          <th>{{ t('rfq.table.item') }}</th>
                          <th>{{ t('common.quantity') }}</th>
                          <th>{{ t('admin.projects.unitPrice') }}</th>
                          <th>{{ t('common.total') }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in ticket.items" :key="item.id">
                          <td>{{ rfqItemLabel(item) }}</td>
                          <td>{{ item.quantity }}</td>
                          <td>{{ item.unit_price != null ? formatMoney(Number(item.unit_price)) : '—' }}</td>
                          <td>{{ item.line_total != null ? formatMoney(item.line_total) : '—' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </section>

                  <section class="drawer-section">
                    <ProjectCatalogPicker
                      :model-value="projectLines"
                      :products="products"
                      :categories="adminCategories"
                      :loading="isLoading && !products.length"
                      :price-references="projectPriceReferences"
                      @update:model-value="onProjectLinesUpdate"
                      @refresh="loadCatalogForPicker"
                    />
                  </section>

                  <div class="pw-services">
                    <section class="drawer-section">
                      <div class="section-head">
                        <h3>{{ t('admin.projects.installations') }}</h3>
                        <button
                          type="button"
                          class="action-btn"
                          :title="t('admin.projects.addInstallation')"
                          :aria-label="t('admin.projects.addInstallation')"
                          @click="projectInstallations.push(blankInstallation())"
                        >
                          <AdminIcon name="plus" :size="15" />
                        </button>
                      </div>
                      <p v-if="!projectInstallations.length" class="pw-empty">{{ t('admin.projects.noInstallations') }}</p>
                      <div v-for="(row, index) in projectInstallations" :key="row.id || index" class="service-card service-card-simple">
                        <div class="service-simple-top">
                          <label class="service-price-field">
                            <span>{{ t('admin.projects.price') }}</span>
                            <div class="price-input-wrap">
                              <input v-model="row.price" type="number" min="0" step="0.01" placeholder="0.00" />
                              <span class="price-suffix">MAD</span>
                            </div>
                          </label>
                          <button
                            type="button"
                            class="action-btn danger service-remove"
                            :title="t('admin.projects.remove')"
                            :aria-label="t('admin.projects.remove')"
                            @click="projectInstallations.splice(index, 1)"
                          >
                            <AdminIcon name="trash" :size="15" />
                          </button>
                        </div>
                        <label class="service-details-field">
                          <span>{{ t('admin.projects.description') }}</span>
                          <textarea v-model="row.description" rows="2" :placeholder="t('admin.projects.serviceDetailsPlaceholder')"></textarea>
                        </label>
                      </div>
                    </section>

                    <section class="drawer-section">
                      <div class="section-head">
                        <h3>{{ t('admin.projects.maintenances') }}</h3>
                        <button
                          type="button"
                          class="action-btn"
                          :title="t('admin.projects.addMaintenance')"
                          :aria-label="t('admin.projects.addMaintenance')"
                          @click="projectMaintenances.push(blankMaintenance())"
                        >
                          <AdminIcon name="plus" :size="15" />
                        </button>
                      </div>
                      <p v-if="!projectMaintenances.length" class="pw-empty">{{ t('admin.projects.noMaintenances') }}</p>
                      <div v-for="(row, index) in projectMaintenances" :key="row.id || index" class="service-card service-card-simple">
                        <div class="service-simple-top">
                          <label class="service-price-field">
                            <span>{{ t('admin.projects.price') }}</span>
                            <div class="price-input-wrap">
                              <input v-model="row.price" type="number" min="0" step="0.01" placeholder="0.00" />
                              <span class="price-suffix">MAD</span>
                            </div>
                          </label>
                          <button
                            type="button"
                            class="action-btn danger service-remove"
                            :title="t('admin.projects.remove')"
                            :aria-label="t('admin.projects.remove')"
                            @click="projectMaintenances.splice(index, 1)"
                          >
                            <AdminIcon name="trash" :size="15" />
                          </button>
                        </div>
                        <label class="service-details-field">
                          <span>{{ t('admin.projects.description') }}</span>
                          <textarea v-model="row.description" rows="2" :placeholder="t('admin.projects.serviceDetailsPlaceholder')"></textarea>
                        </label>
                      </div>
                    </section>
                  </div>

                  <div class="pw-comms">
                    <section class="drawer-section client-update-section">
                      <h3>{{ t('admin.drawer.messagesTitle') }}</h3>
                      <div class="thread">
                        <p v-if="!projectMessages.length" class="thread-empty">{{ t('admin.drawer.emptyThread') }}</p>
                        <article
                          v-for="message in projectMessages"
                          :key="message.id"
                          class="thread-item"
                          :class="message.author"
                        >
                          <header>
                            <strong>{{ message.author === 'client' ? (message.user?.name || t('admin.drawer.clientLabel')) : (message.user?.name || t('admin.drawer.teamLabel')) }}</strong>
                            <time>{{ formatDate(message.created_at) }}</time>
                          </header>
                          <p>{{ message.body }}</p>
                        </article>
                      </div>
                      <div class="thread-compose">
                        <textarea
                          v-model="replyDraft"
                          rows="3"
                          :placeholder="t('admin.drawer.replyPlaceholder')"
                          @keydown.enter.exact.prevent="sendProjectReply"
                        ></textarea>
                        <button type="button" class="primary-btn" :disabled="replySending || !replyDraft.trim()" @click="sendProjectReply">
                          {{ t('admin.drawer.sendReply') }}
                        </button>
                      </div>
                    </section>

                    <section class="drawer-section internal-section">
                      <div class="section-head">
                        <h3>{{ t('admin.drawer.internalNotes') }}</h3>
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
                </div>
              </div>

              <p v-if="projectSaveSuccess" class="form-success project-workspace-msg">{{ projectSaveSuccess }}</p>
              <p v-if="projectFormError" class="form-error project-workspace-msg">{{ projectFormError }}</p>

              <footer class="project-workspace-footer">
                <button type="button" class="ghost-btn" @click="closeProjectDrawer">{{ t('common.cancel') }}</button>
                <button type="submit" class="primary-btn" :disabled="projectSaving">
                  {{ projectSaving ? t('admin.projects.saving') : t('admin.projects.saveFollowup') }}
                </button>
              </footer>
            </form>
          </div>

          <div v-if="showCreateProject" class="modal-overlay project-create-overlay" @click.self="showCreateProject = false">
            <div class="ops-modal project-create-modal" role="dialog" aria-modal="true">
              <header class="modal-header">
                <div>
                  <p class="modal-kicker">{{ t('admin.projects.newProject') }}</p>
                  <h3>{{ t('admin.projects.createTitle') }}</h3>
                </div>
                <button type="button" class="close-btn" @click="showCreateProject = false">×</button>
              </header>
              <form class="task-form" @submit.prevent="submitCreateProject">
                <div class="modal-body project-create-body">
                  <section class="create-section">
                    <div class="create-section-head">
                      <h4>{{ t('admin.projects.createEssentials') }}</h4>
                      <p>{{ t('admin.projects.createEssentialsHint') }}</p>
                    </div>
                    <div class="create-essentials-grid">
                      <label>
                        <span>{{ t('admin.projects.projectName') }}</span>
                        <input v-model="createProjectForm.name" type="text" required />
                      </label>
                      <label>
                        <span>{{ t('admin.projects.selectClient') }}</span>
                        <select v-model="createProjectForm.id_client" required @change="onCreateClientChange">
                          <option value="">{{ t('admin.projects.selectClientPlaceholder') }}</option>
                          <option v-for="client in users" :key="client.id_client" :value="client.id_client">
                            {{ client.company || client.name }}
                          </option>
                        </select>
                      </label>
                      <label>
                        <span>{{ t('admin.drawer.location') }}</span>
                        <input v-model="createProjectForm.location" type="text" :placeholder="t('admin.drawer.locationPlaceholder')" />
                      </label>
                      <label class="create-span-2">
                        <span>{{ t('admin.projects.description') }}</span>
                        <textarea v-model="createProjectForm.description" rows="2" :placeholder="t('admin.projects.descriptionPlaceholder')"></textarea>
                      </label>
                    </div>
                  </section>

                  <section class="create-section">
                    <div class="create-section-head">
                      <h4>{{ t('admin.projects.assignQuotes') }}</h4>
                      <p>{{ t('admin.projects.assignQuotesHint') }}</p>
                    </div>
                    <div class="create-quotes">
                      <template v-if="!createProjectForm.id_client">
                        <p class="create-empty">{{ t('admin.projects.pickClientFirst') }}</p>
                      </template>
                      <template v-else-if="!createClientQuotes.length">
                        <p class="create-empty">{{ t('admin.projects.noQuotes') }}</p>
                      </template>
                      <div v-else class="quote-picks create-quote-picks">
                        <label v-for="quote in createClientQuotes" :key="quote.id" class="create-quote-chip">
                          <input v-model="createProjectForm.quote_ids" type="checkbox" :value="quote.id" />
                          <span>{{ quote.ticket_number }}</span>
                          <small v-if="quote.amount != null">{{ formatMoney(quote.amount) }}</small>
                        </label>
                      </div>
                    </div>
                  </section>

                  <section class="create-section">
                    <ProjectCatalogPicker
                      ref="createCatalogPickerRef"
                      :model-value="createProjectForm.lines"
                      :products="products"
                      :categories="adminCategories"
                      :loading="isLoading && !products.length"
                      :price-references="createPriceReferences"
                      @update:model-value="onCreateProjectLinesUpdate"
                      @refresh="loadCatalogForPicker"
                    />
                  </section>

                  <section class="create-section create-services-section">
                    <div class="create-section-head">
                      <h4>{{ t('admin.projects.createServices') }}</h4>
                      <p>{{ t('admin.projects.createServicesHint') }}</p>
                    </div>
                    <div class="project-create-services">
                      <div class="create-service-block">
                        <div class="section-head">
                          <h5>{{ t('admin.projects.installations') }}</h5>
                          <button
                            type="button"
                            class="action-btn"
                            :title="t('admin.projects.addInstallation')"
                            :aria-label="t('admin.projects.addInstallation')"
                            @click="createProjectForm.installations.push(blankInstallation())"
                          >
                            <AdminIcon name="plus" :size="15" />
                          </button>
                        </div>
                        <p v-if="!createProjectForm.installations.length" class="create-empty muted">{{ t('admin.projects.noInstallations') }}</p>
                        <div v-for="(row, index) in createProjectForm.installations" :key="index" class="service-card service-card-simple">
                          <div class="service-simple-top">
                            <label class="service-price-field">
                              <span>{{ t('admin.projects.price') }}</span>
                              <div class="price-input-wrap">
                                <input v-model="row.price" type="number" min="0" step="0.01" placeholder="0.00" />
                                <span class="price-suffix">MAD</span>
                              </div>
                            </label>
                            <button
                              type="button"
                              class="action-btn danger service-remove"
                              :title="t('admin.projects.remove')"
                              :aria-label="t('admin.projects.remove')"
                              @click="createProjectForm.installations.splice(index, 1)"
                            >
                              <AdminIcon name="trash" :size="15" />
                            </button>
                          </div>
                          <label class="service-details-field">
                            <span>{{ t('admin.projects.description') }}</span>
                            <textarea v-model="row.description" rows="2" :placeholder="t('admin.projects.serviceDetailsPlaceholder')"></textarea>
                          </label>
                        </div>
                      </div>

                      <div class="create-service-block">
                        <div class="section-head">
                          <h5>{{ t('admin.projects.maintenances') }}</h5>
                          <button
                            type="button"
                            class="action-btn"
                            :title="t('admin.projects.addMaintenance')"
                            :aria-label="t('admin.projects.addMaintenance')"
                            @click="createProjectForm.maintenances.push(blankMaintenance())"
                          >
                            <AdminIcon name="plus" :size="15" />
                          </button>
                        </div>
                        <p v-if="!createProjectForm.maintenances.length" class="create-empty muted">{{ t('admin.projects.noMaintenances') }}</p>
                        <div v-for="(row, index) in createProjectForm.maintenances" :key="index" class="service-card service-card-simple">
                          <div class="service-simple-top">
                            <label class="service-price-field">
                              <span>{{ t('admin.projects.price') }}</span>
                              <div class="price-input-wrap">
                                <input v-model="row.price" type="number" min="0" step="0.01" placeholder="0.00" />
                                <span class="price-suffix">MAD</span>
                              </div>
                            </label>
                            <button
                              type="button"
                              class="action-btn danger service-remove"
                              :title="t('admin.projects.remove')"
                              :aria-label="t('admin.projects.remove')"
                              @click="createProjectForm.maintenances.splice(index, 1)"
                            >
                              <AdminIcon name="trash" :size="15" />
                            </button>
                          </div>
                          <label class="service-details-field">
                            <span>{{ t('admin.projects.description') }}</span>
                            <textarea v-model="row.description" rows="2" :placeholder="t('admin.projects.serviceDetailsPlaceholder')"></textarea>
                          </label>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
                <footer class="modal-footer">
                  <button type="button" class="ghost-btn" @click="showCreateProject = false">{{ t('common.cancel') }}</button>
                  <button type="submit" class="primary-btn" :disabled="creatingProject">
                    {{ creatingProject ? t('admin.projects.saving') : t('admin.projects.create') }}
                  </button>
                </footer>
              </form>
            </div>
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

        <!-- Services Management -->
        <section v-if="activeTab === 'services'" class="panel">
          <header class="panel-header">
            <div>
              <h1>Gestion des Services</h1>
              <p>Ajouter, supprimer et personnaliser le catalogue. Traiter les demandes clients.</p>
            </div>
            <button type="button" class="primary-btn" @click="openCreateServiceModal">
              <AdminIcon name="plus" size="16" />
              <span>Ajouter un service</span>
            </button>
          </header>

          <div class="ops-services-config-view">
            <div v-if="!servicesConfig.length" class="empty-state">
              <p>Aucun service. Créez le premier pour le catalogue public.</p>
            </div>
            <div v-else class="config-grid">
              <div
                v-for="srv in servicesConfig"
                :key="srv.id"
                :class="['service-config-card', { disabled: !srv.enabled }]"
              >
                <div class="card-head">
                  <div>
                    <span class="cat-tag">{{ srv.category }}</span>
                    <h3>{{ srv.title }}</h3>
                  </div>

                  <div class="toggle-switch-wrap">
                    <label class="switch">
                      <input
                        type="checkbox"
                        :checked="srv.enabled"
                        @change="handleToggleService(srv)"
                      />
                      <span class="slider round"></span>
                    </label>
                    <span :class="['toggle-lbl', srv.enabled ? 'enabled' : 'disabled']">
                      {{ srv.enabled ? 'Actif' : 'Désactivé' }}
                    </span>
                  </div>
                </div>

                <p class="config-desc">{{ srv.desc }}</p>

                <div class="config-meta">
                  <span>Durée: <strong>{{ srv.estimatedDuration || '—' }}</strong></span>
                  <span>Tarif: <strong>{{ srv.startingPrice || '—' }}</strong></span>
                </div>

                <div class="card-footer-actions service-card-actions">
                  <button type="button" class="edit-service-btn" @click="openEditServiceModal(srv)">
                    <AdminIcon name="edit" size="14" />
                    <span>Modifier</span>
                  </button>
                  <button type="button" class="danger-service-btn" @click="handleDeleteService(srv)">
                    <AdminIcon name="trash" size="14" />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="service-requests-block">
              <header class="subpanel-header">
                <div>
                  <h2>Demandes de services</h2>
                  <p>Accepter et assigner un opérateur pour démarrer la réalisation.</p>
                </div>
              </header>

              <div v-if="!serviceRequests.length" class="empty-state compact">
                <p>Aucune demande pour le moment.</p>
              </div>

              <div v-else class="service-req-list">
                <article v-for="req in serviceRequests" :key="req.id" class="service-req-card">
                  <div class="req-top">
                    <div>
                      <code>{{ req.id }}</code>
                      <h3>{{ req.serviceTitle }}</h3>
                      <p>{{ req.clientName }} · {{ req.clientEmail }} · {{ req.city || '—' }}</p>
                      <small>
                        {{ req.createdAt }} ·
                        {{ getPhaseLabel(req) }} ({{ req.currentPhase }}/5)
                      </small>
                    </div>
                    <span class="status-pill" :class="req.status">{{ req.status }}</span>
                  </div>
                  <p v-if="req.notes" class="req-notes">{{ req.notes }}</p>

                  <div class="phase-track-labeled">
                    <p class="phase-track-hint">Avancement de la réalisation — cliquez une étape pour la définir :</p>
                    <div class="phase-steps-row">
                      <button
                        v-for="step in getRequestSteps(req)"
                        :key="step.step"
                        type="button"
                        :class="[
                          'phase-step-chip',
                          {
                            active: req.currentPhase === step.step,
                            done: req.currentPhase > step.step
                          }
                        ]"
                        :title="step.desc"
                        @click="handleUpdateServicePhase(req, step.step)"
                      >
                        <span class="phase-num">{{ step.step }}</span>
                        <span class="phase-text">
                          <strong>{{ step.title }}</strong>
                          <em>{{ step.desc }}</em>
                        </span>
                      </button>
                    </div>
                  </div>

                  <div class="req-assign-row">
                    <select v-model="assignOperatorMap[req.id]" class="filter-select">
                      <option value="">Choisir un opérateur…</option>
                      <option v-for="op in opsOperators" :key="op.id" :value="op.id">{{ op.name }}</option>
                    </select>
                    <button
                      type="button"
                      class="primary-btn small"
                      :disabled="!assignOperatorMap[req.id] || req.status === 'completed' || req.status === 'rejected'"
                      @click="handleAssignServiceRequest(req)"
                    >
                      Assigner
                    </button>
                    <button
                      type="button"
                      class="ghost-btn small"
                      :disabled="req.status === 'completed' || req.status === 'rejected'"
                      @click="handleRejectServiceRequest(req)"
                    >
                      Rejeter
                    </button>
                  </div>
                </article>
              </div>
            </div>
          </div>

          <div v-if="showServiceModal" class="modal-overlay service-edit-overlay" @click.self="showServiceModal = false">
            <div class="ops-modal ops-modal-sm" role="dialog" aria-modal="true">
              <header class="modal-header">
                <div>
                  <h3>{{ editingService ? 'Modifier le service' : 'Nouveau service' }}</h3>
                </div>
                <button type="button" class="close-btn" @click="showServiceModal = false">×</button>
              </header>
              <form class="task-form" @submit.prevent="submitServiceForm">
                <div class="modal-body">
                  <div class="form-grid">
                    <label class="span-2">
                      <span>Titre</span>
                      <input v-model="serviceForm.title" type="text" required />
                    </label>
                    <label>
                      <span>Catégorie</span>
                      <input v-model="serviceForm.category" type="text" />
                    </label>
                    <label>
                      <span>Tarif de départ</span>
                      <input v-model="serviceForm.startingPrice" type="text" placeholder="4,500 MAD" />
                    </label>
                    <label>
                      <span>Durée estimée</span>
                      <input v-model="serviceForm.estimatedDuration" type="text" placeholder="1-3 Days" />
                    </label>
                    <label class="span-2">
                      <span>Description</span>
                      <textarea v-model="serviceForm.desc" rows="3"></textarea>
                    </label>
                    <label class="span-2">
                      <span>Points clés (un par ligne)</span>
                      <textarea v-model="serviceForm.bulletsText" rows="3" placeholder="Site audit&#10;Panel mounting"></textarea>
                    </label>
                    <label class="checkbox-row span-2">
                      <input v-model="serviceForm.enabled" type="checkbox" />
                      <span>Service actif (visible clients)</span>
                    </label>
                  </div>
                </div>
                <footer class="modal-footer">
                  <button type="button" class="ghost-btn" @click="showServiceModal = false">Annuler</button>
                  <button type="submit" class="primary-btn">{{ editingService ? 'Enregistrer' : 'Créer' }}</button>
                </footer>
              </form>
            </div>
          </div>
        </section>

        <!-- Liste des Opérateurs -->
        <section v-if="activeTab === 'operators'" class="panel operators-panel">
          <header class="panel-header">
            <div>
              <h1>Liste des Opérateurs</h1>
              <p>Gestion de la flotte des techniciens de terrain et affectation rapide des missions.</p>
            </div>
            <button class="primary-btn" @click="openCreateOperatorModal()">
              <AdminIcon name="plus" size="16" />
              <span>Ajouter un opérateur</span>
            </button>
          </header>

          <div class="table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Opérateur</th>
                  <th>Région / Ville</th>
                  <th>Téléphone</th>
                  <th>Statut de Service</th>
                  <th>Missions Actives</th>
                  <th class="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="op in opsOperators" :key="op.id">
                  <td>
                    <div class="op-table-profile">
                      <div class="op-mini-avatar" :style="{ backgroundColor: op.avatarColor }">
                        {{ op.name.substring(0, 2).toUpperCase() }}
                      </div>
                      <div>
                        <strong>{{ op.name }}</strong><br />
                        <small class="text-muted">{{ op.role }}</small>
                      </div>
                    </div>
                  </td>
                  <td>{{ op.city }}</td>
                  <td>{{ op.phone }}</td>
                  <td>
                    <button
                      type="button"
                      :class="['duty-badge', getDutyStatusClass(op.dutyStatus)]"
                      @click="toggleOperatorDuty(op.id)"
                      title="Cliquer pour changer le statut"
                      style="border: none; cursor: pointer;"
                    >
                      ● {{ getDutyStatusLabel(op.dutyStatus) }}
                    </button>
                  </td>
                  <td>
                    <span class="workload-tag">{{ getOperatorActiveTaskCount(op.id) }} Actives</span>
                  </td>
                  <td class="col-actions">
                    <div class="row-actions">
                      <button type="button" class="action-btn" @click="openCreateTaskModal(op.id)" title="Assigner Tâche">
                        <AdminIcon name="plus" size="15" />
                      </button>
                      <button type="button" class="action-btn" @click="openEditOperatorModal(op)" title="Modifier l'opérateur">
                        <AdminIcon name="edit" size="15" />
                      </button>
                      <button type="button" class="action-btn danger" @click="handleDeleteOperator(op.id)" title="Supprimer l'opérateur">
                        <AdminIcon name="trash" size="15" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Operations Dispatch -->
        <section v-if="activeTab === 'operations'" class="panel ops-panel">
          <header class="panel-header ops-header">
            <div>
              <h1>{{ opsSection === 'operators' ? t('admin.operations.operatorsTitle') : t('admin.operations.title') }}</h1>
              <p>{{ opsSection === 'operators' ? t('admin.operations.operatorsSubtitle') : t('admin.operations.subtitle') }}</p>
            </div>
            <div class="panel-actions" v-if="opsSection === 'jobs'">
              <button class="primary-btn" @click="openCreateTaskModal()">
                <AdminIcon name="plus" size="16" />
                <span>{{ t('admin.operations.assignTaskBtn') }}</span>
              </button>
            </div>
            <div class="panel-actions" v-else>
              <button type="button" class="primary-btn" @click="openCreateOperatorModal">
                <AdminIcon name="plus" size="16" />
                <span>{{ t('admin.operations.addOperatorBtn') }}</span>
              </button>
            </div>
          </header>

          <template v-if="opsSection === 'jobs'">
            <div class="queue-toolbar ops-simple-toolbar">
              <div class="search-wrap">
                <AdminIcon name="search" size="16" />
                <input v-model="opsSearch" type="search" :placeholder="t('admin.operations.list.search')" />
              </div>
              <div class="filter-group">
                <select v-model="opsFilterPerson">
                  <option value="all">{{ t('admin.operations.list.allPeople') }}</option>
                  <option v-for="op in opsOperators" :key="op.id" :value="op.id">{{ op.name }}</option>
                </select>
                <input v-model="opsFilterDate" type="date" />
                <select v-model="opsFilterType">
                  <option value="all">{{ t('admin.operations.list.allTypes') }}</option>
                  <option value="installation">{{ t('admin.operations.types.installation') }}</option>
                  <option value="maintenance">{{ t('admin.operations.types.maintenance') }}</option>
                  <option value="delivery">{{ t('admin.operations.types.delivery') }}</option>
                  <option value="study">{{ t('admin.operations.types.study') }}</option>
                </select>
                <select v-model="opsFilterStatus">
                  <option value="all">{{ t('admin.operations.list.allStatuses') }}</option>
                  <option value="assigned">{{ t('admin.operations.list.assigned') }}</option>
                  <option value="in_progress">{{ t('admin.operations.list.inProgress') }}</option>
                  <option value="on_hold">{{ t('admin.operations.list.onHold') }}</option>
                  <option value="completed">{{ t('admin.operations.list.completed') }}</option>
                </select>
              </div>
            </div>

            <div v-if="!filteredOpsTasks.length" class="ops-empty">
              {{ t('admin.operations.list.empty') }}
            </div>
            <div v-else class="job-grid">
              <article v-for="job in filteredOpsTasks" :key="job.id" class="job-card">
                <div class="job-card-top">
                  <span class="ops-chip">{{ getOpsTypeLabel(job.type) }}</span>
                  <span class="ops-chip">{{ opsStatusLabel(job.status) }}</span>
                </div>
                <h3>{{ job.title }}</h3>
                <p class="job-client">{{ job.client.name }} · {{ job.client.city }}</p>
                <p v-if="job.projectName" class="job-project">{{ job.projectName }}</p>
                <div class="job-meta">
                  <span>{{ job.operatorName }}</span>
                  <span>{{ job.scheduledDate }} · {{ job.timeSlot }}</span>
                </div>
                <div class="job-countdown" :class="missionCountdownTone(job)">
                  {{ formatMissionCountdown(job) }}
                </div>
                <footer class="job-card-actions">
                  <span class="ops-quiet">{{ opsPriorityLabel(job.priority) }}</span>
                  <div class="action-btns">
                    <button type="button" class="ghost-btn small" @click="openEditTaskModal(job)">
                      <AdminIcon name="edit" size="14" />
                    </button>
                    <button type="button" class="ghost-btn small danger" @click="handleDeleteTask(job.id)">
                      <AdminIcon name="trash" size="14" />
                    </button>
                  </div>
                </footer>
              </article>
            </div>
          </template>

          <div v-else>
            <div v-if="!opsOperators.length" class="ops-empty">{{ t('admin.operations.operatorsEmpty') }}</div>
            <div v-else class="op-manage-grid">
              <article
                v-for="op in opsOperators"
                :key="op.id"
                class="op-manage-card op-manage-card--clickable"
                role="button"
                tabindex="0"
                @click="openOperatorSchedule(op)"
                @keydown.enter.prevent="openOperatorSchedule(op)"
              >
                <div class="op-manage-head">
                  <div class="op-avatar">
                    {{ operatorInitials(op.name) }}
                  </div>
                  <div>
                    <h3>{{ op.name }}</h3>
                    <p>{{ op.role }}</p>
                  </div>
                </div>
                <ul class="op-manage-facts">
                  <li>{{ op.phone || '—' }}</li>
                  <li>{{ op.city || '—' }}</li>
                  <li>{{ op.email || '—' }}</li>
                </ul>
                <footer class="op-manage-foot">
                  <span>{{ t('admin.operations.list.activeJobs', { n: getOperatorActiveTaskCount(op.id) }) }}</span>
                  <div class="action-btns" @click.stop>
                    <button type="button" class="ghost-btn small" @click="openEditOperatorModal(op)">
                      <AdminIcon name="edit" size="14" />
                    </button>
                    <button type="button" class="ghost-btn small danger" @click="handleDeleteOperator(op.id)">
                      <AdminIcon name="trash" size="14" />
                    </button>
                  </div>
                </footer>
              </article>
            </div>
          </div>

          <!-- TASK ASSIGNMENT & EDIT MODAL -->
          <div v-if="showTaskModal" class="modal-overlay modal-overlay--stack-top" @click.self="showTaskModal = false">
            <div class="ops-modal" role="dialog" aria-modal="true">
              <header class="modal-header">
                <div>
                  <p class="modal-kicker">{{ t('admin.operations.title') }}</p>
                  <h3>{{ editingTask ? t('admin.operations.modal.editTitle') : t('admin.operations.modal.createTitle') }}</h3>
                </div>
                <button type="button" class="close-btn" :aria-label="t('common.close')" @click="showTaskModal = false">×</button>
              </header>

              <form class="task-form" @submit.prevent="submitTaskForm">
                <div class="modal-body">
                  <section class="modal-group">
                    <h4>{{ t('admin.operations.modal.jobSection') }}</h4>
                    <div class="form-grid">
                      <label>
                        <span>{{ t('admin.operations.modal.taskType') }}</span>
                        <select v-model="taskForm.type" required>
                          <option value="installation">{{ t('admin.operations.types.installation') }}</option>
                          <option value="maintenance">{{ t('admin.operations.types.maintenance') }}</option>
                          <option value="delivery">{{ t('admin.operations.types.delivery') }}</option>
                          <option value="study">{{ t('admin.operations.types.study') }}</option>
                        </select>
                      </label>
                      <label>
                        <span>{{ t('admin.operations.modal.selectOperator') }}</span>
                        <select v-model="taskForm.operatorId" required>
                          <option v-for="op in opsOperators" :key="op.id" :value="op.id">{{ op.name }}</option>
                        </select>
                      </label>
                      <label class="span-2">
                        <span>{{ t('admin.operations.modal.taskTitle') }}</span>
                        <input v-model="taskForm.title" type="text" required />
                      </label>
                      <label class="span-2">
                        <span>{{ t('admin.operations.modal.projectOptional') }}</span>
                        <select v-model="taskForm.projectId">
                          <option value="">{{ t('admin.operations.modal.noProject') }}</option>
                          <option v-for="project in projects" :key="project.id" :value="project.id">
                            {{ project.name }}
                          </option>
                        </select>
                      </label>
                    </div>
                  </section>

                  <section class="modal-group">
                    <h4>{{ t('admin.operations.modal.whenSection') }}</h4>
                    <div class="form-grid">
                      <label>
                        <span>{{ t('admin.operations.modal.scheduledDate') }}</span>
                        <input v-model="taskForm.scheduledDate" type="date" :min="todayDate" required />
                      </label>
                      <label>
                        <span>{{ t('admin.operations.modal.timeSlot') }}</span>
                        <select v-model="taskForm.timeSlot">
                          <option
                            v-for="item in availableTaskSlots"
                            :key="item.slot"
                            :value="item.slot"
                            :disabled="item.busy"
                          >
                            {{ item.slot }}{{ item.busy ? ` (${t('admin.operations.modal.slotBusy')})` : '' }}
                          </option>
                        </select>
                      </label>
                    </div>
                    <p v-if="scheduleConflictWarning" class="ops-conflict-warning">{{ scheduleConflictWarning }}</p>
                    <div class="priority-row">
                      <span>{{ t('admin.operations.modal.priority') }}</span>
                      <div class="priority-pills">
                        <button
                          v-for="level in ['low', 'medium', 'high', 'urgent']"
                          :key="level"
                          type="button"
                          class="priority-pill"
                          :class="[level, { active: taskForm.priority === level }]"
                          @click="taskForm.priority = level"
                        >
                          {{ t(`admin.operations.modal.priority${level.charAt(0).toUpperCase()}${level.slice(1)}`) }}
                        </button>
                      </div>
                    </div>
                  </section>

                  <section class="modal-group">
                    <h4>{{ t('admin.operations.modal.clientSection') }}</h4>
                    <div class="form-grid">
                      <label>
                        <span>{{ t('admin.operations.modal.clientName') }}</span>
                        <input v-model="taskForm.clientName" type="text" required />
                      </label>
                      <label>
                        <span>{{ t('admin.operations.modal.clientPhone') }}</span>
                        <input v-model="taskForm.clientPhone" type="tel" />
                      </label>
                      <label class="span-2">
                        <span>{{ t('admin.operations.modal.clientAddress') }}</span>
                        <input v-model="taskForm.clientAddress" type="text" />
                      </label>
                      <label>
                        <span>{{ t('admin.operations.modal.clientCity') }}</span>
                        <input v-model="taskForm.clientCity" type="text" />
                      </label>
                      <label class="span-2">
                        <span>{{ t('admin.operations.modal.adminNotes') }}</span>
                        <textarea v-model="taskForm.adminNotes" rows="3"></textarea>
                      </label>
                    </div>
                  </section>
                </div>

                <footer class="modal-footer">
                  <button type="button" class="ghost-btn" @click="showTaskModal = false">{{ t('common.cancel') }}</button>
                  <button type="submit" class="primary-btn">
                    {{ editingTask ? t('admin.operations.modal.submitUpdate') : t('admin.operations.modal.submitCreate') }}
                  </button>
                </footer>
              </form>
            </div>
          </div>

          <div v-if="showOperatorModal" class="modal-overlay modal-overlay--stack-top" @click.self="showOperatorModal = false">
            <div class="ops-modal ops-modal-sm" role="dialog" aria-modal="true">
              <header class="modal-header">
                <div>
                  <p class="modal-kicker">{{ t('admin.operations.title') }}</p>
                  <h3>{{ editingOperator ? t('admin.operations.operatorForm.editTitle') : t('admin.operations.operatorForm.title') }}</h3>
                </div>
                <button type="button" class="close-btn" :aria-label="t('common.close')" @click="showOperatorModal = false">×</button>
              </header>
              <form class="task-form" @submit.prevent="submitOperatorForm">
                <div class="modal-body">
                  <div class="form-grid">
                    <label class="span-2">
                      <span>{{ t('admin.operations.operatorForm.name') }}</span>
                      <input v-model="operatorForm.name" type="text" required />
                    </label>
                    <label>
                      <span>{{ t('admin.operations.operatorForm.role') }}</span>
                      <input v-model="operatorForm.role" type="text" />
                    </label>
                    <label>
                      <span>{{ t('admin.operations.operatorForm.city') }}</span>
                      <input v-model="operatorForm.city" type="text" />
                    </label>
                    <label>
                      <span>{{ t('admin.operations.operatorForm.phone') }}</span>
                      <input v-model="operatorForm.phone" type="tel" required />
                    </label>
                    <label>
                      <span>{{ t('admin.operations.operatorForm.email') }}</span>
                      <input v-model="operatorForm.email" type="email" required maxlength="50" />
                    </label>
                    <label v-if="!editingOperator" class="span-2">
                      <span>{{ t('admin.operations.operatorForm.password') }}</span>
                      <input v-model="operatorForm.password" type="text" :placeholder="t('admin.operations.operatorForm.passwordHint')" />
                    </label>
                  </div>
                </div>
                <footer class="modal-footer">
                  <button type="button" class="ghost-btn" @click="showOperatorModal = false">{{ t('common.cancel') }}</button>
                  <button type="submit" class="primary-btn">
                    {{ editingOperator ? t('admin.operations.operatorForm.saveChanges') : t('admin.operations.operatorForm.save') }}
                  </button>
                </footer>
              </form>
            </div>
          </div>

          <!-- Operator schedule calendar -->
          <div
            v-if="showOperatorSchedule && scheduleOperator"
            class="modal-overlay"
            @click.self="closeOperatorSchedule"
          >
            <div class="ops-modal ops-schedule-modal" role="dialog" aria-modal="true">
              <header class="modal-header">
                <div>
                  <p class="modal-kicker">{{ t('admin.operations.schedule.kicker') }}</p>
                  <h3>{{ scheduleOperator.name }}</h3>
                  <p class="ops-quiet">{{ scheduleOperator.role }} · {{ scheduleOperator.city || '—' }}</p>
                </div>
                <button type="button" class="close-btn" :aria-label="t('common.close')" @click="closeOperatorSchedule">×</button>
              </header>

              <div class="modal-body ops-schedule-body">
                <div class="ops-cal-toolbar">
                  <button type="button" class="ghost-btn small" @click="shiftScheduleMonth(-1)">‹</button>
                  <strong>{{ scheduleMonthLabel }}</strong>
                  <button type="button" class="ghost-btn small" @click="shiftScheduleMonth(1)">›</button>
                  <button
                    type="button"
                    class="primary-btn small"
                    @click="openCreateTaskModal(scheduleOperator.id)"
                  >
                    {{ t('admin.operations.assignTaskBtn') }}
                  </button>
                </div>

                <div class="ops-cal-weekdays">
                  <span v-for="d in ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']" :key="d">{{ d }}</span>
                </div>
                <div class="ops-cal-grid">
                  <button
                    v-for="(cell, idx) in scheduleMonthCells"
                    :key="idx"
                    type="button"
                    class="ops-cal-cell"
                    :class="{
                      empty: !cell,
                      selected: cell && cell.date === scheduleSelectedDate,
                      hasTasks: cell && scheduleTaskDates.has(cell.date)
                    }"
                    :disabled="!cell"
                    @click="cell && selectScheduleDate(cell.date)"
                  >
                    <template v-if="cell">
                      <span class="ops-cal-day">{{ cell.day }}</span>
                      <span v-if="tasksOnScheduleDate(cell.date).length" class="ops-cal-dot">
                        {{ tasksOnScheduleDate(cell.date).length }}
                      </span>
                    </template>
                  </button>
                </div>

                <div class="ops-cal-day-panel">
                  <h4>{{ t('admin.operations.schedule.dayTitle', { date: scheduleSelectedDate }) }}</h4>
                  <div v-if="!scheduleTasksForSelectedDay.length" class="ops-empty">
                    {{ t('admin.operations.schedule.noTasks') }}
                  </div>
                  <ul v-else class="ops-cal-task-list">
                    <li v-for="job in scheduleTasksForSelectedDay" :key="job.id">
                      <div>
                        <strong>{{ job.title }}</strong>
                        <span>{{ job.timeSlot }} · {{ getOpsTypeLabel(job.type) }}</span>
                        <span class="job-countdown" :class="missionCountdownTone(job)">
                          {{ formatMissionCountdown(job) }}
                        </span>
                      </div>
                      <button type="button" class="ghost-btn small" @click="openEditTaskModal(job)">
                        <AdminIcon name="edit" size="14" />
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- AI-Analysis -->
        <section v-if="activeTab === 'ai-analysis'">
          <Aianalysispanel />
        </section>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth } from '../composables/useAuth'
import { useAdmin } from '../composables/useAdmin'
import { useOperatorAdmin } from '../composables/useOperatorAdmin'
import { useServices } from '../composables/useServices'
import { useLocale } from '../composables/useLocale'
import { useToast } from '../composables/useToast'
import AdminIcon from '../components/AdminIcon.vue'
// import LanguageSwitcher from '../components/LanguageSwitcher.vue'
import FollowupCard from '../components/FollowupCard.vue'
import ProjectTimeline from '../components/ProjectTimeline.vue'
import ProjectCatalogPicker from '../components/adminDashboard/ProjectCatalogPicker.vue'
import { getApiErrorMessage } from '../api/client'
import { resolveProductImage, resolveMediaUrl } from '../utils/productImage'
import { objectToLines, linesToObject } from '../utils/productDetails'
import RfqQuoteEditor from '../components/RfqQuoteEditor.vue'
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
  getCurrentPhase,
  getFollowupStepNumber,
  phaseToCompletedSteps,
  projectStatusLabel
} from '../utils/projectSteps'
import {
  TASK_TIME_SLOTS,
  findOperatorSlotConflicts,
  missionCountdown,
  buildMonthGrid
} from '../utils/missionSchedule'
import Aianalysispanel from '@/components/AIPart/Aianalysispanel.vue'

const router = useRouter()
const { t } = useI18n()
const { locale } = useLocale()
const { user, isAdmin, logoutUser } = useAuth()
const toast = useToast()
const {
  servicesConfig,
  serviceRequests,
  toggleServiceEnabled,
  updateService,
  createService,
  deleteService,
  acceptAndAssignRequest,
  rejectServiceRequest,
  updateRequestPhase,
  reloadServices,
  getRequestSteps,
  getPhaseLabel,
  error: servicesError
} = useServices()
const assignOperatorMap = ref({})
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
  fetchProjectMessages,
  postProjectMessage,
  fetchQuotes,
  createProject,
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
const ordersView = ref('new')

const newRfqs = computed(() =>
  rfqs.value.filter((rfq) => rfq.status === 'review')
)

const activeRfqs = computed(() =>
  rfqs.value.filter((rfq) => rfq.status !== 'review')
)

const visibleOrdersRfqs = computed(() => {
  if (ordersView.value === 'new') return newRfqs.value
  if (ordersView.value === 'active') return activeRfqs.value
  return rfqs.value
})

const ordersEmptyMessage = computed(() => {
  locale.value
  if (ordersView.value === 'new') return t('admin.orders.emptyNew')
  if (ordersView.value === 'active') return t('admin.orders.emptyActive')
  return t('admin.orders.empty')
})

const ordersDisplaySections = computed(() => {
  locale.value
  if (ordersView.value === 'new') {
    return newRfqs.value.length
      ? [{ id: 'new', items: newRfqs.value, showHead: false, title: '', hint: '' }]
      : []
  }
  if (ordersView.value === 'active') {
    return activeRfqs.value.length
      ? [{ id: 'active', items: activeRfqs.value, showHead: false, title: '', hint: '' }]
      : []
  }
  const sections = []
  if (newRfqs.value.length) {
    sections.push({
      id: 'new',
      items: newRfqs.value,
      showHead: true,
      title: t('admin.orders.newSection'),
      hint: t('admin.orders.newHint')
    })
  }
  if (activeRfqs.value.length) {
    sections.push({
      id: 'active',
      items: activeRfqs.value,
      showHead: true,
      title: t('admin.orders.activeSection'),
      hint: t('admin.orders.activeHint')
    })
  }
  return sections
})
const projectFilter = ref('')
const showProjectDrawer = ref(false)
const editingProject = ref(null)
const projectSaving = ref(false)
const projectFormError = ref('')
const projectForm = ref(emptyProjectForm())
const projectTraces = ref([])
const projectMessages = ref([])
const selectedQuoteIds = ref([])
const availableQuotes = ref([])
const showCreateProject = ref(false)
const creatingProject = ref(false)
const createProjectForm = ref(emptyCreateProject())
const projectLines = ref([])
const projectInstallations = ref([])
const projectMaintenances = ref([])
const createCatalogPickerRef = ref(null)
const replyDraft = ref('')
const replySending = ref(false)
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

const editingQuotes = computed(() => editingProject.value?.rfq_tickets || (editingProject.value?.rfq_ticket ? [editingProject.value.rfq_ticket] : []))

function buildPriceReferences(rfqTickets, lines) {
  const refs = []
  ;(rfqTickets || []).forEach((ticket) => {
    ;(ticket.items || []).forEach((item) => {
      const id = Number(item.id ?? item.id_product)
      if (!id || item.unit_price == null) return
      refs.push({
        id_product: id,
        unit_price: Number(item.unit_price),
        source: 'rfq',
        label: item.display_name || item.title
      })
    })
  })
  ;(lines || []).forEach((line) => {
    const id = Number(line.id_product)
    if (!id || line.unit_price == null) return
    refs.push({
      id_product: id,
      unit_price: Number(line.unit_price),
      source: 'list',
      label: line.title
    })
  })
  return refs
}

const projectPriceReferences = computed(() =>
  buildPriceReferences(editingQuotes.value, projectLines.value)
)

const createSelectedQuotes = computed(() => {
  const ids = new Set((createProjectForm.value.quote_ids || []).map(Number))
  return availableQuotes.value.filter((quote) => ids.has(Number(quote.id)))
})

const createPriceReferences = computed(() =>
  buildPriceReferences(createSelectedQuotes.value, createProjectForm.value.lines)
)

const clientQuotes = computed(() => {
  const clientId = Number(editingProject.value?.id_client)
  if (!clientId) return []
  return availableQuotes.value.filter((quote) => Number(quote.id_client) === clientId)
})

const createClientQuotes = computed(() => {
  const clientId = Number(createProjectForm.value.id_client)
  if (!clientId) return []
  return availableQuotes.value.filter((quote) => Number(quote.id_client) === clientId)
})

function emptyCreateProject() {
  return {
    name: '',
    id_client: '',
    location: '',
    description: '',
    quote_ids: [],
    lines: [],
    installations: [],
    maintenances: []
  }
}

function onProjectLinesUpdate(lines) {
  projectLines.value = Array.isArray(lines) ? lines.map((line) => ({ ...line })) : []
}

function onCreateProjectLinesUpdate(lines) {
  createProjectForm.value.lines = Array.isArray(lines) ? lines.map((line) => ({ ...line })) : []
}

function onCreateClientChange() {
  createProjectForm.value.quote_ids = []
}

function blankInstallation() {
  return { id: null, name: '', price: '', description: '' }
}

function blankMaintenance() {
  return { id: null, type: '', price: '', description: '' }
}

async function loadCatalogForPicker(filters = {}) {
  if (!adminCategories.value.length) {
    adminCategories.value = await fetchCategories()
  }
  await fetchProducts({ sort: 'title', ...filters })
}

function hasServiceContent(row) {
  return String(row.description || '').trim() !== '' || (row.price !== '' && row.price != null)
}

function cleanInstallations(rows) {
  return rows.filter(hasServiceContent).map((row) => ({
    id: row.id || null,
    name: String(row.name || '').trim() || t('admin.projects.installations'),
    location: null,
    energy_type: null,
    description: row.description || null,
    scheduled_at: null,
    price: row.price === '' || row.price == null ? null : Number(row.price)
  }))
}

function cleanMaintenances(rows) {
  return rows.filter(hasServiceContent).map((row) => ({
    id: row.id || null,
    type: String(row.type || '').trim() || t('admin.projects.maintenances'),
    description: row.description || null,
    scheduled_at: null,
    price: row.price === '' || row.price == null ? null : Number(row.price)
  }))
}

function emptyProjectForm() {
  return {
    location: '',
    current_phase: 'quote_confirmed',
    on_hold: false,
    admin_notes: ''
  }
}

const {
  tasks: opsTasks,
  operators: opsOperators,
  stats: opsStats,
  createTask: createOpsTask,
  updateTask: updateOpsTask,
  createOperator: createOpsOperator,
  updateOperator: updateOpsOperator,
  deleteOperator: deleteOpsOperator,
  updateTaskStatus: updateOpsTaskStatus,
  reassignTask: reassignOpsTask,
  deleteTask: deleteOpsTask,
  toggleOperatorDuty,
  getOperatorActiveTaskCount,
  reloadOperations
} = useOperatorAdmin()

const opsSection = ref('jobs')
const selectedCalendarDate = ref(new Date().toISOString().slice(0, 10))
const showTaskModal = ref(false)
const showOperatorModal = ref(false)
const editingOperator = ref(null)
const operatorForm = ref({ name: '', role: '', phone: '', email: '', city: '', password: '' })
const editingTask = ref(null)
const scheduleConflictWarning = ref('')
const nowTick = ref(Date.now())
let nowTickTimer = null

const showOperatorSchedule = ref(false)
const scheduleOperator = ref(null)
const scheduleMonth = ref(new Date().getMonth())
const scheduleYear = ref(new Date().getFullYear())
const scheduleSelectedDate = ref(new Date().toISOString().slice(0, 10))

const todayDate = computed(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
})

function clampToTodayOrLater(dateStr) {
  const today = todayDate.value
  if (!dateStr || dateStr < today) return today
  return dateStr
}

const taskForm = ref({
  type: 'installation',
  title: '',
  operatorId: '',
  projectId: '',
  priority: 'medium',
  scheduledDate: new Date().toISOString().slice(0, 10),
  timeSlot: '09:00 - 13:00',
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  clientAddress: '',
  clientCity: 'Casablanca',
  adminNotes: ''
})

const opsFilterType = ref('all')
const opsFilterStatus = ref('all')
const opsFilterPerson = ref('all')
const opsFilterDate = ref('')
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
  const q = (opsSearch.value || '').toLowerCase()
  return opsTasks.value.filter(task => {
    const matchType = opsFilterType.value === 'all' || task.type === opsFilterType.value
    const matchStatus = opsFilterStatus.value === 'all' || task.status === opsFilterStatus.value
    const matchSearch = !q ||
      String(task.title || '').toLowerCase().includes(q) ||
      String(task.id || '').toLowerCase().includes(q) ||
      String(task.client?.name || '').toLowerCase().includes(q) ||
      String(task.operatorName || '').toLowerCase().includes(q)
    const matchPerson = opsFilterPerson.value === 'all' || task.operatorId === opsFilterPerson.value
    const matchDate = !opsFilterDate.value || task.scheduledDate === opsFilterDate.value
    return matchType && matchStatus && matchPerson && matchDate && matchSearch
  })
})

const availableTaskSlots = computed(() => {
  const { operatorId, scheduledDate } = taskForm.value
  const excludeId = editingTask.value?.id ?? null
  return TASK_TIME_SLOTS.map((slot) => {
    const conflicts = findOperatorSlotConflicts(opsTasks.value, {
      operatorId,
      scheduledDate,
      timeSlot: slot,
      excludeId
    })
    return { slot, busy: conflicts.length > 0, conflictTitle: conflicts[0]?.title || '' }
  })
})

const scheduleMonthLabel = computed(() => {
  locale.value
  return new Date(scheduleYear.value, scheduleMonth.value, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric'
  })
})

const scheduleMonthCells = computed(() => buildMonthGrid(scheduleYear.value, scheduleMonth.value))

const scheduleOperatorTasks = computed(() => {
  if (!scheduleOperator.value) return []
  return opsTasks.value
    .filter((task) => String(task.operatorId) === String(scheduleOperator.value.id))
    .sort((a, b) => String(a.scheduledDate).localeCompare(String(b.scheduledDate)) || String(a.timeSlot).localeCompare(String(b.timeSlot)))
})

const scheduleTasksForSelectedDay = computed(() =>
  scheduleOperatorTasks.value.filter((task) => task.scheduledDate === scheduleSelectedDate.value)
)

const scheduleTaskDates = computed(() => {
  const set = new Set(scheduleOperatorTasks.value.map((task) => task.scheduledDate))
  return set
})

function formatMissionCountdown(task) {
  nowTick.value
  locale.value
  const info = missionCountdown(task, new Date(nowTick.value))
  if (info.tone === 'done') return t('admin.operations.countdown.done')
  if (info.minutesLeft == null) return '—'
  if (info.tone === 'overdue') {
    if (info.overdueDays >= 1) {
      return t('admin.operations.countdown.overdueDays', {
        d: info.overdueDays,
        h: info.overdueHours
      })
    }
    if (info.overdueHours > 0) {
      return t('admin.operations.countdown.overdueHours', {
        h: info.overdueHours,
        m: info.overdueRemainMin
      })
    }
    return t('admin.operations.countdown.overdueMins', { m: info.overdueMin })
  }
  if (info.days >= 1) {
    return t('admin.operations.countdown.inDays', { d: info.days, h: info.hours })
  }
  if (info.hours > 0) {
    return t('admin.operations.countdown.inHours', { h: info.hours, m: info.mins })
  }
  return t('admin.operations.countdown.inMins', { m: info.mins })
}

function missionCountdownTone(task) {
  nowTick.value
  return missionCountdown(task, new Date(nowTick.value)).tone
}

function refreshScheduleConflict() {
  const conflicts = findOperatorSlotConflicts(opsTasks.value, {
    operatorId: taskForm.value.operatorId,
    scheduledDate: taskForm.value.scheduledDate,
    timeSlot: taskForm.value.timeSlot,
    excludeId: editingTask.value?.id ?? null
  })
  scheduleConflictWarning.value = conflicts.length
    ? t('admin.operations.modal.conflictWarning', {
        title: conflicts[0].title,
        slot: conflicts[0].timeSlot
      })
    : ''
}

watch(
  () => [taskForm.value.operatorId, taskForm.value.scheduledDate, taskForm.value.timeSlot, showTaskModal.value],
  () => {
    if (showTaskModal.value) refreshScheduleConflict()
    else scheduleConflictWarning.value = ''
  }
)

function openCreateOperatorModal() {
  editingOperator.value = null
  operatorForm.value = { name: '', role: '', phone: '', email: '', city: '', password: '' }
  showOperatorModal.value = true
}

function openEditOperatorModal(operator) {
  editingOperator.value = operator
  operatorForm.value = {
    name: operator.name,
    role: operator.role,
    phone: operator.phone,
    email: operator.email,
    city: operator.city
  }
  showOperatorModal.value = true
}

async function submitOperatorForm() {
  if (!operatorForm.value.name.trim() || !operatorForm.value.email.trim()) {
    toast.error('Name and email are required.')
    return
  }
  if (!operatorForm.value.phone?.trim()) {
    toast.error('Phone is required for operator accounts.')
    return
  }
  try {
    if (editingOperator.value) {
      await updateOpsOperator(editingOperator.value.id, {
        ...operatorForm.value,
        email: operatorForm.value.email.trim().toLowerCase()
      })
      toast.success('Operator updated.')
    } else {
      const result = await createOpsOperator({
        ...operatorForm.value,
        email: operatorForm.value.email.trim().toLowerCase()
      })
      const password = result.temporary_password
      toast.success(password ? `Operator added. Temporary password: ${password}` : 'Operator added.', 8000)
    }
    showOperatorModal.value = false
  } catch (err) {
    toast.error(getApiErrorMessage(err, 'Could not save operator.'))
  }
}

async function handleDeleteOperator(operatorId) {
  if (!confirm(t('admin.operations.deleteOperatorConfirm'))) return
  try {
    await deleteOpsOperator(operatorId)
  } catch (err) {
    toast.error(getApiErrorMessage(err, 'Could not remove operator.'))
  }
}

function openCreateTaskModal(opId = null) {
  editingTask.value = null
  const today = todayDate.value
  const operatorId = opId || (opsOperators.value[0]?.id || '')
  const scheduledDate = clampToTodayOrLater(selectedCalendarDate.value || today)
  const freeSlot =
    TASK_TIME_SLOTS.find(
      (slot) =>
        !findOperatorSlotConflicts(opsTasks.value, {
          operatorId,
          scheduledDate,
          timeSlot: slot
        }).length
    ) || TASK_TIME_SLOTS[0]
  taskForm.value = {
    type: 'installation',
    title: '',
    operatorId,
    projectId: '',
    priority: 'medium',
    scheduledDate,
    timeSlot: freeSlot,
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    clientAddress: '',
    clientCity: 'Casablanca',
    adminNotes: ''
  }
  if (!projects.value.length) fetchProjects().catch(() => {})
  showTaskModal.value = true
  refreshScheduleConflict()
}

function openEditTaskModal(task) {
  editingTask.value = task
  taskForm.value = {
    type: task.type,
    title: task.title,
    operatorId: task.operatorId,
    projectId: task.projectId || '',
    priority: task.priority,
    scheduledDate: clampToTodayOrLater(task.scheduledDate),
    timeSlot: task.timeSlot,
    clientName: task.client.name,
    clientPhone: task.client.phone,
    clientEmail: task.client.email,
    clientAddress: task.client.address,
    clientCity: task.client.city,
    adminNotes: task.adminNotes
  }
  if (!projects.value.length) fetchProjects().catch(() => {})
  showTaskModal.value = true
  refreshScheduleConflict()
}

function buildTaskPayload() {
  const form = taskForm.value
  return {
    ...form,
    operatorId: Number(form.operatorId),
    projectId: form.projectId ? Number(form.projectId) : null,
    scheduledDate: clampToTodayOrLater(form.scheduledDate)
  }
}

async function submitTaskForm() {
  if (!taskForm.value.title || !taskForm.value.operatorId) return
  if (taskForm.value.scheduledDate < todayDate.value) {
    toast.error(t('admin.operations.modal.pastDateError'))
    taskForm.value.scheduledDate = todayDate.value
    return
  }
  refreshScheduleConflict()
  if (scheduleConflictWarning.value) {
    toast.error(scheduleConflictWarning.value)
    return
  }
  try {
    const payload = buildTaskPayload()
    if (editingTask.value) {
      await updateOpsTask(editingTask.value.id, payload)
    } else {
      await createOpsTask(payload)
    }
    showTaskModal.value = false
    toast.success(t('admin.operations.modal.saved'))
  } catch (err) {
    toast.error(getApiErrorMessage(err, 'Could not save job.'))
  }
}

function openOperatorSchedule(operator) {
  scheduleOperator.value = operator
  const now = new Date()
  scheduleMonth.value = now.getMonth()
  scheduleYear.value = now.getFullYear()
  scheduleSelectedDate.value = now.toISOString().slice(0, 10)
  showOperatorSchedule.value = true
}

function closeOperatorSchedule() {
  showOperatorSchedule.value = false
  scheduleOperator.value = null
}

function shiftScheduleMonth(delta) {
  let month = scheduleMonth.value + delta
  let year = scheduleYear.value
  if (month < 0) {
    month = 11
    year -= 1
  } else if (month > 11) {
    month = 0
    year += 1
  }
  scheduleMonth.value = month
  scheduleYear.value = year
}

function tasksOnScheduleDate(date) {
  return scheduleOperatorTasks.value.filter((task) => task.scheduledDate === date)
}

function selectScheduleDate(date) {
  scheduleSelectedDate.value = date
}

async function handleDeleteTask(taskId) {
  if (!confirm('Are you sure you want to delete this task assignment?')) return
  try {
    await deleteOpsTask(taskId)
  } catch (err) {
    toast.error(getApiErrorMessage(err, 'Could not delete job.'))
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

function opsStatusLabel(status) {
  const map = {
    assigned: t('admin.operations.list.assigned'),
    in_progress: t('admin.operations.list.inProgress'),
    on_hold: t('admin.operations.list.onHold'),
    completed: t('admin.operations.list.completed')
  }
  return map[status] || status
}

function opsPriorityLabel(priority) {
  const map = {
    low: t('admin.operations.modal.priorityLow'),
    medium: t('admin.operations.modal.priorityMedium'),
    high: t('admin.operations.modal.priorityHigh'),
    urgent: t('admin.operations.modal.priorityUrgent')
  }
  return map[priority] || priority
}

function operatorInitials(name) {
  return String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
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

const showServiceModal = ref(false)
const editingService = ref(null)
const serviceForm = ref({
  title: '',
  category: '',
  startingPrice: '',
  estimatedDuration: '',
  desc: '',
  bulletsText: '',
  enabled: true
})

function resetServiceForm() {
  serviceForm.value = {
    title: '',
    category: 'General',
    startingPrice: '',
    estimatedDuration: '',
    desc: '',
    bulletsText: '',
    enabled: true
  }
}

function openCreateServiceModal() {
  editingService.value = null
  resetServiceForm()
  showServiceModal.value = true
}

function openEditServiceModal(srv) {
  editingService.value = srv
  serviceForm.value = {
    title: srv.title || '',
    category: srv.category || '',
    startingPrice: srv.startingPrice || '',
    estimatedDuration: srv.estimatedDuration || '',
    desc: srv.desc || '',
    bulletsText: Array.isArray(srv.bullets) ? srv.bullets.join('\n') : '',
    enabled: srv.enabled !== false
  }
  showServiceModal.value = true
}

async function submitServiceForm() {
  const payload = {
    title: serviceForm.value.title,
    category: serviceForm.value.category,
    startingPrice: serviceForm.value.startingPrice,
    estimatedDuration: serviceForm.value.estimatedDuration,
    desc: serviceForm.value.desc,
    enabled: serviceForm.value.enabled,
    bullets: serviceForm.value.bulletsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  }

  if (editingService.value) {
    const updated = await updateService(editingService.value.id, payload)
    if (updated) {
      toast.success('Service updated')
      showServiceModal.value = false
    } else {
      toast.error(servicesError.value || 'Update failed')
    }
  } else {
    const result = await createService(payload)
    if (result?.success) {
      toast.success('Service created')
      showServiceModal.value = false
    } else {
      toast.error(result?.error || 'Create failed')
    }
  }
}

async function handleToggleService(srv) {
  const updated = await toggleServiceEnabled(srv.id)
  if (updated) toast.success(updated.enabled ? 'Service enabled' : 'Service disabled')
  else toast.error('Toggle failed')
}

async function handleDeleteService(srv) {
  const okConfirm = confirm(
    `Supprimer « ${srv.title} » ?\n\nAttention: toutes les demandes de service liées seront aussi supprimées.`
  )
  if (!okConfirm) return
  const ok = await deleteService(srv.id)
  if (ok) toast.success('Service deleted')
  else toast.error('Delete failed')
}

async function handleAssignServiceRequest(req) {
  const opId = assignOperatorMap.value[req.id]
  if (!opId) return
  const updated = await acceptAndAssignRequest(req.id, opId)
  if (updated) toast.success('Operator assigned')
  else toast.error('Assign failed')
}

async function handleRejectServiceRequest(req) {
  if (!confirm(`Rejeter la demande ${req.id} ?`)) return
  const updated = await rejectServiceRequest(req.id, 'Rejected by admin')
  if (updated) toast.success('Request rejected')
  else toast.error('Reject failed')
}

async function handleUpdateServicePhase(req, step) {
  const updated = await updateRequestPhase(req.id, step)
  if (updated) toast.success(`Phase set to ${step}`)
  else toast.error('Phase update failed')
}

async function loadServicesTab() {
  await reloadServices({ admin: true, withRequests: true })
  if (!opsOperators.value.length) {
    try {
      await loadOperations()
    } catch (_) {
      /* operators optional for catalog edit */
    }
  }
  for (const req of serviceRequests.value) {
    if (req.assignedOperatorId && !assignOperatorMap.value[req.id]) {
      assignOperatorMap.value[req.id] = req.assignedOperatorId
    }
  }
}

let servicesPollTimer = null
watch(
  () => activeTab.value,
  (tab) => {
    if (servicesPollTimer) {
      clearInterval(servicesPollTimer)
      servicesPollTimer = null
    }
    if (tab === 'services') {
      servicesPollTimer = setInterval(() => {
        reloadServices({ admin: true, withRequests: true })
      }, 15000)
    }
  }
)

const pendingServiceRequestCount = computed(
  () => serviceRequests.value.filter((r) => r.status === 'pending' || r.status === 'accepted').length
)

const tabs = computed(() => {
  locale.value
  const ordersBadge = stats.value?.totals?.pending_rfqs || null
  return [
    { id: 'overview', label: t('admin.tabs.overview'), icon: 'overview' },
    { id: 'orders', label: t('admin.tabs.orders'), icon: 'orders', badge: ordersBadge || null },
    { id: 'marketplace', label: t('admin.tabs.marketplace'), icon: 'marketplace', badge: stats.value?.totals?.low_stock_count || null },
    { id: 'projects', label: t('admin.tabs.projects'), icon: 'projects' },
    { id: 'services', label: t('admin.tabs.services') || 'Services', icon: 'services', badge: pendingServiceRequestCount.value || null },
    { id: 'clients', label: t('admin.tabs.clients'), icon: 'clients' },
    {
      id: 'operations',
      label: t('admin.tabs.operations'),
      icon: 'operations',
      badge: opsStats.value?.inProgress || null,
      children: [
        { id: 'jobs', label: t('admin.operations.menu.jobs') },
        { id: 'operators', label: t('admin.operations.menu.operators') }
      ]
    },
    { id: 'ai-analysis', label: t('admin.tabs.aiAnalysis'), icon: 'ai' }
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
  await reloadServices({ admin: true, withRequests: true }).catch(() => {})
  nowTickTimer = setInterval(() => {
    nowTick.value = Date.now()
  }, 30000)
  window.addEventListener('focus', () => {
    if (activeTab.value === 'services') loadServicesTab()
  })
})

onUnmounted(() => {
  if (nowTickTimer) clearInterval(nowTickTimer)
})

//
const handleLogout = async () => {
  await logoutUser()
  router.push('/login')
}

const missionMenuOpen = ref(false)

const switchTab = async (tabId) => {
  if (tabId !== 'projects' && showProjectDrawer.value) {
    closeProjectDrawer()
  }
  activeTab.value = tabId
  if (tabId !== 'operations') missionMenuOpen.value = false
  if (tabId === 'overview') await loadOverview()
  if (tabId === 'orders') await loadOrders()
  if (tabId === 'marketplace') await loadMarketplace()
  if (tabId === 'projects') await loadProjects()
  if (tabId === 'clients') await loadClients()
  if (tabId === 'services') await loadServicesTab()
  if (tabId === 'operations') {
    await loadOperations()
    if (!projects.value.length) await fetchProjects().catch(() => {})
  }
  // AI panel loads its own data via Aianalysispanel on mount
}

const toggleMissionMenu = async () => {
  if (activeTab.value !== 'operations') {
    missionMenuOpen.value = true
    await switchTab('operations')
    missionMenuOpen.value = true
    return
  }
  missionMenuOpen.value = !missionMenuOpen.value
}

const openOpsSection = async (section) => {
  opsSection.value = section
  if (activeTab.value !== 'operations') {
    await switchTab('operations')
    return
  }
  await loadOperations()
}

const loadOperations = async () => {
  try {
    await reloadOperations()
  } catch (err) {
    toast.error(getApiErrorMessage(err, 'Could not load missions.'))
  }
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
    current_phase: getCurrentPhase(project),
    on_hold: project.status === 'on_hold',
    admin_notes: project.admin_notes || ''
  }
  selectedQuoteIds.value = (project.rfq_tickets || []).map((quote) => quote.id)
  projectLines.value = (project.lines || []).map((line) => ({ ...line }))
  projectInstallations.value = (project.installations || []).map((row) => ({ ...row, price: row.price ?? '' }))
  projectMaintenances.value = (project.maintenances || []).map((row) => ({ ...row, price: row.price ?? '' }))
  availableQuotes.value = await fetchQuotes()
  await loadCatalogForPicker()
  replyDraft.value = ''
  showProjectDrawer.value = true
  tracesLoading.value = true
  const [traces, messages] = await Promise.all([
    fetchProjectTraces(project.id),
    fetchProjectMessages(project.id)
  ])
  projectTraces.value = traces
  projectMessages.value = messages
  tracesLoading.value = false
}

const sendProjectReply = async () => {
  const body = replyDraft.value.trim()
  if (!editingProject.value || !body || replySending.value) return
  replySending.value = true
  try {
    const message = await postProjectMessage(editingProject.value.id, body)
    projectMessages.value = [...projectMessages.value, message]
    replyDraft.value = ''
  } catch (err) {
    toast.error(getApiErrorMessage(err, 'Could not send the reply.'))
  } finally {
    replySending.value = false
  }
}

const closeProjectDrawer = () => {
  showProjectDrawer.value = false
  editingProject.value = null
  projectFormError.value = ''
  projectSaveSuccess.value = ''
  selectedQuoteIds.value = []
  projectLines.value = []
  projectInstallations.value = []
  projectMaintenances.value = []
  projectTraces.value = []
  projectMessages.value = []
  replyDraft.value = ''
}

function appendInternalNote(text) {
  const current = projectForm.value.admin_notes?.trim()
  projectForm.value.admin_notes = current ? `${current}\n${text}` : text
}

const buildProjectPayload = () => {
  const form = projectForm.value
  return {
    location: form.location,
    admin_notes: form.admin_notes || null,
    completed_steps: phaseToCompletedSteps(form.current_phase),
    on_hold: form.on_hold,
    quote_ids: selectedQuoteIds.value,
    lines: projectLines.value.map((line) => ({
      id_product: line.id_product,
      title: line.title,
      quantity: Number(line.quantity) || 1,
      unit_price: Number(line.unit_price),
      locked: !!line.locked
    })),
    installations: cleanInstallations(projectInstallations.value),
    maintenances: cleanMaintenances(projectMaintenances.value)
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
    await loadProjects()
    const refreshed = projects.value.find((project) => project.id === editingProject.value.id)
    const project = refreshed || result.project
    editingProject.value = project
    selectedQuoteIds.value = (project.rfq_tickets || []).map((quote) => quote.id)
    projectLines.value = (project.lines || []).map((line) => ({ ...line }))
    projectInstallations.value = (project.installations || []).map((row) => ({ ...row, price: row.price ?? '' }))
    projectMaintenances.value = (project.maintenances || []).map((row) => ({ ...row, price: row.price ?? '' }))
    projectTraces.value = result.traces || []
    projectSaveSuccess.value = t('admin.projects.saved')
    await fetchStats()
  } else {
    projectFormError.value = error.value || 'Could not save follow-up.'
  }
}

const loadProjects = async () => {
  await Promise.all([
    fetchProjects(projectFilter.value ? { status: projectFilter.value } : {}),
    fetchUsers()
  ])
  availableQuotes.value = await fetchQuotes()
}

const openCreateProject = async () => {
  createProjectForm.value = emptyCreateProject()
  showCreateProject.value = true
  if (!users.value.length) await fetchUsers()
  availableQuotes.value = await fetchQuotes()
  await loadCatalogForPicker()
  createCatalogPickerRef.value?.resetFilters()
}

const submitCreateProject = async () => {
  creatingProject.value = true
  const result = await createProject({
    name: createProjectForm.value.name.trim(),
    id_client: Number(createProjectForm.value.id_client),
    location: createProjectForm.value.location.trim() || null,
    description: createProjectForm.value.description.trim() || null,
    quote_ids: createProjectForm.value.quote_ids,
    lines: createProjectForm.value.lines.map((line) => ({
      id_product: line.id_product,
      title: line.title,
      quantity: Number(line.quantity) || 1,
      unit_price: Number(line.unit_price),
      locked: !!line.locked
    })),
    installations: cleanInstallations(createProjectForm.value.installations),
    maintenances: cleanMaintenances(createProjectForm.value.maintenances)
  })
  creatingProject.value = false
  if (result.success) {
    showCreateProject.value = false
    await loadProjects()
  } else {
    toast.error(result.error || 'Could not create project.')
  }
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
  height: 100vh;
  overflow: hidden;
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
  grid-template-columns: 260px minmax(0, 1fr);
  height: 100%;
}

.admin-sidebar {
  background: #020d07;
  color: #f0fdf4;
  border-right: 1px solid rgba(74, 222, 128, 0.12);
  padding: 1.15rem 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: 100%;
  overflow-x: hidden;
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
  opacity: 0.85;
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

.nav-caret {
  margin-left: auto;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid currentColor;
  opacity: 0.7;
  transition: transform 0.15s ease;
}

.nav-caret.open {
  transform: rotate(180deg);
}

.nav-sub {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin: 0.15rem 0 0.55rem 0.85rem;
  padding: 0.2rem 0 0.2rem 0.75rem;
  border-left: 1px solid rgba(74, 222, 128, 0.28);
}

.nav-sub-btn {
  border: none;
  background: transparent;
  text-align: left;
  color: rgba(240, 253, 244, 0.62);
  font-size: 0.84rem;
  font-weight: 650;
  padding: 0.45rem 0.65rem;
  border-radius: 8px;
  cursor: pointer;
}

.nav-sub-btn:hover,
.nav-sub-btn.active {
  color: #4ade80;
  background: rgba(74, 222, 128, 0.1);
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

.status-pill.project.completed,
.status-pill.project.on_hold,
.status-pill.project.quote_confirmed,
.status-pill.project.order_prep,
.status-pill.project.installation {
  background: #f5f5f4;
  color: #44403c;
}

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
  min-width: 0;
  height: 100%;
  padding: 1.15rem 1.5rem 1.5rem;
  overflow: auto;
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

.operators-panel .panel-header {
  margin-bottom: 0.85rem;
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
  gap: 0.85rem;
}

.orders-panel {
  gap: 1.1rem;
}

.orders-header {
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
}

.orders-header-tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.orders-view-tabs {
  display: inline-flex;
  padding: 0.18rem;
  background: #f4f4f5;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  gap: 0.1rem;
}

.orders-view-tab {
  border: none;
  background: transparent;
  color: #71717a;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.42rem 0.7rem;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.orders-view-tab.active {
  background: #fff;
  color: #18181b;
  box-shadow: 0 1px 2px rgba(24, 24, 27, 0.08);
}

.orders-count {
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.3rem;
  border-radius: 999px;
  background: #27272a;
  color: #fff;
  font-size: 0.66rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.orders-count.muted {
  background: #a1a1aa;
}

.orders-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.65rem;
  margin-bottom: 1.25rem;
}

.orders-stat {
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.orders-stat strong {
  font-size: 1.25rem;
  color: #18181b;
  line-height: 1;
  font-weight: 700;
}

.orders-stat span {
  font-size: 0.76rem;
  color: #71717a;
  font-weight: 500;
}

.orders-stat.new {
  border-color: #e4e4e7;
  background: #fff;
}

.orders-stat.new strong {
  color: #18181b;
}

.orders-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.orders-section + .orders-section {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid #e4e4e7;
}

.orders-section-head {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.orders-section-head h2 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #18181b;
}

.orders-section-head span {
  font-size: 0.8rem;
  color: #71717a;
}

.orders-empty {
  margin-top: 0.5rem;
}

.rfq-card {
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 14px;
  padding: 1.1rem 1.15rem;
  box-shadow: none;
}

.rfq-card--new {
  border-color: #d4d4d8;
  background: #fafafa;
}

.rfq-card-top {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.rfq-id-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
}

.rfq-new-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #3f3f46;
  background: #e4e4e7;
  border-radius: 6px;
  padding: 0.18rem 0.45rem;
}

.rfq-card-top h3 {
  margin: 0.4rem 0 0;
  font-size: 1.02rem;
  color: #18181b;
  font-weight: 650;
}

.rfq-card-top p {
  margin: 0.2rem 0 0;
  font-size: 0.84rem;
  color: #71717a;
}

.rfq-card-top small {
  color: #a1a1aa;
  font-size: 0.76rem;
}

.rfq-id {
  display: inline-block;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #52525b;
  background: #f4f4f5;
  border: 1px solid #e4e4e7;
  border-radius: 6px;
  padding: 0.18rem 0.45rem;
}

.rfq-card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0.8rem;
  align-items: center;
  margin: 0.3rem 0 0.7rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: #52525b;
}

.rfq-details {
  margin-bottom: 0.75rem;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  background: #fff;
  overflow: hidden;
}

.rfq-details summary {
  cursor: pointer;
  list-style: none;
  padding: 0.6rem 0.8rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #3f3f46;
}

.rfq-details summary::-webkit-details-marker {
  display: none;
}

.rfq-details[open] summary {
  border-bottom: 1px solid #e4e4e7;
}

.rfq-details .rfq-mini-table {
  margin: 0;
  border: none;
  border-radius: 0;
  box-shadow: none;
}

.rfq-pipeline {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
}

@media (max-width: 720px) {
  .orders-summary {
    grid-template-columns: 1fr;
  }

  .orders-header-tools {
    width: 100%;
  }

  .orders-view-tabs {
    width: 100%;
  }

  .orders-view-tab {
    flex: 1;
    justify-content: center;
  }
}

.rfq-step {
  font-size: 0.66rem;
  font-weight: 600;
  padding: 0.22rem 0.48rem;
  border-radius: 6px;
  background: #f4f4f5;
  color: #a1a1aa;
}

.rfq-step.done {
  background: #f4f4f5;
  color: #52525b;
}

.rfq-step.current {
  background: #18181b;
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
  .admin-page {
    height: auto;
    overflow: visible;
  }

  .admin-layout {
    grid-template-columns: 1fr;
    height: auto;
  }

  .admin-sidebar {
    height: auto;
    overflow: visible;
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
    height: auto;
    overflow: visible;
    padding: 1rem;
  }

  .project-workspace {
    left: 0;
    right: 0;
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
  background: #fff;
  border: 1px solid #e7e5e4;
}

.followup-stat strong {
  font-size: 1.35rem;
  color: #1c1917;
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

.wf-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
}

.wf-kicker {
  margin: 0 0 0.2rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #78716c;
}

.wf-title {
  margin: 0 !important;
  font-size: 1rem !important;
  font-weight: 750 !important;
  color: #14532d !important;
  line-height: 1.3;
}

.wf-progress {
  height: 4px;
  border-radius: 999px;
  background: #f5f5f4;
  overflow: hidden;
  margin: 0.85rem 0 1rem;
}

.wf-progress-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #15803d;
  transition: width 0.25s ease;
}

.wf-steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}

.wf-step {
  position: relative;
  padding-bottom: 0.55rem;
}

.wf-step:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 0.85rem;
  top: 1.85rem;
  bottom: 0;
  width: 2px;
  background: #e7e5e4;
}

.wf-step.done:not(:last-child)::before {
  background: #86efac;
}

.wf-step-btn {
  display: grid;
  grid-template-columns: 1.75rem 1fr;
  gap: 0.7rem;
  align-items: flex-start;
  width: 100%;
  padding: 0.15rem 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  font: inherit;
}

.wf-dot {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 750;
  flex-shrink: 0;
  background: #fafaf9;
  border: 1.5px solid #d6d3d1;
  color: #78716c;
  position: relative;
  z-index: 1;
}

.wf-check {
  font-size: 0.78rem;
  line-height: 1;
}

.wf-step.done .wf-dot {
  background: #15803d;
  border-color: #15803d;
  color: #fff;
}

.wf-step.current .wf-dot {
  background: #fff;
  border-color: #15803d;
  color: #15803d;
  box-shadow: 0 0 0 3px rgba(21, 128, 61, 0.15);
}

.wf-step-copy {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
  padding-top: 0.2rem;
}

.wf-step-name {
  font-size: 0.88rem;
  font-weight: 650;
  color: #44403c;
}

.wf-step.current .wf-step-name {
  color: #14532d;
  font-weight: 750;
}

.wf-step.done .wf-step-name {
  color: #57534e;
}

.wf-step.muted .wf-step-name {
  color: #a8a29e;
  font-weight: 550;
}

.wf-step-hint {
  font-size: 0.74rem;
  line-height: 1.4;
  color: #78716c;
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
  border-color: #d6d3d1;
  background: #fafaf9;
}

.phase-option.selected {
  border-color: #1c1917;
  background: #fafaf9;
  box-shadow: none;
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
  color: #44403c;
  background: #f5f5f4;
  border: 1px solid #e7e5e4;
  flex-shrink: 0;
}

.phase-option.selected .phase-index {
  background: #1c1917;
  border-color: #1c1917;
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

.workflow-section,
.internal-section,
.order-recap,
.site-section,
.client-update-section {
  padding: 1.35rem 1.4rem;
  border-radius: 16px;
  border: 1px solid #e7e5e4;
  background: #fff;
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
  font-size: 0.7rem;
  font-weight: 750;
  letter-spacing: 0.02em;
  color: #57534e;
  background: #f5f5f4;
  border: 1px solid #e7e5e4;
  border-radius: 999px;
  padding: 0.28rem 0.55rem;
  white-space: nowrap;
  flex-shrink: 0;
}

.hold-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.35rem;
  padding: 0.55rem 0.7rem;
  border-radius: 10px;
  border: 1px solid #e7e5e4;
  background: #fafaf9;
  font-size: 0.82rem;
  font-weight: 600;
  color: #57534e;
  cursor: pointer;
}

.hold-toggle.active {
  border-color: #fcd34d;
  background: #fffbeb;
  color: #92400e;
}

.hold-toggle input {
  accent-color: #d97706;
}

.followup-btn {
  width: auto;
  margin-left: auto;
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
  background: #fff;
}

.order-total {
  flex-shrink: 0;
  font-size: 0.92rem;
  font-weight: 800;
  color: #1c1917;
  background: #f5f5f4;
  border: 1px solid #e7e5e4;
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

.site-section {
  background: #fff;
}

.client-update-section h3 {
  margin: 0;
}

.thread {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  max-height: 280px;
  overflow: auto;
  margin-bottom: 0.85rem;
}

.thread-empty {
  margin: 0;
  color: #a8a29e;
  font-size: 0.84rem;
}

.thread-item {
  max-width: 85%;
  padding: 0.7rem 0.85rem;
  border-radius: 14px;
  background: #f5f5f4;
  border: 1px solid #e7e5e4;
}

.thread-item.team {
  margin-left: auto;
  background: #1c1917;
  border-color: #1c1917;
  color: #fff;
}

.thread-item header {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.3rem;
  font-size: 0.72rem;
}

.thread-item header time,
.thread-item.client header strong {
  color: #78716c;
  font-weight: 600;
}

.thread-item.team header strong,
.thread-item.team header time {
  color: #d6d3d1;
}

.thread-item p {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.45;
  white-space: pre-wrap;
}

.thread-compose {
  display: grid;
  gap: 0.55rem;
}

.thread-compose textarea {
  width: 100%;
  border: 1px solid #e7e5e4;
  border-radius: 12px;
  padding: 0.7rem 0.8rem;
  font: inherit;
  resize: vertical;
}

.thread-compose .primary-btn {
  justify-self: end;
}

.site-section {
  background: #fff;
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
  color: #44403c;
  background: #f5f5f4;
  border: 1px solid #e7e5e4;
}

.client-message-preview {
  margin-top: 0.15rem;
  padding: 0.85rem 0.95rem;
  border-radius: 12px;
  background: #fafaf9;
  border: 1px dashed #d6d3d1;
}

.preview-label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #78716c;
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
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
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
  border-color: #d6d3d1;
  background: #fafaf9;
}

.trace-panel {
  margin-top: 0.35rem;
  padding-top: 1rem;
  border-top: 1px solid #e7e5e4;
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
  color: #44403c;
  background: #f5f5f4;
  border: 1px solid #e7e5e4;
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
  border: 1px solid #e7e5e4;
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
  color: #a8a29e;
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

.project-workspace {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 260px;
  z-index: 200;
  background:
    radial-gradient(ellipse at top right, rgba(34, 197, 94, 0.06), transparent 42%),
    #f5f5f4;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.project-workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 1.1rem 1.75rem 1.2rem;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e7e5e4;
  flex-shrink: 0;
}

.pw-back {
  border: none;
  background: transparent;
  color: #78716c;
  font: inherit;
  font-size: 0.84rem;
  font-weight: 600;
  padding: 0;
  margin-bottom: 0.45rem;
  cursor: pointer;
}

.pw-back:hover {
  color: #15803d;
}

.pw-title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.project-workspace-title h2 {
  margin: 0;
  font-size: clamp(1.35rem, 2.4vw, 1.85rem);
  font-weight: 800;
  color: #052e16;
}

.pw-status {
  display: inline-flex;
  align-items: center;
  padding: 0.28rem 0.65rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  background: #f5f5f4;
  border: 1px solid #e7e5e4;
  color: #44403c;
}

.pw-status.completed {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #166534;
}

.pw-status.on_hold {
  background: #fff7ed;
  border-color: #fed7aa;
  color: #9a3412;
}

.pw-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.65rem;
}

.pw-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.28rem 0.6rem;
  border-radius: 999px;
  background: #fafaf9;
  border: 1px solid #e7e5e4;
  color: #44403c;
  font-size: 0.75rem;
  font-weight: 600;
}

.pw-chip.muted {
  color: #78716c;
  font-weight: 500;
}

.pw-kicker {
  margin: 0 0 0.2rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #a8a29e;
}

.project-workspace-actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-shrink: 0;
  padding-top: 0.35rem;
}

.project-workspace-form {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.project-workspace-layout {
  flex: 1;
  overflow-y: auto;
  padding: 1.35rem 1.75rem 1rem;
  display: grid;
  grid-template-columns: minmax(280px, 340px) minmax(0, 1fr);
  gap: 1.15rem;
  align-items: start;
}

.pw-rail,
.pw-main,
.pw-services,
.pw-comms {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  min-width: 0;
}

.pw-rail {
  position: sticky;
  top: 0;
}

.pw-services,
.pw-comms {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.15rem;
}

.project-workspace .drawer-section {
  padding: 1.25rem 1.35rem;
  border: 1px solid #e7e5e4;
  border-radius: 18px;
  background: #fff;
  margin: 0;
  box-shadow: 0 1px 0 rgba(28, 25, 23, 0.03);
}

.project-workspace .drawer-section h3 {
  margin: 0 0 0.85rem;
  font-size: 0.95rem;
  font-weight: 750;
  color: #1c1917;
}

.project-workspace .section-head h3 {
  margin: 0;
}

.pw-picker-wrap {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.project-workspace .service-card:not(.service-card-simple) {
  background: #fafaf9;
}

.create-services-section .service-card:not(.service-card-simple) {
  background: #fafaf9;
}

.project-workspace .thread {
  max-height: 280px;
  overflow-y: auto;
  margin-bottom: 0.85rem;
  padding-right: 0.25rem;
}

.project-workspace-msg {
  margin: 0 1.75rem;
}

.project-workspace-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.96);
  border-top: 1px solid #e7e5e4;
  flex-shrink: 0;
}

@media (max-width: 1100px) {
  .pw-services,
  .pw-comms {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 960px) {
  .project-workspace {
    left: 0;
  }

  .project-workspace-layout {
    grid-template-columns: 1fr;
  }

  .pw-rail {
    position: static;
  }

  .project-workspace-header {
    flex-direction: column;
  }

  .project-workspace-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

.project-drawer .drawer-section {
  padding: 1.5rem;
  border: 1px solid #e7e5e4;
  border-radius: 16px;
  background: #fff;
}

.quote-picks {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.quote-picks label {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.88rem;
}

.quote-picks small {
  color: #78716c;
}

.line-pick {
  display: grid;
  grid-template-columns: 1fr 1fr 0.55fr 0.7fr auto;
  gap: 0.45rem;
  align-items: center;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem;
}

.line-list {
  list-style: none;
  margin: 0.7rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.line-list li,
.service-card {
  display: grid;
  gap: 0.45rem;
  padding: 0.75rem;
  border: 1px solid #e7e5e4;
  border-radius: 12px;
  background: #fafaf9;
}

.service-card-simple {
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  background: #fff;
  border: 1px solid #e7e5e4;
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(28, 25, 23, 0.04);
}

.service-simple-top {
  display: flex;
  align-items: flex-end;
  gap: 0.65rem;
}

.service-price-field {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.service-price-field span,
.service-details-field span {
  display: block;
  margin: 0;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #78716c;
}

.price-input-wrap {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  max-width: 200px;
  padding: 0 0.75rem;
  border: 1px solid #e7e5e4;
  border-radius: 10px;
  background: #fafaf9;
  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
}

.price-input-wrap:focus-within {
  border-color: #22c55e;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
}

.price-input-wrap input {
  flex: 1;
  min-width: 0;
  width: 100%;
  border: none;
  background: transparent;
  padding: 0.65rem 0;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1c1917;
  outline: none;
}

.price-input-wrap input::-webkit-outer-spin-button,
.price-input-wrap input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.price-input-wrap input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.price-suffix {
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 700;
  color: #a8a29e;
}

.service-remove {
  flex-shrink: 0;
  margin-bottom: 0.1rem;
}

.service-details-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.service-details-field textarea {
  width: 100%;
  min-height: 4.5rem;
  resize: vertical;
  border: 1px solid #e7e5e4;
  border-radius: 10px;
  background: #fafaf9;
  padding: 0.7rem 0.8rem;
  font: inherit;
  font-size: 0.9rem;
  color: #1c1917;
  line-height: 1.45;
  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
}

.service-details-field textarea::placeholder {
  color: #a8a29e;
}

.service-details-field textarea:focus {
  outline: none;
  border-color: #22c55e;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
}

.line-list li {
  grid-template-columns: 1.4fr 0.6fr 0.8fr auto auto;
  align-items: center;
}

.service-card label span,
.modal-group h4 {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.78rem;
  color: #57534e;
}

.modal-group .section-head,
.drawer-section .section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.project-create-overlay {
  padding: 1rem 1.25rem;
}

.project-create-modal {
  width: min(920px, calc(100vw - 2.5rem));
  max-height: min(94vh, 920px);
}

.project-create-modal .modal-header {
  align-items: flex-start;
}

.project-create-modal .modal-kicker {
  margin: 0 0 0.2rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #15803d;
}

.project-create-modal .modal-header h3 {
  margin: 0;
}

.project-create-body {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  overflow-y: auto;
  padding: 1.15rem 1.35rem;
}

.create-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 1.1rem;
  border: 1px solid #e7e5e4;
  border-radius: 14px;
  background: #fff;
}

.create-section-head h4 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 750;
  color: #1c1917;
}

.create-section-head p {
  margin: 0.25rem 0 0;
  font-size: 0.82rem;
  color: #78716c;
  line-height: 1.4;
}

.create-essentials-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem 1rem;
}

.create-essentials-grid label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: #57534e;
}

.create-essentials-grid input,
.create-essentials-grid select,
.create-essentials-grid textarea {
  width: 100%;
  border: 1px solid rgba(5, 46, 22, 0.12);
  border-radius: 10px;
  padding: 0.65rem 0.75rem;
  font: inherit;
  font-weight: 500;
  color: #1c1917;
  background: #fff;
}

.create-span-2 {
  grid-column: 1 / -1;
}

.create-empty {
  margin: 0;
  padding: 0.85rem 0.95rem;
  border-radius: 10px;
  border: 1px dashed #d6d3d1;
  background: #fafaf9;
  color: #78716c;
  font-size: 0.86rem;
  line-height: 1.4;
}

.create-empty.muted {
  border-style: solid;
  border-color: #f1f5f9;
  background: transparent;
  padding: 0.35rem 0;
  font-size: 0.82rem;
}

.create-quote-picks {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.create-quote-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e7e5e4;
  border-radius: 999px;
  background: #fafaf9;
  cursor: pointer;
  font-size: 0.84rem;
  font-weight: 600;
  color: #292524;
}

.create-quote-chip:has(input:checked) {
  border-color: #86efac;
  background: #f0fdf4;
  color: #14532d;
}

.create-quote-chip input {
  accent-color: #15803d;
}

.create-quote-chip small {
  font-weight: 500;
  color: #78716c;
}

.project-create-services {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  align-items: start;
}

.create-service-block {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  min-width: 0;
}

.create-service-block h5 {
  margin: 0;
  font-size: 0.88rem;
  font-weight: 700;
  color: #44403c;
}

.create-services-section .service-card:not(.service-card-simple) {
  background: #fafaf9;
}

@media (max-width: 800px) {
  .create-essentials-grid,
  .project-create-services {
    grid-template-columns: 1fr;
  }

  .project-create-modal {
    width: 100%;
    max-height: 96vh;
  }
}

.project-create-sidebar {
  display: none;
}

.line-pick-wide {
  grid-template-columns: 1.2fr 1.4fr 0.55fr 0.75fr auto;
}

.line-list-wide li {
  grid-template-columns: minmax(0, 1.6fr) 0.55fr 0.75fr auto auto;
}

@media (max-width: 720px) {
  .line-pick-wide {
    grid-template-columns: 1fr 1fr;
  }

  .line-list-wide li {
    grid-template-columns: 1fr;
  }
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

.ghost-btn.small {
  padding: 0.45rem 0.75rem;
  font-size: 0.82rem;
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

.ops-people {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.person-chip {
  border: 1px solid rgba(5, 46, 22, 0.12);
  background: #fff;
  color: #052e16;
  border-radius: 999px;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  font-weight: 650;
}

.person-chip.active {
  background: #052e16;
  color: #f0fdf4;
  border-color: #052e16;
}

.person-chip.add {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border-style: dashed;
  color: #15803d;
}

.filter-group input[type='date'] {
  padding: 0.55rem 0.85rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #fff;
  font: inherit;
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

.add-op-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 220px;
  border: 1.5px dashed rgba(22, 163, 74, 0.45);
  background: #f8fcf9;
  color: #15803d;
  cursor: pointer;
  font: inherit;
}

.add-op-card:hover {
  border-color: #16a34a;
  background: #f0fdf4;
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

/* Jobs list */
.ops-simple-stats {
  display: flex;
  gap: 1.25rem;
  margin: -0.5rem 0 1.15rem;
  color: #6b7280;
  font-size: 0.88rem;
}

.ops-simple-stats strong {
  color: #052e16;
  font-size: 1.05rem;
  margin-right: 0.25rem;
}

.ops-simple-toolbar {
  margin-bottom: 1rem;
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

.filter-group select,
.filter-group input[type="date"] {
  padding: 0.55rem 0.85rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 0.85rem;
  background: #ffffff;
  color: #0f172a;
}

.ops-empty {
  padding: 2.5rem 1rem;
  text-align: center;
  color: #64748b;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 14px;
}

.job-grid,
.op-manage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.85rem;
}

.job-card,
.op-manage-card {
  background: #fff;
  border: 1px solid #e7e5e4;
  border-radius: 14px;
  padding: 1.35rem 1.4rem;
}

.op-manage-card--clickable {
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.op-manage-card--clickable:hover {
  border-color: #a8a29e;
  box-shadow: 0 8px 20px rgba(28, 25, 23, 0.06);
}

.job-project {
  margin: 0.25rem 0 0;
  font-size: 0.82rem;
  color: #57534e;
}

.job-countdown {
  margin-top: 0.65rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #166534;
}

.job-countdown.soon {
  color: #b45309;
}

.job-countdown.overdue {
  color: #b91c1c;
}

.job-countdown.done {
  color: #78716c;
  font-weight: 500;
}

.ops-conflict-warning {
  margin: 0.65rem 0 0;
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  font-size: 0.82rem;
}

.ops-schedule-modal {
  width: min(720px, 96vw);
  max-height: 92vh;
  overflow: auto;
}

.ops-schedule-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ops-cal-toolbar {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.ops-cal-toolbar strong {
  min-width: 9rem;
  text-align: center;
  text-transform: capitalize;
}

.ops-cal-toolbar .primary-btn.small {
  margin-inline-start: auto;
}

.ops-cal-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.35rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: #78716c;
  text-align: center;
}

.ops-cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.35rem;
}

.ops-cal-cell {
  min-height: 3.25rem;
  border: 1px solid #e7e5e4;
  border-radius: 10px;
  background: #fafaf9;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0.35rem 0.4rem;
  cursor: pointer;
}

.ops-cal-cell.empty,
.ops-cal-cell:disabled {
  background: transparent;
  border-color: transparent;
  cursor: default;
}

.ops-cal-cell.hasTasks {
  background: #ecfdf5;
  border-color: #a7f3d0;
}

.ops-cal-cell.selected {
  border-color: #166534;
  box-shadow: inset 0 0 0 1px #166534;
}

.ops-cal-day {
  font-size: 0.85rem;
  font-weight: 600;
  color: #292524;
}

.ops-cal-dot {
  align-self: flex-end;
  font-size: 0.68rem;
  font-weight: 700;
  color: #166534;
  background: #d1fae5;
  border-radius: 999px;
  padding: 0.05rem 0.35rem;
}

.ops-cal-day-panel h4 {
  margin: 0 0 0.65rem;
  font-size: 0.95rem;
}

.ops-cal-task-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.ops-cal-task-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 0.85rem;
  border: 1px solid #e7e5e4;
  border-radius: 10px;
  background: #fff;
}

.ops-cal-task-list li div {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.ops-cal-task-list li span {
  font-size: 0.8rem;
  color: #78716c;
}

.ops-chip {
  font-size: 0.72rem;
  font-weight: 600;
  color: #44403c;
  background: #f5f5f4;
  border-radius: 999px;
  padding: 0.2rem 0.55rem;
}

.ops-quiet {
  font-size: 0.75rem;
  color: #78716c;
}

.job-card-top,
.job-card-actions,
.op-manage-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.job-card h3,
.op-manage-card h3 {
  margin: 0.7rem 0 0.2rem;
  font-size: 1rem;
  color: #0f172a;
}

.job-client,
.op-manage-head p {
  margin: 0;
  color: #64748b;
  font-size: 0.82rem;
}

.job-meta,
.op-manage-facts {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0.75rem 0 0;
  padding: 0;
  list-style: none;
  color: #334155;
  font-size: 0.82rem;
}

.job-card-actions,
.op-manage-foot {
  margin-top: 0.85rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;
}

.action-btns {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.op-manage-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.op-manage-head h3 { margin: 0; }

.op-avatar {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #f5f5f4;
  color: #292524;
  font-size: 0.78rem;
  font-weight: 700;
  flex-shrink: 0;
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

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 13, 7, 0.45);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.25rem;
}

.service-edit-overlay {
  z-index: 1400;
}

.modal-overlay--stack-top {
  z-index: 1600;
}

.ops-modal {
  background: #fff;
  border-radius: 18px;
  width: min(720px, 100%);
  max-height: min(86vh, 820px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 60px rgba(2, 13, 7, 0.22);
  overflow: hidden;
}

.ops-modal-sm {
  width: min(520px, 100%);
}

.ops-modal .task-form {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.15rem 1.25rem 1rem;
  border-bottom: 1px solid rgba(5, 46, 22, 0.08);
}

.modal-kicker {
  margin: 0 0 0.15rem;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #16a34a;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  color: #052e16;
}

.close-btn {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid rgba(5, 46, 22, 0.08);
  background: #f8faf9;
  color: #052e16;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
}

.close-btn:hover {
  background: #eef4f0;
}

.modal-body {
  overflow-y: auto;
  padding: 1.1rem 1.25rem 0.4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-group {
  background: #f8faf9;
  border: 1px solid rgba(5, 46, 22, 0.06);
  border-radius: 14px;
  padding: 0.9rem 0.95rem 1rem;
}

.modal-group h4 {
  margin: 0 0 0.75rem;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #15803d;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.form-grid .span-2 {
  grid-column: span 2;
}

.ops-modal label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: #374151;
}

.ops-modal input,
.ops-modal select,
.ops-modal textarea {
  width: 100%;
  border: 1px solid rgba(5, 46, 22, 0.12);
  background: #fff;
  border-radius: 10px;
  padding: 0.65rem 0.75rem;
  font: inherit;
  font-weight: 500;
  color: #052e16;
}

.ops-modal input:focus,
.ops-modal select:focus,
.ops-modal textarea:focus {
  outline: none;
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
}

.priority-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.8rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: #374151;
}

.priority-pills {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.priority-pill {
  border: 1px solid rgba(5, 46, 22, 0.1);
  background: #fff;
  color: #374151;
  border-radius: 999px;
  padding: 0.32rem 0.7rem;
  font-size: 0.78rem;
  font-weight: 700;
}

.priority-pill.active {
  background: #1c1917;
  color: #fff;
  border-color: #1c1917;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
  padding: 0.9rem 1.25rem 1.1rem;
  border-top: 1px solid rgba(5, 46, 22, 0.08);
  background: #fff;
}

@media (max-width: 640px) {
  .form-grid,
  .form-grid .span-2 {
    grid-template-columns: 1fr;
    grid-column: auto;
  }

  .priority-row {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* Service Admin Controls & Realization Progress CSS */
.ops-services-config-view .config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.service-config-card {
  background: #ffffff;
  border: 1px solid rgba(5, 46, 22, 0.08);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
}

.service-config-card.disabled {
  background: #f8fafc;
  border-style: dashed;
  opacity: 0.75;
}

.service-config-card .card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.cat-tag {
  font-size: 0.7rem;
  font-weight: 700;
  color: #16a34a;
  text-transform: uppercase;
}

.service-config-card h3 {
  font-size: 1.1rem;
  font-weight: 800;
  color: #052e16;
  margin: 0.2rem 0 0 0;
}

.toggle-switch-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: .3s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
}

input:checked + .slider {
  background-color: #16a34a;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.toggle-lbl {
  font-size: 0.7rem;
  font-weight: 800;
}
.toggle-lbl.enabled { color: #16a34a; }
.toggle-lbl.disabled { color: #b45309; }

.config-desc {
  font-size: 0.85rem;
  color: #475569;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.config-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  background: #f8fafc;
  padding: 0.6rem 0.85rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.realization-summary {
  font-size: 0.8rem;
  color: #334155;
}

.steps-mini-list {
  padding-left: 1.2rem;
  margin: 0.35rem 0 0 0;
}

/* Service Requests Phase Controls */
.assign-op-box {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.assign-op-box select {
  font-size: 0.8rem;
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
}

.phase-badge-cell {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 130px;
}

.phase-num {
  font-size: 0.78rem;
  font-weight: 800;
  color: #16a34a;
}

.mini-progress-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.mini-fill {
  height: 100%;
  background: #16a34a;
  border-radius: 999px;
}

.phase-step-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.phase-step-buttons span {
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 600;
}

.step-btn-group {
  display: flex;
  gap: 0.25rem;
}

.step-toggle-btn {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #334155;
  font-weight: 800;
  font-size: 0.75rem;
  cursor: pointer;
}

.step-toggle-btn.active {
  background: #052e16;
  color: #4ade80;
  border-color: #052e16;
}

/* Operator Table Profile & Service Editing */
.op-table-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.card-footer-actions {
  margin-top: 1rem;
  border-top: 1px solid #f1f5f9;
  padding-top: 0.85rem;
}

.edit-service-btn {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  padding: 0.65rem 1rem;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-service-btn:hover {
  background: #dcfce7;
  border-color: #86efac;
  color: #166534;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.15);
}

.service-card-actions {
  display: flex;
  gap: 0.5rem;
}

.service-card-actions .edit-service-btn,
.service-card-actions .danger-service-btn {
  flex: 1;
  width: auto;
}

.danger-service-btn {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 0.65rem 1rem;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  cursor: pointer;
}

.danger-service-btn:hover {
  background: #fee2e2;
}

.service-requests-block {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.subpanel-header {
  margin-bottom: 1rem;
}

.subpanel-header h2 {
  margin: 0;
  font-size: 1.15rem;
}

.subpanel-header p {
  margin: 0.25rem 0 0;
  color: #64748b;
  font-size: 0.9rem;
}

.service-req-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.service-req-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem 1.15rem;
}

.req-top {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.req-top h3 {
  margin: 0.25rem 0;
  font-size: 1rem;
}

.req-top p {
  margin: 0;
  color: #475569;
  font-size: 0.88rem;
}

.req-notes {
  margin: 0.65rem 0;
  color: #64748b;
  font-size: 0.88rem;
}

.req-assign-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: center;
  margin-top: 0.75rem;
}

.phase-track-labeled {
  margin: 0.85rem 0 0.35rem;
}

.phase-track-hint {
  margin: 0 0 0.55rem;
  font-size: 0.82rem;
  color: #64748b;
}

.phase-steps-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.45rem;
}

.phase-step-chip {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  text-align: left;
  padding: 0.55rem 0.65rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  cursor: pointer;
  transition: 0.15s ease;
}

.phase-step-chip:hover {
  border-color: #86efac;
  background: #f0fdf4;
}

.phase-step-chip.done {
  border-color: #bbf7d0;
  background: #f0fdf4;
}

.phase-step-chip.active {
  border-color: #16a34a;
  background: #dcfce7;
  box-shadow: 0 0 0 1px #16a34a inset;
}

.phase-num {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 999px;
  background: #e2e8f0;
  color: #334155;
  font-size: 0.75rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.phase-step-chip.active .phase-num,
.phase-step-chip.done .phase-num {
  background: #16a34a;
  color: #fff;
}

.phase-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.phase-text strong {
  font-size: 0.78rem;
  color: #0f172a;
  line-height: 1.2;
}

.phase-text em {
  font-style: normal;
  font-size: 0.68rem;
  color: #64748b;
  line-height: 1.25;
}

.empty-state.compact {
  padding: 1rem;
}

.ghost-btn.full {
  width: 100%;
  justify-content: center;
}

.full-width {
  grid-column: 1 / -1;
  width: 100%;
}

/* Modals styled in 'Demande ce service' design */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  padding: 1.25rem;
}

.modal-overlay.modal-overlay--stack-top {
  z-index: 1600;
}

.modal-card {
  background: #ffffff;
  border-radius: 20px;
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.modal-card.modal-lg {
  max-width: 720px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1rem;
  margin-bottom: 1.25rem;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 800;
  color: #052e16;
  margin: 0;
}

.modal-sub {
  font-size: 0.88rem;
  color: #16a34a;
  font-weight: 700;
  margin-top: 0.2rem;
}

.close-btn {
  background: #f1f5f9;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: #64748b;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.request-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.form-section-head {
  border-left: 3px solid #16a34a;
  padding-left: 0.65rem;
  margin-top: 0.5rem;
  margin-bottom: 0.2rem;
}

.form-section-head h4 {
  font-size: 0.92rem;
  font-weight: 700;
  color: #052e16;
  margin: 0;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row label {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
}

.form-row label.full {
  flex: 100%;
}

.form-row input,
.form-row select,
.form-row textarea {
  padding: 0.65rem 0.85rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-family: inherit;
  font-size: 0.9rem;
  color: #0f172a;
  background: #ffffff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-row input:focus,
.form-row select:focus,
.form-row textarea:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.15);
  outline: none;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 1.25rem;
  margin-top: 0.75rem;
}
</style>

