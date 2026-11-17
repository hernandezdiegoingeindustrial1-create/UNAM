/**
 * Motor de Persistencia, Aprendizaje Activo y Repaso Inteligente (LocalStorage).
 *
 * Incluye:
 * - Repetición Espaciada (algoritmo tipo SM-2 con grados: 'again', 'hard', 'good', 'easy')
 * - Registro automático de errores por pregunta y por módulo (Weak Topics Tracker)
 * - Motor de Recomendación Inteligente y Generador de Repaso Diario Automático
 * - Notas personales, Resaltado, Marcadores, Conceptos Favoritos y Bitácora "Lo que aprendí hoy"
 */

const STORAGE_KEY = 'unam_estudio_active_v3';
const LEGACY_KEY = 'unam_estudio_capsules_v2';

const READING_SECTIONS = [
  'intro',
  'fundamentals',
  'deepDive',
  'keyTakeaways',
  'commonMistakes',
  'workedExamples',
  'executiveSummary'
];

const COMPREHENSION_LABELS = {
  unrated: 'Sin calificar',
  understood: 'Entendido',
  needs_review: 'Necesito repasar',
  not_understood: 'No comprendido'
};

function createEmptyModuleState() {
  return {
    opened: false,
    manualCompleted: false,
    comprehension: 'unrated',   // 'unrated' | 'understood' | 'needs_review' | 'not_understood'
    sectionComprehension: {},   // { [sectionKey]: 'understood' | 'needs_review' | 'not_understood' }
    readSections: {},           // { [sectionKey]: true }
    quickChecks: {},            // { [checkId]: { selected: number, correct: boolean } }
    sectionQuizzes: {},         // { [sectionKey]: { selected: number, correct: boolean } }
    flashcards: {},             // { [fcId]: { status, reps, lapses, interval, easeFactor, nextReview, lastReviewed } }
    assessment: {
      mc: {},                   // { [qId]: number }
      tf: {},                   // { [tfId]: boolean }
      open: {}                  // { [orId]: { text: string, revealed: boolean } }
    },
    errorLog: {                 // Seguimiento de fallos frecuentes en este módulo
      totalMistakes: 0,
      wrongQuestions: {},       // { [questionKey]: { wrongCount, correctCount, lastWrongAt, label } }
      flashcardLapses: 0
    },
    personalNotes: '',
    noteEntries: [],
    highlights: [],
    history: [],
    updatedAt: null
  };
}

function createDefaultGlobalState() {
  return {
    modules: {},
    savedConcepts: [],          // Conceptos favoritos (★)
    bookmarks: [],
    lastBookmark: null,
    dailyLearnings: [],
    dailyReviewStats: {
      lastCompletedDate: null,
      completedSessions: 0,
      cardsReviewedToday: 0,
      questionsPracticedToday: 0
    }
  };
}

