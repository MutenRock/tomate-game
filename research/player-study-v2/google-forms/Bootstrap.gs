/**
 * Charge les 51 questions depuis les deux fichiers de définition.
 *
 * Ce fichier est séparé afin d'éviter de dépendre de l'ordre de chargement
 * des constantes globales entre les fichiers Google Apps Script.
 */
function getPlayerStudySections_() {
  return [
    ...getStudySections01_25_(),
    ...getStudySections26_51_()
  ];
}
