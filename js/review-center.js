/**
 * Controlador del Centro de Repaso Inteligente (Smart Review Center).
 *
 * Integra:
 * 1. Motor de Sugerencias Inteligentes y Repaso Diario Automático
 * 2. Flashcards con Repetición Espaciada (SM-2: Otra vez, Difícil, Bien, Fácil)
 * 3. Radar de Temas que el Estudiante Falla con Frecuencia
 * 4. Banco Global de Preguntas con filtros por materia y estado (Falladas, Pendientes, Dominadas)
 * 5. Colección de Conceptos Favoritos (con buscador y creación manual)
 */

(function () {
  const storage = window.StudyStorage;

  const reviewState = {
    activeSubtab: 'daily',    // 'daily' | 'srs' | 'weaknesses' | 'qbank' | 'favorites'
    srsFilterSubject: 'all',
    srsOnlyDue: true,
    srsCardIndex: 0,
    srsFlipped: false,
    qbankSubject: 'all',
    qbankStatus: 'all',       // 'all' | 'wrong' | 'unanswered' | 'correct'
    qbankSearch: '',
    favSearch: '',
    dailyStep: 0
  };

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatNextReview(srsObj) {
    if (!srsObj || !srsObj.nextReview || srsObj.status === 'new') {
      return 'Nueva (sin programar)';
    }
    const diffMs = new Date(srsObj.nextReview).getTime() - Date.now();
    const diffDays = Math.ceil(diffMs / 86400000);
    if (diffDays <= 0) return 'Vence hoy (lista para repasar)';
    if (diffDays === 1) return 'Programada para mañana (1d)';
    return `Programada en ${diffDays} días (intervalo: ${srsObj.interval}d)`;
  }

  /* ==========================================================================
     SUB-PESTAÑA 1: Repaso Diario Automático y Sugerencias Inteligentes
     ========================================================================== */

  function buildDailyAutoReviewTab(subjectsData) {
    const recs = storage.getSmartRecommendations(subjectsData);
    const workout = storage.generateDailyWorkout(subjectsData);
    const allCards = storage.getAllFlashcardsWithSRS(subjectsData);
    const dueCardsCount = allCards.filter((c) => c.isDue).length;
    const weakTopics = storage.getWeakTopicsAnalysis(subjectsData);
    const bank = storage.getQuestionBank(subjectsData);
    const wrongQuestionsCount = bank.filter((q) => q.answered && !q.isCorrect).length;
    const favCount = storage.getSavedConcepts().length;

    const recsHtml = recs
      .map((rec) => {
        const borderColor =
          rec.priorityColor === 'danger'
            ? '#dc2626'
            : rec.priorityColor === 'warning'
            ? '#d97706'
            : rec.priorityColor === 'success'
            ? '#16a34a'
            : 'var(--accent-primary)';

        const btnAttrs = rec.moduleId
          ? `data-rc-action="open-module" data-module-id="${rec.moduleId}" data-tab="${rec.tab || 'guided'}" data-sec-id="${rec.sectionId || 'top'}"`
          : `data-rc-action="switch-subtab" data-subtab="${rec.hubSubtab || 'srs'}"`;

        return `
          <article class="hub-card" style="border-left: 4px solid ${borderColor}; justify-content: space-between;">
            <div>
              <span class="eyebrow" style="color: ${borderColor};">${escapeHtml(rec.priorityBadge)}</span>
              <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-primary);">
                ${escapeHtml(rec.title)}
              </h3>
              <p style="font-size: 0.86rem; color: var(--text-secondary);">
                ${escapeHtml(rec.reason)}
              </p>
            </div>
            <div style="margin-top: 0.75rem;">
              <button type="button" class="btn btn-primary" ${btnAttrs}>
                ${escapeHtml(rec.ctaText)} &rarr;
              </button>
            </div>
          </article>
        `;
      })
      .join('');

    // Tarjeta rápida de la sesión diaria automática
    const workoutCard = workout.cards[0] || null;
    const workoutQuestions = workout.questions.slice(0, 2);

    return `
      <!-- Métricas rápidas del Centro de Repaso -->
      <div class="fundamentals-grid" style="margin-bottom: 1.5rem;">
        <div class="fundamental-card" style="background-color: var(--bg-surface);">
          <span class="fundamental-category">Repetición Espaciada</span>
          <strong style="font-size: 1.55rem; color: var(--accent-primary);">${dueCardsCount}</strong>
          <p class="fundamental-def">Flashcards listas para repasar hoy (${allCards.length} en total).</p>
        </div>
        <div class="fundamental-card" style="background-color: var(--bg-surface);">
          <span class="fundamental-category">Focos de Atención</span>
          <strong style="font-size: 1.55rem; color: #d97706;">${weakTopics.length}</strong>
          <p class="fundamental-def">Módulos con errores registrados o marcados por repasar.</p>
        </div>
        <div class="fundamental-card" style="background-color: var(--bg-surface);">
          <span class="fundamental-category">Reactivos por Corregir</span>
          <strong style="font-size: 1.55rem; color: #dc2626;">${wrongQuestionsCount}</strong>
          <p class="fundamental-def">Preguntas falladas en el banco listas para desquite.</p>
        </div>
        <div class="fundamental-card" style="background-color: var(--bg-surface);">
          <span class="fundamental-category">Conceptos Favoritos</span>
          <strong style="font-size: 1.55rem; color: #16a34a;">${favCount}</strong>
          <p class="fundamental-def">Definiciones clave guardadas en tu colección personal.</p>
        </div>
      </div>

      <!-- Sugerencias del Motor Inteligente: "¿Qué debería estudiar hoy?" -->
      <div class="capsule-section" style="margin-bottom: 1.5rem;">
        <header class="capsule-section-header">
          <h2 class="capsule-section-title">
            <span class="section-number-badge">&#129504;</span>
            Sugerencias inteligentes basadas en tu rendimiento
          </h2>
          <span class="badge-subtle">Actualizado en tiempo real</span>
        </header>
        <div class="active-hub-grid" style="margin-top: 0;">
          ${recsHtml}
        </div>
      </div>

      <!-- Rutina de Repaso Diario Automático -->
      <div class="capsule-section">
        <header class="capsule-section-header">
          <h2 class="capsule-section-title">
            <span class="section-number-badge">&#9889;</span>
            Tu Repaso Diario Automático (Entrenamiento Express)
          </h2>
          <span class="time-pill">&#9201; 5 - 10 min</span>
        </header>

        <p style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 1.15rem;">
          Hemos seleccionado automáticamente la tarjeta más urgente de tu cola de repetición espaciada y dos reactivos prioritarios para activar tu memoria hoy:
        </p>

        <div class="active-hub-grid" style="margin-top: 0;">
          ${
            workoutCard
              ? `<div class="hub-card" style="background-color: var(--bg-page);">
                   <div class="hub-card-title">
                     <span class="eyebrow" style="margin:0;">1. Flashcard del día (${escapeHtml(workoutCard.subjectName)})</span>
                     <span class="time-pill">${escapeHtml(formatNextReview(workoutCard.srs))}</span>
                   </div>
                   <p style="font-weight: 600; font-size: 0.96rem; color: var(--text-primary);">
                     ${escapeHtml(workoutCard.front)}
                   </p>
                   <details class="accordion-item">
                     <summary class="accordion-summary" style="padding: 0.65rem 0.9rem; font-size: 0.84rem;">
                       <span>Revelar respuesta y calificar</span>
                       <span class="accordion-chevron">&#9662;</span>
                     </summary>
                     <div class="accordion-body" style="padding: 0.85rem;">
                       <p style="color: var(--accent-primary); font-weight: 600;">${escapeHtml(workoutCard.back)}</p>
                       <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.5rem;">
                         <button type="button" class="comp-btn active-not_understood" data-rc-action="grade-srs" data-module-id="${workoutCard.moduleId}" data-fc-id="${workoutCard.id}" data-grade="again">Otra vez (Hoy)</button>
                         <button type="button" class="comp-btn active-needs_review" data-rc-action="grade-srs" data-module-id="${workoutCard.moduleId}" data-fc-id="${workoutCard.id}" data-grade="hard">Difícil (1d)</button>
                         <button type="button" class="comp-btn active-understood" data-rc-action="grade-srs" data-module-id="${workoutCard.moduleId}" data-fc-id="${workoutCard.id}" data-grade="good">Bien (3d+)</button>
                         <button type="button" class="btn btn-primary" style="padding:0.28rem 0.65rem; font-size:0.76rem; border-radius:999px;" data-rc-action="grade-srs" data-module-id="${workoutCard.moduleId}" data-fc-id="${workoutCard.id}" data-grade="easy">Fácil (7d+)</button>
                       </div>
                     </div>
                   </details>
                 </div>`
              : ''
          }

          ${workoutQuestions
            .map((q, idx) => renderQuestionBankCard(q, idx + 2))
            .join('')}
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     SUB-PESTAÑA 2: Flashcards y Repetición Espaciada (SRS)
     ========================================================================== */

  function buildSRSTab(subjectsData) {
    const allCards = storage.getAllFlashcardsWithSRS(subjectsData);

    const filtered = allCards.filter((c) => {
      if (reviewState.srsFilterSubject !== 'all' && c.subjectId !== reviewState.srsFilterSubject) {
        return false;
      }
      if (reviewState.srsOnlyDue && !c.isDue) {
        return false;
      }
      return true;
    });

    if (reviewState.srsCardIndex >= filtered.length) {
      reviewState.srsCardIndex = 0;
    }

    const currentCard = filtered[reviewState.srsCardIndex] || null;
    const dueTotal = allCards.filter((c) => c.isDue).length;
    const scheduledTotal = allCards.length - dueTotal;

    const subjectOptions = subjectsData
      .map(
        (s) =>
          `<option value="${s.id}" ${reviewState.srsFilterSubject === s.id ? 'selected' : ''}>${escapeHtml(s.name)}</option>`
      )
      .join('');

    return `
      <div class="capsule-section">
        <header class="capsule-section-header">
          <div>
            <h2 class="capsule-section-title">
              <span class="section-number-badge">&#9203;</span>
              Mazo de Repetición Espaciada (Algoritmo SM-2)
            </h2>
            <p style="font-size: 0.84rem; color: var(--text-muted); margin-top: 0.2rem;">
              Pendientes hoy: <strong>${dueTotal}</strong> &middot; Programadas a futuro: <strong>${scheduledTotal}</strong>
            </p>
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
            <select id="srs-subject-select" class="search-input" style="width: auto; padding: 0.4rem 0.75rem;">
              <option value="all" ${reviewState.srsFilterSubject === 'all' ? 'selected' : ''}>Todas las materias</option>
              ${subjectOptions}
            </select>

            <button
              type="button"
              class="chip ${reviewState.srsOnlyDue ? 'active' : ''}"
              data-rc-action="toggle-srs-due"
            >
              ${reviewState.srsOnlyDue ? 'Mostrando: Pendientes de hoy' : 'Mostrando: Todas las tarjetas'}
            </button>
          </div>
        </header>

        ${
          currentCard
            ? `<div class="flashcard-stage">
                 <div style="display: flex; flex-wrap: wrap; justify-content: space-between; width: 100%; max-width: 540px; font-size: 0.8rem; color: var(--text-muted);">
                   <span><strong>${escapeHtml(currentCard.subjectName)}</strong> &middot; ${escapeHtml(currentCard.moduleTitle)}</span>
                   <span>Tarjeta ${reviewState.srsCardIndex + 1} de ${filtered.length} &middot; ${escapeHtml(formatNextReview(currentCard.srs))}</span>
                 </div>

                 <div
                   class="flashcard-3d-wrapper ${reviewState.srsFlipped ? 'is-flipped' : ''}"
                   data-rc-action="flip-srs-card"
                   tabindex="0"
                   role="button"
                 >
                   <div class="flashcard-3d-inner">
                     <div class="flashcard-face flashcard-front">
                       <span class="flashcard-side-label">Pregunta &middot; Repeticiones: ${currentCard.srs.reps || 0} | Fallos: ${currentCard.srs.lapses || 0}</span>
                       <p class="flashcard-text">${escapeHtml(currentCard.front)}</p>
                       <span class="flashcard-hint">Haz clic para voltear la tarjeta &rarr;</span>
                     </div>
                     <div class="flashcard-face flashcard-back">
                       <span class="flashcard-side-label">Respuesta &middot; Factor de facilidad: ${currentCard.srs.easeFactor || 2.5}</span>
                       <p class="flashcard-text">${escapeHtml(currentCard.back)}</p>
                       <span class="flashcard-hint">Elige qué tan fácil fue recordarla:</span>
                     </div>
                   </div>
                 </div>

                 <div class="flashcard-controls">
                   <button type="button" class="btn btn-secondary" data-rc-action="prev-srs-card">&larr; Anterior</button>
                   <button
                     type="button"
                     class="comp-btn active-not_understood"
                     data-rc-action="grade-srs"
                     data-module-id="${currentCard.moduleId}"
                     data-fc-id="${currentCard.id}"
                     data-grade="again"
                   >
                     Otra vez (Hoy)
                   </button>
                   <button
                     type="button"
                     class="comp-btn active-needs_review"
                     data-rc-action="grade-srs"
                     data-module-id="${currentCard.moduleId}"
                     data-fc-id="${currentCard.id}"
                     data-grade="hard"
                   >
                     Difícil (1d)
                   </button>
                   <button
                     type="button"
                     class="comp-btn active-understood"
                     data-rc-action="grade-srs"
                     data-module-id="${currentCard.moduleId}"
                     data-fc-id="${currentCard.id}"
                     data-grade="good"
                   >
                     &#10003; Bien (3d+)
                   </button>
                   <button
                     type="button"
                     class="btn btn-primary"
                     style="padding: 0.32rem 0.8rem; font-size: 0.78rem; border-radius: var(--radius-pill);"
                     data-rc-action="grade-srs"
                     data-module-id="${currentCard.moduleId}"
                     data-fc-id="${currentCard.id}"
                     data-grade="easy"
                   >
                     Fácil (7d+)
                   </button>
                   <button type="button" class="btn btn-secondary" data-rc-action="next-srs-card">Siguiente &rarr;</button>
                 </div>
               </div>`
            : `<div class="empty-state">
                 <p><strong>¡Felicidades!</strong> No tienes tarjetas pendientes de repaso con este filtro hoy.</p>
                 <button type="button" class="btn btn-secondary" style="margin-top: 0.75rem;" data-rc-action="toggle-srs-due">
                   Ver todas las tarjetas del mazo
                 </button>
               </div>`
        }
      </div>
    `;
  }

  /* ==========================================================================
     SUB-PESTAÑA 3: Temas que el Estudiante Falla con Frecuencia
     ========================================================================== */

  function buildWeaknessesTab(subjectsData) {
    const weakTopics = storage.getWeakTopicsAnalysis(subjectsData);
    const bank = storage.getQuestionBank(subjectsData);
    const failedQuestions = bank.filter((q) => (q.answered && !q.isCorrect) || q.wrongCount > 0);

    const weakModulesHtml =
      weakTopics.length > 0
        ? `<div class="modules-list">
             ${weakTopics
               .map(
                 (w, idx) => `
               <div class="module-item" style="border-left: 4px solid ${w.fragilityScore >= 40 ? '#dc2626' : '#d97706'};">
                 <div class="module-info">
                   <span class="module-number" style="background-color: #fef2f2; color: #dc2626;">#${idx + 1}</span>
                   <div>
                     <div style="display: flex; flex-wrap: wrap; gap: 0.45rem; align-items: center; margin-bottom: 0.25rem;">
                       <h3 class="module-title" style="margin:0;">${escapeHtml(w.module.title)}</h3>
                       <span class="subject-badge" style="margin:0;">${escapeHtml(w.subject.name)}</span>
                       <span class="comp-badge comp-${w.prog.comprehension}">${w.prog.comprehensionLabel}</span>
                     </div>
                     <p class="module-desc" style="color: #b91c1c; font-weight: 500;">
                       &#9888; Diagnóstico: ${escapeHtml(w.reasons.join(' · '))}
                     </p>
                   </div>
                 </div>
                 <div class="module-actions">
                   <button
                     type="button"
                     class="btn btn-secondary"
                     data-rc-action="open-module"
                     data-module-id="${w.module.id}"
                     data-tab="review"
                   >
                     Repasar errores comunes
                   </button>
                   <button
                     type="button"
                     class="btn btn-primary"
                     data-rc-action="open-module"
                     data-module-id="${w.module.id}"
                     data-tab="assessment"
                   >
                     Reintentar evaluación
                   </button>
                 </div>
               </div>
             `
               )
               .join('')}
           </div>`
        : `<div class="empty-state">
             <p>Aún no se detectan módulos con fallos frecuentes. A medida que respondas autoevaluaciones, mini evaluaciones o califiques tu comprensión como "Necesito repasar", aparecerán aquí priorizados automáticamente.</p>
           </div>`;

    const failedQuestionsHtml =
      failedQuestions.length > 0
        ? `<div class="active-hub-grid">
             ${failedQuestions.map((q, i) => renderQuestionBankCard(q, i + 1)).join('')}
           </div>`
        : `<p style="font-size: 0.88rem; color: var(--text-muted);">No tienes reactivos fallados pendientes por corregir.</p>`;

    return `
      <div class="capsule-section" style="margin-bottom: 1.5rem;">
        <header class="capsule-section-header">
          <h2 class="capsule-section-title">
            <span class="section-number-badge">&#9888;</span>
            Módulos y temas con mayor frecuencia de error
          </h2>
          <span class="subject-module-pill">${weakTopics.length} detectados</span>
        </header>
        ${weakModulesHtml}
      </div>

      <div class="capsule-section">
        <header class="capsule-section-header">
          <h2 class="capsule-section-title">
            <span class="section-number-badge">&#127919;</span>
            Reactivos con historial de error (Desquite directo)
          </h2>
          <span class="subject-module-pill">${failedQuestions.length} reactivos</span>
        </header>
        ${failedQuestionsHtml}
      </div>
    `;
  }

  /* ==========================================================================
     SUB-PESTAÑA 4: Banco Global de Preguntas
     ========================================================================== */

  function renderQuestionBankCard(q, numberLabel) {
    if (q.type === 'mc') {
      const optsHtml = q.options
        .map((opt, optIdx) => {
          let cls = '';
          if (q.answered) {
            if (optIdx === q.correctIndex) cls = 'selected-correct';
            else if (optIdx === q.selected) cls = 'selected-wrong';
          }
          return `
            <button
              type="button"
              class="quiz-option-btn ${cls}"
              data-rc-action="answer-qbank-mc"
              data-module-id="${q.moduleId}"
              data-question-id="${q.id}"
              data-option-index="${optIdx}"
              data-correct-index="${q.correctIndex}"
              data-question-text="${escapeHtml(q.question)}"
            >
              ${String.fromCharCode(65 + optIdx)}) ${escapeHtml(opt)}
            </button>
          `;
        })
        .join('');

      return `
        <div class="quiz-card" style="background-color: var(--bg-surface);">
          <div style="display: flex; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.45rem; font-size: 0.76rem; color: var(--text-muted);">
            <span><strong>${escapeHtml(q.subjectName)}</strong> &middot; ${escapeHtml(q.moduleTitle)}</span>
            ${q.wrongCount > 0 ? `<span style="color: #dc2626; font-weight:600;">Fallado ${q.wrongCount} vez/veces</span>` : ''}
          </div>
          <p class="quiz-question-text">${numberLabel}. ${escapeHtml(q.question)}</p>
          <div class="quiz-options">${optsHtml}</div>
          ${
            q.answered
              ? `<div class="quiz-feedback ${q.isCorrect ? 'correct' : 'wrong'}">
                   <strong>${q.isCorrect ? '&#10003; ¡Correcto!' : '&#10007; Incorrecto:'}</strong>
                   ${escapeHtml(q.feedback)}
                 </div>`
              : ''
          }
        </div>
      `;
    }

    // Verdadero / Falso
    const btnTrueClass =
      q.answered && q.correctAnswer === true
        ? 'selected-correct'
        : q.answered && q.selected === true
        ? 'selected-wrong'
        : '';
    const btnFalseClass =
      q.answered && q.correctAnswer === false
        ? 'selected-correct'
        : q.answered && q.selected === false
        ? 'selected-wrong'
        : '';

    return `
      <div class="quiz-card" style="background-color: var(--bg-surface);">
        <div style="display: flex; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.45rem; font-size: 0.76rem; color: var(--text-muted);">
          <span><strong>${escapeHtml(q.subjectName)}</strong> &middot; ${escapeHtml(q.moduleTitle)}</span>
          ${q.wrongCount > 0 ? `<span style="color: #dc2626; font-weight:600;">Fallado ${q.wrongCount} vez/veces</span>` : ''}
        </div>
        <p class="quiz-question-text">${numberLabel}. [V/F] ${escapeHtml(q.question)}</p>
        <div style="display: flex; gap: 0.6rem;">
          <button
            type="button"
            class="quiz-option-btn ${btnTrueClass}"
            data-rc-action="answer-qbank-tf"
            data-module-id="${q.moduleId}"
            data-question-id="${q.id}"
            data-tf-value="true"
            data-correct-val="${q.correctAnswer}"
            data-question-text="${escapeHtml(q.question)}"
          >
            Verdadero
          </button>
          <button
            type="button"
            class="quiz-option-btn ${btnFalseClass}"
            data-rc-action="answer-qbank-tf"
            data-module-id="${q.moduleId}"
            data-question-id="${q.id}"
            data-tf-value="false"
            data-correct-val="${q.correctAnswer}"
            data-question-text="${escapeHtml(q.question)}"
          >
            Falso
          </button>
        </div>
        ${
          q.answered
            ? `<div class="quiz-feedback ${q.isCorrect ? 'correct' : 'wrong'}">
                 <strong>${q.isCorrect ? '&#10003; ¡Acierto!' : '&#10007; Incorrecto:'}</strong>
                 ${escapeHtml(q.feedback)}
               </div>`
            : ''
        }
      </div>
    `;
  }

  function buildQuestionBankTab(subjectsData) {
    const bank = storage.getQuestionBank(subjectsData);
    const query = reviewState.qbankSearch.trim().toLowerCase();

    const filtered = bank.filter((q) => {
      if (reviewState.qbankSubject !== 'all' && q.subjectId !== reviewState.qbankSubject) {
        return false;
      }
      if (reviewState.qbankStatus === 'wrong' && !(q.answered && !q.isCorrect)) {
        return false;
      }
      if (reviewState.qbankStatus === 'unanswered' && q.answered) {
        return false;
      }
      if (reviewState.qbankStatus === 'correct' && !(q.answered && q.isCorrect)) {
        return false;
      }
      if (
        query &&
        !q.question.toLowerCase().includes(query) &&
        !q.moduleTitle.toLowerCase().includes(query)
      ) {
        return false;
      }
      return true;
    });

    const subjectOptions = subjectsData
      .map(
        (s) =>
          `<option value="${s.id}" ${reviewState.qbankSubject === s.id ? 'selected' : ''}>${escapeHtml(s.name)}</option>`
      )
      .join('');

    return `
      <div class="capsule-section">
        <header class="capsule-section-header">
          <div>
            <h2 class="capsule-section-title">
              <span class="section-number-badge">&#128218;</span>
              Banco Global de Preguntas (${filtered.length} de ${bank.length})
            </h2>
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
            <input
              type="search"
              id="qbank-search-input"
              class="search-input"
              style="width: 210px; padding: 0.4rem 0.75rem;"
              placeholder="Buscar en reactivos..."
              value="${escapeHtml(reviewState.qbankSearch)}"
            >
            <select id="qbank-subject-select" class="search-input" style="width: auto; padding: 0.4rem 0.75rem;">
              <option value="all" ${reviewState.qbankSubject === 'all' ? 'selected' : ''}>Todas las materias</option>
              ${subjectOptions}
            </select>
          </div>
        </header>

        <div class="module-filters" style="margin-bottom: 1.25rem;">
          <button type="button" class="chip ${reviewState.qbankStatus === 'all' ? 'active' : ''}" data-rc-action="filter-qbank-status" data-status="all">Todos (${bank.length})</button>
          <button type="button" class="chip ${reviewState.qbankStatus === 'wrong' ? 'active' : ''}" data-rc-action="filter-qbank-status" data-status="wrong">&#9888; Fallados (${bank.filter((x) => x.answered && !x.isCorrect).length})</button>
          <button type="button" class="chip ${reviewState.qbankStatus === 'unanswered' ? 'active' : ''}" data-rc-action="filter-qbank-status" data-status="unanswered">Sin responder (${bank.filter((x) => !x.answered).length})</button>
          <button type="button" class="chip ${reviewState.qbankStatus === 'correct' ? 'active' : ''}" data-rc-action="filter-qbank-status" data-status="correct">&#10003; Dominados (${bank.filter((x) => x.answered && x.isCorrect).length})</button>
        </div>

        ${
          filtered.length > 0
            ? `<div class="quiz-block">
                 ${filtered.map((q, idx) => renderQuestionBankCard(q, idx + 1)).join('')}
               </div>`
            : `<div class="empty-state">
                 <p>No hay preguntas que coincidan con este filtro.</p>
               </div>`
        }
      </div>
    `;
  }

  /* ==========================================================================
     SUB-PESTAÑA 5: Conceptos Favoritos
     ========================================================================== */

  function buildFavoritesTab(subjectsData) {
    const savedConcepts = storage.getSavedConcepts();
    const query = reviewState.favSearch.trim().toLowerCase();

    const filtered = savedConcepts.filter((c) => {
      if (!query) return true;
      return (
        c.term.toLowerCase().includes(query) ||
        c.definition.toLowerCase().includes(query) ||
        c.keyIdea.toLowerCase().includes(query) ||
        c.subjectName.toLowerCase().includes(query)
      );
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

    return `
      <!-- Formulario rápido para añadir un concepto favorito personalizado -->
      <div class="capsule-section" style="margin-bottom: 1.5rem;">
        <header class="capsule-section-header">
          <h2 class="capsule-section-title">
            <span class="section-number-badge">&#9733;</span>
            Añadir nuevo concepto o fórmula favorita
          </h2>
        </header>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem; margin-bottom: 0.75rem;">
          <input type="text" id="fav-custom-term" class="search-input" style="width:100%;" placeholder="Nombre del concepto o fórmula...">
          <select id="fav-custom-module" class="search-input" style="width:100%;">
            ${moduleOptionsHtml}
          </select>
          <input type="text" id="fav-custom-key" class="search-input" style="width:100%;" placeholder="Regla o idea clave para recordar...">
        </div>
        <div style="display: flex; gap: 0.75rem; align-items: center;">
          <input type="text" id="fav-custom-def" class="search-input" style="flex:1;" placeholder="Definición o explicación breve...">
          <button type="button" class="btn btn-primary" data-rc-action="add-custom-favorite">
            &#9733; Guardar en favoritos
          </button>
        </div>
      </div>

      <!-- Colección de Conceptos Favoritos -->
      <div class="capsule-section">
        <header class="capsule-section-header">
          <h2 class="capsule-section-title">
            <span class="section-number-badge">${filtered.length}</span>
            Mis Conceptos Favoritos Guardados
          </h2>
          <input
            type="search"
            id="fav-search-input"
            class="search-input"
            style="width: 240px; padding: 0.4rem 0.75rem;"
            placeholder="Buscar en favoritos..."
            value="${escapeHtml(reviewState.favSearch)}"
          >
        </header>

        ${
          filtered.length > 0
            ? `<div class="fundamentals-grid">
                 ${filtered
                   .map(
                     (c) => `
                   <article class="fundamental-card" style="background-color: var(--bg-surface);">
                     <div>
                       <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.4rem;">
                         <span class="fundamental-category">${escapeHtml(c.subjectName)} &middot; ${escapeHtml(c.moduleTitle)}</span>
                         <button
                           type="button"
                           class="btn-remove-mini"
                           data-rc-action="remove-favorite"
                           data-concept-id="${c.id}"
                           title="Quitar de favoritos"
                         >&times;</button>
                       </div>
                       <h3 class="fundamental-term">${escapeHtml(c.term)}</h3>
                       <p class="fundamental-def">${escapeHtml(c.definition)}</p>
                     </div>
                     <div class="fundamental-key" style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
                       <span><strong>Clave:</strong> ${escapeHtml(c.keyIdea)}</span>
                       <button
                         type="button"
                         class="btn btn-secondary"
                         style="padding: 0.22rem 0.55rem; font-size: 0.74rem;"
                         data-rc-action="open-module"
                         data-module-id="${c.moduleId}"
                         data-tab="guided"
                       >
                         Ir al módulo
                       </button>
                     </div>
                   </article>
                 `
                   )
                   .join('')}
               </div>`
            : `<div class="empty-state">
                 <p>Aún no tienes conceptos favoritos guardados. Pulsa <strong>"☆ Guardar concepto"</strong> dentro de cualquier cápsula o añade uno arriba.</p>
               </div>`
        }
      </div>
    `;
  }

  /* ==========================================================================
     Renderizado Principal del Centro de Repaso Inteligente
     ========================================================================== */

  function renderReviewCenter(containerEl, subjectsData) {
    if (!containerEl) return;

    let bodyHtml = '';
    if (reviewState.activeSubtab === 'srs') {
      bodyHtml = buildSRSTab(subjectsData);
    } else if (reviewState.activeSubtab === 'weaknesses') {
      bodyHtml = buildWeaknessesTab(subjectsData);
    } else if (reviewState.activeSubtab === 'qbank') {
      bodyHtml = buildQuestionBankTab(subjectsData);
    } else if (reviewState.activeSubtab === 'favorites') {
      bodyHtml = buildFavoritesTab(subjectsData);
    } else {
      bodyHtml = buildDailyAutoReviewTab(subjectsData);
    }

    containerEl.innerHTML = `
      <!-- Barra de pestañas del Centro de Repaso Inteligente -->
      <div class="capsule-mode-bar" role="tablist" aria-label="Herramientas del Centro de Repaso Inteligente">
        <div class="capsule-tabs">
          <button
            type="button"
            class="capsule-tab ${reviewState.activeSubtab === 'daily' ? 'active' : ''}"
            data-rc-action="switch-subtab"
            data-subtab="daily"
          >
            &#129504; Repaso Diario y Sugerencias
          </button>
          <button
            type="button"
            class="capsule-tab ${reviewState.activeSubtab === 'srs' ? 'active' : ''}"
            data-rc-action="switch-subtab"
            data-subtab="srs"
          >
            &#9203; Repetición Espaciada (Flashcards)
          </button>
          <button
            type="button"
            class="capsule-tab ${reviewState.activeSubtab === 'weaknesses' ? 'active' : ''}"
            data-rc-action="switch-subtab"
            data-subtab="weaknesses"
          >
            &#9888; Temas que Fallas
          </button>
          <button
            type="button"
            class="capsule-tab ${reviewState.activeSubtab === 'qbank' ? 'active' : ''}"
            data-rc-action="switch-subtab"
            data-subtab="qbank"
          >
            &#128218; Banco de Preguntas
          </button>
          <button
            type="button"
            class="capsule-tab ${reviewState.activeSubtab === 'favorites' ? 'active' : ''}"
            data-rc-action="switch-subtab"
            data-subtab="favorites"
          >
            &#9733; Conceptos Favoritos
          </button>
        </div>
      </div>

      <div>
        ${bodyHtml}
      </div>
    `;

    // Conectar selectores e inputs dinámicos
    const srsSelect = containerEl.querySelector('#srs-subject-select');
    if (srsSelect) {
      srsSelect.addEventListener('change', (e) => {
        reviewState.srsFilterSubject = e.target.value;
        reviewState.srsCardIndex = 0;
        reviewState.srsFlipped = false;
        renderReviewCenter(containerEl, subjectsData);
      });
    }

    const qbankSelect = containerEl.querySelector('#qbank-subject-select');
    if (qbankSelect) {
      qbankSelect.addEventListener('change', (e) => {
        reviewState.qbankSubject = e.target.value;
        renderReviewCenter(containerEl, subjectsData);
      });
    }

    const qbankSearch = containerEl.querySelector('#qbank-search-input');
    if (qbankSearch) {
      qbankSearch.addEventListener('input', (e) => {
        reviewState.qbankSearch = e.target.value;
        renderReviewCenter(containerEl, subjectsData);
        const inputAgain = containerEl.querySelector('#qbank-search-input');
        if (inputAgain) {
          inputAgain.focus();
          inputAgain.setSelectionRange(inputAgain.value.length, inputAgain.value.length);
        }
      });
    }

    const favSearch = containerEl.querySelector('#fav-search-input');
    if (favSearch) {
      favSearch.addEventListener('input', (e) => {
        reviewState.favSearch = e.target.value;
        renderReviewCenter(containerEl, subjectsData);
        const inputAgain = containerEl.querySelector('#fav-search-input');
        if (inputAgain) {
          inputAgain.focus();
          inputAgain.setSelectionRange(inputAgain.value.length, inputAgain.value.length);
        }
      });
    }
  }

  /* ==========================================================================
     API Pública de window.ReviewCenterController
     ========================================================================== */

  window.ReviewCenterController = {
    open(containerEl, subjectsData, initialSubtab = null) {
      if (initialSubtab) {
        reviewState.activeSubtab = initialSubtab;
      }
      renderReviewCenter(containerEl, subjectsData);
    },

    bindEvents(containerEl, subjectsData, onStateChanged, onOpenModule) {
      if (!containerEl) return;

      containerEl.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-rc-action]');
        if (!btn) return;

        const action = btn.dataset.rcAction;

        if (action === 'switch-subtab') {
          reviewState.activeSubtab = btn.dataset.subtab || 'daily';
          renderReviewCenter(containerEl, subjectsData);
        } else if (action === 'open-module') {
          const modId = btn.dataset.moduleId;
          const tab = btn.dataset.tab || 'guided';
          const secId = btn.dataset.secId || 'top';
          if (modId && typeof onOpenModule === 'function') {
            onOpenModule(modId, tab, secId);
          }
        } else if (action === 'toggle-srs-due') {
          reviewState.srsOnlyDue = !reviewState.srsOnlyDue;
          reviewState.srsCardIndex = 0;
          reviewState.srsFlipped = false;
          renderReviewCenter(containerEl, subjectsData);
        } else if (action === 'flip-srs-card') {
          reviewState.srsFlipped = !reviewState.srsFlipped;
          renderReviewCenter(containerEl, subjectsData);
        } else if (action === 'prev-srs-card') {
          reviewState.srsCardIndex = Math.max(0, reviewState.srsCardIndex - 1);
          reviewState.srsFlipped = false;
          renderReviewCenter(containerEl, subjectsData);
        } else if (action === 'next-srs-card') {
          reviewState.srsCardIndex += 1;
          reviewState.srsFlipped = false;
          renderReviewCenter(containerEl, subjectsData);
        } else if (action === 'grade-srs') {
          const modId = btn.dataset.moduleId;
          const fcId = btn.dataset.fcId;
          const grade = btn.dataset.grade;
          storage.rateFlashcard(modId, fcId, grade);
          reviewState.srsFlipped = false;
          if (typeof onStateChanged === 'function') onStateChanged();
          renderReviewCenter(containerEl, subjectsData);
        } else if (action === 'filter-qbank-status') {
          reviewState.qbankStatus = btn.dataset.status || 'all';
          renderReviewCenter(containerEl, subjectsData);
        } else if (action === 'answer-qbank-mc') {
          const modId = btn.dataset.moduleId;
          const qId = btn.dataset.questionId;
          const optIdx = Number(btn.dataset.optionIndex);
          const correctIdx = Number(btn.dataset.correctIndex);
          const qText = btn.dataset.questionText || '';
          storage.saveQuizAnswer(modId, 'mc', qId, optIdx, optIdx === correctIdx, qText);
          if (typeof onStateChanged === 'function') onStateChanged();
          renderReviewCenter(containerEl, subjectsData);
        } else if (action === 'answer-qbank-tf') {
          const modId = btn.dataset.moduleId;
          const qId = btn.dataset.questionId;
          const val = btn.dataset.tfValue === 'true';
          const correctVal = btn.dataset.correctVal === 'true';
          const qText = btn.dataset.questionText || '';
          storage.saveQuizAnswer(modId, 'tf', qId, val, val === correctVal, qText);
          if (typeof onStateChanged === 'function') onStateChanged();
          renderReviewCenter(containerEl, subjectsData);
        } else if (action === 'add-custom-favorite') {
          const termEl = containerEl.querySelector('#fav-custom-term');
          const modEl = containerEl.querySelector('#fav-custom-module');
          const keyEl = containerEl.querySelector('#fav-custom-key');
          const defEl = containerEl.querySelector('#fav-custom-def');

          const term = termEl ? termEl.value.trim() : '';
          const modId = modEl ? modEl.value : '';
          const keyIdea = keyEl ? keyEl.value.trim() : '';
          const definition = defEl ? defEl.value.trim() : '';

          if (!term || !definition) {
            window.alert('Ingresa al menos el nombre del concepto y su definición.');
            return;
          }

          let subjectName = 'General';
          let moduleTitle = 'Personalizado';
          subjectsData.forEach((s) => {
            const m = s.modules.find((x) => x.id === modId);
            if (m) {
              subjectName = s.name;
              moduleTitle = m.title;
            }
          });

          storage.toggleSavedConcept({
            moduleId: modId,
            subjectName,
            moduleTitle,
            term,
            definition,
            keyIdea: keyIdea || definition
          });
          renderReviewCenter(containerEl, subjectsData);
        } else if (action === 'remove-favorite') {
          const conceptId = btn.dataset.conceptId;
          storage.removeSavedConceptById(conceptId);
          renderReviewCenter(containerEl, subjectsData);
        }
      });
    }
  };
})();