window.StudyStorage = {
  READING_SECTIONS,
  COMPREHENSION_LABELS,

  loadState() {
    try {
      let raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy) {
          const parsedLegacy = JSON.parse(legacy);
          const migrated = {
            ...createDefaultGlobalState(),
            modules: parsedLegacy.modules || {}
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
          return migrated;
        }
        return createDefaultGlobalState();
      }
      const parsed = JSON.parse(raw);
      return {
        ...createDefaultGlobalState(),
        ...parsed,
        modules: parsed.modules || {},
        savedConcepts: Array.isArray(parsed.savedConcepts) ? parsed.savedConcepts : [],
        bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [],
        dailyLearnings: Array.isArray(parsed.dailyLearnings) ? parsed.dailyLearnings : [],
        dailyReviewStats: {
          ...createDefaultGlobalState().dailyReviewStats,
          ...(parsed.dailyReviewStats || {})
        }
      };
    } catch (err) {
      console.warn('Error leyendo localStorage, usando estado por defecto.', err);
      return createDefaultGlobalState();
    }
  },

  saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('No se pudo guardar en localStorage.', err);
    }
  },

  getModuleState(moduleId) {
    const state = this.loadState();
    const modState = state.modules[moduleId] || createEmptyModuleState();
    const empty = createEmptyModuleState();
    return {
      ...empty,
      ...modState,
      sectionComprehension: modState.sectionComprehension || {},
      readSections: modState.readSections || {},
      quickChecks: modState.quickChecks || {},
      sectionQuizzes: modState.sectionQuizzes || {},
      flashcards: modState.flashcards || {},
      noteEntries: Array.isArray(modState.noteEntries) ? modState.noteEntries : [],
      highlights: Array.isArray(modState.highlights) ? modState.highlights : [],
      history: Array.isArray(modState.history) ? modState.history : [],
      errorLog: {
        totalMistakes: (modState.errorLog && modState.errorLog.totalMistakes) || 0,
        wrongQuestions: (modState.errorLog && modState.errorLog.wrongQuestions) || {},
        flashcardLapses: (modState.errorLog && modState.errorLog.flashcardLapses) || 0
      },
      assessment: {
        mc: (modState.assessment && modState.assessment.mc) || {},
        tf: (modState.assessment && modState.assessment.tf) || {},
        open: (modState.assessment && modState.assessment.open) || {}
      }
    };
  },

  updateModuleState(moduleId, updaterFn) {
    const state = this.loadState();
    const current = this.getModuleState(moduleId);
    const updated = updaterFn(current, state) || current;
    updated.updatedAt = new Date().toISOString();
    state.modules[moduleId] = updated;
    this.saveState(state);
    return updated;
  },

  appendHistory(modState, action, detail = '') {
    const entry = {
      id: 'h-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      action,
      detail,
      timestamp: new Date().toISOString()
    };
    modState.history = [entry, ...(modState.history || [])].slice(0, 40);
  },

  /**
   * Registra aciertos o errores en el rastreador de debilidades del módulo
   */
  recordQuestionAttempt(modState, questionKey, isCorrect, label = '') {
    if (!modState.errorLog) {
      modState.errorLog = { totalMistakes: 0, wrongQuestions: {}, flashcardLapses: 0 };
    }
    const prev = modState.errorLog.wrongQuestions[questionKey] || {
      wrongCount: 0,
      correctCount: 0,
      lastWrongAt: null,
      lastResult: null,
      label
    };

    if (!isCorrect) {
      modState.errorLog.totalMistakes = (modState.errorLog.totalMistakes || 0) + 1;
      prev.wrongCount += 1;
      prev.lastWrongAt = new Date().toISOString();
      prev.lastResult = 'wrong';
    } else {
      prev.correctCount += 1;
      prev.lastResult = 'correct';
    }
    if (label) prev.label = label;
    modState.errorLog.wrongQuestions[questionKey] = prev;
  },

  markCapsuleOpened(moduleId) {
    return this.updateModuleState(moduleId, (mod) => {
      if (!mod.opened) {
        mod.opened = true;
        this.appendHistory(mod, 'Cápsula iniciada', 'Primera apertura del módulo de estudio.');
      }
      return mod;
    });
  },

  setModuleComprehension(moduleId, level) {
    return this.updateModuleState(moduleId, (mod) => {
      mod.opened = true;
      mod.comprehension = level;
      const label = COMPREHENSION_LABELS[level] || level;
      this.appendHistory(mod, 'Nivel de comprensión actualizado', `Estado marcado como: "${label}"`);
      return mod;
    });
  },

  setSectionComprehension(moduleId, sectionKey, sectionName, level) {
    return this.updateModuleState(moduleId, (mod) => {
      mod.opened = true;
      mod.sectionComprehension[sectionKey] = level;
      if (level === 'understood') {
        mod.readSections[sectionKey] = true;
      }
      const label = COMPREHENSION_LABELS[level] || level;
      this.appendHistory(mod, `Comprensión en ${sectionName}`, `Marcado como: "${label}"`);
      return mod;
    });
  },

  toggleSectionRead(moduleId, sectionKey, sectionTitle = '') {
    return this.updateModuleState(moduleId, (mod) => {
      mod.opened = true;
      const next = !mod.readSections[sectionKey];
      if (next) {
        mod.readSections[sectionKey] = true;
        this.appendHistory(mod, 'Sección completada', sectionTitle || sectionKey);
      } else {
        delete mod.readSections[sectionKey];
        mod.manualCompleted = false;
      }
      return mod;
    });
  },

  answerQuickCheck(moduleId, checkId, selectedIndex, isCorrect, promptTitle = '') {
    return this.updateModuleState(moduleId, (mod) => {
      mod.opened = true;
      mod.quickChecks[checkId] = {
        selected: selectedIndex,
        correct: Boolean(isCorrect),
        answeredAt: new Date().toISOString()
      };
      this.recordQuestionAttempt(mod, `qc:${checkId}`, isCorrect, promptTitle || 'Pregunta rápida');
      this.appendHistory(
        mod,
        isCorrect ? 'Pregunta rápida acertada ⚡' : 'Error en pregunta rápida ⚡',
        promptTitle
      );
      return mod;
    });
  },

  answerSectionQuiz(moduleId, sectionKey, selectedIndex, isCorrect, sectionTitle = '') {
    return this.updateModuleState(moduleId, (mod) => {
      mod.opened = true;
      mod.sectionQuizzes[sectionKey] = {
        selected: selectedIndex,
        correct: Boolean(isCorrect),
        answeredAt: new Date().toISOString()
      };
      this.recordQuestionAttempt(mod, `sec:${sectionKey}`, isCorrect, `Mini eval: ${sectionTitle}`);
      if (isCorrect) {
        mod.readSections[sectionKey] = true;
        if (!mod.sectionComprehension[sectionKey]) {
          mod.sectionComprehension[sectionKey] = 'understood';
        }
      }
      this.appendHistory(
        mod,
        isCorrect ? 'Mini evaluación superada 🎯' : 'Fallo en mini evaluación 🎯',
        sectionTitle || sectionKey
      );
      return mod;
    });
  },

  saveQuizAnswer(moduleId, type, questionId, value, isCorrect = null, questionText = '') {
    return this.updateModuleState(moduleId, (mod, globalState) => {
      mod.opened = true;
      if (type === 'mc') {
        mod.assessment.mc[questionId] = value;
        if (isCorrect !== null) {
          this.recordQuestionAttempt(mod, `mc:${questionId}`, isCorrect, questionText);
        }
        this.appendHistory(
          mod,
          isCorrect === false ? 'Fallo en autoevaluación (Opción Múltiple)' : 'Reactivo de autoevaluación respondido',
          `Pregunta ${questionId}`
        );
      } else if (type === 'tf') {
        mod.assessment.tf[questionId] = value;
        if (isCorrect !== null) {
          this.recordQuestionAttempt(mod, `tf:${questionId}`, isCorrect, questionText);
        }
        this.appendHistory(
          mod,
          isCorrect === false ? 'Fallo en Verdadero/Falso' : 'Reactivo Verdadero/Falso respondido',
          `Pregunta ${questionId}`
        );
      } else if (type === 'open') {
        mod.assessment.open[questionId] = value;
        this.appendHistory(mod, 'Reflexión abierta completada', 'Autoevaluación escrita');
      }

      if (globalState && globalState.dailyReviewStats) {
        globalState.dailyReviewStats.questionsPracticedToday =
          (globalState.dailyReviewStats.questionsPracticedToday || 0) + 1;
      }
      return mod;
    });
  },

  /**
   * Algoritmo de Repetición Espaciada (SM-2 adaptado)
   * Grados soportados:
   * - 'again' (Otra vez / Olvidado) -> intervalo 0 días (hoy mismo), incrementa lapses
   * - 'hard'  (Difícil)             -> intervalo 1 día
   * - 'good'  (Bien / Dominada)     -> intervalo 3 días (o prev * easeFactor)
   * - 'easy'  (Fácil)               -> intervalo 7 días (o prev * easeFactor * 1.3)
   * También mantiene compatibilidad con 'review' (= 'again') y 'mastered' (= 'good')
   */
  rateFlashcard(moduleId, flashcardId, gradeOrStatus) {
    return this.updateModuleState(moduleId, (mod, globalState) => {
      mod.opened = true;
      const prev = mod.flashcards[flashcardId] || {
        reps: 0,
        lapses: 0,
        interval: 0,
        easeFactor: 2.5
      };

      let grade = gradeOrStatus;
      if (grade === 'review') grade = 'again';
      if (grade === 'mastered') grade = 'good';

      let nextInterval = 1;
      let nextEase = prev.easeFactor || 2.5;
      let nextReps = prev.reps || 0;
      let nextLapses = prev.lapses || 0;
      let status = 'review';

      if (grade === 'again') {
        nextInterval = 0; // Vence inmediatamente hoy
        nextEase = Math.max(1.3, nextEase - 0.2);
        nextReps = 0;
        nextLapses += 1;
        status = 'review';
        if (!mod.errorLog) mod.errorLog = { totalMistakes: 0, wrongQuestions: {}, flashcardLapses: 0 };
        mod.errorLog.flashcardLapses = (mod.errorLog.flashcardLapses || 0) + 1;
        mod.errorLog.totalMistakes = (mod.errorLog.totalMistakes || 0) + 1;
      } else if (grade === 'hard') {
        nextInterval = Math.max(1, Math.round((prev.interval || 1) * 1.2));
        nextEase = Math.max(1.3, nextEase - 0.15);
        nextReps += 1;
        status = 'review';
      } else if (grade === 'good') {
        nextInterval = prev.reps === 0 ? 3 : Math.max(3, Math.round((prev.interval || 2) * nextEase));
        nextReps += 1;
        status = 'mastered';
      } else if (grade === 'easy') {
        nextInterval = prev.reps === 0 ? 7 : Math.max(7, Math.round((prev.interval || 3) * nextEase * 1.3));
        nextEase = Math.min(3.0, nextEase + 0.15);
        nextReps += 1;
        status = 'mastered';
      }

      const nowMs = Date.now();
      // Si nextInterval === 0, vence hoy mismo; de lo contrario en nextInterval días
      const nextReviewIso =
        nextInterval === 0
          ? new Date(nowMs).toISOString()
          : new Date(nowMs + nextInterval * 86400000).toISOString();

      mod.flashcards[flashcardId] = {
        status,
        grade,
        reps: nextReps,
        lapses: nextLapses,
        interval: nextInterval,
        easeFactor: Number(nextEase.toFixed(2)),
        lastReviewed: new Date(nowMs).toISOString(),
        nextReview: nextReviewIso
      };

      if (globalState && globalState.dailyReviewStats) {
        globalState.dailyReviewStats.cardsReviewedToday =
          (globalState.dailyReviewStats.cardsReviewedToday || 0) + 1;
      }

      this.appendHistory(
        mod,
        status === 'mastered'
          ? `Flashcard programada (+${nextInterval}d) 🃏`
          : 'Flashcard marcada para repaso cercano 🃏',
        `Tarjeta ${flashcardId}`
      );
      return mod;
    });
  },

  savePersonalNotes(moduleId, text) {
    return this.updateModuleState(moduleId, (mod) => {
      mod.personalNotes = text;
      return mod;
    });
  },

  addNoteEntry(moduleId, text, sectionTitle = 'General') {
    const clean = String(text || '').trim();
    if (!clean) return null;
    return this.updateModuleState(moduleId, (mod) => {
      mod.opened = true;
      const entry = {
        id: 'note-' + Date.now(),
        text: clean,
        sectionTitle,
        createdAt: new Date().toISOString()
      };
      mod.noteEntries = [entry, ...(mod.noteEntries || [])];
      this.appendHistory(mod, 'Nota personal añadida 📝', `${sectionTitle}: "${clean.slice(0, 45)}..."`);
      return mod;
    });
  },

  deleteNoteEntry(moduleId, noteId) {
    return this.updateModuleState(moduleId, (mod) => {
      mod.noteEntries = (mod.noteEntries || []).filter((n) => n.id !== noteId);
      return mod;
    });
  },

  isConceptSaved(moduleId, term) {
    const state = this.loadState();
    return state.savedConcepts.some((c) => c.moduleId === moduleId && c.term === term);
  },

  toggleSavedConcept(conceptPayload) {
    const state = this.loadState();
    const { moduleId, subjectName, moduleTitle, term, definition, keyIdea } = conceptPayload;
    const existingIdx = state.savedConcepts.findIndex(
      (c) => c.moduleId === moduleId && c.term === term
    );

    let saved = false;
    if (existingIdx !== -1) {
      state.savedConcepts.splice(existingIdx, 1);
    } else {
      saved = true;
      state.savedConcepts.unshift({
        id: 'concept-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5),
        moduleId,
        subjectName,
        moduleTitle,
        term,
        definition,
        keyIdea,
        savedAt: new Date().toISOString()
      });
    }

    if (moduleId) {
      const mod = this.getModuleState(moduleId);
      this.appendHistory(
        mod,
        saved ? 'Concepto favorito guardado ★' : 'Concepto removido de favoritos',
        term
      );
      state.modules[moduleId] = mod;
    }
    this.saveState(state);
    return saved;
  },

  removeSavedConceptById(conceptId) {
    const state = this.loadState();
    state.savedConcepts = state.savedConcepts.filter((c) => c.id !== conceptId);
    this.saveState(state);
  },

  getSavedConcepts(moduleId = null) {
    const state = this.loadState();
    if (!moduleId) return state.savedConcepts;
    return state.savedConcepts.filter((c) => c.moduleId === moduleId);
  },

  addHighlight(moduleId, text, color = 'yellow', sectionLabel = 'Cápsula') {
    const clean = String(text || '').trim();
    if (!clean) return null;
    return this.updateModuleState(moduleId, (mod) => {
      mod.opened = true;
      const exists = (mod.highlights || []).some(
        (h) => h.text.toLowerCase() === clean.toLowerCase()
      );
      if (!exists) {
        mod.highlights = [
          {
            id: 'hl-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5),
            text: clean,
            color,
            sectionLabel,
            createdAt: new Date().toISOString()
          },
          ...(mod.highlights || [])
        ];
        this.appendHistory(mod, 'Contenido clave resaltado 🖍️', `"${clean.slice(0, 50)}..."`);
      }
      return mod;
    });
  },

  removeHighlight(moduleId, highlightId) {
    return this.updateModuleState(moduleId, (mod) => {
      mod.highlights = (mod.highlights || []).filter((h) => h.id !== highlightId);
      return mod;
    });
  },

  isBookmarked(moduleId, sectionId = 'top') {
    const state = this.loadState();
    return state.bookmarks.some((b) => b.moduleId === moduleId && b.sectionId === sectionId);
  },

  toggleBookmark({ moduleId, subjectName, moduleTitle, sectionId = 'top', sectionLabel = 'Inicio de cápsula', tab = 'guided' }) {
    const state = this.loadState();
    const idx = state.bookmarks.findIndex(
      (b) => b.moduleId === moduleId && b.sectionId === sectionId
    );

    let added = false;
    if (idx !== -1) {
      state.bookmarks.splice(idx, 1);
      if (
        state.lastBookmark &&
        state.lastBookmark.moduleId === moduleId &&
        state.lastBookmark.sectionId === sectionId
      ) {
        state.lastBookmark = state.bookmarks[0] || null;
      }
    } else {
      added = true;
      const newBm = {
        id: 'bm-' + Date.now(),
        moduleId,
        subjectName,
        moduleTitle,
        sectionId,
        sectionLabel,
        tab,
        createdAt: new Date().toISOString()
      };
      state.bookmarks.unshift(newBm);
      state.lastBookmark = newBm;
    }

    const mod = this.getModuleState(moduleId);
    this.appendHistory(
      mod,
      added ? 'Marcador guardado 🔖' : 'Marcador eliminado',
      sectionLabel
    );
    state.modules[moduleId] = mod;
    this.saveState(state);
    return added;
  },

  getBookmarks() {
    const state = this.loadState();
    return {
      list: state.bookmarks,
      lastBookmark: state.lastBookmark || state.bookmarks[0] || null
    };
  },

  addDailyLearning({ moduleId, moduleTitle, subjectName, text, comprehension = 'understood' }) {
    const clean = String(text || '').trim();
    if (!clean) return null;
    const state = this.loadState();
    const now = new Date();
    const entry = {
      id: 'dl-' + Date.now(),
      moduleId,
      moduleTitle,
      subjectName,
      text: clean,
      comprehension,
      dateStr: now.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      createdAt: now.toISOString()
    };

    state.dailyLearnings.unshift(entry);

    if (moduleId) {
      const mod = this.getModuleState(moduleId);
      mod.opened = true;
      this.appendHistory(mod, 'Registro en "Lo que aprendí hoy" 💡', `"${clean.slice(0, 50)}..."`);
      state.modules[moduleId] = mod;
    }

    this.saveState(state);
    return entry;
  },

  deleteDailyLearning(entryId) {
    const state = this.loadState();
    state.dailyLearnings = state.dailyLearnings.filter((e) => e.id !== entryId);
    this.saveState(state);
  },

  getDailyLearnings(moduleId = null) {
    const state = this.loadState();
    if (!moduleId) return state.dailyLearnings;
    return state.dailyLearnings.filter((e) => e.moduleId === moduleId);
  },

  getModuleProgress(moduleObj) {
    if (!moduleObj) {
      return {
        percent: 0,
        status: 'not_started',
        statusLabel: 'No iniciado',
        comprehension: 'unrated',
        comprehensionLabel: COMPREHENSION_LABELS.unrated,
        isCompleted: false
      };
    }

    const modState = this.getModuleState(moduleObj.id);
    const capsule = moduleObj.capsule || {};

    const totalReadSections = READING_SECTIONS.length;
    const readCount = READING_SECTIONS.filter(
      (k) => Boolean(modState.readSections[k]) || (modState.sectionQuizzes[k] && modState.sectionQuizzes[k].correct)
    ).length;
    const readRatio = totalReadSections > 0 ? readCount / totalReadSections : 0;

    const totalQuickChecks = 3;
    const answeredQuickChecks = Object.keys(modState.quickChecks || {}).length;
    const quickRatio = Math.min(1, answeredQuickChecks / totalQuickChecks);

    const flashcardsList = capsule.flashcards || [];
    const totalFlashcards = flashcardsList.length;
    const flashcardsMastered = flashcardsList.filter(
      (fc) => modState.flashcards[fc.id] && modState.flashcards[fc.id].status === 'mastered'
    ).length;
    const flashcardsReviewed = flashcardsList.filter((fc) => Boolean(modState.flashcards[fc.id])).length;
    const fcRatio =
      totalFlashcards > 0
        ? (flashcardsMastered * 1.0 + (flashcardsReviewed - flashcardsMastered) * 0.5) / totalFlashcards
        : 1;

    const mcList = (capsule.assessment && capsule.assessment.multipleChoice) || [];
    const tfList = (capsule.assessment && capsule.assessment.trueFalse) || [];
    const openList = (capsule.assessment && capsule.assessment.openReflection) || [];
    const totalQuiz = mcList.length + tfList.length + openList.length;

    const mcAnswered = mcList.filter((q) => modState.assessment.mc[q.id] !== undefined).length;
    const tfAnswered = tfList.filter((q) => modState.assessment.tf[q.id] !== undefined).length;
    const openAnswered = openList.filter(
      (q) => modState.assessment.open[q.id] && modState.assessment.open[q.id].revealed
    ).length;
    const quizAnswered = mcAnswered + tfAnswered + openAnswered;
    const quizRatio = totalQuiz > 0 ? quizAnswered / totalQuiz : 1;

    let computedPercent = Math.round(
      readRatio * 35 + quickRatio * 15 + fcRatio * 20 + quizRatio * 30
    );

    if (modState.manualCompleted) {
      computedPercent = 100;
    }

    let status = 'not_started';
    let statusLabel = 'No iniciado';

    const hasActiveWork =
      computedPercent > 0 ||
      modState.opened ||
      flashcardsReviewed > 0 ||
      (modState.highlights && modState.highlights.length > 0) ||
      (modState.noteEntries && modState.noteEntries.length > 0);

    if (computedPercent >= 100 || modState.manualCompleted) {
      computedPercent = 100;
      status = 'completed';
      statusLabel = 'Completado';
    } else if (hasActiveWork) {
      status = 'in_progress';
      statusLabel = 'En progreso';
    }

    const comprehension = modState.comprehension || 'unrated';
    const totalMistakes = (modState.errorLog && modState.errorLog.totalMistakes) || 0;

    return {
      percent: computedPercent,
      status,
      statusLabel,
      comprehension,
      comprehensionLabel: COMPREHENSION_LABELS[comprehension] || COMPREHENSION_LABELS.unrated,
      isCompleted: status === 'completed',
      totalMistakes,
      breakdown: {
        readCount,
        totalReadSections,
        answeredQuickChecks,
        totalQuickChecks,
        flashcardsMastered,
        flashcardsReviewed,
        totalFlashcards,
        quizAnswered,
        totalQuiz,
        highlightsCount: (modState.highlights || []).length,
        notesCount: (modState.noteEntries || []).length + (modState.personalNotes ? 1 : 0),
        historyCount: (modState.history || []).length
      }
    };
  },

  /* ==========================================================================
     CENTRO DE REPASO INTELIGENTE: Analítica de Errores, SRS y Recomendaciones
     ========================================================================== */

  /**
   * Obtiene todas las flashcards del catálogo con sus metadatos de Repetición Espaciada
   */
  getAllFlashcardsWithSRS(subjectsData = []) {
    const nowMs = Date.now();
    const allCards = [];

    subjectsData.forEach((subject) => {
      subject.modules.forEach((mod) => {
        const modState = this.getModuleState(mod.id);
        const cards = (mod.capsule && mod.capsule.flashcards) || [];

        cards.forEach((fc) => {
          const srs = modState.flashcards[fc.id] || null;
          const isNew = !srs;
          const nextReviewMs = srs && srs.nextReview ? new Date(srs.nextReview).getTime() : 0;
          const isDue = isNew || nextReviewMs <= nowMs || srs.status === 'review';

          allCards.push({
            ...fc,
            moduleId: mod.id,
            moduleTitle: mod.title,
            subjectId: subject.id,
            subjectName: subject.name,
            subjectCode: subject.code,
            srs: srs || {
              status: 'new',
              grade: null,
              reps: 0,
              lapses: 0,
              interval: 0,
              easeFactor: 2.5,
              nextReview: null
            },
            isNew,
            isDue
          });
        });
      });
    });

    // Ordenar: primero las que tienen más fallos (lapses), luego las vencidas hoy, luego nuevas
    return allCards.sort((a, b) => {
      if (a.isDue !== b.isDue) return a.isDue ? -1 : 1;
      if ((b.srs.lapses || 0) !== (a.srs.lapses || 0)) {
        return (b.srs.lapses || 0) - (a.srs.lapses || 0);
      }
      return 0;
    });
  },

  /**
   * Construye el Banco Global de Preguntas con su estado de acierto/error
   */
  getQuestionBank(subjectsData = []) {
    const bank = [];

    subjectsData.forEach((subject) => {
      subject.modules.forEach((mod) => {
        const modState = this.getModuleState(mod.id);
        const assessment = (mod.capsule && mod.capsule.assessment) || {};
        const wrongMap = (modState.errorLog && modState.errorLog.wrongQuestions) || {};

        // Opción múltiple
        (assessment.multipleChoice || []).forEach((mc) => {
          const selected = modState.assessment.mc[mc.id];
          const answered = selected !== undefined;
          const isCorrect = answered && selected === mc.correctIndex;
          const errStat = wrongMap[`mc:${mc.id}`] || { wrongCount: 0, correctCount: 0 };

          bank.push({
            uid: `mc:${mod.id}:${mc.id}`,
            id: mc.id,
            type: 'mc',
            moduleId: mod.id,
            moduleTitle: mod.title,
            subjectId: subject.id,
            subjectName: subject.name,
            question: mc.question,
            options: mc.options,
            correctIndex: mc.correctIndex,
            feedback: mc.feedback,
            selected,
            answered,
            isCorrect,
            wrongCount: errStat.wrongCount || (!isCorrect && answered ? 1 : 0)
          });
        });

        // Verdadero / Falso
        (assessment.trueFalse || []).forEach((tf) => {
          const selected = modState.assessment.tf[tf.id];
          const answered = selected !== undefined;
          const isCorrect = answered && selected === tf.answer;
          const errStat = wrongMap[`tf:${tf.id}`] || { wrongCount: 0, correctCount: 0 };

          bank.push({
            uid: `tf:${mod.id}:${tf.id}`,
            id: tf.id,
            type: 'tf',
            moduleId: mod.id,
            moduleTitle: mod.title,
            subjectId: subject.id,
            subjectName: subject.name,
            question: tf.statement,
            options: ['Verdadero', 'Falso'],
            correctAnswer: tf.answer,
            feedback: tf.feedback,
            selected,
            answered,
            isCorrect,
            wrongCount: errStat.wrongCount || (!isCorrect && answered ? 1 : 0)
          });
        });
      });
    });

    return bank;
  },

  /**
   * Analiza los temas que el estudiante falla con frecuencia o necesita reforzar
   */
  getWeakTopicsAnalysis(subjectsData = []) {
    const weakModules = [];

    subjectsData.forEach((subject) => {
      subject.modules.forEach((mod) => {
        const modState = this.getModuleState(mod.id);
        const prog = this.getModuleProgress(mod);
        const assessment = (mod.capsule && mod.capsule.assessment) || {};

        // Contar preguntas actualmente incorrectas en la cápsula
        let currentWrongQuiz = 0;
        (assessment.multipleChoice || []).forEach((q) => {
          const sel = modState.assessment.mc[q.id];
          if (sel !== undefined && sel !== q.correctIndex) currentWrongQuiz += 1;
        });
        (assessment.trueFalse || []).forEach((q) => {
          const sel = modState.assessment.tf[q.id];
          if (sel !== undefined && sel !== q.answer) currentWrongQuiz += 1;
        });

        // Secciones marcadas con baja comprensión
        const weakSections = Object.entries(modState.sectionComprehension || {}).filter(
          ([, lvl]) => lvl === 'not_understood' || lvl === 'needs_review'
        ).length;

        const historicalMistakes = (modState.errorLog && modState.errorLog.totalMistakes) || 0;
        const fcLapses = (modState.errorLog && modState.errorLog.flashcardLapses) || 0;

        // Puntaje de fragilidad / prioridad de refuerzo
        let fragilityScore =
          currentWrongQuiz * 25 +
          historicalMistakes * 10 +
          fcLapses * 12 +
          weakSections * 15 +
          (prog.comprehension === 'not_understood' ? 40 : prog.comprehension === 'needs_review' ? 25 : 0);

        if (fragilityScore > 0) {
          const reasons = [];
          if (prog.comprehension === 'not_understood') reasons.push('Marcado como "No comprendido"');
          else if (prog.comprehension === 'needs_review') reasons.push('Marcado como "Necesito repasar"');
          if (currentWrongQuiz > 0) reasons.push(`${currentWrongQuiz} reactivo(s) con error activo`);
          if (historicalMistakes > 0) reasons.push(`${historicalMistakes} fallo(s) acumulados al practicar`);
          if (fcLapses > 0) reasons.push(`${fcLapses} flashcard(s) olvidada(s)`);
          if (weakSections > 0) reasons.push(`${weakSections} sección(es) por reforzar`);

          weakModules.push({
            subject,
            module: mod,
            prog,
            fragilityScore,
            currentWrongQuiz,
            historicalMistakes,
            fcLapses,
            weakSections,
            reasons
          });
        }
      });
    });

    return weakModules.sort((a, b) => b.fragilityScore - a.fragilityScore);
  },

  /**
   * Motor de Recomendación Inteligente: sugiere qué estudiar basado en progreso y rendimiento previo
   */
  getSmartRecommendations(subjectsData = []) {
    const recommendations = [];
    const weakTopics = this.getWeakTopicsAnalysis(subjectsData);
    const allCards = this.getAllFlashcardsWithSRS(subjectsData);
    const dueCards = allCards.filter((c) => !c.isNew && c.isDue);
    const newCards = allCards.filter((c) => c.isNew);
    const { lastBookmark } = this.getBookmarks();

    // 1. Prioridad Crítica: Tema con mayor índice de errores o no comprendido
    if (weakTopics.length > 0) {
      const topWeak = weakTopics[0];
      recommendations.push({
        type: 'weak_topic',
        priorityBadge: 'Prioridad 1 · Refuerzo de errores',
        priorityColor: 'danger',
        title: `Reforzar: ${topWeak.module.title} (${topWeak.subject.name})`,
        reason: topWeak.reasons.join(' · '),
        ctaText: 'Corregir errores en cápsula',
        moduleId: topWeak.module.id,
        tab: topWeak.currentWrongQuiz > 0 ? 'assessment' : 'review'
      });
    }

    // 2. Prioridad Repetición Espaciada: Tarjetas vencidas hoy
    if (dueCards.length > 0) {
      recommendations.push({
        type: 'srs_due',
        priorityBadge: 'Prioridad 2 · Repetición Espaciada',
        priorityColor: 'warning',
        title: `Tienes ${dueCards.length} flashcard(s) programadas para repasar hoy`,
        reason: 'Repasar justo antes de olvidar consolida la memoria a largo plazo.',
        ctaText: 'Iniciar sesión SRS',
        hubSubtab: 'srs'
      });
    } else if (newCards.length > 0) {
      recommendations.push({
        type: 'srs_new',
        priorityBadge: 'Memoria Activa · Flashcards',
        priorityColor: 'accent',
        title: `Aprender ${Math.min(5, newCards.length)} nuevas flashcards del temario`,
        reason: `Tienes ${newCards.length} tarjetas disponibles para incorporar a tu repetición espaciada.`,
        ctaText: 'Practicar flashcards',
        hubSubtab: 'srs'
      });
    }

    // 3. Prioridad Continuidad: Marcador guardado o módulo en progreso
    if (lastBookmark) {
      recommendations.push({
        type: 'bookmark',
        priorityBadge: 'Continuar donde te quedaste',
        priorityColor: 'accent',
        title: `${lastBookmark.subjectName}: ${lastBookmark.moduleTitle}`,
        reason: `Marcador activo en "${lastBookmark.sectionLabel}".`,
        ctaText: 'Retomar marcador',
        moduleId: lastBookmark.moduleId,
        tab: lastBookmark.tab || 'guided',
        sectionId: lastBookmark.sectionId || 'top'
      });
    } else {
      // Buscar un módulo en progreso o el primer módulo no iniciado
      let inProgMod = null;
      let nextUnstarted = null;

      for (const subject of subjectsData) {
        for (const mod of subject.modules) {
          const prog = this.getModuleProgress(mod);
          if (!inProgMod && prog.status === 'in_progress') {
            inProgMod = { subject, mod, prog };
          }
          if (!nextUnstarted && prog.status === 'not_started') {
            nextUnstarted = { subject, mod, prog };
          }
        }
      }

      if (inProgMod) {
        recommendations.push({
          type: 'in_progress',
          priorityBadge: 'En progreso (' + inProgMod.prog.percent + '%)',
          priorityColor: 'warning',
          title: `Completar: ${inProgMod.mod.title} (${inProgMod.subject.name})`,
          reason: 'Ya comenzaste esta cápsula; termínala para asegurar el tema.',
          ctaText: 'Continuar cápsula',
          moduleId: inProgMod.mod.id,
          tab: 'guided'
        });
      } else if (nextUnstarted) {
        recommendations.push({
          type: 'next_step',
          priorityBadge: 'Siguiente paso sugerido',
          priorityColor: 'success',
          title: `Comenzar: ${nextUnstarted.mod.title} (${nextUnstarted.subject.name})`,
          reason: `Tiempo estimado: ${nextUnstarted.mod.estimatedMinutes || 30} min.`,
          ctaText: 'Empezar cápsula',
          moduleId: nextUnstarted.mod.id,
          tab: 'guided'
        });
      }
    }

    return recommendations;
  },

  /**
   * Genera una rutina de Repaso Diario Automático combinando:
   * - Hasta 5 flashcards urgentes / vencidas
   * - Hasta 4 preguntas del banco (priorizando preguntas falladas o no respondidas)
   * - El módulo prioritario recomendado del día
   */
  generateDailyWorkout(subjectsData = []) {
    const allCards = this.getAllFlashcardsWithSRS(subjectsData);
    const dueOrNewCards = allCards.filter((c) => c.isDue).slice(0, 5);

    const bank = this.getQuestionBank(subjectsData);
    const wrongQuestions = bank.filter((q) => q.answered && !q.isCorrect);
    const unansweredQuestions = bank.filter((q) => !q.answered);
    const dailyQuestions = [...wrongQuestions, ...unansweredQuestions, ...bank].slice(0, 4);

    const recs = this.getSmartRecommendations(subjectsData);
    const focusModule = recs.find((r) => r.moduleId) || null;

    return {
      cards: dueOrNewCards,
      questions: dailyQuestions,
      focusModule
    };
  },

  isModuleCompleted(moduleId, moduleObj = null) {
    if (moduleObj) {
      return this.getModuleProgress(moduleObj).isCompleted;
    }
    const modState = this.getModuleState(moduleId);
    return Boolean(modState.manualCompleted);
  },

  toggleModuleCompleted(moduleId) {
    let nextCompleted = false;
    this.updateModuleState(moduleId, (mod) => {
      nextCompleted = !mod.manualCompleted;
      mod.manualCompleted = nextCompleted;
      mod.opened = true;
      if (nextCompleted) {
        READING_SECTIONS.forEach((sec) => {
          mod.readSections[sec] = true;
        });
        if (mod.comprehension === 'unrated') {
          mod.comprehension = 'understood';
        }
        this.appendHistory(mod, 'Cápsula marcada como completada ✓', '100% de avance registrado.');
      } else {
        this.appendHistory(mod, 'Cápsula reabierta para estudio', 'Se desmarcó el estado completado.');
      }
      return mod;
    });
    return nextCompleted;
  },

  resetAll() {
    localStorage.removeItem(LEGACY_KEY);
    localStorage.removeItem('unam_estudio_general_exams_v1');
    localStorage.removeItem('unam_estudio_assistant_v1');
    this.saveState(createDefaultGlobalState());
  }
};
