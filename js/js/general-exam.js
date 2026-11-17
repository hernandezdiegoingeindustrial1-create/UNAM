/**
 * Módulo de "Examen General" (js/general-exam.js).
 *
 * Características:
 * - Combina preguntas de opción múltiple (4 opciones, 1 respuesta correcta) de todas las materias y módulos.
 * - Incluye un Generador Automático de Reactivos (`ExamQuestionGenerator`) que transforma el contenido
 *   de cada módulo (conceptos fundamentales, puntos clave y errores comunes) en reactivos de 4 opciones,
 *   dejando lista la arquitectura para escalar dinámicamente conforme se agreguen o estudien más módulos.
 * - Muestra una sola pregunta a la vez con barra de progreso visual y botones "Anterior" y "Siguiente".
 * - Calcula total de preguntas, aciertos, errores, porcentaje, calificación sobre 100 y clasificación:
 *   90-100% Excelente | 80-89% Muy Bueno | 70-79% Bueno | 60-69% Suficiente | <60% Necesita Repasar.
 * - Muestra análisis detallado reactivo por reactivo (correctas, incorrectas, respuesta correcta y explicación).
 * - Incluye botones "Reintentar examen" y "Ver temas recomendados para repasar".
 * - Guarda en localStorage el historial de intentos anteriores y la mejor puntuación obtenida.
 */

