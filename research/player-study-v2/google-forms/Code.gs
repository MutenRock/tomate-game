/**
 * Tomate ! — Étude joueurs V2
 *
 * Ajouter également Questions_01_25.gs et Questions_26_51.gs au même projet
 * Google Apps Script avant d'exécuter createPlayerStudyQuestionnaire().
 */

const STUDY_CONFIG = Object.freeze({
  formTitle: 'Étude joueurs — Multijoueur social et chaotique',
  spreadsheetTitle: 'Réponses — Étude joueurs multijoueur social et chaotique',
  description: [
    'Nous étudions les attentes des joueurs concernant les jeux multijoueurs centrés sur la coopération, la communication, les rôles différents et les situations imprévues.',
    '',
    'Ce questionnaire est anonyme, ne demande aucune information personnelle sensible et prend environ 10 à 15 minutes.',
    '',
    'Il n’est pas nécessaire d’être un grand joueur ou d’avoir l’habitude des jeux compétitifs pour participer.'
  ].join('\n'),
  confirmationMessage: 'Merci pour votre participation. Vos réponses aideront à prioriser les prochaines décisions de conception et les futurs playtests.',
  version: '2.0.0'
});

const PRIORITY_QUESTIONS = new Set([15, 22, 23, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 43, 46, 47, 48]);
const STUDY_SECTIONS = [...STUDY_SECTIONS_01_25, ...STUDY_SECTIONS_26_51];

function createPlayerStudyQuestionnaire() {
  validateQuestionnaireDefinition_();

  const spreadsheet = SpreadsheetApp.create(STUDY_CONFIG.spreadsheetTitle);
  prepareAnalysisWorkbook_(spreadsheet);

  const form = FormApp.create(STUDY_CONFIG.formTitle);
  form
    .setDescription(STUDY_CONFIG.description)
    .setCollectEmail(false)
    .setProgressBar(true)
    .setShuffleQuestions(false)
    .setAllowResponseEdits(false)
    .setLimitOneResponsePerUser(false)
    .setConfirmationMessage(STUDY_CONFIG.confirmationMessage);

  STUDY_SECTIONS.forEach((studySection, sectionIndex) => {
    const page = form.addPageBreakItem().setTitle(studySection.title);
    if (sectionIndex === 0) {
      page.setHelpText('Les réponses libres et les informations personnelles facultatives peuvent être laissées vides.');
    }
    studySection.questions.forEach((question) => addQuestionToForm_(form, question));
  });

  form.addSectionHeaderItem()
    .setTitle('Merci pour votre participation')
    .setHelpText('Vos réponses serviront à identifier les mécaniques les plus attirantes, les principaux freins et les formats de partie adaptés aux différents groupes de joueurs.');

  // Important : la destination est définie en dernier. Aucun onglet n'est
  // modifié après cette ligne, notamment l'onglet protégé des réponses Forms.
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());

  const links = {
    version: STUDY_CONFIG.version,
    formId: form.getId(),
    spreadsheetId: spreadsheet.getId(),
    editUrl: form.getEditUrl(),
    publishedUrl: form.getPublishedUrl(),
    spreadsheetUrl: spreadsheet.getUrl()
  };

  PropertiesService.getScriptProperties().setProperties({
    PLAYER_STUDY_LAST_FORM_ID: links.formId,
    PLAYER_STUDY_LAST_SPREADSHEET_ID: links.spreadsheetId,
    PLAYER_STUDY_LAST_EDIT_URL: links.editUrl,
    PLAYER_STUDY_LAST_PUBLISHED_URL: links.publishedUrl,
    PLAYER_STUDY_LAST_SPREADSHEET_URL: links.spreadsheetUrl
  }, true);

  logLinks_(links);
  return links;
}

