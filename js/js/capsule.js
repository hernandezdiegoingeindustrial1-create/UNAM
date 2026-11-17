/**
 * Renderizador y Controlador de Aprendizaje Activo de la Cápsula.
 *
 * Incluye las 10 secciones pedagógicas + las 9 herramientas de aprendizaje activo:
 * - Sistema de notas personales (bloc continuo + tarjetas de notas por sección)
 * - Botón para guardar conceptos importantes (★)
 * - Resaltado de contenido clave en el texto (amarillo, verde, azul)
 * - Marcadores para continuar estudiando después (🔖 por sección y módulo)
 * - Sección "Lo que aprendí hoy" (registro reflexivo diario)
 * - Preguntas rápidas intercaladas entre bloques de contenido (⚡)
 * - Mini evaluaciones al finalizar cada sección (🎯)
 * - Indicador de comprensión (Entendido, Necesito repasar, No comprendido)
 * - Historial cronológico de progreso por módulo (📜)
 */

(function () {
  const storage = window.StudyStorage;

  const capsuleState = {
    moduleId: null,
    activeTab: 'guided', // 'guided' | 'review' | 'flashcards' | 'assessment' | 'active-log' | 'all'
    flashcardIndex: 0,
    flashcardFlipped: false
  };

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Envuelve fragmentos resaltados por el estudiante dentro del texto HTML escapado
   */
  function applyHighlights(rawText, highlights = []) {
    let safe = escapeHtml(rawText);
    if (!highlights || highlights.length === 0) return safe;

    highlights.forEach((hl) => {
      const needle = escapeHtml(hl.text);
      if (!needle || needle.length < 3) return;
      const escapedRegex = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedRegex})`, 'gi');
      safe = safe.replace(
        regex,
        `<mark class="user-hl user-hl-${hl.color || 'yellow'}">$1</mark>`
      );
    });
    return safe;
  }

  function findModuleContext(moduleId) {
    const subjects = window.STUDY_DATA || [];
    for (const subject of subjects) {
      const idx = subject.modules.findIndex((m) => m.id === moduleId);
      if (idx !== -1) {
        return {
          subject,
          module: subject.modules[idx],
          moduleIndex: idx + 1
        };
      }
    }
    return null;
  }

  function formatShortTime(isoStr) {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      return d.toLocaleString('es-MX', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (_) {
      return '';
    }
  }

  /* ==========================================================================
     Generadores Automáticos de Preguntas Rápidas Intercaladas y Mini Evaluaciones
     ========================================================================== */

  function getInterleavedQuickChecks(mod) {
    const cap = mod.capsule || {};
    const funds = cap.fundamentals || [];
    const mistakes = cap.commonMistakes || [];
    const takeaways = cap.keyTakeaways || [];

    const checks = [];

    // Pregunta rápida 1 (tras Introducción): basada en el primer concepto fundamental
    if (funds.length >= 2) {
      checks.push({
        id: `${mod.id}-qc-1`,
        badge: '⚡ Pregunta rápida de activación 1',
        question: `Antes de avanzar: ¿Cuál de las siguientes ideas define mejor a "${funds[0].term}"?`,
        options: [
          funds[0].keyIdea || funds[0].definition,
          funds[1].keyIdea || funds[1].definition,
          'Ninguna de las anteriores; no tiene relación con el módulo.'
        ],
        correctIndex: 0,
        explanation: `¡Exacto! ${funds[0].term}: ${funds[0].keyIdea}`
      });
    }

    // Pregunta rápida 2 (tras Conceptos Fundamentales): basada en el segundo/tercer concepto
    if (funds.length >= 3) {
      checks.push({
        id: `${mod.id}-qc-2`,
        badge: '⚡ Pregunta rápida intercalada 2',
        question: `Comprueba tu retención inmediata: Si un reactivo menciona "${funds[2].keyIdea}", ¿a qué concepto se refiere?`,
        options: [
          funds[0].term,
          funds[2].term,
          funds[1].term
        ],
        correctIndex: 1,
        explanation: `Correcto: corresponde directamente a ${funds[2].term} (${funds[2].category}).`
      });
    }

    // Pregunta rápida 3 (entre Puntos Clave y Errores Comunes): basada en errores frecuentes
    if (mistakes.length >= 1) {
      checks.push({
        id: `${mod.id}-qc-3`,
        badge: '⚡ Detector de trampas de examen',
        question: `Respecto al error común "${mistakes[0].confusion}", ¿cuál es la estrategia correcta para evitarlo?`,
        options: [
          mistakes[0].howToAvoid,
          mistakes[0].whyItHappens,
          'Responder al azar sin analizar el contexto del reactivo.'
        ],
        correctIndex: 0,
        explanation: `¡Bien pensado! ${mistakes[0].howToAvoid}`
      });
    } else if (takeaways.length >= 1) {
      checks.push({
        id: `${mod.id}-qc-3`,
        badge: '⚡ Pregunta rápida de repaso',
        question: `¿Qué punto clave debemos recordar sobre "${takeaways[0].badge}"?`,
        options: [
          takeaways[0].text,
          'Es un dato secundario que nunca se evalúa.',
          'Significa lo opuesto a la idea central del módulo.'
        ],
        correctIndex: 0,
        explanation: takeaways[0].text
      });
    }

    return checks;
  }

  function renderInterleavedCheck(checkObj, modState) {
    if (!checkObj) return '';
    const saved = modState.quickChecks[checkObj.id];
    const hasAnswered = saved !== undefined;

    const optsHtml = checkObj.options
      .map((opt, idx) => {
        let cls = '';
        if (hasAnswered) {
          if (idx === checkObj.correctIndex) cls = 'is-correct';
          else if (idx === saved.selected) cls = 'is-wrong';
        }
        return `
          <button
            type="button"
            class="interleaved-opt-btn ${cls}"
            data-capsule-action="answer-quick-check"
            data-check-id="${checkObj.id}"
            data-opt-idx="${idx}"
            data-correct-idx="${checkObj.correctIndex}"
            data-check-title="${escapeHtml(checkObj.badge)}"
          >
            ${escapeHtml(opt)}
          </button>
        `;
      })
      .join('');

    return `
      <aside class="interleaved-prompt" aria-label="Pregunta rápida intercalada">
        <div class="interleaved-header">
          <span class="interleaved-badge">${escapeHtml(checkObj.badge)}</span>
          <span style="font-size: 0.76rem; color: var(--text-muted);">
            ${hasAnswered ? (saved.correct ? '&#10003; Respondida con éxito' : 'Revisada') : 'Pausa activa: haz clic en una opción'}
          </span>
        </div>
        <p class="interleaved-question">${escapeHtml(checkObj.question)}</p>
        <div class="interleaved-options">${optsHtml}</div>
        ${
          hasAnswered
            ? `<div class="quiz-feedback ${saved.correct ? 'correct' : 'wrong'}" style="margin-top: 0.65rem;">
                 <strong>${saved.correct ? '&#10003; ¡Excelente retención!' : '&#10007; Nota clave:'}</strong>
                 ${escapeHtml(checkObj.explanation)}
               </div>`
            : ''
        }
      </aside>
    `;
  }

  /**
   * 7. Mini evaluación + 8. Indicador de comprensión al finalizar cada sección
   */
  function renderSectionFooterActive(mod, modState, sectionKey, sectionTitle, miniEvalConfig) {
    const secComp = modState.sectionComprehension[sectionKey] || 'unrated';
    const quizSaved = modState.sectionQuizzes[sectionKey];
    const hasAnswered = quizSaved !== undefined;

    let miniQuizHtml = '';
    if (miniEvalConfig) {
      const optsHtml = miniEvalConfig.options
        .map((opt, idx) => {
          let cls = '';
          if (hasAnswered) {
            if (idx === miniEvalConfig.correctIndex) cls = 'is-correct';
            else if (idx === quizSaved.selected) cls = 'is-wrong';
          }
          return `
            <button
              type="button"
              class="interleaved-opt-btn ${cls}"
              data-capsule-action="answer-section-quiz"
              data-section-key="${sectionKey}"
              data-section-title="${escapeHtml(sectionTitle)}"
              data-opt-idx="${idx}"
              data-correct-idx="${miniEvalConfig.correctIndex}"
            >
              ${escapeHtml(opt)}
            </button>
          `;
        })
        .join('');

      miniQuizHtml = `
        <div class="mini-eval-box">
          <div class="mini-eval-title">
            <span>&#127919; Mini evaluación al finalizar la sección</span>
            <span>${hasAnswered && quizSaved.correct ? '&#10003; Superada' : 'Verifica lo leído'}</span>
          </div>
          <p style="font-size: 0.88rem; font-weight: 600; margin-bottom: 0.6rem;">
            ${escapeHtml(miniEvalConfig.question)}
          </p>
          <div class="interleaved-options">${optsHtml}</div>
          ${
            hasAnswered
              ? `<div class="quiz-feedback ${quizSaved.correct ? 'correct' : 'wrong'}" style="margin-top: 0.55rem;">
                   ${escapeHtml(miniEvalConfig.feedback)}
                 </div>`
              : ''
          }
        </div>
      `;
    }

    return `
      <div class="section-mini-eval">
        ${miniQuizHtml}
        <div class="comprehension-selector">
          <span class="comprehension-selector-label">¿Qué tan clara te quedó esta sección?</span>
          <button
            type="button"
            class="comp-btn ${secComp === 'understood' ? 'active-understood' : ''}"
            data-capsule-action="set-sec-comp"
            data-section-key="${sectionKey}"
            data-section-title="${escapeHtml(sectionTitle)}"
            data-comp-level="understood"
          >
            &#128994; Entendido
          </button>
          <button
            type="button"
            class="comp-btn ${secComp === 'needs_review' ? 'active-needs_review' : ''}"
            data-capsule-action="set-sec-comp"
            data-section-key="${sectionKey}"
            data-section-title="${escapeHtml(sectionTitle)}"
            data-comp-level="needs_review"
          >
            &#128993; Necesito repasar
          </button>
          <button
            type="button"
            class="comp-btn ${secComp === 'not_understood' ? 'active-not_understood' : ''}"
            data-capsule-action="set-sec-comp"
            data-section-key="${sectionKey}"
            data-section-title="${escapeHtml(sectionTitle)}"
            data-comp-level="not_understood"
          >
            &#128308; No comprendido
          </button>
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     Construcción de Encabezados y Secciones Pedagógicas (1 a 9)
     ========================================================================== */

  function renderSectionHeader(number, title, sectionKey, isRead, mod, secDomId, tabName) {
    const isBookmarked = storage.isBookmarked(mod.id, secDomId);

    const bookmarkBtn = `
      <button
        type="button"
        class="btn-bookmark-sec ${isBookmarked ? 'bookmarked' : ''}"
        data-capsule-action="toggle-bookmark"
        data-sec-id="${secDomId}"
        data-sec-label="${escapeHtml(number + '. ' + title)}"
        data-tab="${tabName}"
        title="Guardar marcador aquí para continuar estudiando después"
      >
        &#128278; ${isBookmarked ? 'Marcador guardado' : 'Continuar aquí después'}
      </button>
    `;

    const checkBtn = sectionKey
      ? `<button
           type="button"
           class="btn-check-section ${isRead ? 'checked' : ''}"
           data-capsule-action="toggle-section-read"
           data-section-key="${sectionKey}"
           data-section-title="${escapeHtml(title)}"
         >
           ${isRead ? '&#10003; Leída' : 'Marcar leída'}
         </button>`
      : '';

    return `
      <header class="capsule-section-header">
        <h2 class="capsule-section-title">
          <span class="section-number-badge">${number}</span>
          ${escapeHtml(title)}
        </h2>
        <div style="display: flex; flex-wrap: wrap; gap: 0.45rem; align-items: center;">
          ${bookmarkBtn}
          ${checkBtn}
        </div>
      </header>
    `;
  }

  // 1. Introducción al tema
  function buildSection1Intro(mod, modState) {
    const intro = (mod.capsule && mod.capsule.introduction) || {};
    const isRead = Boolean(modState.readSections.intro);
    const hl = modState.highlights;

    const miniEval = {
      question: '¿Cuál es el propósito central de estudiar este módulo dentro del temario?',
      options: [
        intro.whyItMatters || 'Comprender y resolver los reactivos del tema en el examen.',
        'Memorizar fechas aisladas sin relación con otros módulos.',
        'Omitir los conceptos base y pasar directo al siguiente bloque.'
      ],
      correctIndex: 0,
      feedback: '¡Correcto! Tener claro por qué es importante y cómo conecta con otros temas activa tu memoria asociativa.'
    };

    return `
      <section class="capsule-section" id="cap-sec-1">
        ${renderSectionHeader(1, 'Introducción al tema', 'intro', isRead, mod, 'cap-sec-1', 'guided')}
        <p style="font-size: 0.96rem; color: var(--text-primary);">${applyHighlights(intro.overview, hl)}</p>
        <div class="callout-grid">
          <div class="callout-box callout-importance">
            <h4>¿Por qué es importante aprender este tema?</h4>
            <p>${applyHighlights(intro.whyItMatters, hl)}</p>
          </div>
          <div class="callout-box callout-connection">
            <h4>Relación con módulos anteriores y posteriores</h4>
            <p>${applyHighlights(intro.connectionNote, hl)}</p>
          </div>
        </div>
        ${renderSectionFooterActive(mod, modState, 'intro', '1. Introducción al tema', miniEval)}
      </section>
    `;
  }

  // 2. Conceptos fundamentales (con botón para guardar conceptos importantes)
  function buildSection2Fundamentals(subject, mod, modState) {
    const list = (mod.capsule && mod.capsule.fundamentals) || [];
    const isRead = Boolean(modState.readSections.fundamentals);
    const hl = modState.highlights;

    const cardsHtml = list
      .map((item, idx) => {
        const isSaved = storage.isConceptSaved(mod.id, item.term);
        return `
          <article class="fundamental-card">
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.4rem;">
                <span class="fundamental-category">${escapeHtml(item.category)}</span>
                <div style="display: flex; gap: 0.3rem;">
                  <button
                    type="button"
                    class="btn-save-concept"
                    data-capsule-action="ask-assistant-concept"
                    data-concept-term="${escapeHtml(item.term)}"
                    title="Pedir al Asistente de Estudio que explique este concepto"
                  >
                    &#129302; Explicar
                  </button>
                  <button
                    type="button"
                    class="btn-save-concept ${isSaved ? 'saved' : ''}"
                    data-capsule-action="toggle-save-concept"
                    data-concept-idx="${idx}"
                    title="Guardar en tu lista de conceptos importantes"
                  >
                    ${isSaved ? '&#9733; Guardado' : '&#9734; Guardar'}
                  </button>
                </div>
              </div>
              <h3 class="fundamental-term">${applyHighlights(item.term, hl)}</h3>
              <p class="fundamental-def">${applyHighlights(item.definition, hl)}</p>
            </div>
            <div class="fundamental-key">
              <strong>Idea clave:</strong> ${applyHighlights(item.keyIdea, hl)}
            </div>
          </article>
        `;
      })
      .join('');

    const miniEval =
      list.length >= 2
        ? {
            question: `De los conceptos fundamentales revisados, ¿cuál corresponde a la categoría "${list[1].category}"?`,
            options: [list[0].term, list[1].term, 'Ninguno de los anteriores'],
            correctIndex: 1,
            feedback: `¡Correcto! ${list[1].term} pertenece a ${list[1].category}: ${list[1].keyIdea}`
          }
        : null;

    return `
      <section class="capsule-section" id="cap-sec-2">
        ${renderSectionHeader(2, 'Conceptos fundamentales', 'fundamentals', isRead, mod, 'cap-sec-2', 'guided')}
        <div class="fundamentals-grid">
          ${cardsHtml}
        </div>
        ${renderSectionFooterActive(mod, modState, 'fundamentals', '2. Conceptos fundamentales', miniEval)}
      </section>
    `;
  }

  // 3. Desarrollo del contenido
  function buildSection3DeepDive(mod, modState) {
    const list = (mod.capsule && mod.capsule.deepDive) || [];
    const isRead = Boolean(modState.readSections.deepDive);
    const hl = modState.highlights;

    const accordionsHtml = list
      .map(
        (item, index) => `
        <details class="accordion-item" ${index === 0 ? 'open' : ''}>
          <summary class="accordion-summary">
            <span>${escapeHtml(item.subtitle)}</span>
            <span class="accordion-chevron">&#9662;</span>
          </summary>
          <div class="accordion-body">
            <p>${applyHighlights(item.explanation, hl)}</p>
            <div class="deep-dive-subgrid">
              <div class="mini-box">
                <strong>Ejemplo práctico</strong>
                <p>${applyHighlights(item.practicalExample, hl)}</p>
              </div>
              <div class="mini-box">
                <strong>Caso de aplicación real</strong>
                <p>${applyHighlights(item.realWorldCase, hl)}</p>
              </div>
            </div>
            <div class="callout-box callout-analogy">
              <h4>Analogía para recordar</h4>
              <p>${applyHighlights(item.analogy, hl)}</p>
            </div>
          </div>
        </details>
      `
      )
      .join('');

    const firstDive = list[0];
    const miniEval = firstDive
      ? {
          question: `¿Qué analogía o caso práctico resume mejor el bloque "${firstDive.subtitle}"?`,
          options: [
            firstDive.analogy,
            'No existe relación práctica con casos cotidianos.',
            'Solo puede resolverse memorizando sin analizar.'
          ],
          correctIndex: 0,
          feedback: '¡Muy bien! Relacionar la teoría con una analogía concreta multiplica tu retención a largo plazo.'
        }
      : null;

    return `
      <section class="capsule-section" id="cap-sec-3">
        ${renderSectionHeader(3, 'Desarrollo del contenido', 'deepDive', isRead, mod, 'cap-sec-3', 'guided')}
        <div class="accordion-list">
          ${accordionsHtml}
        </div>
        ${renderSectionFooterActive(mod, modState, 'deepDive', '3. Desarrollo del contenido', miniEval)}
      </section>
    `;
  }

  // 4. Puntos clave para recordar (con botón rápido de resaltado)
  function buildSection4KeyTakeaways(mod, modState) {
    const list = (mod.capsule && mod.capsule.keyTakeaways) || [];
    const isRead = Boolean(modState.readSections.keyTakeaways);
    const hl = modState.highlights;

    const itemsHtml = list
      .map(
        (k) => `
        <div class="takeaway-item" style="justify-content: space-between;">
          <div style="display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.65rem; flex: 1;">
            <span class="takeaway-badge">${escapeHtml(k.badge)}</span>
            <span>${applyHighlights(k.text, hl)}</span>
          </div>
          <button
            type="button"
            class="btn-save-concept"
            data-capsule-action="quick-highlight"
            data-hl-text="${escapeHtml(k.badge + ': ' + k.text)}"
            data-hl-section="4. Puntos clave"
            title="Resaltar y guardar este punto clave"
          >
            &#128397; Resaltar clave
          </button>
        </div>
      `
      )
      .join('');

    const miniEval =
      list.length >= 1
        ? {
            question: `Sobre el punto clave "${list[0].badge}", ¿cuál es la regla esencial para el examen?`,
            options: [
              list[0].text,
              'Ignorar esta regla durante la lectura de reactivos.',
              'Aplicar exactamente el criterio contrario.'
            ],
            correctIndex: 0,
            feedback: `¡Exacto! Recuerda siempre: ${list[0].text}`
          }
        : null;

    return `
      <section class="capsule-section" id="cap-sec-4">
        ${renderSectionHeader(4, 'Puntos clave para recordar', 'keyTakeaways', isRead, mod, 'cap-sec-4', 'review')}
        <div class="takeaways-list">
          ${itemsHtml}
        </div>
        ${renderSectionFooterActive(mod, modState, 'keyTakeaways', '4. Puntos clave para recordar', miniEval)}
      </section>
    `;
  }

  // 5. Errores comunes
  function buildSection5CommonMistakes(mod, modState) {
    const list = (mod.capsule && mod.capsule.commonMistakes) || [];
    const isRead = Boolean(modState.readSections.commonMistakes);
    const hl = modState.highlights;

    const cardsHtml = list
      .map(
        (m) => `
        <div class="mistake-card">
          <div class="mistake-title">&#9888; Confusión frecuente: ${applyHighlights(m.confusion, hl)}</div>
          <p class="mistake-why"><strong>¿Por qué ocurre?:</strong> ${applyHighlights(m.whyItHappens, hl)}</p>
          <div class="mistake-fix"><strong>&#10003; Cómo evitarlo:</strong> ${applyHighlights(m.howToAvoid, hl)}</div>
        </div>
      `
      )
      .join('');

    return `
      <section class="capsule-section" id="cap-sec-5">
        ${renderSectionHeader(5, 'Errores comunes', 'commonMistakes', isRead, mod, 'cap-sec-5', 'review')}
        <div class="mistakes-list">
          ${cardsHtml}
        </div>
        ${renderSectionFooterActive(mod, modState, 'commonMistakes', '5. Errores comunes', null)}
      </section>
    `;
  }

  // 6. Ejemplos resueltos paso a paso
  function buildSection6WorkedExamples(mod, modState) {
    const list = (mod.capsule && mod.capsule.workedExamples) || [];
    const isRead = Boolean(modState.readSections.workedExamples);
    const hl = modState.highlights;

    const examplesHtml = list
      .map(
        (ex, idx) => `
        <details class="accordion-item" ${idx === 0 ? 'open' : ''}>
          <summary class="accordion-summary">
            <span>Ejemplo resuelto ${idx + 1}: ${escapeHtml(ex.title)}</span>
            <span class="accordion-chevron">&#9662;</span>
          </summary>
          <div class="accordion-body">
            <div class="worked-problem">${applyHighlights(ex.problem, hl)}</div>
            <div>
              <strong style="font-size: 0.82rem; color: var(--text-secondary);">Desarrollo paso a paso:</strong>
              <ol class="worked-steps">
                ${(ex.steps || []).map((s) => `<li>${applyHighlights(s, hl)}</li>`).join('')}
              </ol>
            </div>
            <div class="worked-answer-box">
              <strong>Respuesta correcta:</strong> ${applyHighlights(ex.answer, hl)}<br>
              <small><strong>Razonamiento:</strong> ${applyHighlights(ex.reasoning, hl)}</small>
            </div>
          </div>
        </details>
      `
      )
      .join('');

    const ex0 = list[0];
    const miniEval = ex0
      ? {
          question: `En el ejemplo "${ex0.title}", ¿por qué se llega a la respuesta "${ex0.answer}"?`,
          options: [
            ex0.reasoning,
            'Por descarte aleatorio sin analizar las premisas.',
            'Porque todas las demás opciones dicen exactamente lo mismo.'
          ],
          correctIndex: 0,
          feedback: `¡Correcto! ${ex0.reasoning}`
        }
      : null;

    return `
      <section class="capsule-section" id="cap-sec-6">
        ${renderSectionHeader(6, 'Ejemplos resueltos paso a paso', 'workedExamples', isRead, mod, 'cap-sec-6', 'review')}
        <div class="accordion-list">
          ${examplesHtml}
        </div>
        ${renderSectionFooterActive(mod, modState, 'workedExamples', '6. Ejemplos resueltos', miniEval)}
      </section>
    `;
  }

  // 7. Autoevaluación interactiva
  function buildSection7Assessment(mod, modState) {
    const assessment = (mod.capsule && mod.capsule.assessment) || {};
    const mcList = assessment.multipleChoice || [];
    const tfList = assessment.trueFalse || [];
    const openList = assessment.openReflection || [];

    const mcHtml = mcList
      .map((q, qIdx) => {
        const selected = modState.assessment.mc[q.id];
        const hasAnswered = selected !== undefined;
        const isCorrect = selected === q.correctIndex;

        const optionsHtml = q.options
          .map((opt, optIdx) => {
            let cls = '';
            if (hasAnswered) {
              if (optIdx === q.correctIndex) cls = 'selected-correct';
              else if (optIdx === selected) cls = 'selected-wrong';
            }
            return `
              <button
                type="button"
                class="quiz-option-btn ${cls}"
                data-capsule-action="answer-mc"
                data-question-id="${q.id}"
                data-option-index="${optIdx}"
              >
                ${String.fromCharCode(65 + optIdx)}) ${escapeHtml(opt)}
              </button>
            `;
          })
          .join('');

        const feedbackHtml = hasAnswered
          ? `<div class="quiz-feedback ${isCorrect ? 'correct' : 'wrong'}">
               <strong>${isCorrect ? '&#10003; ¡Correcto!' : '&#10007; Respuesta incorrecta.'}</strong>
               ${escapeHtml(q.feedback)}
             </div>`
          : '';

        return `
          <div class="quiz-card">
            <p class="quiz-question-text">${qIdx + 1}. ${escapeHtml(q.question)}</p>
            <div class="quiz-options">${optionsHtml}</div>
            ${feedbackHtml}
          </div>
        `;
      })
      .join('');

    const tfHtml = tfList
      .map((tf) => {
        const selected = modState.assessment.tf[tf.id];
        const hasAnswered = selected !== undefined;
        const isCorrect = selected === tf.answer;

        const btnTrueClass =
          hasAnswered && tf.answer === true
            ? 'selected-correct'
            : hasAnswered && selected === true
            ? 'selected-wrong'
            : '';
        const btnFalseClass =
          hasAnswered && tf.answer === false
            ? 'selected-correct'
            : hasAnswered && selected === false
            ? 'selected-wrong'
            : '';

        const feedbackHtml = hasAnswered
          ? `<div class="quiz-feedback ${isCorrect ? 'correct' : 'wrong'}">
               <strong>${isCorrect ? '&#10003; ¡Acierto!' : '&#10007; Revisemos el concepto:'}</strong>
               ${escapeHtml(tf.feedback)}
             </div>`
          : '';

        return `
          <div class="quiz-card">
            <p class="quiz-question-text">Verdadero o Falso: ${escapeHtml(tf.statement)}</p>
            <div style="display: flex; gap: 0.6rem;">
              <button
                type="button"
                class="quiz-option-btn ${btnTrueClass}"
                data-capsule-action="answer-tf"
                data-question-id="${tf.id}"
                data-tf-value="true"
              >
                Verdadero
              </button>
              <button
                type="button"
                class="quiz-option-btn ${btnFalseClass}"
                data-capsule-action="answer-tf"
                data-question-id="${tf.id}"
                data-tf-value="false"
              >
                Falso
              </button>
            </div>
            ${feedbackHtml}
          </div>
        `;
      })
      .join('');

    const openHtml = openList
      .map((orItem) => {
        const saved = modState.assessment.open[orItem.id] || { text: '', revealed: false };
        return `
          <div class="quiz-card">
            <p class="quiz-question-text">Reflexión abierta: ${escapeHtml(orItem.prompt)}</p>
            <textarea
              class="open-reflection-textarea"
              id="open-input-${orItem.id}"
              placeholder="Escribe tu respuesta o razonamiento aquí antes de comparar..."
            >${escapeHtml(saved.text)}</textarea>
            <div>
              <button
                type="button"
                class="btn btn-secondary"
                data-capsule-action="reveal-open"
                data-question-id="${orItem.id}"
              >
                ${saved.revealed ? 'Actualizar y ver respuesta guía' : 'Comprobar con guía de respuesta'}
              </button>
            </div>
            ${
              saved.revealed
                ? `<div class="quiz-feedback correct" style="white-space: pre-line;">
                     <strong>Criterio de evaluación sugerido:</strong>\n${escapeHtml(orItem.guideAnswer)}
                   </div>`
                : ''
            }
          </div>
        `;
      })
      .join('');

    return `
      <section class="capsule-section" id="cap-sec-7">
        ${renderSectionHeader(7, 'Autoevaluación con retroalimentación', null, false, mod, 'cap-sec-7', 'assessment')}
        <div class="quiz-block">
          <div class="quiz-subhead">A) Reactivos de opción múltiple</div>
          ${mcHtml}
          <div class="quiz-subhead">B) Afirmaciones de Verdadero o Falso</div>
          ${tfHtml}
          <div class="quiz-subhead">C) Pregunta abierta de reflexión</div>
          ${openHtml}
        </div>
      </section>
    `;
  }

  // 8. Resumen ejecutivo
  function buildSection8ExecutiveSummary(mod, modState) {
    const exec = (mod.capsule && mod.capsule.executiveSummary) || {};
    const isRead = Boolean(modState.readSections.executiveSummary);
    const hl = modState.highlights;

    return `
      <section class="capsule-section" id="cap-sec-8">
        ${renderSectionHeader(8, 'Resumen ejecutivo', 'executiveSummary', isRead, mod, 'cap-sec-8', 'review')}
        <div class="executive-card">
          <p class="executive-synthesis">${applyHighlights(exec.synthesis, hl)}</p>
          <h4 style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0.5rem;">
            Conceptos imprescindibles para recordar:
          </h4>
          <ul class="must-remember-chips">
            ${(exec.mustRemember || []).map((item) => `<li>${applyHighlights(item, hl)}</li>`).join('')}
          </ul>
        </div>
        ${renderSectionFooterActive(mod, modState, 'executiveSummary', '8. Resumen ejecutivo', null)}
      </section>
    `;
  }

  // 9. Tarjetas de estudio (Flashcards interactivas)
  function buildSection9Flashcards(mod, modState) {
    const cards = (mod.capsule && mod.capsule.flashcards) || [];
    if (cards.length === 0) return '';

    if (capsuleState.flashcardIndex >= cards.length) {
      capsuleState.flashcardIndex = 0;
    }

    const currentCard = cards[capsuleState.flashcardIndex];
    const cardState = modState.flashcards[currentCard.id];
    const isMastered = cardState && cardState.status === 'mastered';
    const masteredCount = cards.filter(
      (c) => modState.flashcards[c.id] && modState.flashcards[c.id].status === 'mastered'
    ).length;

    return `
      <section class="capsule-section" id="cap-sec-9">
        <header class="capsule-section-header">
          <h2 class="capsule-section-title">
            <span class="section-number-badge">9</span>
            Tarjetas de estudio (Flashcards)
          </h2>
          <span class="subject-module-pill">
            Tarjeta ${capsuleState.flashcardIndex + 1} de ${cards.length} &middot; ${masteredCount} dominadas
          </span>
        </header>

        <div class="flashcard-stage">
          <div
            class="flashcard-3d-wrapper ${capsuleState.flashcardFlipped ? 'is-flipped' : ''}"
            data-capsule-action="flip-flashcard"
            tabindex="0"
            role="button"
            aria-label="Tarjeta de estudio. Haz clic para voltear."
          >
            <div class="flashcard-3d-inner">
              <div class="flashcard-face flashcard-front">
                <span class="flashcard-side-label">Pregunta (Frente)</span>
                <p class="flashcard-text">${escapeHtml(currentCard.front)}</p>
                <span class="flashcard-hint">Haz clic para revelar la respuesta &rarr;</span>
              </div>
              <div class="flashcard-face flashcard-back">
                <span class="flashcard-side-label">Respuesta (Reverso)</span>
                <p class="flashcard-text">${escapeHtml(currentCard.back)}</p>
                <span class="flashcard-hint">Califica tu retención abajo</span>
              </div>
            </div>
          </div>

          <div class="flashcard-controls">
            <button
              type="button"
              class="btn btn-secondary"
              data-capsule-action="prev-flashcard"
            >
              &larr; Anterior
            </button>
            <button
              type="button"
              class="comp-btn active-not_understood"
              data-capsule-action="rate-flashcard"
              data-fc-id="${currentCard.id}"
              data-fc-status="again"
              title="Reiniciar intervalo para repasar hoy"
            >
              Otra vez (Hoy)
            </button>
            <button
              type="button"
              class="comp-btn active-needs_review"
              data-capsule-action="rate-flashcard"
              data-fc-id="${currentCard.id}"
              data-fc-status="hard"
              title="Programar para mañana"
            >
              Difícil (1d)
            </button>
            <button
              type="button"
              class="comp-btn active-understood"
              data-capsule-action="rate-flashcard"
              data-fc-id="${currentCard.id}"
              data-fc-status="good"
              title="Programar con repetición espaciada"
            >
              &#10003; Bien (3d+)
            </button>
            <button
              type="button"
              class="btn btn-primary"
              style="padding: 0.32rem 0.75rem; font-size: 0.78rem; border-radius: var(--radius-pill);"
              data-capsule-action="rate-flashcard"
              data-fc-id="${currentCard.id}"
              data-fc-status="easy"
              title="Dominada con holgura"
            >
              Fácil (7d+)
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-capsule-action="next-flashcard"
            >
              Siguiente &rarr;
            </button>
          </div>
        </div>
      </section>
    `;
  }

  /* ==========================================================================
     Bloque Especial: "Lo que aprendí hoy", Notas, Resaltados e Historial del Módulo
     ========================================================================== */

  function buildActiveSynthesisAndHistory(subject, mod, modState) {
    const moduleLearnings = storage.getDailyLearnings(mod.id);
    const historyList = modState.history || [];

    const learningsHtml =
      moduleLearnings.length > 0
        ? `<div class="learning-entries-list">
             ${moduleLearnings
               .map(
                 (entry) => `
               <div class="learning-entry-card">
                 <div class="learning-entry-meta">
                   <span>&#128197; ${escapeHtml(entry.dateStr)}</span>
                   <button
                     type="button"
                     class="btn-remove-mini"
                     data-capsule-action="delete-daily-learning"
                     data-entry-id="${entry.id}"
                     title="Eliminar registro"
                   >&times;</button>
                 </div>
                 <p>${escapeHtml(entry.text)}</p>
               </div>
             `
               )
               .join('')}
           </div>`
        : `<p style="font-size: 0.84rem; color: var(--text-muted); margin-top: 0.5rem;">
             Aún no has escrito tu síntesis de hoy en este módulo. ¡Explicarlo con tus propias palabras consolida la memoria!
           </p>`;

    const historyHtml =
      historyList.length > 0
        ? `<div class="history-timeline">
             ${historyList
               .map(
                 (h) => `
               <div class="history-item">
                 <div>
                   <strong>${escapeHtml(h.action)}</strong>
                   ${h.detail ? `<p style="color: var(--text-secondary); font-size: 0.78rem;">${escapeHtml(h.detail)}</p>` : ''}
                 </div>
                 <span class="history-time">${formatShortTime(h.timestamp)}</span>
               </div>
             `
               )
               .join('')}
           </div>`
        : `<p style="font-size: 0.84rem; color: var(--text-muted);">Sin eventos registrados todavía.</p>`;

    return `
      <!-- Sección "Lo que aprendí hoy" dentro del módulo -->
      <section class="capsule-section" id="cap-sec-learned-today">
        <header class="capsule-section-header">
          <h2 class="capsule-section-title">
            <span class="section-number-badge">&#128161;</span>
            Lo que aprendí hoy (Técnica Feynman)
          </h2>
          <span class="badge-subtle">Aprendizaje activo</span>
        </header>

        <div class="learned-today-box">
          <p style="font-size: 0.9rem; color: var(--text-primary); font-weight: 500;">
            Explica con tus propias palabras las ideas más importantes que aprendiste hoy en <strong>${escapeHtml(mod.title)}</strong>:
          </p>
          <textarea
            id="input-learned-today"
            class="learned-today-textarea"
            placeholder="Hoy comprendí que... La clave para no confundirme en el examen es..."
          ></textarea>
          <div style="display: flex; justify-content: flex-end;">
            <button
              type="button"
              class="btn btn-primary"
              data-capsule-action="save-learned-today"
            >
              Guardar en "Lo que aprendí hoy"
            </button>
          </div>
          ${learningsHtml}
        </div>
      </section>

      <!-- Historial de progreso por módulo -->
      <section class="capsule-section" id="cap-sec-history">
        <header class="capsule-section-header">
          <h2 class="capsule-section-title">
            <span class="section-number-badge">&#128220;</span>
            Historial de progreso del módulo
          </h2>
          <span class="subject-module-pill">${historyList.length} acciones registradas</span>
        </header>
        ${historyHtml}
      </section>
    `;
  }

  /* ==========================================================================
     Renderizado Completo de la Vista Cápsula
     ========================================================================== */

  function renderCapsuleView(containerEl, onStateChanged) {
    const ctx = findModuleContext(capsuleState.moduleId);
    if (!ctx || !containerEl) return;

    const { subject, module: mod, moduleIndex } = ctx;
    const modState = storage.getModuleState(mod.id);
    const progress = storage.getModuleProgress(mod);
    const relations = mod.relations || {};
    const quickChecks = getInterleavedQuickChecks(mod);
    const savedConceptsInMod = storage.getSavedConcepts(mod.id);
    const isTopBookmarked = storage.isBookmarked(mod.id, 'top');

    const prevCtx = relations.prevModuleId ? findModuleContext(relations.prevModuleId) : null;
    const nextCtx = relations.nextModuleId ? findModuleContext(relations.nextModuleId) : null;

    // Barra interactiva de resaltado de texto
    const highlightToolbarHtml = `
      <div class="highlight-toolbar">
        <span>
          <strong>&#128397; Resaltador activo:</strong> Selecciona cualquier frase o fórmula del texto y pulsa un color para guardarla como contenido clave.
        </span>
        <div class="highlight-controls">
          <button type="button" class="hl-color-btn hl-yellow" data-capsule-action="highlight-selection" data-hl-color="yellow">
            + Amarillo
          </button>
          <button type="button" class="hl-color-btn hl-green" data-capsule-action="highlight-selection" data-hl-color="green">
            + Verde
          </button>
          <button type="button" class="hl-color-btn hl-blue" data-capsule-action="highlight-selection" data-hl-color="blue">
            + Azul
          </button>
        </div>
      </div>
    `;

    const assistantHtml = window.StudyAssistant
      ? window.StudyAssistant.buildAssistantSectionHtml(subject, mod)
      : '';

    // Determinar qué secciones mostrar según la pestaña activa
    let mainSectionsHtml = '';
    if (capsuleState.activeTab === 'guided') {
      mainSectionsHtml =
        highlightToolbarHtml +
        buildSection1Intro(mod, modState) +
        renderInterleavedCheck(quickChecks[0], modState) +
        buildSection2Fundamentals(subject, mod, modState) +
        renderInterleavedCheck(quickChecks[1], modState) +
        buildSection3DeepDive(mod, modState);
    } else if (capsuleState.activeTab === 'review') {
      mainSectionsHtml =
        highlightToolbarHtml +
        buildSection4KeyTakeaways(mod, modState) +
        renderInterleavedCheck(quickChecks[2], modState) +
        buildSection5CommonMistakes(mod, modState) +
        buildSection6WorkedExamples(mod, modState) +
        buildSection8ExecutiveSummary(mod, modState);
    } else if (capsuleState.activeTab === 'flashcards') {
      mainSectionsHtml = buildSection9Flashcards(mod, modState);
    } else if (capsuleState.activeTab === 'assessment') {
      mainSectionsHtml = buildSection7Assessment(mod, modState);
    } else if (capsuleState.activeTab === 'assistant') {
      mainSectionsHtml = assistantHtml;
    } else if (capsuleState.activeTab === 'active-log') {
      mainSectionsHtml = buildActiveSynthesisAndHistory(subject, mod, modState);
    } else {
      // Vista completa de las 10 secciones + asistente + preguntas intercaladas + bitácora e historial
      mainSectionsHtml =
        highlightToolbarHtml +
        buildSection1Intro(mod, modState) +
        renderInterleavedCheck(quickChecks[0], modState) +
        buildSection2Fundamentals(subject, mod, modState) +
        renderInterleavedCheck(quickChecks[1], modState) +
        buildSection3DeepDive(mod, modState) +
        buildSection4KeyTakeaways(mod, modState) +
        renderInterleavedCheck(quickChecks[2], modState) +
        buildSection5CommonMistakes(mod, modState) +
        buildSection6WorkedExamples(mod, modState) +
        buildSection8ExecutiveSummary(mod, modState) +
        buildSection9Flashcards(mod, modState) +
        buildSection7Assessment(mod, modState) +
        assistantHtml +
        buildActiveSynthesisAndHistory(subject, mod, modState);
    }

    const tocItems = [
      { num: 1, label: 'Introducción al tema', tab: 'guided', secId: 'cap-sec-1', done: Boolean(modState.readSections.intro) },
      { num: 2, label: 'Conceptos fundamentales', tab: 'guided', secId: 'cap-sec-2', done: Boolean(modState.readSections.fundamentals) },
      { num: 3, label: 'Desarrollo del contenido', tab: 'guided', secId: 'cap-sec-3', done: Boolean(modState.readSections.deepDive) },
      { num: 4, label: 'Puntos clave para recordar', tab: 'review', secId: 'cap-sec-4', done: Boolean(modState.readSections.keyTakeaways) },
      { num: 5, label: 'Errores comunes', tab: 'review', secId: 'cap-sec-5', done: Boolean(modState.readSections.commonMistakes) },
      { num: 6, label: 'Ejemplos resueltos', tab: 'review', secId: 'cap-sec-6', done: Boolean(modState.readSections.workedExamples) },
      { num: 7, label: 'Autoevaluación', tab: 'assessment', secId: 'cap-sec-7', done: progress.breakdown.quizAnswered === progress.breakdown.totalQuiz && progress.breakdown.totalQuiz > 0 },
      { num: 8, label: 'Resumen ejecutivo', tab: 'review', secId: 'cap-sec-8', done: Boolean(modState.readSections.executiveSummary) },
      { num: 9, label: 'Flashcards de repaso', tab: 'flashcards', secId: 'cap-sec-9', done: progress.breakdown.flashcardsMastered === progress.breakdown.totalFlashcards && progress.breakdown.totalFlashcards > 0 },
      { num: '🤖', label: 'Asistente de Estudio', tab: 'assistant', secId: 'cap-sec-assistant', done: false },
      { num: '💡', label: 'Lo que aprendí hoy e Historial', tab: 'active-log', secId: 'cap-sec-learned-today', done: storage.getDailyLearnings(mod.id).length > 0 }
    ];

    containerEl.innerHTML = `
      <!-- 10. Indicadores de progreso, comprensión y marcador de cápsula -->
      <div class="capsule-hero">
        <div class="capsule-hero-top">
          <div class="capsule-meta-badges">
            <span class="subject-badge" style="margin-bottom:0;">${escapeHtml(subject.name)} &middot; Módulo ${moduleIndex}</span>
            <span class="status-badge status-${progress.status}">${progress.statusLabel}</span>
            <span class="comp-badge comp-${progress.comprehension}">Comprensión: ${progress.comprehensionLabel}</span>
            <span class="time-pill">&#9201; ${mod.estimatedMinutes || 30} min</span>
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            <button
              type="button"
              class="btn-bookmark-sec ${isTopBookmarked ? 'bookmarked' : ''}"
              data-capsule-action="toggle-bookmark"
              data-sec-id="top"
              data-sec-label="Inicio del módulo"
              data-tab="${capsuleState.activeTab}"
            >
              &#128278; ${isTopBookmarked ? 'Guardado para continuar' : 'Continuar estudiando después'}
            </button>
            <button
              type="button"
              class="btn btn-complete ${progress.isCompleted ? 'completed' : ''}"
              data-capsule-action="toggle-module-complete"
            >
              ${progress.isCompleted ? '&#10003; Cápsula completada' : 'Marcar cápsula completada'}
            </button>
          </div>
        </div>

        <div class="capsule-hero-main">
          <div style="flex: 1 1 380px;">
            <h1 class="capsule-hero-title">${escapeHtml(mod.title)}</h1>
            <p class="capsule-hero-summary">${escapeHtml(mod.summary)}</p>

            <!-- 8. Selector global de Indicador de Comprensión del Módulo -->
            <div class="comprehension-selector">
              <span class="comprehension-selector-label">Indicador de comprensión del módulo:</span>
              <button
                type="button"
                class="comp-btn ${progress.comprehension === 'understood' ? 'active-understood' : ''}"
                data-capsule-action="set-mod-comp"
                data-comp-level="understood"
              >
                &#128994; Entendido
              </button>
              <button
                type="button"
                class="comp-btn ${progress.comprehension === 'needs_review' ? 'active-needs_review' : ''}"
                data-capsule-action="set-mod-comp"
                data-comp-level="needs_review"
              >
                &#128993; Necesito repasar
              </button>
              <button
                type="button"
                class="comp-btn ${progress.comprehension === 'not_understood' ? 'active-not_understood' : ''}"
                data-capsule-action="set-mod-comp"
                data-comp-level="not_understood"
              >
                &#128308; No comprendido
              </button>
            </div>
          </div>

          <div class="capsule-progress-box" aria-label="Indicadores de avance del módulo">
            <div class="capsule-progress-row">
              <span>Avance de aprendizaje activo</span>
              <span class="capsule-progress-percent">${progress.percent}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width: ${progress.percent}%"></div>
            </div>
            <div class="capsule-progress-breakdown">
              <span>Secciones: ${progress.breakdown.readCount}/${progress.breakdown.totalReadSections}</span>
              <span>Pausas ⚡: ${progress.breakdown.answeredQuickChecks}/${progress.breakdown.totalQuickChecks}</span>
              <span>Quiz: ${progress.breakdown.quizAnswered}/${progress.breakdown.totalQuiz}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Barra de modos de estudio -->
      <div class="capsule-mode-bar" role="tablist" aria-label="Modos de estudio de la cápsula">
        <div class="capsule-tabs">
          <button
            type="button"
            class="capsule-tab ${capsuleState.activeTab === 'guided' ? 'active' : ''}"
            data-capsule-action="switch-tab"
            data-tab="guided"
          >
            1. Estudio Activo
          </button>
          <button
            type="button"
            class="capsule-tab ${capsuleState.activeTab === 'review' ? 'active' : ''}"
            data-capsule-action="switch-tab"
            data-tab="review"
          >
            2. Repaso y Ejemplos
          </button>
          <button
            type="button"
            class="capsule-tab ${capsuleState.activeTab === 'flashcards' ? 'active' : ''}"
            data-capsule-action="switch-tab"
            data-tab="flashcards"
          >
            3. Flashcards (${progress.breakdown.totalFlashcards})
          </button>
          <button
            type="button"
            class="capsule-tab ${capsuleState.activeTab === 'assessment' ? 'active' : ''}"
            data-capsule-action="switch-tab"
            data-tab="assessment"
          >
            4. Autoevaluación
          </button>
          <button
            type="button"
            class="capsule-tab ${capsuleState.activeTab === 'assistant' ? 'active' : ''}"
            data-capsule-action="switch-tab"
            data-tab="assistant"
          >
            &#129302; Asistente de Estudio
          </button>
          <button
            type="button"
            class="capsule-tab ${capsuleState.activeTab === 'active-log' ? 'active' : ''}"
            data-capsule-action="switch-tab"
            data-tab="active-log"
          >
            Lo que aprendí hoy (${progress.breakdown.historyCount})
          </button>
        </div>

        <div class="capsule-actions-right">
          <button
            type="button"
            class="capsule-tab ${capsuleState.activeTab === 'all' ? 'active' : ''}"
            data-capsule-action="switch-tab"
            data-tab="all"
            title="Mostrar todas las secciones y herramientas juntas"
          >
            Vista Completa
          </button>
        </div>
      </div>

      <!-- Espacio de trabajo en 2 columnas -->
      <div class="capsule-workspace">
        <!-- Barra lateral: Índice, Notas personales, Resaltados, Conceptos guardados y Conexiones -->
        <aside class="capsule-sidebar">
          <!-- 1. Sistema de Notas Personales dentro del módulo -->
          <div class="sidebar-card">
            <h3 class="sidebar-heading">&#128221; Mis notas del módulo</h3>
            <textarea
              id="capsule-personal-notes"
              class="personal-notes-area"
              placeholder="Escribe tus apuntes, fórmulas o dudas clave..."
            >${escapeHtml(modState.personalNotes)}</textarea>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.45rem;">
              <span class="notes-saved-hint" id="notes-save-status" style="margin-top:0;">Autoguardado activo</span>
              <button
                type="button"
                class="btn-save-concept"
                data-capsule-action="add-note-card"
              >
                + Fijar como tarjeta de nota
              </button>
            </div>

            ${
              modState.noteEntries.length > 0
                ? `<div class="highlights-drawer" style="margin-top: 0.75rem;">
                     ${modState.noteEntries
                       .map(
                         (n) => `
                       <div class="highlight-chip-item" style="border-left-color: var(--accent-primary);">
                         <div>
                           <small style="color: var(--text-muted); display:block;">${formatShortTime(n.createdAt)}</small>
                           <span>${escapeHtml(n.text)}</span>
                         </div>
                         <button
                           type="button"
                           class="btn-remove-mini"
                           data-capsule-action="delete-note-card"
                           data-note-id="${n.id}"
                           title="Eliminar nota"
                         >&times;</button>
                       </div>
                     `
                       )
                       .join('')}
                   </div>`
                : ''
            }
          </div>

          <!-- 3. Contenido Clave Resaltado en este módulo -->
          <div class="sidebar-card">
            <h3 class="sidebar-heading">&#128397; Contenido resaltado (${modState.highlights.length})</h3>
            ${
              modState.highlights.length > 0
                ? `<div class="highlights-drawer">
                     ${modState.highlights
                       .map(
                         (h) => `
                       <div class="highlight-chip-item color-${h.color || 'yellow'}">
                         <span>"${escapeHtml(h.text)}"</span>
                         <button
                           type="button"
                           class="btn-remove-mini"
                           data-capsule-action="remove-highlight"
                           data-hl-id="${h.id}"
                           title="Quitar resaltado"
                         >&times;</button>
                       </div>
                     `
                       )
                       .join('')}
                   </div>`
                : `<p style="font-size: 0.78rem; color: var(--text-muted);">
                     Selecciona texto en la lectura y elige un color en la barra superior para resaltarlo.
                   </p>`
            }
          </div>

          <!-- 2. Conceptos Importantes Guardados en este módulo -->
          <div class="sidebar-card">
            <h3 class="sidebar-heading">&#9733; Conceptos guardados (${savedConceptsInMod.length})</h3>
            ${
              savedConceptsInMod.length > 0
                ? `<div class="highlights-drawer">
                     ${savedConceptsInMod
                       .map(
                         (c) => `
                       <div class="highlight-chip-item" style="border-left-color: #f59e0b;">
                         <div>
                           <strong>${escapeHtml(c.term)}</strong>
                           <p style="font-size: 0.76rem; color: var(--text-secondary);">${escapeHtml(c.keyIdea)}</p>
                         </div>
                       </div>
                     `
                       )
                       .join('')}
                   </div>`
                : `<p style="font-size: 0.78rem; color: var(--text-muted);">
                     Pulsa "☆ Guardar concepto" en la sección 2 para coleccionar conceptos clave.
                   </p>`
            }
          </div>

          <!-- Índice de la cápsula -->
          <div class="sidebar-card">
            <h3 class="sidebar-heading">Mapa de la cápsula</h3>
            <ul class="toc-list">
              ${tocItems
                .map(
                  (item) => `
                <li>
                  <button
                    type="button"
                    class="toc-item-btn ${item.done ? 'is-done' : ''}"
                    data-capsule-action="jump-section"
                    data-tab="${item.tab}"
                    data-sec-id="${item.secId}"
                  >
                    <span>${item.num}. ${escapeHtml(item.label)}</span>
                    <span class="toc-check">&#10003;</span>
                  </button>
                </li>
              `
                )
                .join('')}
            </ul>
          </div>

          <!-- Conexiones entre módulos -->
          <div class="sidebar-card">
            <h3 class="sidebar-heading">Conexiones del tema</h3>
            <div class="obsidian-links">
              <div class="concept-tags">
                ${(relations.relatedConcepts || [])
                  .map((c) => `<span class="concept-tag"># ${escapeHtml(c)}</span>`)
                  .join('')}
              </div>

              ${
                prevCtx
                  ? `<button
                       type="button"
                       class="module-nav-link"
                       data-capsule-action="open-related-module"
                       data-target-module="${prevCtx.module.id}"
                     >
                       <small>&larr; Módulo anterior</small>
                       <strong>${escapeHtml(prevCtx.module.title)}</strong>
                     </button>`
                  : ''
              }

              ${
                nextCtx
                  ? `<button
                       type="button"
                       class="module-nav-link"
                       data-capsule-action="open-related-module"
                       data-target-module="${nextCtx.module.id}"
                     >
                       <small>Siguiente módulo &rarr;</small>
                       <strong>${escapeHtml(nextCtx.module.title)}</strong>
                     </button>`
                  : ''
              }
            </div>
          </div>
        </aside>

        <!-- Lienzo principal de estudio -->
        <div class="capsule-main">
          ${mainSectionsHtml}
        </div>
      </div>
    `;

    // Conectar autoguardado del bloc de notas personales
    const notesEl = containerEl.querySelector('#capsule-personal-notes');
    const notesHint = containerEl.querySelector('#notes-save-status');
    if (notesEl) {
      notesEl.addEventListener('input', (e) => {
        storage.savePersonalNotes(mod.id, e.target.value);
        if (notesHint) notesHint.textContent = 'Notas guardadas ✓';
      });
    }

    if (typeof onStateChanged === 'function') {
      onStateChanged();
    }
  }

  /* ==========================================================================
     API Pública de window.CapsuleController
     ========================================================================== */

  window.CapsuleController = {
    openCapsule(moduleId, containerEl, onStateChanged, initialTab = 'guided', targetSectionId = null) {
      capsuleState.moduleId = moduleId;
      capsuleState.activeTab = initialTab || 'guided';
      capsuleState.flashcardIndex = 0;
      capsuleState.flashcardFlipped = false;

      storage.markCapsuleOpened(moduleId);
      renderCapsuleView(containerEl, onStateChanged);

      if (targetSectionId && targetSectionId !== 'top') {
        setTimeout(() => {
          const el = document.getElementById(targetSectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 60);
      }
    },

    refresh(containerEl, onStateChanged) {
      if (capsuleState.moduleId) {
        renderCapsuleView(containerEl, onStateChanged);
      }
    },

    bindContainerEvents(containerEl, onStateChanged, onNavigateModule) {
      if (!containerEl) return;

      containerEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target && e.target.id === 'assistant-prompt-input') {
          e.preventDefault();
          const ctx = findModuleContext(capsuleState.moduleId);
          if (ctx && window.StudyAssistant) {
            window.StudyAssistant.handleAction(
              'send-prompt',
              e.target,
              containerEl,
              ctx.subject,
              ctx.module,
              () => renderCapsuleView(containerEl, onStateChanged)
            );
          }
        }
      });

      containerEl.addEventListener('click', (e) => {
        const astTarget = e.target.closest('[data-ast-action]');
        if (astTarget && capsuleState.moduleId && window.StudyAssistant) {
          const ctx = findModuleContext(capsuleState.moduleId);
          if (ctx) {
            window.StudyAssistant.handleAction(
              astTarget.dataset.astAction,
              astTarget,
              containerEl,
              ctx.subject,
              ctx.module,
              () => renderCapsuleView(containerEl, onStateChanged)
            );
          }
          return;
        }

        const target = e.target.closest('[data-capsule-action]');
        if (!target || !capsuleState.moduleId) return;

        const action = target.dataset.capsuleAction;
        const modId = capsuleState.moduleId;
        const ctx = findModuleContext(modId);
        if (!ctx) return;

        if (action === 'ask-assistant-concept') {
          capsuleState.activeTab = 'assistant';
          if (window.StudyAssistant) {
            window.StudyAssistant.handleAction(
              'explain-specific-concept',
              target,
              containerEl,
              ctx.subject,
              ctx.module,
              () => renderCapsuleView(containerEl, onStateChanged)
            );
          }
          return;
        }

        if (action === 'switch-tab') {
          capsuleState.activeTab = target.dataset.tab || 'guided';
          renderCapsuleView(containerEl, onStateChanged);
        } else if (action === 'jump-section') {
          const targetTab = target.dataset.tab;
          const secId = target.dataset.secId;
          if (capsuleState.activeTab !== 'all' && capsuleState.activeTab !== targetTab) {
            capsuleState.activeTab = targetTab;
          }
          renderCapsuleView(containerEl, onStateChanged);
          const secEl = document.getElementById(secId);
          if (secEl) {
            secEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else if (action === 'toggle-section-read') {
          const sectionKey = target.dataset.sectionKey;
          const sectionTitle = target.dataset.sectionTitle || '';
          storage.toggleSectionRead(modId, sectionKey, sectionTitle);
          renderCapsuleView(containerEl, onStateChanged);
        } else if (action === 'toggle-module-complete') {
          storage.toggleModuleCompleted(modId);
          renderCapsuleView(containerEl, onStateChanged);
        } else if (action === 'set-mod-comp') {
          const level = target.dataset.compLevel;
          storage.setModuleComprehension(modId, level);
          renderCapsuleView(containerEl, onStateChanged);
        } else if (action === 'set-sec-comp') {
          const secKey = target.dataset.sectionKey;
          const secTitle = target.dataset.sectionTitle;
          const level = target.dataset.compLevel;
          storage.setSectionComprehension(modId, secKey, secTitle, level);
          renderCapsuleView(containerEl, onStateChanged);
        } else if (action === 'answer-quick-check') {
          const checkId = target.dataset.checkId;
          const optIdx = Number(target.dataset.optIdx);
          const correctIdx = Number(target.dataset.correctIdx);
          const checkTitle = target.dataset.checkTitle || '';
          storage.answerQuickCheck(modId, checkId, optIdx, optIdx === correctIdx, checkTitle);
          renderCapsuleView(containerEl, onStateChanged);
        } else if (action === 'answer-section-quiz') {
          const secKey = target.dataset.sectionKey;
          const secTitle = target.dataset.sectionTitle || '';
          const optIdx = Number(target.dataset.optIdx);
          const correctIdx = Number(target.dataset.correctIdx);
          storage.answerSectionQuiz(modId, secKey, optIdx, optIdx === correctIdx, secTitle);
          renderCapsuleView(containerEl, onStateChanged);
        } else if (action === 'toggle-save-concept') {
          const idx = Number(target.dataset.conceptIdx);
          const funds = (ctx.module.capsule && ctx.module.capsule.fundamentals) || [];
          const item = funds[idx];
          if (item) {
            storage.toggleSavedConcept({
              moduleId: modId,
              subjectName: ctx.subject.name,
              moduleTitle: ctx.module.title,
              term: item.term,
              definition: item.definition,
              keyIdea: item.keyIdea
            });
            renderCapsuleView(containerEl, onStateChanged);
          }
        } else if (action === 'toggle-bookmark') {
          const secId = target.dataset.secId || 'top';
          const secLabel = target.dataset.secLabel || 'Inicio de cápsula';
          const tab = target.dataset.tab || capsuleState.activeTab;
          storage.toggleBookmark({
            moduleId: modId,
            subjectName: ctx.subject.name,
            moduleTitle: ctx.module.title,
            sectionId: secId,
            sectionLabel: secLabel,
            tab
          });
          renderCapsuleView(containerEl, onStateChanged);
        } else if (action === 'highlight-selection') {
          const color = target.dataset.hlColor || 'yellow';
          const sel = window.getSelection ? window.getSelection().toString().trim() : '';
          if (!sel || sel.length < 3) {
            window.alert('Selecciona primero con el cursor una frase o concepto del texto (mínimo 3 letras) y luego pulsa el color de resaltado.');
            return;
          }
          storage.addHighlight(modId, sel, color, ctx.module.title);
          if (window.getSelection) window.getSelection().removeAllRanges();
          renderCapsuleView(containerEl, onStateChanged);
        } else if (action === 'quick-highlight') {
          const text = target.dataset.hlText || '';
          const sec = target.dataset.hlSection || 'Punto clave';
          storage.addHighlight(modId, text, 'yellow', sec);
          renderCapsuleView(containerEl, onStateChanged);
        } else if (action === 'remove-highlight') {
          const hlId = target.dataset.hlId;
          storage.removeHighlight(modId, hlId);
          renderCapsuleView(containerEl, onStateChanged);
        } else if (action === 'add-note-card') {
          const notesEl = containerEl.querySelector('#capsule-personal-notes');
          const val = notesEl ? notesEl.value.trim() : '';
          if (!val) {
            window.alert('Escribe primero una idea en el cuadro de notas para fijarla como tarjeta.');
            return;
          }
          storage.addNoteEntry(modId, val, ctx.module.title);
          storage.savePersonalNotes(modId, '');
          renderCapsuleView(containerEl, onStateChanged);
        } else if (action === 'delete-note-card') {
          const noteId = target.dataset.noteId;
          storage.deleteNoteEntry(modId, noteId);
          renderCapsuleView(containerEl, onStateChanged);
        } else if (action === 'save-learned-today') {
          const inputEl = containerEl.querySelector('#input-learned-today');
          const text = inputEl ? inputEl.value.trim() : '';
          if (!text) {
            window.alert('Escribe al menos una frase sobre lo que aprendiste hoy antes de guardar.');
            return;
          }
          const modState = storage.getModuleState(modId);
          storage.addDailyLearning({
            moduleId: modId,
            moduleTitle: ctx.module.title,
            subjectName: ctx.subject.name,
            text,
            comprehension: modState.comprehension || 'understood'
          });
          renderCapsuleView(containerEl, onStateChanged);
        } else if (action === 'delete-daily-learning') {
          const entryId = target.dataset.entryId;
          storage.deleteDailyLearning(entryId);
          renderCapsuleView(containerEl, onStateChanged);
        } else if (action === 'flip-flashcard') {
          capsuleState.flashcardFlipped = !capsuleState.flashcardFlipped;
          renderCapsuleView(containerEl, onStateChanged);
        } else if (action === 'prev-flashcard') {
          const cards = (ctx.module.capsule && ctx.module.capsule.flashcards) || [];
          if (cards.length > 0) {
            capsuleState.flashcardIndex = (capsuleState.flashcardIndex - 1 + cards.length) % cards.length;
            capsuleState.flashcardFlipped = false;
            renderCapsuleView(containerEl, onStateChanged);
          }
        } else if (action === 'next-flashcard') {
          const cards = (ctx.module.capsule && ctx.module.capsule.flashcards) || [];
          if (cards.length > 0) {
            capsuleState.flashcardIndex = (capsuleState.flashcardIndex + 1) % cards.length;
            capsuleState.flashcardFlipped = false;
            renderCapsuleView(containerEl, onStateChanged);
          }
        } else if (action === 'rate-flashcard') {
          const fcId = target.dataset.fcId;
          const fcStatus = target.dataset.fcStatus;
          storage.rateFlashcard(modId, fcId, fcStatus);
          const cards = (ctx.module.capsule && ctx.module.capsule.flashcards) || [];
          if (cards.length > 1) {
            capsuleState.flashcardIndex = (capsuleState.flashcardIndex + 1) % cards.length;
            capsuleState.flashcardFlipped = false;
          }
          renderCapsuleView(containerEl, onStateChanged);
        } else if (action === 'answer-mc') {
          const qId = target.dataset.questionId;
          const optIdx = Number(target.dataset.optionIndex);
          const mcList = (ctx.module.capsule && ctx.module.capsule.assessment && ctx.module.capsule.assessment.multipleChoice) || [];
          const qObj = mcList.find((q) => q.id === qId);
          const isCorrect = qObj ? optIdx === qObj.correctIndex : null;
          storage.saveQuizAnswer(modId, 'mc', qId, optIdx, isCorrect, qObj ? qObj.question : '');
          renderCapsuleView(containerEl, onStateChanged);
        } else if (action === 'answer-tf') {
          const qId = target.dataset.questionId;
          const val = target.dataset.tfValue === 'true';
          const tfList = (ctx.module.capsule && ctx.module.capsule.assessment && ctx.module.capsule.assessment.trueFalse) || [];
          const tfObj = tfList.find((q) => q.id === qId);
          const isCorrect = tfObj ? val === tfObj.answer : null;
          storage.saveQuizAnswer(modId, 'tf', qId, val, isCorrect, tfObj ? tfObj.statement : '');
          renderCapsuleView(containerEl, onStateChanged);
        } else if (action === 'reveal-open') {
          const qId = target.dataset.questionId;
          const textarea = document.getElementById(`open-input-${qId}`);
          const textVal = textarea ? textarea.value : '';
          storage.saveQuizAnswer(modId, 'open', qId, { text: textVal, revealed: true });
          renderCapsuleView(containerEl, onStateChanged);
        } else if (action === 'open-related-module') {
          const targetModuleId = target.dataset.targetModule;
          if (targetModuleId && typeof onNavigateModule === 'function') {
            onNavigateModule(targetModuleId);
          }
        }
      });
    }
  };
})();