(function () {
  const EXAM_STORAGE_KEY = 'unam_estudio_general_exams_v1';

  const examState = {
    screen: 'lobby',          // 'lobby' | 'running' | 'results'
    selectedCount: 18,        // 12 | 18 | 24 | 0 (todas)
    onlyStudiedModules: false,
    questions: [],            // Arreglo de preguntas del intento activo
    currentIndex: 0,          // Índice de la pregunta actual (0..N-1)
    answers: {},              // { [questionIndex]: selectedOptionIndex (0..3) }
    lastResult: null,         // Resultado calculado del examen recién finalizado
    showRecommendedModal: false,
    reviewFilter: 'all'       // 'all' | 'wrong' | 'correct'
  };

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ==========================================================================
     Persistencia en localStorage: Historial de Intentos y Mejor Puntuación
     ========================================================================== */

  function loadExamRecords() {
    try {
      const raw = localStorage.getItem(EXAM_STORAGE_KEY);
      if (!raw) return { bestScore: null, bestPercent: 0, attempts: [] };
      const parsed = JSON.parse(raw);
      return {
        bestScore: parsed.bestScore !== undefined ? parsed.bestScore : null,
        bestPercent: parsed.bestPercent || 0,
        attempts: Array.isArray(parsed.attempts) ? parsed.attempts : []
      };
    } catch (_) {
      return { bestScore: null, bestPercent: 0, attempts: [] };
    }
  }

  function saveExamAttempt(resultObj) {
    const records = loadExamRecords();
    const attemptEntry = {
      id: 'attempt-' + Date.now(),
      dateIso: new Date().toISOString(),
      dateLabel: new Date().toLocaleString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      totalQuestions: resultObj.totalQuestions,
      correctCount: resultObj.correctCount,
      wrongCount: resultObj.wrongCount,
      percent: resultObj.percent,
      scoreOutOf100: resultObj.scoreOutOf100,
      levelTitle: resultObj.classification.title,
      levelClass: resultObj.classification.badgeClass,
      weakModules: resultObj.weakModules.map((w) => ({
        moduleId: w.moduleId,
        moduleTitle: w.moduleTitle,
        subjectName: w.subjectName,
        errors: w.errors
      }))
    };

    records.attempts.unshift(attemptEntry);
    records.attempts = records.attempts.slice(0, 25);

    if (records.bestScore === null || resultObj.scoreOutOf100 > records.bestScore) {
      records.bestScore = resultObj.scoreOutOf100;
      records.bestPercent = resultObj.percent;
    }

    try {
      localStorage.setItem(EXAM_STORAGE_KEY, JSON.stringify(records));
    } catch (err) {
      console.warn('No se pudo guardar el historial de exámenes.', err);
    }

    return records;
  }

  /* ==========================================================================
     Clasificación según Escala Oficial Solicitada
     ========================================================================== */

  function getScoreClassification(percent) {
    if (percent >= 90) {
      return {
        title: 'Excelente',
        range: '90-100%',
        badgeClass: 'level-excellent',
        message: '¡Dominio sobresaliente! Tienes una base sólida en todas las materias evaluadas.'
      };
    }
    if (percent >= 80) {
      return {
        title: 'Muy Bueno',
        range: '80-89%',
        badgeClass: 'level-very-good',
        message: '¡Gran desempeño! Solo necesitas afinar detalles puntuales en los módulos señalados.'
      };
    }
    if (percent >= 70) {
      return {
        title: 'Bueno',
        range: '70-79%',
        badgeClass: 'level-good',
        message: 'Buen avance general. Repasa las explicaciones de tus errores para subir al rango de excelencia.'
      };
    }
    if (percent >= 60) {
      return {
        title: 'Suficiente',
        range: '60-69%',
        badgeClass: 'level-sufficient',
        message: 'Conocimiento básico acreditado, pero conviene reforzar los temas recomendados antes del examen.'
      };
    }
    return {
      title: 'Necesita Repasar',
      range: 'Menos de 60%',
      badgeClass: 'level-needs-review',
      message: 'Te recomendamos revisar las cápsulas de aprendizaje sugeridas abajo y practicar con flashcards.'
    };
  }

  /* ==========================================================================
     Motor Generador de Preguntas (Curadas + Generadas desde Contenido del Módulo)
     Garantiza que CADA pregunta tenga exactamente 4 opciones y 1 respuesta correcta
     ========================================================================== */

  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function buildQuestionPoolFromModules(subjectsData, onlyStudied = false) {
    const pool = [];
    const storage = window.StudyStorage;

    // Recopilar todos los términos e ideas clave de todas las materias para distractores inteligentes
    const allTermsBySubject = {};
    subjectsData.forEach((subj) => {
      const terms = [];
      const ideas = [];
      subj.modules.forEach((m) => {
        const funds = (m.capsule && m.capsule.fundamentals) || [];
        funds.forEach((f) => {
          terms.push(f.term);
          ideas.push(f.keyIdea);
        });
      });
      allTermsBySubject[subj.id] = { terms, ideas };
    });

    subjectsData.forEach((subject) => {
      subject.modules.forEach((mod) => {
        if (onlyStudied && storage) {
          const prog = storage.getModuleProgress(mod);
          if (prog.status === 'not_started') return;
        }

        const cap = mod.capsule || {};

        // 1. Reactivos curados de opción múltiple (4 opciones)
        const mcList = (cap.assessment && cap.assessment.multipleChoice) || [];
        mcList.forEach((mc) => {
          if (Array.isArray(mc.options) && mc.options.length === 4) {
            pool.push({
              uid: `curated-${mod.id}-${mc.id}`,
              sourceQuestionId: mc.id,
              subjectId: subject.id,
              subjectName: subject.name,
              subjectCode: subject.code,
              moduleId: mod.id,
              moduleTitle: mod.title,
              question: mc.question,
              options: [...mc.options],
              correctIndex: mc.correctIndex,
              explanation: mc.feedback
            });
          }
        });

        // 2. Generador automático a partir de los Conceptos Fundamentales del módulo
        const funds = cap.fundamentals || [];
        const subjBank = allTermsBySubject[subject.id] || { terms: [], ideas: [] };

        funds.forEach((fund, fIdx) => {
          const otherTerms = subjBank.terms.filter((t) => t !== fund.term);
          const shuffledDistractors = shuffleArray(otherTerms).slice(0, 3);

          while (shuffledDistractors.length < 3) {
            shuffledDistractors.push(`Concepto secundario (${shuffledDistractors.length + 1})`);
          }

          const rawOptions = [
            { text: fund.term, isCorrect: true },
            { text: shuffledDistractors[0], isCorrect: false },
            { text: shuffledDistractors[1], isCorrect: false },
            { text: shuffledDistractors[2], isCorrect: false }
          ];
          const mixedOptions = shuffleArray(rawOptions);
          const newCorrectIdx = mixedOptions.findIndex((o) => o.isCorrect);

          pool.push({
            uid: `autogen-fund-${mod.id}-${fIdx}`,
            sourceQuestionId: null,
            subjectId: subject.id,
            subjectName: subject.name,
            subjectCode: subject.code,
            moduleId: mod.id,
            moduleTitle: mod.title,
            question: `En ${subject.name} (${mod.title}), ¿a qué concepto fundamental corresponde la siguiente definición: "${fund.definition}"?`,
            options: mixedOptions.map((o) => o.text),
            correctIndex: newCorrectIdx,
            explanation: `${fund.term} (${fund.category}): ${fund.keyIdea}`
          });
        });

        // 3. Generador automático a partir de Ejemplos Resueltos del módulo
        const worked = cap.workedExamples || [];
        worked.forEach((ex, exIdx) => {
          if (!ex.problem || !ex.answer) return;
          const otherIdeas = subjBank.ideas.filter((idea) => idea !== ex.answer);
          const distractors = shuffleArray(otherIdeas).slice(0, 3);
          while (distractors.length < 3) {
            distractors.push('Ninguna de las opciones anteriores es válida.');
          }

          const rawOpts = [
            { text: ex.answer, isCorrect: true },
            { text: distractors[0], isCorrect: false },
            { text: distractors[1], isCorrect: false },
            { text: distractors[2], isCorrect: false }
          ];
          const mixedOpts = shuffleArray(rawOpts);
          const cIdx = mixedOpts.findIndex((o) => o.isCorrect);

          pool.push({
            uid: `autogen-ex-${mod.id}-${exIdx}`,
            sourceQuestionId: null,
            subjectId: subject.id,
            subjectName: subject.name,
            subjectCode: subject.code,
            moduleId: mod.id,
            moduleTitle: mod.title,
            question: `${ex.problem}`,
            options: mixedOpts.map((o) => o.text),
            correctIndex: cIdx,
            explanation: `${ex.reasoning}`
          });
        });
      });
    });

    return pool;
  }

  /**
   * Selecciona un examen balanceado que combine preguntas de todas las materias disponibles
   */
  function generateBalancedExam(subjectsData, targetCount = 18, onlyStudied = false) {
    let fullPool = buildQuestionPoolFromModules(subjectsData, onlyStudied);

    // Si el usuario eligió "Solo módulos estudiados" pero aún no ha iniciado ninguno, usar todo el banco
    if (fullPool.length === 0) {
      fullPool = buildQuestionPoolFromModules(subjectsData, false);
    }

    if (!targetCount || targetCount <= 0 || targetCount >= fullPool.length) {
      return shuffleArray(fullPool);
    }

    // Selección estratificada por materia para garantizar que combine todas las materias
    const bySubject = {};
    fullPool.forEach((q) => {
      if (!bySubject[q.subjectId]) bySubject[q.subjectId] = [];
      bySubject[q.subjectId].push(q);
    });

    const subjectIds = Object.keys(bySubject);
    subjectIds.forEach((sid) => {
      bySubject[sid] = shuffleArray(bySubject[sid]);
    });

    const selected = [];
    let cursor = 0;
    while (selected.length < targetCount) {
      let addedInRound = false;
      for (const sid of subjectIds) {
        if (selected.length >= targetCount) break;
        const list = bySubject[sid];
        if (cursor < list.length) {
          selected.push(list[cursor]);
          addedInRound = true;
        }
      }
      if (!addedInRound) break;
      cursor += 1;
    }

    return shuffleArray(selected);
  }

  /* ==========================================================================
     Evaluación y Cálculo de Resultados del Examen
     ========================================================================== */

  function evaluateCurrentExam() {
    const totalQuestions = examState.questions.length;
    let correctCount = 0;
    let wrongCount = 0;
    const detailedItems = [];
    const weakModulesMap = {};
    const subjectStatsMap = {};

    examState.questions.forEach((q, idx) => {
      const selectedIdx = examState.answers[idx];
      const isAnswered = selectedIdx !== undefined && selectedIdx !== null;
      const isCorrect = isAnswered && selectedIdx === q.correctIndex;

      if (isCorrect) {
        correctCount += 1;
      } else {
        wrongCount += 1;
      }

      // Estadísticas por materia
      if (!subjectStatsMap[q.subjectId]) {
        subjectStatsMap[q.subjectId] = {
          subjectName: q.subjectName,
          total: 0,
          correct: 0
        };
      }
      subjectStatsMap[q.subjectId].total += 1;
      if (isCorrect) subjectStatsMap[q.subjectId].correct += 1;

      // Registrar errores por módulo para recomendaciones de repaso y sincronizar con StudyStorage
      if (!isCorrect) {
        if (!weakModulesMap[q.moduleId]) {
          weakModulesMap[q.moduleId] = {
            moduleId: q.moduleId,
            moduleTitle: q.moduleTitle,
            subjectName: q.subjectName,
            errors: 0,
            missedQuestions: []
          };
        }
        weakModulesMap[q.moduleId].errors += 1;
        weakModulesMap[q.moduleId].missedQuestions.push(q.question);
      }

      if (window.StudyStorage) {
        const modState = window.StudyStorage.getModuleState(q.moduleId);
        window.StudyStorage.recordQuestionAttempt(
          modState,
          `exam:${q.uid}`,
          isCorrect,
          q.question
        );
        if (q.sourceQuestionId && isAnswered) {
          modState.assessment.mc[q.sourceQuestionId] = selectedIdx;
        }
        const fullState = window.StudyStorage.loadState();
        fullState.modules[q.moduleId] = modState;
        window.StudyStorage.saveState(fullState);
      }

      detailedItems.push({
        index: idx + 1,
        questionObj: q,
        selectedIdx: isAnswered ? selectedIdx : null,
        selectedText: isAnswered ? q.options[selectedIdx] : 'Sin responder',
        correctIdx: q.correctIndex,
        correctText: q.options[q.correctIndex],
        isCorrect,
        explanation: q.explanation
      });
    });

    const percent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const scoreOutOf100 = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const classification = getScoreClassification(percent);
    const weakModules = Object.values(weakModulesMap).sort((a, b) => b.errors - a.errors);
    const subjectBreakdown = Object.values(subjectStatsMap);

    const resultObj = {
      totalQuestions,
      correctCount,
      wrongCount,
      percent,
      scoreOutOf100,
      classification,
      detailedItems,
      weakModules,
      subjectBreakdown
    };

    examState.lastResult = resultObj;
    saveExamAttempt(resultObj);
    return resultObj;
  }

  /* ==========================================================================
     PANTALLA 1: Lobby de Inicio, Configuración, Mejor Puntuación e Historial
     ========================================================================== */

  function buildLobbyScreen(subjectsData) {
    const records = loadExamRecords();
    const totalModules = subjectsData.reduce((acc, s) => acc + s.modules.length, 0);
    const bestClassification =
      records.bestScore !== null ? getScoreClassification(records.bestPercent) : null;

    const historyRowsHtml =
      records.attempts.length > 0
        ? `<div class="modules-list">
             ${records.attempts
               .map(
                 (att, i) => `
               <div class="module-item">
                 <div class="module-info">
                   <span class="module-number">#${records.attempts.length - i}</span>
                   <div>
                     <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
                       <strong style="font-size: 0.98rem;">Calificación: ${att.scoreOutOf100} / 100 (${att.percent}%)</strong>
                       <span class="exam-level-pill ${att.levelClass}">${escapeHtml(att.levelTitle)}</span>
                       <span class="time-pill">&#128197; ${escapeHtml(att.dateLabel)}</span>
                     </div>
                     <p class="module-desc" style="margin-top: 0.2rem;">
                       Total: ${att.totalQuestions} reactivos &middot;
                       <span style="color: var(--success); font-weight: 600;">&#10003; ${att.correctCount} aciertos</span> &middot;
                       <span style="color: #dc2626; font-weight: 600;">&#10007; ${att.wrongCount} errores</span>
                     </p>
                   </div>
                 </div>
               </div>
             `
               )
               .join('')}
           </div>`
        : `<div class="empty-state">
             <p>Aún no has realizado ningún intento en el Examen General. ¡Inicia tu primera simulación arriba!</p>
           </div>`;

    return `
      <!-- Tarjetas de Resumen Superior: Mejor Puntuación, Intentos y Cobertura -->
      <div class="fundamentals-grid" style="margin-bottom: 1.5rem;">
        <div class="fundamental-card" style="background-color: var(--bg-surface); border-color: #bac8ff;">
          <span class="fundamental-category">Mejor Puntuación Obtenida</span>
          <div style="display: flex; align-items: baseline; gap: 0.6rem; margin: 0.25rem 0;">
            <strong style="font-size: 2rem; color: var(--accent-primary);">
              ${records.bestScore !== null ? `${records.bestScore} / 100` : '—'}
            </strong>
            ${
              bestClassification
                ? `<span class="exam-level-pill ${bestClassification.badgeClass}">${escapeHtml(bestClassification.title)}</span>`
                : ''
            }
          </div>
          <p class="fundamental-def">
            ${
              records.bestScore !== null
                ? `Tu récord histórico es de ${records.bestPercent}% de aciertos.`
                : 'Completa tu primer examen para registrar tu récord.'
            }
          </p>
        </div>

        <div class="fundamental-card" style="background-color: var(--bg-surface);">
          <span class="fundamental-category">Intentos Realizados</span>
          <strong style="font-size: 2rem; color: var(--text-primary);">${records.attempts.length}</strong>
          <p class="fundamental-def">Exámenes generales completados y guardados en tu historial local.</p>
        </div>

        <div class="fundamental-card" style="background-color: var(--bg-surface);">
          <span class="fundamental-category">Cobertura Multidisciplinaria</span>
          <strong style="font-size: 2rem; color: #16a34a;">${subjectsData.length} materias</strong>
          <p class="fundamental-def">Combina reactivos de los ${totalModules} módulos del temario.</p>
        </div>
      </div>

      <!-- Configuración e Inicio del Examen General -->
      <div class="capsule-section" style="margin-bottom: 1.5rem;">
        <header class="capsule-section-header">
          <div>
            <h2 class="capsule-section-title">
              <span class="section-number-badge">&#128221;</span>
              Configurar y Comenzar Examen General
            </h2>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.2rem;">
              Cada pregunta tiene 4 opciones de respuesta y una única opción correcta. Se mostrará una pregunta a la vez.
            </p>
          </div>
        </header>

        <div class="exam-config-row">
          <div style="width: 100%;">
            <label style="font-size: 0.84rem; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 0.45rem;">
              Número de preguntas del examen:
            </label>
            <div class="module-filters" role="group" aria-label="Cantidad de preguntas">
              <button type="button" class="chip ${examState.selectedCount === 12 ? 'active' : ''}" data-exam-action="set-count" data-count="12">
                12 preguntas (Rápido)
              </button>
              <button type="button" class="chip ${examState.selectedCount === 18 ? 'active' : ''}" data-exam-action="set-count" data-count="18">
                18 preguntas (Estándar)
              </button>
              <button type="button" class="chip ${examState.selectedCount === 24 ? 'active' : ''}" data-exam-action="set-count" data-count="24">
                24 preguntas (Extenso)
              </button>
              <button type="button" class="chip ${examState.selectedCount === 0 ? 'active' : ''}" data-exam-action="set-count" data-count="0">
                Banco completo
              </button>
            </div>
          </div>

          <div class="capsule-section-actions" style="margin-top: 0.85rem;">
            <button
              type="button"
              class="chip ${examState.onlyStudiedModules ? 'active' : ''}"
              data-exam-action="toggle-only-studied"
            >
              ${examState.onlyStudiedModules ? '&#10003; Solo módulos ya estudiados' : 'Incluir todos los módulos'}
            </button>

            <button
              type="button"
              class="btn btn-primary"
              data-exam-action="start-exam"
            >
              Iniciar Examen General &rarr;
            </button>
          </div>
        </div>
      </div>

      <!-- Historial de Intentos Anteriores -->
      <div class="capsule-section">
        <header class="capsule-section-header">
          <h2 class="capsule-section-title">
            <span class="section-number-badge">&#128220;</span>
            Historial de intentos anteriores
          </h2>
          ${
            records.attempts.length > 0
              ? `<span class="subject-module-pill">${records.attempts.length} registro(s)</span>`
              : ''
          }
        </header>
        ${historyRowsHtml}
      </div>
    `;
  }

  /* ==========================================================================
     PANTALLA 2: Examen en Curso (Una sola pregunta a la vez + Barra de Progreso)
     ========================================================================== */

  function buildRunningExamScreen() {
    const total = examState.questions.length;
    const currentIdx = examState.currentIndex;
    const currentQ = examState.questions[currentIdx];
    if (!currentQ) return '';

    const answeredCount = Object.keys(examState.answers).length;
    const progressPercent = total > 0 ? Math.round(((currentIdx + 1) / total) * 100) : 0;
    const selectedOpt = examState.answers[currentIdx];

    const optionsHtml = currentQ.options
      .map((optText, optIdx) => {
        const isSelected = selectedOpt === optIdx;
        const letter = String.fromCharCode(65 + optIdx);
        return `
          <button
            type="button"
            class="exam-option-card ${isSelected ? 'selected' : ''}"
            data-exam-action="select-option"
            data-opt-idx="${optIdx}"
            aria-pressed="${isSelected}"
          >
            <span class="exam-option-letter">${letter}</span>
            <span class="exam-option-text">${escapeHtml(optText)}</span>
          </button>
        `;
      })
      .join('');

    // Píldoras numéricas para visualizar progreso y saltar a cualquier pregunta
    const dotsHtml = examState.questions
      .map((_, i) => {
        const isCurrent = i === currentIdx;
        const isDone = examState.answers[i] !== undefined;
        return `
          <button
            type="button"
            class="exam-dot-btn ${isCurrent ? 'current' : ''} ${isDone ? 'answered' : ''}"
            data-exam-action="jump-question"
            data-q-idx="${i}"
            title="Ir a la pregunta ${i + 1}"
          >
            ${i + 1}
          </button>
        `;
      })
      .join('');

    return `
      <!-- Encabezado de Progreso del Examen -->
      <div class="capsule-hero" style="margin-bottom: 1.25rem;">
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem; margin-bottom: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span class="subject-badge" style="margin:0;">
              Pregunta ${currentIdx + 1} de ${total}
            </span>
            <span class="time-pill">
              ${escapeHtml(currentQ.subjectName)} &middot; ${escapeHtml(currentQ.moduleTitle)}
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <span style="font-size: 0.84rem; font-weight: 600; color: var(--text-secondary);">
              Respondidas: ${answeredCount} / ${total} (${progressPercent}%)
            </span>
            <button type="button" class="btn-link-subtle" data-exam-action="cancel-exam">
              Salir del examen
            </button>
          </div>
        </div>

        <!-- Barra visual de progreso -->
        <div class="progress-track" style="height: 10px;">
          <div class="progress-fill" style="width: ${progressPercent}%"></div>
        </div>

        <div class="exam-dots-bar">
          ${dotsHtml}
        </div>
      </div>

      <!-- Tarjeta de Pregunta Única -->
      <article class="capsule-section exam-question-stage">
        <p class="exam-question-heading">
          ${currentIdx + 1}. ${escapeHtml(currentQ.question)}
        </p>

        <div class="exam-options-grid" role="radiogroup" aria-label="Opciones de respuesta">
          ${optionsHtml}
        </div>

        <!-- Navegación Inferior: Anterior, Siguiente y Finalizar -->
        <footer class="exam-nav-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-exam-action="prev-question"
            ${currentIdx === 0 ? 'disabled style="opacity:0.45; cursor:not-allowed;"' : ''}
          >
            &larr; Anterior
          </button>

          <div style="display: flex; gap: 0.65rem;">
            ${
              currentIdx < total - 1
                ? `<button
                     type="button"
                     class="btn btn-primary"
                     data-exam-action="next-question"
                   >
                     Siguiente &rarr;
                   </button>`
                : ''
            }

            <button
              type="button"
              class="btn ${currentIdx === total - 1 ? 'btn-primary' : 'btn-complete completed'}"
              data-exam-action="finish-exam"
            >
              &#10003; Finalizar y calificar examen
            </button>
          </div>
        </footer>
      </article>
    `;
  }

  /* ==========================================================================
     PANTALLA 3: Pantalla de Resultados, Clasificación, Análisis y Recomendaciones
     ========================================================================== */

  function buildResultsScreen() {
    const res = examState.lastResult;
    if (!res) return '';

    const records = loadExamRecords();

    const filteredDetails = res.detailedItems.filter((item) => {
      if (examState.reviewFilter === 'wrong') return !item.isCorrect;
      if (examState.reviewFilter === 'correct') return item.isCorrect;
      return true;
    });

    const subjectBreakdownHtml = res.subjectBreakdown
      .map((s) => {
        const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
        return `
          <div class="mini-box">
            <strong>${escapeHtml(s.subjectName)}</strong>
            <div style="display:flex; justify-content:space-between; align-items:baseline; margin: 0.25rem 0;">
              <span style="font-size: 1.05rem; font-weight:700;">${s.correct} / ${s.total} aciertos</span>
              <span style="font-size: 0.82rem; color: var(--text-muted);">${pct}%</span>
            </div>
            <div class="progress-track" style="height: 6px;">
              <div class="progress-fill" style="width: ${pct}%"></div>
            </div>
          </div>
        `;
      })
      .join('');

    const recommendedModulesHtml =
      res.weakModules.length > 0
        ? `<div class="modules-list" style="margin-top: 1rem;">
             ${res.weakModules
               .map(
                 (w) => `
               <div class="module-item" style="border-left: 4px solid #dc2626;">
                 <div class="module-info">
                   <span class="module-number" style="background-color:#fef2f2; color:#dc2626;">${w.errors}</span>
                   <div>
                     <span class="fundamental-category">${escapeHtml(w.subjectName)}</span>
                     <h3 class="module-title">${escapeHtml(w.moduleTitle)}</h3>
                     <p class="module-desc">Tuviste ${w.errors} error(es) en preguntas de este módulo durante el examen.</p>
                   </div>
                 </div>
                 <div class="module-actions">
                   <button
                     type="button"
                     class="btn btn-primary"
                     data-exam-action="study-recommended-module"
                     data-module-id="${w.moduleId}"
                   >
                     Repasar cápsula &rarr;
                   </button>
                 </div>
               </div>
             `
               )
               .join('')}
           </div>`
        : `<div class="worked-answer-box" style="margin-top: 1rem;">
             <strong>&#10003; ¡Sin debilidades detectadas!</strong> Respondiste correctamente todas las preguntas del examen.
           </div>`;

    const detailedListHtml = filteredDetails
      .map((item) => {
        const statusClass = item.isCorrect ? 'review-correct' : 'review-wrong';
        const statusLabel = item.isCorrect ? '✓ Respondida correctamente' : '✗ Respondida incorrectamente';

        return `
          <article class="exam-review-card ${statusClass}">
            <div class="exam-review-header">
              <div>
                <span class="subject-badge" style="margin:0;">Pregunta ${item.index} &middot; ${escapeHtml(item.questionObj.subjectName)}</span>
                <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 0.45rem;">${escapeHtml(item.questionObj.moduleTitle)}</span>
              </div>
              <span class="exam-review-status ${statusClass}">${statusLabel}</span>
            </div>

            <p class="quiz-question-text" style="margin-top: 0.65rem;">
              ${escapeHtml(item.questionObj.question)}
            </p>

            <div class="exam-review-answers">
              <div class="exam-ans-row ${item.isCorrect ? 'ans-correct' : 'ans-wrong'}">
                <strong>Tu respuesta:</strong> ${escapeHtml(item.selectedText)}
              </div>
              ${
                !item.isCorrect
                  ? `<div class="exam-ans-row ans-correct">
                       <strong>Respuesta correcta:</strong> ${escapeHtml(item.correctText)}
                     </div>`
                  : ''
              }
            </div>

            <div class="exam-explanation-box">
              <strong>Explicación de la respuesta correcta:</strong> ${escapeHtml(item.explanation)}
            </div>
          </article>
        `;
      })
      .join('');

    return `
      <!-- Tarjeta Principal de Resultados y Clasificación -->
      <div class="capsule-hero exam-results-banner">
        <div class="exam-results-top">
          <div>
            <span class="eyebrow">Resultados del Examen General</span>
            <h2 class="capsule-hero-title" style="margin-bottom: 0.4rem;">
              Nivel alcanzado: <span class="exam-level-pill ${res.classification.badgeClass}">${escapeHtml(res.classification.title)}</span>
            </h2>
            <p class="capsule-hero-summary">${escapeHtml(res.classification.message)}</p>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.45rem;">
              Mejor puntuación histórica: <strong>${records.bestScore} / 100 (${records.bestPercent}%)</strong>
            </p>
          </div>

          <div class="exam-score-badge-box">
            <span style="font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">
              Calificación Final
            </span>
            <strong class="exam-big-score">${res.scoreOutOf100}<span>/100</span></strong>
            <span style="font-size: 0.84rem; font-weight: 600; color: var(--accent-primary);">
              ${res.percent}% de aciertos
            </span>
          </div>
        </div>

        <!-- Resumen visual numérico -->
        <div class="fundamentals-grid" style="margin-top: 1.25rem;">
          <div class="fundamental-card" style="background-color: var(--bg-surface);">
            <span class="fundamental-category">Total de Preguntas</span>
            <strong style="font-size: 1.55rem; color: var(--text-primary);">${res.totalQuestions}</strong>
            <p class="fundamental-def">Reactivos evaluados en esta sesión.</p>
          </div>
          <div class="fundamental-card" style="background-color: #f0fdf4; border-color: #bbf7d0;">
            <span class="fundamental-category" style="color: #15803d;">Respuestas Correctas</span>
            <strong style="font-size: 1.55rem; color: #15803d;">&#10003; ${res.correctCount}</strong>
            <p class="fundamental-def">Reactivos contestados con acierto.</p>
          </div>
          <div class="fundamental-card" style="background-color: #fef2f2; border-color: #fecaca;">
            <span class="fundamental-category" style="color: #b91c1c;">Respuestas Incorrectas</span>
            <strong style="font-size: 1.55rem; color: #b91c1c;">&#10007; ${res.wrongCount}</strong>
            <p class="fundamental-def">Errores u omisiones por repasar.</p>
          </div>
          <div class="fundamental-card" style="background-color: var(--bg-surface);">
            <span class="fundamental-category">Escala de Clasificación</span>
            <strong style="font-size: 1.15rem; color: var(--accent-primary);">${escapeHtml(res.classification.title)} (${res.classification.range})</strong>
            <p class="fundamental-def">90-100 Excelente · 80-89 Muy Bueno · 70-79 Bueno · 60-69 Suficiente · &lt;60 Repasar</p>
          </div>
        </div>

        <!-- Botones de acción principales -->
        <div class="capsule-section-actions" style="margin-top: 1.35rem; padding-top: 1.1rem; border-top: 1px solid var(--border-color);">
          <button type="button" class="btn btn-primary" data-exam-action="retry-exam">
            &#8635; Reintentar examen
          </button>
          <button type="button" class="btn btn-secondary" data-exam-action="toggle-recommended-topics">
            &#127919; Ver temas recomendados para repasar (${res.weakModules.length})
          </button>
          <button type="button" class="btn btn-secondary" data-exam-action="back-to-lobby">
            Ver historial de intentos
          </button>
        </div>
      </div>

      <!-- Sección desplegable: Temas Recomendados para Repasar según los Errores del Examen -->
      <div class="capsule-section" id="exam-recommended-section" style="margin-bottom: 1.5rem;" ${examState.showRecommendedModal ? '' : ''}>
        <header class="capsule-section-header">
          <h2 class="capsule-section-title">
            <span class="section-number-badge">&#127919;</span>
            Temas recomendados para repasar y desempeño por materia
          </h2>
        </header>

        <div class="deep-dive-subgrid" style="margin-bottom: 1rem;">
          ${subjectBreakdownHtml}
        </div>

        ${recommendedModulesHtml}
      </div>

      <!-- Análisis Detallado Reactivo por Reactivo -->
      <div class="capsule-section">
        <header class="capsule-section-header">
          <h2 class="capsule-section-title">
            <span class="section-number-badge">&#128269;</span>
            Análisis detallado de respuestas
          </h2>
          <div class="module-filters">
            <button type="button" class="chip ${examState.reviewFilter === 'all' ? 'active' : ''}" data-exam-action="filter-review" data-filter="all">
              Todas (${res.totalQuestions})
            </button>
            <button type="button" class="chip ${examState.reviewFilter === 'wrong' ? 'active' : ''}" data-exam-action="filter-review" data-filter="wrong">
              &#10007; Incorrectas (${res.wrongCount})
            </button>
            <button type="button" class="chip ${examState.reviewFilter === 'correct' ? 'active' : ''}" data-exam-action="filter-review" data-filter="correct">
              &#10003; Correctas (${res.correctCount})
            </button>
          </div>
        </header>

        <div class="exam-review-list">
          ${detailedListHtml}
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     Renderizador Principal y API Pública de window.GeneralExamController
     ========================================================================== */

  function renderGeneralExam(containerEl, subjectsData) {
    if (!containerEl) return;

    if (examState.screen === 'running') {
      containerEl.innerHTML = buildRunningExamScreen();
    } else if (examState.screen === 'results') {
      containerEl.innerHTML = buildResultsScreen();
    } else {
      containerEl.innerHTML = buildLobbyScreen(subjectsData);
    }
  }

  window.GeneralExamController = {
    open(containerEl, subjectsData) {
      renderGeneralExam(containerEl, subjectsData);
    },

    bindEvents(containerEl, subjectsData, onStateChanged, onOpenModule) {
      if (!containerEl) return;

      containerEl.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-exam-action]');
        if (!btn) return;

        const action = btn.dataset.examAction;

        if (action === 'set-count') {
          examState.selectedCount = Number(btn.dataset.count);
          renderGeneralExam(containerEl, subjectsData);
        } else if (action === 'toggle-only-studied') {
          examState.onlyStudiedModules = !examState.onlyStudiedModules;
          renderGeneralExam(containerEl, subjectsData);
        } else if (action === 'start-exam' || action === 'retry-exam') {
          examState.questions = generateBalancedExam(
            subjectsData,
            examState.selectedCount,
            examState.onlyStudiedModules
          );
          examState.currentIndex = 0;
          examState.answers = {};
          examState.lastResult = null;
          examState.reviewFilter = 'all';
          examState.screen = 'running';
          renderGeneralExam(containerEl, subjectsData);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (action === 'select-option') {
          const optIdx = Number(btn.dataset.optIdx);
          examState.answers[examState.currentIndex] = optIdx;
          renderGeneralExam(containerEl, subjectsData);
        } else if (action === 'prev-question') {
          if (examState.currentIndex > 0) {
            examState.currentIndex -= 1;
            renderGeneralExam(containerEl, subjectsData);
          }
        } else if (action === 'next-question') {
          if (examState.currentIndex < examState.questions.length - 1) {
            examState.currentIndex += 1;
            renderGeneralExam(containerEl, subjectsData);
          }
        } else if (action === 'jump-question') {
          const qIdx = Number(btn.dataset.qIdx);
          if (qIdx >= 0 && qIdx < examState.questions.length) {
            examState.currentIndex = qIdx;
            renderGeneralExam(containerEl, subjectsData);
          }
        } else if (action === 'finish-exam') {
          const answeredCount = Object.keys(examState.answers).length;
          const total = examState.questions.length;
          if (answeredCount < total) {
            const confirmFinish = window.confirm(
              `Has respondido ${answeredCount} de ${total} preguntas. Las preguntas sin responder se contarán como incorrectas. ¿Deseas finalizar y calificar el examen?`
            );
            if (!confirmFinish) return;
          }
          evaluateCurrentExam();
          examState.screen = 'results';
          if (typeof onStateChanged === 'function') onStateChanged();
          renderGeneralExam(containerEl, subjectsData);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (action === 'cancel-exam' || action === 'back-to-lobby') {
          examState.screen = 'lobby';
          renderGeneralExam(containerEl, subjectsData);
        } else if (action === 'toggle-recommended-topics') {
          const sec = document.getElementById('exam-recommended-section');
          if (sec) {
            sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else if (action === 'filter-review') {
          examState.reviewFilter = btn.dataset.filter || 'all';
          renderGeneralExam(containerEl, subjectsData);
        } else if (action === 'study-recommended-module') {
          const modId = btn.dataset.moduleId;
          if (modId && typeof onOpenModule === 'function') {
            onOpenModule(modId, 'guided', 'top');
          }
        }
      });
    }
  };
})();
