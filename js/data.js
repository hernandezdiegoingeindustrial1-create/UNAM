/**
 * Catálogo modular de Materias y Cápsulas de Aprendizaje.
 *
 * Cada módulo es una cápsula completa con las 10 secciones pedagógicas:
 * 1. Introducción al tema (overview, whyItMatters, connectionNote + relations)
 * 2. Conceptos fundamentales (fundamentals)
 * 3. Desarrollo del contenido (deepDive: explicación, ejemplo, caso real, analogía)
 * 4. Puntos clave para recordar (keyTakeaways)
 * 5. Errores comunes (commonMistakes: confusión, causa, cómo evitarlo)
 * 6. Ejemplos resueltos (workedExamples: problema, pasos, respuesta, razonamiento)
 * 7. Autoevaluación (assessment: multipleChoice, trueFalse, openReflection)
 * 8. Resumen ejecutivo (executiveSummary: synthesis, mustRemember)
 * 9. Tarjetas de estudio / Flashcards (flashcards: front, back)
 * 10. Indicadores de progreso (estimatedMinutes + estado/porcentaje gestionado en storage.js)
 */

window.STUDY_DATA = [
  /* ==========================================================================
     MATERIA 1: ESPAÑOL
     ========================================================================== */
  {
    id: 'espanol',
    code: 'ESP',
    name: 'Español',
    area: 'Lengua y Comunicación',
    description: 'Funciones de la lengua, formas del discurso, comprensión lectora, gramática y ortografía.',
    modules: [
      {
        id: 'esp-1',
        title: 'Funciones de la lengua',
        summary: 'Identificación de la intención comunicativa: referencial, apelativa, poética, emotiva, fática y metalingüística.',
        estimatedMinutes: 25,
        relations: {
          prevModuleId: null,
          nextModuleId: 'esp-2',
          relatedConcepts: ['Circuito del habla', 'Intención comunicativa', 'Formas del discurso']
        },
        capsule: {
          introduction: {
            overview: 'Siempre que hablamos o escribimos lo hacemos con un propósito específico: informar un hecho, convencer a alguien, expresar un sentimiento o embellecer el lenguaje. A estos propósitos primordiales del emisor se les denomina funciones de la lengua (formuladas por Roman Jakobson).',
            whyItMatters: 'Es el primer tema del temario oficial de la UNAM y suele aparecer en los primeros 2 o 3 reactivos de Español. Dominarlo te permite identificar de inmediato la intención de cualquier fragmento textual.',
            connectionNote: 'Se conecta directamente con el Módulo 2 (Formas del discurso): la función referencial suele apoyarse en la descripción o narración informativa, mientras que la función apelativa es el corazón del texto argumentativo.'
          },
          fundamentals: [
            {
              term: 'Función Referencial',
              category: 'Contexto / Realidad',
              definition: 'Transmite información objetiva, verificable y sin opiniones personales sobre la realidad.',
              keyIdea: 'Informa hechos, datos, fechas o fenómenos científicos.'
            },
            {
              term: 'Función Apelativa (Conativa)',
              category: 'Receptor / Oyente',
              definition: 'Busca influir en la conducta o pensamiento del receptor mediante órdenes, ruegos, preguntas o persuasión.',
              keyIdea: 'Convence, ordena, aconseja o invita a actuar.'
            },
            {
              term: 'Función Poética (Estética)',
              category: 'Mensaje / Forma',
              definition: 'Se centra en la belleza, ritmo y figuras retóricas con que se construye el mensaje.',
              keyIdea: 'Importa más cómo se dice que el dato literal.'
            },
            {
              term: 'Función Emotiva (Sintomática)',
              category: 'Emisor / Hablante',
              definition: 'Exterioriza estados de ánimo, emociones, deseos o juicios subjetivos de quien habla.',
              keyIdea: 'Usa primera persona, interjecciones y exclamaciones.'
            },
            {
              term: 'Función Fática y Metalingüística',
              category: 'Canal y Código',
              definition: 'La fática abre, comprueba o cierra el canal ("¿Bueno?"); la metalingüística explica el propio idioma.',
              keyIdea: 'Canal = Fática; Definiciones gramaticales = Metalingüística.'
            }
          ],
          deepDive: [
            {
              subtitle: 'Las 3 funciones prioritarias en el examen (Referencial, Apelativa y Poética)',
              explanation: 'Aunque existen seis funciones en el modelo de Jakobson, los reactivos de admisión se concentran principalmente en distinguir cuándo un texto informa objetivamente (referencial), cuándo intenta persuadir o dar una instrucción (apelativa) y cuándo emplea lenguaje figurado o literario (poética).',
              practicalExample: 'Comparación sobre el mismo tema (el agua): 1) "El agua hierve a 100 °C a nivel del mar" (Referencial). 2) "Cierra la llave mientras te cepillas los dientes" (Apelativa). 3) "El agua es el espejo líquido donde duerme la luna" (Poética).',
              realWorldCase: 'En un periódico conviven las tres: una noticia sobre inflación usa función referencial; un anuncio comercial o editorial político usa función apelativa; el suplemento cultural de poesía emplea función poética.',
              analogy: 'Piensa en la ropa que eliges según la ocasión: la función referencial es una bata de laboratorio (exacta y neutra), la apelativa es el traje de un vendedor o entrenador (busca moverte a la acción) y la poética es un vestuario artístico de gala.'
            },
            {
              subtitle: 'Cómo distinguir Emotiva de Poética y Fática de Metalingüística',
              explanation: 'Tanto la función emotiva como la poética pueden hablar de sentimientos, pero la emotiva es un desahogo directo ("¡Qué tristeza siento hoy!"), mientras que la poética transforma las palabras mediante metáforas ("Llora mi alma en la tarde gris"). Por otro lado, la función fática solo verifica que la línea de comunicación funcione, y la metalingüística habla del lenguaje usando el lenguaje mismo.',
              practicalExample: 'Fática: "¿Me escuchas bien? Sí, adelante". Metalingüística: "Los verbos copulativos son ser, estar y parecer".',
              realWorldCase: 'Cuando consultas un diccionario o un manual de ortografía estás leyendo textos con función metalingüística dominante.',
              analogy: 'La función fática es tocar el micrófono y decir "probando, 1, 2, 3"; la metalingüística es leer el manual de instrucciones del idioma.'
            }
          ],
          keyTakeaways: [
            { badge: 'Verbos en imperativo', text: 'Si el fragmento contiene órdenes, sugerencias, vocativos o segunda persona ("haz", "compra", "vota", "recuerda"), predomina la función apelativa.' },
            { badge: 'Datos y tercera persona', text: 'Si presenta cifras, fechas, leyes científicas o definiciones enciclopédicas sin adjetivos valorativos, es función referencial.' },
            { badge: 'Metáforas y refranes', text: 'Los poemas, refranes populares y figuras retóricas activan siempre la función poética.' },
            { badge: 'Predominio, no exclusividad', text: 'Un texto puede tener varias funciones, pero en el examen siempre se pregunta por la que predomina.' }
          ],
          commonMistakes: [
            {
              confusion: 'Confundir función Poética con función Emotiva en frases literarias.',
              whyItHappens: 'Porque un poema suele expresar amor, dolor o nostalgia, lo que hace pensar erróneamente en "emociones".',
              howToAvoid: 'Pregúntate si hay lenguaje figurado (metáforas, imágenes, ritmo). Si hay artificio literario, la respuesta siempre es Poética, no Emotiva.'
            },
            {
              confusion: 'Marcar función Referencial en una definición gramatical.',
              whyItHappens: 'Porque una regla ortográfica parece un dato informativo.',
              howToAvoid: 'Si el dato explica el significado de una palabra, una categoría gramatical o una regla de la lengua española, es específicamente Metalingüística.'
            }
          ],
          workedExamples: [
            {
              title: 'Reactivo tipo examen: Identificación en texto breve',
              problem: '¿Qué función de la lengua predomina en el siguiente fragmento?\n"Hombre cohete y también golondrina, araña en vela que hila con luna su tela."',
              steps: [
                'Analizar el vocabulario: "hombre cohete", "golondrina", "hila con luna su tela".',
                'Reconocer que no informa un hecho científico (descarta referencial) ni da una orden al lector (descarta apelativa).',
                'Observar el uso de metáforas e imágenes rítmicas que embellecen el mensaje.'
              ],
              answer: 'Función poética (o estética).',
              reasoning: 'El autor transforma el lenguaje ordinario mediante metáforas y ritmo musical, centrando la atención en la forma estética del mensaje.'
            },
            {
              title: 'Reactivo tipo examen: Intención persuasiva',
              problem: 'Identifica la función de la lengua en: "Cuida tu futuro: ahorra al menos el 10 % de tus ingresos mensuales desde hoy".',
              steps: [
                'Localizar los verbos principales: "Cuida" y "ahorra" están conjugados en modo imperativo.',
                'Detectar el receptor implícito ("tú") al que se intenta dirigir su conducta.'
              ],
              answer: 'Función apelativa.',
              reasoning: 'El enunciado exhorta directamente al receptor a realizar una acción concreta (ahorrar).'
            }
          ],
          assessment: {
            multipleChoice: [
              {
                id: 'esp1-mc1',
                question: '¿Qué función de la lengua predomina en: "La revolución industrial se inició en Inglaterra durante la segunda mitad del siglo XVIII"?',
                options: ['Apelativa', 'Poética', 'Referencial', 'Metalingüística'],
                correctIndex: 2,
                feedback: 'Es Referencial porque expone un hecho histórico objetivo, verificable y en tercera persona.'
              },
              {
                id: 'esp1-mc2',
                question: 'Selecciona el enunciado donde predomina la función apelativa:',
                options: [
                  '¡Qué alegría volver a caminar por estas calles!',
                  'No estaciones tu vehículo frente a la rampa de emergencia.',
                  'El adjetivo modifica directamente al sustantivo.',
                  'Sus ojos eran dos luceros encendidos en la niebla.'
                ],
                correctIndex: 1,
                feedback: '"No estaciones..." da una orden directa al receptor para regular su conducta, rasgo esencial de la función apelativa.'
              }
            ],
            trueFalse: [
              {
                id: 'esp1-tf1',
                statement: 'En el enunciado "¡Bueno! ¿Me oyes? Se corta la llamada", predomina la función fática.',
                answer: true,
                feedback: 'Correcto. Su única finalidad es verificar que el canal telefónico siga abierto entre emisor y receptor.'
              },
              {
                id: 'esp1-tf2',
                statement: 'Los refranes populares son ejemplos primordiales de la función referencial.',
                answer: false,
                feedback: 'Falso. Los refranes emplean rima, ritmo y sentido figurado, por lo que pertenecen a la función poética (y en ocasiones apelativa por su consejo moral).'
              }
            ],
            openReflection: [
              {
                id: 'esp1-or1',
                prompt: 'Escribe tres oraciones breves sobre el examen de ingreso: una con función referencial, una con apelativa y otra con emotiva.',
                guideAnswer: 'Ejemplo esperado:\n• Referencial: "El examen consta de 120 reactivos de opción múltiple."\n• Apelativa: "Organiza tu calendario y repasa todos los días."\n• Emotiva: "¡Me entusiasma mucho entrar a la universidad!"'
              }
            ]
          },
          executiveSummary: {
            synthesis: 'Las funciones de la lengua revelan la intención del hablante: informar la realidad (referencial), mover al receptor a actuar (apelativa), crear belleza verbal (poética), expresar sentimientos propios (emotiva), probar el canal (fática) o explicar el idioma (metalingüística).',
            mustRemember: [
              'Referencial = Hechos objetivos y datos.',
              'Apelativa = Órdenes, ruegos, publicidad y persuasión.',
              'Poética = Metáforas, literatura y refranes.',
              'Metalingüística = El lenguaje explicando al lenguaje.'
            ]
          },
          flashcards: [
            {
              id: 'esp1-fc1',
              front: '¿Cuál es la palabra clave para recordar la función Referencial?',
              back: 'Informar objetivamente sobre el contexto o la realidad (datos, hechos, ciencia).'
            },
            {
              id: 'esp1-fc2',
              front: '¿Qué modo verbal es el indicador más claro de la función Apelativa?',
              back: 'El modo imperativo (órdenes, mandatos, invitaciones o ruegos dirigidos a un "tú" o "ustedes").'
            },
            {
              id: 'esp1-fc3',
              front: '¿Cómo distingues la función Poética de la Emotiva?',
              back: 'La Poética usa figuras retóricas y lenguaje figurado para embellecer el mensaje; la Emotiva expresa directamente el estado de ánimo del hablante.'
            }
          ]
        }
      },
      {
        id: 'esp-2',
        title: 'Formas del discurso',
        summary: 'Reconocimiento de textos descriptivos, narrativos y argumentativos en fragmentos de examen.',
        estimatedMinutes: 25,
        relations: {
          prevModuleId: 'esp-1',
          nextModuleId: 'esp-3',
          relatedConcepts: ['Función apelativa', 'Estructura textual', 'Tesis y argumentos']
        },
        capsule: {
          introduction: {
            overview: 'Las formas del discurso son los modos fundamentales en que un autor organiza sus ideas para presentar la realidad: contando sucesos en el tiempo (narración), detallando cómo es algo o alguien (descripción) o defendiendo una postura mediante razones (argumentación).',
            whyItMatters: 'En el examen siempre se presenta un texto largo acompañado de preguntas sobre qué modo discursivo predomina en determinado párrafo o en la totalidad de la lectura.',
            connectionNote: 'Retoma la intención comunicativa del Módulo 1 (Funciones de la lengua) y prepara la base para analizar la estructura de lectura en el Módulo 3.'
          },
          fundamentals: [
            {
              term: 'Discurso Narrativo',
              category: 'Acción en el tiempo',
              definition: 'Relata una sucesión de acciones realizadas por personajes en un tiempo y espacio determinados.',
              keyIdea: 'Predominan los verbos de acción (corrió, decidió, descubrió) y conectores temporales.'
            },
            {
              term: 'Discurso Descriptivo',
              category: 'Cualidades en el espacio',
              definition: 'Representa lingüísticamente la imagen de un objeto, persona, paisaje o proceso detallando sus partes y propiedades.',
              keyIdea: 'Predominan los adjetivos calificativos y verbos estáticos o copulativos (era, tenía, lucía).'
            },
            {
              term: 'Discurso Argumentativo',
              category: 'Razonamiento y Tesis',
              definition: 'Expone razones, pruebas y juicios lógicos para defender una tesis y persuadir al receptor.',
              keyIdea: 'Predominan conectores causales y adversativos (porque, por lo tanto, sin embargo, en conclusión).'
            }
          ],
          deepDive: [
            {
              subtitle: 'La pista gramatical: Verbos de acción vs. Adjetivos vs. Conectores lógicos',
              explanation: 'El método más rápido y seguro para no dudar en el examen consiste en observar la categoría de palabras que domina el fragmento. Si el texto avanza como una película donde ocurren hechos uno tras otro, es narrativo. Si el tiempo "se congela" como una fotografía para enumerar rasgos físicos o psicológicos, es descriptivo. Si el autor opina y justifica el "porqué" de una idea, es argumentativo.',
              practicalExample: 'Narrativo: "Abrió la puerta con cautela, cruzó el pasillo y apagó la lámpara". Descriptivo: "La habitación era estrecha, húmeda y de paredes amarillentas". Argumentativo: "Es indispensable reducir el uso de plásticos porque tardan siglos en degradarse".',
              realWorldCase: 'En una novela se combinan la narración (lo que hacen los protagonistas) y la descripción (cómo es el escenario). En un ensayo académico o artículo de opinión domina la argumentación.',
              analogy: 'La narración es un video en movimiento; la descripción es una fotografía en alta resolución; la argumentación es un abogado presentando pruebas ante un jurado.'
            }
          ],
          keyTakeaways: [
            { badge: 'Narración', text: 'Responde a "¿Qué pasó?". Tiene planteamiento, nudo y desenlace.' },
            { badge: 'Descripción', text: 'Responde a "¿Cómo es?". Abundan adjetivos, enumeraciones y detalles sensoriales.' },
            { badge: 'Argumentación', text: 'Responde a "¿Qué opina el autor y por qué?". Consta de tesis, argumentos y conclusión.' }
          ],
          commonMistakes: [
            {
              confusion: 'Confundir un texto descriptivo con uno narrativo cuando aparece en una novela.',
              whyItHappens: 'Por asumir que todo fragmento literario o de cuento es automáticamente narrativo.',
              howToAvoid: 'Revisa si los verbos indican cambio de acción en el tiempo o solo retratan cómo luce un personaje o lugar. Si no avanza el tiempo, es descriptivo.'
            }
          ],
          workedExamples: [
            {
              title: 'Identificación del modo discursivo por sus marcas lingüísticas',
              problem: '¿Qué forma del discurso predomina en: "La educación a distancia no sustituye por completo la convivencia presencial, ya que el aprendizaje también requiere el desarrollo de habilidades socioemocionales que surgen en el aula"?',
              steps: [
                'Identificar la postura (tesis): "La educación a distancia no sustituye por completo la convivencia presencial".',
                'Localizar el conector causal "ya que", el cual introduce la razón o justificación.',
                'Confirmar que busca defender un punto de vista razonado.'
              ],
              answer: 'Argumentación.',
              reasoning: 'Presenta una tesis acompañada de una premisa justificativa introducida por el nexo causal "ya que".'
            }
          ],
          assessment: {
            multipleChoice: [
              {
                id: 'esp2-mc1',
                question: 'En un fragmento donde abundan los adjetivos calificativos y se detallan las características físicas de un mineral, predomina la forma del discurso:',
                options: ['Narrativa', 'Argumentativa', 'Descriptiva', 'Dialogada'],
                correctIndex: 2,
                feedback: 'La descripción se caracteriza por enumerar cualidades, propiedades y rasgos mediante adjetivos.'
              },
              {
                id: 'esp2-mc2',
                question: '¿Cuáles son los tres elementos estructurales de un texto argumentativo?',
                options: [
                  'Inicio, clímax y desenlace',
                  'Tesis, argumentos y conclusión',
                  'Sujeto, verbo y predicado',
                  'Hipótesis, observación y retrato'
                ],
                correctIndex: 1,
                feedback: 'Todo texto argumentativo plantea una postura (tesis), la sostiene con razones (argumentos) y cierra con una síntesis derivada (conclusión).'
              }
            ],
            trueFalse: [
              {
                id: 'esp2-tf1',
                statement: 'En el discurso narrativo predominan los verbos en pretérito que expresan acciones sucesivas.',
                answer: true,
                feedback: 'Correcto. Los verbos de acción en pasado o presente histórico hacen avanzar el relato en el tiempo.'
              }
            ],
            openReflection: [
              {
                id: 'esp2-or1',
                prompt: 'Si tuvieras que transformar la frase descriptiva "El bosque estaba oscuro y silencioso" en una frase narrativa, ¿cómo la redactarías?',
                guideAnswer: 'Agregando una acción en el tiempo: "Los excursionistas se adentraron en el bosque cuando cayó la noche y guardaron silencio al escuchar un ruido."'
              }
            ]
          },
          executiveSummary: {
            synthesis: 'Las tres formas del discurso se distinguen por su propósito y categoría gramatical dominante: la narración relata hechos sucesivos (verbos de acción), la descripción detalla rasgos (adjetivos) y la argumentación defiende una tesis (conectores lógicos).',
            mustRemember: [
              'Narración = Sucesos en el tiempo (¿Qué ocurrió?).',
              'Descripción = Características y cualidades (¿Cómo es?).',
              'Argumentación = Tesis + razones para convencer (¿Por qué?).'
            ]
          },
          flashcards: [
            {
              id: 'esp2-fc1',
              front: '¿Qué categoría gramatical predomina en el discurso descriptivo?',
              back: 'Los adjetivos calificativos y los verbos copulativos o de estado (ser, estar, parecer, tener).'
            },
            {
              id: 'esp2-fc2',
              front: '¿Qué es la "tesis" dentro de un discurso argumentativo?',
              back: 'Es la postura o idea central que el autor sostiene y pretende demostrar a lo largo del texto.'
            }
          ]
        }
      },
      {
        id: 'esp-3',
        title: 'Comprensión de lectura y estructura del texto',
        summary: 'Ideas principales, secundarias, inferencias y secuencia lógica de un texto.',
        estimatedMinutes: 30,
        relations: {
          prevModuleId: 'esp-2',
          nextModuleId: 'esp-4',
          relatedConcepts: ['Idea principal', 'Inferencia', 'Coherencia textual']
        },
        capsule: {
          introduction: {
            overview: 'La comprensión lectora evalúa tu capacidad para extraer información literal, sintetizar la idea vertebral de cada párrafo y deducir conclusiones implícitas a partir de las pistas del autor.',
            whyItMatters: 'Representa entre el 30 % y el 40 % de los reactivos de Español y es indispensable para entender los enunciados de todas las demás materias del examen.',
            connectionNote: 'Aplica lo aprendido en Funciones de la lengua (Módulo 1) y Formas del discurso (Módulo 2) sobre lecturas completas.'
          },
          fundamentals: [
            {
              term: 'Idea Principal',
              category: 'Núcleo semántico',
              definition: 'Enunciado que sintetiza la afirmación más importante de un párrafo o texto; sin ella, el texto pierde sentido.',
              keyIdea: 'Es autónoma y engloba a las demás oraciones.'
            },
            {
              term: 'Ideas Secundarias',
              category: 'Soporte y detalle',
              definition: 'Oraciones que ejemplifican, comparan, detallan o reiteran la idea principal.',
              keyIdea: 'Si las suprimes mentalmente, la idea central sigue intacta.'
            },
            {
              term: 'Inferencia',
              category: 'Lectura implícita',
              definition: 'Deducción lógica que obtiene el lector a partir de los datos del texto, aunque no esté escrita palabra por palabra.',
              keyIdea: 'Se deduce estrictamente del texto, sin inventar suposiciones externas.'
            }
          ],
          deepDive: [
            {
              subtitle: 'Técnica de supresión para hallar la Idea Principal',
              explanation: 'Cuando tengas duda entre dos opciones en el examen, aplica la prueba de supresión: elimina ejemplos introducidos por "como", "por ejemplo", fechas accesorias, paréntesis y comparaciones. Lo que queda —el sujeto temático más lo que se afirma esencialmente de él— es la idea principal.',
              practicalExample: 'En un párrafo que explica qué es la inflación y luego menciona cuánto subió el pan y la leche en 1994, la idea principal es el concepto y mecanismo de la inflación; los precios del pan y la leche son ideas secundarias ejemplificativas.',
              realWorldCase: 'Al hacer un resumen ejecutivo o subrayar un libro de texto para estudiar, solo debes subrayar las ideas principales.',
              analogy: 'La idea principal es el tronco del árbol; las ideas secundarias son las ramas y hojas que lo visten.'
            }
          ],
          keyTakeaways: [
            { badge: 'Lee primero las preguntas', text: 'Dar un vistazo rápido a las preguntas antes de leer el texto largo enfoca tu atención exactamente en los párrafos clave.' },
            { badge: 'Cuidado con los distractores absolutos', text: 'Desconfía de opciones con palabras extremas ("siempre", "nunca", "únicamente") si el autor no fue así de tajante en la lectura.' }
          ],
          commonMistakes: [
            {
              confusion: 'Responder con conocimientos previos en lugar de lo que dice el texto.',
              whyItHappens: 'A veces el tema del texto nos resulta familiar y elegimos una opción verdadera en la realidad, pero que el autor jamás mencionó.',
              howToAvoid: 'Cíñete 100 % a la evidencia del texto: "según el autor...", "de acuerdo con el tercer párrafo...".'
            }
          ],
          workedExamples: [
            {
              title: 'Distinción entre idea principal e idea secundaria',
              problem: 'Lee el fragmento: "Los murciélagos cumplen un rol ecológico insustituible en los ecosistemas tropicales. Por ejemplo, dispersan las semillas de cientos de árboles frutales y polinizan plantas como el agave. Además, una sola colonia puede consumir toneladas de insectos plaga cada noche." ¿Cuál es la idea principal?',
              steps: [
                'Observar la segunda y tercera oración: inician con "Por ejemplo" y "Además", dando casos específicos (semillas, agave, insectos).',
                'Reconocer que ambas oraciones solo ejemplifican la afirmación inicial.'
              ],
              answer: 'Los murciélagos cumplen un rol ecológico insustituible en los ecosistemas tropicales.',
              reasoning: 'Es el enunciado general que abarca tanto la polinización como el control de plagas.'
            }
          ],
          assessment: {
            multipleChoice: [
              {
                id: 'esp3-mc1',
                question: '¿Qué función cumplen las ideas secundarias dentro de un párrafo?',
                options: [
                  'Sustituir la tesis del autor por un tema distinto',
                  'Ejemplificar, ampliar, explicar o respaldar la idea principal',
                  'Introducir únicamente conclusiones finales',
                  'Eliminar el sujeto temático de la lectura'
                ],
                correctIndex: 1,
                feedback: 'Las ideas secundarias desarrollan la idea principal mediante ejemplos, datos complementarios o comparaciones.'
              }
            ],
            trueFalse: [
              {
                id: 'esp3-tf1',
                statement: 'Una inferencia válida puede contradecir los datos explícitos del texto siempre que suene lógica.',
                answer: false,
                feedback: 'Falso. Toda inferencia válida debe derivarse directamente de las premisas e indicios presentes en la lectura.'
              }
            ],
            openReflection: [
              {
                id: 'esp3-or1',
                prompt: '¿Qué pregunta clave te haces al terminar de leer un párrafo para identificar su idea central?',
                guideAnswer: '¿De qué o de quién se habla en este párrafo y qué es lo más importante que se afirma sobre ello?'
              }
            ]
          },
          executiveSummary: {
            synthesis: 'Comprender un texto implica distinguir su columna vertebral (idea principal) de sus ejemplos de apoyo (ideas secundarias) y deducir información implícita (inferencias) basándose fielmente en el texto.',
            mustRemember: [
              'Idea principal = Tema + afirmación esencial (sin ejemplos).',
              'Ideas secundarias = Ejemplos, estadísticas de apoyo y reiteraciones.',
              'Inferencia = Conclusión lógica deducida de las pistas del texto.'
            ]
          },
          flashcards: [
            {
              id: 'esp3-fc1',
              front: '¿Qué prueba rápida permite separar la idea principal de las secundarias?',
              back: 'Suprimir mentalmente todo lo que vaya después de "por ejemplo", "como", "es decir" o datos estadísticos particulares.'
            },
            {
              id: 'esp3-fc2',
              front: '¿Qué es una pregunta de nivel inferencial en lectura?',
              back: 'Aquella cuya respuesta no aparece copiada textualmente, sino que debe deducirse relacionando las ideas del texto.'
            }
          ]
        }
      },
      {
        id: 'esp-4',
        title: 'Gramática, redacción y ortografía',
        summary: 'Estructura de la oración (sujeto, predicado y complementos), acentuación y signos de puntuación.',
        estimatedMinutes: 35,
        relations: {
          prevModuleId: 'esp-3',
          nextModuleId: null,
          relatedConcepts: ['Núcleo del sujeto', 'Objeto directo e indirecto', 'Leyes de acentuación']
        },
        capsule: {
          introduction: {
            overview: 'La gramática estudia cómo se articulan las palabras en oraciones (sujeto, predicado y sus modificadores), mientras que la ortografía y la redacción garantizan la precisión, claridad y corrección del texto escrito.',
            whyItMatters: 'Cerca de la mitad del examen de Español pregunta directamente por el núcleo del sujeto/predicado, objeto directo/indirecto, homófonos (b/v, c/s/z) y reglas de acentuación.',
            connectionNote: 'Cierra el bloque de Español brindándote las herramientas formales para analizar cualquier oración al detalle.'
          },
          fundamentals: [
            {
              term: 'Sujeto y su Núcleo (NS)',
              category: 'Sintaxis',
              definition: 'El sujeto es de quien se habla en la oración y concuerda en número y persona con el verbo. Su núcleo (NS) es siempre un sustantivo o palabra sustantivada.',
              keyIdea: 'El sujeto NUNCA empieza con preposición ("a", "para", "con", "en").'
            },
            {
              term: 'Objeto Directo (OD) e Indirecto (OI)',
              category: 'Modificadores del Predicado',
              definition: 'El OD recibe directamente la acción del verbo (sustituible por lo, la, los, las). El OI es el destinatario beneficiado o perjudicado (sustituible por le, les).',
              keyIdea: 'OD = lo/la/los/las; OI = le/les.'
            },
            {
              term: 'Reglas Generales de Acentuación',
              category: 'Ortografía',
              definition: 'Agudas llevan tilde si terminan en n, s o vocal; graves si NO terminan en n, s o vocal; esdrújulas y sobreesdrújulas siempre llevan tilde.',
              keyIdea: 'Recuerda la sigla SEGA (Sobreesdrújula, Esdrújula, Grave, Aguda) de izquierda a derecha.'
            }
          ],
          deepDive: [
            {
              subtitle: 'Método infalible para hallar Sujeto, OD, OI y Circunstancial',
              explanation: '1) Primero localiza el verbo conjugado (núcleo del predicado). 2) Cambia el verbo de singular a plural: la parte de la oración que te veas obligado a cambiar de número para que suene bien es el Sujeto. 3) Para el Objeto Directo pregunta "¿Qué + verbo + sujeto?" y comprueba cambiándolo por "lo/la/los/las". 4) Para el Objeto Indirecto comprueba cambiándolo por "le/les". 5) Para el Complemento Circunstancial pregunta "¿Dónde, cuándo, cómo, cuánto?".',
              practicalExample: 'En: "Los médicos entregaron las recetas a los pacientes ayer en la clínica". Verbo: entregaron. Sujeto: Los médicos (NS: médicos). OD: las recetas ("las entregaron"). OI: a los pacientes ("les entregaron las recetas"). CC de tiempo: ayer. CC de lugar: en la clínica.',
              realWorldCase: 'En redacción profesional, reconocer el sujeto evita errores de concordancia como "Hubieron muchos problemas" (incorrecto, pues "problemas" es OD del verbo impersonal "haber"; lo correcto es "Hubo muchos problemas").',
              analogy: 'En una obra de teatro: el Sujeto es el actor protagonista, el Verbo es la acción que realiza, el OD es el objeto que tiene en las manos, el OI es la persona del público a quien se lo entrega y el CC es la escenografía (hora y lugar).'
            }
          ],
          keyTakeaways: [
            { badge: 'Sustitución pronominal', text: 'No te fíes solo de preguntas ("¿a quién?"): confirma siempre el OD con LO/LA y el OI con LE/LES.' },
            { badge: 'Tilde diacrítica', text: 'Diferencia monosílabos de distinta función: él (pronombre) / el (artículo), tú (pronombre) / tu (posesivo), sé (saber/ser) / se (pronombre), más (cantidad) / mas (pero).' }
          ],
          commonMistakes: [
            {
              confusion: 'Creer que el Objeto Directo nunca lleva la preposición "a".',
              whyItHappens: 'Porque cuando el OD es una cosa no lleva preposición ("Compré un libro"), pero cuando es una persona o ser animado sí lleva "a" ("Visité a mi abuela").',
              howToAvoid: 'Sustituye por pronombre: "La visité" -> como acepta "la", "a mi abuela" es Objeto Directo, no Indirecto.'
            }
          ],
          workedExamples: [
            {
              title: 'Determinación del núcleo del sujeto y objeto directo',
              problem: 'En la oración "El nuevo director del hospital inauguró el laboratorio de genética", ¿cuál es el núcleo del sujeto y cuál el objeto directo?',
              steps: [
                'Localizar el verbo conjugado: "inauguró".',
                'Identificar el sujeto completo: "El nuevo director del hospital". La palabra principal de quien se habla (sustantivo central sin preposición) es "director".',
                'Preguntar qué fue lo inaugurado y sustituir por "lo": "el laboratorio de genética" -> "lo inauguró".'
              ],
              answer: 'Núcleo del sujeto: "director". Objeto directo: "el laboratorio de genética".',
              reasoning: '"Del hospital" es modificador indirecto porque inicia con la contracción preposicional "del"; "el laboratorio de genética" recibe la acción verbal y admite el pronombre "lo".'
            }
          ],
          assessment: {
            multipleChoice: [
              {
                id: 'esp4-mc1',
                question: 'En la oración "Las intensas lluvias de verano provocaron inundaciones en la avenida", el núcleo del sujeto es:',
                options: ['intensas', 'lluvias', 'verano', 'inundaciones'],
                correctIndex: 1,
                feedback: '"Lluvias" es el sustantivo central del sujeto "Las intensas lluvias de verano". "Intensas" es modificador directo y "de verano" modificador indirecto.'
              },
              {
                id: 'esp4-mc2',
                question: '¿Cuál de las siguientes series contiene únicamente palabras graves (llanas)?',
                options: [
                  'árbol, examen, carácter',
                  'canción, compás, café',
                  'brújula, médico, sílaba',
                  'reloj, pared, virtud'
                ],
                correctIndex: 0,
                feedback: 'Ár-bol, e-xa-men y ca-rác-ter tienen la sílaba tónica en la penúltima posición; "examen" no lleva tilde por terminar en "n", mientras que "árbol" y "carácter" sí la llevan por terminar en "l" y "r".'
              }
            ],
            trueFalse: [
              {
                id: 'esp4-tf1',
                statement: 'El sujeto tácito (o morfológico) es aquel que no está escrito explícitamente, pero se deduce por la terminación del verbo.',
                answer: true,
                feedback: 'Correcto. Por ejemplo, en "Llegamos temprano", el verbo indica primera persona del plural (nosotros).'
              }
            ],
            openReflection: [
              {
                id: 'esp4-or1',
                prompt: 'Explica por qué la palabra "examen" no lleva tilde en singular, pero "exámenes" sí la lleva en plural.',
                guideAnswer: '"Examen" (e-XA-men) es grave terminada en "n", por lo que no se tilda. Al pasar a plural ("e-XÁ-me-nes") agrega una sílaba y se convierte en esdrújula, y todas las esdrújulas llevan tilde.'
              }
            ]
          },
          executiveSummary: {
            synthesis: 'El análisis sintáctico parte siempre de ubicar el verbo conjugado para separar Sujeto (con su núcleo sustantivo) y Predicado (con OD, OI y CC). En ortografía, la clasificación SEGA y la tilde diacrítica resuelven la totalidad de los reactivos de acentuación.',
            mustRemember: [
              'Núcleo del Sujeto = Sustantivo principal sin preposición.',
              'Núcleo del Predicado = Verbo conjugado.',
              'OD = lo, la, los, las | OI = le, les.',
              'Agudas (n, s, vocal sí) | Graves (n, s, vocal no) | Esdrújulas (todas).'
            ]
          },
          flashcards: [
            {
              id: 'esp4-fc1',
              front: '¿Por qué pronombres se sustituye el Objeto Directo (OD)?',
              back: 'Por los pronombres átonos: lo, la, los, las.'
            },
            {
              id: 'esp4-fc2',
              front: '¿Cuándo llevan tilde las palabras graves o llanas?',
              back: 'Cuando su sílaba tónica es la penúltima y NO terminan en n, s ni vocal (ej. lápiz, cárcel, tórax).'
            }
          ]
        }
      }
    ]
  },

  /* ==========================================================================
     MATERIA 2: MATEMÁTICAS
     ========================================================================== */
  {
    id: 'matematicas',
    code: 'MAT',
    name: 'Matemáticas',
    area: 'Ciencias Exactas',
    description: 'Álgebra, ecuaciones, funciones, trigonometría y geometría analítica paso a paso.',
    modules: [
      {
        id: 'mat-1',
        title: 'Operaciones algebraicas, productos notables y factorización',
        summary: 'Leyes de los exponentes, radicales, binomios, factorización de trinomios y simplificación de fracciones.',
        estimatedMinutes: 35,
        relations: {
          prevModuleId: null,
          nextModuleId: 'mat-2',
          relatedConcepts: ['Leyes de exponentes', 'Diferencia de cuadrados', 'Trinomio cuadrado perfecto']
        },
        capsule: {
          introduction: {
            overview: 'El álgebra es el idioma universal de las matemáticas: permite generalizar operaciones aritméticas usando letras (variables) y transformar expresiones complejas en factores simples mediante productos notables y factorización.',
            whyItMatters: 'No solo aparecen de 3 a 4 reactivos directos de simplificación algebraica, sino que necesitas factorizar para resolver ecuaciones cuadráticas, funciones racionales, límites y derivadas.',
            connectionNote: 'Es el cimiento indispensable para el Módulo 2 (Ecuaciones y sistemas lineales) y el Módulo 3 (Funciones).'
          },
          fundamentals: [
            {
              term: 'Leyes de los Exponentes',
              category: 'Potenciación',
              definition: 'Al multiplicar bases iguales los exponentes se suman (aᵐ · aⁿ = aᵐ⁺ⁿ); al dividir se restan (aᵐ / aⁿ = aᵐ⁻ⁿ); en potencia de potencia se multiplican ((aᵐ)ⁿ = aᵐ·ⁿ).',
              keyIdea: 'Todo número distinto de cero elevado a la 0 vale 1 (a⁰ = 1), y a⁻ⁿ = 1 / aⁿ.'
            },
            {
              term: 'Productos Notables Clave',
              category: 'Multiplicación directa',
              definition: 'Binomio al cuadrado: (a ± b)² = a² ± 2ab + b². Binomios conjugados: (a + b)(a - b) = a² - b².',
              keyIdea: 'Un binomio al cuadrado SIEMPRE produce tres términos (Trinomio Cuadrado Perfecto).'
            },
            {
              term: 'Factorización',
              category: 'Proceso inverso',
              definition: 'Descomponer una suma o resta algebraica en una multiplicación de factores más simples (factor común, diferencia de cuadrados, trinomios x² + bx + c).',
              keyIdea: 'Para simplificar una fracción algebraica, primero factoriza numerador y denominador.'
            }
          ],
          deepDive: [
            {
              subtitle: 'Mapa mental para elegir el método de factorización en 5 segundos',
              explanation: 'Cuando veas una expresión algebraica en el examen, sigue este orden estricto: 1) ¿Todos los términos comparten una letra o divisor numérico? Usa Factor Común. 2) ¿Son solo 2 términos restándose y ambos tienen raíz cuadrada exacta (a² - b²)? Es Diferencia de Cuadrados: (a + b)(a - b). 3) ¿Son 3 términos de la forma x² + bx + c? Busca dos números que multiplicados den c y sumados den b.',
              practicalExample: 'Para simplificar (x² - 9) / (x² - x - 6): el numerador es diferencia de cuadrados (x + 3)(x - 3); el denominador busca dos números que multiplicados den -6 y sumados -1, que son -3 y +2: (x - 3)(x + 2). Cancelando (x - 3) queda (x + 3) / (x + 2).',
              realWorldCase: 'En física y cálculo, cuando al evaluar un límite obtienes la indeterminación 0/0, la factorización cancela el término que produce el cero.',
              analogy: 'Desarrollar un producto notable es armar un mueble a partir de sus cajas; factorizar es desarmar el mueble en sus piezas originales para poder guardarlo y transportarlo.'
            }
          ],
          keyTakeaways: [
            { badge: 'Prohibido cancelar sumandos', text: 'En una fracción como (x² + 4) / x, NO puedes cancelar la x porque arriba hay una suma. Solo se cancelan factores que multiplican a todo el numerador y denominador.' },
            { badge: 'Exponente fraccionario', text: 'La raíz enésima equivale a un exponente fraccionario: ⁿ√(aᵐ) = a^(m/n).' }
          ],
          commonMistakes: [
            {
              confusion: 'Escribir que (a + b)² es igual a a² + b².',
              whyItHappens: 'Por distribuir erróneamente el exponente cuadrado sobre una suma, olvidando el doble producto central.',
              howToAvoid: 'Recuerda siempre el término central "más/menos el doble del primero por el segundo": (a ± b)² = a² ± 2ab + b².'
            }
          ],
          workedExamples: [
            {
              title: 'Simplificación de fracción algebraica tipo examen',
              problem: 'Simplifica la expresión: (x² - 25) / (x² + 8x + 15)',
              steps: [
                'Factorizar el numerador (x² - 25): es una diferencia de cuadrados -> (x + 5)(x - 5).',
                'Factorizar el denominador (x² + 8x + 15): buscamos dos números que multiplicados den +15 y sumados den +8 -> +5 y +3, por lo que queda (x + 5)(x + 3).',
                'Dividir el factor común (x + 5) en numerador y denominador.'
              ],
              answer: '(x - 5) / (x + 3)',
              reasoning: 'Al expresar tanto el numerador como el denominador en forma de producto de binomios, el factor (x + 5) se simplifica a la unidad.'
            }
          ],
          assessment: {
            multipleChoice: [
              {
                id: 'mat1-mc1',
                question: 'Al desarrollar el binomio (2x - 3y)² se obtiene:',
                options: [
                  '4x² - 9y²',
                  '4x² - 6xy + 9y²',
                  '4x² - 12xy + 9y²',
                  '2x² - 12xy + 3y²'
                ],
                correctIndex: 2,
                feedback: 'El cuadrado del primero es (2x)² = 4x²; menos el doble del primero por el segundo: -2(2x)(3y) = -12xy; más el cuadrado del segundo: (-3y)² = +9y².'
              },
              {
                id: 'mat1-mc2',
                question: '¿Cuál es la factorización completa de 3x² - 12?',
                options: [
                  '3(x - 2)(x + 2)',
                  '3(x - 4)(x + 4)',
                  '(3x - 6)(x + 2)',
                  '3(x - 2)²'
                ],
                correctIndex: 0,
                feedback: 'Primero se extrae el factor común 3: 3(x² - 4). Luego se factoriza la diferencia de cuadrados (x² - 4) como (x - 2)(x + 2).'
              }
            ],
            trueFalse: [
              {
                id: 'mat1-tf1',
                statement: 'La expresión x⁻³ es equivalente a -3x.',
                answer: false,
                feedback: 'Falso. Un exponente negativo indica recíproco: x⁻³ = 1 / x³, nunca cambia el signo de la base.'
              }
            ],
            openReflection: [
              {
                id: 'mat1-or1',
                prompt: '¿Cómo compruebas rápidamente en el examen si tu factorización es correcta cuando olvidas la regla?',
                guideAnswer: 'Multiplicando las opciones de respuesta término a término o sustituyendo un valor numérico sencillo (por ejemplo x = 2) tanto en la expresión original como en las opciones.'
              }
            ]
          },
          executiveSummary: {
            synthesis: 'Las leyes de los exponentes, los productos notables y la factorización son las herramientas base para manipular cualquier expresión algebraica. Factorizar antes de cancelar es la regla de oro en fracciones algebraicas.',
            mustRemember: [
              '(a ± b)² = a² ± 2ab + b² (nunca olvides el ±2ab).',
              'a² - b² = (a + b)(a - b).',
              'aᵐ · aⁿ = aᵐ⁺ⁿ | a⁻ⁿ = 1/aⁿ | a^(m/n) = ⁿ√(aᵐ).'
            ]
          },
          flashcards: [
            {
              id: 'mat1-fc1',
              front: '¿A qué es igual el producto de binomios conjugados (a + b)(a - b)?',
              back: 'A una diferencia de cuadrados: a² - b².'
            },
            {
              id: 'mat1-fc2',
              front: '¿Cómo se factoriza un trinomio de la forma x² + bx + c?',
              back: 'En dos binomios (x + m)(x + n) tales que m · n = c (producto) y m + n = b (suma algebraica).'
            }
          ]
        }
      },
      {
        id: 'mat-2',
        title: 'Ecuaciones, desigualdades y sistemas lineales',
        summary: 'Ecuaciones de primer y segundo grado, discriminante, sistemas 2x2 e inecuaciones.',
        estimatedMinutes: 35,
        relations: {
          prevModuleId: 'mat-1',
          nextModuleId: 'mat-3',
          relatedConcepts: ['Fórmula general', 'Discriminante', 'Método de suma y resta']
        },
        capsule: {
          introduction: {
            overview: 'Resolver una ecuación o desigualdad significa encontrar el conjunto de valores de la incógnita que hacen verdadera la igualdad o relación de orden.',
            whyItMatters: 'En todo examen UNAM vienen problemas de planteo con ecuaciones lineales, raíces de una ecuación cuadrática, un sistema de ecuaciones 2x2 o 3x3 y el conjunto solución de una desigualdad.',
            connectionNote: 'Utiliza la factorización del Módulo 1 para hallar raíces cuadráticas y sienta las bases para el análisis de dominio en el Módulo 3.'
          },
          fundamentals: [
            {
              term: 'Ecuación Cuadrática (ax² + bx + c = 0)',
              category: 'Segundo grado',
              definition: 'Posee hasta dos soluciones reales que pueden obtenerse factorizando o mediante la fórmula general x = [-b ± √(b² - 4ac)] / 2a.',
              keyIdea: 'Si se puede factorizar en segundos, iguala cada factor a cero y despeja x.'
            },
            {
              term: 'El Discriminante (D = b² - 4ac)',
              category: 'Naturaleza de raíces',
              definition: 'La expresión dentro de la raíz cuadrada de la fórmula general determina cuántas soluciones reales tiene la ecuación.',
              keyIdea: 'D > 0: 2 reales distintas | D = 0: 1 real doble | D < 0: 0 reales (complejas).'
            },
            {
              term: 'Desigualdades Lineales',
              category: 'Intervalos',
              definition: 'Se despejan igual que una ecuación lineal, con una regla crítica: multiplicar o dividir entre un número negativo invierte el signo (< pasa a >).',
              keyIdea: '< o > usan paréntesis (abierto); ≤ o ≥ usan corchetes [cerrado].'
            }
          ],
          deepDive: [
            {
              subtitle: 'Truco de sustitución y método de reducción en sistemas 2x2',
              explanation: 'Para resolver un sistema de dos ecuaciones con dos incógnitas en tiempo récord tienes dos caminos: 1) Método de reducción (suma y resta): multiplica una ecuación para que los coeficientes de una variable queden con signo opuesto y súmalas. 2) En examen de opción múltiple: sustituye los pares (x, y) de las opciones en ambas ecuaciones; el par que cumpla las dos igualdades es la respuesta correcta.',
              practicalExample: 'Sistema: x + y = 7 y x - y = 3. Sumando ambas directamente se cancela "y": 2x = 10 -> x = 5. Como 5 + y = 7, entonces y = 2.',
              realWorldCase: 'Los sistemas lineales modelan puntos de equilibrio entre oferta y demanda, mezclas químicas en laboratorio y distribución de presupuestos.',
              analogy: 'Una ecuación es una balanza de dos platillos en equilibrio; lo que agregues, quites, multipliques o dividas de un lado debes hacerlo exactamente igual del otro.'
            }
          ],
          keyTakeaways: [
            { badge: 'Regla del signo en inecuaciones', text: 'Si tienes -2x < 6, al pasar el -2 dividiendo cambia el sentido: x > 6 / (-2) -> x > -3.' },
            { badge: 'Suma y producto de raíces', text: 'En x² + bx + c = 0, la suma de las raíces es -b y el producto de las raíces es c.' }
          ],
          commonMistakes: [
            {
              confusion: 'Olvidar invertir el signo de desigualdad al dividir entre un coeficiente negativo.',
              whyItHappens: 'Por tratar la desigualdad mecánicamente como si fuera un signo de igual (=).',
              howToAvoid: 'Cada vez que el coeficiente que acompaña a la x sea negativo, subráyalo para recordar girar el símbolo (< ↔ >) en el último paso.'
            }
          ],
          workedExamples: [
            {
              title: 'Solución de una desigualdad lineal en notación de intervalo',
              problem: 'Determina el conjunto solución de la desigualdad: 4 - 3x ≥ 10',
              steps: [
                'Restar 4 en ambos miembros: -3x ≥ 10 - 4 -> -3x ≥ 6.',
                'Dividir ambos miembros entre -3 invirtiendo el sentido de la desigualdad: x ≤ 6 / (-3).',
                'Simplificar: x ≤ -2, lo que en intervalo se escribe (-∞, -2].'
              ],
              answer: 'x ≤ -2 o bien (-∞, -2]',
              reasoning: 'Al dividir entre un número negativo (-3) la relación de orden se invierte de ≥ a ≤, y el signo incluye al extremo -2 con corchete.'
            }
          ],
          assessment: {
            multipleChoice: [
              {
                id: 'mat2-mc1',
                question: '¿Cuáles son las raíces de la ecuación x² - 5x + 6 = 0?',
                options: [
                  'x₁ = -2, x₂ = -3',
                  'x₁ = 2, x₂ = 3',
                  'x₁ = 6, x₂ = -1',
                  'x₁ = -6, x₂ = 1'
                ],
                correctIndex: 1,
                feedback: 'Factorizando: (x - 2)(x - 3) = 0. Al igualar cada factor a cero y despejar se obtiene x₁ = 2 y x₂ = 3.'
              },
              {
                id: 'mat2-mc2',
                question: 'Si el discriminante b² - 4ac de una ecuación de segundo grado es negativo, entonces sus raíces son:',
                options: [
                  'Dos números reales iguales',
                  'Dos números reales distintos',
                  'Complejas o imaginarias (sin solución real)',
                  'Cero y uno'
                ],
                correctIndex: 2,
                feedback: 'La raíz cuadrada de un número negativo no pertenece a los números reales, por lo que las raíces son complejas conjugadas.'
              }
            ],
            trueFalse: [
              {
                id: 'mat2-tf1',
                statement: 'El intervalo (-3, 5] incluye al número 5 pero NO incluye al número -3.',
                answer: true,
                feedback: 'Correcto. El paréntesis indica extremo abierto (no incluido) y el corchete indica extremo cerrado (sí incluido).'
              }
            ],
            openReflection: [
              {
                id: 'mat2-or1',
                prompt: '¿Qué diferencia hay entre los signos de los factores (x - 2)(x - 3) y los signos de las raíces finales x = 2 y x = 3?',
                guideAnswer: 'Tienen signos opuestos porque cada factor se iguala a cero: si el factor es (x - 2) = 0, al despejar la raíz pasa con signo positivo x = +2.'
              }
            ]
          },
          executiveSummary: {
            synthesis: 'Las ecuaciones de primer y segundo grado, los sistemas lineales y las inecuaciones se resuelven despejando o factorizando ordenadamente, cuidando los signos al igualar factores a cero o al dividir desigualdades entre negativos.',
            mustRemember: [
              'En (x + a)(x + b) = 0, las raíces son x = -a y x = -b.',
              'Dividir una inecuación entre un negativo invierte el signo (< ↔ >).',
              'Discriminante: D > 0 (2 reales), D = 0 (1 real), D < 0 (complejas).'
            ]
          },
          flashcards: [
            {
              id: 'mat2-fc1',
              front: '¿Cuál es la fórmula del discriminante y qué indica cuando vale 0?',
              back: 'D = b² - 4ac. Cuando D = 0, la ecuación cuadrática tiene una única solución real (raíz doble).'
            },
            {
              id: 'mat2-fc2',
              front: '¿Cuándo se usa corchete [ ] y cuándo paréntesis ( ) en intervalos?',
              back: 'Corchete [ ] para ≤ o ≥ (incluye el valor); paréntesis ( ) para <, > y siempre en ±∞.'
            }
          ]
        }
      },
      {
        id: 'mat-3',
        title: 'Funciones y trigonometría',
        summary: 'Dominio y rango, razones trigonométricas, conversión grados-radianes, ley de senos y cosenos.',
        estimatedMinutes: 40,
        relations: {
          prevModuleId: 'mat-2',
          nextModuleId: 'mat-4',
          relatedConcepts: ['Dominio de una función', 'Teorema de Pitágoras', 'Círculo unitario']
        },
        capsule: {
          introduction: {
            overview: 'Una función asigna a cada elemento del dominio exactamente un elemento del contradominio. La trigonometría relaciona los lados y ángulos de los triángulos y modela fenómenos periódicos.',
            whyItMatters: 'El cálculo del dominio de funciones (racionales y con raíz cuadrada) y la resolución de triángulos son preguntas fijas en las 4 áreas de la UNAM.',
            connectionNote: 'Combina las ecuaciones y desigualdades del Módulo 2 con las gráficas que profundizarás en Geometría Analítica (Módulo 4).'
          },
          fundamentals: [
            {
              term: 'Dominio de una Función Real',
              category: 'Conjunto de entrada (x)',
              definition: 'Conjunto de todos los valores reales que puede tomar la variable independiente x sin producir operaciones indefinidas.',
              keyIdea: 'Evita dos peligros: 1) Dividir entre cero. 2) Raíz par de número negativo.'
            },
            {
              term: 'Razones Trigonométricas (SOH-CAH-TOA)',
              category: 'Triángulo rectángulo',
              definition: 'sen θ = Cateto Opuesto / Hipotenusa; cos θ = Cateto Adyacente / Hipotenusa; tan θ = Cateto Opuesto / Cateto Adyacente.',
              keyIdea: 'La hipotenusa siempre es el lado más largo y está frente al ángulo de 90°.'
            },
            {
              term: 'Conversión Grados ↔ Radianes',
              category: 'Medición angular',
              definition: '180° equivalen exactamente a π radianes.',
              keyIdea: 'De grados a radianes multiplica por π/180°; de radianes a grados sustituye π = 180°.'
            }
          ],
          deepDive: [
            {
              subtitle: 'Las 3 reglas de oro para obtener el Dominio en segundos',
              explanation: '1) Si f(x) es un polinomio (ej. f(x) = 3x² - 5x + 1), su dominio son todos los números reales: (-∞, ∞). 2) Si f(x) es una fracción P(x)/Q(x), iguala el denominador Q(x) = 0; esos valores se excluyen del dominio: ℝ - {valores que anulan Q(x)}. 3) Si f(x) tiene una raíz cuadrada √g(x) en el numerador, plantea la desigualdad g(x) ≥ 0 y resuélvela.',
              practicalExample: 'Para f(x) = √(x - 4): planteamos x - 4 ≥ 0 -> x ≥ 4, por lo que el dominio es [4, ∞). Para f(x) = 1 / (x - 4): el denominador no puede ser cero -> x ≠ 4.',
              realWorldCase: 'En física, la función que describe el periodo de un péndulo T = 2π√(L/g) solo tiene sentido físico para longitudes L > 0 (su dominio natural).',
              analogy: 'El dominio es la lista de ingredientes que una máquina procesadora acepta sin descomponerse; meter una división entre cero o una raíz negativa traba los engranes.'
            }
          ],
          keyTakeaways: [
            { badge: 'Ángulos notables (30°, 45°, 60°)', text: 'sen 30° = 1/2, cos 30° = √3/2 | sen 45° = cos 45° = √2/2, tan 45° = 1 | sen 60° = √3/2, cos 60° = 1/2.' },
            { badge: 'Identidad pitagórica', text: 'sen²θ + cos²θ = 1 para cualquier ángulo θ.' }
          ],
          commonMistakes: [
            {
              confusion: 'Usar ≥ 0 cuando la raíz cuadrada está en el denominador: 1 / √(x - 2).',
              whyItHappens: 'Por aplicar de memoria la regla de las raíces (≥ 0) sin notar que está abajo de una fracción.',
              howToAvoid: 'Si la raíz está en el denominador, no puede valer cero; por tanto usa desigualdad estricta (> 0): x - 2 > 0 -> (2, ∞).'
            }
          ],
          workedExamples: [
            {
              title: 'Conversión de radianes a grados y cálculo de dominio',
              problem: '1) Convierte 5π/6 radianes a grados. 2) Halla el dominio de f(x) = (x + 1) / (x² - 9).',
              steps: [
                'Para el ángulo: sustituir π = 180° -> 5(180°) / 6 = 5(30°) = 150°.',
                'Para el dominio: igualar el denominador a cero -> x² - 9 = 0 -> (x - 3)(x + 3) = 0 -> x = 3 y x = -3 se excluyen.'
              ],
              answer: '1) 150°. 2) Dominio: ℝ - {-3, 3}.',
              reasoning: 'π rad equivale a 180°, y una función racional existe para todo número real excepto donde su denominador vale cero.'
            }
          ],
          assessment: {
            multipleChoice: [
              {
                id: 'mat3-mc1',
                question: '¿Cuál es el dominio de la función f(x) = √(2x - 8)?',
                options: ['(-∞, 4]', '[4, ∞)', '(4, ∞)', '[-4, ∞)'],
                correctIndex: 1,
                feedback: 'El radicando debe ser mayor o igual que cero: 2x - 8 ≥ 0 -> 2x ≥ 8 -> x ≥ 4, es decir, [4, ∞).'
              },
              {
                id: 'mat3-mc2',
                question: 'En un triángulo rectángulo los catetos miden 3 y 4 unidades. ¿Cuánto vale el seno del ángulo opuesto al cateto de longitud 3?',
                options: ['3/4', '4/5', '3/5', '5/3'],
                correctIndex: 2,
                feedback: 'Por el teorema de Pitágoras la hipotenusa mide √(3² + 4²) = 5. Como sen θ = Cateto Opuesto / Hipotenusa, resulta 3/5.'
              }
            ],
            trueFalse: [
              {
                id: 'mat3-tf1',
                statement: 'El ángulo de π/3 radianes equivale a 60°.',
                answer: true,
                feedback: 'Correcto: 180° / 3 = 60°.'
              }
            ],
            openReflection: [
              {
                id: 'mat3-or1',
                prompt: '¿Cuándo debes utilizar la Ley de Senos y cuándo la Ley de Cosenos en un triángulo oblicuángulo?',
                guideAnswer: 'Ley de Senos cuando conoces una pareja completa de lado y su ángulo opuesto; Ley de Cosenos cuando conoces dos lados y el ángulo entre ellos (LAL) o los tres lados (LLL).'
              }
            ]
          },
          executiveSummary: {
            synthesis: 'El dominio de una función real se obtiene excluyendo divisiones entre cero y raíces pares negativas. En trigonometría, SOH-CAH-TOA, el triángulo 3-4-5, la equivalencia π rad = 180° y los ángulos de 30°, 45° y 60° resuelven la mayoría de los reactivos.',
            mustRemember: [
              'Fracción P(x)/Q(x) -> Q(x) ≠ 0.',
              'Raíz √g(x) -> g(x) ≥ 0.',
              'π rad = 180° | sen²θ + cos²θ = 1.'
            ]
          },
          flashcards: [
            {
              id: 'mat3-fc1',
              front: '¿Cuánto valen sen 30°, cos 60° y tan 45°?',
              back: 'sen 30° = 1/2, cos 60° = 1/2 y tan 45° = 1.'
            },
            {
              id: 'mat3-fc2',
              front: '¿Qué condición debe cumplir el argumento de una raíz cuadrada √g(x) para pertenecer al dominio real?',
              back: 'Debe ser mayor o igual que cero: g(x) ≥ 0.'
            }
          ]
        }
      },
      {
        id: 'mat-4',
        title: 'Geometría analítica: recta y cónicas',
        summary: 'Pendiente, ecuación de la recta, circunferencia, parábola, elipse e hipérbola.',
        estimatedMinutes: 40,
        relations: {
          prevModuleId: 'mat-3',
          nextModuleId: null,
          relatedConcepts: ['Pendiente de la recta', 'Circunferencia', 'Ecuación general de segundo grado']
        },
        capsule: {
          introduction: {
            overview: 'La geometría analítica une el álgebra con la geometría mediante el plano cartesiano: cada figura geométrica (recta, circunferencia, parábola, elipse o hipérbola) tiene una ecuación algebraica que la describe con exactitud.',
            whyItMatters: 'Es uno de los bloques con más preguntas en Matemáticas UNAM (usualmente de 4 a 6 reactivos entre recta y secciones cónicas).',
            connectionNote: 'Integra el manejo algebraico de binomios al cuadrado (Módulo 1) para completar cuadrados en ecuaciones de cónicas.'
          },
          fundamentals: [
            {
              term: 'Pendiente (m) y Ecuación de la Recta',
              category: 'Línea recta',
              definition: 'm = (y₂ - y₁) / (x₂ - x₁). En la forma y = mx + b, m es la pendiente y b la ordenada al origen. En la general Ax + By + C = 0, la pendiente es m = -A/B.',
              keyIdea: 'Paralelas: m₁ = m₂ | Perpendiculares: m₁ · m₂ = -1 (recíproca y de signo contrario).'
            },
            {
              term: 'Circunferencia y Parábola',
              category: 'Cónicas básicas',
              definition: 'Circunferencia con centro (h, k) y radio r: (x - h)² + (y - k)² = r². Parábola con vértice (h, k): (x - h)² = ±4p(y - k) [vertical] o (y - k)² = ±4p(x - h) [horizontal].',
              keyIdea: 'En la ecuación canónica los signos de (h, k) se leen cambiados.'
            },
            {
              term: 'Clasificación rápida de Cónicas (Ax² + Cy² + Dx + Ey + F = 0)',
              category: 'Ecuación general',
              definition: 'Observa únicamente los coeficientes cuadráticos A y C:',
              keyIdea: 'A = C (Circunferencia) | A = 0 o C = 0 (Parábola) | A ≠ C mismo signo (Elipse) | A y C signos opuestos (Hipérbola).'
            }
          ],
          deepDive: [
            {
              subtitle: 'Cómo identificar cualquier cónica y su centro en menos de 15 segundos',
              explanation: 'Cuando el examen te da una ecuación desarrollada como 4x² + 9y² - 8x + 36y + 4 = 0 y pregunta qué figura representa, no necesitas completar el trinomio si solo pide el tipo de cónica: mira x² e y². Ambos son positivos (+4 y +9) y de distinto valor -> es una Elipse. Si el problema pide el centro (h, k) de una circunferencia x² + y² + Dx + Ey + F = 0, usa el atajo directo: h = -D/2 y k = -E/2.',
              practicalExample: 'En (x + 2)² + (y - 5)² = 16: el centro es (-2, 5) —cambiando signos— y el radio es √16 = 4.',
              realWorldCase: 'Las antenas satelitales y los faros de los automóviles usan espejos parabólicos porque todo rayo paralelo al eje se refleja directamente hacia el foco; las órbitas planetarias son elipses con el Sol en uno de sus focos.',
              analogy: 'Los coeficientes A y C de x² y y² son las huellas digitales de las cónicas: con solo ver si están las dos al cuadrado, si valen igual o si una es negativa, sabes de inmediato quién es.'
            }
          ],
          keyTakeaways: [
            { badge: 'Pendiente perpendicular', text: 'Si una recta tiene pendiente m₁ = 2/3, cualquier recta perpendicular a ella tendrá pendiente m₂ = -3/2 (voltea la fracción y cambia el signo).' },
            { badge: 'Hacia dónde abre la parábola', text: 'Si el término al cuadrado es x², es vertical (+4p abre arriba, -4p abre abajo). Si el término al cuadrado es y², es horizontal (+4p abre a la derecha, -4p a la izquierda).' }
          ],
          commonMistakes: [
            {
              confusion: 'Tomar r² como el radio de la circunferencia sin sacarle raíz cuadrada.',
              whyItHappens: 'Al ver x² + y² = 25 es común elegir r = 25 por prisa.',
              howToAvoid: 'Recuerda que el número a la derecha del igual es r², por lo que el radio siempre es su raíz cuadrada (r = √25 = 5).'
            }
          ],
          workedExamples: [
            {
              title: 'Centro y radio de una circunferencia desde su ecuación general',
              problem: 'Determina el centro y el radio de la circunferencia x² + y² - 6x + 8y + 9 = 0.',
              steps: [
                'Agrupar términos en x y en y: (x² - 6x) + (y² + 8y) = -9.',
                'Completar trinomios cuadrados perfectos sumando la mitad del coeficiente lineal al cuadrado: (-6/2)² = 9 y (8/2)² = 16 en ambos lados.',
                '(x² - 6x + 9) + (y² + 8y + 16) = -9 + 9 + 16 -> (x - 3)² + (y + 4)² = 16.'
              ],
              answer: 'Centro C(3, -4) y radio r = 4.',
              reasoning: 'Comparando con (x - h)² + (y - k)² = r², tenemos h = 3, k = -4 y r = √16 = 4.'
            }
          ],
          assessment: {
            multipleChoice: [
              {
                id: 'mat4-mc1',
                question: '¿Cuál es la pendiente de la recta que es perpendicular a la recta y = -4x + 7?',
                options: ['-4', '4', '1/4', '-1/4'],
                correctIndex: 2,
                feedback: 'La pendiente dada es m₁ = -4. La perpendicular cumple m₂ = -1 / m₁ = -1 / (-4) = 1/4.'
              },
              {
                id: 'mat4-mc2',
                question: '¿Qué lugar geométrico representa la ecuación 9x² - 4y² - 36 = 0?',
                options: ['Circunferencia', 'Parábola', 'Elipse', 'Hipérbola'],
                correctIndex: 3,
                feedback: 'Los coeficientes de x² (+9) y de y² (-4) tienen signos opuestos, condición característica de la hipérbola.'
              }
            ],
            trueFalse: [
              {
                id: 'mat4-tf1',
                statement: 'La parábola (y - 1)² = 12(x + 3) tiene su vértice en (-3, 1) y abre hacia la derecha.',
                answer: true,
                feedback: 'Correcto. El término en x acompaña a h (-3), el término en y acompaña a k (1), y como y está al cuadrado con 4p = +12 > 0, es horizontal y abre hacia la derecha.'
              }
            ],
            openReflection: [
              {
                id: 'mat4-or1',
                prompt: 'En una elipse de ecuación x²/25 + y²/9 = 1, ¿cómo sabes si su eje mayor es horizontal o vertical?',
                guideAnswer: 'Porque a² siempre es el denominador mayor (25 > 9). Como el 25 está debajo de x², el eje mayor es horizontal y los vértices están sobre el eje X.'
              }
            ]
          },
          executiveSummary: {
            synthesis: 'La pendiente define la inclinación, paralelismo y perpendicularidad de las rectas. Las cuatro cónicas se distinguen inmediatamente por los signos y valores de los coeficientes cuadráticos A y C.',
            mustRemember: [
              'm = (y₂ - y₁)/(x₂ - x₁) | Paralelas: m₁ = m₂ | Perpendiculares: m₁·m₂ = -1.',
              'Circunferencia: A = C | Parábola: una sola variable al cuadrado.',
              'Elipse: A ≠ C con el mismo signo | Hipérbola: A y C con signos opuestos.'
            ]
          },
          flashcards: [
            {
              id: 'mat4-fc1',
              front: '¿Cómo se relacionan las pendientes de dos rectas perpendiculares?',
              back: 'Su producto es igual a -1 (m₁ · m₂ = -1); es decir, una es recíproca y de signo contrario a la otra.'
            },
            {
              id: 'mat4-fc2',
              front: 'En la ecuación general Ax² + Cy² + Dx + Ey + F = 0, ¿cuándo es una elipse y cuándo una hipérbola?',
              back: 'Es elipse si A y C tienen el mismo signo pero distinto valor (A ≠ C); es hipérbola si A y C tienen signos contrarios.'
            }
          ]
        }
      }
    ]
  },

  /* ==========================================================================
     MATERIA 3: HISTORIA DE MÉXICO
     ========================================================================== */
  {
    id: 'historia-mexico',
    code: 'HMX',
    name: 'Historia de México',
    area: 'Ciencias Sociales y Humanidades',
    description: 'Mesoamérica, Virreinato, Independencia, Reforma, Porfiriato, Revolución y México contemporáneo.',
    modules: [
      {
        id: 'hmx-1',
        title: 'México prehispánico y Conquista',
        summary: 'Superáreas culturales, horizontes mesoamericanos y caída de México-Tenochtitlan.',
        estimatedMinutes: 25,
        relations: {
          prevModuleId: null,
          nextModuleId: 'hmx-2',
          relatedConcepts: ['Mesoamérica', 'Horizontes culturales', 'Conquista espiritual']
        },
        capsule: {
          introduction: {
            overview: 'El estudio de la Historia de México inicia con el desarrollo de las civilizaciones originarias en Mesoamérica a través de tres horizontes temporales (Preclásico, Clásico y Posclásico) y el choque militar, político y religioso que significó la conquista española en el siglo XVI.',
            whyItMatters: 'Siempre se pregunta al menos un reactivo sobre las características de Mesoamérica o la ubicación temporal de olmecas, mayas, teotihuacanos y mexicas.',
            connectionNote: 'Explica los antecedentes indígenas sobre los cuales se edificó la sociedad virreinal de la Nueva España (Módulo 2).'
          },
          fundamentals: [
            {
              term: 'Mesoamérica, Aridoamérica y Oasisamérica',
              category: 'Superáreas geoculturales',
              definition: 'Mesoamérica (centro y sur) tuvo clima propicio para la agricultura sedentaria y altas culturas; Aridoamérica (norte) estuvo habitada por grupos nómadas cazadores-recolectores (chichimecas).',
              keyIdea: 'Base mesoamericana: cultivo del maíz (chinampas), religión politeísta, basamentos piramidales y calendario dual.'
            },
            {
              term: 'Los 3 Horizontes Mesoamericanos',
              category: 'Periodización',
              definition: 'Preclásico (cultura madre Olmeca: La Venta, Tres Zapotes). Clásico (esplendor urbano y teocrático: Teotihuacán, Mayas, Zapotecos en Monte Albán). Posclásico (militarismo y tributo: Toltecas y Mexicas).',
              keyIdea: 'Preclásico = Olmecas | Clásico = Teotihuacán/Mayas | Posclásico = Toltecas/Mexicas.'
            },
            {
              term: 'Factores de la Conquista (1519-1521)',
              category: 'Choque de dos mundos',
              definition: 'La caída de Tenochtitlan el 13 de agosto de 1521 combinó las alianzas de Hernán Cortés con señoríos tributarios (tlaxcaltecas, totonacas), la superioridad armamentística y las epidemias (viruela).',
              keyIdea: 'A la conquista militar siguió la conquista espiritual encabezada por las órdenes mendicantes (franciscanos, dominicos, agustinos).'
            }
          ],
          deepDive: [
            {
              subtitle: 'Cómo asociar cada cultura prehispánica con su aportación distintiva',
              explanation: 'En el examen suelen pedirte relacionar columnas entre cultura y rasgo principal: 1) Olmecas (Preclásico en Veracruz y Tabasco): cabezas colosales y culto al jaguar. 2) Mayas (Clásico en el sureste): invención del cero, numeración vigesimal y observación astronómica precisa. 3) Teotihuacanos (Clásico en el Altiplano Central): pirámides del Sol y la Luna, comercio de obsidiana. 4) Mexicas (Posclásico): sociedad militarista estratificada (pipiltin nobles y macehualtin pueblo), educación en Calmecac (nobles) y Telpochcalli (guerreros del pueblo).',
              practicalExample: 'Si un reactivo pregunta por la cultura del Posclásico que dominó el Valle de México mediante la Triple Alianza y el cobro de tributo, la respuesta es la cultura Mexica.',
              realWorldCase: 'Muchos trazos urbanos, mercados (tianguis) y tradiciones agrícolas como las chinampas de Xochimilco provienen directamente de la organización mexica.',
              analogy: 'Los tres horizontes son como tres etapas de la vida de Mesoamérica: la infancia fundadora (Preclásico Olmeca), la madurez científica y urbana (Clásico Teotihuacano/Maya) y la etapa guerrera e imperial (Posclásico Mexica).'
            }
          ],
          keyTakeaways: [
            { badge: 'Primera orden religiosa', text: 'Los franciscanos fueron la primera orden en llegar a la Nueva España (1524) para iniciar la evangelización.' },
            { badge: 'Villa Rica de la Vera Cruz', text: 'Cortés fundó el primer ayuntamiento en Veracruz (1519) para desligarse legalmente de la autoridad del gobernador de Cuba, Diego Velázquez.' }
          ],
          commonMistakes: [
            {
              confusion: 'Ubicar a los Mexicas o Toltecas en el periodo Clásico.',
              whyItHappens: 'Por pensar que al ser tan famosos pertenecen al periodo "Clásico".',
              howToAvoid: 'Recuerda que las sociedades con fuerte carácter militarista (Toltecas en Tula y Mexicas en Tenochtitlan) corresponden siempre al Posclásico.'
            }
          ],
          workedExamples: [
            {
              title: 'Relación de horizontes culturales',
              problem: 'Ordena cronológicamente el florecimiento de los siguientes centros ceremoniales: I. Tenochtitlan, II. La Venta, III. Teotihuacán.',
              steps: [
                'Identificar la cultura de cada sitio: La Venta es Olmeca (Preclásico); Teotihuacán pertenece al Clásico; Tenochtitlan es Mexica (Posclásico).',
                'Establecer la secuencia Preclásico -> Clásico -> Posclásico: II, III, I.'
              ],
              answer: 'II, III, I (La Venta -> Teotihuacán -> Tenochtitlan).',
              reasoning: 'Sigue el orden cronológico de los tres horizontes culturales de Mesoamérica.'
            }
          ],
          assessment: {
            multipleChoice: [
              {
                id: 'hmx1-mc1',
                question: '¿Cuál es considerada la "cultura madre" de Mesoamérica, desarrollada durante el horizonte Preclásico en las costas del Golfo?',
                options: ['Maya', 'Zapoteca', 'Olmeca', 'Mexica'],
                correctIndex: 2,
                feedback: 'La civilización Olmeca se desarrolló en el Preclásico (Veracruz y Tabasco) y sentó las bases calendáricas, arquitectónicas y religiosas mesoamericanas.'
              },
              {
                id: 'hmx1-mc2',
                question: 'En la sociedad mexica, la escuela destinada a los hijos de los nobles (pipiltin) para formarse como sacerdotes, jueces y gobernantes era el:',
                options: ['Telpochcalli', 'Calmecac', 'Calpulli', 'Tlacatecuhtli'],
                correctIndex: 1,
                feedback: 'El Calmecac educaba a la nobleza (pipiltin) en astronomía, historia y gobierno, mientras que el Telpochcalli formaba a los jóvenes macehualtin para la guerra.'
              }
            ],
            trueFalse: [
              {
                id: 'hmx1-tf1',
                statement: 'Las alianzas de los españoles con pueblos sometidos por los mexicas, como los tlaxcaltecas, fueron determinantes para la toma de Tenochtitlan.',
                answer: true,
                feedback: 'Correcto. El descontento por el pesado tributo mexica llevó a numerosos señoríos indígenas a aliarse con Cortés.'
              }
            ],
            openReflection: [
              {
                id: 'hmx1-or1',
                prompt: '¿Qué diferencia principal existió entre los pueblos de Mesoamérica y los de Aridoamérica?',
                guideAnswer: 'Mesoamérica contó con recursos hídricos que permitieron la agricultura intensiva, el sedentarismo y ciudades-Estado; Aridoamérica tuvo clima seco y grupos seminómadas dedicados a la caza y recolección.'
              }
            ]
          },
          executiveSummary: {
            synthesis: 'Mesoamérica evolucionó en tres horizontes: Preclásico (Olmecas), Clásico (Teotihuacanos, Mayas, Zapotecos) y Posclásico (Toltecas, Mexicas). En 1521 la conquista militar y espiritual dio paso al orden virreinal.',
            mustRemember: [
              'Preclásico = Olmecas (La Venta, cabezas colosales).',
              'Clásico = Teotihuacán, Mayas, Monte Albán.',
              'Posclásico = Toltecas y Mexicas (militarismo y tributo).',
              'Franciscanos = Primera orden evangelizadora.'
            ]
          },
          flashcards: [
            {
              id: 'hmx1-fc1',
              front: '¿Qué culturas destacan en el Horizonte Clásico mesoamericano?',
              back: 'Teotihuacana, Maya y Zapoteca (Monte Albán).'
            },
            {
              id: 'hmx1-fc2',
              front: '¿Qué acto jurídico realizó Hernán Cortés en 1519 para legitimar su expedición sin depender de Diego Velázquez?',
              back: 'Fundó el Ayuntamiento de la Villa Rica de la Vera Cruz.'
            }
          ]
        }
      },
      {
        id: 'hmx-2',
        title: 'La Nueva España y el proceso de Independencia',
        summary: 'Instituciones virreinales, economía, Reformas Borbónicas y las 4 etapas de la Independencia.',
        estimatedMinutes: 30,
        relations: {
          prevModuleId: 'hmx-1',
          nextModuleId: 'hmx-3',
          relatedConcepts: ['Real Audiencia', 'Reformas Borbónicas', 'Sentimientos de la Nación']
        },
        capsule: {
          introduction: {
            overview: 'Durante tres siglos (1521-1821) la Nueva España se organizó como un virreinato con economía basada en la minería, sociedad estamental de castas y fuerte presencia de la Iglesia. En el siglo XVIII las Reformas Borbónicas agudizaron el descontento criollo que estalló en la guerra de Independencia (1810-1821).',
            whyItMatters: 'Las Reformas Borbónicas, las causas internas/externas de la Independencia y los documentos de Hidalgo, Morelos e Iturbide son preguntas clásicas en cada convocatoria.',
            connectionNote: 'Conecta el fin de la conquista (Módulo 1) con el nacimiento del México independiente del siglo XIX (Módulo 3).'
          },
          fundamentals: [
            {
              term: 'Instituciones y Economía Virreinal',
              category: 'Nueva España',
              definition: 'En España mandaban el Rey y el Real y Supremo Consejo de Indias; en América gobernaban el Virrey y la Real Audiencia. La actividad económica más lucrativa fue la minería (plata).',
              keyIdea: 'Encomienda y repartimiento explotaron la mano de obra indígena.'
            },
            {
              term: 'Reformas Borbónicas (Siglo XVIII)',
              category: 'Causas de la Independencia',
              definition: 'Medidas de la dinastía Borbón (Carlos III) para centralizar el poder, aumentar impuestos, crear el sistema de Intendencias, expulsar a los jesuitas (1767) y desplazar a los criollos de cargos públicos.',
              keyIdea: 'Fueron el detonante interno del nacionalismo criollo.'
            },
            {
              term: 'Las 4 Etapas de la Independencia',
              category: 'Proceso insurgente (1810-1821)',
              definition: '1) Iniciación (1810-1811: Hidalgo, abolición de la esclavitud). 2) Organización (1811-1815: Morelos, Sentimientos de la Nación y Constitución de Apatzingán). 3) Resistencia (1815-1820: Guerrero y Javier Mina). 4) Consumación (1821: Iturbide, Plan de Iguala y Tratados de Córdoba).',
              keyIdea: 'Hidalgo inicia -> Morelos organiza y da Constitución -> Guerrero resiste -> Iturbide consuma.'
            }
          ],
          deepDive: [
            {
              subtitle: 'Causas internas vs. Causas externas de la Independencia',
              explanation: 'El examen suele pedirte distinguir entre causas externas (ocurridas fuera de la Nueva España) y causas internas (propias de la sociedad novohispana). Externas: las ideas de la Ilustración, la Independencia de las Trece Colonias (1776), la Revolución Francesa (1789) y la invasión de Napoleón Bonaparte a España en 1808. Internas: la desigualdad social del sistema de castas, la relegación política de los criollos y el impacto fiscal de las Reformas Borbónicas.',
              practicalExample: 'La invasión napoleónica a España en 1808 dejó un vacío de poder legítimo que los criollos del Ayuntamiento de la Ciudad de México intentaron aprovechar promoviendo la soberanía popular.',
              realWorldCase: 'La división territorial actual de muchos estados mexicanos tiene su antecedente directo en las 12 Intendencias creadas por las Reformas Borbónicas en 1786.',
              analogy: 'La Nueva España era una olla a presión: la desigualdad social y las Reformas Borbónicas subieron el fuego por dentro (causas internas), mientras que la invasión de Napoleón a España destapó la válvula desde afuera (causa externa).'
            }
          ],
          keyTakeaways: [
            { badge: 'Documentos clave', text: 'Hidalgo: Decreto de abolición de la esclavitud en Guadalajara y periódico El Despertador Americano. Morelos: Sentimientos de la Nación (1813) y Constitución de Apatzingán (1814). Iturbide: Plan de Iguala (Tres Garantías: Religión, Independencia y Unión) y Tratados de Córdoba (firmados con Juan O’Donojú).' },
            { badge: 'Actividad eje', text: 'La minería de plata (Zacatecas, Guanajuato, Taxco) fue el motor económico que articuló caminos, haciendas agrícolas y comercio exterior en la Nueva España.' }
          ],
          commonMistakes: [
            {
              confusion: 'Atribuir la Constitución de 1824 a José María Morelos.',
              whyItHappens: 'Por recordar que Morelos impulsó la primera constitución insurgente.',
              howToAvoid: 'Morelos promulgó la Constitución de Apatzingán en 1814 (durante la guerra, sin llegar a entrar en vigor pleno). La primera Constitución del México ya independiente fue la Federal de 1824.'
            }
          ],
          workedExamples: [
            {
              title: 'Propósito de las Reformas Borbónicas',
              problem: '¿Cuál fue el objetivo principal de las Reformas Borbónicas aplicadas en la Nueva España durante la segunda mitad del siglo XVIII?',
              steps: [
                'Recordar el contexto: la Corona española había perdido control político y recaudación frente a corporaciones locales (Iglesia, consulado de comerciantes y criollos).',
                'Identificar la medida central: recuperar el poder real administrativo y extraer mayores recursos fiscales para la metrópoli.'
              ],
              answer: 'Recuperar el control político, administrativo y económico de la Corona española sobre sus colonias y aumentar la recaudación fiscal.',
              reasoning: 'Las reformas crearon las intendencias, modernizaron el cobro de impuestos y limitaron el poder de la Iglesia y de los criollos.'
            }
          ],
          assessment: {
            multipleChoice: [
              {
                id: 'hmx2-mc1',
                question: '¿En qué etapa de la guerra de Independencia se redactaron los "Sentimientos de la Nación" y se promulgó la Constitución de Apatzingán?',
                options: ['Iniciación', 'Organización', 'Resistencia', 'Consumación'],
                correctIndex: 1,
                feedback: 'En la etapa de Organización (1811-1815), liderada por José María Morelos y Pavón.'
              },
              {
                id: 'hmx2-mc2',
                question: 'Documento proclamado por Agustín de Iturbide en febrero de 1821 que estableció las Tres Garantías (Religión, Independencia y Unión):',
                options: [
                  'Plan de Ayutla',
                  'Tratados de Velasco',
                  'Plan de Iguala',
                  'Sentimientos de la Nación'
                ],
                correctIndex: 2,
                feedback: 'El Plan de Iguala unificó a realistas e insurgentes en el Ejército Trigarante bajo las banderas de Religión, Independencia y Unión.'
              }
            ],
            trueFalse: [
              {
                id: 'hmx2-tf1',
                statement: 'La expulsión de la Compañía de Jesús (jesuitas) en 1767 formó parte de las Reformas Borbónicas.',
                answer: true,
                feedback: 'Correcto. El rey Carlos III ordenó su expulsión para disminuir el poder educativo y económico del clero regular.'
              }
            ],
            openReflection: [
              {
                id: 'hmx2-or1',
                prompt: '¿Por qué los criollos fueron el grupo social que encabezó el movimiento de Independencia si tenían buena posición económica?',
                guideAnswer: 'Porque a pesar de su riqueza y educación ilustrada, eran desplazados de los altos cargos políticos, militares y eclesiásticos, reservados para los españoles peninsulares.'
              }
            ]
          },
          executiveSummary: {
            synthesis: 'La Nueva España se sostuvo en la minería, el sistema de castas y el poder corporativo. Las Reformas Borbónicas y la invasión napoleónica de 1808 detonaron la Independencia en cuatro etapas: Hidalgo (Iniciación), Morelos (Organización), Guerrero/Mina (Resistencia) e Iturbide (Consumación en 1821).',
            mustRemember: [
              'Economía novohispana = Minería de plata + Encomienda/Repartimiento.',
              'Reformas Borbónicas = Intendencias, más impuestos, expulsión de jesuitas.',
              '4 etapas: Hidalgo -> Morelos (Apatzingán) -> Guerrero/Mina -> Iturbide (Iguala/Córdoba).'
            ]
          },
          flashcards: [
            {
              id: 'hmx2-fc1',
              front: '¿Qué documento firmaron Agustín de Iturbide y el último virrey Juan O’Donojú en agosto de 1821 para reconocer la Independencia?',
              back: 'Los Tratados de Córdoba.'
            },
            {
              id: 'hmx2-fc2',
              front: '¿Cuál fue la causa externa determinante que precipitó la crisis política de 1808 en España y la Nueva España?',
              back: 'La invasión de Napoleón Bonaparte a España y la abdicación del rey Fernando VII.'
            }
          ]
        }
      },
      {
        id: 'hmx-3',
        title: 'Siglo XIX: Reforma Liberal y Porfiriato',
        summary: 'Federalismo vs. centralismo, intervenciones extranjeras, Constitución de 1857, Leyes de Reforma y Porfiriato.',
        estimatedMinutes: 35,
        relations: {
          prevModuleId: 'hmx-2',
          nextModuleId: 'hmx-4',
          relatedConcepts: ['Federalismo y Centralismo', 'Leyes de Reforma', 'Porfiriato']
        },
        capsule: {
          introduction: {
            overview: 'Tras consumarse la Independencia en 1821, México vivió medio siglo de disputa entre dos proyectos de nación (conservadores centralistas vs. liberales federalistas), enfrentó intervenciones extranjeras (EE. UU. y Francia), consolidó el Estado laico con Benito Juárez y entró en los 34 años de modernización autoritaria del Porfiriato (1876-1911).',
            whyItMatters: 'Es el bloque más denso de Historia de México: incluye los tratados internacionales (Guadalupe-Hidalgo, McLane-Ocampo), las Leyes de Reforma y las características económicas y sociales del Porfiriato.',
            connectionNote: 'Explica las contradicciones sociales del régimen de Porfirio Díaz que desembocaron en la Revolución Mexicana de 1910 (Módulo 4).'
          },
          fundamentals: [
            {
              term: 'Liberales (Federalistas) vs. Conservadores (Centralistas)',
              category: 'Proyectos de nación',
              definition: 'Liberales (logia yorkina): república federal, estados autónomos, separación Iglesia-Estado (Constituciones de 1824 y 1857). Conservadores (logia escocesa): república centralista o monarquía, privilegios de Iglesia y ejército (Siete Leyes de 1836).',
              keyIdea: 'Liberal = Federal y laico | Conservador = Centralista y fueros eclesiásticos/militares.'
            },
            {
              term: 'Intervenciones Extranjeras y Reforma',
              category: 'Defensa de la soberanía',
              definition: '1836: Separación de Texas. 1838: Primera intervención francesa (Guerra de los Pasteles). 1846-1848: Guerra con EE. UU. (Tratado de Guadalupe-Hidalgo, pérdida de más de la mitad del territorio). 1858-1861: Guerra de Reforma. 1862-1867: Segunda intervención francesa y Segundo Imperio de Maximiliano.',
              keyIdea: 'El Plan de Ayutla (1854) derrocó a Santa Anna y dio paso a la generación liberal de la Reforma.'
            },
            {
              term: 'El Porfiriato (1876-1911)',
              category: 'Orden y Progreso',
              definition: 'Porfirio Díaz llegó al poder con el Plan de Tuxtepec ("No reelección"). Su gobierno se basó en la filosofía del Positivismo ("Orden y Progreso", grupo de "Los Científicos"), inversión extranjera en ferrocarriles y minería, latifundismo (tiendas de raya) y represión (huelgas de Cananea 1906 y Río Blanco 1907).',
              keyIdea: 'Crecimiento económico hacia afuera con aguda desigualdad social y falta de democracia.'
            }
          ],
          deepDive: [
            {
              subtitle: 'Línea del tiempo estratégica de mediados del siglo XIX (1854-1867)',
              explanation: 'Para no confundir los planes y leyes de este periodo, recuerda esta secuencia causal: 1) Plan de Ayutla (1854) quita definitivamente a Santa Anna. 2) Se promulga la Constitución liberal de 1857. 3) Los conservadores la rechazan con el Plan de Tacubaya (Félix Zuloaga), iniciando la Guerra de Reforma (1858-1861). 4) Durante la guerra, Benito Juárez expide las Leyes de Reforma en Veracruz (nacionalización de bienes eclesiásticos, matrimonio y registro civil, libertad de cultos). 5) Al suspender Juárez el pago de la deuda externa (1861), Francia invade México e impone a Maximiliano de Habsburgo (1864-1867) hasta el triunfo de la República Restaurada.',
              practicalExample: 'La Ley Lerdo (1856) obligó a las corporaciones civiles y eclesiásticas a vender sus tierras improductivas (desamortización), y la Ley Juárez suprimió los tribunales especiales (fueros) para civiles.',
              realWorldCase: 'El Registro Civil (actas de nacimiento, matrimonio y defunción expedidas por el Estado y no por las parroquias) nació con las Leyes de Reforma de Benito Juárez.',
              analogy: 'En el siglo XIX México pasó de una cirugía dolorosa para separar la Iglesia del Estado (la Reforma) a un régimen de gimnasio intensivo para la infraestructura pero sin derechos para los trabajadores (el Porfiriato).'
            }
          ],
          keyTakeaways: [
            { badge: 'Primera Constitución de México', text: 'La Constitución de 1824 estableció por primera vez la República Federal con división de tres poderes; el primer presidente fue Guadalupe Victoria.' },
            { badge: 'Filosofía del Porfiriato', text: 'El Positivismo (introducido en educación por Gabino Barreda y aplicado en política por "Los Científicos" como José Yves Limantour) fue la ideología oficial del régimen porfirista.' }
          ],
          commonMistakes: [
            {
              confusion: 'Confundir el Plan de la Noria con el Plan de Tuxtepec de Porfirio Díaz.',
              whyItHappens: 'Ambos fueron proclamados por Porfirio Díaz bajo la bandera de la no reelección.',
              howToAvoid: 'El Plan de la Noria (1871) fue contra Benito Juárez y fracasó; el Plan de Tuxtepec (1876) fue contra Sebastián Lerdo de Tejada y sí triunfó, llevando a Díaz a la presidencia.'
            }
          ],
          workedExamples: [
            {
              title: 'Consecuencia de la Guerra entre México y Estados Unidos (1846-1848)',
              problem: '¿Qué tratado puso fin a la invasión estadounidense en febrero de 1848 y cuál fue su consecuencia territorial?',
              steps: [
                'Distinguir entre los Tratados de Velasco (1836, Texas), el Tratado de la Mesilla (1853) y el de 1848.',
                'Identificar el Tratado de Guadalupe-Hidalgo firmado el 2 de febrero de 1848.'
              ],
              answer: 'El Tratado de Guadalupe-Hidalgo, por el cual México cedió Alta California y Nuevo México (más de la mitad de su territorio).',
              reasoning: 'Estableció el río Bravo como frontera y formalizó la pérdida de más de 2 millones de km² a cambio de una indemnización de 15 millones de pesos.'
            }
          ],
          assessment: {
            multipleChoice: [
              {
                id: 'hmx3-mc1',
                question: '¿Qué corriente filosófica sirvió de sustento ideológico al gobierno de Porfirio Díaz bajo el lema "Orden y Progreso"?',
                options: ['Existencialismo', 'Materialismo histórico', 'Positivismo', 'Escolástica'],
                correctIndex: 2,
                feedback: 'El positivismo de Augusto Comte fue adoptado en México para justificar la paz forzada ("orden") como requisito para el desarrollo económico ("progreso").'
              },
              {
                id: 'hmx3-mc2',
                question: 'Movimientos obreros reprimidos durante el ocaso del Porfiriato que constituyen antecedentes directos de la Revolución Mexicana:',
                options: [
                  'Huelgas de Cananea y Río Blanco',
                  'Rebelión de Agua Prieta y Decena Trágica',
                  'Guerra Cristera y movimiento ferrocarrilero',
                  'Plan de Ayutla y Guerra de los Pasteles'
                ],
                correctIndex: 0,
                feedback: 'La huelga minera de Cananea (Sonora, 1906) y la textil de Río Blanco (Veracruz, 1907) evidenciaron la explotación laboral del régimen porfirista.'
              }
            ],
            trueFalse: [
              {
                id: 'hmx3-tf1',
                statement: 'Las Leyes de Reforma establecieron la nacionalización de los bienes del clero y la creación del Registro Civil.',
                answer: true,
                feedback: 'Correcto. Fueron promulgadas por Benito Juárez para separar las funciones civiles y económicas del Estado respecto de la Iglesia.'
              }
            ],
            openReflection: [
              {
                id: 'hmx3-or1',
                prompt: '¿Cuál era la diferencia esencial entre la propuesta de gobierno de los liberales y la de los conservadores en el siglo XIX?',
                guideAnswer: 'Los liberales buscaban una república federal, democrática, laica y sin fueros corporativos; los conservadores defendían un gobierno centralista (o monárquico) que preservara la religión católica como única y los privilegios de la Iglesia y el ejército.'
              }
            ]
          },
          executiveSummary: {
            synthesis: 'El siglo XIX mexicano transitó del conflicto entre federalistas y centralistas y la pérdida territorial de 1848 al triunfo liberal con la Constitución de 1857 y las Leyes de Reforma de Juárez. Después, el Porfiriato (1876-1911) impulsó ferrocarriles e inversión extranjera bajo el positivismo, pero a costa de latifundios y represión social.',
            mustRemember: [
              '1824: Primera Constitución Federal (Guadalupe Victoria).',
              '1848: Tratado de Guadalupe-Hidalgo (pérdida de Alta California y Nuevo México).',
              '1854: Plan de Ayutla -> Constitución de 1857 -> Leyes de Reforma (Juárez).',
              'Porfiriato (1876-1911): Plan de Tuxtepec, positivismo, ferrocarriles, Cananea y Río Blanco.'
            ]
          },
          flashcards: [
            {
              id: 'hmx3-fc1',
              front: '¿Qué plan proclamó en 1854 el desconocimiento de la dictadura de Antonio López de Santa Anna?',
              back: 'El Plan de Ayutla (encabezado por Juan Álvarez e Ignacio Comonfort).'
            },
            {
              id: 'hmx3-fc2',
              front: '¿Con qué plan llegó Porfirio Díaz a la presidencia en 1876?',
              back: 'Con el Plan de Tuxtepec, desconociendo la reelección de Sebastián Lerdo de Tejada.'
            }
          ]
        }
      },
      {
        id: 'hmx-4',
        title: 'Revolución Mexicana y México Contemporáneo',
        summary: 'Maderismo, zapatismo, constitucionalismo, Constitución de 1917, Cardenismo y modelos económicos.',
        estimatedMinutes: 35,
        relations: {
          prevModuleId: 'hmx-3',
          nextModuleId: null,
          relatedConcepts: ['Constitución de 1917', 'Cardenismo', 'Desarrollo Estabilizador']
        },
        capsule: {
          introduction: {
            overview: 'El siglo XX mexicano se inaugura con la Revolución de 1910, cuya lucha de facciones (maderistas, zapatistas, villistas y constitucionalistas) cristalizó en la Constitución social de 1917. Posteriormente el Estado se institucionalizó (PNR-PRM-PRI), vivió las profundas reformas del Cardenismo (1934-1940), el auge industrial del Desarrollo Estabilizador y la apertura neoliberal desde 1982.',
            whyItMatters: 'Los planes revolucionarios, los artículos 3°, 27 y 123 de la Constitución de 1917, el gobierno de Lázaro Cárdenas y los modelos económicos del siglo XX aparecen siempre con múltiples reactivos.',
            connectionNote: 'Culmina el recorrido de Historia de México y enlaza con el contexto económico internacional de Historia Universal y Geografía.'
          },
          fundamentals: [
            {
              term: 'Planes de la Revolución Mexicana',
              category: 'Lucha armada (1910-1917)',
              definition: 'Plan de San Luis (1910, Francisco I. Madero: "Sufragio efectivo, no reelección"). Plan de Ayala (1911, Emiliano Zapata: restitución de tierras a los pueblos). Plan de Guadalupe (1913, Venustiano Carranza: desconoce al usurpador Victoriano Huerta). Plan de Agua Prieta (1920, Obregón/Calles contra Carranza).',
              keyIdea: 'San Luis = Madero | Ayala = Zapata (tierra) | Guadalupe = Carranza (constitucionalismo).'
            },
            {
              term: 'Constitución de 1917 y Maximato',
              category: 'Institucionalización',
              definition: 'Promulgada el 5 de febrero de 1917: Art. 3° (educación laica y gratuita), Art. 27 (propiedad de la nación sobre tierras, aguas y subsuelo), Art. 123 (jornada de 8 horas, salario mínimo, huelga). De 1928 a 1934 Plutarco Elías Calles ejerció el poder tras la silla presidencial (el Maximato) y fundó el PNR (1929).',
              keyIdea: 'Calles pasó la época de los caudillos a la de las instituciones.'
            },
            {
              term: 'Cardenismo (1934-1940) y Modelos Económicos',
              category: 'México contemporáneo',
              definition: 'Lázaro Cárdenas realizó el mayor reparto agrario ejidal, la Expropiación Petrolera (18 de marzo de 1938), creó el IPN y organizó el corporativismo (CTM, CNC). Después siguieron la Sustitución de Importaciones / Milagro Mexicano (1940-1954), el Desarrollo Estabilizador (1954-1970, baja inflación y paridad fija) y el Neoliberalismo (desde 1982, privatizaciones y TLCAN).',
              keyIdea: 'Cárdenas = Ejido, Pemex (1938), IPN y fin del Maximato.'
            }
          ],
          deepDive: [
            {
              subtitle: 'Cómo diferenciar los modelos económicos de México en el siglo XX',
              explanation: '1) Modelo de Sustitución de Importaciones (1940-1954, Ávila Camacho y Miguel Alemán): aprovechando la Segunda Guerra Mundial, México empezó a fabricar internamente los bienes industriales que antes importaba. 2) Desarrollo Estabilizador (1954-1970, Ruiz Cortines, López Mateos y Díaz Ordaz, con Antonio Ortiz Mena en Hacienda): crecimiento sostenido del PIB (~6 % anual), estabilidad de precios y tipo de cambio fijo en $12.50 por dólar. 3) Desarrollo Compartido (1970-1982, Echeverría y López Portillo): elevado gasto público, endeudamiento externo y petrolización de la economía. 4) Modelo Neoliberal (desde 1982 con Miguel de la Madrid y Carlos Salinas): reducción del Estado, venta de paraestatales, ingreso al GATT (1986) y firma del TLCAN (1994).',
              practicalExample: 'Si un reactivo pregunta por el periodo económico de 1954 a 1970 caracterizado por crecimiento industrial sin inflación ni devaluación de la moneda, la respuesta es el Desarrollo Estabilizador.',
              realWorldCase: 'Instituciones actuales como el IMSS (fundado en 1943 con Manuel Ávila Camacho), la SEP (creada en 1921 con Álvaro Obregón y José Vasconcelos) y el Banco de México (fundado en 1925 con Plutarco Elías Calles) surgieron de la reconstrucción posrevolucionaria.',
              analogy: 'La Revolución de 1910 derribó el viejo edificio porfirista; la Constitución de 1917 dibujó los nuevos planos; Obregón y Calles levantaron los muros institucionales y Cárdenas amuebló la casa social y económica.'
            }
          ],
          keyTakeaways: [
            { badge: 'Artículos sociales de 1917', text: '3° = Educación | 27 = Tierra, subsuelo y petróleo | 123 = Derechos de los trabajadores.' },
            { badge: 'Presidentes del Maximato (1928-1934)', text: 'Emilio Portes Gil, Pascual Ortiz Rubio y Abelardo L. Rodríguez gobernaron bajo la influencia del "Jefe Máximo", Plutarco Elías Calles.' }
          ],
          commonMistakes: [
            {
              confusion: 'Confundir el presidente que fundó la SEP (Obregón) con el que fundó el IPN (Cárdenas) o con quien otorgó la autonomía a la UNAM (Portes Gil en 1929).',
              whyItHappens: 'Porque las tres son grandes instituciones educativas creadas entre 1921 y 1936.',
              howToAvoid: 'Asocia cada institución con su década: 1921 SEP = Obregón/Vasconcelos; 1929 Autonomía UNAM = Emilio Portes Gil; 1936 IPN = Lázaro Cárdenas.'
            }
          ],
          workedExamples: [
            {
              title: 'Relación entre planes revolucionarios y sus demandas',
              problem: '¿Qué documento desconoció al gobierno de Francisco I. Madero en noviembre de 1911 por incumplir la devolución inmediata de tierras a las comunidades campesinas?',
              steps: [
                'Descartar el Plan de San Luis (1910, proclamado por el propio Madero contra Díaz) y el Plan de Guadalupe (1913, de Carranza contra Huerta).',
                'Vincular la demanda agraria ("Tierra y Libertad") con Emiliano Zapata en Morelos.'
              ],
              answer: 'El Plan de Ayala.',
              reasoning: 'Emiliano Zapata proclamó el Plan de Ayala al exigir la restitución de ejidos, montes y aguas despojados por los hacendados.'
            }
          ],
          assessment: {
            multipleChoice: [
              {
                id: 'hmx4-mc1',
                question: 'Artículo de la Constitución de 1917 que establece la propiedad originaria de la Nación sobre las tierras, aguas y recursos del subsuelo:',
                options: ['Artículo 3°', 'Artículo 27', 'Artículo 123', 'Artículo 130'],
                correctIndex: 1,
                feedback: 'El artículo 27 regula la tenencia de la tierra, el reparto agrario y el dominio directo de la nación sobre los hidrocarburos y minerales.'
              },
              {
                id: 'hmx4-mc2',
                question: '¿Cuál de las siguientes acciones corresponde al gobierno de Lázaro Cárdenas (1934-1940)?',
                options: [
                  'La firma del Tratado de Libre Comercio de América del Norte',
                  'La creación de la Secretaría de Educación Pública con José Vasconcelos',
                  'La expropiación petrolera, el reparto agrario ejidal y la fundación del IPN',
                  'El otorgamiento del voto a la mujer en elecciones federales en 1953'
                ],
                correctIndex: 2,
                feedback: 'Cárdenas nacionalizó la industria petrolera en 1938, impulsó el ejido colectivo y fundó el Instituto Politécnico Nacional.'
              }
            ],
            trueFalse: [
              {
                id: 'hmx4-tf1',
                statement: 'Durante el gobierno de Adolfo Ruiz Cortines (1953) se reformó la Constitución para otorgar a la mujer el derecho al voto en todas las elecciones.',
                answer: true,
                feedback: 'Correcto. En octubre de 1953 se publicó la reforma constitucional que reconoció la ciudadanía plena y el sufragio femenino a nivel federal.'
              }
            ],
            openReflection: [
              {
                id: 'hmx4-or1',
                prompt: '¿Qué significó el paso "del país de un hombre al país de las instituciones" anunciado por Plutarco Elías Calles tras el asesinato de Álvaro Obregón en 1928?',
                guideAnswer: 'Significó dejar atrás las rebeliones armadas entre caudillos militares para dirimir la sucesión presidencial dentro de un partido político institucional (el PNR, fundado en 1929).'
              }
            ]
          },
          executiveSummary: {
            synthesis: 'La Revolución Mexicana articuló demandas políticas (Madero, Plan de San Luis), agrarias (Zapata, Plan de Ayala) y legalistas (Carranza, Plan de Guadalupe), plasmadas en la Constitución de 1917 (Arts. 3°, 27 y 123). El Estado posrevolucionario se consolidó con Calles (PNR) y Cárdenas (Pemex, ejido, IPN), transitando después por el Desarrollo Estabilizador y el Neoliberalismo.',
            mustRemember: [
              'Plan de San Luis (Madero) | Plan de Ayala (Zapata) | Plan de Guadalupe (Carranza).',
              'Constitución de 1917: Art. 3° (Educación), Art. 27 (Tierra/Petróleo), Art. 123 (Trabajo).',
              'Cardenismo (1934-1940): Fin del Maximato, reparto ejidal, expropiación petrolera (1938), IPN.',
              '1954-1970: Desarrollo Estabilizador | 1982 en adelante: Neoliberalismo.'
            ]
          },
          flashcards: [
            {
              id: 'hmx4-fc1',
              front: '¿Quién proclamó el Plan de Guadalupe en 1913 y con qué propósito?',
              back: 'Venustiano Carranza, para desconocer al gobierno usurpador de Victoriano Huerta y restaurar el orden constitucional.'
            },
            {
              id: 'hmx4-fc2',
              front: '¿Qué periodo económico mexicano (1954-1970) logró alto crecimiento industrial con baja inflación y paridad cambiaria fija?',
              back: 'El Desarrollo Estabilizador.'
            }
          ]
        }
      }
    ]
  },

  /* ==========================================================================
     MATERIA 4: HISTORIA UNIVERSAL
     ========================================================================== */
  {
    id: 'historia-universal',
    code: 'HUN',
    name: 'Historia Universal',
    area: 'Ciencias Sociales y Humanidades',
    description: 'Ilustración, revoluciones burguesas, imperialismo, guerras mundiales, Guerra Fría y mundo actual.',
    modules: [
      {
        id: 'hun-1',
        title: 'La Historia, las Revoluciones Burguesas y el siglo XIX',
        summary: 'Escuelas históricas, Ilustración, Revolución Industrial, Revolución Francesa y movimientos obreros.',
        estimatedMinutes: 30,
        relations: {
          prevModuleId: null,
          nextModuleId: 'hun-2',
          relatedConcepts: ['Ilustración', 'Revolución Industrial', 'Movimientos obreros']
        },
        capsule: {
          introduction: {
            overview: 'El mundo contemporáneo nació a finales del siglo XVIII con una doble revolución: la Revolución Industrial en Inglaterra (que transformó la economía con la máquina de vapor y la fábrica) y las Revoluciones Burguesas inspiradas en la Ilustración (Independencia de las 13 Colonias y Revolución Francesa), que derribaron el absolutismo.',
            whyItMatters: 'Las escuelas de interpretación histórica, las ideas ilustradas y los movimientos obreros del siglo XIX (ludismo, cartismo, socialismo) son preguntas recurrentes al inicio de la sección de Historia Universal.',
            connectionNote: 'Explica el auge industrial y burgués que en la segunda mitad del siglo XIX evolucionó hacia el Imperialismo colonial (Módulo 2).'
          },
          fundamentals: [
            {
              term: 'Escuelas de Interpretación Histórica',
              category: 'Historiografía',
              definition: 'Positivismo (Augusto Comte / Leopold von Ranke: hechos verificables y documentos escritos). Materialismo Histórico (Karl Marx: la lucha de clases y los modos de producción como motor de la historia). Escuela de los Annales (Marc Bloch y Lucien Febvre: historia total vinculada con economía, geografía y mentalidades).',
              keyIdea: 'Ranke/Comte = Documento exacto | Marx = Lucha de clases | Annales = Historia total.'
            },
            {
              term: 'La Ilustración y las Revoluciones Burguesas',
              category: 'Siglo de las Luces (XVIII)',
              definition: 'Movimiento intelectual que defendió la razón, la soberanía popular (Rousseau), la división de tres poderes (Montesquieu) y los derechos naturales (Locke). Inspiró la Independencia de las 13 Colonias (1776) y la Revolución Francesa (1789, Declaración de los Derechos del Hombre y del Ciudadano).',
              keyIdea: 'La burguesía desplazó a la nobleza feudal y al absolutismo monárquico.'
            },
            {
              term: 'Revolución Industrial y Movimientos Obreros',
              category: 'Economía y sociedad',
              definition: 'Inició en Inglaterra con el carbón, el textil y la máquina de vapor. Frente a la explotación del proletariado surgieron: Ludismo (destrucción de máquinas), Cartismo (Carta del Pueblo pidiendo sufragio y derechos laborales en el Parlamento inglés), Socialismo Utópico y Socialismo Científico (Marx y Engels).',
              keyIdea: 'Ludismo = Romper máquinas | Cartismo = Voto y leyes obreras en el Parlamento.'
            }
          ],
          deepDive: [
            {
              subtitle: 'Primera vs. Segunda Revolución Industrial y Unificaciones Nacionales',
              explanation: 'No confundas las fuentes de energía de ambas fases industriales: la Primera Revolución Industrial (siglo XVIII, Inglaterra) usó el carbón y la máquina de vapor en la industria textil y el ferrocarril. La Segunda Revolución Industrial (finales del siglo XIX) introdujo el petróleo, la electricidad y el acero. Asimismo, en 1870-1871 el nacionalismo europeo logró la unificación de Italia (Cavour y Garibaldi) y la de Alemania (Otto von Bismarck).',
              practicalExample: 'Si el examen pregunta qué movimiento obrero inglés envió peticiones al Parlamento para obtener el sufragio universal masculino y jornadas laborales reguladas, la respuesta es el Cartismo.',
              realWorldCase: 'La división actual del Estado moderno en Poder Ejecutivo, Legislativo y Judicial proviene directamente de la obra "El espíritu de las leyes" del ilustrado francés Montesquieu.',
              analogy: 'La Ilustración encendió la luz intelectual de los derechos ciudadanos, mientras la Revolución Industrial encendió la caldera económica del capitalismo moderno.'
            }
          ],
          keyTakeaways: [
            { badge: 'Código Napoleónico', text: 'A pesar de sus guerras en Europa, Napoleón Bonaparte difundió por el continente los principios liberales del Código Civil y el fin del feudalismo; tras su derrota en Waterloo (1815), el Congreso de Viena y la Santa Alianza intentaron restaurar el absolutismo.' },
            { badge: 'Independencia de las 13 Colonias (1776)', text: 'Primer movimiento que llevó a la práctica las ideas ilustradas creando una república federal con constitución escrita (Acta de Independencia redactada por Thomas Jefferson).' }
          ],
          commonMistakes: [
            {
              confusion: 'Confundir el Ludismo con el Cartismo.',
              whyItHappens: 'Porque ambos fueron los primeros movimientos obreros surgidos en Inglaterra.',
              howToAvoid: 'Recuerda a Ned Ludd: Ludismo = culpar y destruir las máquinas; Cartismo = "Carta del Pueblo" enviada pacíficamente al Parlamento por derechos políticos.'
            }
          ],
          workedExamples: [
            {
              title: 'Identificación de escuela historiográfica',
              problem: '¿Qué corriente de interpretación histórica sostiene que el modo de producción económica y la lucha de clases determinan el devenir de las sociedades?',
              steps: [
                'Analizar los conceptos clave del enunciado: "modo de producción" y "lucha de clases".',
                'Vincularlos con el pensamiento de Karl Marx y Friedrich Engels.'
              ],
              answer: 'Materialismo histórico.',
              reasoning: 'Para el materialismo histórico, la estructura económica y las contradicciones entre clases sociales (amo-esclavo, señor-siervo, burguesía-proletariado) explican las transformaciones históricas.'
            }
          ],
          assessment: {
            multipleChoice: [
              {
                id: 'hun1-mc1',
                question: 'Filósofo ilustrado que propuso la división del poder público en Ejecutivo, Legislativo y Judicial para evitar el despotismo:',
                options: ['Voltaire', 'Montesquieu', 'Rousseau', 'Diderot'],
                correctIndex: 1,
                feedback: 'El barón de Montesquieu formuló la teoría de la separación y equilibrio de los tres poderes en su obra "El espíritu de las leyes".'
              },
              {
                id: 'hun1-mc2',
                question: 'Movimiento obrero de principios del siglo XIX cuyos integrantes destruían los telares mecánicos al considerarlos culpables del desempleo:',
                options: ['Cartismo', 'Ludismo', 'Anarquismo', 'Cooperativismo'],
                correctIndex: 1,
                feedback: 'El ludismo fue la primera protesta espontánea de los artesanos textiles contra la mecanización industrial.'
              }
            ],
            trueFalse: [
              {
                id: 'hun1-tf1',
                statement: 'El Congreso de Viena (1814-1815) tuvo como propósito restaurar las monarquías absolutistas en Europa tras la caída de Napoleón Bonaparte.',
                answer: true,
                feedback: 'Correcto. Las potencias europeas formaron la Santa Alianza para frenar las revoluciones liberales y restaurar el Antiguo Régimen.'
              }
            ],
            openReflection: [
              {
                id: 'hun1-or1',
                prompt: '¿Qué diferencia hubo entre el Socialismo Utópico y el Socialismo Científico?',
                guideAnswer: 'El socialismo utópico (Saint-Simon, Fourier, Owen) proponía comunidades cooperativas ideales apelando a la buena voluntad; el socialismo científico (Marx y Engels) analizó las leyes económicas del capitalismo y planteó la organización política del proletariado.'
              }
            ]
          },
          executiveSummary: {
            synthesis: 'La Ilustración y la Revolución Francesa instauraron los derechos ciudadanos y la división de poderes, mientras la Revolución Industrial dio origen al capitalismo fabril y a los movimientos obreros (ludismo, cartismo y socialismo). En 1871 culminaron las unificaciones de Italia y Alemania.',
            mustRemember: [
              'Ilustración: Montesquieu (3 poderes), Rousseau (soberanía popular), Diderot (Enciclopedia).',
              '1ª Rev. Industrial: Carbón y vapor | 2ª Rev. Industrial: Petróleo, electricidad y acero.',
              'Ludismo = destrucción de máquinas | Cartismo = demandas políticas al Parlamento.'
            ]
          },
          flashcards: [
            {
              id: 'hun1-fc1',
              front: '¿Qué escuela histórica fundada por Marc Bloch y Lucien Febvre propone una "historia total" interdisciplinaria?',
              back: 'La Escuela de los Annales.'
            },
            {
              id: 'hun1-fc2',
              front: '¿Quién fue el principal artífice político ("Canciller de Hierro") de la unificación de Alemania en 1871?',
              back: 'Otto von Bismarck.'
            }
          ]
        }
      },
      {
        id: 'hun-2',
        title: 'Imperialismo y Primera Guerra Mundial',
        summary: 'Reparto colonial de África y Asia, alianzas europeas, Gran Guerra (1914-1918), Revolución Rusa y Tratado de Versalles.',
        estimatedMinutes: 30,
        relations: {
          prevModuleId: 'hun-1',
          nextModuleId: 'hun-3',
          relatedConcepts: ['Imperialismo', 'Triple Entente y Triple Alianza', 'Tratado de Versalles']
        },
        capsule: {
          introduction: {
            overview: 'A finales del siglo XIX la Segunda Revolución Industrial impulsó a las potencias a repartirse África y Asia en busca de materias primas y mercados (Imperialismo). La competencia colonial y el armamentismo desembocaron en la Primera Guerra Mundial (1914-1918) y en la Revolución Rusa de 1917.',
            whyItMatters: 'Las causas de la Primera Guerra Mundial, los bloques de alianzas, la Revolución Bolchevique y las sanciones del Tratado de Versalles son reactivos constantes.',
            connectionNote: 'Las duras condiciones del Tratado de Versalles (1919) explican directamente el ascenso del nazismo y el estallido de la Segunda Guerra Mundial (Módulo 3).'
          },
          fundamentals: [
            {
              term: 'Imperialismo Monopolista (Siglo XIX)',
              category: 'Expansión colonial',
              definition: 'Dominio económico, político y militar de las potencias industriales (Reino Unido, Francia, Alemania, Bélgica, EE. UU. y Japón) sobre África y Asia. En la Conferencia de Berlín (1884-1885) las potencias europeas se repartieron África.',
              keyIdea: 'Buscaban materias primas baratas, mano de obra y mercados donde invertir excedentes de capital.'
            },
            {
              term: 'Primera Guerra Mundial (1914-1918)',
              category: 'La Gran Guerra',
              definition: 'Enfrentó a las Potencias Centrales / Triple Alianza (Alemania, Imperio Austrohúngaro, Imperio Otomano; Italia inició aquí pero cambió de bando en 1915) contra los Aliados / Triple Entente (Francia, Reino Unido, Rusia; más EE. UU. desde 1917). El pretexto detonante fue el asesinato del archiduque Francisco Fernando en Sarajevo (28 de junio de 1914).',
              keyIdea: 'Fases: Guerra de movimientos -> Guerra de trincheras -> Salida de Rusia y entrada de EE. UU. (1917).'
            },
            {
              term: 'Revolución Rusa (1917) y Tratado de Versalles (1919)',
              category: 'Nuevo orden',
              definition: 'En Rusia cayó el zar Nicolás II (febrero de 1917) y en octubre los bolcheviques liderados por Lenin tomaron el poder instaurando el primer Estado socialista (URSS) y firmando la paz de Brest-Litovsk. En 1919 el Tratado de Versalles desarmó e impuso severas indemnizaciones a Alemania.',
              keyIdea: 'Los 14 Puntos de Woodrow Wilson propusieron crear la Sociedad de las Naciones.'
            }
          ],
          deepDive: [
            {
              subtitle: 'Causas profundas vs. Chispa detonante de la Primera Guerra Mundial',
              explanation: 'Distingue claramente entre las causas estructurales (la rivalidad imperialista por colonias, el nacionalismo en los Balcanes y la "Paz Armada" basada en la carrera armamentista y el sistema de alianzas secretas) y el hecho detonante inmediato: el atentado de Sarajevo donde un nacionalista serbio asesinó al heredero de Austria-Hungría, Francisco Fernando.',
              practicalExample: 'En 1917 ocurrieron dos giros decisivos: Rusia abandonó la guerra por su Revolución Bolchevique, y Estados Unidos entró a favor de la Entente tras el hundimiento del Lusitania y la intercepción del Telegrama Zimmermann (donde Alemania proponía una alianza a México).',
              realWorldCase: 'El mapa actual de Europa Oriental y Medio Oriente surgió de la desintegración de cuatro grandes imperios al terminar la Primera Guerra Mundial: el Alemán, el Austrohúngaro, el Ruso y el Otomano.',
              analogy: 'La Paz Armada de 1871 a 1914 llenó de pólvora la habitación europea con alianzas y cañones; el asesinato de Sarajevo fue simplemente el cerillo que la hizo estallar.'
            }
          ],
          keyTakeaways: [
            { badge: 'Mencheviques vs. Bolcheviques', text: 'En la Revolución Rusa de 1917, la revolución de febrero (moderada/burguesa, Kerenski y mencheviques) derrocó al zar; la de octubre (radical socialista, Lenin, Trotski y los soviets bolcheviques) instauró el gobierno comunista.' },
            { badge: 'Tratado de Versalles (1919)', text: 'Obligó a Alemania a devolver Alsacia y Lorena a Francia, reducir su ejército a 100 mil hombres, perder sus colonias y pagar cuantiosas reparaciones de guerra.' }
          ],
          commonMistakes: [
            {
              confusion: 'Confundir la Sociedad de las Naciones (1919) con la ONU (1945).',
              whyItHappens: 'Ambas fueron organizaciones internacionales creadas tras una guerra mundial para preservar la paz.',
              howToAvoid: 'Primera Guerra Mundial (1919, 14 Puntos de Wilson) = Sociedad de las Naciones; Segunda Guerra Mundial (1945, Conferencia de San Francisco) = ONU.'
            }
          ],
          workedExamples: [
            {
              title: 'Consecuencia geopolítica de la Primera Guerra Mundial',
              problem: '¿Cuál fue una de las principales consecuencias políticas y territoriales al finalizar la Primera Guerra Mundial?',
              steps: [
                'Recordar qué potencias fueron derrotadas en 1918: Alemania, Austria-Hungría y el Imperio Otomano.',
                'Identificar que del desmembramiento del Imperio Austrohúngaro y Ruso nacieron nuevos Estados nacionales (Polonia, Checoslovaquia, Yugoslavia, Hungría) y se creó la Sociedad de las Naciones.'
              ],
              answer: 'La desaparición del Imperio Austrohúngaro, el surgimiento de nuevas naciones en Europa y la creación de la Sociedad de las Naciones.',
              reasoning: 'Los tratados de paz de París (1919) rediseñaron el mapa europeo y establecieron el primer organismo internacional de paz.'
            }
          ],
          assessment: {
            multipleChoice: [
              {
                id: 'hun2-mc1',
                question: '¿Qué potencias integraban originalmente la Triple Entente al estallar la Primera Guerra Mundial en 1914?',
                options: [
                  'Alemania, Austria-Hungría e Italia',
                  'Francia, Reino Unido y Rusia',
                  'Alemania, Japón e Italia',
                  'Estados Unidos, Unión Soviética y China'
                ],
                correctIndex: 1,
                feedback: 'La Triple Entente estuvo conformada por Francia, Reino Unido y el Imperio Ruso.'
              },
              {
                id: 'hun2-mc2',
                question: 'Líder de los bolcheviques que encabezó la Revolución de Octubre de 1917 en Rusia bajo la consigna "Paz, pan y tierra":',
                options: [
                  'Nicolás II',
                  'Alejandro Kerenski',
                  'Vladimir Ilich Lenin',
                  'Mijaíl Gorbachov'
                ],
                correctIndex: 2,
                feedback: 'Lenin dirigió al partido bolchevique y a los soviets obreros para tomar el poder en octubre de 1917 y retirar a Rusia de la Gran Guerra.'
              }
            ],
            trueFalse: [
              {
                id: 'hun2-tf1',
                statement: 'En la Conferencia de Berlín (1884-1885) las potencias imperialistas europeas acordaron las reglas para el reparto colonial del continente africano.',
                answer: true,
                feedback: 'Correcto. Convocada por Bismarck, reguló la ocupación colonial de África sin participación de ningún representante africano.'
              }
            ],
            openReflection: [
              {
                id: 'hun2-or1',
                prompt: '¿Por qué se afirma que el Tratado de Versalles de 1919 sembró la semilla de la Segunda Guerra Mundial?',
                guideAnswer: 'Porque humilló económica y territorialmente a Alemania, provocando una grave crisis y un resentimiento nacionalista que Adolf Hitler capitalizó para ascender al poder.'
              }
            ]
          },
          executiveSummary: {
            synthesis: 'La expansión imperialista del siglo XIX y la Paz Armada condujeron a la Primera Guerra Mundial (1914-1918) entre la Triple Entente y las Potencias Centrales. En 1917 triunfó la Revolución Bolchevique de Lenin en Rusia y en 1919 el Tratado de Versalles impuso duras sanciones a Alemania y creó la Sociedad de las Naciones.',
            mustRemember: [
              'Imperialismo = Materias primas y mercados (Conferencia de Berlín: reparto de África).',
              'Detonante 1914: Asesinato del archiduque Francisco Fernando en Sarajevo.',
              '1917: Revolución Bolchevique (Lenin, URSS) y entrada de EE. UU. (Telegrama Zimmermann).',
              '1919: Tratado de Versalles y Sociedad de las Naciones (14 puntos de Wilson).'
            ]
          },
          flashcards: [
            {
              id: 'hun2-fc1',
              front: '¿Qué tratado firmó el gobierno bolchevique de Lenin en marzo de 1918 para retirar a Rusia de la Primera Guerra Mundial?',
              back: 'El Tratado de Brest-Litovsk (con Alemania y las Potencias Centrales).'
            },
            {
              id: 'hun2-fc2',
              front: '¿Qué documento del presidente estadounidense Woodrow Wilson sirvió de base para crear la Sociedad de las Naciones?',
              back: 'El discurso de los Catorce Puntos de Wilson (1918).'
            }
          ]
        }
      },
      {
        id: 'hun-3',
        title: 'Periodo entreguerras y Segunda Guerra Mundial',
        summary: 'Crisis de 1929, New Deal, regímenes totalitarios, Segunda Guerra Mundial (1939-1945) y creación de la ONU.',
        estimatedMinutes: 35,
        relations: {
          prevModuleId: 'hun-2',
          nextModuleId: 'hun-4',
          relatedConcepts: ['Gran Depresión de 1929', 'Totalitarismos', 'Segunda Guerra Mundial']
        },
        capsule: {
          introduction: {
            overview: 'Entre 1919 y 1939 el mundo sufrió la Gran Depresión económica de 1929 y el ascenso de regímenes totalitarios ultranacionalistas en Italia, Alemania y Japón, cuya política expansionista desató la Segunda Guerra Mundial (1939-1945).',
            whyItMatters: 'Las características comunes de los totalitarismos (fascismo y nazismo), el New Deal de Roosevelt y las etapas de la Segunda Guerra Mundial son temas fijos en el examen.',
            connectionNote: 'La derrota del Eje en 1945 dejó a Estados Unidos y a la Unión Soviética como las dos superpotencias que protagonizaron la Guerra Fría (Módulo 4).'
          },
          fundamentals: [
            {
              term: 'Crisis de 1929 y el New Deal',
              category: 'Economía de entreguerras',
              definition: 'La sobreproducción industrial y la especulación bursátil provocaron la caída de la Bolsa de Wall Street en octubre de 1929 ("Jueves Negro"). El presidente Franklin D. Roosevelt aplicó el New Deal (intervención del Estado en la economía, obras públicas y empleo).',
              keyIdea: '1929 = Sobreproducción y quiebra bursátil | New Deal = Estado interventor (Keynesianismo).'
            },
            {
              term: 'Regímenes Totalitarios (Eje Berlín-Roma-Tokio)',
              category: 'Fascismo, Nazismo y Militarismo',
              definition: 'Fascismo en Italia (Benito Mussolini), Nazismo en Alemania (Adolf Hitler) y Militarismo en Japón (Hirohito / Hideki Tojo). Compartieron: partido único, culto al líder carismático, nacionalismo extremo, anticomunismo, militarismo expansionista y supresión de libertades individuales.',
              keyIdea: 'Antes de 1939 ensayaron sus armas apoyando a Francisco Franco en la Guerra Civil Española (1936-1939).'
            },
            {
              term: 'Segunda Guerra Mundial (1939-1945)',
              category: 'Conflicto global',
              definition: 'Inició el 1 de septiembre de 1939 con la invasión alemana a Polonia (Blitzkrieg o guerra relámpago). En 1941 se globalizó con la invasión nazi a la URSS (Operación Barbarroja) y el ataque japonés a Pearl Harbor. Concluyó en 1945 con la toma de Berlín (mayo) y las bombas atómicas sobre Hiroshima y Nagasaki (agosto).',
              keyIdea: 'Conferencias de Yalta y Potsdam (1945) acordaron la división de Alemania y el nacimiento de la ONU.'
            }
          ],
          deepDive: [
            {
              subtitle: 'Momentos de inflexión de la Segunda Guerra Mundial (1939-1945)',
              explanation: 'Divide el conflicto en dos grandes mitades: 1) Ofensiva del Eje (1939-1942): Alemania conquista Polonia, Francia y gran parte de Europa; Japón domina el Pacífico. 2) Contraofensiva Aliada (1942-1945): la URSS frena a Alemania en la Batalla de Stalingrado (frente oriental), EE. UU. vence a Japón en Midway (Pacífico), los Aliados desembarcan en Normandía el "Día D" (6 de junio de 1944, frente occidental) y acorralan a Berlín.',
              practicalExample: 'Si te preguntan cuál fue el hecho exacto que dio inicio formal a la Segunda Guerra Mundial el 1 de septiembre de 1939, la respuesta es la invasión de Alemania a Polonia.',
              realWorldCase: 'La Organización de las Naciones Unidas (ONU), el Fondo Monetario Internacional (FMI) y el Banco Mundial (acuerdos de Bretton Woods, 1944) se diseñaron al final de esta guerra para evitar una nueva catástrofe económica y militar.',
              analogy: 'La Primera Guerra Mundial fue una guerra estática de trincheras; la Segunda fue una guerra motorizada y aérea de movimiento total (tanques, aviones, radares y energía nuclear).'
            }
          ],
          keyTakeaways: [
            { badge: 'Rasgos de todo totalitarismo', text: 'Estado todopoderoso, partido único, policía política secreta, propaganda masiva, racismo/xenofobia y expansionismo territorial ("espacio vital" o Lebensraum).' },
            { badge: 'Conferencias de 1945', text: 'En Yalta y Potsdam (Roosevelt/Truman, Churchill/Attlee y Stalin) se decidió desmilitarizar y dividir a Alemania y Berlín en cuatro zonas de ocupación (EE. UU., URSS, Reino Unido y Francia).' }
          ],
          commonMistakes: [
            {
              confusion: 'Pensar que Estados Unidos entró a la Segunda Guerra Mundial en 1939.',
              whyItHappens: 'Por su protagonismo cinematográfico en todo el conflicto.',
              howToAvoid: 'En 1939 iniciaron Alemania, Polonia, Francia y Reino Unido. Tanto la URSS (invadida por Hitler) como Estados Unidos (atacado en Pearl Harbor) entraron hasta 1941.'
            }
          ],
          workedExamples: [
            {
              title: 'Identificación de características de los regímenes totalitarios',
              problem: '¿Qué rasgos políticos e ideológicos tuvieron en común el fascismo italiano y el nacionalsocialismo alemán durante el periodo entreguerras?',
              steps: [
                'Descartar opciones que hablen de democracia parlamentaria, pluripartidismo o liberalismo económico.',
                'Identificar los pilares totalitarios: partido único, nacionalismo exacerbado, militarismo, corporativismo estatal y rechazo al comunismo y a la democracia liberal.'
              ],
              answer: 'Nacionalismo extremo, régimen de partido único, militarismo expansionista y supresión de garantías individuales.',
              reasoning: 'Tanto Mussolini en Italia como Hitler en Alemania subordinaron al individuo frente al Estado totalitario.'
            }
          ],
          assessment: {
            multipleChoice: [
              {
                id: 'hun3-mc1',
                question: 'Política económica implementada por el presidente Franklin D. Roosevelt para reactivar la economía estadounidense tras la Gran Depresión de 1929:',
                options: ['Plan Marshall', 'New Deal (Nuevo Trato)', 'Perestroika', 'Doctrina Monroe'],
                correctIndex: 1,
                feedback: 'El New Deal impulsó la inversión estatal en infraestructura, subsidios agrícolas y regulación financiera.'
              },
              {
                id: 'hun3-mc2',
                question: 'Acontecimiento militar del 1 de septiembre de 1939 que marcó el inicio de la Segunda Guerra Mundial:',
                options: [
                  'El ataque japonés a la base naval de Pearl Harbor',
                  'El desembarco aliado en las playas de Normandía',
                  'La invasión del ejército alemán a Polonia',
                  'El bombardeo aéreo sobre la ciudad de Guernica'
                ],
                correctIndex: 2,
                feedback: 'La invasión de Alemania a Polonia llevó a Francia y al Reino Unido a declararle la guerra al Tercer Reich.'
              }
            ],
            trueFalse: [
              {
                id: 'hun3-tf1',
                statement: 'La Batalla de Stalingrado (1942-1943) marcó el inicio del retroceso del ejército alemán en el frente oriental frente a la Unión Soviética.',
                answer: true,
                feedback: 'Correcto. Fue la derrota militar decisiva que frenó el avance nazi en territorio soviético.'
              }
            ],
            openReflection: [
              {
                id: 'hun3-or1',
                prompt: '¿Qué relación existió entre la Crisis de 1929 y el ascenso de Adolf Hitler al poder en Alemania en 1933?',
                guideAnswer: 'El desempleo masivo y la quiebra económica causados por la depresión de 1929 desacreditaron a la República de Weimar y favorecieron que millones de alemanes apoyaran el discurso ultranacionalista de Hitler.'
              }
            ]
          },
          executiveSummary: {
            synthesis: 'La crisis de 1929 (combatida en EE. UU. con el New Deal) y el resentimiento posguerra impulsaron al fascismo italiano, el nazismo alemán y el militarismo japonés. Su expansionismo provocó la Segunda Guerra Mundial (1939-1945), desde la invasión a Polonia hasta Hiroshima y Nagasaki, dando origen a la ONU y al orden bipolar.',
            mustRemember: [
              '1929: Caída de Wall Street -> New Deal de F. D. Roosevelt.',
              'Eje: Alemania (Hitler), Italia (Mussolini), Japón (Hirohito/Tojo).',
              'Aliados: Reino Unido, Francia, URSS y EE. UU.',
              '1939: Invasión a Polonia | 1941: Barbarroja y Pearl Harbor | 1945: Yalta, Potsdam y ONU.'
            ]
          },
          flashcards: [
            {
              id: 'hun3-fc1',
              front: '¿Qué operación militar desembarcó a las tropas aliadas en las costas de Francia el 6 de junio de 1944 ("Día D")?',
              back: 'El Desembarco de Normandía (Operación Overlord).'
            },
            {
              id: 'hun3-fc2',
              front: '¿Qué se acordó en las conferencias de Yalta y Potsdam en 1945 respecto a Alemania?',
              back: 'Su desmilitarización, desnazificación y división en cuatro zonas de ocupación aliadas.'
            }
          ]
        }
      },
      {
        id: 'hun-4',
        title: 'Guerra Fría y Globalización',
        summary: 'Mundo bipolar (EE. UU. vs. URSS), conflictos periféricos, caída del bloque soviético y globalización.',
        estimatedMinutes: 35,
        relations: {
          prevModuleId: 'hun-3',
          nextModuleId: null,
          relatedConcepts: ['Bipolaridad', 'Perestroika y Glasnost', 'Globalización']
        },
        capsule: {
          introduction: {
            overview: 'De 1945 a 1991 el mundo estuvo dividido en dos bloques antagónicos (Guerra Fría): el capitalista encabezado por Estados Unidos y el socialista liderado por la Unión Soviética. Tras las reformas de Gorbachov, la caída del Muro de Berlín (1989) y la desintegración de la URSS (1991), se consolidó la globalización económica multipolar.',
            whyItMatters: 'El cuadro comparativo entre organismos capitalistas y socialistas (Plan Marshall vs. COMECON, OTAN vs. Pacto de Varsovia) y las reformas de la Perestroika y Glasnost aparecen en prácticamente todos los exámenes.',
            connectionNote: 'Cierra el bloque de Historia Universal y se vincula directamente con los bloques económicos actuales del Módulo 3 de Geografía.'
          },
          fundamentals: [
            {
              term: 'Instituciones del Mundo Bipolar',
              category: 'Capitalismo vs. Socialismo',
              definition: 'Bloque Capitalista (EE. UU.): Doctrina Truman (contención del comunismo), Plan Marshall (ayuda económica a Europa Occidental) y OTAN (alianza militar, 1949). Bloque Socialista (URSS): Doctrina Jdanov/Kominform, COMECON (integración económica socialista) y Pacto de Varsovia (alianza militar, 1955).',
              keyIdea: 'Económico: Plan Marshall vs. COMECON | Militar: OTAN vs. Pacto de Varsovia.'
            },
            {
              term: 'Conflictos de la Guerra Fría y Descolonización',
              category: 'Enfrentamientos indirectos',
              definition: 'Las dos superpotencias nunca se declararon la guerra directa por temor a la destrucción mutua nuclear, pero se enfrentaron en terceros países: Guerra de Corea (división en el paralelo 38°), Revolución Cubana (1959) y Crisis de los Misiles (1962), Guerra de Vietnam y carrera espacial.',
              keyIdea: 'En Asia y África ocurrió la descolonización (independencia de la India con Gandhi en 1947, Conferencia de Bandung y Países No Alineados).'
            },
            {
              term: 'Fin de la Guerra Fría (1985-1991) y Globalización',
              category: 'Nuevo Orden Mundial',
              definition: 'Mijaíl Gorbachov impulsó la Perestroika (reestructuración económica) y la Glasnost (transparencia política y libertad de expresión). En noviembre de 1989 cayó el Muro de Berlín y en diciembre de 1991 se desintegró la URSS, dando paso a la globalización neoliberal y a bloques como la Unión Europea.',
              keyIdea: 'Perestroika = Economía | Glasnost = Apertura política.'
            }
          ],
          deepDive: [
            {
              subtitle: 'Tabla mental para no confundir ningún organismo de la Guerra Fría',
              explanation: 'Cuando el reactivo pregunte por el equivalente soviético de un plan estadounidense (o viceversa), identifica primero si es político, económico o militar: 1) Político/Ideológico: Doctrina Truman (EE. UU.) ↔ Kominform (URSS). 2) Económico: Plan Marshall (EE. UU.) ↔ COMECON o CAME (URSS). 3) Militar: OTAN (EE. UU.) ↔ Pacto de Varsovia (URSS).',
              practicalExample: 'La Crisis de los Misiles en Cuba (octubre de 1962, entre John F. Kennedy y Nikita Jrushchov) fue el momento en que el mundo estuvo más cerca de una guerra nuclear directa.',
              realWorldCase: 'La actual división entre Corea del Norte y Corea del Sur en el paralelo 38° es una herencia directa de la Guerra de Corea (1950-1953) durante la Guerra Fría.',
              analogy: 'La Guerra Fría fue una partida de ajedrez mundial entre dos grandes maestros con armas nucleares: en vez de golpearse entre ellos, movían peones y alfiles en tableros regionales (Corea, Vietnam, Cuba, Afganistán).'
            }
          ],
          keyTakeaways: [
            { badge: 'Muro de Berlín (1961-1989)', text: 'Fue construido en 1961 por la República Democrática Alemana (socialista) y su caída el 9 de noviembre de 1989 simbolizó el fin de la Guerra Fría y la reunificación alemana (1990).' },
            { badge: 'Tercera Revolución Industrial', text: 'La posguerra fría aceleró la revolución científico-tecnológica basada en la microelectrónica, la informática, las telecomunicaciones (Internet) y la biotecnología.' }
          ],
          commonMistakes: [
            {
              confusion: 'Invertir los significados de Perestroika y Glasnost.',
              whyItHappens: 'Por ser dos términos rusos introducidos simultáneamente por Mijaíl Gorbachov en 1985.',
              howToAvoid: 'Asocia "Perestroika" con "Reestructuración" (ambas tienen varias R -> Economía y producción) y "Glasnost" con "Garganta/Voz" (Transparencia política y libertad de prensa).'
            }
          ],
          workedExamples: [
            {
              title: 'Contraste de alianzas militares y económicas en la Guerra Fría',
              problem: '¿Qué organismos creó la Unión Soviética para contrarrestar al Plan Marshall y a la OTAN respectivamente?',
              steps: [
                'Recordar que el Plan Marshall fue de asistencia económica y la OTAN una alianza militar.',
                'Buscar primero el organismo económico soviético (COMECON) y luego el militar (Pacto de Varsovia).'
              ],
              answer: 'El COMECON (Consejo de Ayuda Mutua Económica) y el Pacto de Varsovia.',
              reasoning: 'El COMECON integró las economías de Europa Oriental en 1949 y el Pacto de Varsovia unificó sus fuerzas armadas en 1955.'
            }
          ],
          assessment: {
            multipleChoice: [
              {
                id: 'hun4-mc1',
                question: 'Reforma implementada por Mijaíl Gorbachov en la Unión Soviética para reestructurar y flexibilizar la economía planificada:',
                options: ['Glasnost', 'Perestroika', 'Kominform', 'Plan Marshall'],
                correctIndex: 1,
                feedback: 'La Perestroika ("reestructuración") buscó modernizar y descentralizar la economía soviética, mientras que la Glasnost promovió la apertura política.'
              },
              {
                id: 'hun4-mc2',
                question: '¿Qué acontecimiento de noviembre de 1989 es considerado el símbolo histórico del fin del mundo bipolar en Europa?',
                options: [
                  'La firma del Tratado de Versalles',
                  'La crisis de los misiles en Cuba',
                  'La caída del Muro de Berlín',
                  'La Guerra del Golfo Pérsico'
                ],
                correctIndex: 2,
                feedback: 'El derribo del Muro de Berlín abrió paso a la reunificación de Alemania en 1990 y al colapso del bloque socialista europeo.'
              }
            ],
            trueFalse: [
              {
                id: 'hun4-tf1',
                statement: 'Durante la Guerra Fría, Estados Unidos y la Unión Soviética se enfrentaron de manera indirecta en conflictos regionales como las guerras de Corea y Vietnam.',
                answer: true,
                feedback: 'Correcto. Ambos bloques apoyaron militar y financieramente a bandos opuestos sin llegar a un choque nuclear directo entre Washington y Moscú.'
              }
            ],
            openReflection: [
              {
                id: 'hun4-or1',
                prompt: '¿Qué características definen al proceso de Globalización surgido tras el fin de la Guerra Fría?',
                guideAnswer: 'La interdependencia financiera y comercial mundial, la formación de bloques económicos (Unión Europea, T-MEC, Cuenca del Pacífico), el libre mercado neoliberal y la revolución digital.'
              }
            ]
          },
          executiveSummary: {
            synthesis: 'La Guerra Fría dividió al planeta entre el bloque capitalista (EE. UU., Plan Marshall, OTAN) y el socialista (URSS, COMECON, Pacto de Varsovia), enfrentados en Corea, Cuba y Vietnam. Las reformas de Gorbachov (Perestroika y Glasnost), la caída del Muro de Berlín (1989) y el fin de la URSS (1991) dieron paso a la globalización.',
            mustRemember: [
              'EE. UU.: Doctrina Truman, Plan Marshall (económico), OTAN (militar).',
              'URSS: Kominform, COMECON (económico), Pacto de Varsovia (militar).',
              'Gorbachov: Perestroika (economía) y Glasnost (apertura política).',
              '1989: Caída del Muro de Berlín | 1991: Desintegración de la URSS.'
            ]
          },
          flashcards: [
            {
              id: 'hun4-fc1',
              front: '¿Cuál era el objetivo del Plan Marshall impulsado por Estados Unidos en 1947?',
              back: 'Otorgar ayuda financiera para reconstruir Europa Occidental tras la Segunda Guerra Mundial y frenar el avance del comunismo.'
            },
            {
              id: 'hun4-fc2',
              front: '¿Qué diferencia hay entre la Perestroika y la Glasnost?',
              back: 'Perestroika fue la reestructuración económica soviética; Glasnost fue la apertura política, transparencia y libertad de expresión.'
            }
          ]
        }
      }
    ]
  },

  /* ==========================================================================
     MATERIA 5: BIOLOGÍA
     ========================================================================== */
  {
    id: 'biologia',
    code: 'BIO',
    name: 'Biología',
    area: 'Ciencias Biológicas y de la Salud',
    description: 'Célula, biomoléculas, fotosíntesis, respiración celular, reproducción y genética.',
    modules: [
      {
        id: 'bio-1',
        title: 'La célula: estructura, biomoléculas y función',
        summary: 'Teoría celular, carbohidratos, lípidos, proteínas, ácidos nucleicos y organelos celulares.',
        estimatedMinutes: 30,
        relations: {
          prevModuleId: null,
          nextModuleId: 'bio-2',
          relatedConcepts: ['Teoría celular', 'Biomoléculas', 'Célula procariota y eucariota']
        },
        capsule: {
          introduction: {
            overview: 'La célula es la unidad mínima anatómica, fisiológica y de origen de todo ser vivo. Está constituida por biomoléculas orgánicas (carbohidratos, lípidos, proteínas y ácidos nucleicos) y se clasifica en procariota (sin núcleo definido) y eucariota (con núcleo y organelos membranosos).',
            whyItMatters: 'Los postulados de la teoría celular, la función de cada biomolécula y el organelo encargado de cada proceso (mitocondria, ribosoma, cloroplasto, lisosoma) son preguntas obligadas en Biología.',
            connectionNote: 'Conocer las mitocondrias y los cloroplastos en este módulo te permitirá comprender dónde ocurren la respiración y la fotosíntesis en el Módulo 2.'
          },
          fundamentals: [
            {
              term: 'Postulados de la Teoría Celular',
              category: 'Schleiden, Schwann y Virchow',
              definition: '1) Unidad anatómica/estructural: todos los seres vivos están formados por una o más células. 2) Unidad fisiológica: todas las reacciones metabólicas ocurren dentro de la célula. 3) Unidad de origen (Virchow): toda célula proviene de otra célula preexistente (Omnis cellula e cellula).',
              keyIdea: 'Robert Hooke acuñó la palabra "célula" observando corcho; Schleiden, Schwann y Virchow formularon la teoría.'
            },
            {
              term: 'Biomoléculas Orgánicas (CHONPS)',
              category: 'Bioquímica celular',
              definition: 'Carbohidratos (glucosa, almidón, glucógeno, celulosa: energía inmediata y estructural). Lípidos (grasas, fosfolípidos, esteroides: reserva energética a largo plazo y membrana). Proteínas (formadas por aminoácidos unidos por enlaces peptídicos: enzimas, anticuerpos, colágeno, hemoglobina). Ácidos nucleicos (ADN y ARN, formados por nucleótidos: información genética).',
              keyIdea: 'Aminoácidos -> Proteínas | Monosacáridos -> Carbohidratos | Nucleótidos -> ADN y ARN.'
            },
            {
              term: 'Organelos Celulares Esenciales',
              category: 'Célula eucariota',
              definition: 'Mitocondria (respiración aerobia y síntesis de ATP). Cloroplasto (fotosíntesis en plantas y algas). Ribosoma (síntesis de proteínas). Aparato de Golgi (empaquetamiento y secreción). Lisosoma (digestión intracelular). Retículo endoplásmico rugoso (transporte de proteínas) y liso (síntesis de lípidos).',
              keyIdea: 'Procariotas (bacterias) NO tienen núcleo ni mitocondrias, pero SÍ tienen ribosomas y ADN circular.'
            }
          ],
          deepDive: [
            {
              subtitle: 'Diferencias clave entre ADN y ARN y entre Procariota y Eucariota',
              explanation: 'En el examen suelen comparar ADN vs. ARN por su azúcar pentosa y sus bases nitrogenadas: el ADN tiene azúcar desoxirribosa, doble cadena helicoidal (modelo de Watson y Crick) y bases Adenina-Timina (A-T) y Citocina-Guanina (C-G). El ARN tiene azúcar ribosa, una sola cadena lineal y cambia la Timina por Uracilo (U). Por otra parte, las células vegetales se distinguen de las animales por poseer pared celular de celulosa, cloroplastos y una gran vacuola central.',
              practicalExample: 'Si una pregunta pide la biomolécula formada por cadenas de aminoácidos que actúa como biocatalizador (enzima), la respuesta es Proteína.',
              realWorldCase: 'Los antibióticos como la penicilina atacan la pared celular de peptidoglucano exclusiva de las bacterias (células procariotas) sin dañar las células humanas (eucariotas animales que carecen de pared celular).',
              analogy: 'La célula eucariota es una ciudad amurallada (membrana): el Núcleo es el palacio de gobierno con los planos (ADN), la Mitocondria es la planta eléctrica (ATP), los Ribosomas son las fábricas constructoras (proteínas), el Aparato de Golgi es la oficina de correos y los Lisosomas son el camión de reciclaje.'
            }
          ],
          keyTakeaways: [
            { badge: 'Bases nitrogenadas', text: 'ADN = A, T, C, G (Timina es exclusiva del ADN). ARN = A, U, C, G (Uracilo es exclusivo del ARN).' },
            { badge: 'Vitaminas', text: 'Las vitaminas liposolubles son A, D, E y K; las hidrosolubles son el complejo B y la vitamina C (ácido ascórbico).' }
          ],
          commonMistakes: [
            {
              confusion: 'Pensar que las bacterias (procariotas) no tienen ribosomas ni ADN.',
              whyItHappens: 'Por recordar que "no tienen organelos ni núcleo".',
              howToAvoid: 'Las bacterias carecen de organelos *membranosos* (no tienen núcleo, mitocondria ni Golgi), pero sí tienen ADN libre en el nucleoide y sí tienen ribosomas para fabricar sus proteínas.'
            }
          ],
          workedExamples: [
            {
              title: 'Relación entre organelo y función fisiológica',
              problem: '¿Qué organelos celulares se encargan, respectivamente, de la síntesis de proteínas y de la respiración celular aerobia?',
              steps: [
                'Recordar la función del ribosoma: ensamblar aminoácidos para formar proteínas.',
                'Recordar la función de la mitocondria: realizar el ciclo de Krebs y la cadena respiratoria para producir ATP.'
              ],
              answer: 'Ribosomas y mitocondrias.',
              reasoning: 'Los ribosomas traducen el ARN mensajero en proteínas y las mitocondrias oxidan metabolitos de la glucosa para generar energía (ATP).'
            }
          ],
          assessment: {
            multipleChoice: [
              {
                id: 'bio1-mc1',
                question: '¿Cuál es la base nitrogenada exclusiva del ácido ribonucleico (ARN) que sustituye a la timina del ADN?',
                options: ['Adenina', 'Guanina', 'Citocina', 'Uracilo'],
                correctIndex: 3,
                feedback: 'En el ARN la adenina se aparea con el uracilo (U), el cual reemplaza a la timina (T) presente en el ADN.'
              },
              {
                id: 'bio1-mc2',
                question: 'Las enzimas que aceleran las reacciones metabólicas dentro de los seres vivos son químicamente:',
                options: ['Carbohidratos', 'Lípidos', 'Proteínas', 'Fosfolípidos'],
                correctIndex: 2,
                feedback: 'La gran mayoría de las enzimas son proteínas globulares que disminuyen la energía de activación de las reacciones bioquímicas.'
              }
            ],
            trueFalse: [
              {
                id: 'bio1-tf1',
                statement: 'Según el postulado de origen de Rudolf Virchow, toda célula proviene de otra célula preexistente.',
                answer: true,
                feedback: 'Correcto. Este postulado refutó la generación espontánea a nivel celular.'
              }
            ],
            openReflection: [
              {
                id: 'bio1-or1',
                prompt: 'Menciona las tres estructuras que posee una célula eucariota vegetal pero que están ausentes en una célula eucariota animal.',
                guideAnswer: '1) Pared celular de celulosa, 2) Cloroplastos (para realizar la fotosíntesis) y 3) Vacuola central de gran tamaño.'
              }
            ]
          },
          executiveSummary: {
            synthesis: 'La teoría celular define a la célula como unidad anatómica, fisiológica y de origen. Las biomoléculas (carbohidratos, lípidos, proteínas y ácidos nucleicos) constituyen las células procariotas (bacterias sin núcleo) y eucariotas (con núcleo, mitocondrias, ribosomas y cloroplastos).',
            mustRemember: [
              'Carbohidratos = energía inmediata | Lípidos = reserva y bicapa de fosfolípidos.',
              'Proteínas = cadenas de aminoácidos (enzimas, anticuerpos, hemoglobina).',
              'Mitocondria = Respiración/ATP | Ribosoma = Proteínas | Cloroplasto = Fotosíntesis.',
              'ADN (Desoxirribosa, Timina) vs. ARN (Ribosa, Uracilo).'
            ]
          },
          flashcards: [
            {
              id: 'bio1-fc1',
              front: '¿Cómo se llama el enlace químico que une a los aminoácidos para formar una proteína?',
              back: 'Enlace peptídico.'
            },
            {
              id: 'bio1-fc2',
              front: '¿Qué organelo contiene enzimas hidrolíticas encargadas de la digestión intracelular?',
              back: 'El lisosoma.'
            }
          ]
        }
      },
      {
        id: 'bio-2',
        title: 'Metabolismo celular: fotosíntesis y respiración',
        summary: 'Anabolismo y catabolismo, ATP, fases de la fotosíntesis, glucólisis, fermentación y respiración aerobia.',
        estimatedMinutes: 35,
        relations: {
          prevModuleId: 'bio-1',
          nextModuleId: 'bio-3',
          relatedConcepts: ['Anabolismo y Catabolismo', 'Fotosíntesis', 'Respiración celular y ATP']
        },
        capsule: {
          introduction: {
            overview: 'El metabolismo es el conjunto de reacciones químicas celulares divididas en anabolismo (construcción de moléculas complejas como la fotosíntesis) y catabolismo (degradación para liberar energía ATP como la respiración celular y la fermentación).',
            whyItMatters: 'Distinguir qué ocurre exactamente en la fase luminosa vs. la fase oscura de la fotosíntesis, y cuántos ATP se producen en la glucólisis y la respiración aerobia, es pregunta segura.',
            connectionNote: 'Ocurre dentro de los cloroplastos y mitocondrias estudiados en el Módulo 1 y provee la energía necesaria para la división celular del Módulo 3.'
          },
          fundamentals: [
            {
              term: 'Anabolismo vs. Catabolismo y el ATP',
              category: 'Bioenergética',
              definition: 'Anabolismo: construye moléculas complejas a partir de simples consumiendo energía (endergónico; ej. fotosíntesis y síntesis de proteínas). Catabolismo: degrada moléculas complejas en simples liberando energía (exergónico; ej. respiración celular y digestión). El ATP (adenosín trifosfato) es la moneda energética universal.',
              keyIdea: 'Anabolismo = Construye (ej. Fotosíntesis) | Catabolismo = Degrada (ej. Respiración).'
            },
            {
              term: 'Fotosíntesis (Cloroplasto)',
              category: 'Proceso anabólico',
              definition: '6 CO₂ + 6 H₂O + Luz → C₆H₁₂O₆ (glucosa) + 6 O₂. Fase luminosa (en los tilacoides/grana): capta luz con clorofila, rompe el agua (fotólisis liberando O₂) y forma ATP y NADPH. Fase oscura o Ciclo de Calvin (en el estroma): fija el CO₂ usando el ATP y NADPH para sintetizar glucosa.',
              keyIdea: 'Tilacoide (Luminosa) = Rompe H₂O y libera O₂ | Estroma (Oscura/Calvin) = Fija CO₂ y crea glucosa.'
            },
            {
              term: 'Respiración Celular: Aerobia vs. Anaerobia',
              category: 'Proceso catabólico',
              definition: 'Inicia siempre en el citoplasma con la Glucólisis (1 glucosa → 2 piruvatos + 2 ATP netos). Sin oxígeno (anaerobia) ocurre Fermentación láctica o alcohólica (solo 2 ATP). Con oxígeno (aerobia) entra a la Mitocondria: Ciclo de Krebs (matriz) y Cadena respiratoria / Fosforilación oxidativa (crestas), rindiendo 36 a 38 ATP en total.',
              keyIdea: 'Glucólisis = Citoplasma (2 ATP) | Krebs y Cadena = Mitocondria (hasta 36-38 ATP).'
            }
          ],
          deepDive: [
            {
              subtitle: 'La pregunta trampa favorita del examen: ¿De dónde sale el oxígeno que respiramos?',
              explanation: 'Muchos estudiantes creen que el oxígeno (O₂) liberado en la fotosíntesis proviene del dióxido de carbono (CO₂). En realidad, proviene de la ruptura de la molécula de agua (fotólisis del H₂O) durante la fase luminosa en los tilacoides. Por su parte, los átomos de carbono y oxígeno del CO₂ se utilizan en la fase oscura (Ciclo de Calvin en el estroma) para formar la molécula de glucosa (C₆H₁₂O₆).',
              practicalExample: 'En los músculos humanos sometidos a ejercicio intenso sin suficiente oxígeno ocurre fermentación láctica, acumulando ácido láctico; en las levaduras que producen pan, vino o cerveza ocurre fermentación alcohólica liberando etanol y CO₂.',
              realWorldCase: 'Los productos finales de la fotosíntesis (glucosa y oxígeno) son exactamente los reactivos iniciales de la respiración aerobia, manteniendo el equilibrio de la biosfera.',
              analogy: 'El cloroplasto es un panel solar que carga baterías (glucosa) usando luz; la mitocondria es el motor que quema ese combustible con oxígeno para cargar las pilas portátiles de la célula (ATP).'
            }
          ],
          keyTakeaways: [
            { badge: 'Ubicación exacta en el cloroplasto', text: 'Fase luminosa = Tilacoides (grana). Fase oscura (Ciclo de Calvin) = Estroma.' },
            { badge: 'Ubicación exacta de la respiración', text: 'Glucólisis y fermentación = Citoplasma. Ciclo de Krebs = Matriz mitocondrial. Cadena de transporte de electrones = Crestas mitocondriales.' }
          ],
          commonMistakes: [
            {
              confusion: 'Decir que la glucólisis ocurre dentro de la mitocondria.',
              whyItHappens: 'Porque relacionamos toda la respiración celular con la mitocondria.',
              howToAvoid: 'Recuerda que la glucólisis es la primera etapa universal (tanto para células aerobias como anaerobias sin mitocondrias) y ocurre siempre en el citoplasma (citosol).'
            }
          ],
          workedExamples: [
            {
              title: 'Comparación entre fase luminosa y fase oscura de la fotosíntesis',
              problem: '¿Cuáles son los productos de la fase luminosa de la fotosíntesis que se utilizan inmediatamente después en el Ciclo de Calvin (fase oscura) para fijar el CO₂?',
              steps: [
                'Recordar que en la fase luminosa ocurre la fotólisis del agua (liberando O₂ a la atmósfera) y se almacena energía química.',
                'Identificar las dos moléculas energéticas y reductoras que pasan del tilacoide al estroma: ATP y NADPH.'
              ],
              answer: 'ATP y NADPH (además de liberarse O₂ como subproducto).',
              reasoning: 'El Ciclo de Calvin requiere la energía química del ATP y los hidrógenos/electrones del NADPH producidos en la fase luminosa para reducir el CO₂ a glucosa.'
            }
          ],
          assessment: {
            multipleChoice: [
              {
                id: 'bio2-mc1',
                question: '¿En qué parte del cloroplasto se lleva a cabo la fase oscura (Ciclo de Calvin) de la fotosíntesis?',
                options: [
                  'En las crestas mitocondriales',
                  'En el estroma',
                  'En la membrana de los tilacoides',
                  'En el citoplasma'
                ],
                correctIndex: 1,
                feedback: 'La fase oscura o Ciclo de Calvin ocurre en el estroma del cloroplasto, donde se fija el CO₂ para producir glucosa.'
              },
              {
                id: 'bio2-mc2',
                question: '¿Cuál es la ganancia energética neta de la glucólisis por cada molécula de glucosa degradada en el citoplasma?',
                options: [
                  '2 moléculas de ATP y 2 de ácido pirúvico (piruvato)',
                  '38 moléculas de ATP y 6 de agua',
                  '1 molécula de glucosa y 6 de oxígeno',
                  '36 moléculas de ácido láctico'
                ],
                correctIndex: 0,
                feedback: 'La glucólisis rompe la glucosa (6 carbonos) en 2 moléculas de piruvato (3 carbonos cada una) con una ganancia neta de 2 ATP y 2 NADH.'
              }
            ],
            trueFalse: [
              {
                id: 'bio2-tf1',
                statement: 'El oxígeno liberado a la atmósfera durante la fotosíntesis proviene de la fotólisis de la molécula de agua (H₂O).',
                answer: true,
                feedback: 'Correcto. En la fase luminosa la energía solar rompe la molécula de agua liberando oxígeno gaseoso.'
              }
            ],
            openReflection: [
              {
                id: 'bio2-or1',
                prompt: '¿Por qué la fotosíntesis se clasifica como una vía anabólica y la respiración celular como una vía catabólica?',
                guideAnswer: 'Porque la fotosíntesis construye una molécula compleja (glucosa) a partir de moléculas simples (CO₂ y H₂O) absorbiendo energía; la respiración degrada la glucosa en CO₂ y H₂O liberando energía en forma de ATP.'
              }
            ]
          },
          executiveSummary: {
            synthesis: 'El metabolismo comprende el anabolismo (construcción endergónica, como la fotosíntesis en tilacoides y estroma) y el catabolismo (degradación exergónica, como la glucólisis en el citoplasma y el Ciclo de Krebs/cadena respiratoria en la mitocondria, que genera hasta 36-38 ATP).',
            mustRemember: [
              'Fotosíntesis (Anabolismo): Luminosa en tilacoides (fotólisis de H₂O → O₂, ATP, NADPH) | Oscura en estroma (fija CO₂ → Glucosa).',
              'Respiración (Catabolismo): Glucólisis en citoplasma (2 ATP) | Krebs y cadena en mitocondria (36-38 ATP totales).',
              'Fermentación (anaerobia): Láctica (músculo/bacterias) y Alcohólica (levaduras: etanol + CO₂).'
            ]
          },
          flashcards: [
            {
              id: 'bio2-fc1',
              front: '¿En qué etapa de la respiración aerobia se produce la mayor cantidad de moléculas de ATP?',
              back: 'En la cadena de transporte de electrones (fosforilación oxidativa), ubicada en las crestas mitocondriales.'
            },
            {
              id: 'bio2-fc2',
              front: '¿Qué compuesto de tres carbonos se obtiene al final de la glucólisis?',
              back: 'Dos moléculas de ácido pirúvico (piruvato).'
            }
          ]
        }
      },
      {
        id: 'bio-3',
        title: 'Reproducción celular y mecanismos de la herencia',
        summary: 'Ciclo celular, mitosis, meiosis, leyes de Mendel, genotipo, fenotipo y genética ligada al sexo.',
        estimatedMinutes: 35,
        relations: {
          prevModuleId: 'bio-2',
          nextModuleId: null,
          relatedConcepts: ['Mitosis y Meiosis', 'Leyes de Mendel', 'Genotipo y Fenotipo']
        },
        capsule: {
          introduction: {
            overview: 'La continuidad de la vida depende de la división celular (mitosis para crecimiento y regeneración de tejidos; meiosis para formar gametos con variabilidad genética) y de la transmisión hereditaria de los genes estudiada por Gregor Mendel y la genética moderna.',
            whyItMatters: 'Las fases del ciclo celular (cuándo se duplica el ADN, qué pasa en profase, metafase, anafase y telofase), las diferencias entre mitosis y meiosis, y los cruces mendelianos son reactivos garantizados.',
            connectionNote: 'Conecta la estructura del ADN del Módulo 1 con su duplicación, reparto cromosómico y expresión hereditaria.'
          },
          fundamentals: [
            {
              term: 'Ciclo Celular (Interfase + División M)',
              category: 'Duplicación y reparto',
              definition: 'La Interfase abarca tres etapas: G1 (crecimiento celular), S o Síntesis (duplicación/replicación del ADN) y G2 (preparación final). Después ocurre la división (PMAT): Profase (se condensa la cromatina en cromosomas), Metafase (cromosomas se alinean en el ecuador), Anafase (las cromátidas se separan hacia los polos) y Telofase (reaparecen núcleos y ocurre citocinesis).',
              keyIdea: 'Fase S = Duplicación del ADN | Metafase = Medio (ecuador) | Anafase = Alejarse a los polos.'
            },
            {
              term: 'Mitosis vs. Meiosis',
              category: 'Células somáticas vs. Gametos',
              definition: 'Mitosis: ocurre en células somáticas (del cuerpo), produce 2 células hijas diploides (2n) genéticamente idénticas. Meiosis: ocurre en células germinales para formar gametos (óvulo y espermatozoide), consta de dos divisiones y produce 4 células hijas haploides (n) con variabilidad genética gracias al entrecruzamiento (crossing-over) en la Profase I.',
              keyIdea: 'Mitosis = 2 células diploides (2n) iguales | Meiosis = 4 gametos haploides (n) distintos.'
            },
            {
              term: 'Genética Mendeliana y Postmendeliana',
              category: 'Herencia',
              definition: 'Genotipo (constitución genética: AA homocigoto dominante, aa homocigoto recesivo, Aa heterocigoto) vs. Fenotipo (rasgo visible). 1ª Ley de Mendel (Uniformidad: AA x aa → 100 % Aa). 2ª Ley (Segregación: Aa x Aa → proporción fenotípica 3:1). 3ª Ley (Transmisión independiente: proporción 9:3:3:1).',
              keyIdea: 'Cromosomas sexuales humanos: XX (mujer) y XY (hombre). Enfermedades ligadas al cromosoma X: hemofilia y daltonismo.'
            }
          ],
          deepDive: [
            {
              subtitle: 'Por qué el entrecruzamiento en la Profase I de la Meiosis es tan preguntado',
              explanation: 'En la Profase I de la meiosis los cromosomas homólogos se aparean (sinapsis) formando tétradas e intercambian fragmentos de ADN en los quiasmas. Este fenómeno —llamado entrecruzamiento o recombinación genética (crossing-over)— es la razón biológica por la cual los hermanos de los mismos padres no son idénticos entre sí y es fuente clave de variabilidad para la evolución.',
              practicalExample: 'Una célula humana somática (2n = 46 cromosomas) que se divide por mitosis origina 2 células de 46 cromosomas cada una; si se divide por meiosis origina 4 gametos de n = 23 cromosomas cada uno.',
              realWorldCase: 'Al unirse en la fecundación un espermatozoide haploide (n = 23) con un óvulo haploide (n = 23), el cigoto recupera el número diploide de la especie humana (2n = 46).',
              analogy: 'La mitosis es una fotocopiadora que saca una copia exacta del manual completo (2n); la meiosis baraja las cartas (recombinación) y reparte la mitad del mazo (n) a cada gameto para que al casarse dos jugadores vuelvan a juntar un mazo completo.'
            }
          ],
          keyTakeaways: [
            { badge: 'Mnemotecnia PMAT', text: 'Profase (Preparación/condensación), Metafase (Mitad/placa ecuatorial), Anafase (Apartarse hacia los polos), Telofase (Terminar en dos núcleos).' },
            { badge: 'Cuadro de Punnett clásico', text: 'Cruzar dos heterocigotos (Aa × Aa) da genotipo 1 AA : 2 Aa : 1 aa (25 %, 50 %, 25 %) y fenotipo 3 dominantes : 1 recesivo (75 % a 25 %).' }
          ],
          commonMistakes: [
            {
              confusion: 'Responder que el ADN se duplica durante la Profase de la mitosis.',
              whyItHappens: 'Porque en la Profase los cromosomas se hacen visibles al microscopio.',
              howToAvoid: 'El ADN se duplica ANTES de iniciar la mitosis, específicamente durante la Fase S (Síntesis) de la Interfase. En la Profase solo se condensa.'
            }
          ],
          workedExamples: [
            {
              title: 'Resolución de un cruce mendeliano (Segunda Ley de Mendel)',
              problem: 'En los chícharos el color amarillo (A) domina sobre el verde (a). Si se cruzan dos plantas heterocigotas (Aa × Aa), ¿qué porcentaje de la descendencia tendrá semillas de color verde?',
              steps: [
                'Plantear las combinaciones posibles de (Aa × Aa): AA, Aa, aA y aa.',
                'Identificar cuáles expresan el fenotipo dominante amarillo (AA, Aa, aA = 3 de 4 = 75 %) y cuál expresa el recesivo verde (aa = 1 de 4 = 25 %).'
              ],
              answer: '25 % (1 de cada 4) tendrá semillas verdes (homocigoto recesivo aa).',
              reasoning: 'Para que un alelo recesivo se manifieste en el fenotipo debe encontrarse en condición homocigota (aa).'
            }
          ],
          assessment: {
            multipleChoice: [
              {
                id: 'bio3-mc1',
                question: '¿En qué fase de la división celular los cromosomas se alinean en el plano ecuatorial de la célula unidos al huso acromático?',
                options: ['Profase', 'Metafase', 'Anafase', 'Interfase'],
                correctIndex: 1,
                feedback: 'En la Metafase los cromosomas alcanzan su máxima condensación y se ubican en el ecuador celular (placa metafásica).'
              },
              {
                id: 'bio3-mc2',
                question: 'Proceso exclusivo de la Profase I de la meiosis en el que los cromosomas homólogos intercambian segmentos de ADN generando variabilidad genética:',
                options: [
                  'Bipartición',
                  'Entrecruzamiento (recombinación genética)',
                  'Replicación en fase S',
                  'Citocinesis'
                ],
                correctIndex: 1,
                feedback: 'El entrecruzamiento (crossing-over) ocurre durante la Profase I de la meiosis y produce nuevas combinaciones alélicas.'
              }
            ],
            trueFalse: [
              {
                id: 'bio3-tf1',
                statement: 'La replicación o duplicación del ADN ocurre durante la fase S de la interfase celular.',
                answer: true,
                feedback: 'Correcto. La fase S (Síntesis) duplica el material genético antes de que inicie la mitosis o la meiosis.'
              }
            ],
            openReflection: [
              {
                id: 'bio3-or1',
                prompt: '¿Por qué enfermedades recesivas ligadas al cromosoma X como el daltonismo y la hemofilia son más frecuentes en hombres que en mujeres?',
                guideAnswer: 'Porque el hombre solo tiene un cromosoma X (XY); basta con que herede un solo alelo recesivo en su cromosoma X para manifestar la condición, mientras que la mujer (XX) necesitaría heredar el alelo recesivo en ambos cromosomas X.'
              }
            ]
          },
          executiveSummary: {
            synthesis: 'El ADN se duplica en la fase S de la interfase. La mitosis produce 2 células somáticas diploides (2n) idénticas y la meiosis produce 4 gametos haploides (n) con variabilidad por el entrecruzamiento en Profase I. Las leyes de Mendel explican la transmisión de alelos dominantes y recesivos entre genotipo y fenotipo.',
            mustRemember: [
              'Interfase: G1 -> S (duplica ADN) -> G2 | División: Profase, Metafase (ecuador), Anafase (polos), Telofase.',
              'Mitosis = 2 células 2n iguales | Meiosis = 4 gametos n con variabilidad (Profase I: entrecruzamiento).',
              'Cruce Aa × Aa = 75 % dominante (3) y 25 % recesivo (1).'
            ]
          },
          flashcards: [
            {
              id: 'bio3-fc1',
              front: '¿Cuántas células hijas y con qué carga cromosómica produce la meiosis?',
              back: 'Produce 4 células hijas haploides (n) genéticamente diferentes entre sí.'
            },
            {
              id: 'bio3-fc2',
              front: '¿Qué diferencia hay entre genotipo y fenotipo?',
              back: 'El genotipo es la constitución genética interna (alelos AA, Aa o aa); el fenotipo es la expresión observable de esos genes en interacción con el ambiente.'
            }
          ]
        }
      }
    ]
  },

  /* ==========================================================================
     MATERIA 6: GEOGRAFÍA
     ========================================================================== */
  {
    id: 'geografia',
    code: 'GEO',
    name: 'Geografía',
    area: 'Ciencias Sociales y de la Tierra',
    description: 'Coordenadas, husos horarios, tectónica de placas, climas, ríos, población y economía.',
    modules: [
      {
        id: 'geo-1',
        title: 'La Tierra, coordenadas, husos horarios y tectónica global',
        summary: 'Principios metodológicos, latitud, longitud, cálculo de husos horarios y placas tectónicas.',
        estimatedMinutes: 30,
        relations: {
          prevModuleId: null,
          nextModuleId: 'geo-2',
          relatedConcepts: ['Principios de la Geografía', 'Husos horarios', 'Placas tectónicas']
        },
        capsule: {
          introduction: {
            overview: 'La Geografía estudia el espacio geográfico donde interactúan los componentes naturales, sociales y económicos. En este primer módulo dominarás sus principios metodológicos, el sistema de coordenadas, el cálculo de husos horarios y la dinámica interna de la corteza terrestre (tectónica de placas).',
            whyItMatters: 'Todos los exámenes de la UNAM incluyen un problema práctico de husos horarios, una pregunta sobre principios geográficos (causalidad, relación, localización) y una sobre las placas tectónicas de México.',
            connectionNote: 'El relieve formado por las placas tectónicas determina la dirección de los ríos y los climas que estudiarás en el Módulo 2.'
          },
          fundamentals: [
            {
              term: 'Principios Metodológicos (Emmanuel de Martonne)',
              category: 'Metodología geográfica',
              definition: 'Localización/Extensión (¿dónde ocurre?), Causalidad (¿por qué ocurre / qué lo origina?), Relación (¿cómo se conecta con otros fenómenos físicos o humanos?) y Evolución/Temporalidad (¿cómo cambia a través del tiempo?).',
              keyIdea: 'Origen del fenómeno = Causalidad | Vínculo entre dos fenómenos = Relación.'
            },
            {
              term: 'Coordenadas y Husos Horarios',
              category: 'Orientación terrestre',
              definition: 'Paralelos (círculos horizontales como el Ecuador 0° y los Trópicos) miden la Latitud (Norte o Sur, 0° a 90°). Meridianos (semicírculos verticales como Greenwich 0°) miden la Longitud (Este u Oeste, 0° a 180°). Cada huso horario mide 15° de longitud (1 hora).',
              keyIdea: 'Si vas hacia el Este (derecha) SUMAS horas; si vas hacia el Oeste (izquierda) RESTAS horas.'
            },
            {
              term: 'Tectónica de Placas y Relieve de México',
              category: 'Dinámica interna',
              definition: 'Límites divergentes (separación, dorsales oceánicas), convergentes o de subducción (choque de placas: generan fosas, sismos y plegamientos/volcanes) y transformantes (deslizamiento lateral, ej. Falla de San Andrés en Baja California).',
              keyIdea: 'En el sur y centro de México los sismos y el Sistema Volcánico Transversal se deben a la subducción de la Placa de Cocos bajo la Placa Norteamericana.'
            }
          ],
          deepDive: [
            {
              subtitle: 'Método en 3 pasos para resolver cualquier problema de Husos Horarios sin fallar',
              explanation: '1) Calcula la distancia en grados entre las dos ciudades: si ambas están en el mismo hemisferio (ej. las dos al Oeste o las dos al Este), RESTA sus grados; si una está al Oeste y otra al Este (cruzan Greenwich 0°), SUMA sus grados. 2) Divide el total de grados entre 15 para saber cuántas horas de diferencia hay. 3) Si la ciudad que te preguntan está más al Este (hacia la derecha), SUMA esas horas a la hora inicial; si está más al Oeste (hacia la izquierda), RÉSTALAS.',
              practicalExample: 'Si en Londres (0°) son las 14:00 horas, ¿qué hora es en la Ciudad de México (90° Oeste)? Diferencia = 90° / 15° = 6 horas. Como México está al Oeste de Londres, restamos 6 horas: 14:00 - 6 = 08:00 horas.',
              realWorldCase: 'La Falla de San Andrés es un límite transformante entre la Placa del Pacífico y la Placa Norteamericana que está separando gradualmente la península de Baja California del resto del país.',
              analogy: 'La Tierra gira de Oeste a Este: por eso el Sol "amanece primero" en el Este (Japón y Europa van horas adelante) y más tarde en el Oeste (América va horas atrás).'
            }
          ],
          keyTakeaways: [
            { badge: 'Rotación vs. Traslación', text: 'Rotación (24 h): sucesión del día y la noche, desviación de vientos y corrientes (efecto Coriolis), diferencia de horas. Traslación (365 días y 6 h): las cuatro estaciones del año, solsticios y equinoccios.' },
            { badge: 'Placas de México', text: 'Placa de Cocos + Placa Norteamericana = Sismos en Guerrero, Oaxaca, Michoacán y CDMX. Placa del Pacífico + Norteamericana = Sismos en Baja California.' }
          ],
          commonMistakes: [
            {
              confusion: 'Decir que los paralelos miden la longitud y los meridianos la latitud.',
              whyItHappens: 'Porque el Ecuador es una línea "larga" horizontal y confunde con la palabra "longitud".',
              howToAvoid: 'Asocia "ParaLelos = Latitud" (ambas tienen L destacada y se miden respecto al Ecuador) y "Meridianos = Longitud" (respecto a Greenwich).'
            }
          ],
          workedExamples: [
            {
              title: 'Cálculo de husos horarios entre hemisferios distintos',
              problem: 'Si en la ciudad de Atenas (30° Este) son las 20:00 horas del martes, ¿qué hora es en la ciudad de Nueva York (75° Oeste)?',
              steps: [
                'Como una ciudad está al Este (30° E) y la otra al Oeste (75° W), sumamos los grados para cruzar el meridiano 0°: 30° + 75° = 105°.',
                'Dividimos entre 15° por hora: 105 / 15 = 7 horas de diferencia.',
                'Como Nueva York está al Oeste de Atenas, restamos 7 horas: 20:00 - 7 h = 13:00 horas del martes.'
              ],
              answer: '13:00 horas del martes.',
              reasoning: 'Al desplazarnos de 30° E hasta 75° W recorremos 7 husos horarios hacia el oeste, por lo que se restan 7 horas.'
            }
          ],
          assessment: {
            multipleChoice: [
              {
                id: 'geo1-mc1',
                question: '¿A qué principio metodológico de la Geografía corresponde investigar el origen del vulcanismo en el centro de México a partir de la subducción tectónica?',
                options: ['Localización', 'Distribución', 'Causalidad', 'Evolución'],
                correctIndex: 2,
                feedback: 'El principio de causalidad explica las causas o factores que dan origen a un hecho o fenómeno geográfico.'
              },
              {
                id: 'geo1-mc2',
                question: 'La intensa sismicidad en las costas de Guerrero, Oaxaca y Chiapas se debe al contacto convergente entre la Placa Norteamericana y la:',
                options: [
                  'Placa Euroasiática',
                  'Placa de Cocos',
                  'Placa de Nazca',
                  'Placa Africana'
                ],
                correctIndex: 1,
                feedback: 'La subducción de la Placa de Cocos por debajo de la Placa Norteamericana en la Trinchera Mesoamericana genera los sismos del sur y centro de México.'
              }
            ],
            trueFalse: [
              {
                id: 'geo1-tf1',
                statement: 'El movimiento de traslación terrestre, junto con la inclinación del eje de la Tierra, origina las cuatro estaciones del año.',
                answer: true,
                feedback: 'Correcto. El recorrido orbital alrededor del Sol y la inclinación de 23° 27’ producen los equinoccios y solsticios.'
              }
            ],
            openReflection: [
              {
                id: 'geo1-or1',
                prompt: '¿Qué diferencia existe entre un hecho geográfico y un fenómeno geográfico?',
                guideAnswer: 'Un hecho geográfico es estable y cambia muy lentamente a escala humana (una cordillera, un océano); un fenómeno geográfico es un cambio brusco, rápido y de corta duración (un sismo, un huracán, una erupción volcánica).'
              }
            ]
          },
          executiveSummary: {
            synthesis: 'La Geografía analiza el espacio mediante localización, causalidad, relación y evolución. Los paralelos dan la latitud y los meridianos la longitud y los husos horarios (15° = 1 h, sumando al Este y restando al Oeste). En México la subducción de la Placa de Cocos bajo la Norteamericana explica la sismicidad y el vulcanismo del centro-sur.',
            mustRemember: [
              'Paralelos = Latitud (N/S) | Meridianos = Longitud (E/W) y Husos horarios (15° = 1 h).',
              'Hacia el Este se suman horas; hacia el Oeste se restan.',
              'Subducción de la Placa de Cocos = Sismos y Sistema Volcánico Transversal en México.'
            ]
          },
          flashcards: [
            {
              id: 'geo1-fc1',
              front: '¿Cuántos grados de longitud equivale cada huso horario (1 hora)?',
              back: '15° de longitud (resultado de dividir 360° de la circunferencia terrestre entre 24 horas).'
            },
            {
              id: 'geo1-fc2',
              front: '¿Qué tipo de movimiento de placas tectónicas originó la Falla de San Andrés en Baja California?',
              back: 'Un límite transformante (deslizamiento lateral entre la Placa del Pacífico y la Norteamericana).'
            }
          ]
        }
      },
      {
        id: 'geo-2',
        title: 'Aguas, climas y regiones naturales',
        summary: 'Ciclo hidrológico, ríos de México, clasificación climática de Köppen y regiones naturales.',
        estimatedMinutes: 30,
        relations: {
          prevModuleId: 'geo-1',
          nextModuleId: 'geo-3',
          relatedConcepts: ['Ríos y vertientes de México', 'Clasificación de Köppen', 'Regiones naturales']
        },
        capsule: {
          introduction: {
            overview: 'La distribución del agua (océanos y ríos), los climas y las regiones naturales de la Tierra están estrechamente vinculados con la latitud y el relieve. En este módulo aprenderás a identificar las vertientes de los ríos de México y la clasificación climática de Wilhelm Köppen.',
            whyItMatters: 'Relacionar las letras de Köppen (A, B, C, D, E) con su vegetación y fauna, o ubicar en qué vertiente desembocan los principales ríos de México, aparece en cada examen.',
            connectionNote: 'La disponibilidad de agua y el tipo de clima determinan dónde se concentra la población y qué actividades económicas se practican (Módulo 3).'
          },
          fundamentals: [
            {
              term: 'Vertientes e Hidrología de México',
              category: 'Aguas continentales',
              definition: 'Vertiente del Golfo de México (Atlántico): ríos caudalosos por lluvias abundantes (Bravo, Pánuco, Papaloapan, Coatzacoalcos, Grijalva-Usumacinta). Vertiente del Pacífico: ríos más cortos y de fuerte pendiente, útiles para riego e hidroeléctricas (Colorado, Yaqui, Fuerte, Lerma-Santiago, Balsas, Suchiate). Vertiente Interior (endorreica): ríos que no llegan al mar (Nazas y Aguanaval en la Comarca Lagunera).',
              keyIdea: 'Grijalva-Usumacinta = Mayor caudal y energía hidroeléctrica (Chiapas/Tabasco).'
            },
            {
              term: 'Clasificación Climática de Köppen (Letras A, B, C, D, E)',
              category: 'Climatología',
              definition: 'A = Tropical lluvioso (Af lluvias todo el año → selva; Aw lluvias en verano → sabana/bosque tropical). B = Seco (BS estepario; BW desértico → xerófitas/cactáceas). C = Templado (Cf lluvias todo el año; Cw lluvias en verano; Cs mediterráneo lluvias en invierno → bosque mixto/coníferas). D = Frío (Df → taiga). E = Polar (ET tundra; EF hielos perpetuos).',
              keyIdea: 'f = lluvias todo el año | w = lluvias en verano | s = lluvias en invierno | x = lluvias escasas.'
            },
            {
              term: 'Regiones Naturales y Biodiversidad',
              category: 'Biogeografía',
              definition: 'Cada clima modela una región natural: Af → Selva (maderas preciosas como caoba y cedro rojo); Cw/Cf/Df → Bosque (coníferas para papel y celulosa); BS/BW → Estepa y Desierto (norte de México y península de Baja California). México es un país megadiverso por su ubicación entre las zonas neártica y neotropical y su relieve montañoso.',
              keyIdea: 'En México el clima Cs (templado con lluvias en invierno) solo se localiza en el noroeste de Baja California (Tijuana/Ensenada).'
            }
          ],
          deepDive: [
            {
              subtitle: 'Cómo traducir cualquier clave climática de Köppen en 5 segundos',
              explanation: 'Combina la primera letra mayúscula (temperatura) con la segunda letra (régimen de lluvias): por ejemplo, "Af" significa Tropical (A) con lluvias todo el año (f), típico de la selva lacandona en Chiapas y Tabasco. "Cw" significa Templado (C) con lluvias en verano (w), el clima predominante en el Valle de México y el Eje Neovolcánico. "BW" significa Seco Desértico, predominante en Sonora, Chihuahua y Baja California.',
              practicalExample: 'El sistema fluvial Lerma-Santiago nace en el Estado de México (río Lerma), desemboca en el Lago de Chapala (el más grande de México, en Jalisco) y continúa como río Santiago hasta el Océano Pacífico en Nayarit.',
              realWorldCase: 'Las grandes presas hidroeléctricas de México (Chicoasén, Malpaso y La Angostura) se construyeron sobre el río Grijalva en Chiapas gracias a su enorme caudal alimentado por el clima tropical lluvioso (Af y Am).',
              analogy: 'La primera letra de Köppen (A, B, C, D, E) sube del Ecuador a los Polos como los pisos de un edificio térmico: planta baja calurosa (A), piso seco (B), piso templado (C), piso frío (D) y azotea congelada (E).'
            }
          ],
          keyTakeaways: [
            { badge: 'Ríos fronterizos de México', text: 'Frontera norte (con EE. UU.): Río Bravo y Río Colorado. Frontera sur (con Guatemala y Belice): Río Suchiate, Río Usumacinta y Río Hondo.' },
            { badge: 'Capa de la atmósfera donde ocurre el clima', text: 'Todos los fenómenos meteorológicos (lluvia, nubes, huracanes, viento) ocurren en la capa más baja de la atmósfera: la Troposfera.' }
          ],
          commonMistakes: [
            {
              confusion: 'Confundir los elementos del clima con los factores que lo modifican.',
              whyItHappens: 'Por ser términos cotidianos muy cercanos.',
              howToAvoid: 'Elementos (se miden con aparatos): temperatura, presión, viento, humedad y precipitación. Factores (modifican a los elementos por la geografía del lugar): latitud, altitud, relieve y corrientes marinas.'
            }
          ],
          workedExamples: [
            {
              title: 'Identificación de región natural a partir del clima',
              problem: '¿Qué región natural corresponde al clima Af (tropical con lluvias todo el año) y por qué actividad económica forestal destaca en el sureste de México?',
              steps: [
                'Asociar la clave Af: ecuatorial o tropical húmedo con precipitaciones constantes.',
                'Vincularla con la Selva Húmeda (bosque tropical perennifolio) de Chiapas, Tabasco y sur de Veracruz, de donde se extraen maderas preciosas.'
              ],
              answer: 'La selva tropical, destacada por la extracción de maderas preciosas como caoba y cedro rojo.',
              reasoning: 'El calor y la humedad permanentes favorecen árboles de gran altura y maderas finas.'
            }
          ],
          assessment: {
            multipleChoice: [
              {
                id: 'geo2-mc1',
                question: 'De acuerdo con la clasificación de Köppen, ¿qué clave corresponde al clima templado con lluvias en verano que predomina en el centro de México (Sistema Volcánico Transversal)?',
                options: ['Af', 'BW', 'Cw', 'ET'],
                correctIndex: 2,
                feedback: 'La letra C indica clima templado y la minúscula w indica régimen de lluvias en verano.'
              },
              {
                id: 'geo2-mc2',
                question: 'Ríos mexicanos que pertenecen a la vertiente interior (endorreica) y riegan la región agrícola de la Comarca Lagunera entre Durango y Coahuila:',
                options: [
                  'Grijalva y Usumacinta',
                  'Nazas y Aguanaval',
                  'Pánuco y Papaloapan',
                  'Balsas y Suchiate'
                ],
                correctIndex: 1,
                feedback: 'Los ríos Nazas y Aguanaval no desembocan en el mar, sino en cuencas cerradas del norte del país.'
              }
            ],
            trueFalse: [
              {
                id: 'geo2-tf1',
                statement: 'Los ríos Usumacinta, Suchiate y Hondo sirven como límites fronterizos naturales en el sur de México.',
                answer: true,
                feedback: 'Correcto. Los ríos Suchiate y Usumacinta marcan parte de la frontera con Guatemala y el río Hondo con Belice.'
              }
            ],
            openReflection: [
              {
                id: 'geo2-or1',
                prompt: '¿Por qué la Ciudad de México tiene un clima templado (Cw) a pesar de ubicarse en una latitud intertropical donde correspondería un clima cálido?',
                guideAnswer: 'Por el factor geográfico de la altitud (más de 2,240 metros sobre el nivel del mar): a mayor altitud sobre el relieve montañoso, menor temperatura.'
              }
            ]
          },
          executiveSummary: {
            synthesis: 'Los ríos de México se dividen en vertiente del Golfo (caudalosos: Bravo, Papaloapan, Grijalva-Usumacinta), del Pacífico (Lerma-Santiago, Balsas, Yaqui) e Interior (Nazas, Aguanaval). La clasificación de Köppen (A tropical, B seco, C templado, D frío, E polar) explica la distribución de selvas, desiertos, bosques y tundras.',
            mustRemember: [
              'Köppen: A (Tropical), B (Seco: BS estepa, BW desierto), C (Templado), D (Frío/Taiga), E (Polar/Tundra).',
              'Lluvias: f (todo el año), w (verano), s (invierno).',
              'Frontera Norte: Bravo y Colorado | Frontera Sur: Suchiate, Usumacinta y Hondo.'
            ]
          },
          flashcards: [
            {
              id: 'geo2-fc1',
              front: '¿En qué capa de la atmósfera se producen las lluvias, huracanes y demás fenómenos meteorológicos?',
              back: 'En la Troposfera (la capa más baja en contacto con la superficie terrestre).'
            },
            {
              id: 'geo2-fc2',
              front: '¿Qué vegetación caracteriza a las regiones de clima seco desértico (BW) del norte de México?',
              back: 'Vegetación xerófita (cactáceas, matorrales espinosos y agaves adaptados a la escasez de agua).'
            }
          ]
        }
      },
      {
        id: 'geo-3',
        title: 'Población, economía y organización política',
        summary: 'Indicadores demográficos, migración, sectores económicos, bloques comerciales y división política.',
        estimatedMinutes: 30,
        relations: {
          prevModuleId: 'geo-2',
          nextModuleId: null,
          relatedConcepts: ['Indicadores socioeconómicos', 'Sectores económicos en México', 'Bloques comerciales']
        },
        capsule: {
          introduction: {
            overview: 'La Geografía Humana y Económica analiza el crecimiento y distribución de la población, las causas y consecuencias de la migración, las actividades primarias, secundarias y terciarias en México y la integración del mundo en bloques económicos.',
            whyItMatters: 'Ubicar dónde se produce petróleo, minerales, manufacturas y turismo en México, diferenciar países desarrollados de subdesarrollados y conocer los bloques comerciales representa el cierre de Geografía en el examen.',
            connectionNote: 'Integra el medio físico del Módulo 1 y Módulo 2 con la globalización estudiada en el Módulo 4 de Historia Universal.'
          },
          fundamentals: [
            {
              term: 'Demografía y Migración',
              category: 'Población',
              definition: 'Los países desarrollados tienen baja natalidad, población envejecida (pirámide regresiva) y son receptores de inmigrantes; los países en desarrollo tienen mayor crecimiento demográfico y son emisores de emigrantes. En México la población se concentra en la zona centro (Eje Neovolcánico) y migra del campo a la ciudad y hacia Estados Unidos.',
              keyIdea: 'Consecuencia para el país emisor: entrada de remesas y pérdida de mano de obra joven.'
            },
            {
              term: 'Sectores Económicos en México',
              category: 'Geografía económica',
              definition: 'Primario (agricultura, ganadería, pesca en Baja California/Sonora/Sinaloa, minería de plata en Zacatecas, cobre en Sonora, hierro en Michoacán/Colima y carbón en Coahuila). Secundario (extracción petrolera en Sonda de Campeche y Tabasco; petroquímica en Veracruz; siderurgia en Monterrey/Lázaro Cárdenas; maquiladora en la frontera norte y automotriz en el Bajío/Puebla). Terciario (comercio, finanzas y turismo).',
              keyIdea: 'Sonda de Campeche = Petróleo | Coahuila = Carbón | Sonora = Cobre | Zacatecas = Plata.'
            },
            {
              term: 'Indicadores (PIB e IDH) y Bloques Económicos',
              category: 'Economía global',
              definition: 'El IDH (Índice de Desarrollo Humano) mide tres variables: esperanza de vida (salud), nivel educativo (alfabetización/escolaridad) y PIB per cápita (ingreso). Los tres grandes bloques comerciales son: América del Norte (T-MEC: EE. UU., Canadá y México), Unión Europea (Alemania, Francia, etc.) y Asia-Pacífico (Japón y China).',
              keyIdea: 'IDH = Salud + Educación + Ingreso per cápita.'
            }
          ],
          deepDive: [
            {
              subtitle: 'Mapa económico de México para responder reactivos de localización sin dudar',
              explanation: 'Memoriza estas cinco asociaciones clave del territorio mexicano: 1) Petróleo y gas natural: plataforma marina de la Sonda de Campeche, Tabasco y Veracruz. 2) Industria maquiladora: ciudades fronterizas del norte (Tijuana, Ciudad Juárez, Reynosa, Matamoros) por su cercanía a EE. UU. 3) Pesca de camarón, sardina y atún: Golfo de California y Pacífico Norte (Sonora, Sinaloa, Baja California). 4) Ganadería bovina extensiva: Veracruz, Jalisco y norte del país. 5) Puertos comerciales de altura: Manzanillo y Lázaro Cárdenas (en el Pacífico) y Veracruz y Altamira (en el Golfo).',
              practicalExample: 'Si te preguntan en qué estados se localiza la principal cuenca productora de carbón mineral para la industria siderúrgica en México, la respuesta es Coahuila (cuenca de Sabinas).',
              realWorldCase: 'Las remesas enviadas por los trabajadores mexicanos desde Estados Unidos (principalmente desde California y Texas) constituyen una de las principales fuentes de divisas de la economía mexicana.',
              analogy: 'El sector primario extrae el ingrediente de la naturaleza; el sector secundario lo transforma en una fábrica; el sector terciario lo transporta, lo vende y ofrece servicios a las personas.'
            }
          ],
          keyTakeaways: [
            { badge: 'Límites marítimos de México (Art. 27)', text: 'El Mar Territorial mide 12 millas náuticas (soberanía plena) y la Zona Económica Exclusiva (mar patrimonial) mide 200 millas náuticas (soberanía para explorar y explotar recursos pesqueros y petroleros).' },
            { badge: 'Países que integran la península de Yucatán y el sureste', text: 'En preguntas de división política de México, ten presente la ubicación de Aguascalientes, Tlaxcala, Morelos, Colima, Querétaro, Tabasco y Campeche en el mapa.' }
          ],
          commonMistakes: [
            {
              confusion: 'Clasificar la extracción de petróleo o la generación eléctrica en el sector primario.',
              whyItHappens: 'Por pensar que al extraerse del subsuelo es igual a la agricultura.',
              howToAvoid: 'En los cuestionarios del INEGI y de la UNAM, la industria extractiva petrolera, la petroquímica, la electricidad y la construcción se agrupan dentro del Sector Secundario (Industrial).'
            }
          ],
          workedExamples: [
            {
              title: 'Regiones económicas y recursos estratégicos de México',
              problem: '¿Cuál es la región marítima de México donde se obtiene la mayor producción de petróleo crudo e hidrocarburos?',
              steps: [
                'Ubicar la costa del Golfo de México en el sureste del país.',
                'Identificar la plataforma continental frente a las costas de Campeche y Tabasco.'
              ],
              answer: 'La Sonda de Campeche (en el Golfo de México).',
              reasoning: 'De los yacimientos marinos de la Sonda de Campeche y el litoral de Tabasco proviene la mayor proporción de barriles de crudo en México.'
            }
          ],
          assessment: {
            multipleChoice: [
              {
                id: 'geo3-mc1',
                question: '¿Cuáles son los tres indicadores básicos que utiliza la ONU para calcular el Índice de Desarrollo Humano (IDH) de un país?',
                options: [
                  'Natalidad, mortalidad infantil y extensión territorial',
                  'Esperanza de vida, nivel educativo e ingreso (PIB) per cápita',
                  'Exportación petrolera, deuda externa y balanza comercial',
                  'Población absoluta, densidad demográfica y migración'
                ],
                correctIndex: 1,
                feedback: 'El IDH combina salud (esperanza de vida al nacer), educación (años de escolaridad) y nivel de vida digno (ingreso per cápita).'
              },
              {
                id: 'geo3-mc2',
                question: '¿En qué zona de México se concentra principalmente la industria maquiladora de exportación?',
                options: [
                  'En la península de Yucatán',
                  'En las ciudades de la frontera norte (Tijuana, Ciudad Juárez, Reynosa)',
                  'En la costa de Oaxaca y Guerrero',
                  'En la depresión del río Balsas'
                ],
                correctIndex: 1,
                feedback: 'La franja fronteriza del norte concentra las plantas maquiladoras por su vecindad geográfica y logística con el mercado de Estados Unidos.'
              }
            ],
            trueFalse: [
              {
                id: 'geo3-tf1',
                statement: 'La Zona Económica Exclusiva de México comprende una franja marítima de 200 millas náuticas medidas a partir de la línea de base de la costa.',
                answer: true,
                feedback: 'Correcto. En esas 200 millas náuticas la nación ejerce derechos de soberanía sobre los recursos pesqueros, minerales y energéticos.'
              }
            ],
            openReflection: [
              {
                id: 'geo3-or1',
                prompt: 'Menciona una consecuencia demográfica o económica para las zonas rurales de México que expulsan migrantes y una para las grandes ciudades receptoras.',
                guideAnswer: 'En el campo emisor: envejecimiento poblacional, abandono de tierras agrícolas y recepción de remesas. En la ciudad receptora: crecimiento de cinturones periféricos, mayor demanda de vivienda, transporte, agua y servicios públicos.'
              }
            ]
          },
          executiveSummary: {
            synthesis: 'La población de México se concentra en el centro y migra hacia las urbes y EE. UU. Económicamente destacan la pesca en el noroeste, la minería (plata en Zacatecas, cobre en Sonora, carbón en Coahuila), el petróleo en la Sonda de Campeche, las maquiladoras en la frontera norte y el comercio en el T-MEC. El bienestar se mide con el IDH (salud, educación e ingreso).',
            mustRemember: [
              'IDH = Esperanza de vida + Educación + PIB per cápita.',
              'Petróleo = Sonda de Campeche y Tabasco | Carbón = Coahuila | Cobre = Sonora | Plata = Zacatecas.',
              'Maquiladoras = Frontera Norte | Puertos clave = Manzanillo, Lázaro Cárdenas, Veracruz.',
              'Mar Territorial = 12 millas náuticas | Zona Económica Exclusiva = 200 millas náuticas.'
            ]
          },
          flashcards: [
            {
              id: 'geo3-fc1',
              front: '¿Qué entidad federativa de México ocupa el primer lugar nacional en producción de carbón mineral?',
              back: 'Coahuila (región carbonífera de Sabinas).'
            },
            {
              id: 'geo3-fc2',
              front: '¿Cuáles son los principales puertos comerciales de altura en la costa del Pacífico mexicano para el comercio con Asia?',
              back: 'Manzanillo (Colima) y Lázaro Cárdenas (Michoacán).'
            }
          ]
        }
      }
    ]
  }
];