function showLastCreatedLinks() {
  const properties = PropertiesService.getScriptProperties().getProperties();
  const links = {
    editUrl: properties.PLAYER_STUDY_LAST_EDIT_URL || 'Non disponible',
    publishedUrl: properties.PLAYER_STUDY_LAST_PUBLISHED_URL || 'Non disponible',
    spreadsheetUrl: properties.PLAYER_STUDY_LAST_SPREADSHEET_URL || 'Non disponible'
  };
  logLinks_(links);
  return links;
}

function validateQuestionnaireDefinition() {
  const result = validateQuestionnaireDefinition_();
  Logger.log('Questionnaire valide : %s questions dans %s sections.', result.questionCount, result.sectionCount);
  return result;
}

function addQuestionToForm_(form, question) {
  let item;

  switch (question.type) {
    case 'text':
      item = form.addTextItem();
      break;
    case 'paragraph':
      item = form.addParagraphTextItem();
      break;
    case 'mc':
      item = form.addMultipleChoiceItem().setChoiceValues(question.options);
      if (question.other) item.showOtherOption(true);
      break;
    case 'checkbox':
      item = form.addCheckboxItem().setChoiceValues(question.options);
      if (question.other) item.showOtherOption(true);
      if (question.maxSelections) {
        const validation = FormApp.createCheckboxValidation()
          .requireSelectAtMost(question.maxSelections)
          .setHelpText(question.help || `Sélectionnez ${question.maxSelections} réponses maximum.`)
          .build();
        item.setValidation(validation);
      }
      break;
    case 'grid':
      item = form.addGridItem()
        .setRows(question.rows)
        .setColumns(question.columns);
      break;
    case 'scale':
      item = form.addScaleItem()
        .setBounds(question.min, question.max)
        .setLabels(question.leftLabel, question.rightLabel);
      break;
    default:
      throw new Error(`Type de question non pris en charge : ${question.type}`);
  }

  item.setTitle(`${question.id}. ${question.title}`);
  item.setRequired(question.required !== false);
  if (question.help && question.type !== 'checkbox') item.setHelpText(question.help);
  return item;
}

function prepareAnalysisWorkbook_(spreadsheet) {
  // Cette feuille existe avant la liaison à Google Forms : elle peut donc être
  // mise en forme sans risquer de modifier l'onglet de réponses protégé.
  const guide = spreadsheet.getSheets()[0];
  guide.setName('Guide d’analyse');
  guide.clear();

  const guideRows = [
    ['ÉTUDE JOUEURS V2 — GUIDE D’ANALYSE', ''],
    ['Version', STUDY_CONFIG.version],
    ['Objectif', 'Orienter les décisions de design : groupes, rôles, chaos, lecture, interface, rejouabilité et modèle commercial.'],
    ['Durée cible', '10 à 15 minutes.'],
    ['Questions prioritaires', '15, 22, 23, 29 à 38, 43, 46, 47 et 48.'],
    ['Signal fort', 'Moyenne ≥ 4/5 et moins de 20 % de réponses négatives.'],
    ['Idée à prototyper', 'Moyenne entre 3,3 et 3,9, ou forte différence entre segments.'],
    ['Signal risqué', 'Moyenne < 2,7/5 ou frein fréquemment cité.'],
    ['Segments essentiels', 'Taille du groupe, vocal, confort de lecture, improvisation, rôle exposé/soutien et chaos recherché.'],
    ['Attention', 'Les préférences déclarées ne remplacent pas les playtests observés.'],
    ['Vie privée', 'La collecte d’e-mail est désactivée. Ne pas demander d’informations personnelles supplémentaires sans mettre à jour l’introduction.']
  ];

  guide.getRange(1, 1, guideRows.length, 2).setValues(guideRows);
  guide.getRange('A1:B1').merge()
    .setFontWeight('bold')
    .setFontSize(14)
    .setBackground('#8F1F1F')
    .setFontColor('#FFFFFF');
  guide.getRange(2, 1, guideRows.length - 1, 1)
    .setFontWeight('bold')
    .setBackground('#F5E9E2');
  guide.getRange(1, 1, guideRows.length, 2)
    .setWrap(true)
    .setVerticalAlignment('top');
  guide.setColumnWidth(1, 190);
  guide.setColumnWidth(2, 650);
  guide.setFrozenRows(1);

  const codebook = spreadsheet.insertSheet('Dictionnaire des questions');
  const rows = [['ID', 'Section', 'Question', 'Type', 'Obligatoire', 'Prioritaire']];
  STUDY_SECTIONS.forEach((studySection) => {
    studySection.questions.forEach((question) => {
      rows.push([
        question.id,
        studySection.title,
        question.title,
        question.type,
        question.required === false ? 'Non' : 'Oui',
        PRIORITY_QUESTIONS.has(question.id) ? 'Oui' : 'Non'
      ]);
    });
  });

  codebook.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
  codebook.getRange(1, 1, 1, rows[0].length)
    .setFontWeight('bold')
    .setBackground('#8F1F1F')
    .setFontColor('#FFFFFF');
  codebook.getRange(1, 1, rows.length, rows[0].length)
    .setWrap(true)
    .setVerticalAlignment('top');
  [55, 230, 580, 100, 100, 100].forEach((width, index) => codebook.setColumnWidth(index + 1, width));
  codebook.setFrozenRows(1);
}

