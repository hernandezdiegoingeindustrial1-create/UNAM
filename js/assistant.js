/**
 * Asistente de Estudio Inteligente por Módulo (js/assistant.js).
 *
 * Capacidades integradas para cada cápsula de aprendizaje:
 * 1. Resumir contenido (adaptado al nivel del estudiante)
 * 2. Explicar conceptos difíciles (desglose paso a paso, analogía y trampa a evitar)
 * 3. Generar preguntas dinámicas nuevas con retroalimentación interactiva
 * 4. Crear ejemplos nuevos contextualizados al módulo
 * 5. Adaptar todas las explicaciones según el nivel del estudiante:
 *    - 'basico'     (🌱 Desde cero / lenguaje sencillo y analogías cotidianas)
 *    - 'intermedio' (🚀 Enfoque Examen UNAM / palabras clave y reactivos)
 *    - 'avanzado'   (🎓 Dominio profundo / rigor técnico y casos límite)
 */

(function () {
  const ASSISTANT_STORAGE_KEY = 'unam_estudio_assistant_v1';

  const LEVEL_META = {
    basico: {
      id: 'basico',
      label: '🌱 Básico (Desde cero)',
      shortLabel: 'Básico',
      desc: 'Explicaciones con palabras sencillas, analogías cotidianas y cero tecnicismos innecesarios.'
    },
    intermedio: {
      id: 'intermedio',
      label: '🚀 Intermedio (Enfoque Examen UNAM)',
      shortLabel: 'Intermedio UNAM',
      desc: 'Directo a lo que pregunta la UNAM: pistas rápidas, palabras clave y descarte de distractores.'
    },
    avanzado: {
      id: 'avanzado',
      label: '🎓 Avanzado (Dominio profundo)',
      shortLabel: 'Avanzado',
      desc: 'Rigor conceptual, relaciones con otros módulos, excepciones a la regla y retos de alto nivel.'
    }
  };

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function loadAssistantStore() {
    try {
      const raw = localStorage.getItem(ASSISTANT_STORAGE_KEY);
      if (!raw) return { levelByModule: {}, chatsByModule: {}, questionCursor: {} };
      const parsed = JSON.parse(raw);
      return {
        levelByModule: parsed.levelByModule || {},
        chatsByModule: parsed.chatsByModule || {},
        questionCursor: parsed.questionCursor || {}
      };
    } catch (_) {
      return { levelByModule: {}, chatsByModule: {}, questionCursor: {} };
    }
  }

  function saveAssistantStore(store) {
    try {
      localStorage.setItem(ASSISTANT_STORAGE_KEY, JSON.stringify(store));
    } catch (_) {
      // Ignorar errores de cuota
    }
  }

  function getStudentLevel(moduleObj) {
    const store = loadAssistantStore();
    if (store.levelByModule[moduleObj.id]) {
      return store.levelByModule[moduleObj.id];
    }
    // Sugerencia automática inicial según el progreso y comprensión del estudiante
    if (window.StudyStorage) {
      const prog = window.StudyStorage.getModuleProgress(moduleObj);
      if (prog.comprehension === 'not_understood' || prog.totalMistakes >= 2) {
        return 'basico';
      }
      if (prog.isCompleted && prog.comprehension === 'understood') {
        return 'avanzado';
      }
    }
    return 'intermedio';
  }

  function setStudentLevel(moduleId, level) {
    const store = loadAssistantStore();
    store.levelByModule[moduleId] = level;
    saveAssistantStore(store);
  }

  function getChatHistory(moduleId) {
    const store = loadAssistantStore();
    return store.chatsByModule[moduleId] || [];
  }

  function appendChatMessage(moduleId, msgObj) {
    const store = loadAssistantStore();
    const list = store.chatsByModule[moduleId] || [];
    list.push({
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      timestamp: new Date().toISOString(),
      ...msgObj
    });
    store.chatsByModule[moduleId] = list.slice(-30);
    saveAssistantStore(store);
  }

  function clearChatHistory(moduleId) {
    const store = loadAssistantStore();
    delete store.chatsByModule[moduleId];
    saveAssistantStore(store);
  }

  function nextCursor(moduleId, key, maxLen) {
    if (!maxLen || maxLen <= 0) return 0;
    const store = loadAssistantStore();
    const mapKey = `${moduleId}:${key}`;
    const current = store.questionCursor[mapKey] || 0;
    store.questionCursor[mapKey] = (current + 1) % maxLen;
    saveAssistantStore(store);
    return current % maxLen;
  }

  /* ==========================================================================
     1. GENERADOR: RESUMIR CONTENIDO SEGÚN EL NIVEL DEL ESTUDIANTE
     ========================================================================== */

  function generateSummary(subject, mod, level) {
    const cap = mod.capsule || {};
    const intro = cap.introduction || {};
    const funds = cap.fundamentals || [];
    const takeaways = cap.keyTakeaways || [];
    const exec = cap.executiveSummary || {};
    const dive = (cap.deepDive && cap.deepDive[0]) || {};

    if (level === 'basico') {
      return {
        title: `🌱 Resumen Sencillo (Desde Cero): ${mod.title}`,
        levelBadge: LEVEL_META.basico.shortLabel,
        bodyHtml: `
          <p><strong>En pocas palabras:</strong> ${escapeHtml(intro.overview)}</p>
          <div class="assistant-callout">
            <strong>💡 La imagen mental para entenderlo fácil:</strong><br>
            ${escapeHtml(dive.analogy || exec.synthesis)}
          </div>
          <p><strong>Las ${funds.length} piezas básicas que debes conocer:</strong></p>
          <ul class="assistant-list">
            ${funds
              .map(
                (f) =>
                  `<li><strong>${escapeHtml(f.term)}:</strong> ${escapeHtml(f.keyIdea)}</li>`
              )
              .join('')}
          </ul>
          <p style="font-size:0.82rem; color:var(--text-muted);">
            <em>Consejo para empezar:</em> No intentes memorizar todo de golpe; quédate primero con la diferencia entre ${escapeHtml(funds[0] ? funds[0].term : 'el concepto base')} y ${escapeHtml(funds[1] ? funds[1].term : 'su aplicación')}.
          </p>
        `,
        noteText: `[Resumen Básico - ${mod.title}] ${exec.synthesis}`
      };
    }

    if (level === 'avanzado') {
      return {
        title: `🎓 Síntesis Técnica y Conexiones: ${mod.title}`,
        levelBadge: LEVEL_META.avanzado.shortLabel,
        bodyHtml: `
          <p><strong>Síntesis estructural:</strong> ${escapeHtml(exec.synthesis)}</p>
          <p><strong>Articulación teórica y criterios de discriminación:</strong></p>
          <ul class="assistant-list">
            ${funds
              .map(
                (f) =>
                  `<li><strong>[${escapeHtml(f.category)}] ${escapeHtml(f.term)}:</strong> ${escapeHtml(f.definition)} <em>(Criterio: ${escapeHtml(f.keyIdea)})</em></li>`
              )
              .join('')}
          </ul>
          <div class="assistant-callout">
            <strong>🔗 Conexión interdisciplinaria y secuencial:</strong><br>
            ${escapeHtml(intro.connectionNote)}
          </div>
          <p><strong>Puntos críticos de alta precisión:</strong></p>
          <ul class="assistant-list">
            ${(exec.mustRemember || []).map((m) => `<li>${escapeHtml(m)}</li>`).join('')}
          </ul>
        `,
        noteText: `[Síntesis Avanzada - ${mod.title}] ${(exec.mustRemember || []).join(' | ')}`
      };
    }

    // Nivel Intermedio (Enfoque Examen UNAM)
    return {
      title: `🚀 Resumen Estratégico para Examen UNAM: ${mod.title}`,
      levelBadge: LEVEL_META.intermedio.shortLabel,
      bodyHtml: `
        <p><strong>¿Cómo se evalúa en el examen?:</strong> ${escapeHtml(intro.whyItMatters)}</p>
        <p><strong>Reglas rápidas para responder en menos de 30 segundos:</strong></p>
        <ul class="assistant-list">
          ${takeaways
            .map(
              (t) =>
                `<li><span class="takeaway-badge" style="font-size:0.7rem;">${escapeHtml(t.badge)}</span> ${escapeHtml(t.text)}</li>`
            )
            .join('')}
        </ul>
        <div class="assistant-callout">
          <strong>★ Imprescindibles de memoria:</strong>
          <ul class="assistant-list" style="margin-top:0.35rem;">
            ${(exec.mustRemember || []).map((m) => `<li>${escapeHtml(m)}</li>`).join('')}
          </ul>
        </div>
      `,
      noteText: `[Resumen UNAM - ${mod.title}] ${(exec.mustRemember || []).join(' | ')}`
    };
  }

  /* ==========================================================================
     2. GENERADOR: EXPLICAR CONCEPTOS DIFÍCILES SEGÚN EL NIVEL
     ========================================================================== */

  function generateConceptExplanation(subject, mod, level, customQuery = '') {
    const cap = mod.capsule || {};
    const funds = cap.fundamentals || [];
    const mistakes = cap.commonMistakes || [];
    const dives = cap.deepDive || [];

    // Buscar si la consulta del usuario coincide con algún concepto específico
    let targetFund = null;
    if (customQuery) {
      const q = customQuery.toLowerCase();
      targetFund = funds.find(
        (f) =>
          f.term.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q) ||
          f.definition.toLowerCase().includes(q)
      );
    }
    if (!targetFund && funds.length > 0) {
      const idx = nextCursor(mod.id, 'concept', funds.length);
      targetFund = funds[idx];
    }

    const mistake = mistakes[0] || {
      confusion: 'Confundir términos similares del módulo.',
      whyItHappens: 'Por lectura rápida del reactivo.',
      howToAvoid: 'Identifica la palabra clave antes de mirar los incisos.'
    };
    const dive = dives[0] || {};

    if (!targetFund) {
      return generateSummary(subject, mod, level);
    }

    if (level === 'basico') {
      return {
        title: `🌱 Explicación paso a paso sin tecnicismos: "${targetFund.term}"`,
        levelBadge: LEVEL_META.basico.shortLabel,
        bodyHtml: `
          <p><strong>1. ¿Qué es en lenguaje sencillo?</strong><br>
          Imagina que <strong>${escapeHtml(targetFund.term)}</strong> (dentro de <em>${escapeHtml(targetFund.category)}</em>) significa simplemente esto: ${escapeHtml(targetFund.definition)}</p>

          <div class="assistant-callout">
            <strong>2. Analogía de la vida diaria:</strong><br>
            ${escapeHtml(dive.analogy || targetFund.keyIdea)}
          </div>

          <p><strong>3. La frase corta para no olvidarlo nunca:</strong><br>
          👉 <em>"${escapeHtml(targetFund.keyIdea)}"</em></p>
        `,
        noteText: `${targetFund.term}: ${targetFund.keyIdea}`
      };
    }

    if (level === 'avanzado') {
      return {
        title: `🎓 Análisis Conceptual Profundo: "${targetFund.term}"`,
        levelBadge: LEVEL_META.avanzado.shortLabel,
        bodyHtml: `
          <p><strong>Definición rigurosa (${escapeHtml(targetFund.category)}):</strong><br>
          ${escapeHtml(targetFund.definition)}</p>

          <p><strong>Mecanismo y aplicación crítica:</strong><br>
          ${escapeHtml(dive.explanation || targetFund.keyIdea)}</p>

          <div class="assistant-callout">
            <strong>⚠️ Distinción fina (Trampa de alto nivel):</strong><br>
            No debe confundirse en el caso de: <em>${escapeHtml(mistake.confusion)}</em>.<br>
            <strong>Criterio de desempate:</strong> ${escapeHtml(mistake.howToAvoid)}
          </div>
        `,
        noteText: `[Análisis ${targetFund.term}] ${targetFund.definition} | Evitar: ${mistake.confusion}`
      };
    }

    // Nivel Intermedio (UNAM)
    return {
      title: `🚀 Desglose de Concepto Difícil: "${targetFund.term}"`,
      levelBadge: LEVEL_META.intermedio.shortLabel,
      bodyHtml: `
        <p><strong>Definición clave:</strong> ${escapeHtml(targetFund.definition)}</p>
        <p><strong>¿Cómo reconocerlo al instante en un reactivo?:</strong><br>
        Busca esta pista: <strong>${escapeHtml(targetFund.keyIdea)}</strong></p>

        <div class="assistant-callout">
          <strong>🚫 El error que el 70% comete en este tema:</strong><br>
          ${escapeHtml(mistake.confusion)}<br>
          <strong>Cómo blindarte:</strong> ${escapeHtml(mistake.howToAvoid)}
        </div>
      `,
      noteText: `${targetFund.term} -> Pista de examen: ${targetFund.keyIdea}`
    };
  }

  /* ==========================================================================
     3. GENERADOR: CREAR EJEMPLOS NUEVOS ADAPTADOS AL NIVEL
     ========================================================================== */

  function generateNewExample(subject, mod, level) {
    const cap = mod.capsule || {};
    const dives = cap.deepDive || [];
    const worked = cap.workedExamples || [];
    const funds = cap.fundamentals || [];

    const diveIdx = nextCursor(mod.id, 'exampleDive', Math.max(1, dives.length));
    const workedIdx = nextCursor(mod.id, 'exampleWorked', Math.max(1, worked.length));

    const dive = dives[diveIdx] || {};
    const ex = worked[workedIdx] || {};
    const fund = funds[diveIdx % Math.max(1, funds.length)] || {};

    if (level === 'basico') {
      return {
        title: `🌱 Ejemplo Cotidiano Guiado: ${mod.title}`,
        levelBadge: LEVEL_META.basico.shortLabel,
        bodyHtml: `
          <p><strong>Situación en la vida real:</strong><br>
          ${escapeHtml(dive.realWorldCase || dive.practicalExample)}</p>

          <div class="assistant-callout">
            <strong>Paso a paso para conectarlo con el concepto (${escapeHtml(fund.term || mod.title)}):</strong>
            <ol class="worked-steps" style="margin-top:0.4rem;">
              <li>Observamos la situación: <em>${escapeHtml(dive.practicalExample || ex.problem)}</em></li>
              <li>Aplicamos la idea clave: <strong>${escapeHtml(fund.keyIdea || ex.answer)}</strong></li>
              <li>Conclusión sencilla: ${escapeHtml(ex.reasoning || dive.analogy)}</li>
            </ol>
          </div>
        `,
        noteText: `[Ejemplo cotidiano - ${mod.title}] ${dive.practicalExample || ex.problem}`
      };
    }

    if (level === 'avanzado') {
      return {
        title: `🎓 Caso Aplicado de Nivel Examen / Razonamiento: ${ex.title || mod.title}`,
        levelBadge: LEVEL_META.avanzado.shortLabel,
        bodyHtml: `
          <p><strong>Planteamiento del caso:</strong><br>
          ${escapeHtml(ex.problem || dive.practicalExample)}</p>
          <p><strong>Demostración y cadena deductiva:</strong></p>
          <ol class="worked-steps">
            ${(ex.steps || [dive.explanation, dive.practicalExample])
              .map((s) => `<li>${escapeHtml(s)}</li>`)
              .join('')}
          </ol>
          <div class="assistant-callout">
            <strong>Conclusión rigurosa:</strong> ${escapeHtml(ex.answer || fund.term)}<br>
            <strong>Justificación teórica:</strong> ${escapeHtml(ex.reasoning || dive.realWorldCase)}
          </div>
        `,
        noteText: `[Caso resuelto - ${mod.title}] ${ex.problem} -> ${ex.answer}`
      };
    }

    // Nivel Intermedio
    return {
      title: `🚀 Ejemplo Práctico Tipo Reactivo UNAM: ${mod.title}`,
      levelBadge: LEVEL_META.intermedio.shortLabel,
      bodyHtml: `
        <p><strong>Ejemplo directo de aplicación:</strong><br>
        ${escapeHtml(dive.practicalExample || ex.problem)}</p>

        <div class="assistant-callout">
          <strong>Resolución modelo paso a paso (${escapeHtml(ex.title || 'Caso tipo examen')}):</strong>
          <p style="margin: 0.35rem 0;"><em>Problema:</em> ${escapeHtml(ex.problem)}</p>
          <ol class="worked-steps">
            ${(ex.steps || []).map((s) => `<li>${escapeHtml(s)}</li>`).join('')}
          </ol>
          <p style="margin-top:0.45rem;"><strong>✓ Respuesta:</strong> ${escapeHtml(ex.answer)} <em>(${escapeHtml(ex.reasoning)})</em></p>
        </div>
      `,
      noteText: `[Ejemplo UNAM - ${mod.title}] ${dive.practicalExample}`
    };
  }

  /* ==========================================================================
     4. GENERADOR: GENERAR PREGUNTAS DINÁMICAS SEGÚN EL NIVEL
     ========================================================================== */

  function generateDynamicQuestion(subject, mod, level) {
    const cap = mod.capsule || {};
    const funds = cap.fundamentals || [];
    const mistakes = cap.commonMistakes || [];
    const mcList = (cap.assessment && cap.assessment.multipleChoice) || [];
    const cards = cap.flashcards || [];

    const pool = [];

    // Preguntas generadas desde los conceptos fundamentales
    funds.forEach((f, idx) => {
      const other1 = funds[(idx + 1) % funds.length] || { term: 'Concepto secundario', keyIdea: 'No aplica en este caso.' };
      const other2 = funds[(idx + 2) % funds.length] || { term: 'Excepción', keyIdea: 'Corresponde a otro bloque.' };

      if (level === 'basico') {
        pool.push({
          question: `[Nivel Básico] ¿Cuál es la idea principal que describe a "${f.term}"?`,
          options: [f.keyIdea, other1.keyIdea, other2.keyIdea],
          correctIndex: 0,
          feedback: `¡Correcto! "${f.term}" se resume como: ${f.keyIdea}`
        });
      } else if (level === 'avanzado') {
        pool.push({
          question: `[Nivel Avanzado] Dentro de la categoría "${f.category}", ¿qué concepto se define formalmente como: "${f.definition}"?`,
          options: [other1.term, f.term, other2.term, 'Ninguno de los anteriores'],
          correctIndex: 1,
          feedback: `¡Exacto! La definición corresponde con precisión a ${f.term} (${f.keyIdea}).`
        });
      } else {
        pool.push({
          question: `[Tipo Examen UNAM] Si en un reactivo de ${subject.name} identificas la pista "${f.keyIdea}", ¿qué opción debes elegir?`,
          options: [other1.term, other2.term, f.term],
          correctIndex: 2,
          feedback: `¡Acertaste! Esa pista apunta directamente a ${f.term}.`
        });
      }
    });

    // Preguntas generadas desde errores comunes (excelentes para nivel intermedio y avanzado)
    mistakes.forEach((m) => {
      pool.push({
        question: `[Pregunta Antitrampas] Para no caer en el error común de "${m.confusion}", ¿qué regla debes aplicar?`,
        options: [
          m.howToAvoid,
          m.whyItHappens,
          'Elegir siempre el primer inciso sin verificar el contexto.'
        ],
        correctIndex: 0,
        feedback: `¡Bien blindado! ${m.howToAvoid}`
      });
    });

    // Preguntas del banco y flashcards transformadas
    mcList.forEach((mc) => {
      pool.push({
        question: mc.question,
        options: mc.options,
        correctIndex: mc.correctIndex,
        feedback: mc.feedback
      });
    });

    cards.forEach((fc) => {
      pool.push({
        question: `[Reto de Memoria Activa] ${fc.front}`,
        options: [
          fc.back,
          funds[0] ? funds[0].definition : 'No tiene relación con este proceso.',
          'Ninguna de las anteriores.'
        ],
        correctIndex: 0,
        feedback: `¡Correcto! Respuesta: ${fc.back}`
      });
    });

    const chosenIdx = nextCursor(mod.id, `dynQ_${level}`, pool.length);
    const q = pool[chosenIdx] || pool[0];
    const qUid = 'astq-' + Date.now();

    return {
      title: `🎯 Pregunta Generada (${LEVEL_META[level].shortLabel})`,
      levelBadge: LEVEL_META[level].shortLabel,
      questionData: {
        uid: qUid,
        ...q,
        selected: null
      },
      bodyHtml: `<p>Pon a prueba tu comprensión respondiendo este reactivo generado para tu nivel actual:</p>`,
      noteText: `[Pregunta de práctica - ${mod.title}] ${q.question} -> Respuesta: ${q.options[q.correctIndex]}`
    };
  }

  /* ==========================================================================
     5.INTÉRPRETE DE CONSULTA LIBRE DEL ESTUDIANTE EN EL CHAT
     ========================================================================== */

  function processFreePrompt(subject, mod, level, rawPrompt) {
    const clean = String(rawPrompt || '').trim();
    const lower = clean.toLowerCase();

    if (lower.includes('resum') || lower.includes('sintetiz') || lower.includes('puntos clave')) {
      return generateSummary(subject, mod, level);
    }
    if (lower.includes('pregunta') || lower.includes('evalua') || lower.includes('examen') || lower.includes('quiz')) {
      return generateDynamicQuestion(subject, mod, level);
    }
    if (lower.includes('ejemplo') || lower.includes('caso') || lower.includes('paso a paso') || lower.includes('ejercicio')) {
      return generateNewExample(subject, mod, level);
    }
    // Por defecto explica el concepto consultado adaptándolo al nivel
    return generateConceptExplanation(subject, mod, level, clean);
  }

  /* ==========================================================================
     RENDERIZADO DEL PANEL DEL ASISTENTE DENTRO DE LA CÁPSULA
     ========================================================================== */

  function renderMessageBubble(msg) {
    if (msg.role === 'user') {
      return `
        <div class="assistant-msg assistant-msg-user">
          <div class="assistant-msg-bubble user-bubble">
            ${escapeHtml(msg.text)}
          </div>
        </div>
      `;
    }

    // Si el mensaje incluye una pregunta interactiva generada por el asistente
    let interactiveQuizHtml = '';
    if (msg.questionData) {
      const q = msg.questionData;
      const hasAnswered = q.selected !== null && q.selected !== undefined;
      const isCorrect = hasAnswered && q.selected === q.correctIndex;

      const optsHtml = (q.options || [])
        .map((opt, idx) => {
          let cls = '';
          if (hasAnswered) {
            if (idx === q.correctIndex) cls = 'selected-correct';
            else if (idx === q.selected) cls = 'selected-wrong';
          }
          return `
            <button
              type="button"
              class="quiz-option-btn ${cls}"
              data-ast-action="answer-generated-q"
              data-msg-id="${msg.id}"
              data-opt-idx="${idx}"
            >
              ${String.fromCharCode(65 + idx)}) ${escapeHtml(opt)}
            </button>
          `;
        })
        .join('');

      interactiveQuizHtml = `
        <div class="quiz-card" style="margin-top: 0.65rem; background-color: var(--bg-surface);">
          <p class="quiz-question-text">${escapeHtml(q.question)}</p>
          <div class="quiz-options">${optsHtml}</div>
          ${
            hasAnswered
              ? `<div class="quiz-feedback ${isCorrect ? 'correct' : 'wrong'}">
                   <strong>${isCorrect ? '&#10003; ¡Excelente!' : '&#10007; Revisa la explicación:'}</strong>
                   ${escapeHtml(q.feedback)}
                 </div>`
              : ''
          }
        </div>
      `;
    }

    return `
      <div class="assistant-msg assistant-msg-bot">
        <div class="assistant-msg-bubble bot-bubble">
          <div class="assistant-msg-header">
            <strong>${escapeHtml(msg.title || 'Asistente de Estudio')}</strong>
            <span class="badge-subtle">${escapeHtml(msg.levelBadge || '')}</span>
          </div>
          <div class="assistant-msg-content">
            ${msg.bodyHtml || ''}
            ${interactiveQuizHtml}
          </div>
          ${
            msg.noteText
              ? `<div class="assistant-msg-footer">
                   <button
                     type="button"
                     class="btn-save-concept"
                     data-ast-action="save-to-notes"
                     data-note-text="${escapeHtml(msg.noteText)}"
                   >
                     &#128221; Guardar en mis notas del módulo
                   </button>
                 </div>`
              : ''
          }
        </div>
      </div>
    `;
  }

  function buildAssistantSectionHtml(subject, mod) {
    const currentLevel = getStudentLevel(mod);
    const levelInfo = LEVEL_META[currentLevel] || LEVEL_META.intermedio;
    const history = getChatHistory(mod.id);
    const funds = (mod.capsule && mod.capsule.fundamentals) || [];

    const conceptButtonsHtml = funds
      .map(
        (f) => `
        <button
          type="button"
          class="chip"
          style="font-size: 0.76rem; padding: 0.25rem 0.65rem;"
          data-ast-action="explain-specific-concept"
          data-concept-term="${escapeHtml(f.term)}"
        >
          Explicar: ${escapeHtml(f.term)}
        </button>
      `
      )
      .join('');

    const welcomeHtml =
      history.length === 0
        ? `<div class="assistant-welcome">
             <p>
               👋 <strong>¡Hola! Soy tu Asistente de Estudio para "${escapeHtml(mod.title)}".</strong><br>
               Actualmente estoy ajustado al nivel <strong>${escapeHtml(levelInfo.label)}</strong>: <em>${escapeHtml(levelInfo.desc)}</em>
             </p>
             <p style="margin-top: 0.4rem; font-size: 0.85rem; color: var(--text-secondary);">
               Elige una acción rápida abajo, selecciona un concepto difícil o escríbeme cualquier duda sobre este módulo:
             </p>
           </div>`
        : '';

    return `
      <section class="capsule-section assistant-panel" id="cap-sec-assistant">
        <header class="capsule-section-header">
          <div>
            <h2 class="capsule-section-title">
              <span class="section-number-badge">&#129302;</span>
              Asistente de Estudio del Módulo
            </h2>
            <p style="font-size: 0.83rem; color: var(--text-muted); margin-top: 0.15rem;">
              Resume, explica conceptos difíciles, crea ejemplos nuevos y genera preguntas adaptadas a tu nivel.
            </p>
          </div>

          ${
            history.length > 0
              ? `<button type="button" class="btn-link-subtle" data-ast-action="clear-chat">
                   Limpiar conversación
                 </button>`
              : ''
          }
        </header>

        <!-- 5. Selector de Nivel del Estudiante -->
        <div class="assistant-level-bar">
          <div>
            <span class="comprehension-selector-label">Nivel de explicación del asistente:</span>
            <p style="font-size: 0.76rem; color: var(--text-muted);">${escapeHtml(levelInfo.desc)}</p>
          </div>
          <div class="assistant-level-pills" role="group" aria-label="Seleccionar nivel del estudiante">
            <button
              type="button"
              class="comp-btn ${currentLevel === 'basico' ? 'active-understood' : ''}"
              data-ast-action="set-level"
              data-level="basico"
            >
              &#127793; Básico (Desde cero)
            </button>
            <button
              type="button"
              class="comp-btn ${currentLevel === 'intermedio' ? 'active-needs_review' : ''}"
              data-ast-action="set-level"
              data-level="intermedio"
            >
              &#128640; Intermedio (UNAM)
            </button>
            <button
              type="button"
              class="comp-btn ${currentLevel === 'avanzado' ? 'active-not_understood' : ''}"
              data-ast-action="set-level"
              data-level="avanzado"
            >
              &#127891; Avanzado (Profundo)
            </button>
          </div>
        </div>

        <!-- Botones de Acción Rápida del Asistente -->
        <div class="assistant-quick-actions">
          <button type="button" class="btn btn-secondary" data-ast-action="run-tool" data-tool="summarize">
            &#128221; Resumir contenido
          </button>
          <button type="button" class="btn btn-secondary" data-ast-action="run-tool" data-tool="explain">
            &#128269; Explicar concepto difícil
          </button>
          <button type="button" class="btn btn-secondary" data-ast-action="run-tool" data-tool="example">
            &#128161; Crear ejemplo nuevo
          </button>
          <button type="button" class="btn btn-primary" data-ast-action="run-tool" data-tool="question">
            &#127919; Generar pregunta
          </button>
        </div>

        <!-- Píldoras directas para explicar cada concepto fundamental del módulo -->
        <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem;">
          ${conceptButtonsHtml}
        </div>

        <!-- Historial de respuestas del Asistente -->
        <div class="assistant-chat-feed" id="assistant-chat-feed">
          ${welcomeHtml}
          ${history.map((msg) => renderMessageBubble(msg)).join('')}
        </div>

        <!-- Barra de consulta libre -->
        <div class="assistant-input-row">
          <input
            type="text"
            id="assistant-prompt-input"
            class="search-input"
            style="flex: 1;"
            placeholder="Pregúntale al asistente (ej. 'Explícame ${escapeHtml(funds[0] ? funds[0].term : 'este tema')}', 'Dame otro ejemplo', 'Hazme una pregunta')..."
          >
          <button type="button" class="btn btn-primary" data-ast-action="send-prompt">
            Preguntar al asistente &rarr;
          </button>
        </div>
      </section>
    `;
  }

  /* ==========================================================================
     API Pública de window.StudyAssistant
     ========================================================================== */

  window.StudyAssistant = {
    buildAssistantSectionHtml,

    handleAction(action, targetEl, containerEl, subject, mod, onRefreshCapsule) {
      const level = getStudentLevel(mod);

      if (action === 'set-level') {
        const nextLevel = targetEl.dataset.level || 'intermedio';
        setStudentLevel(mod.id, nextLevel);
        appendChatMessage(mod.id, {
          role: 'bot',
          title: `Nivel ajustado a: ${LEVEL_META[nextLevel].label}`,
          levelBadge: LEVEL_META[nextLevel].shortLabel,
          bodyHtml: `<p>${escapeHtml(LEVEL_META[nextLevel].desc)} Pídeme un resumen, explicación, ejemplo o pregunta y lo adaptaré a este nivel.</p>`
        });
        onRefreshCapsule();
        return true;
      }

      if (action === 'run-tool') {
        const tool = targetEl.dataset.tool;
        let response = null;
        let userLabel = '';

        if (tool === 'summarize') {
          userLabel = `Resumir el módulo en nivel ${LEVEL_META[level].shortLabel}`;
          response = generateSummary(subject, mod, level);
        } else if (tool === 'explain') {
          userLabel = `Explicar un concepto difícil en nivel ${LEVEL_META[level].shortLabel}`;
          response = generateConceptExplanation(subject, mod, level);
        } else if (tool === 'example') {
          userLabel = `Crear un ejemplo nuevo en nivel ${LEVEL_META[level].shortLabel}`;
          response = generateNewExample(subject, mod, level);
        } else if (tool === 'question') {
          userLabel = `Generar una pregunta de práctica (${LEVEL_META[level].shortLabel})`;
          response = generateDynamicQuestion(subject, mod, level);
        }

        if (response) {
          appendChatMessage(mod.id, { role: 'user', text: userLabel });
          appendChatMessage(mod.id, { role: 'bot', ...response });
          onRefreshCapsule();
          scrollToBottomFeed(containerEl);
        }
        return true;
      }

      if (action === 'explain-specific-concept') {
        const term = targetEl.dataset.conceptTerm || '';
        appendChatMessage(mod.id, {
          role: 'user',
          text: `Explícame el concepto "${term}" en nivel ${LEVEL_META[level].shortLabel}`
        });
        const response = generateConceptExplanation(subject, mod, level, term);
        appendChatMessage(mod.id, { role: 'bot', ...response });
        onRefreshCapsule();
        scrollToBottomFeed(containerEl);
        return true;
      }

      if (action === 'send-prompt') {
        const inputEl = containerEl.querySelector('#assistant-prompt-input');
        const text = inputEl ? inputEl.value.trim() : '';
        if (!text) return true;

        appendChatMessage(mod.id, { role: 'user', text });
        const response = processFreePrompt(subject, mod, level, text);
        appendChatMessage(mod.id, { role: 'bot', ...response });
        onRefreshCapsule();
        scrollToBottomFeed(containerEl);
        return true;
      }

      if (action === 'answer-generated-q') {
        const msgId = targetEl.dataset.msgId;
        const optIdx = Number(targetEl.dataset.optIdx);
        const store = loadAssistantStore();
        const list = store.chatsByModule[mod.id] || [];
        const msg = list.find((m) => m.id === msgId);
        if (msg && msg.questionData) {
          msg.questionData.selected = optIdx;
          const isCorrect = optIdx === msg.questionData.correctIndex;
          saveAssistantStore(store);

          if (window.StudyStorage) {
            const modState = window.StudyStorage.getModuleState(mod.id);
            window.StudyStorage.recordQuestionAttempt(
              modState,
              `ast:${msgId}`,
              isCorrect,
              msg.questionData.question
            );
            window.StudyStorage.appendHistory(
              modState,
              isCorrect ? 'Pregunta del asistente acertada 🤖' : 'Error en pregunta del asistente 🤖',
              msg.questionData.question.slice(0, 45)
            );
            const fullState = window.StudyStorage.loadState();
            fullState.modules[mod.id] = modState;
            window.StudyStorage.saveState(fullState);
          }
          onRefreshCapsule();
        }
        return true;
      }

      if (action === 'save-to-notes') {
        const noteText = targetEl.dataset.noteText || '';
        if (noteText && window.StudyStorage) {
          window.StudyStorage.addNoteEntry(mod.id, noteText, 'Asistente de Estudio');
          onRefreshCapsule();
        }
        return true;
      }

      if (action === 'clear-chat') {
        clearChatHistory(mod.id);
        onRefreshCapsule();
        return true;
      }

      return false;
    }
  };

  function scrollToBottomFeed(containerEl) {
    setTimeout(() => {
      const feed = containerEl.querySelector('#assistant-chat-feed');
      if (feed) {
        feed.scrollTop = feed.scrollHeight;
      }
    }, 40);
  }
})();
