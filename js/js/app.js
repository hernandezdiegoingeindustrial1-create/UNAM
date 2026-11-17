/**
 * Controlador Principal de Navegación, Aprendizaje Activo y Repaso Inteligente.
 * Conecta `STUDY_DATA`, `StudyStorage`, `CapsuleController` y `ReviewCenterController`.
 */

(function () {
  const subjectsData = window.STUDY_DATA || [];
  const storage = window.StudyStorage;
  const capsuleCtrl = window.CapsuleController;
  const reviewCtrl = window.ReviewCenterController;
  const generalExamCtrl = window.GeneralExamController;

  const uiState = {
    currentView: 'subjects', // 'subjects' | 'subject-detail' | 'modules-index' | 'general-exam' | 'review-center' | 'active-hub' | 'capsule'
    activeSubjectId: null,
    activeModuleId: null,
    moduleFilter: 'all',     // 'all' | 'not_started' | 'in_progress' | 'completed' | 'needs_review'
    searchQuery: ''
  };

  const dom = {
    navBrand: document.getElementById('nav-brand'),
    btnMobileMenu: document.getElementById('btn-mobile-menu'),
    headerMenuDrawer: document.getElementById('header-Menu-Drawer'),
    navSubjects: document.getElementById('nav-subjects'),
    navAllModules: document.getElementById('nav-all-modules'),
    navGeneralExam: document.getElementById('nav-general-exam'),
    navReviewCenter: document.getElementById('nav-review-center'),
    navActiveHub: document.getElementById('nav-active-hub'),
    globalProgressText: document.getElementById('global-progress-text'),
    globalProgressBar: document.getElementById('global-progress-bar'),

    continueBanner: document.getElementById('continue-banner'),
    continueBannerIcon: document.getElementById('continue-banner-icon'),
    continueBannerEyebrow: document.getElementById('continue-banner-eyebrow'),
    continueBannerTitle: document.getElementById('continue-banner-title'),
    btnOpenReviewCenter: document.getElementById('btn-open-review-center'),
    btnContinueBookmark: document.getElementById('btn-continue-bookmark'),

    breadcrumbs: document.getElementById('breadcrumbs'),
    btnBackSubjects: document.getElementById('btn-back-subjects'),
    btnBackSubjectDetail: document.getElementById('btn-back-subject-detail'),
    breadcrumbSep2: document.getElementById('breadcrumb-sep-2'),
    breadcrumbCurrent: document.getElementById('breadcrumb-current'),

    viewSubjects: document.getElementById('view-subjects'),
    viewSubjectDetail: document.getElementById('view-subject-detail'),
    viewModulesIndex: document.getElementById('view-modules-index'),
    viewGeneralExam: document.getElementById('view-general-exam'),
    viewReviewCenter: document.getElementById('view-review-center'),
    viewActiveHub: document.getElementById('view-active-hub'),
    viewCapsule: document.getElementById('view-capsule'),

    subjectSearch: document.getElementById('subject-search'),
    subjectsGrid: document.getElementById('subjects-grid'),

    subjectDetailArea: document.getElementById('subject-detail-area'),
    subjectDetailTitle: document.getElementById('subject-detail-title'),
    subjectDetailDesc: document.getElementById('subject-detail-desc'),
    subjectProgressPercent: document.getElementById('subject-progress-percent'),
    subjectProgressBar: document.getElementById('subject-progress-bar'),
    subjectProgressCount: document.getElementById('subject-progress-count'),
    modulesList: document.getElementById('modules-list'),
    filterChips: document.querySelectorAll('.module-filters .chip'),

    allModulesContainer: document.getElementById('all-modules-container'),
    generalExamContainer: document.getElementById('general-exam-container'),
    reviewCenterContainer: document.getElementById('review-center-container'),
    activeHubContainer: document.getElementById('active-hub-container'),
    btnResetProgress: document.getElementById('btn-reset-progress')
  };

  /* ==========================================================================
     Funciones Auxiliares de Datos y Progreso
     ========================================================================== */

  function getSubjectById(subjectId) {
    return subjectsData.find((s) => s.id === subjectId) || null;
  }

  function findModuleAndSubject(moduleId) {
    for (const subject of subjectsData) {
      const mod = subject.modules.find((m) => m.id === moduleId);
      if (mod) return { subject, module: mod };
    }
    return null;
  }

  function getSubjectStats(subject) {
    const total = subject.modules.length;
    let completed = 0;
    let inProgress = 0;
    let needsReview = 0;
    let sumPercent = 0;

    subject.modules.forEach((mod) => {
      const prog = storage.getModuleProgress(mod);
      sumPercent += prog.percent;
      if (prog.status === 'completed') completed += 1;
      else if (prog.status === 'in_progress') inProgress += 1;
      if (
        prog.comprehension === 'needs_review' ||
        prog.comprehension === 'not_understood' ||
        prog.totalMistakes > 0
      ) {
        needsReview += 1;
      }
    });

    const percent = total > 0 ? Math.round(sumPercent / total) : 0;
    return { total, completed, inProgress, needsReview, percent };
  }

  function updateGlobalProgressAndBanner() {
    let totalModules = 0;
    let completedModules = 0;
    let sumPercent = 0;

    subjectsData.forEach((subject) => {
      subject.modules.forEach((mod) => {
        totalModules += 1;
        const prog = storage.getModuleProgress(mod);
        sumPercent += prog.percent;
        if (prog.isCompleted) completedModules += 1;
      });
    });

    const avgPercent = totalModules > 0 ? Math.round(sumPercent / totalModules) : 0;
    dom.globalProgressText.textContent = `${completedModules} / ${totalModules} completados (${avgPercent}%)`;
    dom.globalProgressBar.style.width = `${avgPercent}%`;

    // Banner inteligente: prioriza Marcador Activo o la Recomendación #1 del motor inteligente
    if (
      uiState.currentView === 'capsule' ||
      uiState.currentView === 'review-center' ||
      uiState.currentView === 'general-exam'
    ) {
      dom.continueBanner.hidden = true;
      return;
    }

    const { lastBookmark } = storage.getBookmarks();
    const recs = storage.getSmartRecommendations(subjectsData);
    const topRec = recs[0] || null;

    if (lastBookmark) {
      dom.continueBanner.hidden = false;
      dom.continueBannerIcon.innerHTML = '&#128278;';
      dom.continueBannerEyebrow.textContent = 'Marcador guardado · Continuar estudiando después';
      dom.continueBannerTitle.textContent = `${lastBookmark.subjectName} → ${lastBookmark.moduleTitle} (${lastBookmark.sectionLabel})`;
      dom.btnContinueBookmark.textContent = 'Retomar donde me quedé →';
      dom.btnContinueBookmark.dataset.moduleId = lastBookmark.moduleId;
      dom.btnContinueBookmark.dataset.tab = lastBookmark.tab || 'guided';
      dom.btnContinueBookmark.dataset.secId = lastBookmark.sectionId || 'top';
      dom.btnContinueBookmark.dataset.hubSubtab = '';
    } else if (topRec) {
      dom.continueBanner.hidden = false;
      dom.continueBannerIcon.innerHTML = '&#129504;';
      dom.continueBannerEyebrow.textContent = `Sugerencia inteligente · ${topRec.priorityBadge}`;
      dom.continueBannerTitle.textContent = `${topRec.title} — ${topRec.reason}`;
      dom.btnContinueBookmark.textContent = `${topRec.ctaText} →`;
      dom.btnContinueBookmark.dataset.moduleId = topRec.moduleId || '';
      dom.btnContinueBookmark.dataset.tab = topRec.tab || 'guided';
      dom.btnContinueBookmark.dataset.secId = topRec.sectionId || 'top';
      dom.btnContinueBookmark.dataset.hubSubtab = topRec.hubSubtab || '';
    } else {
      dom.continueBanner.hidden = true;
    }
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ==========================================================================
     Navegación entre Vistas
     ========================================================================== */

  function closeMobileMenu() {
    if (dom.btnMobileMenu && dom.headerMenuDrawer) {
      dom.btnMobileMenu.classList.remove('is-open');
      dom.headerMenuDrawer.classList.remove('is-open');
      dom.btnMobileMenu.setAttribute('aria-expanded', 'false');
      dom.btnMobileMenu.setAttribute('aria-label', 'Abrir menú de navegación');
    }
  }

  function toggleMobileMenu() {
    if (!dom.btnMobileMenu || !dom.headerMenuDrawer) return;
    const isOpen = dom.headerMenuDrawer.classList.toggle('is-open');
    dom.btnMobileMenu.classList.toggle('is-open', isOpen);
    dom.btnMobileMenu.setAttribute('aria-expanded', String(isOpen));
    dom.btnMobileMenu.setAttribute(
      'aria-label',
      isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
    );
  }

  function switchView(viewName, options = {}) {
    uiState.currentView = viewName;
    closeMobileMenu();

    dom.viewSubjects.hidden = viewName !== 'subjects';
    dom.viewSubjectDetail.hidden = viewName !== 'subject-detail';
    dom.viewModulesIndex.hidden = viewName !== 'modules-index';
    dom.viewGeneralExam.hidden = viewName !== 'general-exam';
    dom.viewReviewCenter.hidden = viewName !== 'review-center';
    dom.viewActiveHub.hidden = viewName !== 'active-hub';
    dom.viewCapsule.hidden = viewName !== 'capsule';

    dom.navSubjects.classList.toggle(
      'active',
      viewName === 'subjects' || viewName === 'subject-detail' || viewName === 'capsule'
    );
    dom.navAllModules.classList.toggle('active', viewName === 'modules-index');
    dom.navGeneralExam.classList.toggle('active', viewName === 'general-exam');
    dom.navReviewCenter.classList.toggle('active', viewName === 'review-center');
    dom.navActiveHub.classList.toggle('active', viewName === 'active-hub');

    updateGlobalProgressAndBanner();

    if (viewName === 'subject-detail') {
      if (options.subjectId) uiState.activeSubjectId = options.subjectId;
      const subject = getSubjectById(uiState.activeSubjectId);
      dom.breadcrumbs.hidden = false;
      dom.btnBackSubjectDetail.hidden = true;
      dom.breadcrumbSep2.hidden = true;
      dom.breadcrumbCurrent.textContent = subject ? subject.name : 'Materia';
      renderSubjectDetail();
    } else if (viewName === 'capsule') {
      if (options.moduleId) uiState.activeModuleId = options.moduleId;
      const found = findModuleAndSubject(uiState.activeModuleId);
      if (found) {
        uiState.activeSubjectId = found.subject.id;
        dom.breadcrumbs.hidden = false;
        dom.btnBackSubjectDetail.hidden = false;
        dom.btnBackSubjectDetail.textContent = found.subject.name;
        dom.breadcrumbSep2.hidden = false;
        dom.breadcrumbCurrent.textContent = found.module.title;

        capsuleCtrl.openCapsule(
          found.module.id,
          dom.viewCapsule,
          () => updateGlobalProgressAndBanner(),
          options.initialTab || 'guided',
          options.targetSectionId || null
        );
      }
    } else if (viewName === 'general-exam') {
      dom.breadcrumbs.hidden = true;
      if (generalExamCtrl) {
        generalExamCtrl.open(dom.generalExamContainer, subjectsData);
      }
    } else if (viewName === 'review-center') {
      dom.breadcrumbs.hidden = true;
      reviewCtrl.open(dom.reviewCenterContainer, subjectsData, options.subtab || null);
    } else if (viewName === 'modules-index') {
      dom.breadcrumbs.hidden = true;
      renderAllModulesIndex();
    } else if (viewName === 'active-hub') {
      dom.breadcrumbs.hidden = true;
      renderActiveHubView();
    } else {
      dom.breadcrumbs.hidden = true;
      renderSubjectsGrid();
    }

    if (!options.targetSectionId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /* ==========================================================================
     Renderizado: Catálogo de Materias
     ========================================================================== */

  function renderSubjectsGrid() {
    const query = uiState.searchQuery.trim().toLowerCase();

    const filtered = subjectsData.filter((subject) => {
      if (!query) return true;
      const matchSubject =
        subject.name.toLowerCase().includes(query) ||
        subject.description.toLowerCase().includes(query) ||
        subject.area.toLowerCase().includes(query);

      const matchModuleOrConcept = subject.modules.some((m) => {
        const inTitle =
          m.title.toLowerCase().includes(query) ||
          m.summary.toLowerCase().includes(query);
        const fundamentals = (m.capsule && m.capsule.fundamentals) || [];
        const inFundamentals = fundamentals.some(
          (f) =>
            f.term.toLowerCase().includes(query) ||
            f.definition.toLowerCase().includes(query)
        );
        return inTitle || inFundamentals;
      });

      return matchSubject || matchModuleOrConcept;
    });

    if (filtered.length === 0) {
      dom.subjectsGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <p>No se encontraron materias, módulos ni conceptos para "<strong>${escapeHtml(uiState.searchQuery)}</strong>".</p>
        </div>
      `;
      return;
    }

    dom.subjectsGrid.innerHTML = filtered
      .map((subject) => {
        const { total, completed, inProgress, needsReview, percent } = getSubjectStats(subject);
        const modulesLabel = total === 1 ? '1 módulo' : `${total} módulos`;
        const totalMinutes = subject.modules.reduce((acc, m) => acc + (m.estimatedMinutes || 30), 0);

        return `
          <article
            class="subject-card"
            role="listitem"
            tabindex="0"
            data-subject-id="${subject.id}"
            aria-label="${escapeHtml(subject.name)}, ${modulesLabel}"
          >
            <div>
              <div class="subject-card-top">
                <span class="subject-icon">${escapeHtml(subject.code)}</span>
                <div style="display: flex; gap: 0.4rem; align-items: center;">
                  <span class="time-pill">&#9201; ${totalMinutes} min</span>
                  <span class="subject-module-pill">${modulesLabel}</span>
                </div>
              </div>
              <h2 class="subject-card-title">${escapeHtml(subject.name)}</h2>
              <p class="subject-card-desc">${escapeHtml(subject.description)}</p>
            </div>

            <div class="subject-card-footer">
              <div class="progress-track">
                <div class="progress-fill" style="width: ${percent}%"></div>
              </div>
              <div class="subject-card-meta">
                <span>
                  ${completed}/${total} completados
                  ${inProgress > 0 ? `&middot; ${inProgress} en curso` : ''}
                  ${needsReview > 0 ? `&middot; &#9888; ${needsReview} por reforzar` : ''}
                </span>
                <span class="subject-card-action">Estudiar &rarr;</span>
              </div>
            </div>
          </article>
        `;
      })
      .join('');
  }

  /* ==========================================================================
     Renderizado: Detalle de Materia y Lista de Módulos
     ========================================================================== */

  function renderSubjectDetail() {
    const subject = getSubjectById(uiState.activeSubjectId);
    if (!subject) return;

    const { total, completed, inProgress, percent } = getSubjectStats(subject);

    dom.subjectDetailArea.textContent = subject.area;
    dom.subjectDetailTitle.textContent = subject.name;
    dom.subjectDetailDesc.textContent = subject.description;
    dom.subjectProgressPercent.textContent = `${percent}%`;
    dom.subjectProgressBar.style.width = `${percent}%`;
    dom.subjectProgressCount.textContent = `${completed} de ${total} completados · ${inProgress} en progreso`;

    const filteredModules = subject.modules.filter((mod) => {
      if (uiState.moduleFilter === 'all') return true;
      const prog = storage.getModuleProgress(mod);
      if (uiState.moduleFilter === 'needs_review') {
        return (
          prog.comprehension === 'needs_review' ||
          prog.comprehension === 'not_understood' ||
          prog.totalMistakes > 0
        );
      }
      return prog.status === uiState.moduleFilter;
    });

    if (filteredModules.length === 0) {
      dom.modulesList.innerHTML = `
        <div class="empty-state">
          <p>No hay módulos en este filtro por ahora.</p>
        </div>
      `;
      return;
    }

    dom.modulesList.innerHTML = filteredModules
      .map((mod) => {
        const originalIndex = subject.modules.findIndex((m) => m.id === mod.id) + 1;
        return buildModuleItemHtml(mod, originalIndex);
      })
      .join('');
  }

  function buildModuleItemHtml(mod, numberIndex) {
    const prog = storage.getModuleProgress(mod);
    const isCompleted = prog.isCompleted;
    const isBookmarked = storage.isBookmarked(mod.id, 'top');

    return `
      <div class="module-item ${isCompleted ? 'is-completed' : ''}" role="listitem" data-module-id="${mod.id}">
        <div class="module-info">
          <span class="module-number">${isCompleted ? '&#10003;' : numberIndex}</span>
          <div style="flex: 1;">
            <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.45rem; margin-bottom: 0.3rem;">
              <h3 class="module-title" style="margin-bottom: 0;">${escapeHtml(mod.title)}</h3>
              <span class="status-badge status-${prog.status}">${prog.statusLabel} (${prog.percent}%)</span>
              <span class="comp-badge comp-${prog.comprehension}">${prog.comprehensionLabel}</span>
              <span class="time-pill">&#9201; ${mod.estimatedMinutes || 30} min</span>
              ${prog.totalMistakes > 0 ? `<span class="comp-badge comp-not_understood">&#9888; ${prog.totalMistakes} fallo(s)</span>` : ''}
              ${prog.breakdown.notesCount > 0 ? `<span class="time-pill">&#128221; ${prog.breakdown.notesCount} nota(s)</span>` : ''}
              ${prog.breakdown.highlightsCount > 0 ? `<span class="time-pill">&#128397; ${prog.breakdown.highlightsCount} resaltado(s)</span>` : ''}
              ${isBookmarked ? `<span class="time-pill" style="background-color: var(--accent-soft); color: var(--accent-primary);">&#128278; Marcado</span>` : ''}
            </div>
            <p class="module-desc">${escapeHtml(mod.summary)}</p>
          </div>
        </div>

        <div class="module-actions">
          <button
            type="button"
            class="btn btn-primary"
            data-action="open-content"
            data-module-id="${mod.id}"
          >
            Ver contenido (Cápsula)
          </button>
          <button
            type="button"
            class="btn btn-complete ${isCompleted ? 'completed' : ''}"
            data-action="toggle-complete"
            data-module-id="${mod.id}"
            aria-pressed="${isCompleted}"
          >
            ${isCompleted ? '&#10003; Completado' : 'Marcar como completado'}
          </button>
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     Renderizado: Índice Completo de Módulos
     ========================================================================== */

  function renderAllModulesIndex() {
    dom.allModulesContainer.innerHTML = subjectsData
      .map((subject) => {
        const { total, completed, percent } = getSubjectStats(subject);
        const modulesHtml = subject.modules
          .map((mod, idx) => buildModuleItemHtml(mod, idx + 1))
          .join('');

        return `
          <div class="subject-group">
            <div class="subject-group-header">
              <div>
                <h2 class="subject-group-title">${escapeHtml(subject.name)}</h2>
              </div>
              <span class="subject-module-pill">${completed} / ${total} completados (${percent}%)</span>
            </div>
            <div class="modules-list">
              ${modulesHtml}
            </div>
          </div>
        `;
      })
      .join('');
  }

  /* ==========================================================================
     Renderizado: "Lo que aprendí hoy" y Mi Cuaderno Activo
     ========================================================================== */

  function renderActiveHubView() {
    const dailyList = storage.getDailyLearnings();
    const savedConcepts = storage.getSavedConcepts();
    const { list: bookmarks } = storage.getBookmarks();

    const modulesToReview = [];
    subjectsData.forEach((subject) => {
      subject.modules.forEach((mod) => {
        const prog = storage.getModuleProgress(mod);
        if (prog.comprehension === 'needs_review' || prog.comprehension === 'not_understood') {
          modulesToReview.push({ subject, module: mod, prog });
        }
      });
    });

    const moduleOptionsHtml = subjectsData
      .map((s) =>
        s.modules
          .map(
            (m) =>
              `<option value="${m.id}">${escapeHtml(s.name)} — ${escapeHtml(m.title)}</option>`
          )
          .join('')
      )
      .join('');

    dom.activeHubContainer.innerHTML = `
      <div class="learned-today-box">
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem;">
          <h2 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary);">
            &#128161; Registrar en "Lo que aprendí hoy"
          </h2>
          <select id="hub-learning-module-select" class="search-input" style="width: auto; min-width: 260px;">
            ${moduleOptionsHtml}
          </select>
        </div>

        <textarea
          id="hub-learning-textarea"
          class="learned-today-textarea"
          placeholder="Sintetiza con tus palabras qué aprendiste hoy, qué truco descubriste o qué error ya no volverás a cometer..."
        ></textarea>

        <div style="display: flex; justify-content: flex-end;">
          <button type="button" class="btn btn-primary" data-hub-action="add-daily-learning">
            Guardar aprendizaje de hoy
          </button>
        </div>

        ${
          dailyList.length > 0
            ? `<div class="learning-entries-list">
                 ${dailyList
                   .map(
                     (item) => `
                   <div class="learning-entry-card">
                     <div class="learning-entry-meta">
                       <span>
                         <strong>${escapeHtml(item.subjectName)} &middot; ${escapeHtml(item.moduleTitle)}</strong>
                         &mdash; ${escapeHtml(item.dateStr)}
                       </span>
                       <button
                         type="button"
                         class="btn-remove-mini"
                         data-hub-action="delete-daily-learning"
                         data-entry-id="${item.id}"
                         title="Eliminar entrada"
                       >&times;</button>
                     </div>
                     <p>${escapeHtml(item.text)}</p>
                   </div>
                 `
                   )
                   .join('')}
               </div>`
            : `<p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.75rem;">
                 Todavía no tienes registros en "Lo que aprendí hoy". Escribe tu primera síntesis arriba o dentro de cualquier cápsula.
               </p>`
        }
      </div>

      <div class="active-hub-grid">
        <div class="hub-card">
          <div class="hub-card-title">
            <span>&#128278; Marcadores guardados</span>
            <span class="subject-module-pill">${bookmarks.length}</span>
          </div>
          ${
            bookmarks.length > 0
              ? `<div class="highlights-drawer">
                   ${bookmarks
                     .map(
                       (bm) => `
                     <div class="highlight-chip-item" style="border-left-color: var(--accent-primary); align-items: center;">
                       <div>
                         <small style="color: var(--text-muted); display:block;">${escapeHtml(bm.subjectName)}</small>
                         <strong>${escapeHtml(bm.moduleTitle)}</strong>
                         <span style="display:block; font-size: 0.76rem; color: var(--accent-primary);">${escapeHtml(bm.sectionLabel)}</span>
                       </div>
                       <button
                         type="button"
                         class="btn btn-secondary"
                         style="padding: 0.3rem 0.65rem; font-size: 0.76rem;"
                         data-hub-action="jump-bookmark"
                         data-module-id="${bm.moduleId}"
                         data-tab="${bm.tab || 'guided'}"
                         data-sec-id="${bm.sectionId || 'top'}"
                       >
                         Ir &rarr;
                       </button>
                     </div>
                   `
                     )
                     .join('')}
                 </div>`
              : `<p style="font-size: 0.85rem; color: var(--text-muted);">
                   Pulsa "🔖 Continuar aquí después" en cualquier sección de una cápsula para guardar tu lugar.
                 </p>`
          }
        </div>

        <div class="hub-card">
          <div class="hub-card-title">
            <span>&#9733; Conceptos favoritos</span>
            <span class="subject-module-pill">${savedConcepts.length}</span>
          </div>
          ${
            savedConcepts.length > 0
              ? `<div class="highlights-drawer">
                   ${savedConcepts
                     .map(
                       (c) => `
                     <div class="highlight-chip-item" style="border-left-color: #f59e0b;">
                       <div style="flex:1;">
                         <small style="color: var(--text-muted); display:block;">${escapeHtml(c.subjectName)} &middot; ${escapeHtml(c.moduleTitle)}</small>
                         <strong>${escapeHtml(c.term)}</strong>
                         <p style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.15rem;">${escapeHtml(c.keyIdea)}</p>
                       </div>
                       <button
                         type="button"
                         class="btn btn-secondary"
                         style="padding: 0.25rem 0.55rem; font-size: 0.74rem;"
                         data-action="open-content"
                         data-module-id="${c.moduleId}"
                       >
                         Ver
                       </button>
                     </div>
                   `
                     )
                     .join('')}
                 </div>`
              : `<p style="font-size: 0.85rem; color: var(--text-muted);">
                   Guarda conceptos clave con el botón "☆ Guardar concepto" dentro de las cápsulas.
                 </p>`
          }
        </div>

        <div class="hub-card">
          <div class="hub-card-title">
            <span>&#128993; Prioridad de repaso</span>
            <span class="subject-module-pill">${modulesToReview.length}</span>
          </div>
          ${
            modulesToReview.length > 0
              ? `<div class="highlights-drawer">
                   ${modulesToReview
                     .map(
                       ({ subject, module: m, prog }) => `
                     <div class="highlight-chip-item" style="border-left-color: ${prog.comprehension === 'not_understood' ? '#dc2626' : '#d97706'}; align-items: center;">
                       <div>
                         <small style="color: var(--text-muted); display:block;">${escapeHtml(subject.name)}</small>
                         <strong>${escapeHtml(m.title)}</strong>
                         <span class="comp-badge comp-${prog.comprehension}" style="margin-top:0.2rem;">${prog.comprehensionLabel}</span>
                       </div>
                       <button
                         type="button"
                         class="btn btn-primary"
                         style="padding: 0.3rem 0.65rem; font-size: 0.76rem;"
                         data-action="open-content"
                         data-module-id="${m.id}"
                       >
                         Repasar
                       </button>
                     </div>
                   `
                     )
                     .join('')}
                 </div>`
              : `<p style="font-size: 0.85rem; color: var(--text-muted);">
                   Ningún módulo está marcado como "Necesito repasar" o "No comprendido".
                 </p>`
          }
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     Acciones e Interacciones
     ========================================================================== */

  function handleToggleModuleComplete(moduleId) {
    storage.toggleModuleCompleted(moduleId);
    updateGlobalProgressAndBanner();

    if (uiState.currentView === 'subject-detail') {
      renderSubjectDetail();
    } else if (uiState.currentView === 'modules-index') {
      renderAllModulesIndex();
    } else if (uiState.currentView === 'review-center') {
      reviewCtrl.open(dom.reviewCenterContainer, subjectsData);
    } else if (uiState.currentView === 'active-hub') {
      renderActiveHubView();
    } else if (uiState.currentView === 'capsule') {
      capsuleCtrl.refresh(dom.viewCapsule, () => updateGlobalProgressAndBanner());
    } else {
      renderSubjectsGrid();
    }
  }

  function resetFilterChips() {
    dom.filterChips.forEach((chip) => {
      chip.classList.toggle('active', chip.dataset.filter === 'all');
    });
  }

  function bindEvents() {
    if (dom.btnMobileMenu) {
      dom.btnMobileMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });

    dom.navBrand.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('subjects');
    });

    dom.navSubjects.addEventListener('click', () => switchView('subjects'));
    dom.navAllModules.addEventListener('click', () => switchView('modules-index'));
    dom.navGeneralExam.addEventListener('click', () => switchView('general-exam'));
    dom.navReviewCenter.addEventListener('click', () => switchView('review-center'));
    dom.navActiveHub.addEventListener('click', () => switchView('active-hub'));

    dom.btnBackSubjects.addEventListener('click', () => switchView('subjects'));
    dom.btnBackSubjectDetail.addEventListener('click', () => {
      if (uiState.activeSubjectId) {
        switchView('subject-detail', { subjectId: uiState.activeSubjectId });
      } else {
        switchView('subjects');
      }
    });

    dom.btnOpenReviewCenter.addEventListener('click', () => {
      switchView('review-center');
    });

    dom.btnContinueBookmark.addEventListener('click', () => {
      const modId = dom.btnContinueBookmark.dataset.moduleId;
      const hubSubtab = dom.btnContinueBookmark.dataset.hubSubtab;
      const tab = dom.btnContinueBookmark.dataset.tab || 'guided';
      const secId = dom.btnContinueBookmark.dataset.secId || 'top';

      if (modId) {
        switchView('capsule', { moduleId: modId, initialTab: tab, targetSectionId: secId });
      } else if (hubSubtab) {
        switchView('review-center', { subtab: hubSubtab });
      } else {
        switchView('review-center');
      }
    });

    dom.subjectSearch.addEventListener('input', (e) => {
      uiState.searchQuery = e.target.value;
      renderSubjectsGrid();
    });

    dom.subjectsGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.subject-card');
      if (!card) return;
      uiState.moduleFilter = 'all';
      resetFilterChips();
      switchView('subject-detail', { subjectId: card.dataset.subjectId });
    });

    dom.subjectsGrid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.subject-card');
        if (!card) return;
        e.preventDefault();
        uiState.moduleFilter = 'all';
        resetFilterChips();
        switchView('subject-detail', { subjectId: card.dataset.subjectId });
      }
    });

    dom.filterChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        uiState.moduleFilter = chip.dataset.filter;
        dom.filterChips.forEach((c) => c.classList.toggle('active', c === chip));
        renderSubjectDetail();
      });
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (btn) {
        const action = btn.dataset.action;
        const moduleId = btn.dataset.moduleId;

        if (action === 'toggle-complete' && moduleId) {
          handleToggleModuleComplete(moduleId);
        } else if (action === 'open-content' && moduleId) {
          switchView('capsule', { moduleId });
        }
        return;
      }

      const hubBtn = e.target.closest('[data-hub-action]');
      if (hubBtn) {
        const hubAction = hubBtn.dataset.hubAction;
        if (hubAction === 'add-daily-learning') {
          const selectEl = document.getElementById('hub-learning-module-select');
          const textEl = document.getElementById('hub-learning-textarea');
          const modId = selectEl ? selectEl.value : '';
          const text = textEl ? textEl.value.trim() : '';
          if (!text) {
            window.alert('Escribe tu aprendizaje del día antes de guardar.');
            return;
          }
          const found = findModuleAndSubject(modId);
          storage.addDailyLearning({
            moduleId: modId,
            moduleTitle: found ? found.module.title : 'General',
            subjectName: found ? found.subject.name : 'Estudio',
            text
          });
          renderActiveHubView();
        } else if (hubAction === 'delete-daily-learning') {
          storage.deleteDailyLearning(hubBtn.dataset.entryId);
          renderActiveHubView();
        } else if (hubAction === 'jump-bookmark') {
          switchView('capsule', {
            moduleId: hubBtn.dataset.moduleId,
            initialTab: hubBtn.dataset.tab || 'guided',
            targetSectionId: hubBtn.dataset.secId || 'top'
          });
        }
      }
    });

    // Eventos internos de la Cápsula
    capsuleCtrl.bindContainerEvents(
      dom.viewCapsule,
      () => updateGlobalProgressAndBanner(),
      (targetModuleId) => {
        switchView('capsule', { moduleId: targetModuleId });
      }
    );

    // Eventos internos del Centro de Repaso Inteligente
    reviewCtrl.bindEvents(
      dom.reviewCenterContainer,
      subjectsData,
      () => updateGlobalProgressAndBanner(),
      (moduleId, tab, secId) => {
        switchView('capsule', { moduleId, initialTab: tab, targetSectionId: secId });
      }
    );

    // Eventos internos del Examen General
    if (generalExamCtrl) {
      generalExamCtrl.bindEvents(
        dom.generalExamContainer,
        subjectsData,
        () => updateGlobalProgressAndBanner(),
        (moduleId, tab, secId) => {
          switchView('capsule', { moduleId, initialTab: tab, targetSectionId: secId });
        }
      );
    }

    dom.btnResetProgress.addEventListener('click', () => {
      if (
        window.confirm(
          '¿Deseas reiniciar todo el progreso, repetición espaciada, notas, conceptos favoritos e historial en localStorage?'
        )
      ) {
        storage.resetAll();
        updateGlobalProgressAndBanner();
        if (uiState.currentView === 'subject-detail') {
          renderSubjectDetail();
        } else if (uiState.currentView === 'modules-index') {
          renderAllModulesIndex();
        } else if (uiState.currentView === 'review-center') {
          reviewCtrl.open(dom.reviewCenterContainer, subjectsData);
        } else if (uiState.currentView === 'active-hub') {
          renderActiveHubView();
        } else if (uiState.currentView === 'capsule') {
          capsuleCtrl.refresh(dom.viewCapsule, () => updateGlobalProgressAndBanner());
        } else {
          renderSubjectsGrid();
        }
      }
    });
  }

  function init() {
    updateGlobalProgressAndBanner();
    renderSubjectsGrid();
    bindEvents();
  }

  init();
})();