function validateQuestionnaireDefinition_() {
  const questions = STUDY_SECTIONS.flatMap((studySection) => studySection.questions);
  const ids = questions.map((question) => question.id);

  if (questions.length !== 51) {
    throw new Error(`Le questionnaire doit contenir 51 questions, mais ${questions.length} ont été trouvées.`);
  }
  if (new Set(ids).size !== questions.length) {
    throw new Error('Deux questions utilisent le même identifiant.');
  }

  questions.forEach((question, index) => {
    const expectedId = index + 1;
    if (question.id !== expectedId) {
      throw new Error(`Numérotation incorrecte : la position ${expectedId} contient l’identifiant ${question.id}.`);
    }
    if (!question.title || !question.type) throw new Error(`Question ${question.id} incomplète.`);
    if (['mc', 'checkbox'].includes(question.type) && (!question.options || question.options.length < 2)) {
      throw new Error(`Question ${question.id} : au moins deux options sont nécessaires.`);
    }
    if (question.type === 'grid' && (!question.rows?.length || !question.columns?.length)) {
      throw new Error(`Question ${question.id} : grille incomplète.`);
    }
    if (question.maxSelections && question.maxSelections > question.options.length) {
      throw new Error(`Question ${question.id} : limite supérieure au nombre d’options.`);
    }
  });

  return { questionCount: questions.length, sectionCount: STUDY_SECTIONS.length };
}

function logLinks_(links) {
  Logger.log('--- Étude joueurs V2 ---');
  Logger.log('Édition du formulaire : %s', links.editUrl || 'Non disponible');
  Logger.log('Formulaire public : %s', links.publishedUrl || 'Non disponible');
  Logger.log('Classeur de réponses : %s', links.spreadsheetUrl || 'Non disponible');
}

function section(title, questions) { return { title, questions }; }
function text(id, title, required = true, help = '') { return { id, title, type: 'text', required, help }; }
function paragraph(id, title, required = true, help = '') { return { id, title, type: 'paragraph', required, help }; }
function mc(id, title, options, required = true, other = false, help = '') {
  return { id, title, type: 'mc', options, required, other, help };
}
function checkbox(id, title, options, required = true, maxSelections = null, help = '', other = false) {
  return { id, title, type: 'checkbox', options, required, maxSelections, help, other };
}
function grid(id, title, rows, columns, required = true, help = '') {
  return { id, title, type: 'grid', rows, columns, required, help };
}
function scale(id, title, min, max, leftLabel, rightLabel, required = true, help = '') {
  return { id, title, type: 'scale', min, max, leftLabel, rightLabel, required, help };
}
