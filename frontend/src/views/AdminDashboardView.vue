<template>
  <!-- <div class="admin-page" v-if="user"> -->
  <div class="admin-page">
    <header class="admin-header animate-fade-in">
      <div class="header-brand">
        <router-link to="/" class="brand-link">
          <div class="brand-icon"><AdminIcon name="bolt" :size="18" /></div>
          <div>
            <span class="brand-title">ENERGY AGENCY</span>
            <span class="brand-sub">{{ t('admin.console') }}</span>
          </div>
        </router-link>
      </div>

      <div class="header-meta">
        <!-- <LanguageSwitcher variant="compact" class="dark" /> -->
        <!-- <span class="admin-name">{{ user.name }}</span> -->
         <span class="admin-name">{{ user?.name || 'Admin' }}</span>
        <button @click="handleLogout" class="logout-btn">{{ t('common.signOut') }}</button>
      </div>
    </header>

    <div class="admin-layout animate-fade-in">
      <aside class="admin-sidebar">
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
      </aside>

      <main class="admin-main">
        <div v-if="error" class="alert-banner">{{ error }}</div>

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
                  <th class="col-actions">{{ t('admin.marketplace.colActions') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in filteredCatalogProducts" :key="product.id">
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
                  <td class="col-actions">
                    <div class="row-actions">
                      <button type="button" class="action-btn" title="Edit" @click="openProductForm(product)">
                        <AdminIcon name="edit" :size="15" />
                      </button>
                      <router-link :to="`/store/${product.id}`" class="action-btn" title="View in store" target="_blank">
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

          <!-- Product drawer -->
          <div v-if="showProductForm" class="drawer-overlay" @click.self="closeProductForm">
            <aside class="product-drawer">
              <header class="drawer-header">
                <div>
                  <p class="drawer-eyebrow">{{ editingProduct ? t('admin.marketplace.editProduct') : t('admin.marketplace.newProduct') }}</p>
                  <h2>{{ editingProduct ? editingProduct.title : t('admin.marketplace.addToCatalog') }}</h2>
                </div>
                <button type="button" class="drawer-close" @click="closeProductForm">×</button>
              </header>

              <form class="drawer-form" @submit.prevent="handleSaveProduct">
                <div class="drawer-layout">
                  <div
                    class="upload-zone"
                    :class="{ 'has-image': productImagePreview }"
                    @dragover.prevent
                    @drop.prevent="handleImageDrop"
                  >
                    <img v-if="productImagePreview" :src="productImagePreview" alt="Preview" class="upload-preview" />
                    <div v-else class="upload-placeholder">
                      <AdminIcon name="image" :size="28" />
                      <p>{{ t('admin.marketplace.dropImage') }}</p>
                      <span>{{ t('admin.marketplace.chooseFile') }}</span>
                    </div>
                    <input type="file" accept="image/*" class="upload-input" @change="handleImagePick" />
                    <button v-if="productImagePreview" type="button" class="upload-clear" @click="clearProductImage">{{ t('admin.marketplace.removeImage') }}</button>
                  </div>

                  <div class="drawer-fields">
                    <label>
                      {{ t('admin.marketplace.productName') }}
                      <input v-model="productForm.title" type="text" required placeholder="e.g. Atlas Bifacial 550W Panel" />
                    </label>

                    <label>
                      {{ t('admin.marketplace.colCategory') }}
                      <select v-model="productForm.category_id" required>
                        <option disabled value="">{{ t('admin.marketplace.selectCategory') }}</option>
                        <option v-for="cat in adminCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                      </select>
                    </label>

                    <div class="drawer-row">
                      <label>
                        {{ t('admin.marketplace.stock') }}
                        <input v-model.number="productForm.stock" type="number" min="0" required />
                      </label>
                      <label>
                        {{ t('admin.marketplace.rating') }}
                        <input v-model.number="productForm.rating" type="number" min="0" max="5" step="0.1" />
                      </label>
                    </div>

                    <label>
                      {{ t('common.description') }}
                      <textarea v-model="productForm.description" rows="4" :placeholder="t('admin.marketplace.describePlaceholder')"></textarea>
                    </label>
                  </div>
                </div>

                <p v-if="productFormError" class="form-error">{{ productFormError }}</p>

                <footer class="drawer-footer">
                  <button type="button" class="ghost-btn" @click="closeProductForm">{{ t('common.cancel') }}</button>
                  <button type="submit" class="primary-btn" :disabled="productSaving">
                    {{ productSaving ? t('admin.projects.saving') : (editingProduct ? t('admin.marketplace.saveChanges') : t('admin.marketplace.createProduct')) }}
                  </button>
                </footer>
              </form>
            </aside>
          </div>
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
                  <p class="drawer-eyebrow">{{ t('admin.drawer.sakFollowup') }}</p>
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
                  <td>{{ client.rfq_tickets_count }}</td>
                  <td>{{ client.projects_count }}</td>
                  <td>{{ formatDate(client.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth } from '../composables/useAuth'
import { useAdmin } from '../composables/useAdmin'
import { useLocale } from '../composables/useLocale'
import AdminIcon from '../components/AdminIcon.vue'
// import LanguageSwitcher from '../components/LanguageSwitcher.vue'
import FollowupCard from '../components/FollowupCard.vue'
import ProjectTimeline from '../components/ProjectTimeline.vue'
import { resolveProductImage } from '../utils/productImage'
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
  fetchUsers,
  quoteRfq
} = useAdmin()

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
const showProductForm = ref(false)
const editingProduct = ref(null)
const productSaving = ref(false)
const productFormError = ref('')
const productImageFile = ref(null)
const productImagePreview = ref('')
const adminCategories = ref([])
const productForm = ref({
  title: '',
  category_id: '',
  stock: 10,
  rating: 4.5,
  description: ''
})
let productSearchTimer = null

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

const tabs = computed(() => {
  locale.value
  return [
    { id: 'overview', label: t('admin.tabs.overview'), icon: 'overview' },
    { id: 'orders', label: t('admin.tabs.orders'), icon: 'orders', badge: stats.value?.totals?.pending_rfqs || null },
    { id: 'marketplace', label: t('admin.tabs.marketplace'), icon: 'marketplace', badge: stats.value?.totals?.low_stock_count || null },
    { id: 'projects', label: t('admin.tabs.projects'), icon: 'projects' },
    { id: 'clients', label: t('admin.tabs.clients'), icon: 'clients' }
  ]
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
    alert('Add at least one quote line.')
    return
  }

  if (lines.some(line => !line.quantity || line.unit_price <= 0 || (!line.id && !line.label?.trim()))) {
    alert('Fill description, quantity and unit price for every line.')
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
    alert(result.error || 'Could not send quote')
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
  productImageFile.value = null
  editingProduct.value = product
  if (product) {
    productForm.value = {
      title: product.title,
      category_id: product.category_id,
      stock: product.stock,
      rating: product.rating ?? 4.5,
      description: product.description || ''
    }
    productImagePreview.value = resolveProductImage(product)
  } else {
    productForm.value = { title: '', category_id: '', stock: 10, rating: 4.5, description: '' }
    productImagePreview.value = ''
  }
  showProductForm.value = true
}

const closeProductForm = () => {
  showProductForm.value = false
  editingProduct.value = null
  productImageFile.value = null
  productImagePreview.value = ''
  productFormError.value = ''
}

const handleImagePick = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  setProductImageFile(file)
}

const handleImageDrop = (event) => {
  const file = event.dataTransfer?.files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  setProductImageFile(file)
}

const setProductImageFile = (file) => {
  productImageFile.value = file
  productImagePreview.value = URL.createObjectURL(file)
}

const clearProductImage = () => {
  productImageFile.value = null
  productImagePreview.value = editingProduct.value ? resolveProductImage(editingProduct.value) : ''
}

const adjustStock = async (product, delta) => {
  const next = Math.max(0, product.stock + delta)
  if (next === product.stock) return
  await updateProduct(product.id, { stock: next })
  await fetchStats()
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

  const payload = { ...productForm.value }
  let result

  if (editingProduct.value) {
    result = await updateProduct(editingProduct.value.id, payload, productImageFile.value)
  } else {
    result = await createProduct(payload, productImageFile.value)
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

.admin-header {
  background: #020d07;
  color: #f0fdf4;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(74, 222, 128, 0.15);
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
}

.brand-title {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  letter-spacing: 1.5px;
  font-size: 0.95rem;
}

.brand-sub {
  display: block;
  font-size: 0.72rem;
  color: #4ade80;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-name {
  font-size: 0.9rem;
  opacity: 0.85;
}

.logout-btn {
  background: transparent;
  border: 1px solid rgba(240, 253, 244, 0.25);
  color: #f0fdf4;
  padding: 0.45rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
}

.logout-btn:hover {
  background: rgba(240, 253, 244, 0.08);
}

.admin-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: calc(100vh - 68px);
}

.admin-sidebar {
  background: #fff;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  padding: 1.5rem 1rem;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
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
  color: #374151;
  text-align: left;
}

.nav-btn:hover {
  background: #f3f7f4;
}

.nav-btn.active {
  background: rgba(34, 197, 94, 0.1);
  color: #15803d;
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
  padding: 2rem;
  overflow-x: auto;
}

.alert-banner {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
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
    border-right: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
  }

  .nav-btn {
    white-space: nowrap;
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
  .drawer-row {
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
</style>
